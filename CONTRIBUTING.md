# Contributing to Click2Connect

First off, thank you for considering contributing to Click2Connect! 🎉

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if possible**
- **Include your environment details** (OS, browser, Node version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any alternative solutions you've considered**

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes
4. Make sure your code lints
5. Issue that pull request!

## Development Process

### Setup Development Environment

```bash
# Clone your fork
git clone https://github.com/yourusername/click2connect.git

# Install dependencies
npm install

# Create .env.local with your test keys
cp .env.example .env.local

# Start development server
npm run dev
```

### Coding Standards

- Use TypeScript
- Follow the existing code style
- Write meaningful commit messages
- Comment your code where necessary
- Keep functions small and focused

### Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests

Example: `feature/add-new-card-design`

## Project Structure

```
click2connect/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── builder/           # Card builder page
│   └── page.tsx           # Home page
├── components/            # React components
├── lib/                   # Utility functions
├── public/                # Static assets
├── types/                 # TypeScript types
└── docs/                  # Documentation
```

## Testing

```bash
# Run tests
npm test

# Run linter
npm run lint

# Build for production
npm run build
```

## Documentation

- Update README.md if you change functionality
- Add JSDoc comments for new functions
- Update relevant .md files in docs/

## Questions?

Feel free to open an issue with your question or contact us at support@click2connect.com

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
