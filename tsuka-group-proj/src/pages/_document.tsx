import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  
  return (
    <Html lang="en" className="scroll-smooth">
      <Head>
        <script async src="https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
