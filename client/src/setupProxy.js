const { createProxyMiddleware } = require('http-proxy-middleware');
const HTTP_PORT = process.env.HTTP_PORT || 4001;

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: `http://localhost:${HTTP_PORT}`,
      changeOrigin: true,
    })
  );
};