# AetherScribe - AI Worldbuilding Assistant

<p align="center">
  <img src="https://raw.githubusercontent.com/google/project-gameface/main/docs/art/aetherscribe-banner.png" alt="AetherScribe Banner" />
</p>

<p align="center">
  <strong>An intelligent, AI-powered worldbuilding assistant designed for writers, game masters, and creators of all kinds.</strong>
  <br />
  AetherScribe transforms simple ideas into richly detailed lore, helping you build immersive worlds with unparalleled speed and creativity.
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"/>
  <img alt="TypeScript" src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img alt="TailwindCSS" src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white"/>
  <img alt="Gemini" src="https://img.shields.io/badge/Gemini_API-4285F4?style=for-the-badge&logo=google&logoColor=white"/>
</p>

## Overview

AetherScribe bridges the gap between a fleeting idea and a fully-realized world. By leveraging the advanced capabilities of Google's Gemini API, it provides a structured yet flexible environment to generate, manage, and refine your creative concepts. Whether you're designing characters for a novel, locations for a TTRPG campaign, or magic systems for a video game, AetherScribe is your dedicated creative partner.

This application uses a standard client-server architecture. The frontend is a modern React application built with Vite, and the backend is a lightweight Express.js server that securely handles API requests. Your work is saved in your browser's local storage, and your API key is kept secure on the server, never exposed to the browser.

## Key Features

