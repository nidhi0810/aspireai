# Contributing to AspireAI

Thank you for your interest in contributing to AspireAI! We welcome contributions from everyone.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/aspireai.git
   cd aspireai
   ```
3. **Create a new branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🛠️ Development Setup

1. **Install dependencies**:
   ```bash
   # Server dependencies
   cd server && npm install
   
   # Client dependencies
   cd ../client && npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp server/.env.example server/.env
   # Edit server/.env with your values
   ```

3. **Start development servers**:
   ```bash
   # Terminal 1: Backend
   cd server && npm run dev
   
   # Terminal 2: Frontend
   cd client && npm start
   ```

## 📝 Code Style Guidelines

### JavaScript/React
- Use **functional components** with hooks
- Follow **ES6+** syntax
- Use **camelCase** for variables and functions
- Use **PascalCase** for components
- Add **JSDoc comments** for complex functions

### CSS/Styling
- Use **Tailwind CSS** classes
- Follow **mobile-first** responsive design
- Use **semantic class names**
- Maintain **consistent spacing**

### Backend
- Use **async/await** instead of callbacks
- Add proper **error handling**
- Include **input validation**
- Write **descriptive API responses**

## 🧪 Testing

- Write tests for new features
- Ensure existing tests pass
- Test on multiple browsers
- Verify mobile responsiveness

## 📋 Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new functionality
3. **Ensure code follows** style guidelines
4. **Write clear commit messages**:
   ```
   feat: add wellness goal tracking
   fix: resolve authentication bug
   docs: update API documentation
   ```

5. **Create a pull request** with:
   - Clear title and description
   - Screenshots for UI changes
   - Link to related issues

## 🐛 Bug Reports

When reporting bugs, please include:
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Browser/OS information**
- **Screenshots** if applicable

## 💡 Feature Requests

For new features:
- **Describe the problem** it solves
- **Explain the proposed solution**
- **Consider alternative approaches**
- **Discuss potential impact**

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and ideas
- **Code Review**: We'll provide feedback on PRs

## 🏆 Recognition

Contributors will be:
- **Listed in README** acknowledgments
- **Mentioned in release notes**
- **Invited to join** the core team (for significant contributions)

Thank you for helping make AspireAI better! 🎉