# 🤝 Contributing to SmartAdX AI ERP

Thank you for your interest in contributing to SmartAdX AI ERP! We welcome contributions from the community.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)

---

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments
- Public or private harassment
- Publishing others' private information
- Other conduct which could reasonably be considered inappropriate

---

## 🚀 Getting Started

### Prerequisites

- Node.js 22.19.0 or higher
- npm or bun
- Git
- Docker (optional)

### Setup Development Environment

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/smartadx-ai-erp.git
cd smartadx-ai-erp

# 3. Add upstream remote
git remote add upstream https://github.com/CCPPIT/smartadx-ai-erp.git

# 4. Install dependencies
npm install

# 5. Setup environment
npm run setup

# 6. Start development server
npm run dev
```

---

## 💻 Development Process

### 1. Create a Branch

```bash
# Update your fork
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### 2. Make Changes

- Write clean, readable code
- Follow the coding standards
- Add tests for new features
- Update documentation

### 3. Commit Changes

We use conventional commits:

```bash
# Format: <type>(<scope>): <subject>

git commit -m "feat(auth): add OAuth login support"
git commit -m "fix(dashboard): resolve chart rendering issue"
git commit -m "docs(api): update authentication endpoints"
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 4. Push Changes

```bash
git push origin feature/your-feature-name
```

---

## 🔄 Pull Request Process

### Before Submitting

1. **Update your branch**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests**
   ```bash
   npm run lint
   npm test
   ```

3. **Update documentation**
   - Update README.md if needed
   - Add/update API documentation
   - Update CHANGELOG.md

### Submitting PR

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill in the PR template:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added new tests
- [ ] Updated existing tests

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Added tests
- [ ] All tests pass
```

### Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged

---

## 📝 Coding Standards

### TypeScript

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  name?: string;
}

async function getUser(id: string): Promise<User> {
  return await prisma.user.findUnique({ where: { id } });
}

// ❌ Bad
function getUser(id) {
  return prisma.user.findUnique({ where: { id } });
}
```

### React Components

```typescript
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

// ❌ Bad
export function Button(props) {
  return <button onClick={props.onClick}>{props.label}</button>;
}
```

### File Naming

- Components: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatDate.ts`)
- Constants: `UPPER_SNAKE_CASE.ts` (e.g., `API_ENDPOINTS.ts`)

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Use trailing commas
- Max line length: 100 characters

```bash
# Format code
npm run format

# Check linting
npm run lint
```

---

## 🧪 Testing

### Writing Tests

```typescript
// Example test
describe('User Authentication', () => {
  it('should login with valid credentials', async () => {
    const response = await login('user@example.com', 'password');
    expect(response.success).toBe(true);
    expect(response.token).toBeDefined();
  });

  it('should reject invalid credentials', async () => {
    const response = await login('user@example.com', 'wrong');
    expect(response.success).toBe(false);
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- user.test.ts

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

---

## 📚 Documentation

### Code Comments

```typescript
/**
 * Authenticate user with email and password
 * @param email - User's email address
 * @param password - User's password
 * @returns Authentication result with token
 * @throws {AuthError} If credentials are invalid
 */
async function login(email: string, password: string): Promise<AuthResult> {
  // Implementation
}
```

### API Documentation

Update `API_DOCUMENTATION.md` for new endpoints:

```markdown
### Create Campaign
Create a new advertising campaign.

**Endpoint:** `POST /api/campaigns`

**Request Body:**
\`\`\`json
{
  "name": "Summer Campaign",
  "budget": 5000
}
\`\`\`

**Response:** `201 Created`
\`\`\`json
{
  "success": true,
  "campaign": { ... }
}
\`\`\`
```

---

## 🐛 Reporting Bugs

### Before Reporting

1. Check existing issues
2. Try latest version
3. Reproduce the bug

### Bug Report Template

```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment:**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 0.1.0]

**Additional context**
Any other information
```

---

## 💡 Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution**
How you'd like it to work

**Describe alternatives**
Other solutions you've considered

**Additional context**
Mockups, examples, etc.
```

---

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in documentation

---

## 📞 Getting Help

- **Documentation**: Check docs folder
- **Discord**: Coming soon
- **Email**: dev@smartadx.ai
- **Issues**: GitHub Issues

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to SmartAdX AI ERP! 🎉**

**Made with ❤️ in Palestine 🇵🇸**
