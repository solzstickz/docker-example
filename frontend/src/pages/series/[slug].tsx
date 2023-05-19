import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layer from "../../../components/Layer";
import axios from "axios";
import Image from "next/image";
import { FaStar, FaBookOpen } from "react-icons/fa";
import Link from "next/link";
import moment from "moment";

export default function page({ ...props }: any) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <Layer>
      <div className="page relative">
        <div
          className="pages_thumb relative z-0   overflow-hidden page_thumbnail"
          id="page_thumbnail"
        >
          <div
            style={{
              "--image-url": `url(${props.res_page.pages_detail.thumbnail})`,
            }}
            className="pages_thumb_img bg-cover bg-center h-[300px]  bg-no-repeat  bg-[image:var(--image-url)]"
          ></div>
        </div>

        <div className="pages_detail relative w-full bottom-[100px] container h-100 mx-auto flex  md:col z-10 flex-col-reverse md:flex-row-reverse px-5 md:px-0">
          <div className="pages_deltail_ep w-full md:w-4/5">
            <div className="title">
              <h1 className="text-3xl md:text-7xl text-color_white font-bold my-5 md:my-0">
                {props.res_page.pages_detail.title}
              </h1>
            </div>
            <div className="tags mt-[50px]">
              <div className="tags_title my-5">
                <h2 className="text-3xl dark:text-color_gray font-bold">
                  tags:
                </h2>
              </div>
              {props.res_page.pages_tags
                .split(",")
                .map((tags: string, i: number) => {
                  return (
                    <Link
                      key={i}
                      href={`/tags/${tags}`}
                      className="bg-header_bg_menu py-[8px] px-[15px] m-2 rounded-md mx-2 dark:text-color_white hover:bg-site_color hover:text-color_white ease-out duration-300"
                    >
                      {tags}
                    </Link>
                  );
                })}
            </div>
            <div className="pages_content md:mx-10">
              <div className="story my-10 text-left text-color_gray text-2xl">
                <p>เรื่องย่อ</p>
                <p>{props.res_page.pages_detail.info.EN} แปลไทย</p>
                <p>{props.res_page.pages_detail.simple}</p>
              </div>
              <div className="back_homepage w-auto text-site_color md:gap-2 my-3 grid grid-cols-1">
                <span className="">
                  <Link href="/">หน้าแรก</Link>
                  &nbsp;|&nbsp;
                  <Link href={`/pages/${props.res_page.pages_slug}`}>
                    อ่าน {props.res_page.pages_detail.info.EN} แปลไทย
                  </Link>
                </span>
              </div>
              <div className="ep my-3">
                <div className="ep_img relative w-full h-[100px] md:w-[400px] md:h-[100px]">
                  <Image
                    src="/img/logo.png"
                    className=""
                    fill={true}
                    alt="test"
                  />
                </div>
                <div className="ep_title text-3xl font-bold my-3">
                  <h2 className="dark:text-color_white">
                    <span className="text-site_color px-2">ลำดับตอน</span>ล่าสุด
                  </h2>
                </div>
                <div className="ep_list">
                  <ul
                    className="overflow-y-scroll list-none max-h-[500px] scroll-smooth"
                    id="ep_list"
                  >
                    {props.res_ep.map((item: any, index: number) => {
                      // return (
                      //   <li
                      //     key={index}
                      //     className="bg-header_bg_dark m-2 p-2 rounded-md hover:bg-site_color hover:text-color_white"
                      //   >
                      //     <Link href="/">
                      //       <div
                      //         className={`ep_container  flex gap-5 text-site_color hover:text-color_white`}
                      //       >
                      //         <div className="ep_icon text-2xl font-bold flex justify-center items-center bg-pages_bg_bookopen p-4 rounded-md">
                      //           <FaBookOpen className="text-md" />
                      //         </div>
                      //         <div className="ep_text">
                      //           <div className="text-xl ">
                      //             <p className="">ตอนที่{item.posts_ep}</p>
                      //           </div>
                      //           <div className="ep_date">
                      //             <p className="text-sm">
                      //               {item.posts_create}
                      //             </p>
                      //           </div>
                      //         </div>
                      //       </div>
                      //     </Link>
                      //   </li>
                      // );
                      return (
                        <li
                          key={index}
                          className="bg-header_bg_dark m-2 p-2 rounded-md hover:bg-site_color hover:text-color_white"
                        >
                          <Link href={`/${item.posts_slug}`}>
                            <div
                              className={`ep_container  flex gap-5 text-color_gray hover:text-color_white`}
                            >
                              <div className="ep_icon text-2xl font-bold flex justify-center items-center bg-pages_bg_bookopen p-4 rounded-md">
                                <FaBookOpen className="text-md" />
                              </div>
                              <div className="ep_text">
                                <div className="text-xl ">
                                  <p className="">
                                    {props.res_page.pages_detail.info.EN} แปลไทย
                                    {` ตอนที่ ${item.posts_ep}`}
                                  </p>
                                </div>
                                <div className="ep_date">
                                  <p className="text-sm">
                                    {moment(item.posts_create).format("LL")}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="pages_deltail_info w-full md:w-1/5 flex justify-center md:justify-start flex-col">
            <div className="thumb mx-auto w-[250px] h-[300px] relative">
              <Image
                src={`${props.res_page.pages_detail.thumbnail}`}
                fill={true}
                className="rounded-md box-shadow-2xl object-contain"
                alt="test"
              />
            </div>
            <div className="status w-full flex my-2 h-[50px]">
              <div className="type w-full  bg-pages_status_type flex items-center justify-center rounded-l-full text-center text-color_white text-2xl p-3">
                {props.res_page.pages_detail.info.type}
              </div>
              <div className="status_showing bg-pages_status_showing flex items-center justify-center w-full rounded-r-full text-center text-color_white text-2xl">
                {props.res_page.pages_detail.info.status_showing}
              </div>
            </div>
            <div className="star w-full h-[50px] bg-pages_bg_star flex justify-center items-center rounded-full my-2">
              <div className="icon relative">
                <FaStar className="text-pages_star text-[20px] absolute right-6 top-[3px]" />
                <span className="text-[20px] leading-2 text-color_white font-bold">
                  {props.res_page.pages_detail.info.star}
                </span>
              </div>
            </div>
            <div className="bookmark w-full h-[50px] bg-site_color flex justify-center items-center rounded-full my-2">
              <div className="icon relative">
                <FaBookOpen className="absolute top-1 right-20 text-color_white " />
                <p className="text-color_white">อ่านย้อนหลัง</p>
              </div>
            </div>
            <div className="follow text-center my-2">
              <p className="text-color_gray">
                มีผู้ติดตามจำนวน {props.res_page.pages_detail.info.follow}
              </p>
            </div>
            <div className="sub w-full rounded-md bg-header_bg_dark p-5 ">
              <ul>
                <li>
                  <p className="font-bold text-color_gray text-2xl">
                    English: <span> {props.res_page.pages_detail.info.EN}</span>
                  </p>
                </li>
                <li>
                  <p className="font-bold text-color_gray text-2xl">
                    ภาษาไทย: <span> {props.res_page.pages_detail.info.TH}</span>
                  </p>
                </li>
                <li>
                  <p className="font-bold text-color_gray text-2xl">
                    ตอนที่: <span> {props.res_page.pages_detail.last_ep}</span>
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layer>
  );
}

export async function getServerSideProps(context: any) {
  let res = await axios.post(
    `${process.env.API_END_POINT}pages/${context.query.slug}`
  );
  let res_data = await res.data;
  let res_page = await res_data[0];
  let res_ep = await res_data[1];
  console.log(res_page);
  return { props: { res_page, res_ep } };
}
