import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  if (token === `Bearer ${adminPass}`) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

app.post('/api/auth', (req, res) => {
  const { password } = req.body;
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  if (password === adminPass) {
    res.json({ success: true, token: adminPass });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// API to serve portfolio data
app.get('/api/portfolio-data', async (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data.json');
    const fileContents = await fs.readFile(dataPath, 'utf-8');
    const data = JSON.parse(fileContents);
    res.json(data);
  } catch (error) {
    console.error('Error reading data:', error);
    res.status(500).json({ error: 'Failed to read portfolio data' });
  }
});

// API to update portfolio data
app.put('/api/portfolio-data', authMiddleware, async (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data.json');
    await fs.writeFile(dataPath, JSON.stringify(req.body, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ error: 'Failed to write portfolio data' });
  }
});

app.get('/api/messages', authMiddleware, async (req, res) => {
  try {
    const messagesPath = path.join(__dirname, 'messages.json');
    const data = await fs.readFile(messagesPath, 'utf-8');
    res.json(JSON.parse(data || '[]'));
  } catch (error) {
    res.json([]);
  }
});

// API to handle contact form submissions
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    const newMessage = {
      id: Date.now().toString(),
      name,
      email,
      message,
      createdAt: new Date().toISOString()
    };

    const messagesPath = path.join(__dirname, 'messages.json');
    
    let messages = [];
    try {
      const messagesData = await fs.readFile(messagesPath, 'utf-8');
      if (messagesData.trim()) {
         messages = JSON.parse(messagesData);
      }
    } catch (readError) {
      // If file doesn't exist or is empty, we just start with an empty array.
      if (readError.code !== 'ENOENT') {
        console.error('Error reading messages file:', readError);
      }
    }

    messages.push(newMessage);
    await fs.writeFile(messagesPath, JSON.stringify(messages, null, 2));

    console.log('New message received from:', email);
    
    // Send Email using Nodemailer
    if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS
        }
      });
      
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER,
        subject: `New Portfolio Message from ${name}`,
        text: `You have received a new message.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        replyTo: email
      };
      
      try {
        await transporter.sendMail(mailOptions);
        console.log('Email notification sent directly');
      } catch (emailErr) {
        console.error('Failed to send email notification:', emailErr);
        return res.status(500).json({ error: 'Failed to send email. Please check your Gmail app password.' });
      }
    } else {
      console.log('Nodemailer skipped: Missing .env credentials');
    }
    
    // Simulate slight delay for realistic UX as before
    setTimeout(() => {
      res.status(200).json({ success: true, message: 'Message sent successfully' });
    }, 1000);

  } catch (error) {
    console.error('Error processing contact form:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Resume download route
app.get('/resume', async (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'data.json');
    const fileContents = await fs.readFile(dataPath, 'utf-8');
    const data = JSON.parse(fileContents);
    const resumeFilename = path.basename(data.personal.resume || 'resume.pdf');
    const resumePath = path.join(__dirname, resumeFilename);
    res.download(resumePath, resumeFilename, (err) => {
      if (err) {
        console.error('Error sending resume:', err);
        res.status(404).json({ error: 'Resume file not found' });
      }
    });
  } catch (error) {
    console.error('Error serving resume:', error);
    res.status(500).json({ error: 'Failed to serve resume' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
