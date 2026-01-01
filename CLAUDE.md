# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Whetstone Entertainment website - a static single-page site for an Atlanta-based music management company. The site features a custom audio player, ice/frost glass aesthetic, and matrix-style design elements.

## Architecture

**Single HTML file** (`index.html`) containing:
- All CSS in `<style>` tags (no external stylesheets)
- All JavaScript at the bottom in `<script>` tags
- VoidPlayer class handles audio playback with Web Audio API visualizer

**Key sections in order:**
1. Navigation (fixed, with scroll behavior)
2. Hero (ice glass 3D text effect)
3. Player Section (custom audio player with holographic border)
4. About Section
5. Roster/Portfolio (Recent Work cards with background images)
6. Services
7. Credits (scrolling artist names)
8. Contact
9. Footer

## Development

**Local testing with audio:**
```bash
cd /Users/jeremystevenson/CodeProjects/Active/whetstoneent
python3 -m http.server 8080
# Open http://localhost:8080
```

Audio files won't play when opened via `file://` protocol due to browser security - must use local server.

**Deployment:** Netlify (auto-deploys from GitHub on push to master)

## Key CSS Variables

```css
--matrix-green: #00ff41;      /* Bright neon green for accents */
--glass-green: rgba(200, 230, 201, 0.3);  /* Frosted glass */
--neon-pink: #ff00ff;         /* Player accents */
--neon-cyan: #00ffff;         /* Player accents */
```

## Assets

- `Song1.mp3` - Preloaded audio track (BEAM - Southside)
- `1.PNG` through `6.PNG`, `IMG_0312.JPG` - Roster card background images
- `whetstone-logo.png` - Company logo

## Audio Player (VoidPlayer)

The player preloads a default playlist on page load. To add/change tracks, modify the DOMContentLoaded handler at the bottom of index.html:

```javascript
window.voidPlayer.playlist = [
    { name: 'TRACK NAME', url: 'filename.mp3' }
];
```
