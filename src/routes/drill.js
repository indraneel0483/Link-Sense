const express = require('express');
const { crawlDomain } = require('../crawler');
const { identifySocialLinks } = require('../ai');

const router = express.Router();

router.post('/', async (req, res) => {
  const { domain, customer_id } = req.body;

  if (!domain || !customer_id) {
    return res.status(400).json({ error: 'domain and customer_id are required' });
  }

  try {
    console.log(`[${customer_id}] Crawling: ${domain}`);
    const allLinks = await crawlDomain(domain);
    console.log(`[${customer_id}] Found ${allLinks.length} links`);

    const socialLinks = await identifySocialLinks(allLinks);
    console.log(`[${customer_id}] Social links identified`);

    return res.json({
      customer_id,
      domain,
      total_links_found: allLinks.length,
      social_links: socialLinks
    });
  } catch (err) {
    console.error(`[${customer_id}] Error:`, err.message);
    return res.status(500).json({ error: 'Failed to process domain', details: err.message });
  }
});

module.exports = router;
