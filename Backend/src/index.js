import express from 'express';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';
import { app, server } from './lib/socket.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from "path";
const __dirname = path.resolve();

// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

if (process.env.NODE_ENV === "production") {
  // Fixed: Frontend with capital F
  app.use(express.static(path.join(__dirname, "Frontend/dist")));

  // Fixed: More specific catch-all that doesn't interfere with API routes
  app.get("*", (req, res) => {
    // Only serve index.html for non-API routes
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, "Frontend", "dist", "index.html"));
    }
  });
}

// Start server
server.listen(3000, () => {
  console.log('Server is running on port 3000');
  connectDB();
});
