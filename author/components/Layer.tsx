import Image from "next/image";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  FaHome,
  FaRegFolder,
  FaSearch,
  FaMoon,
  FaBars,
  FaRegMoon,
  FaBell,
  FaBookmark,
  FaChevronDown,
} from "react-icons/fa";
import { Transition } from "@tailwindui/react";
import { useRouter } from "next/router";
import config from "../config/config";
interface comps_state {
  path: string;
  nav__anime: boolean;
}

const Cookies = require("js-cookie");
import axios_cliclient from "../config/axios_client";
export default function Layer({ children }: any) {
  const router = useRouter();
  const [themes, setThemes] = useState("dark");
  const [nav_status, Setnav_status] = useState(false);
  const [comps_state, setComps_state] = useState<comps_state>({
    path: "e923b164-6dd4-4704-b82f-5dccdaf8245c",
    nav__anime: false,
  });

  useEffect(() => {
    vertify_token();
  }, []);

  const vertify_token = () => {
    const access_token = Cookies.get("access_token");
    console.log(`access_token : ` + access_token);
    if (access_token == undefined || access_token == "") {
      router.push(`/${config.ADMIN_PATH}`);
    }
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
  const toggle_nav = () => {
    Setnav_status(!nav_status);
  };

  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // // Whenever the user explicitly chooses light mode
    // localStorage.theme = "light";

    // // Whenever the user explicitly chooses dark mode
    // localStorage.theme = "dark";

    // // Whenever the user explicitly chooses to respect the OS preference
    // localStorage.removeItem("theme");
  }, []);
  return (
    <>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* <!-- Desktop sidebar --> */}
        <div
          className={`__nav z-20 ${
            nav_status ? "fixed h-full mt-16" : "hidden"
          } w-64 overflow-y-auto bg-white dark:bg-gray-800 md:block flex-shrink-0`}
        >
          <div className="py-4 text-gray-500 dark:text-gray-400">
            <Link
              className="ml-6 text-lg font-bold text-gray-800 dark:text-gray-200"
              href="#"
            >
              Author Create Anime : D
            </Link>
            <ul className="mt-6">
              <li className="relative px-6 py-3">
                {router.pathname.search("dashboard") &&
                comps_state.nav__anime === false ? (
                  <span className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"></span>
                ) : null}
                <Link
                  className={`${
                    comps_state.nav__anime
                      ? " transition-colors duration-150  "
                      : " dark:hover:text-gray-200 dark:text-gray-100 text-gray-800"
                  } inline-flex items-center w-full text-sm font-semibold `}
                  href={`/${config.ADMIN_PATH}/dashboard/`}
                >
                  <FaHome className="h-5 w-5" />
                  <span className="ml-4">Dashboard</span>
                </Link>
              </li>
            </ul>
            <ul>
              {/* <li className="relative px-6 py-3">
                <Link
                  className="inline-flex items-center w-full text-sm font-semibold transition-colors duration-150  dark:hover:text-gray-200"
                  href="/"
                >
                  <FaBookmark className="w-5 h-5" />
                  <span className="ml-4">Manga</span>
                </Link>
              </li> */}
              <li
                className="relative px-6 py-3"
                onClick={() => {
                  setComps_state({
                    ...comps_state,
                    nav__anime: !comps_state.nav__anime,
                  });
                }}
              >
                <button className="inline-flex items-center justify-between w-full text-sm font-semibold transition-colors duration-150  dark:hover:text-gray-200">
                  {comps_state.nav__anime ? (
                    <span
                      className="absolute inset-y-0 left-0 w-1 bg-purple-600 rounded-tr-lg rounded-br-lg"
                      aria-hidden="true"
                    ></span>
                  ) : null}
                  <span
                    className={`${
                      comps_state.nav__anime
                        ? "text-gray-800 transition-colors duration-150  dark:hover:text-gray-200 dark:text-gray-100"
                        : ""
                    } inline-flex items-center`}
                  >
                    <FaBookmark className="w-5 h-5" />
                    <span className="ml-4">Anime</span>
                  </span>
                  <FaChevronDown
                    className={`${
                      comps_state.nav__anime ? "rotate-90 text-purple-600" : ""
                    } w-5 h-5`}
                  />
                </button>

                {comps_state.nav__anime ? (
                  <Transition
                    show={comps_state.nav__anime}
                    enter="transition-all ease-in-out duration-300"
                    enterFrom="opacity-25 max-h-0"
                    enterTo="opacity-100 max-h-xl"
                    leave="transition-all ease-in-out duration-300"
                    leaveFrom=" opacity-100 max-h-xl"
                    leaveTo="opacity-0 max-h-0"
                  >
                    <ul
                      className={`p-2 mt-2 space-y-2 overflow-hidden text-sm font-medium text-gray-500 rounded-md shadow-inner bg-gray-50 dark:text-gray-400 dark:bg-gray-900`}
                    >
                      <li
                        className={`${
                          router.pathname.search("pages") &&
                          comps_state.nav__anime
                            ? ""
                            : "dark:text-gray-100"
                        } px-2 py-1 transition-colors duration-150  dark:hover:text-gray-200`}
                      >
                        <Link
                          className="w-full"
                          href={`/${config.ADMIN_PATH}/pages/`}
                        >
                          pages
                        </Link>
                      </li>
                      {/* <li
                        className={`px-2 py-1 transition-colors duration-150  dark:hover:text-gray-200`}
                      >
                        <Link className="w-full" href={`posts`}>
                          post
                        </Link>
                      </li> */}
                      <li
                        className={`px-2 py-1 transition-colors duration-150  dark:hover:text-gray-200`}
                      >
                        <Link
                          className="w-full"
                          href={`/${config.ADMIN_PATH}/tags/`}
                        >
                          tags
                        </Link>
                      </li>
                    </ul>
                  </Transition>
                ) : null}
              </li>
            </ul>
            <div className="px-6 my-6">
              <button
                className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                onClick={() => {
                  router.push(`/${config.ADMIN_PATH}`);
                  document.cookie =
                    "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

                  Cookies.remove("access_token");
                }}
              >
                Create account
                <span className="ml-2" aria-hidden="true">
                  +
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="__content flex flex-col flex-1 w-full">
          {/* //! header */}
          <header className="z-10 py-4 bg-white shadow-md dark:bg-gray-800">
            <div className="container flex items-center justify-between h-full px-6 mx-auto text-purple-600 dark:text-purple-300">
              {/* <!-- Mobile hamburger --> */}
              <button
                className="p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:shadow-outline-purple"
                onClick={toggle_nav}
              >
                <FaBars className="w-6 h-6" />
              </button>
              {/* <!-- Search input --> */}
              <div className="flex justify-center flex-1 lg:mr-32">
                <div className="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
                  <div className="absolute inset-y-0 flex items-center pl-2">
                    <FaSearch className="w-3 h-3" />
                  </div>
                  <input
                    className="w-full pl-8 pr-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md dark:placeholder-gray-500 dark:focus:shadow-outline-gray dark:focus:placeholder-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:placeholder-gray-500 focus:bg-white focus:border-purple-300 focus:outline-none focus:shadow-outline-purple form-input"
                    type="text"
                    placeholder="Search for projects"
                    aria-label="Search"
                  />
                </div>
              </div>
              <ul className="flex items-center flex-shrink-0 space-x-6">
                {/* <!-- Theme toggler --> */}
                <li className="flex">
                  <button
                    className="rounded-md focus:outline-none focus:shadow-outline-purple"
                    onClick={change_theme}
                  >
                    {themes === "dark" ? <FaRegMoon /> : <FaMoon />}
                  </button>
                </li>
                {/* <!-- Notifications menu --> */}
                <li className="relative">
                  <button className="relative align-middle rounded-md focus:outline-none focus:shadow-outline-purple">
                    <FaBell className="w-5 h-5" />
                    {/* <!-- Notification badge --> */}
                    <span className="absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full dark:border-gray-800"></span>
                  </button>
                </li>
                {/* <!-- Profile menu --> */}
                <li className="relative">
                  <button className="align-middle rounded-full focus:shadow-outline-purple focus:outline-none">
                    {/* <img className="object-cover w-8 h-8 rounded-full" src="https://images.unsplash.com/photo-1502378735452-bc7d86632805?ixlib=rb-0.3.5&amp;q=80&amp;fm=jpg&amp;crop=entropy&amp;cs=tinysrgb&amp;w=200&amp;fit=max&amp;s=aa3a807e1bbdfd4364d1f449eaa96d82" alt="" aria-hidden="true"> */}
                  </button>
                </li>
              </ul>
            </div>
          </header>
          {/* //! main */}
          <main className="h-full overflow-y-auto">
            <div className="container px-6 mx-auto grid font-semibold text-gray-800 transition-colors duration-150  dark:hover:text-gray-200 dark:text-gray-100">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
