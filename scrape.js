const express = require('express');
const puppeteer = require('puppeteer-core');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ Puppeteer-core Scraper is running. POST to /scrape with { "url": "<target-url>" }');
});

app.post('/scrape', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Missing URL' });
  }

  try {
    // Use system-installed Chrome binary on Render
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/google-chrome-stable',  // Default Chrome on Render
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: 'new',
    });

    const page = await browser.newPage();

    // Set user-agent to reduce bot detection
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    );

    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });

    const html = await page.content();
    await browser.close();

    res.status(200).send(html);
  } catch (error) {
    console.error('❌ Scraping error:', error.message);
    res.status(500).json({ error: error.toString() });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Scraper is running on port ${PORT}`);
});
