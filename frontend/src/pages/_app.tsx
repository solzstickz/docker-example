import "@/styles/globals.css";
import type { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";
import { DefaultSeo } from "next-seo";
import { NextSeoProps } from "next-seo/lib/types";
import Head from "next/head";
import config from "../../config/config";
const SEOConfig: NextSeoProps = {
  title:
    "Shiba Mangga - อ่านมังงะ อ่านการ์ตูน อ่านการ์ตูนออนไลน์ อ่านมังงะออนไลน์",
  description:
    "Shiba Mangga - อ่านมังงะ อ่านการ์ตูน อ่านการ์ตูนออนไลน์ อ่านมังงะออนไลน์ อ่านการ์ตูนออนไลน์ อ่านการ์ตูนออนไลน์ฟรี อ่านการ์ตูนออนไลน์ผ่านมือถือ อ่านการ์ตูนออนไลน์ อ่านมังงะ อ่านมังงะ อ่านมังงะออนไลน์ อ่านมังงะฟรี อ่านมังงะ อ่านมังงะ อ่านมังงะออนไลน์ อ่านมังงะ อ่านมังงะ อ่านมังงะออนไลน์ อ่านมังงะ อ่านมังงะ อ่านมังงะออนไลน์ อ่านมังงะ อ่านมังงะ อ่านมังงะออนไลน์ อ่านมังงะ อ่านมังงะ อ่านมังงะออนไลน์ อ่านมังงะ อ่านมังงะ อ่านมังงะออนไลน์ อ่านมังงะ อ่านมังงะ อ่านมังงะออนไลน์ อ่านมังงะ อ่านมังงะ อ่านมังงะออนไลน์",
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: `${config.SITE_URL}`,
    site_name: `${config.SITE_NAME}`,
    images: [
      {
        url: `${config.SITE_URL}img/logo_sqare.png`,
        width: 800,
        height: 600,
        alt: "Shiba Mangga",
      },
    ],
  },
  twitter: {
    handle: "@handle",
    site: "@site",
    cardType: "summary_large_image",
  },

  additionalMetaTags: [
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1",
    },
  ],
  additionalLinkTags: [
    {
      rel: "icon",
      href: "/favicon.ico",
    },
  ],

  facebook: {
    appId: "1234567890",
  },
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#6c2bd9" />
        <meta name="msapplication-TileColor" content="#6c2bd9" />
        <meta name="msapplication-navbutton-color" content="#6c2bd9" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#6c2bd9" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="manifest" href="/manifest.json" /> */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NextNProgress
        color="#6c2bd9"
        startPosition={0.3}
        stopDelayMs={200}
        height={3}
        showOnShallow={true}
      />
      <DefaultSeo {...SEOConfig} />
      <Component {...pageProps} />
    </>
  );
}
