import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaMoon, FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { useRouter } from "next/router";
import config from "../config/config";
import Script from "next/script";
import axios from "axios";
import { useRef } from "react";
import dayjs from "../lib/dayjsUtils";
interface Props {
  children?: React.ReactNode;
}
declare global {
  interface Window {
    OneSignal: any;
  }
}
declare const OneSignal: any;

export default function Layer({ children, ...props }: Props) {
  const [themes, setThemes] = useState("dark");
  const [nav_status, Setnav_status] = useState(false);
  const [search, setSearch] = useState("");
  const [search_loading, setSearch_loading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [search_status, setSearch_status] = useState(false);

  const router = useRouter();
  const searchInputRef = useRef<any>(null);
  //! scroll
  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  //! scroll

  const set_theme = () => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Whenever the user explicitly chooses light mode
    // localStorage.theme = "light";

    // Whenever the user explicitly chooses dark mode
    // localStorage.theme = "dark";

    // Whenever the user explicitly chooses to respect the OS preference
    // localStorage.removeItem("theme");
  };
  const change_theme = () => {
    if (themes === "dark") {
      setThemes("light");
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    } else {
      setThemes("dark");
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    }
  };
  useEffect(() => {
    set_theme();
  }, []);

  useEffect(() => {
    setSearch_loading(true);
    const handleSearch = async () => {
      setSearch_loading(true);
      // Perform the fetch using the search value
      if (search === "") {
        try {
          let fetch_search = await axios.get(`${config.API_FRONT}popular`);
          let res = await fetch_search.data;
          setSearchResult(res);
        } catch (error) {
          console.error("Error fetching data:", error);
          setSearchResult([]);
        }
      } else {
        try {
          let fetch_search = await axios.get(
            `${config.API_FRONT}search/${search}`
          );
          let res = await fetch_search.data;
          setSearchResult(res);
        } catch (error) {
          console.error("Error fetching data:", error);
          setSearchResult([]);
        }
      }
      setSearch_loading(false);
    };

    const timer = setTimeout(() => {
      handleSearch();
    }, 1000);

    setSearch_loading(false);
    return () => clearTimeout(timer);
  }, [search]);

  const [visibleSearchResults, setVisibleSearchResults] = useState([]);

  useEffect(() => {
    if (searchResult.length > 0) {
      setVisibleSearchResults(searchResult.slice(0, 3));
    } else {
      setVisibleSearchResults([]);
    }
  }, [searchResult]);

  const handleLoadMore = () => {
    const nextBatch = searchResult.slice(
      visibleSearchResults.length,
      visibleSearchResults.length + 3
    );
    setVisibleSearchResults((prevResults) => [...prevResults, ...nextBatch]);
  };

  useEffect(() => {
    window.OneSignal = window.OneSignal || [];
    OneSignal.push(function () {
      OneSignal.init({
        appId: "9d2821fc-8989-4c25-86d5-3adbda02a09c",
        notifyButton: {
          enable: true,
        },

        allowLocalhostAsSecureOrigin: true,
      });
    });
    return () => {
      window.OneSignal = undefined;
    };
  }, []);
  return (
    <>
      <Script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" />
      {/* <div className="fixed top-0 left-0 overlay w-screen h-screen bg-color_gray"></div> */}
      <header className="dark:bg-header_bg_dark bg-header_bg_light relative">
        <div className="container mx-auto flex justtify-between relative">
          <div className="md:w-1/4 flex items-center justify-center">
            <div className="nav__bar bg-header_bg_menu rounded-xl mx-2 md:block lg:hidden">
              {nav_status ? (
                <FaTimes
                  className={`text-color_white text-[40px] p-2 delay-1000 ease-out animate-pulse ${nav_status} ? 'opacity-100' : 'opacity-0'`}
                  onClick={() => {
                    Setnav_status(!nav_status);
                  }}
                />
              ) : (
                <FaBars
                  onClick={() => {
                    Setnav_status(!nav_status);
                  }}
                  className={`text-color_white text-[40px] p-2 delay-1000 ease-out ${
                    nav_status ? "opacity-0" : "opacity-100"
                  }`}
                />
              )}
            </div>
          </div>
          <div className="w-auto md:w-1/4">
            <Link href="/">
              <Image
                src="/img/logo.png"
                width={300}
                height={300}
                alt={`${config.SITE_NAME} Logo`}
                title={`${config.SITE_NAME} Logo`}
                priority={true}
              />
            </Link>
          </div>
          <div
            className={`${
              nav_status ? "absolute z-[100] w-full h-[400px]" : "hidden"
            } lg:flex lg:items-center top-[90px] md:top-[60px] dark:bg-header_bg_dark  bg-header_bg_light `}
          >
            <ul>
              <li className="flex flex-col lg:flex-row gap-4 mt-5 md:mt-0">
                <Link
                  href="/"
                  className="bg-site_color py-[8px] px-[15px] rounded-md mx-2 dark:text-color_white text-color_white shadow-md"
                >
                  หน้าแรก
                </Link>
                <Link
                  href="/"
                  className="dark:bg-header_bg_menu bg-color_white py-[8px] px-[15px] rounded-md mx-2 dark:text-color_white text-color_dark hover:bg-site_color hover:text-color_white ease-out duration-300 shadow-md"
                >
                  รายชื่อมังงะ
                </Link>
                <Link
                  href="/favorite"
                  className="dark:bg-header_bg_menu bg-color_white py-[8px] px-[15px] rounded-md mx-2 dark:text-color_white text-color_dark hover:bg-site_color hover:text-color_white ease-out duration-300 shadow-md"
                >
                  มังงะที่ชื่นชอบ
                </Link>
              </li>
            </ul>
          </div>
          <div
            className={`${
              search_status ? "" : ""
            } md:w-1/4 flex justify-end  items-center md:justify-center`}
          >
            <div
              className={`${
                search_status
                  ? "absolute left-0 top-[80px] w-full px-5 bg-header_bg_light dark:bg-header_bg_dark  h-auto max-h-[500px] min-h-[500px] z-[199] py-5  rounded-md shadow-md"
                  : "hidden"
              } search`}
            >
              <div className="relative w-full">
                <input
                  className="appearance-none border  rounded-xl w-full md:w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-[#000] dark:text-color_white dark:border-site_color"
                  id="search"
                  type="text"
                  placeholder="ค้นหา"
                  value={search}
                  ref={searchInputRef}
                  onChange={(e) => {
                    setSearch((e.target as HTMLInputElement).value);
                  }}
                />
                <FaTimes
                  className={`absolute top-1/2 right-0 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
                    search === ""
                      ? "text-color_gray"
                      : "text-color_gray dark:text-color_white animate-pulse ease-out delay-1000"
                  }`}
                  onClick={() => {
                    setSearch("");
                    searchInputRef.current.focus();
                  }} // เรียกใช้ฟังก์ชัน handleSearch เมื่อคลิกที่ปุ่มค้นหา
                />
              </div>
              <div className="search_list h-full">
                <div
                  className="flex flex-col gap-2 h-full max-h-[400px] p-1 m-2 rounded-md overflow-x-hidden relative"
                  id="list_search"
                >
                  {search_loading && (
                    <>
                      <div className="layout absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="flex items-center justify-center">
                          <div className="border-text-color h-20 w-20 animate-spin rounded-full border-8 border-t-site_color" />
                        </div>
                      </div>
                    </>
                  )}
                  {searchResult.length > 0 &&
                    visibleSearchResults.map((pages: any, i: number) => (
                      <Link
                        href={`/series/${pages.pages_slug}`}
                        key={i}
                        onClick={() => {
                          setSearch_status(!search_status);
                          setSearch("");
                        }}
                        className="hover:text-site_color"
                      >
                        <div className="container flex min-h-[100px] max-h-[100px] ">
                          <div className="thumb min-w-[80px] h-auto relative">
                            <Image
                              src={`${config.CDN_URL}${pages.pages_thumbnail}`}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              alt={`${pages.pages_title}`}
                              title={`${pages.pages_title}`}
                              priority={true}
                            />
                          </div>
                          <div className="info flex flex-col px-5">
                            <div className="pages_title text-md font-bold line-clamp-1">
                              {`${pages.pages_en} | ${pages.pages_th}`}
                            </div>
                            <div className="pages_simple text-sm font-bold line-clamp-2 pl-1">
                              {pages.pages_simple}
                            </div>
                            <div className="pages_type text-sm font-bold flex items-center justify-start">
                              <div
                                className={`update_new-status w-[50px] h-[30px] shadow-2xl relative`}
                              >
                                {pages.pages_type === "Manga" ? (
                                  <Image
                                    className="rounded-sm"
                                    src="/img/Manga.png"
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    alt="Manga"
                                    title="Manga"
                                    priority
                                  />
                                ) : pages.pages_type === "Manhwa" ? (
                                  <Image
                                    className="rounded-sm"
                                    src="/img/Manhwa.png"
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    alt="Manhwa"
                                    title="Manhwa"
                                    priority
                                  />
                                ) : pages.pages_type === "Manhua" ? (
                                  <Image
                                    className="rounded-sm"
                                    src="/img/Manhua.png"
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    alt="Manhua"
                                    title="Manhua"
                                    priority
                                  />
                                ) : null}
                              </div>
                              <span className="flex gap-2 items-center px-2">
                                <p className="text-color_gray dark:text-color_white ">
                                  {dayjs(pages.pages_last_update).fromNow()}
                                </p>
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}

                  {searchResult.length > 10 &&
                    visibleSearchResults.length < searchResult.length && (
                      <div className="flex items-center justify-center text-center">
                        <button
                          onClick={handleLoadMore}
                          className="text-color_white justify-between mx-auto px-4 py-2 text-xl font-medium leading-5 text-white transition-colors duration-150 bg-site_color rounded-lg active:bg-site_color hover:bg-site_color focus:outline-none focus:shadow-outline-bg-site_color"
                        >
                          เพิ่มเติม..
                        </button>
                      </div>
                    )}

                  {search !== "" && visibleSearchResults.length === 0 && (
                    <div className="flex items-center justify-center text-center">
                      <p className="text-3xl font-bold text-text-color dark:text-color_white">
                        Not Found ! <br />
                        Please Try Again
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-site_color rounded-xl">
              <FaMoon
                className="text-color_white text-[40px] p-2 shadow-md  rounded-xl cursor-pointer"
                onClick={change_theme}
              />
            </div>
            <div className={`icon_search bg-header_bg_menu rounded-xl mx-2`}>
              {search_status ? (
                <FaTimes
                  className="text-color_white text-[40px] p-2 shadow-md cursor-pointer"
                  onClick={() => {
                    setSearch_status(!search_status);
                  }}
                />
              ) : (
                <FaSearch
                  className="text-color_white text-[40px] p-2 shadow-md cursor-pointer"
                  onClick={() => {
                    setSearch_status(!search_status);
                    searchInputRef.current.focus();
                  }}
                />
              )}
            </div>
          </div>
        </div>

        <div className="banner container mx-auto">
          {/* <div className="notify w-full bg-site_color">
              <p className="text-center text-3xl text-color_white">
                ยินดีต้อนรับเข้าสู่เว็บไซต์
              </p>
            </div> */}
          <div className="banner_img w-full grid grid-cols-2 px-5">
            {/* <Image
                src="/img/hotgraph88.webp"
                width={1920}
                height={500}
                alt="logo"
                quality={1}
              />
              <Image
                src="/img/hotgraph88.webp"
                width={1920}
                height={500}
                alt="logo"
                quality={1}
              /> */}
          </div>
        </div>
      </header>

      <main className="dark:bg-main_bg_dark bg-header_bg_light">
        {children}
      </main>

      <footer>
        <div className="bg-footer_dark">
          <div className="white_space h-[10px] bg-[#3b3c4c] py-3"></div>
          <div className="container mx-auto tags w-full flex justify-center flex-wrap	">
            <Link
              href="/tags/action"
              className="bg-header_bg_menu py-[8px] px-[15px] m-2 rounded-md mx-2 text-color_white hover:bg-site_color hover:text-color_white ease-out duration-300"
            >
              ACTION
            </Link>
            <Link
              href="/tags/drama"
              className="bg-header_bg_menu py-[8px] px-[15px] m-2 rounded-md mx-2 text-color_white hover:bg-site_color hover:text-color_white ease-out duration-300"
            >
              DRAMA
            </Link>
            <Link
              href="/tags/fantasy"
              className="bg-header_bg_menu py-[8px] px-[15px] m-2 rounded-md mx-2 text-color_white hover:bg-site_color hover:text-color_white ease-out duration-300"
            >
              FANTASY
            </Link>
            <Link
              href="/tags/isekai"
              className="bg-header_bg_menu py-[8px] px-[15px] m-2 rounded-md mx-2 text-color_white hover:bg-site_color hover:text-color_white ease-out duration-300"
            >
              ISEKAI
            </Link>
          </div>
          <div className="copyright container mx-auto w-5/6 md:max-w-[1080px] flex justify-center flex-col items-center text-center">
            <p className="text-text_color">
              เว็บไซต์อ่านการ์ตูนออนไลน์ ที่รวบรวมการ์ตูนและมังงะจากทั่วโลก
              ไม่ว่าจะเป็นมังงะญี่ปุ่น การ์ตูนเกาหลี มังงะเกาหลี มังฮวา Manhwa
              มังฮัว และมังงะจีน ซึ่งสามารถอ่านได้ทุกหมวดหมู่ ทุกแนวตั้งแต่
              ต่างโลก เกิดใหม่ ระบบ แฟนตาซี เวทมนตร์ ดราม่า Yaoi Isekai BL
              โรแมนติก จอมยุทธ์ มูริม และอื่นๆอีกมากมาย
            </p>
            {/* <div className="discord w-auto h-auto">
              <Image
                src="/img/discord.webp"
                width={100}
                height={100}
                alt="Discord Logo"
                style={{ width: "auto" }}
              />
            </div> */}
            <h3 className="text-text_color text-2xl font-bold">
              {config.SITE_NAME} อ่านการ์ตูนแปลไทย
              ที่มั่นใจได้ว่าคุณภาพดีและอัพเดทตอนใหม่ก่อนใคร
            </h3>
            <p className="text-center text-text_color text-xl my-3">
              {config.SITE_NAME} ยังมีการอัพเดทตอนใหม่ๆก่อนใคร
              ทำให้ผู้อ่านไม่พลาดเรื่องราวสำคัญได้
              เนื่องจากไม่ต้องลงแอพพลิเคชั่นหรือซื้อเหรียญ
              ผู้อ่านสามารถอ่านได้ฟรีตลอด 24 ชั่วโมง
              ไม่ว่าคุณจะเป็นผู้ชื่นชอบการ์ตูนและมังงะแนวใด ที่{" "}
              {config.SITE_NAME}
              จะมีเรื่องราวให้คุณได้อ่านทุกเรื่อง ไม่ว่าจะเป็น Naruto, One
              Piece, Attack on Titan, Fairy Tail, Bleach, Dragon Ball, My Hero
              Academia, Demon Slayer: Kimetsu no Yaiba และอีกมากมาย
            </p>
            <p className="text-text_color text-2xl font-bold">
              อ่านการ์ตูนแปลไทย
              ด้วยเว็บอ่านการ์ตูนยอดนิยมที่มีทีมงานคุณภาพแปลภาษาไทย
            </p>
            <p className="text-center text-text_color text-xl my-3">
              สุดท้ายนี้
              การ์ตูนทั้งหมดบนเว็บไซต์นี้เป็นเพียงตัวอย่างของการ์ตูนต้นฉบับเท่านั้น
              อาจมีข้อผิดพลาดด้านภาษา ชื่อตัวละคร และเนื้อเรื่องมากมาย
              สำหรับเวอร์ชันดั้งเดิม โปรดซื้อการ์ตูนหากมีให้บริการในเมืองของคุณ
              หรือไม่ก็มาอ่านฟรี
            </p>
          </div>
        </div>
      </footer>
      {scrollPosition > 100 && (
        // <div
        //   className="scroll_top fixed bottom-5 right-5 z-50 p-3 bg-site_color rounded-full flex items-center justify-center transition-all duration-300 ease-in-out delay-300"
        //   onClick={() => {
        //     window.scrollTo({ top: 0, behavior: "smooth" });
        //   }}
        // >
        //   <FaArrowUp className="text-color_white text-[15px] cursor-pointer animate-bounce" />
        // </div>

        <></>
      )}
      {/* <div
          className={`${
            search_status ? "fixed top-0 left-0 w-screen h-screen" : ""
          } overlay  bg-[#000000] z-[999]`}
        >
          <div
            className={`${
              search_status ? "absolute top-7 right-0" : ""
            } icon_search bg-header_bg_menu rounded-xl mx-2 md:hidden`}
          >
            <FaTimes
              className="text-color_white text-[40px] p-2 shadow-md"
              onClick={() => {
                setSearch_status(!search_status);
              }}
            />
          </div>
          <div className="overlay__content mt-20 mx-5"></div>
        </div> */}
    </>
  );
}
