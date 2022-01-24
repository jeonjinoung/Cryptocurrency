const { createProxyMiddleware } = require('http-proxy-middleware');
const HTTP_PORT = process.env.HTTP_PORT || 4000;

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: `http://localhost:${HTTP_PORT}`,
      changeOrigin: true,
      router: {
        '/1' : 'http://localhost:4001',
        '/2' : 'http://localhost:4002', 
        '/3' : 'http://localhost:4003', 
        '/4' : 'http://localhost:4004', 
      }
    })
  );
};