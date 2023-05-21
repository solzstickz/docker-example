import React, { use, useState } from "react";
import Link from "next/link";
import moment from "moment";
import Image from "next/image";
export default function Poster({ ...props }) {
  return (
    <>
      <div className="update_new-item mx-auto flex flex-col relative max-w-[250px] hover:scale-110 transition-all ease-out delay-100 bg-color_white hover:bg-color_white  dark:text-text_color text-color_dark_gray hover:text-site_color shadow-2xl rounded-tl-md rounded-tr-md">
        <Link href={`/series/${props.pages_slug}`}>
          <div className="update_new-item-img h-[250px] w-[200px] relative  p-3 ">
            <Image
              src={props.pages_detail.thumbnail}
              fill={true}
              className="mx-auto rounded-tl-md rounded-tr-md"
              alt={props.pages_detail.title}
            />
            <div
              className={`update_new-status absolute w-[60px] h-[25px] ${
                props.pages_detail.info.type === "Manga"
                  ? "bg-color_Manga"
                  : props.pages_detail.info.type === "Manhwa"
                  ? "bg-color_Manhwa"
                  : props.pages_detail.info.type === "Novel"
                  ? "bg-color_Novel"
                  : null
              }  shadow-2xl rounded-tl-md rounded-br-md top-0 left-0`}
            >
              <p className="text-[16px] text-color_white text-center pt-[2px]">
                {props.pages_detail.info.type}
              </p>
            </div>
          </div>
          <div className="update_new-item-title text-center h-auto relative">
            <h3 className="text-2xl  line-clamp-2">
              {props.pages_detail.info.EN}
            </h3>
          </div>
        </Link>
        <div className="last_ep flex justify-around items-center">
          <Link
            href={`/${props.posts_slug}`}
            className="text-[16px] dark:text-color_white text-color_dark_gray text-center my-2 px-3 py-1 rounded-full dark:bg-header_bg_dark  bg-color_white  hover:bg-site_color transition-all"
          >
            ตอนที่ {props.posts_ep}
          </Link>
          <span className="text-[16px] text-color_gray">
            {moment(props.posts_date).startOf("day").fromNow()}
          </span>
          <h1>{props.posts_create}</h1>
        </div>
      </div>
    </>
  );
}
