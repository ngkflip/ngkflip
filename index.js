// === index.js (Node.js Backend for Render/Vercel) ===
import express from 'express';
import dotenv from 'dotenv';
import amazonPaapi from 'amazon-paapi';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

const commonParams = {
  AccessKey: process.env.ACCESS_KEY,
  SecretKey: process.env.SECRET_KEY,
  PartnerTag: process.env.PARTNER_TAG,
  PartnerType: 'Associates',
  Marketplace: 'www.amazon.com'
};

app.get('/api/asin/:asin', async (req, res) => {
  const { asin } = req.params;
  try {
    const data = await amazonPaapi.GetItems(commonParams, {
      ItemIds: [asin],
      Resources: [
        'ItemInfo.Title',
        'Images.Primary.Medium',
        'Offers.Listings.Price'
      ]
    });

    const item = data.ItemsResult.Items[0];
    const result = {
      title: item.ItemInfo.Title.DisplayValue,
      image: item.Images.Primary.Medium.URL,
      price: item.Offers.Listings[0].Price.DisplayAmount,
      link: `https://www.amazon.com/dp/${asin}?tag=${process.env.PARTNER_TAG}`
    };

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch data for ASIN.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});


// === .env (Not committed to GitHub!) ===
// ACCESS_KEY=your_access_key_here
// SECRET_KEY=your_secret_key_here
// PARTNER_TAG=leadflips-20


// === public/script.js (Frontend Logic) ===
// Load Header
fetch('header.html')
  .then(res => res.text())
  .then(data => document.getElementById('header').innerHTML = data);

// Load Footer
fetch('footer.html')
  .then(res => res.text())
  .then(data => document.getElementById('footer').innerHTML = data);

// Auto-Fetch Amazon Deal Cards
const autoDeals = document.querySelectorAll('.auto-amz-deal');
autoDeals.forEach(card => {
  const asin = card.dataset.asin;
  fetch(`https://your-api-url.com/api/asin/${asin}`)
    .then(res => res.json())
    .then(data => {
      card.innerHTML = `
        <div class="deal-card">
          <img src="${data.image}" alt="${data.title}" class="deal-img">
          <h2>${data.title}</h2>
          <p><strong>Price:</strong> ${data.price}</p>
          <a href="${data.link}" target="_blank" class="buy-btn">🛒 Buy on Amazon</a>
        </div>`;
    })
    .catch(() => {
      card.innerHTML = '<p style="color:red">Failed to load deal.</p>';
    });
});


// === styles.css (Add to your style or inline) ===
/* Keep same styling from your existing deals page */
.deal-card {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  text-align: left;
}

.deal-img {
  max-width: 100%;
  border-radius: 4px;
  margin-bottom: 15px;
}

.buy-btn {
  display: inline-block;
  margin-top: 10px;
  padding: 10px 16px;
  background: #f0b90b;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
}

.buy-btn:hover {
  background: #e6a800;
}


// === How to Use in HTML ===
// Just place this anywhere in your HTML body:
// <div class="auto-amz-deal" data-asin="B0F2BCG1Y5"></div>

// Replace B0F2BCG1Y5 with any valid Amazon ASIN.
