import React from "react";
import axios from "axios";
import Layer from "../../components/Layer";
import Image from "next/image";
import axios_client from "../../config/axios_client";
import config from "../../config/config";
import ProgressBar from "react-progressbar-on-scroll";
import {
  FaArrowLeft,
  FaArrowRight,
  FaListUl,
  FaTimes,
  FaCaretDown,
  FaAngleLeft,
  FaRegHeart,
  FaHeart,
  FaArrowDown,
  FaArrowUp,
  FaAngleRight,
  FaAngleUp,
  FaHome,
} from "react-icons/fa";
import moment from "moment-timezone";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
interface post {
  posts_id: number;
  posts_slug: string;
  pages_id: number;
  posts_ep: number;
  posts_detail: {};
  posts_create: Date;
  posts_views: number;
}

export default function Post({ ...props }) {
  const [nav_ep, setNav_ep] = useState(false);
  const [nav_control, setNav_control] = useState(true);
  const [info, setInfo] = useState({
    favorite: false,
  });

  useEffect(() => {
    const checkfavoritestatus = () => {
      // ตรวจสอบสถานะ favorite และทำสิ่งที่ต้องการ
      const favoriteStatus = localStorage.getItem("favorite");
      if (favoriteStatus) {
        const favoriteData = JSON.parse(favoriteStatus);
        const pagesSlug = props.post.pages_slug;
        const foundfavorite = favoriteData.find(
          (favorite: any) => favorite.pages_slug === pagesSlug
        );
        if (foundfavorite) {
          setInfo((prevInfo) => ({
            ...prevInfo,
            favorites: true,
          }));
        }
      }
    };

    checkfavoritestatus();
  }, [props.post]);

  const handlefavoriteclick = () => {
    const favoriteStatus = localStorage.getItem("favorite");
    let favoriteData = [];

    if (favoriteStatus) {
      favoriteData = JSON.parse(favoriteStatus);
      const pagesSlug = props.post.pages_slug;
      if (favoriteData.includes(pagesSlug)) {
        // ถ้ามีค่าอยู่แล้วให้ลบออก
        favoriteData = favoriteData.filter((slug: any) => slug !== pagesSlug);
      } else {
        // ถ้าไม่มีค่าอยู่ให้เพิ่มเข้าไป
        favoriteData.push(props.post);
      }
    } else {
      // ถ้าไม่มีค่าเลยให้เพิ่มค่าเดียวเข้าไป
      favoriteData.push(props.post);
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
      const pagesSlug = props.post.pages_slug;
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

  //! scroll
  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScroll = () => {
    const position = window.pageYOffset;
    const max_scroll = document.body.scrollHeight - window.innerHeight;
    console.log(`max` + max_scroll);
    setScrollPosition(position);
    console.log(position);

    switch (true) {
      case position <= 300:
        setNav_control(true);
        break;
      case position > 300 && position < max_scroll - 1000:
        setNav_control(false);
        setNav_ep(false);
        break;
      case position > max_scroll - 1000:
        setNav_control(true);
        console.log("max");
        break;
      default:
        //
        break;
    }
    // if (scrollPosition < 100) {
    //   console.log("start");
    //   setNav_control(true);
    // }
    // if (scrollPosition > 300) {
    //   setNav_control(false);
    // }
    // if (scrollPosition > max_scroll - 2000) {
    //   console.log("max");
    // }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  //! scroll

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

            <div
              className={`${
                nav_ep ? "fixed" : "hidden"
              }  nav__ep flex items-start justify-center z-[30] w-[380px] h-[400px] bg-[#000] md:right-24  bottom-20 right-1 rounded-2xl transition-all duration-300 ease-in-out delay-300 `}
            >
              <div className="nav__content flex flex-col w-full">
                <div className="nav__title py-2 border-b-4 border-site_color dark:text-color_white w-full relative">
                  <h2>Charpter List</h2>
                  <FaTimes
                    className="text-site_color text-[20px]  delay-1000 ease-out animate-pulse cursor-pointer absolute right-5 top-3"
                    onClick={() => setNav_ep(!nav_ep)}
                  />
                </div>
                <div className="nav__list h-[650px] overflow-x-auto">
                  <ul className="">
                    {props.list_ep.map((item: any, i: number) => (
                      <Link href={`${item.posts_slug}`} key={item.posts_id}>
                        <li className="nav__item flex items-center  justify-around gap-4 py-2 dark:text-color_white border-dashed border-b-2 border-color_gray">
                          {/* <div className="no w-[50px] border-e-2 border-color_gray">
                            {i + 1}
                          </div> */}
                          <div className="ep">ตอนที่ {item.posts_ep}</div>
                          <div className="date">
                            {moment().from(item.posts_create)}
                          </div>
                        </li>
                      </Link>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="nav__footer absolute bottom-[-18px] right-6 z-30 md:hidden">
                <FaCaretDown className="text-[#000] text-[40px] delay-1000 ease-out" />
              </div>
            </div>

            {nav_control && (
              <div
                className={`fixed bottom-2 left-0  z-50 w-screen  p-3 transition-all duration-300 ease-in-out delay-300 flex justify-center items-center`}
              >
                <div className="w-[300px] h-[50px] bg-color_dark rounded-full flex items-center justify-around shadow-xl shadow-[#434343]">
                  <div className="prev">
                    <FaAngleLeft className="text-color_white text-[20px] delay-1000 ease-out" />
                  </div>
                  <div className="favorite">
                    {info.favorite ? (
                      <FaHeart
                        className="favorite text-site_color text-[20px] delay-1000 ease-out cursor-pointer"
                        onClick={handleunfavoriteclick}
                      />
                    ) : (
                      <FaRegHeart
                        className="not_favorite text-site_color text-[20px] delay-1000 ease-out cursor-pointer"
                        onClick={handlefavoriteclick}
                      />
                    )}
                  </div>
                  <div className="home">
                    <Link href={`/`}>
                      <FaHome className="text-color_white text-[20px] delay-1000 ease-out cursor-pointer" />
                    </Link>
                  </div>

                  <div className="nav__list">
                    {nav_ep ? (
                      <FaTimes
                        className="text-site_color text-[20px]  delay-1000 ease-out animate-pulse cursor-pointer"
                        onClick={() => setNav_ep(!nav_ep)}
                      />
                    ) : (
                      <FaListUl
                        className="text-color_white text-[20px] delay-1000 ease-out cursor-pointer"
                        onClick={() => setNav_ep(!nav_ep)}
                      />
                    )}
                  </div>
                  <div
                    className="top"
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <FaAngleUp
                      className="text-color_white text-[20px]  delay-1000 ease-out cursor-pointer"
                      // create function onclick scroll to top
                    />
                  </div>
                  <div className="next">
                    <FaAngleRight className="text-color_white text-[20px]  delay-1000 ease-out" />
                  </div>
                </div>

                {/* <div className="flex w-full justify-around items-center mt-3">
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
              </div> */}
              </div>
            )}

            <div className="reading relative">
              <div className="scroll__progress__bar">
                <ProgressBar color="#ff4900" height={5} />
              </div>
              {props.post.posts_detail.map((images: any, i: number) => {
                return (
                  <div
                    className="relative mx-auto w-full h-auto"
                    key={i}
                    onClick={() => setNav_control(!nav_control)}
                  >
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
  try {
    const { data } = await axios_client.get(
      `public/posts/${context.query.post}`
    );

    const fetch_list_ep = await axios_client.get(
      `public/pages/${data[0].pages_slug}`
    );
    const list_ep = fetch_list_ep.data.pages;

    return {
      props: {
        post: data[0],
        list_ep,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
}
