import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-7E2SWW6YEG"
          />

          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-7E2SWW6YEG');
        `,
            }}
          />
          <link rel="shortcut icon" href="/favicon.svg" />
          <link
            rel="apple-touch-icon"
            href="/images/apple-touch-icon-180x180.png"
          />
          <link
            rel="apple-touch-icon"
            href="/images/apple-touch-icon-152x152.png"
          />
          <meta
            name="twitter:card"
            content="summary_large_image"
            key="twcard"
          />
          <meta
            property="og:image"
            content="https://res.cloudinary.com/aldi/image/upload/v1607370937/ogcard_bmltnc.jpg"
            key="ogimage"
          />
          <meta
            property="og:image:alt"
            content="this is the logo of door.link, used as an open graph"
          />
          <link
            rel="alternate"
            type="application/rss+xml"
            title="Subscribe to the RSS feed."
            href="https://door.link/rss.xml"
          />
        </Head>
        <body className="bg-white dark:bg-[#121212]">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
