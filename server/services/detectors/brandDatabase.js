// Comprehensive brand and financial institution database
const BRAND_DATABASE = {
  banks: [
    { name: "Chase", domains: ["chase.com", "chaseonline.chase.com"], keywords: ["chase", "jpmorgan"] },
    { name: "Wells Fargo", domains: ["wellsfargo.com"], keywords: ["wells fargo", "wellsfargo"] },
    { name: "Bank of America", domains: ["bankofamerica.com"], keywords: ["bank of america", "bofa"] },
    { name: "Citibank", domains: ["citibank.com", "citi.com"], keywords: ["citibank", "citi"] },
    { name: "Capital One", domains: ["capitalone.com"], keywords: ["capital one", "capitalone"] },
    { name: "US Bank", domains: ["usbank.com"], keywords: ["us bank", "usbank"] },
    { name: "PNC Bank", domains: ["pnc.com"], keywords: ["pnc", "pnc bank"] },
    { name: "TD Bank", domains: ["tdbank.com"], keywords: ["td bank", "tdbank"] },
    { name: "Barclays", domains: ["barclays.com"], keywords: ["barclays", "barclaycard"] },
    { name: "HSBC", domains: ["hsbc.com"], keywords: ["hsbc"] },
  ],
  financial: [
    { name: "PayPal", domains: ["paypal.com"], keywords: ["paypal"] },
    { name: "Square", domains: ["square.com"], keywords: ["square", "squareup"] },
    { name: "Stripe", domains: ["stripe.com"], keywords: ["stripe"] },
    { name: "American Express", domains: ["americanexpress.com", "amex.com"], keywords: ["amex", "american express"] },
    { name: "Visa", domains: ["visa.com"], keywords: ["visa"] },
    { name: "Mastercard", domains: ["mastercard.com"], keywords: ["mastercard"] },
    { name: "Coinbase", domains: ["coinbase.com"], keywords: ["coinbase"] },
    { name: "Robinhood", domains: ["robinhood.com"], keywords: ["robinhood"] },
  ],
  tech: [
    { name: "Apple", domains: ["apple.com"], keywords: ["apple", "icloud", "itunes"] },
    { name: "Microsoft", domains: ["microsoft.com"], keywords: ["microsoft", "office365", "outlook"] },
    { name: "Google", domains: ["google.com", "gmail.com"], keywords: ["google", "gmail", "youtube"] },
    { name: "Amazon", domains: ["amazon.com", "aws.amazon.com"], keywords: ["amazon", "aws"] },
    { name: "Facebook", domains: ["facebook.com"], keywords: ["facebook", "meta"] },
    { name: "Meta", domains: ["meta.com"], keywords: ["meta", "instagram", "whatsapp"] },
    { name: "Twitter", domains: ["twitter.com"], keywords: ["twitter", "x.com"] },
    { name: "LinkedIn", domains: ["linkedin.com"], keywords: ["linkedin"] },
    { name: "Netflix", domains: ["netflix.com"], keywords: ["netflix"] },
    { name: "Dropbox", domains: ["dropbox.com"], keywords: ["dropbox"] },
    { name: "GitHub", domains: ["github.com"], keywords: ["github", "ghithub"] },
    { name: "Slack", domains: ["slack.com"], keywords: ["slack"] },
    { name: "Discord", domains: ["discord.com"], keywords: ["discord"] },
  ],
  ecommerce: [
    { name: "eBay", domains: ["ebay.com"], keywords: ["ebay"] },
    { name: "Etsy", domains: ["etsy.com"], keywords: ["etsy"] },
    { name: "Shopify", domains: ["shopify.com"], keywords: ["shopify"] },
    { name: "Walmart", domains: ["walmart.com"], keywords: ["walmart"] },
    { name: "Target", domains: ["target.com"], keywords: ["target"] },
    { name: "Best Buy", domains: ["bestbuy.com"], keywords: ["best buy", "bestbuy"] },
  ],
};

// Flatten all brands for quick lookup
const getAllBrands = () => {
  const allBrands = [];
  Object.values(BRAND_DATABASE).forEach(category => {
    allBrands.push(...category);
  });
  return allBrands;
};

// Check if a domain belongs to a brand
const getBrandByDomain = (domain) => {
  const allBrands = getAllBrands();
  return allBrands.find(brand => 
    brand.domains.some(d => domain.includes(d) || d.includes(domain))
  );
};

// Check if a keyword matches a brand
const getBrandByKeyword = (text) => {
  const textLower = text.toLowerCase();
  const allBrands = getAllBrands();
  
  return allBrands.filter(brand =>
    brand.keywords.some(keyword => textLower.includes(keyword))
  );
};

module.exports = {
  BRAND_DATABASE,
  getAllBrands,
  getBrandByDomain,
  getBrandByKeyword,
};
