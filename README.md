# AI 3D Chatbot for Customer Service

This project is an interactive AI-powered 3D chatbot designed to enhance the customer service experience. Built with React, Next.js, Three.js, and Cedar OS, it features a visually engaging 3D avatar that responds to user input, supports voice chat, and integrates with advanced backend agents.

## Features
- **3D Avatar:** Real-time animated character using Three.js and FBX models
- **AI Chatbot:** Natural language conversation powered by Cedar OS and Mastra agents
- **Voice Chat:** ElevenLabs TTS integration for realistic voice responses
- **Customizable UI:** Playful, modern interface with pastel gradients and floating particles
- **Accessibility:** Transcript panel for all AI responses
- **State Management:** Cedar OS for agent state, chat context, and UI control

## Technologies Used
- React & Next.js (frontend)
- Three.js (3D rendering)
- Cedar OS (agent state, chat logic)
- Mastra & Composio (backend AI workflows)
- ElevenLabs (voice synthesis)
- Tailwind CSS (styling)

## Getting Started
1. Clone the repository:
  ```bash
  git clone https://github.com/EHout20/ai_anime_waifu.git
  cd ai_anime_waifu/cedar-hackathon-starter
  ```
2. Install dependencies:
  ```bash
  npm install
  # or
  pnpm install
  ```
3. Set up environment variables in `.env` (see example in repo)
4. Run the development server:
  ```bash
  npm run dev
  ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
- `src/app/` — Main Next.js app and layout
- `src/components/FBXViewer.tsx` — 3D avatar viewer
- `src/components/Transcript.tsx` — Accessibility transcript panel
- `src/cedar/components/chatInput/ChatInput.tsx` — Chat input UI
- `src/backend/` — Mastra backend, agent workflows, API routes

## Customization
- Update 3D models in `public/models/actions/`
- Change chat logic and agent workflows in `src/backend/src/mastra/workflows/`
- Modify UI styles in `src/app/globals.css` and component files

## License
MIT
- Backend API: http://localhost:4111

## Project Architecture

### Frontend (Next.js + Cedar-OS)

- **Simple Chat UI**: See Cedar OS components in action in a pre-configured chat interface
- **Cedar-OS Components**: Cedar-OS Components installed in shadcn style for local changes
- **Tailwind CSS, Typescript, NextJS**: Patterns you're used to in any NextJS project

### Backend (Mastra)

- **Chat Workflow**: Example of a Mastra workflow – a chained sequence of tasks including LLM calls
- **Streaming Utils**: Examples of streaming text, status updates, and objects like tool calls
- **API Routes**: Examples of registering endpoint handlers for interacting with the backend

## API Endpoints (Mastra backend)

### Non-streaming Chat

```bash
POST /chat/execute-function
Content-Type: application/json

{
  "prompt": "Hello, how can you help me?",
  "temperature": 0.7,
  "maxTokens": 1000,
  "systemPrompt": "You are a helpful assistant."
}
```

### Streaming Chat

```bash
POST /chat/execute-function/stream
Content-Type: application/json

{
  "prompt": "Tell me a story",
  "temperature": 0.7
}
```

Returns Server-Sent Events with:

- **JSON Objects**: `{ type: 'stage_update', status: 'update_begin', message: 'Generating response...'}`
- **Text Chunks**: Streamed AI response text
- **Completion**: `event: done` signal

## Development

### Running the Project

```bash
# Start both frontend and backend
npm run dev

# Run frontend only
npm run dev:next

# Run backend only
npm run dev:mastra
```

## Learn More

- [Cedar-OS Documentation](https://docs.cedarcopilot.com/)
- [Mastra Documentation](https://mastra.ai/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## License

MIT License - see LICENSE file for details.
