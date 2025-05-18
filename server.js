const express = require('express');
const puppeteer = require('puppeteer-core');;
const app = express();
const port = 3000; // You can choose any available port

// Helper function to scrape a URL
async function scrapePage(url) {
    let browser;
    console.log('Scraping starting...'); // Initial log
    console.log('Target URL:', url); // Log the target URL

    try {
        // Launch a headless browser instance
        // Use headless: false for local debugging if needed, but true for normal operation
        browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        console.log('Browser launched.'); // Log success

        const page = await browser.newPage();
        console.log('New page created.'); // Log success

        // Set a realistic User-Agent header
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'); // Use a recent user agent
        console.log('User agent set.'); // Log success

        // Navigate to the URL
        console.log('Navigating to URL...'); // Log before navigation
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 }); // Increased timeout to 90s, wait until network is idle
        console.log('Navigation complete.'); // Log after navigation

        // Optional: Add a small delay after navigation if content is slow to appear
        // console.log('Adding small post-navigation delay...');
        // await new Promise(resolve => setTimeout(resolve, 3000));
        // console.log('Delay finished.');


        // Get the full HTML content of the page
        console.log('Getting page content...'); // Log before getting content
        const html = await page.content();
        console.log('Page content retrieved.'); // Log success

        return { html: html };
    } catch (error) {
        console.error('Scraping error:', error); // Log any errors during scraping
        return { error: error.message };
    } finally {
        // Close the browser instance
        if (browser) {
            await browser.close();
            console.log('Browser closed.'); // Log success
        }
        console.log('Scraping finished.'); // Final log
    }
}

// Create a simple web endpoint that accepts a URL
app.get('/scrape', async (req, res) => {
    const targetUrl = req.query.url; // Get the target URL from query parameters

    if (!targetUrl) {
        console.warn('Received request with missing "url" parameter.'); // Log missing parameter
        return res.status(400).json({ error: 'Missing "url" query parameter' });
    }

    console.log(`Received request to scrape: ${targetUrl}`); // Log incoming request

    const result = await scrapePage(targetUrl);

    if (result.error) {
        console.error('Error processing scrape request:', result.error); // Log error before sending response
        res.status(500).json(result);
    } else {
        console.log('Successfully scraped and returning HTML.'); // Log success before sending response
        // Send the HTML back as the response
        res.status(200).send(result.html);
    }
});

// Start the web server
app.listen(port, '0.0.0.0', () => {
    console.log(`Headless scraper server listening on http://0.0.0.0:${port}`);
    console.log(`Accessible locally via http://127.0.0.1:${port}`);
});
