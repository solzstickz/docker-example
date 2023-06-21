import React from "react";
import { useEffect, useState } from "react";
import {
  FaKey,
  FaRegEye,
  FaRegEyeSlash,
  FaTelegram,
  FaUser,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import axios_client from "../../../config/axios_client";
import { useRouter } from "next/router";
import config from "../../../config/config";
const Cookies = require("js-cookie");
import axios from "axios";

const popup = require("../../../lib/popup");

export default function Login() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [req, setReq] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    change_theme();
  }, []);
  const handleShowPassword = () => {
    showPassword === true ? setShowPassword(false) : setShowPassword(true);
  };
  const handleSubmit = () => {
    axios
      .post(
        `${config.API_URL}auth/create_token`,
        JSON.stringify({
          username: `${req.username}`,
          password: `${req.password}`,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.data) {
          Cookies.set(
            "access_token",
            res.data.access_token,
            { expires: 1 },
            { HttpOnly: true }
          );
          router.push(`/${config.ADMIN_PATH}/dashboard`);
        }
      })
      .catch((err) => {
        if (err) {
          popup.error("Username or Password is wrong", "");
          console.log(err);
        }
      });
  };

  const change_theme = () => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };
  return (
    <>
      <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
          <div className="flex flex-col overflow-y-auto md:flex-row">
            <div className="md:w-1/2 flex justify-center items-center">
              <Image
                className=" dark:hidden"
                src="/img/logo.png"
                width={300}
                height={300}
                alt="Office"
              />
              <Image
                className="hidden dark:block"
                width={300}
                height={300}
                src="/img/logo.png"
                alt="Office"
              />
            </div>
            <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
              <div className="w-full">
                <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                  Login
                </h1>
                <div className="block text-sm">
                  <span className="text-gray-700 dark:text-gray-400 flex gap-2 py-2">
                    <FaUser className="w-5 h-5" /> Username
                  </span>
                  <input
                    className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                    placeholder="Username"
                    name="username"
                    onChange={(e) => {
                      setReq({
                        ...req,
                        username: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="block mt-4 text-sm">
                  <span className="text-gray-700 dark:text-gray-400 flex gap-2 py-2">
                    <FaKey className="w-5 h-5" />
                    Password
                  </span>
                  <div className="relative">
                    <input
                      className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                      name="password"
                      placeholder="***************"
                      type={showPassword ? "text" : "password"}
                      onChange={(e) => {
                        setReq({
                          ...req,
                          password: e.target.value,
                        });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          // 👇️ call submit function here
                          handleSubmit();
                        }
                      }}
                    />
                    {showPassword ? (
                      <FaRegEye
                        onClick={handleShowPassword}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700 cursor-pointer dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-500 w-8 h-8"
                      />
                    ) : (
                      <FaRegEyeSlash
                        onClick={handleShowPassword}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700 cursor-pointer dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-500 w-8 h-8"
                      />
                    )}
                  </div>
                </div>

                <button
                  className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                  onClick={handleSubmit}
                >
                  Log in
                </button>

                {/* <div className="my-8">
                  <button className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium leading-5  text-gray-700 transition-colors duration-150 border border-gray-300 rounded-lg dark:text-gray-400 active:bg-transparent hover:border-gray-500 focus:border-gray-500 active:text-gray-500 focus:outline-none focus:shadow-outline-gray">
                    <FaTelegram className="w-4 h-4 mr-2" />
                    Telegram
                  </button>

                  <p className="mt-4">
                    <Link
                      className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                      href="./forgot-password.html"
                    >
                      Forgot your password?
                    </Link>
                  </p>
                  <p className="mt-1">
                    <Link
                      className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                      href="./create-account.html"
                    >
                      Create account
                    </Link>
                  </p>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
