const axios = require("axios").default;
const cheerio = require("cheerio");
const nodemailer = require("nodemailer");

const url = "https://www.megafitness.shop/vp-weight-lifting-set-hq-160kg.html";
const userAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36";
const expectedPrice = 1500;

async function main() {
  const response = await axios.get(url, {
    headers: {
      "User-Agent": userAgent,
    },
  });
  const html = response.data;
  const $ = cheerio.load(html);
  let newPriceElementText = $("#product-price-843").text();
  newPriceElementText = newPriceElementText.slice(0, -2);
  const newPrice = parseFloat(newPriceElementText);
  console.log(newPrice);
  if (newPrice < expectedPrice) {
    await sendmail();
  }
}
async function sendmail() {
  const user = "holgerbaumvideos@gmail.com";
  const pass = "amdvbjbmzivsyuws";
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });

  await transporter.sendMail({
    from: '"Holger 👻" <${user}>',
    to: "holgerbaum-@web.de", // receivers by commas
    subject: "Der Preis ist gefallen!",
    html: `Der Preis für den lang ersehnten Artikel ist gefallen, hier gehts zur Bestellung:</br>${url}`,
  });
  console.log("Mail abgeschickt");
}

setInterval(function () {
  // alle 3 Minuten ausführen
  main().catch(console.error);
}, 180000);
