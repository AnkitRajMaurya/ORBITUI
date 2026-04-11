require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

const SITE_NAME = process.env.SITE_NAME || 'OrbitUI';
const SITE_DESCRIPTION = process.env.SITE_DESCRIPTION ||
  'A demo space-tourism frontend showcasing modern UI design, motion, and accessibility.';
const SITE_FEATURES = (process.env.SITE_FEATURES || 'Responsive UI|Accessible interactions|Static-first with optional backend APIs').split('|');
const AUTHOR_NAME = process.env.AUTHOR_NAME || 'Ankit Raj Maurya';
const AUTHOR_LOCATION = process.env.AUTHOR_LOCATION || 'Muzaffarpur, Bihar';
const AUTHOR_ROLE = process.env.AUTHOR_ROLE || 'Full-Stack Developer';

app.use(express.json());

// Serve the static frontend (assumes backend folder is inside project root)
app.use(express.static(path.join(__dirname, '..')));

// Simple about API for the site and author
app.get('/api/about', (req, res) => {
  res.json({
    site: {
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      features: SITE_FEATURES
    },
    author: {
      name: AUTHOR_NAME,
      location: AUTHOR_LOCATION,
      role: AUTHOR_ROLE
    }
  });
});

// Simple contact endpoint (demo only - logs to console)
app.post('/api/contact', (req, res) => {
  const payload = req.body || {};
  console.log('Contact submission received:', payload);
  // In a real app you'd validate/save and perhaps send email. For demo we just acknowledge.
  res.status(201).json({ status: 'received' });
});

app.listen(port, () => {
  console.log(`OrbitUI backend listening on http://localhost:${port}`);
});
