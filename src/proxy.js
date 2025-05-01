import { createProxyMiddleware } from 'http-proxy-middleware';

export default function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://crudcrud.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api/761122e8178447edbb259aa232e01156', 
      },
      logLevel: 'debug',
      onProxyRes: (proxyRes) => {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
      }
    })
  );
};