require('dotenv').config();
const express = require('express');
const drillRoute = require('./routes/drill');

const app = express();
app.use(express.json());

app.use('/drill', drillRoute);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'linksense' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`LinkSense running on port ${PORT}`);
});
