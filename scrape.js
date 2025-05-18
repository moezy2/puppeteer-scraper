const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON body
app.use(express.json());

// Optional: Respond to root URL
app.get('/', (req, res) => {
  res.send('✅ Puppeteer Scraper is running. Send a POST request to /scrape with { "url": "<target-url>" }');
});

// Main scraping route
app.post('/scrape', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL' });
  }

  try {
    const browser = await puppeteer.launch({
      headless: 'new', // Use new headless mode for Chromium
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Fake user-agent to avoid bot detection
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    );

    // Go to target page
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    const html = await page.content();
    await browser.close();

    res.status(200).send(html);
  } catch (error) {
    console.error('❌ Scraping error:', error.message);
    res.status(500).json({ error: error.toString() });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Scraper is running on port ${PORT}`);
});
