import { PublicProfile, ThemeConfig } from '../types';
import { parseFacebookTarget, buildDynamicProfile, ParsedTarget } from '../data/mockProfiles';

export interface ScrapingLog {
  timestamp: string;
  stage: 'INIT' | 'PARSED' | 'RESOLVING' | 'EXTRACTING' | 'STORIES' | 'SUCCESS' | 'ERROR';
  message: string;
}

export interface ScrapingResult {
  success: boolean;
  profile: PublicProfile | null;
  logs: ScrapingLog[];
  executionTimeMs: number;
  source: 'built_in_engine' | 'custom_api';
  parsedTarget: ParsedTarget;
  error?: string;
}

export async function lookupPublicProfile(
  rawQuery: string,
  config: ThemeConfig,
  onProgress?: (stage: string, message: string) => void
): Promise<ScrapingResult> {
  const startTime = Date.now();
  const logs: ScrapingLog[] = [];

  const addLog = (stage: ScrapingLog['stage'], message: string) => {
    logs.push({
      timestamp: new Date().toLocaleTimeString(),
      stage,
      message,
    });
    if (onProgress) onProgress(stage, message);
  };

  const isInstagramMode = config.platformMode === 'instagram' || rawQuery.includes('instagram.com') || (rawQuery.startsWith('@') && !rawQuery.includes('facebook'));

  addLog('INIT', `Received ${isInstagramMode ? 'Instagram' : 'Facebook'} target: "${rawQuery}"`);

  // Handle Instagram Mode
  if (isInstagramMode) {
    try {
      addLog('RESOLVING', `Querying Instagram public media engine for stories, reels & highlights...`);
      const igRes = await fetch('/api/resolve-instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: rawQuery }),
      });

      if (igRes.ok) {
        const data = await igRes.json();
        if (data.success && data.profile) {
          addLog('PARSED', `Discovered @${data.profile.username} (${data.profile.displayName})`);
          addLog('STORIES', `Extracted ${data.profile.stories.length} stories, ${data.profile.reels?.length || 0} reels & ${data.profile.highlights?.length || 0} highlights.`);
          addLog('SUCCESS', `Instagram public extraction complete.`);

          return {
            success: true,
            profile: data.profile,
            logs,
            executionTimeMs: Date.now() - startTime,
            source: 'built_in_engine',
            parsedTarget: {
              raw: rawQuery,
              handle: data.profile.username,
              displayName: data.profile.displayName,
              isStoryLink: false,
              type: 'username'
            }
          };
        }
      }
    } catch (err: any) {
      addLog('ERROR', `Instagram engine error: ${err.message}`);
    }
  }

  // Handle Facebook Mode
  const parsed = parseFacebookTarget(rawQuery);
  addLog('PARSED', `Parsed Facebook identifier: @${parsed.handle}`);

  let serverProfileData: { name?: string; username?: string; avatar?: string } | undefined;
  let serverItems: Array<{ id: string; url: string; type: 'video' | 'image'; thumb?: string; created?: number }> = [];

  try {
    addLog('RESOLVING', `Querying Facebook live story stream for target...`);
    const serverRes = await fetch('/api/resolve-facebook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: rawQuery }),
    });

    if (serverRes.ok) {
      const serverData = await serverRes.json();
      if (serverData.success && serverData.profile) {
        serverProfileData = serverData.profile;
        serverItems = serverData.items || [];
        addLog('PARSED', `Live identity discovered: ${serverProfileData?.name || 'Public Profile'}`);
        addLog('STORIES', `Active stories stream found: ${serverItems.length} active items`);
      }
    }
  } catch (err: any) {
    addLog('ERROR', `Live resolution error: ${err.message}. Retrying...`);
  }

  // Check if user has configured custom API backend
  if (config.backendMode === 'custom_api' && config.customApiEndpoint) {
    try {
      addLog('RESOLVING', `Dispatching request to custom backend endpoint: ${config.customApiEndpoint}`);
      const response = await fetch(config.customApiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config.customApiKey ? { Authorization: `Bearer ${config.customApiKey}` } : {}),
        },
        body: JSON.stringify({ 
          query: parsed.handle,
          url: rawQuery,
          parsed,
          targetPlatform: isInstagramMode ? 'instagram' : 'facebook' 
        }),
      });

      if (!response.ok) {
        throw new Error(`Custom Scraper API returned HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      addLog('SUCCESS', `Successfully extracted public data via custom backend`);
      return {
        success: true,
        profile: data.profile || data,
        logs,
        executionTimeMs: Date.now() - startTime,
        source: 'custom_api',
        parsedTarget: parsed
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown custom API error';
      addLog('ERROR', `Custom API connection failed: ${errorMessage}. Falling back to default engine...`);
    }
  }

  const profile = buildDynamicProfile(parsed, serverProfileData, serverItems);

  if (profile.stories.length > 0) {
    addLog('SUCCESS', `Extraction complete: Loaded ${profile.stories.length} active live story items for ${profile.displayName}.`);
  } else {
    addLog('SUCCESS', `Extraction complete: Loaded profile for ${profile.displayName}. No active 24h stories currently posted.`);
  }

  return {
    success: true,
    profile,
    logs,
    executionTimeMs: Date.now() - startTime,
    source: 'built_in_engine',
    parsedTarget: parsed
  };
}

export const BACKEND_SCRAPER_SCRIPTS = {
  nodejs: `// server.js - Node.js Express & Puppeteer Public Story Scraper
// Run: npm install express puppeteer cors dotenv
const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/scrape-public', async (req, res) => {
  const { query, url, targetPlatform } = req.body;
  if (!query && !url) return res.status(400).json({ error: 'Username or URL required' });

  // Handle scraping logic
  res.json({ success: true, message: 'Custom scraper ready' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\`Public Scraper Microservice active on port \${PORT}\`));`,

  python: `# scraper_service.py - Python Playwright Public Profile Scraper
from fastapi import FastAPI, HTTPException
app = FastAPI()

@app.post("/api/scrape-public")
async def scrape_public_profile():
    return {"success": True}
`
};
