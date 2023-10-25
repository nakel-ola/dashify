import { Head, Html, Main, NextScript } from "next/document";

const FAVICON_VERSION = 3;

function v(href: string) {
  return `${href}?v=${FAVICON_VERSION}`;
}

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={v("/favicons/apple-touch-icon.png")}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={v("/favicons/favicon-32x32.png")}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={v("/favicons/favicon-16x16.png")}
        />
        <link rel="manifest" href={v("/favicons/site.webmanifest")} />
        <link
          rel="mask-icon"
          href={v("/favicons/safari-pinned-tab.svg")}
          color="#4f46e5"
        />
        <link rel="shortcut icon" href={v("/favicons/favicon.ico")} />
        <meta name="apple-mobile-web-app-title" content="Martvest" />
        <meta name="application-name" content="Martvest" />
        <meta name="msapplication-TileColor" content="#4f46e5" />
        <meta
          name="msapplication-config"
          content={v("/favicons/browserconfig.xml")}
        />
        <meta name="theme-color" content="#ffffff" />
        <link rel="canonical" href="https://dashify.vercel.app/" />
      </Head>
      <body className="flex flex-col justify-center">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
