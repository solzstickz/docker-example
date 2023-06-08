import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FaMoon, FaSearch, FaBars, FaTimes, FaArrowUp } from "react-icons/fa";
import { useRouter } from "next/router";

interface Props {
  children?: React.ReactNode;
}
export default function Layer({ children, ...props }: Props) {
  const [themes, setThemes] = useState("dark");
  const [nav_status, Setnav_status] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

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

    // // Whenever the user explicitly chooses dark mode
    // localStorage.theme = "dark";

    // Whenever the user explicitly chooses to respect the OS preference
    // localStorage.removeItem("theme");
  };
  const change_theme = () => {
    if (themes === "dark") {
      setThemes("light");
      document.documentElement.classList.remove("dark");
    } else {
      setThemes("dark");
      document.documentElement.classList.add("dark");
    }
  };
  useEffect(() => {
    set_theme();
  }, []);
  return (
    <>
      <header className="dark:bg-header_bg_dark bg-header_bg_light">
        <div className="container mx-auto flex justtify-between">
          <div className="md:w-1/4 flex items-center justify-center">
            <div className="icon_search bg-header_bg_menu rounded-xl mx-2 md:hidden">
              {nav_status ? (
                <FaTimes
                  className={`text-color_white text-[40px] p-2 delay-1000 ease-out ${nav_status} ? 'opacity-100' : 'opacity-0'`}
                  onClick={() => {
                    Setnav_status(false);
                  }}
                />
              ) : (
                <FaBars
                  className={`text-color_white text-[40px] p-2 delay-1000 ease-out ${
                    nav_status ? "opacity-100" : "opacity-0"
                  }`}
                  onClick={() => {
                    Setnav_status(true);
                  }}
                />
              )}
            </div>
          </div>
          <div className="w-auto md:w-1/4">
            <Image src="/img/logo.png" width={300} height={300} alt="logo" />
          </div>
          <div className="hidden md:w-2/4 md:flex items-center justify-center">
            <ul>
              <li className="">
                <Link
                  href="/"
                  className="bg-site_color py-[8px] px-[15px] rounded-md mx-2 dark:text-color_white text-color_white"
                >
                  หน้าแรก
                </Link>
                <Link
                  href="/"
                  className="dark:bg-header_bg_menu bg-color_white py-[8px] px-[15px] rounded-md mx-2 dark:text-color_white text-color_dark hover:bg-site_color hover:text-color_white ease-out duration-300"
                >
                  รายชื่อมังงะ
                </Link>
                <Link
                  href="/"
                  className="dark:bg-header_bg_menu bg-color_white py-[8px] px-[15px] rounded-md mx-2 dark:text-color_white text-color_dark hover:bg-site_color hover:text-color_white ease-out duration-300"
                >
                  มังงะที่ถูกใจ
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:w-1/4 flex items-center justify-center ">
            <div className="mx-3 hidden md:block relative">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-[#000] dark:text-color_white dark:border-[#000]"
                id="search"
                type="text"
                placeholder="ค้นหา"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    router.push(`/search/${search}`);
                  }
                }}
              />
              <FaSearch
                className={`absolute top-1/2 right-0 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer ${
                  search === ""
                    ? "text-color_gray"
                    : "text-color_white animate-pulse ease-out delay-1000"
                }`}
                onClick={() => {
                  router.push(`/search/${search}`);
                }}
              />
            </div>
            <div className="bg-site_color rounded-xl">
              <FaMoon
                className="text-color_white text-[40px] p-2"
                onClick={change_theme}
              />
            </div>
            <div className="icon_search bg-header_bg_menu rounded-xl mx-2 md:hidden">
              <FaSearch className="text-color_white text-[40px] p-2" />
            </div>
          </div>
        </div>

        <div className="banner container mx-auto">
          <div className="notify w-full bg-site_color">
            <p className="text-center text-3xl text-color_white">
              ยินดีต้อนรับเข้าสู่เว็บไซต์
            </p>
          </div>
          <div className="banner_img w-full grid grid-cols-2 px-5">
            <Image
              src="/img/hotgraph88.webp"
              width={1920}
              height={500}
              alt="logo"
            />
            <Image
              src="/img/hotgraph88.webp"
              width={1920}
              height={500}
              alt="logo"
            />
          </div>
        </div>
      </header>

      <main className="dark:bg-main_bg_dark bg-header_bg_light">
        {children}
      </main>

      <footer className="bg-footer_bg_dark">
        <div className="white_space h-[10px] bg-[#3b3c4c] py-3"></div>
        <div className="container mx-auto tags w-full flex justify-center flex-wrap	">
          <Link
            href="/"
            className="bg-header_bg_menu py-[8px] px-[15px] m-2 rounded-md mx-2 text-color_white hover:bg-site_color hover:text-color_white ease-out duration-300"
          >
            มังงะที่ถูกใจ
          </Link>
          <Link
            href="/"
            className="bg-header_bg_menu py-[8px] px-[15px] m-2 rounded-md mx-2 text-color_white hover:bg-site_color hover:text-color_white ease-out duration-300"
          >
            มังงะที่ถูกใจ
          </Link>
          <Link
            href="/"
            className="bg-header_bg_menu py-[8px] px-[15px] m-2 rounded-md mx-2 text-color_white hover:bg-site_color hover:text-color_white ease-out duration-300"
          >
            มังงะที่ถูกใจ
          </Link>
          <Link
            href="/"
            className="bg-header_bg_menu py-[8px] px-[15px] m-2 rounded-md mx-2 text-color_white hover:bg-site_color hover:text-color_white ease-out duration-300"
          >
            มังงะที่ถูกใจ
          </Link>
        </div>
        <div className="copyright container mx-auto w-full flex justify-center flex-col items-center">
          <p className="text-text_color">
            God-Manga.com 2023 | God Manga – มังงะแปลไทย เว็บอ่านมังงะ มังฮวา
            การ์ตูนแปลไทย ออนไลน์
          </p>
          <Image src="/img/discord.webp" width={300} height={300} alt="logo" />
          <p className="text-text_color text-2xl font-bold">
            God-manga เว็บ อ่านมังงะแปลไทย อ่านการ์ตูนแปลไทย 24 ชั่วโมง
          </p>
          <p className="text-center text-text_color text-xl my-3">
            เว็บ God-manga God-manga เว็บอ่านมังงะแปลไทย มังฮวาแปลไทย
            มังฮาวแปลไทย การ์ตูนแปลไทย อ่านนิยาย การ์ตูนจีน การ์ตูนญี่ปุ่น
            อ่านฟรี 24 ชั่วโมง อัพเดตตลอด อ่าน Magic emperror อ่าน The Great
            Mage Returns After 4000 Years อ่าน Nano machine อ่าน True Education
            อ่าน Escort Warrior อ่าน one piece อ่าน พงศวดารภูเทพ อ่าน peerless
            dad อ่านได้ทั้ง คอมพิวเตอร์ มือถือ android iphone ทุกระบบ
          </p>
        </div>
      </footer>
      {scrollPosition > 100 && (
        <div
          className="scroll_top fixed bottom-5 right-5 z-50 p-3 bg-site_color rounded-full flex items-center justify-center transition-all duration-300 ease-in-out delay-300"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <FaArrowUp className="text-color_white text-[15px] cursor-pointer animate-bounce" />
        </div>
      )}
    </>
  );
}
