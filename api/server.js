// Vercel serverless function to handle TanStack Start SSR
import { createServer } from '../dist/server/server.js';

export default async function handler(req, res) {
  try {
    // Import the server entry
    const serverModule = await import('../dist/server/server.js');
    const server = serverModule.default;
    
    // Convert Node.js request to Web Request
    const url = new URL(req.url, `http://${req.headers.host}`);
    const headers = new Headers();
    
    // Copy headers from Node.js request to Web Request
    Object.keys(req.headers).forEach(key => {
      const value = req.headers[key];
      if (value) {
        if (Array.isArray(value)) {
          value.forEach(v => headers.append(key, v));
        } else {
          headers.set(key, value);
        }
      }
    });
    
    const request = new Request(url, {
      method: req.method,
      headers: headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    // Call the server fetch handler
    const response = await server.fetch(request, {}, {});
    
    // Convert Web Response to Node.js response
    res.status(response.status);
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    
    const body = await response.text();
    res.send(body);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send('Internal Server Error');
  }
}
