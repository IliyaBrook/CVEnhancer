<div align="center">

# 🚀 CVEnhancer

### Upload any resume, download a better one

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/) [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**AI-powered resume enhancement with support for OpenAI, Claude, and local Ollama models. Transform your resume into a
professional, polished document with optimized content and formatting.**

[Features](https://claude.ai/chat/2d19d016-1275-4fb4-838a-1deb1111ae90#-features) • [Installation](https://claude.ai/chat/2d19d016-1275-4fb4-838a-1deb1111ae90#-installation) • [Usage](https://claude.ai/chat/2d19d016-1275-4fb4-838a-1deb1111ae90#-usage) • [Development](https://claude.ai/chat/2d19d016-1275-4fb4-838a-1deb1111ae90#-development)

![CVEnhancer Application](https://claude.ai/chat/public/app_view_example.png)

</div>

------

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Technologies](#️-technologies)
- [⚙️ Installation & Setup](#️-installation--setup)
- [🎯 Usage](#-usage)
- [⚙️ Resume Settings](#️-resume-settings)
- [💻 Development](#-development)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

------

## ✨ Features

- 📄 **Multi-Format Support**: Upload PDF, DOCX, or TXT files
- 🤖 **Multiple AI Providers**: OpenAI GPT, Anthropic Claude, or 100% local Ollama models
- ⚡ **Real-time Preview**: Instant preview of enhanced resume
- 💾 **Export Options**: Download as PDF or DOCX
- 🎨 **Customizable Settings**: Control job count, bullet points, skills categorization, and more
- 🔄 **Persistent Configuration**: All settings saved to localStorage

------

## 🛠️ Technologies

**Core Stack**: React 19 • TypeScript • Vite 7 • Tailwind CSS 3.4

**AI Integration**: Anthropic SDK • OpenAI API • Ollama REST API

**Document Processing**: @react-pdf/renderer • jsPDF • pdfjs-dist • mammoth • html2canvas

------

## ⚙️ Installation & Setup

### Quick Start

```bash
# Clone and install
git clone https://github.com/IliyaBrook/CVEnhancer.git
cd CVEnhancer
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings (see below)

# Start development server
npm run dev
# Open http://localhost:3000
```

### Environment Configuration

Create `.env` file from `.env.example` and configure:

```bash
# Debug Mode (loads fake data, skips AI calls)
VITE_DEBUG=false

# OpenAI Configuration
VITE_OPENAI_TEMPERATURE=0.7           # Creativity (0.0-2.0)
VITE_OPENAI_TOP_P=0.8                 # Diversity control
VITE_OPENAI_MAX_TOKENS=8192
VITE_OPENAI_FREQUENCY_PENALTY=0.5     # Reduces repetition
VITE_OPENAI_PRESENCE_PENALTY=1.0

# Claude Configuration
VITE_CLAUDE_TEMPERATURE=0.7
VITE_CLAUDE_MAX_TOKENS=8192
VITE_CLAUDE_TOP_P=0.8
VITE_CLAUDE_TOP_K=20

# Ollama Configuration
VITE_OLLAMA_TEMPERATURE=0.3
VITE_OLLAMA_MAX_TOKENS=8192
VITE_OLLAMA_TOP_OP=0.9
VITE_OLLAMA_TOP_K=20
VITE_OLLAMA_REPEAT_PENALTY=1.1
VITE_OLLAMA_PRESENCE_PENALTY=1.5
```

**Recommended temperature by use case:**

- Professional resumes: `0.5-0.7`
- Creative industries: `0.8-0.9`
- Technical/Engineering: `0.3-0.5`

### AI Provider Setup

#### OpenAI / ChatGPT

1. Get API key from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. In app: Select "OpenAI" → Paste key → Save
3. Recommended models: `gpt-4o-2024-08-06`, `gpt-4`, `gpt-3.5-turbo`

#### Anthropic Claude

1. Get API key from [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)
2. In app: Select "Claude" → Paste key → Save
3. Recommended models: `claude-3-5-sonnet-20241022`, `claude-3-opus-20240229`

#### Ollama (Local - No API Key)

1. Install from [ollama.ai](https://ollama.ai/)
2. Pull model: `ollama pull qwen3:8b` or `ollama pull qwen3:4b`
3. In app: Select "Ollama" → Endpoint: `http://localhost:11434` → Choose model
4. Benefits: Free, private, offline (requires GPU for good performance)

## 🔒 Security Notice

### API Keys Storage

**IMPORTANT:** CVEnhancer stores your AI provider settings, including API keys, in your browser's **localStorage**.

#### What This Means:

- ✅ **Your API keys are stored locally** in your browser, not on any server
- ✅ **No data is transmitted to CVEnhancer servers** - all processing happens client-side or directly with AI providers
- ⚠️ **API keys are stored in plain text** in localStorage
- ⚠️ **Anyone with access to your browser** can potentially view stored keys
- ⚠️ **Keys persist** until you manually clear them or clear browser data

------

## 🎯 Usage

1. **Select AI Provider** → Enter API key (except Ollama) → Save Settings
2. **Upload Resume** (PDF/DOCX/TXT)
3. **Wait for AI Enhancement** (10-30 seconds)
4. **Customize Settings** (optional - click ⚙️ icon)
5. **Download** as PDF or DOCX

------

## ⚙️ Resume Settings

Access via ⚙️ button to customize enhancement parameters:

### Experience Settings

| Setting           | Description                    | Default      |
|-------------------|--------------------------------|--------------|
| Max Jobs          | Number of positions to include | 2 (1-10)     |
| Bullet Points     | Achievements per job           | 5 (1-10)     |
| Max Bullet Length | Character limit per point      | None         |
| Action Verbs      | Require strong action verbs    | ✓            |
| Metrics Level     | Emphasis on numbers            | Moderate     |
| Avoid Duplicates  | Prevent similar achievements   | ✓            |
| Exclude Jobs      | Job titles to omit             | Configurable |

### Skills Settings

- Max categories (with customizable skills per category)
- Automatic categorization and prioritization

### Education Settings

- Max entries count
- Date visibility toggle
- Exclude specific education items

------

## 💻 Development

### Scripts

```bash
npm run dev       # Development server (localhost:3000)
npm run build     # Production build
npm run lint      # ESLint check
npm run format:check  # Prettier check
npm run preview   # Preview production build
```

### Debug Mode

Set `VITE_DEBUG=true` for rapid development without AI calls:

**Features:**

- Loads sample data from `src/fakeData/json_data/fakeResumeData.json`
- Bypasses file upload and AI processing
- No API keys needed
- Perfect for UI/UX development

**Custom Test Data Workflow:**

1. Generate resume with AI (debug mode OFF)

2. Copy JSON from browser console (`=== Generated Resume Data ===`)

3. Create `src/fakeData/json_data/[name]_private.json`

4. Paste and edit JSON as needed

5. Import in `src/fakeData/fakeResumeData.ts`:
   
   ```typescript
   import myData from './json_data/myResume_private.json';export const fakeResumeData: ResumeData = myData;
   ```

6. Enable debug mode and test

**Why `\*_private.json`?** Files matching this pattern are gitignored to prevent committing personal data.

### Key Architecture Files

| File                                     | Purpose                                               |
|------------------------------------------|-------------------------------------------------------|
| `src/services/aiServiceFactory.ts`       | AI provider implementations, prompts, JSON extraction |
| `src/components/ResumeSettingsModal.tsx` | Settings UI with localStorage sync                    |
| `src/utils/storage.ts`                   | localStorage abstraction layer                        |
| `src/hooks/useAIConfig.ts`               | AI configuration state management                     |
| `src/config/env.ts`                      | Environment variable parsing with validation          |
| `src/fakeData/fakeResumeData.ts`         | Debug mode data management                            |

### Development Tips

1. **AI responses logged to console** - Check DevTools → Console for `=== Generated Resume Data ===`
2. **Use debug mode** to avoid API costs during UI development
3. **Test different providers** with usage-limited API keys
4. **Custom default settings** - Edit `src/config/resume-ai-config.json`
5. **Adding new AI providers** - Modify `src/services/aiServiceFactory.ts` and `src/types/ai.types.ts`

### Project Structure

```
src/
├── components/         # React components
├── services/          # AI service implementations
├── utils/             # Helper functions
├── hooks/             # Custom React hooks
├── config/            # Configuration files
├── fakeData/          # Debug mode data
└── types/             # TypeScript definitions
```

------

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Ensure lint passes: `npm run lint && npm run format:check`
4. Commit with clear messages
5. Push and open Pull Request

**Areas for contribution:**

- 🐛 Bug fixes and issue reports
- ✨ New features (AI providers, export formats)
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- 🔒 Security (encrypted API key storage)
- 🧪 Testing (unit and integration tests)
- 🌍 Internationalization

------

## 📄 License

**Custom MIT License with Commercial Use Restriction**

✅ **Free for**: Personal use, education, open-source, research, portfolios

❌ **Requires permission**: Commercial services, paid products, business revenue generation

**Commercial licensing**: iliyabrook1987@gmail.com

See [LICENSE](https://claude.ai/chat/LICENSE) for full terms.

------

## 👤 Author

**Iliya Brook**

- 📧 Email: [iliyabrook1987@gmail.com](mailto:iliyabrook1987@gmail.com)
- 🐙 GitHub: [@IliyaBrook](https://github.com/IliyaBrook)
- 💼 Portfolio: Check out my other projects on GitHub

------

## 💬 Support

### Getting Help

If you encounter issues or have questions:

1. **📖 Check the Documentation**: Read this README thoroughly
2. **🔍 Search Existing Issues**: Your question might already be answered
3. **🐛 Report a Bug**: [Create a new issue](https://github.com/IliyaBrook/CVEnhancer/issues/new)
4. **💬 Contact the Author**: iliyabrook1987@gmail.com

### When Reporting Issues

Please include:

- **Environment**: OS, Node.js version, browser
- **AI Provider**: Which provider you're using (OpenAI, Claude, Ollama)
- **Steps to Reproduce**: Clear steps to recreate the issue
- **Expected vs Actual Behavior**: What should happen vs what actually happens
- **Error Messages**: Any console errors or error messages
- **Screenshots**: If applicable

------

## 🗺️ Roadmap

### Planned Features

- [ ] **Cover letter generation** - AI-powered cover letters
- [ ] **Job description matching** - Tailor resume to specific job postings
- [ ] **Resume templates** - Multiple visual templates to choose from

### ⭐ If you find this project helpful, please consider starring it!

**Made with ❤️ using React, TypeScript, and AI**

*Transform your resume, transform your career*

---

[![GitHub stars](https://img.shields.io/github/stars/IliyaBrook/CVEnhancer?style=social)](https://github.com/IliyaBrook/CVEnhancer/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/IliyaBrook/CVEnhancer?style=social)](https://github.com/IliyaBrook/CVEnhancer/network/members)
[![GitHub issues](https://img.shields.io/github/issues/IliyaBrook/CVEnhancer)](https://github.com/IliyaBrook/CVEnhancer/issues)