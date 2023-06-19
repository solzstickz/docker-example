import React from "react";
import axios from "axios";
import Layer from "../../components/Layer";
import Image from "next/image";
import axios_client from "../../config/axios_client";
import config from "../../config/config";
import ProgressBar from "react-progressbar-on-scroll";
import { FaArrowLeft, FaArrowRight, FaListUl, FaTimes } from "react-icons/fa";
import moment from "moment-timezone";
interface post {
  posts_id: number;
  posts_slug: string;
  pages_id: number;
  posts_ep: number;
  posts_detail: {};
  posts_create: Date;
  posts_views: number;
}

export default function post({ ...props }) {
  return (
    <>
      <Layer>
        <div className="container mx-auto md:max-w-[700px]">
          <div className="content w-full flex justify-center flex-col text-center">
            <div className="title my-3">
              <h1 className="dark:text-color_white text-5xl font-bold">
                {props.post.pages_en} ตอนที่ {props.post.posts_ep}
              </h1>
            </div>
            <div className="desc my-3">
              <p className="dark:text-color_gray">
                อ่านมังงะ มังฮวา การ์ตูนเรื่อง {props.post.pages_en}{" "}
                {props.post.pages_th} ตอนที่ {props.post.posts_ep}
                at SITE_NAME – มังงะแปลไทย
              </p>
            </div>
            <div className="fixed top-0 left-0 h-[80px] bg-header_bg_menu z-50 w-full">
              <div className="flex w-full justify-around items-center">
                <div className="detail">
                  <div className="title font-bold text-2xl dark:text-color_gray">
                    {props.post.pages_en}
                  </div>
                  <div className="ep text-md dark:text-color_gray text-left">
                    ตอนที่ {props.post.posts_ep}
                    {""}•{""}
                    <span>{moment(props.post.posts_create).format("LL")}</span>
                  </div>
                </div>
                <div className="nav__ep flex items-center">
                  <div className="select bg-main_bg_dark rounded-xl m-1">
                    <FaListUl
                      className={`text-color_white text-[40px] p-2 delay-1000 ease-out`}
                    />
                  </div>
                  <div className="prv bg-main_bg_dark rounded-xl m-1">
                    <FaArrowLeft
                      className={`text-color_white text-[30px] p-2 delay-1000 ease-out`}
                    />
                  </div>
                  <div className="next bg-main_bg_dark rounded-xl m-1">
                    <FaArrowRight
                      className={`text-color_white text-[30px] p-2 delay-1000 ease-out`}
                    />
                  </div>
                
                </div>
              </div>
            </div>
            <div className="reading relative">
              <div className="scroll__progress__bar">
                <ProgressBar color="#ff4900" height={5} />
              </div>
              {props.post.posts_detail.map((images: any, i: number) => {
                return (
                  <div className="relative mx-auto w-full h-auto" key={i}>
                    <Image
                      src={`${config.CDN_URL}${images.url}`}
                      alt={images.alt}
                      width={100}
                      height={100}
                      layout="responsive"
                      objectFit="contain"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Layer>
    </>
  );
}

export async function getServerSideProps(context: any) {
  let res_data = await axios_client.get(`public/posts/${context.query.post}`);
  let post = await res_data.data[0];
  console.log(post);
  return {
    props: {
      post,
    },
  };
}
