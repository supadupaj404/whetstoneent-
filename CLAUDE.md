# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Whetstone Entertainment website - a static single-page site for an Atlanta-based music management company. The site features a vintage Winamp-style audio player with Spotify integration, ice/frost glass aesthetic, and matrix-style design elements.

## Architecture

**Single HTML file** (`index.html`) containing:
- All CSS in `<style>` tags (no external stylesheets)
- All JavaScript at the bottom in `<script>` tags
- SpotifyWinampPlayer class handles audio playback with Web Audio API visualizer and 5-band EQ

**Netlify Functions** (`netlify/functions/`):
- `spotify-auth.js` - Client Credentials auth flow for Spotify API
- `spotify-playlist.js` - Fetches playlist tracks with preview URLs

**Key sections in order:**
1. Navigation (fixed, with scroll behavior)
2. Hero (ice glass 3D text effect)
3. Player Section (Winamp-style player with playlist and EQ)
4. About Section
5. Roster/Portfolio (Recent Work cards with background images)
6. Services
7. Credits (scrolling artist names)
8. Contact
9. Footer

## Development

**Local testing with Spotify integration:**
```bash
cd /Users/jeremystevenson/CodeProjects/Active/whetstoneent

# Create .env file with Spotify credentials
cp .env.example .env
# Edit .env with your SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET

# Run with Netlify Dev (required for serverless functions)
netlify dev
# Opens http://localhost:8888
```

**Without Spotify (static only):**
```bash
python3 -m http.server 8080
# Opens http://localhost:8080 (player won't load playlist)
```

**Deployment:** Netlify (auto-deploys from GitHub on push to master)

## Environment Variables

Required in Netlify dashboard or local `.env`:
- `SPOTIFY_CLIENT_ID` - From https://developer.spotify.com/dashboard
- `SPOTIFY_CLIENT_SECRET` - From Spotify Developer dashboard

## Key CSS Variables

```css
--winamp-bg: #1a1a1a;         /* Dark player background */
--winamp-metal: linear-gradient(180deg, #3a3a3a, #2a2a2a, #1a1a1a);
--lcd-green: #00ff00;          /* Classic Winamp LCD green */
--matrix-green: #00ff41;       /* Bright neon green for accents */
--glass-green: rgba(200, 230, 201, 0.3);  /* Frosted glass */
```

## Assets

- `1.PNG` through `6.PNG`, `IMG_0312.JPG` - Roster card background images
- `whetstone-logo.png` - Company logo

## Audio Player (SpotifyWinampPlayer)

The player loads 30-second preview tracks from a Spotify playlist on page load. To change the playlist, modify the playlist ID in the DOMContentLoaded handler:

```javascript
window.spotifyWinampPlayer = new SpotifyWinampPlayer({
    playlistId: '3zppnr6PDKJppbnS3Degif'  // Your Spotify playlist ID
});
```

**Features:**
- Main player with LCD time display and spectrum visualizer
- 5-band graphic equalizer with presets (Rock, Pop, Hip-Hop, etc.)
- Playlist window with shuffle/repeat modes
- Auto-skips tracks without preview URLs (~15-20% of tracks)
