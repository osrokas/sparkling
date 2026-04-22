# GitHub Copilot Instructions for This Project

## Project Overview
This project is a Node.js Express server that serves a dashboard and provides reverse proxy routes for Spark (http://localhost:4040) and MLflow (http://localhost:5000) web UIs. It also rewrites HTML for Spark UI integration and removes restrictive headers for embedding.

## Key Files
- server.js: Main Express server, proxy logic, static file serving
- index.html, styles.css, script.js: Dashboard frontend assets
- package.json: Project dependencies and scripts

## Coding Conventions
- Use `const` and `let` (not `var`)
- Prefer arrow functions for callbacks
- Use async/await for asynchronous code
- Always handle errors in async code
- Use single quotes for strings
- End statements with semicolons

## Proxy Details
- `/spark/*` proxies to Spark UI at `http://localhost:4040`, rewrites HTML for correct asset paths, removes frame-blocking headers
- `/mlflow/*` proxies to MLflow UI at `http://localhost:5000`, removes frame-blocking headers
- `/dashboard` and `/dashboard/` redirect to `/`

## Best Practices
- Keep proxy and rewrite logic isolated in helper functions
- Do not expose sensitive headers
- Log proxy errors to the console
- Use environment variables for ports in production

## How to Add a New Proxy Route
1. Use `createProxyMiddleware` in `server.js`
2. Add a new `app.use('/route', createProxyMiddleware(...))` block
3. Remove or rewrite headers as needed
4. Add path rewrites if the target UI expects a different base path

## How to Run
```bash
npm install
node server.js
```

## How to Extend
- Add new static assets to the project root
- Add new routes to `server.js` following the existing pattern
- Update HTML rewrite logic in `rewriteSparkHtml()` if Spark UI changes

## Copilot Usage
- When generating code, follow the conventions above
- For new proxy routes, always include header removal and path rewrite logic
- For new features, update this file with instructions
