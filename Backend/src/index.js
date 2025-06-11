import express from 'express';
import { connectDB } from './lib/db.js';
import { app, server } from './lib/socket.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from "path";

const __dirname = path.resolve();

console.log('Starting application setup...');

// Middleware
console.log('Setting up middleware...');
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

console.log('Middleware setup complete');

// Import routes with error handling
console.log('Importing auth routes...');
try {
  const authRoutes = await import('./routes/auth.route.js');
  console.log('Auth routes imported successfully');
  app.use('/api/auth', authRoutes.default);
  console.log('Auth routes registered successfully');
} catch (error) {
  console.error('Error with auth routes:', error);
  process.exit(1);
}

console.log('Importing message routes...');
try {
  const messageRoutes = await import('./routes/message.route.js');
  console.log('Message routes imported successfully');
  app.use('/api/messages', messageRoutes.default);
  console.log('Message routes registered successfully');
} catch (error) {
  console.error('Error with message routes:', error);
  process.exit(1);
}

if (process.env.NODE_ENV === "production") {
  console.log('Setting up production static files...');
  app.use(express.static(path.join(__dirname, "Frontend/dist")));
  
  app.get("*", (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, "Frontend", "dist", "index.html"));
    }
  });
  console.log('Production setup complete');
}

console.log('Starting server...');
// Start server
server.listen(3000, () => {
  console.log('Server is running on port 3000');
  connectDB();
});
