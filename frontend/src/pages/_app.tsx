import "@/styles/globals.css";
import type { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";
import { DefaultSeo } from "next-seo";
import { NextSeoProps } from "next-seo/lib/types";
import Head from "next/head";
import config from "../../config/config";
import { useEffect, useState } from "react";

const SEOConfig: NextSeoProps = {
  title: `${config.SITE_NAME} อ่านมังงะแปลไทย เว็บอ่านการ์ตูนออนไลน์ Manhua`,
  description: `${config.SITE_NAME} เว็บอ่านการ์ตูนออนไลน์ อ่านมังงะฟรี มังงะใหม่ เกาหลี จีน มังงะ18+ Manhwa เกาหลี Manga ญี่ปุ่น แปลไทยล่าสุด การ์ตูนอัพเดทใหม่ทุกวัน 24 ชม.`,
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
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("Service Worker registered: ", registration);
          })
          .catch((registrationError) => {
            console.log(
              "Service Worker registration failed: ",
              registrationError
            );
          });
      });
    }
  }, []);
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

        <meta name="application-name" content="PWA App" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PWA App" />
        <meta name="description" content="Best PWA App in the world" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />

        <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/touch-icon-ipad.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/touch-icon-iphone-retina.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/icons/touch-icon-ipad-retina.png"
        />

        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="mask-icon"
          href="/icons/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
     

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://yourdomain.com" />
        <meta name="twitter:title" content="PWA App" />
        <meta name="twitter:description" content="Best PWA App in the world" />
        <meta
          name="twitter:image"
          content="https://yourdomain.com/icons/android-chrome-192x192.png"
        />
        <meta name="twitter:creator" content="@DavidWShadow" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="PWA App" />
        <meta property="og:description" content="Best PWA App in the world" />
        <meta property="og:site_name" content="PWA App" />
        <meta property="og:url" content="https://yourdomain.com" />
        <meta
          property="og:image"
          content="https://yourdomain.com/icons/apple-touch-icon.png"
        />
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
