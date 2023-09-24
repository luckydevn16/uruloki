import axios from "axios";

// const coinMirrorUrl = "https://cryptocurrencyliveprices.com";
const coinMirrorUrl = "https://cryptoicons.org/api";

const coinMirror = axios.create({
  baseURL: coinMirrorUrl,
  timeout: 2500,
});

export { coinMirror, coinMirrorUrl };
