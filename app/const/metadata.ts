export const GENERAL_METADATA = {
  title: "door.link",
  description:
    "A curated selection of music for listening and dancing in closed spaces.",
  category: "music",
  metadataBase: new URL("https://door.link"),
  openGraph: {
    title: "door.link",
    description:
      "A curated selection of music for listening and dancing in closed spaces.",
    url: "https://door.link",
    siteName: "door.link",
    images: [
      {
        url: "https://res.cloudinary.com/aldi/image/upload/v1607370937/ogcard_bmltnc.jpg",
        width: 800,
        height: 600,
      },
      {
        url: "https://res.cloudinary.com/aldi/image/upload/v1607370937/ogcard_bmltnc.jpg",
        width: 1800,
        height: 1600,
        alt: "large og image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    follow: true,
    index: true,
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon-180x180.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/apple-touch-icon-152x152.png",
    },
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  twitter: {
    card: "summary_large_image",
    title: "door.link",
    description:
      "A curated selection of music for listening and dancing in closed spaces.",
    images: [
      "https://res.cloudinary.com/aldi/image/upload/v1607370937/ogcard_bmltnc.jpg",
    ],
  },
  other: {
    owner: "Romina Malta",
    dev: "Javier Szyfer",
  },
};
