# CVEnhancer - Claude Code Instructions

## Project Overview
Create a modern resume enhancement application called **CVEnhancer** with the tagline: "Upload any resume, download a better one"

## Technical Stack
- **Framework**: React + Vite + TypeScript
- **Styling**: Tailwind CSS (responsive design)
- **Package Manager**: yarn
- **Language**: English

## Code Quality Standards
1. **DRY Principle**: No copy-paste code. Create reusable functions and components
2. **No Comments**: Write clean, self-documenting code instead
3. **Readable Code**: Use descriptive variable and function names
4. **Component-Based**: Break down UI into logical, reusable components

## Application Features

### 1. AI Model Configuration UI
Create a settings/configuration section where users can:

**Provider Selection**: Dropdown or radio buttons to choose AI provider:
- OpenAI
- ChatGPT
- Claude (Anthropic)
- Ollama (local)

**API Key Input**:
- Show API key input field for: OpenAI, ChatGPT, and Claude
- Hide API key field when Ollama is selected
- Securely store API keys (localStorage with encryption or session storage)
- Validate API key format before allowing usage

**Ollama-Specific Options**:
- When Ollama is selected, show model selection dropdown
- List available local Ollama models (e.g., llama2, mistral, codellama, etc.)
- Add endpoint configuration field (default: http://localhost:11434)
- No API key required for Ollama

**UI/UX Considerations**:
- Clear visual indication of selected provider
- Helpful placeholder text for API keys
- Link to provider documentation for obtaining API keys
- Save settings button
- Settings persistence across sessions

### 2. File Upload
- Implement drag-and-drop file upload interface
- Support formats: PDF, DOCX, JPEG, PNG
- Visual feedback for drag-over state
- File validation and error handling

### 3. Resume Enhancement Logic
The application should:
- **Fix**: Correct spelling and grammar errors
- **Improve**: Enhance resume following ATS-optimized rules (see below)
- **Format**: Structure content according to resume_template.html format
- **Preserve**: Keep all original information - DO NOT invent or add skills, achievements, or details not present in user's original resume

### 4. Output Options
After processing, provide two buttons:
- **Download as PDF**: Export formatted resume as PDF file
- **Copy as HTML**: Copy formatted resume HTML to clipboard

## Resume Enhancement Rules (ATS Optimization)

### Content Guidelines
1. **Keywords**: Incorporate relevant keywords from job descriptions
2. **Personal Details**: Include ONLY: name, email, phone, location, LinkedIn profile
3. **Section Headers**: Use standard, clear headers (Experience, Education, Skills, etc.)
4. **Required Sections**: Education, Experience, Skills, Achievements, Projects
5. **Avoid**: Objective statements and unnecessary sections
6. **Highlight**: Emphasize tech stack and important keywords
7. **Format**: Use bullet points instead of long text blocks
8. **Quantify**: Add numbers and metrics to demonstrate achievements
9. **Links**: Include project links, GitHub, coding profile URLs
10. **Quality**: Ensure perfect spelling and grammar

## Implementation Steps

### Phase 1: Project Setup
```bash
yarn create vite cvenhancer --template react
cd cvenhancer
yarn add tailwindcss postcss autoprefixer
yarn add -D @types/node
npx tailwindcss init -p
```

Add necessary dependencies:
- File parsing: `mammoth` (DOCX), `pdf-parse` or `pdfjs-dist` (PDF)
- File generation: `jspdf`, `html2canvas` (PDF export)
- AI SDKs: `openai`, `@anthropic-ai/sdk`, `axios` (for Ollama API calls)

### Phase 2: Component Structure
Create reusable components:
- `AIProviderSettings`: Configuration UI for AI provider and API keys
- `FileUploader`: Drag-and-drop upload component
- `ResumePreview`: Display formatted resume
- `ExportButtons`: Download and copy functionality
- `ProcessingStatus`: Loading/progress indicator

### Phase 3: API Integration
Create service layer for each AI provider:
- `openAIService.ts`: OpenAI API integration
- `claudeService.ts`: Anthropic Claude API integration
- `ollamaService.ts`: Local Ollama API integration
- `aiServiceFactory.ts`: Factory pattern to select appropriate service

### Phase 4: Core Functionality
1. Parse uploaded file and extract text
2. Validate AI configuration (provider + API key/model)
3. Send extracted content to selected LLM with enhancement instructions
4. Format enhanced content according to template
5. Render preview
6. Implement export functionality

### Phase 5: Styling
- Mobile-first responsive design
- Clean, professional UI
- Smooth transitions and animations
- Accessible color scheme
- Settings panel with clear visual hierarchy

## AI Provider API Endpoints

### OpenAI
- Endpoint: `https://api.openai.com/v1/chat/completions`
- Models: gpt-4, gpt-3.5-turbo

### Claude (Anthropic)
- Endpoint: `https://api.anthropic.com/v1/messages`
- Models: claude-3-opus, claude-3-sonnet

### Ollama
- Endpoint: `http://localhost:11434/api/generate` or `/api/chat`
- Models: User's locally installed models (fetch from `/api/tags`)

## Important Notes
- The file `resume_template.html` should contain the target resume format template
- Store API keys securely (never commit to version control)
- Add .env.example file with placeholder for API keys
- Ensure all processing happens securely
- Add proper error handling for:
	- Invalid API keys
	- Network failures
	- File parsing failures
	- Ollama connection issues
- Validate file sizes and types before processing
- Show clear progress indicators during processing
- Add retry logic for failed API calls

## Success Criteria
- ✅ AI provider selection UI with proper configuration
- ✅ API key management for cloud providers
- ✅ Ollama integration without API key requirement
- ✅ Beautiful, responsive UI
- ✅ Smooth drag-and-drop experience
- ✅ Accurate file parsing for all supported formats
- ✅ Resume enhancement following all 10 ATS rules
- ✅ Clean, formatted output matching template
- ✅ Working PDF download and HTML copy
- ✅ No code duplication
- ✅ No comments in code
- ✅ English language throughout

