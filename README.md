# PageSprite

AI-powered static page generator with an annotation-driven canvas workflow.

Draw rectangles on an infinite canvas, describe what you want in each region, and let AI generate the HTML — no chat panel, no context switching.

## How it works

1. **Draw** — use the rect tool to define regions on an infinite canvas
2. **Describe** — type a prompt for each region (e.g. "a sign-up form with email and password fields")
3. **Generate** — AI generates HTML that fills the region, rendered in an embedded iframe
4. **Refine** — draw annotations (arrows, highlights, text notes) on top of generated content to guide revisions

Multiple generation backends are supported:

| Backend | Description |
|---------|-------------|
| **Streaming API** | Built-in OpenAI-compatible API client. Configure endpoint, key, and model in settings. |
| **OpenCode** | CLI-based generation via [OpenCode](https://opencode-ai.com). |
| **Claude Code** | CLI-based generation via [Claude Code](https://claude.ai/code). |
| **Custom** | Any CLI tool with configurable arguments and template. |

## Requirements

- Node.js 20+
- Rust toolchain (for building from source)
- [Tauri 2 system dependencies](https://v2.tauri.app/start/prerequisites/)

## Development

```bash
npm install
npm run tauri:dev    # Launch Tauri dev window with HMR
npm run tauri:build  # Production build (creates platform installer)
```

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Zustand v5, OGL (WebGL)
- **Backend**: Tauri 2, Rust, tokio, reqwest (SSE proxy)
- **AI**: OpenAI-compatible streaming API, CLI agent integration
- **Build**: GitHub Actions CI (macOS, Windows, Linux)
