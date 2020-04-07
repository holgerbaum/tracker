const http = require("http");
const hostname = "127.0.0.1";
const port = 3000;

const axios = require("axios").default;
const cheerio = require("cheerio");
const nodemailer = require("nodemailer");

const url =
  "https://www.amazon.de/gp/product/B00D1E6RMW/ref=ppx_od_dt_b_asin_title_s00?ie=UTF8&psc=1";
const userAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36";
const expectedPrice = 100;

async function main() {
  const response = await axios.get(url, {
    headers: {
      "User-Agent": userAgent,
    },
  });
  const html = response.data;
  const $ = cheerio.load(html);
  let newPriceElementText = $("#priceblock_ourprice").text();
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

  // send mail with defined transport object
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

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World");
});
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
