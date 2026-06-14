# Production Readiness Checklist

## 🚀 Performance
- [ ] Implement Route-based Code Splitting (React.lazy).
- [ ] Optimize images and assets.
- [ ] Review Zustand selectors for unnecessary re-renders.
- [ ] Use `React.memo` for expensive components in lists.

## ♿ Accessibility (a11y)
- [ ] Ensure all images have `alt` tags.
- [ ] Check color contrast for dark/light modes.
- [ ] Add `aria-label` to icon-only buttons.
- [ ] Keyboard navigation support for all forms.

## 🛡 Security
- [ ] Sanitize all user inputs before displaying.
- [ ] Implement Rate Limiting (if backend is added).
- [ ] Review LocalStorage data for sensitive information.
- [ ] Content Security Policy (CSP) headers.

## ✅ Validation
- [ ] Integrate `Zod` or `Yup` for form validation.
- [ ] Add server-side validation (if backend is added).
- [ ] Validate IDs and relations before processing.

## 📦 Deployment readiness
- [ ] Configure environment variables (VITE_APP_...).
- [ ] Set up Error Tracking (Sentry / LogRocket).
- [ ] Verify PWA manifest and icons.
- [ ] SEO Meta tags optimized.

## 🧪 Testing
- [ ] Unit tests for Stores and Selectors (Vitest).
- [ ] Component tests for complex forms.
- [ ] End-to-End tests for critical flows (Playwright/Cypress).
