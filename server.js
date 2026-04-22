const express = require('express');
const {
  createProxyMiddleware,
  responseInterceptor,
} = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = 3001;
const workspaceRoot = path.join(__dirname);

function removeFrameHeaders(proxyRes) {
  delete proxyRes.headers['x-frame-options'];
  delete proxyRes.headers['content-security-policy'];
}

function rewriteSparkHtml(html) {
  return html
    .replace(/href="\//g, 'href="/spark/')
    .replace(/src="\//g, 'src="/spark/')
    .replace(/action="\//g, 'action="/spark/')
    .replace(/from "\//g, 'from "/spark/')
    .replace(/import "\//g, 'import "/spark/')
    .replace(/from '\//g, "from '/spark/")
    .replace(/import '\//g, "import '/spark/")
    .replace(/setUIRoot\(''\)/g, "setUIRoot('/spark')")
    .replace(/setAppBasePath\(''\)/g, "setAppBasePath('/spark')");
}

function rewriteSqlHtml(html) {
  return html
    .replace(/href="\//g, 'href="/sql/')
    .replace(/src="\//g, 'src="/sql/')
    .replace(/action="\//g, 'action="/sql/')
    .replace(/<base href="\/sql\/sql\/"\s*\/?>/g, '<base href="/sql/">');
}

app.use(express.static(workspaceRoot));

app.get('/dashboard', (req, res) => {
  res.redirect('/');
});

app.get('/dashboard/', (req, res) => {
  res.redirect('/');
});

app.use(
  '/spark',
  createProxyMiddleware({
    target: 'http://localhost:18080',
    changeOrigin: true,
    ws: true,
    pathRewrite: {
      '^/spark/': '',
    },
    selfHandleResponse: true,
    onProxyRes: responseInterceptor(async (responseBuffer, proxyRes) => {
      removeFrameHeaders(proxyRes);

      const contentType = proxyRes.headers['content-type'] || '';

      if (contentType.includes('text/html')) {
        const html = responseBuffer.toString('utf8');
        return rewriteSparkHtml(html);
      }

      return responseBuffer;
    }),
  })
);

app.use(
  '/mlflow',
  createProxyMiddleware({
    target: 'http://localhost:5000',
    changeOrigin: true,
    ws: true,
    pathRewrite: {
      '^/mlflow/': '/',
    },
    onProxyRes(proxyRes) {
      removeFrameHeaders(proxyRes);
    },
  })
);

// Add those headers
// Cross-Origin-Opener-Policy: same-origin
// Cross-Origin-Embedder-Policy: require-corp
app.use(
  '/sql',
  createProxyMiddleware({
    target: 'http://localhost:4213',
    changeOrigin: true,
    ws: true,
    pathRewrite: {
      '^/sql/': '/',
    },
    selfHandleResponse: true,
    onProxyRes: responseInterceptor(async (responseBuffer, proxyRes) => {
      removeFrameHeaders(proxyRes);
      proxyRes.headers['Cross-Origin-Opener-Policy'] = 'same-origin';
      proxyRes.headers['Cross-Origin-Embedder-Policy'] = 'require-corp';

      const contentType = proxyRes.headers['content-type'] || '';

      if (contentType.includes('text/html')) {
        const html = responseBuffer.toString('utf8');
        return rewriteSqlHtml(html);
      }

      return responseBuffer;
    }),
  })
);

app.listen(PORT, () => {
  console.log(`Dashboard: http://localhost:${PORT}/`);
  console.log(`Spark proxy: http://localhost:${PORT}/spark/`);
});
