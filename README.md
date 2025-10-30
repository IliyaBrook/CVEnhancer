# CVEnhancer

**Upload any resume, download a better one**

A modern resume enhancement application powered by AI that optimizes resumes following ATS (Applicant Tracking System) best practices.

## Features

- 🤖 Multiple AI Provider Support (OpenAI, Claude, Ollama)
- 📄 Multiple File Format Support (PDF, DOCX, JPEG, PNG)
- 🎨 Beautiful, Responsive UI
- 📥 Drag-and-Drop File Upload
- 📊 Real-time Resume Preview
- 💾 Export as PDF or HTML
- ✅ ATS-Optimized Enhancement
- 🔒 Secure API Key Storage

## Tech Stack

- React + Vite + TypeScript
- Tailwind CSS
- OpenAI API
- Anthropic Claude API
- Ollama (Local AI)
- jsPDF + html2canvas
- pdfjs-dist + mammoth

## Installation

```bash
yarn install
```

## Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Add your API keys to `.env`:
```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
VITE_OLLAMA_ENDPOINT=http://localhost:11434
```

## Development

```bash
yarn dev
```

Open http://localhost:5173 in your browser.

## Build

```bash
yarn build
```

## Usage

1. Configure your AI provider in the settings panel
2. Upload your resume (PDF, DOCX, JPEG, or PNG)
3. Wait for AI processing
4. Review the enhanced resume preview
5. Download as PDF or copy as HTML

## AI Providers

### OpenAI
- Get API key: https://platform.openai.com/api-keys
- Models: gpt-4, gpt-3.5-turbo

### Claude (Anthropic)
- Get API key: https://console.anthropic.com/
- Models: claude-3-opus, claude-3-sonnet

### Ollama (Local)
- Install: https://ollama.ai/
- No API key required
- Run locally on your machine

## Resume Enhancement Rules

The AI enhances resumes following these ATS optimization rules:

1. Incorporates relevant keywords
2. Includes only essential personal details
3. Uses standard section headers
4. Formats with bullet points
5. Quantifies achievements with metrics
6. Emphasizes tech stack
7. Ensures perfect grammar
8. Includes relevant links (GitHub, LinkedIn)
9. Avoids objective statements
10. Maintains professional formatting

## License

MIT