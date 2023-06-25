import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layer from "../../../components/Layer";
import axios_client from "../../../config/axios_client";
import Image from "next/image";
import { FaStar, FaBookOpen, FaRegHeart, FaHeart } from "react-icons/fa";
import Link from "next/link";
import moment from "moment";
import config from "../../../config/config";
import { CSSProperties } from "react";
export default function Page({ ...props }: any) {
  const [info, setInfo] = useState({
    favorite: false,
  });

  //! set favorite
  useEffect(() => {
    const pagesSlug = props.res_page.pages_slug;
    const favoriteStatus = localStorage.getItem("favorite");
    if (favoriteStatus) {
      const favoriteData = JSON.parse(favoriteStatus);
      const foundfavorite = favoriteData.find(
        (favorite: any) => favorite.pages_slug === pagesSlug
      );
      if (foundfavorite) {
        setInfo((prevInfo) => ({
          ...prevInfo,
          favorite: true,
        }));
      }
    }
  }, []);

  const handlefavoriteclick = () => {
    const favoriteStatus = localStorage.getItem("favorite");
    let favoriteData = [];

    if (favoriteStatus) {
      favoriteData = JSON.parse(favoriteStatus);
      const pagesSlug = props.res_page.pages_slug;
      if (favoriteData.includes(pagesSlug)) {
        // ถ้ามีค่าอยู่แล้วให้ลบออก
        favoriteData = favoriteData.filter((slug: any) => slug !== pagesSlug);
      } else {
        // ถ้าไม่มีค่าอยู่ให้เพิ่มเข้าไป
        favoriteData.push(props.res_page);
      }
    } else {
      // ถ้าไม่มีค่าเลยให้เพิ่มค่าเดียวเข้าไป
      favoriteData.push(props.res_page);
    }

    localStorage.setItem("favorite", JSON.stringify(favoriteData));

    setInfo({
      ...info,
      favorite: !info.favorite,
    });
  };

  const handleunfavoriteclick = () => {
    const favoriteStatus = localStorage.getItem("favorite");
    if (favoriteStatus) {
      const favoriteData = JSON.parse(favoriteStatus);
      const pagesSlug = props.res_page.pages_slug;
      const updatedfavoriteData = favoriteData.filter(
        (favorite: any) => favorite.pages_slug !== pagesSlug
      );
      localStorage.setItem("favorite", JSON.stringify(updatedfavoriteData));
      setInfo({
        ...info,
        favorite: false,
      });
    }
  };
  //!
  return (
    <Layer>
      <div className="page relative">
        <div
          className="pages_thumb relative z-0  overflow-hidden page_thumbnail"
          id="page_thumbnail"
        >
          <div
            style={
              {
                "--image-url": `url(${config.CDN_URL}${props.res_page.pages_thumbnail})`,
              } as CSSProperties
            }
            className="pages_thumb_img bg-cover bg-center h-[300px]  bg-no-repeat  bg-[image:var(--image-url)]"
          ></div>
        </div>

        <div className="pages_detail relative w-full bottom-[100px] container h-100 mx-auto flex  md:col z-10 flex-col-reverse md:flex-row-reverse px-5 md:px-0 md:max-w-[1080px]">
          <div className="pages_deltail_ep w-full md:w-9/12">
            <div className="title w-full mt-10 md:my-0 relative">
              <h1 className="text-2xl md:text-5xl text-dark_gray dark:text-color_white ">
                {props.res_page.pages_title}
              </h1>
            </div>

            <div className="pages_content md:mx-10 md:mt-[80px]">
              <div className="story my-10 text-left dark:text-color_gray text-color_dark_gray">
                <h2 className="text-2xl ">
                  เรื่องย่อ {props.res_page.pages_en} แปลไทย{" "}
                </h2>
                <p className="text-md">
                  อ่านมังงะ {props.res_page.pages_en} {""}
                  {props.res_page.pages_th} {props.res_page.pages_simple}
                </p>
              </div>
              <div className="tags my-5">
                {props.res_tags.map((tags: any, i: number) => {
                  return (
                    <Link
                      key={i}
                      href={`/tags/${tags.tags_slug}`}
                      className="text-center p-2 justify-center  dark:bg-header_bg_menu  font-bold bg-color_white inline-flex  m-1 rounded-md dark:text-color_white text-color_dark_gray hover:bg-site_color dark:hover:bg-site_color hover:text-color_white ease-out duration-300"
                    >
                      {tags.tags_name.toUpperCase()}
                    </Link>
                  );
                })}
              </div>
              <div className="back_homepage w-auto text-site_color md:gap-2 my-3 grid grid-cols-1">
                <span className="">
                  <Link href="/">หน้าแรก</Link>
                  &nbsp;|&nbsp;
                  <Link href={`/series/${props.res_page.pages_slug}`}>
                    อ่าน {props.res_page.pages_th} แปลไทย
                  </Link>
                </span>
              </div>
              <div className="ep my-3">
                <div className="ep_img relative w-full h-[120px] md:w-[400px] md:h-[130px]">
                  <Image
                    src="/img/logo.png"
                    className=""
                    fill={true}
                    alt="test"
                  />
                </div>
                <div className="ep_title text-3xl font-bold my-3">
                  <h3 className="dark:text-color_white">
                    <span className="text-site_color px-2">ลำดับตอน</span>ล่าสุด
                  </h3>
                </div>
                <div className="ep_list">
                  <ul
                    className="overflow-y-scroll list-none max-h-[500px] scroll-smooth "
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
                      //             <p className="text-sm">{item.posts_create}</p>
                      //           </div>
                      //         </div>
                      //       </div>
                      //     </Link>
                      //   </li>
                      // );
                      return (
                        <li
                          key={index}
                          className="dark:bg-header_bg_dark dark:text-color_gray  bg-color_white m-2 p-2 rounded-md dark:hover:bg-site_color dark:hover:text-color_white hover:bg-site_color hover:text-color_white shadow-md"
                        >
                          <Link href={`/${item.posts_slug}`}>
                            <div className={`ep_container  flex gap-5 `}>
                              <div className="ep_icon text-2xl font-bold flex justify-center items-center dark:bg-pages_bg_bookopen bg-[#e6e6e6]  p-4 rounded-md">
                                <FaBookOpen className="text-md" />
                              </div>
                              <div className="ep_text">
                                <div className="text-xl ">
                                  <p className="">
                                    {props.res_page.pages_en} แปลไทย
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

          <div className="pages_deltail_info w-full md:w-3/12 flex justify-center items-center md:justify-start flex-col">
            <div className="thumb mx-auto w-[250px] h-[350px] relative">
              <Image
                src={`${config.CDN_URL}${props.res_page.pages_thumbnail}`}
                fill={true}
                className="object-contain rounded-[15px] shadow-md"
                alt="test"
              />
            </div>
            <div className="status w-full flex my-2 h-[50px]">
              <div className="type w-full  bg-pages_status_type flex items-center justify-center rounded-l-full text-center text-color_white text-2xl p-3 shadow-md">
                {props.res_page.pages_type}
              </div>
              <div className="status_showing bg-pages_status_showing flex items-center justify-center w-full rounded-r-full text-center text-color_white text-2xl shadow-md">
                {props.res_page.pages_status_showing}
              </div>
            </div>
            <div className="star w-full h-[50px] dark:bg-pages_bg_star bg-color_white flex justify-center items-center rounded-full my-2 shadow-md">
              <div className="icon relative">
                <FaStar className="text-pages_star text-[20px] absolute right-6 top-[3px]" />
                <span className="text-[20px] leading-2 dark:text-color_white text-color_dark_gray font-bold">
                  {props.res_page.pages_star}
                </span>
              </div>
            </div>
            <div className="bookmark w-full h-[50px] bg-site_color flex justify-center items-center rounded-full my-2 shadow-md cursor-pointer">
              {info.favorite ? (
                <>
                  <div
                    className="icon w-full flex justify-center items-center gap-3"
                    onClick={handleunfavoriteclick}
                  >
                    <FaHeart className="favorite  text-color_white" />

                    <p className="text-color_white text-left">UnFollow</p>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="icon w-full flex justify-center items-center gap-3"
                    onClick={handlefavoriteclick}
                  >
                    <FaRegHeart className="not_favorite  text-color_white" />

                    <p className="text-color_white text-left">Follow</p>
                  </div>
                </>
              )}
              {/* <FaBookOpen className="absolute top-1 right-20 text-color_white " />
                <p className="text-color_white">อ่านย้อนหลัง</p> */}
            </div>

            <div className="follow text-center my-2">
              <p className="dark:text-color_gray text-color_dark_gray">
                มีผู้ติดตามจำนวน {props.res_page.pages_follow}
              </p>
            </div>
            <div className="sub w-full rounded-md dark:bg-header_bg_dark bg-color_white p-5 shadow-md">
              <ul>
                <li>
                  <p className="font-bold text-color_dark_gray dark:text-color_gray text-2xl">
                    English
                  </p>
                  <span className="text-color_dark_gray dark:text-color_gray">
                    {" "}
                    {props.res_page.pages_en}
                  </span>
                </li>
                <li>
                  <p className="font-bold text-color_dark_gray dark:text-color_gray text-2xl">
                    Thai
                  </p>
                  <span className="text-color_dark_gray dark:text-color_gray">
                    {" "}
                    {props.res_page.pages_th}
                  </span>
                </li>
                <li>
                  <p className="font-bold text-color_dark_gray dark:text-color_gray text-2xl">
                    Total Charpter
                  </p>
                  <span className="text-color_dark_gray dark:text-color_gray">
                    {" "}
                    {props.res_ep[0].posts_ep}
                  </span>
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
  try {
    let res = await axios_client.get(`public/pages/${context.query.slug}`);
    let res_ep = await res.data.pages;
    let res_page = await res.data.pages[0];
    let res_tags = await res.data.tags;

    // let res_ep = await res_data[1];
    return { props: { res_page, res_tags, res_ep } };
  } catch (error) {
    console.log(error);
  }
  return { props: {} };
}