-   **🤖 Dual-Mode AI Generation**:
    -   **Standard AI**: Powered by `gemini-2.5-flash` for high-quality, creative content generation.
    -   **PRO AI Mode**: Also powered by `gemini-2.5-flash`, this mode provides superior results through advanced prompt engineering. It dynamically requests a more complex and detailed data structure from the AI (e.g., asking for \`psychological_profile\` and \`key_relationships\` for a character). This results in a structurally richer output, perfect for professional work.
-   **🧠 Context-Aware AI Generation**: The AI understands your world! When you use \`@[Document Name]\` in a prompt, the app automatically fetches the content of that document and injects it as context, leading to more consistent and knowledgeable AI responses.
-   **🔗 Advanced Wiki-Linking & Navigation**:
    -   **Dynamic Linking**: Create links between documents using simple \`@[Document Name]\` syntax.
    -   **Automatic Backlinks**: A "Referenced By" section automatically appears on each document, showing you every other document that links to it for effortless context discovery.
-   **✨ AI-Powered Auto-linking**: Turn document creation into a one-click action. The AI scans your text, intelligently identifies mentions of your other documents, and automatically wraps them in the correct \`@[...]\` link format, effortlessly building your interconnected wiki.
-   **🕸️ Interactive Knowledge Graph**: Visualize the intricate connections between your documents with an interactive graph view. Each document is a node, and each \`@[link]\` is an edge, turning your project into a navigable knowledge map.
-   **📄 File Upload for Prompts**: For complex ideas, bypass the standard input fields and upload a \`.txt\` or \`.md\` file directly. Its entire content will be used as the core prompt for generation.
-   **🎨 AI Image Generation**: A dedicated "Visual" template leverages \`imagen-3.0-generate-002\` to bring your concepts to life, generating character portraits, location art, and more.
-   **💳 Dynamic Token-Based Credit System**:
    -   Manage your API usage with a system that links directly to token consumption.
    -   Costs are calculated dynamically: approximately **1 credit per 1,000 tokens** used for text generation, with a fixed cost of **10 credits** for image generation.
    -   The UI provides helpful warnings when your credits are low and prevents generation when your balance is below a safe threshold.
-   **✨ Thematic Pricing & Credit Packs**: Explore fantasy-themed subscription tiers (Wanderer, Loremaster, Archon) and subscriber-exclusive "Aether Crystal" top-up packs on a dedicated pricing page. (Note: Purchases are cosmetic in this demo version).
-   **🗂️ Project-Based Organization**: Keep your different worlds and stories neatly separated. All documents and custom templates are sandboxed within their respective projects.
-   **🛠️ Robust Template System**:
    -   **Pre-built Templates**: Get started instantly with templates for Characters, Locations, Magic Systems, Organizations, and more.
    -   **Powerful Template Editor**: Create your own custom templates from scratch. Define a name, icon, AI instructions, and custom input fields.
-   **⚙️ Fine-Grained AI Control**: Use the settings panel on any template to:
    -   **Customize System Instructions**: Rewrite the AI's core "personality" and instructions to match your desired tone and style.
    -   **Adjust Creativity (Temperature)**: Dial the AI's creativity from highly focused and logical to wild and imaginative.
-   **💾 Local-First Persistence**: All your projects, documents, and templates are saved directly in your browser's local storage for speed, offline access, and privacy.
-   **📤 Multiple Export Options**: Easily export your text-based work for use in other applications as **Markdown (.md)** or **PDF (.pdf)** files.

---

## How It Works: The Magic Behind the Curtain

AetherScribe employs several advanced techniques to ensure the highest quality AI output, moving far beyond basic prompting.

1.  **Structured JSON Output**: We provide a strict JSON schema (\`responseSchema\`) for each template, forcing the AI to return data in a predictable, structured format. This is how we get consistent sections like "Backstory" and "Motivations" every time.

2.  **Context Injection from Links**: The app scans your prompt for \`@[Document Name]\` tags. Before sending the request, it finds these documents in your project, extracts their content, and prepends it to the main prompt as "crucial context." This makes the AI's output more consistent with your established lore.

3.  **Dynamic Prompt Construction**: The app intelligently combines your inputs from the template form into a detailed, context-rich prompt. It formats the data clearly, allowing the AI to easily understand the core concept and all the specific details you've provided.

4.  **Few-Shot Prompting**: For built-in templates, we provide the AI with 2-3 high-quality examples of the desired output. This technique dramatically improves the consistency and style of the generated content by showing, not just telling, the AI what's expected.

5.  **Dynamic Schema Enhancement**: In **PRO AI** mode, the application dynamically expands the JSON schema sent to the AI, requesting additional, more complex fields. This forces the model to perform a deeper analysis and generate a structurally richer and more detailed response.

---

## Technology Stack

-   **Frontend**: [React](https://reactjs.org/) with TypeScript (using Hooks and Context for state management)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) for a utility-first design system.
-   **AI Engine**: [Google Gemini API](https://ai.google.dev/) (\`gemini-2.5-flash\`, \`imagen-3.0-generate-002\`) via the \`@google/genai\` SDK.
-   **Graph Visualization**: [vis.js Network](https://visjs.github.io/vis-network/docs/network/) for the interactive knowledge graph.
-   **PDF Export**: [jsPDF](https://github.com/parallax/jsPDF) for client-side PDF generation.
-   **Persistence**: Browser LocalStorage API.
-   **Backend**: [Express.js](https://expressjs.com/) for the API proxy server.
-   **Build Tool**: [Vite](https://vitejs.dev/) for a fast and modern development experience.
-   **Persistence**: Browser LocalStorage API.

---

## Getting Started (Local Development)

This project consists of a React frontend and an Express.js backend server.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher recommended) and npm.
-   A Google Gemini API Key. You can get a key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/[YOUR_USERNAME]/[YOUR_REPO_NAME].git
    cd [YOUR_REPO_NAME]
    ```

2.  **Install dependencies:**
    This will install all the necessary packages for both the React frontend and the Express server.
    ```bash
    npm install
    ```

3.  **Set up your environment variables:**
    Create a new file named `.env` in the root of the project directory. This file will hold your secret API key and should not be committed to Git. Add your API key to it like this:
    ```
    # .env
    GEMINI_API_KEY=your_gemini_api_key_here
    ```

4.  **Run the development server:**
    This command starts the Vite dev server for the frontend and the Express backend server concurrently. The frontend will be available at `http://localhost:5173` by default, and it will automatically proxy API requests to the backend.
    ```bash
    npm run dev
    ```

### Building for Production

1.  **Build the application:**
    This command compiles the React application into optimized static files located in the `dist` directory.
    ```bash
    npm run build
    ```

2.  **Start the production server:**
    This command starts the Express server, which will serve the optimized frontend from the `dist` directory.
    ```bash
    npm start
    ```


---

## Project Structure

The codebase is organized to be clean, scalable, and easy to navigate.

```
/
├── components/      # Reusable React components
│   ├── AboutPage.tsx
│   ├── ConfirmModal.tsx
│   ├── ContactPage.tsx
│   ├── GeneratedContent.tsx
│   ├── Generator.tsx
│   ├── GraphView.tsx
│   ├── Header.tsx
│   ├── Loader.tsx
│   ├── PricingPage.tsx
│   ├── ProjectView.tsx
│   ├── SettingsModal.tsx
│   ├── Sidebar.tsx
│   ├── SignInPage.tsx
│   └── TemplateEditor.tsx
├── contexts/        # React Context providers for global state (AppContext.tsx)
├── services/        # Modules for interacting with external APIs (geminiService.ts)
├── App.tsx          # Main application component, view management
├── constants.tsx    # Core application data (default templates, icons)
├── export.ts        # Logic for exporting documents to MD and PDF
├── index.html       # The main HTML entry point with importmap
├── index.tsx        # Application entry point
├── README.md        # This file
└── types.ts         # TypeScript type definitions and interfaces
```

## Contributing

Contributions are welcome! If you have an idea for a new feature or have found a bug, please follow these steps:

1.  **Fork the repository.**
2.  Create a new branch for your feature or bugfix (\`git checkout -b feature/my-amazing-feature\`).
3.  Make your changes and commit them with descriptive messages.
4.  Push your changes to your fork (\`git push origin feature/my-amazing-feature\`).
5.  Open a **Pull Request** back to the main repository, explaining your changes in detail.

## Future Roadmap

While AetherScribe is a powerful tool today, the vision is much larger. The future is focused on evolving it into a comprehensive, collaborative, and indispensable hub for creative worldbuilding.

### Core Experience & Collaboration
-   **☁️ Cloud Sync & User Accounts**:
    -   Move beyond local storage with secure user authentication and cloud storage for projects, documents, and templates.
-   **🤝 Real-time Collaboration**:
    -   Transform projects into shared workspaces where multiple users can create simultaneously.
-   **🔗 Sharing & Permissions**:
    -   Generate shareable links to projects or individual documents with role-based permissions (Viewer, Commenter, Editor).

### Advanced Worldbuilding Tools
-   **🗺️ Interactive Maps & Timelines**:
    -   A dedicated tool for creating and managing historical timelines and interactive world maps.

### Community & Extensibility
-   **🌍 Community Template Library**:
    -   Build a platform for users to share their custom-built templates with the community.
-   **🔌 Plugin & Integration Architecture**:
    -   Develop a plugin system and create official integrations with popular TTRPG platforms (Roll20, Foundry VTT) and writing apps (Scrivener).

## License

This project is licensed under the **MIT License**. See the \`LICENSE\` file for details.