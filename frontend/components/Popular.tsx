import React from "react";
import Image from "next/image";
import Link from "next/link";
import config from "../config/config";
// interface pages_poppular {
//   pages_id: number;
//   pages_slug: string;
//   pages_view: number;
//   pages_last_update: string;
//   pages_status_showing: string;
//   pages_last_ep: number;
//   pages_en: string;
//   pages_th: string;
//   pages_star: number;
//   pages_type: string;
//   pages_follow: number;
//   pages_publish: number;
//   pages_title: string;
//   pages_simple: string;
//   pages_thumbnail: string;
//   pages_description: string;
// }
export default function Popular({ ...props }) {
  return (
    <>
      {props.poppular.map((pages: any, i: number) => {
        return (
          <div
            className="poppular-item mx-auto flex col relative ] max-w-[160px] hover:animate-pulse"
            key={i}
          >
            <Link href={`/series/${pages.pages_slug}`}>
              <div className="poppular-item-img h-[150px] w-[110px] md:h-[220px] md:w-[160px] relative shadow-md overflow-hidden mx-auto">
                <Image
                  src={`${config.CDN_URL}` + pages.pages_thumbnail}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                  className="mx-auto rounded-md shadow-md"
                  alt={pages.pages_title}
                  title={`${pages.pages_title}`}
                />

                <div className="poppular-status absolute w-[30px] h-[40px] top-0 left-3 bg-site_color shadow-2xl rounded-b-md">
                  <p className="text-2xl text-color_white text-center font-bold p-1">
                    {i + 1}
                  </p>
                </div>
              </div>
              <div className="poppular-item-title text-center h-auto relative">
                <h3 className="text-2xl dark:text-text_color text-dark_gray line-clamp-1 font-bold">
                  {pages.pages_en}
                </h3>
              </div>
            </Link>
          </div>
        );
      })}
    </>
  );
}
