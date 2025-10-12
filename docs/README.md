# TuneTON

Music streaming and NFT marketplace on the TON Blockchain.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 8+ or yarn 1.22+
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/tuneton.git
   cd tuneton
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and fill in the required environment variables.

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run build:prod` - Build for production with optimizations
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests
- `npm run type-check` - Check TypeScript types

## 🛠 Tech Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with PostCSS
- **State Management**: React Context API / Zustand
- **Routing**: React Router v6
- **API Client**: Axios
- **Form Handling**: React Hook Form
- **UI Components**: Radix UI Primitives
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library

## 📁 Project Structure

```
├── src/
│   ├── assets/          # Static assets (images, fonts, etc.)
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Third-party library configurations
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── styles/          # Global styles and Tailwind config
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Root component
│   └── main.tsx         # Application entry point
├── public/              # Public assets
├── .github/             # GitHub configurations
├── .vscode/             # VS Code settings
├── .env.example         # Example environment variables
├── .eslintrc.js         # ESLint configuration
├── .gitignore           # Git ignore file
├── .prettierrc          # Prettier configuration
├── index.html           # HTML template
├── package.json         # Project dependencies
├── postcss.config.js    # PostCSS configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## 🔧 Development

### Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
VITE_APP_ENV=development
VITE_API_URL=your_api_url_here
# Add other environment variables as needed
```

### Code Style

This project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type checking

Run the following commands to ensure code quality:

```bash
# Lint code
npm run lint

# Format code
npm run format

# Check TypeScript types
npm run type-check
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
