# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Whetstone Entertainment website - a static single-page site for an Atlanta-based music management company. Features a custom brushed-aluminum media player with glass orb visualizer, ice/frost glass aesthetic, and matrix-style design elements.

## Architecture

**Single HTML file** (`index.html`) containing:
- All CSS in `<style>` tags (no external stylesheets)
- All JavaScript at the bottom in `<script>` tags
- `WhetstoneMediaPlayer` class handles audio playback with Web Audio API visualizer

**Key sections in order:**
1. Navigation (fixed, with scroll behavior)
2. Hero (ice glass 3D text effect)
3. Player Section (custom brushed-metal player with glass orb)
4. About Section
5. Roster/Portfolio (Recent Work cards - matrix background)
6. Services
7. Credits (scrolling artist names)
8. Contact
9. Footer

**Standalone player files** (for prototyping):
- `whetstone-player-demo.html` - Basic version
- `whetstone-player-premium.html` - Full-featured version with all effects

## Development

**Local testing:**
```bash
python3 -m http.server 8080
# Opens http://localhost:8080
```

**Deployment:** Netlify (auto-deploys from GitHub on push to master)

## Key CSS Variables

```css
/* Matrix theme (player section, roster, credits) */
--matrix-green: #00ff41;
--matrix-black: #0a120a;

/* Ice/glass theme (hero, services) */
--ice-deep: #1a3a4a;
--frost-white: #f0f7fa;

/* Player jade accents */
--jade-glow: #7cd987;
--jade-bright: #a8f0b0;
```

## Audio Player (WhetstoneMediaPlayer)

Custom player with local audio files. Current track: **BEAM - Southside (Out Now)**

Features:
- Brushed aluminum body with 3D tilt (10° back, 10° right)
- Green glass orb with audio-reactive gradient blob visualization
- Web Audio API (AudioContext, AnalyserNode) for frequency analysis
- Canvas 2D API for visualizer rendering
- Rotary volume knob with ring indicator + scroll wheel support (1% per tick)
- Playlist drawer with track management
- Pronounced float animation with subtle rotation swing (±16px vertical, ±1° tilt)

The player instantiates on DOMContentLoaded:
```javascript
window.whetstonePlayer = new WhetstoneMediaPlayer();
```

## Assets

- `Song1.mp3` - Demo audio track
- `1.PNG` through `6.PNG`, `IMG_0312.JPG` - Roster card backgrounds
- `whetstone-logo.png` - Company logo
- `favicon-transparent.png` - Site favicon

## Netlify Functions (Legacy)

`netlify/functions/` contains Spotify integration code that is no longer used by the main player. The current player uses local audio files.
