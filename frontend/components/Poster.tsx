import React, { use, useState } from "react";
import Link from "next/link";
import dayjs from "../lib/dayjsUtils";
import Image from "next/image";
import config from "../config/config";
export default function Poster({ ...props }) {
  return (
    <>
      <div className="items px-1">
        <div className="update_new-item flex flex-col relative mx-auto   md:max-w-[200px] hover:animate-pulse transition-all ease-out delay-300  dark:text-text_color text-color_dark_gray hover:text-site_color shadow-2xl rounded-md hover:border-none">
          <Link
            href={`/series/${props.pages_slug}`}
            title={`อ่านการ์ตูน ${props.pages_en}`}
          >
            <div className="update_new-item-img min-h-[230px] max-h-[230px] overflow-hidden md:w-[200px] md:min-h-[280px] md:max-h-[280px] md:h-[280px] w-full relative">
              <Image
                src={`${config.CDN_URL}${props.pages_thumbnail}`}
                className="mx-auto rounded-tl-md rounded-tr-md"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={true}
                alt={props.pages_title}
              />
              <div
                className={`update_new-status absolute w-[60px] h-[25px] ${
                  props.pages_type === "Manga"
                    ? "bg-color_Manga"
                    : props.pages_type === "Manhua"
                    ? "bg-color_Manhwa"
                    : props.pages_type === "Novel"
                    ? "bg-color_Novel"
                    : null
                }  shadow-2xl rounded-tl-md rounded-br-md top-0 left-0`}
              >
                <p className="text-[16px] text-color_white text-center pt-[2px]">
                  {props.pages_type}
                </p>
              </div>
            </div>
            <div className="update_new-item-title text-center h-auto relative md:max-w-[200px] mx-auto">
              <p className="text-2xl font-bold line-clamp-1">
                {props.pages_en}
              </p>
              <span className="text-[16px] text-color_gray">
                {dayjs(props.pages_last_update).fromNow()}
                {/* {dayjs("2023-06-28T07:18:58.000Z").startOf("day").fromNow()} */}
              </span>
            </div>
          </Link>
          <div className="last_ep flex justify-center items-center text-center w-full mb-4">
            <Link
              className=" w-5/6  text-color_white justify-between mx-auto px-4 py-2 text-xl font-medium leading-5 text-white transition-colors duration-150 bg-site_color rounded-lg active:bg-site_color hover:bg-site_color focus:outline-none focus:shadow-outline-bg-site_color"
              href={`/${props.posts_slug}`}
            >
              ตอนที่ {props.pages_last_ep}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
