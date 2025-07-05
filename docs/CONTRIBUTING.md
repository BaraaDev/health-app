# Contributing to Health App

Thank you for your interest in contributing to Health App! This document provides guidelines and information for contributors.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please read it before contributing.

## How to Contribute

### Reporting Bugs

1. **Check existing issues** to see if the bug has already been reported
2. **Create a new issue** with a clear and descriptive title
3. **Use the bug report template** and provide:
   - Steps to reproduce the bug
   - Expected behavior
   - Actual behavior
   - Screenshots (if applicable)
   - Browser/OS information

### Suggesting Features

1. **Check existing issues** to see if the feature has already been suggested
2. **Create a new issue** with a clear and descriptive title
3. **Use the feature request template** and provide:
   - Description of the feature
   - Use cases and benefits
   - Mockups or examples (if applicable)

### Submitting Code Changes

1. **Fork the repository**
2. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** following the coding standards
4. **Write tests** for new functionality
5. **Update documentation** if needed
6. **Commit your changes** with clear commit messages
7. **Push to your fork** and create a pull request

## Development Setup

### Prerequisites

- Node.js 18+
- MongoDB
- npm or yarn

### Local Development

1. **Clone your fork**:
   ```bash
   git clone https://github.com/yourusername/health-app.git
   cd health-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Run tests**:
   ```bash
   npm test
   ```

## Coding Standards

### TypeScript

- Use strict TypeScript configuration
- Define proper types for all functions and variables
- Avoid using `any` type
- Use interfaces for object shapes

### React/Next.js

- Use functional components with hooks
- Follow React best practices
- Use proper error boundaries
- Implement proper loading states

### Code Style

- Use Prettier for code formatting
- Follow ESLint rules
- Use meaningful variable and function names
- Write clear and concise comments in English only

### Git Commit Messages

Use conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Testing

- Write unit tests for new functionality
- Ensure all tests pass before submitting PR
- Maintain good test coverage
- Use descriptive test names

## Pull Request Guidelines

### Before Submitting

1. **Ensure all tests pass**:
   ```bash
   npm test
   npm run lint
   npm run type-check
   ```

2. **Update documentation** if needed
3. **Add tests** for new functionality
4. **Update CHANGELOG.md** with your changes

### PR Description

Include:
- Description of changes
- Related issue number
- Screenshots (if UI changes)
- Testing instructions
- Breaking changes (if any)

### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Address feedback** and make requested changes
4. **Maintainer approval** required for merge

## Internationalization

When adding new text to the application:

1. **Add translations** to `lib/i18n.ts`
2. **Use translation function** in components:
   ```typescript
   const { t } = useLanguage();
   const message = t('yourTranslationKey');
   ```
3. **Provide both Arabic and English** translations

## Security

- Never commit sensitive information (API keys, passwords)
- Follow security best practices
- Report security vulnerabilities privately
- Use environment variables for configuration

## Questions?

If you have questions about contributing:

1. **Check the documentation** in the README
2. **Search existing issues** for similar questions
3. **Create a new issue** with the question label

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to Health App! 🎉 