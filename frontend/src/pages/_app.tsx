import "@/styles/globals.css";
import type { AppProps } from "next/app";
import NextNProgress from "nextjs-progressbar";
import { DefaultSeo } from "next-seo";
import { NextSeoProps } from "next-seo/lib/types";

const SEOConfig: NextSeoProps = {
  title:
    "Shiba Mangga - อ่านมังงะ อ่านการ์ตูน อ่านการ์ตูนออนไลน์ อ่านมังงะออนไลน์",
  description:
    "Shiba Mangga - อ่านมังงะ อ่านการ์ตูน อ่านการ์ตูนออนไลน์ อ่านมังงะออนไลน์ อ่านการ์ตูนออนไลน์ อ่านการ์ตูนออนไลน์ฟรี อ่านการ์ตูนออนไลน์ผ่านมือถือ อ่านการ์ตูนออนไลน์ อ่านมังงะ อ่านมังงะ อ่านมังงะออนไลน์ อ่านมังงะฟรี อ่านมังงะ อ่านมังงะ อ่านมังงะออนไลน์ อ่านมังงะ อ่านมังงะ อ่านมังงะออนไลน์ อ่านมังงะ อ่านมังงะ อ่านมังงะออนไลน์ อ่านมังงะ อ่านมังงะ อ่านมังงะออนไลน์ อ่านมังงะ อ่านมังงะ อ่านมังงะออนไลน์ อ่านมังงะ อ่านมังงะ อ่านมังงะออนไลน์ อ่านมังงะ อ่านมังงะ อ่านมังงะออนไลน์ อ่านมังงะ อ่านมังงะ อ่านมังงะออนไลน์",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.frontend.skz.app/",
    site_name: "Shiba Mangga",
  },
  twitter: {
    handle: "@handle",
    site: "",
    cardType: "summary_large_image",
  },
  
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
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
