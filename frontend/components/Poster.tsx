import React, { use, useState } from "react";
import Link from "next/link";
import moment from "moment";
import Image from "next/image";
import config from "../config/config";
export default function Poster({ ...props }) {
  return (
    <>
      <div className="update_new-item  mx-auto flex flex-col relative  max-w-full md:max-w-[250px] hover:scale-110 transition-all ease-out delay-100 bg-color_white hover:bg-color_white  dark:text-text_color text-color_dark_gray hover:text-site_color shadow-2xl rounded-md">
        <Link href={`/series/${props.pages_slug}`}>
          <div className="update_new-item-img w-[175px] h-[250px]  md:w-[200px] relative  p-3 ">
            <Image
              src={`${config.CDN_URL}${props.pages_thumbnail}`}
              fill={true}
              className="mx-auto rounded-tl-md rounded-tr-md"
              quality={1}
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
          <div className="update_new-item-title text-center h-auto relative  max-w-full md:max-w-[200px]">
            <h3 className="text-2xl  line-clamp-2">{props.pages_en}</h3>
            <span className="text-[16px] text-color_gray">
              {moment(props.posts_date).startOf("day").fromNow()}
            </span>
          </div>
        </Link>
        <div className="last_ep flex justify-center items-center text-center w-full mb-4">
          {/* <Link
            href={`/${props.pages_slug}/${props.last_ep}`}
            className="text-[16px] dark:text-color_white text-color_dark_gray text-center my-2 px-3 py-1 rounded-full dark:bg-header_bg_dark  bg-color_white  hover:bg-site_color transition-all"
          >
            ตอนที่ {props.last_ep}
          </Link>

          <h1>{props.posts_create}</h1> */}
          <Link
            className=" w-5/6  text-color_white justify-between mx-auto px-4 py-2 text-xl font-medium leading-5 text-white transition-colors duration-150 bg-site_color border border-transparent rounded-lg active:bg-site_color hover:bg-site_color focus:outline-none focus:shadow-outline-bg-site_color"
            href={`/${props.posts_slug}`}
          >
            ตอนที่ {props.pages_last_ep}
          </Link>
        </div>
      </div>
    </>
  );
}
