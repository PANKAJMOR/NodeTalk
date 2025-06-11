import express from 'express';
import { connectDB } from './lib/db.js';
import { app, server } from './lib/socket.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from "path";

const __dirname = path.resolve();

console.log('Step 1: Starting application setup...');

try {
  // Middleware
  console.log('Step 2: Setting up middleware...');
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(cookieParser());
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
  console.log('Step 3: Middleware setup complete');

  // Test basic route first
  console.log('Step 4: Setting up test route...');
  app.get('/test', (req, res) => {
    res.json({ message: 'Server is working' });
  });
  console.log('Step 5: Test route setup complete');

  // Try importing routes one by one
  console.log('Step 6: Importing auth routes...');
  
  // First, let's try to import without using them
  const authModule = await import('./routes/auth.route.js');
  console.log('Step 7: Auth routes imported successfully');
  
  console.log('Step 8: Importing message routes...');
  const messageModule = await import('./routes/message.route.js');
  console.log('Step 9: Message routes imported successfully');
  
  // Now try registering them
  console.log('Step 10: Registering auth routes...');
  app.use('/api/auth', authModule.default);
  console.log('Step 11: Auth routes registered successfully');
  
  console.log('Step 12: Registering message routes...');
  app.use('/api/messages', messageModule.default);
  console.log('Step 13: Message routes registered successfully');

  if (process.env.NODE_ENV === "production") {
    console.log('Step 14: Setting up production static files...');
    app.use(express.static(path.join(__dirname, "Frontend/dist")));
    console.log('Step 15: Static files setup complete');
    
    console.log('Step 16: Setting up catch-all route...');
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, "Frontend", "dist", "index.html"));
    });
    console.log('Step 17: Catch-all route setup complete');
  }

  console.log('Step 18: Starting server...');
  // Start server
  server.listen(3000, () => {
    console.log('Step 19: Server is running on port 3000');
    connectDB();
  });

} catch (error) {
  console.error('Error occurred at step:', error);
  console.error('Error details:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}
