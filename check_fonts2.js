const urls = [
  "https://raw.githubusercontent.com/google/fonts/main/ofl/fredoka/Fredoka%5Bwdth,wght%5D.ttf",
  "https://raw.githubusercontent.com/google/fonts/main/ofl/fredoka/Fredoka-Regular.ttf",
  "https://raw.githubusercontent.com/google/fonts/main/ofl/fredokaone/FredokaOne-Regular.ttf"
];

async function check() {
  for (const url of urls) {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      console.log(`${res.status}: ${url}`);
    } catch (e) {
      console.log(`ERROR: ${url} - ${e.message}`);
    }
  }
}
check();
