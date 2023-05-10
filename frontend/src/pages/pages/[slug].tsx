import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layer from "../../../components/Layer";
import axios from "axios";
import Image from "next/image";
import { FaStar, FaBookOpen } from "react-icons/fa";
import Link from "next/link";
interface pages {
  pages_id: number;
}

export default function pages() {
  const router = useRouter();
  console.log(router.query.slug);
  const fake_data = [
    {
      pages_id: 10,
      pages_date: "2021-10-10",
    },
    {
      pages_id: 9,
      pages_date: "2021-10-10",
    },
    {
      pages_id: 8,
      pages_date: "2021-10-10",
    },
    {
      pages_id: 7,
      pages_date: "2021-10-10",
    },
    {
      pages_id: 6,
      pages_date: "2021-10-10",
    },
    {
      pages_id: 5,
      pages_date: "2021-10-10",
    },
    {
      pages_id: 4,
      pages_date: "2021-10-10",
    },
    {
      pages_id: 3,
      pages_date: "2021-10-10",
    },
    {
      pages_id: 2,
      pages_date: "2021-10-10",
    },
    {
      pages_id: 1,
      pages_date: "2021-10-10",
    },
  ];
  const [pages, setPages] = useState<pages[]>([]);
  useEffect(() => {
    setPages(fake_data);
  }, []);
  useEffect(() => {
    return () => {
      set_last();
    };
  }, []);
  const set_last = () => {
    let doc = document.querySelectorAll(".ep_container");
    let max = doc.length;
    console.log("max" + max);
  };
  return (
    <Layer>
      <div className="page relative">
        <div className="pages_thumb relative z-0   overflow-hidden">
          <div className="pages_thumb_img bg-cover bg-center h-[300px]  bg-no-repeat  bg-[url('https://filebroker-cdn.lazada.co.th/kf/S30b10ad751714ed0934f316bac4f66f7a.jpg')]"></div>
        </div>
        <div className="pages_detail relative w-full bottom-[100px] container h-100 mx-auto flex  md:col z-10 flex-col-reverse md:flex-row-reverse px-5 md:px-0">
          <div className="pages_deltail_ep w-full md:w-4/5">
            <div className="title">
              <h1 className="text-3xl md:text-7xl text-color_white font-bold my-5 md:my-0">
                One Piece เกาะวาโนคุนิ
              </h1>
            </div>
            <div className="tags mt-[50px]">
              <div className="tags_title my-5">
                <h2 className="text-3xl dark:text-color_gray font-bold">
                  tags
                </h2>
              </div>
              <Link
                href="/"
                className="bg-header_bg_menu py-[8px] px-[15px] m-2 rounded-md mx-2 dark:text-color_white hover:bg-site_color hover:text-color_white ease-out duration-300"
              >
                มังงะที่ถูกใจ
              </Link>
            </div>
            <div className="pages_content md:mx-10">
              <div className="story my-10 text-left text-color_gray text-2xl">
                <p>เรื่องย่อ</p>
                <p>Reincarnation Of The Strongest Sword God แปลไทย</p>
                <p>
                  เริ่มต้นใหม่อีกครั้ง เขาได้เข้าสู่ “เกมที่มีชีวิต”
                  เพื่อควบคุมชะตากรรมของเขา คราวนี้เขาจะไม่ถูกคนอื่นควบคุม
                  ก่อนหน้านี้ ราชาดาบเลเวล 200 เขาจะขึ้นสู่จุดสูงสุดในชีวิตนี้
                  วิธีหาเงิน! กลยุทธ์พิชิตดันเจี้ยน! ภารกิจในตำนาน!
                  ที่ตั้งอุปกรณ์! เทคนิคการต่อสู้ที่ยังไม่ถูกค้นพบ!
                  แม้แต่ความลับที่ผู้ทดสอบเบต้าไม่มีความรู้ เขาก็รู้ทั้งหมด
                  สงครามขนาดมหึมา เข้าสู่ความเป็นเทพ เข้าถึงจุดสูงสุดด้วยดาบ
                  ตำนานเทพดาบเพิ่งเริ่มต้นขึ้น
                </p>
              </div>
              <div className="back_homepage w-auto text-site_color md:gap-2 my-3 grid grid-cols-1">
                <span className="">
                  <Link href="/">หน้าแรก</Link>
                  &nbsp;|&nbsp;
                  <Link href="/">
                    อ่าน Reincarnation Of The Strongest Sword God แปลไทย
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
                    {pages.map((item: any, index: number) => {
                      if (index === 0) {
                        return (
                          <li
                            key={index}
                            className="bg-header_bg_dark m-2 p-2 rounded-md hover:bg-site_color hover:text-color_white"
                          >
                            <Link href="/">
                              <div
                                className={`ep_container  flex gap-5 text-site_color hover:text-color_white`}
                              >
                                <div className="ep_icon text-2xl font-bold flex justify-center items-center bg-pages_bg_bookopen p-4 rounded-md">
                                  <FaBookOpen className="text-md" />
                                </div>
                                <div className="ep_text">
                                  <div className="text-xl ">
                                    <p className="">ตอนที่{item.pages_id}</p>
                                  </div>
                                  <div className="ep_date">
                                    <p className="text-sm">{item.pages_date}</p>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </li>
                        );
                      } else {
                        return (
                          <li
                            key={index}
                            className="bg-header_bg_dark m-2 p-2 rounded-md hover:bg-site_color hover:text-color_white"
                          >
                            <Link href="/">
                              <div
                                className={`ep_container  flex gap-5 text-color_gray hover:text-color_white`}
                              >
                                <div className="ep_icon text-2xl font-bold flex justify-center items-center bg-pages_bg_bookopen p-4 rounded-md">
                                  <FaBookOpen className="text-md" />
                                </div>
                                <div className="ep_text">
                                  <div className="text-xl ">
                                    <p className="">ตอนที่{item.pages_id}</p>
                                  </div>
                                  <div className="ep_date">
                                    <p className="text-sm">{item.pages_date}</p>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </li>
                        );
                      }
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="pages_deltail_info w-full md:w-1/5 flex justify-center md:justify-start flex-col">
            <div className="thumb mx-auto w-[250px] h-[300px] relative">
              <Image
                src="https://filebroker-cdn.lazada.co.th/kf/S30b10ad751714ed0934f316bac4f66f7a.jpg"
                fill={true}
                className="rounded-md box-shadow-2xl object-contain"
                alt="test"
              />
            </div>
            <div className="status w-full flex my-2 h-[50px]">
              <div className="type w-full  bg-pages_status_type flex items-center justify-center rounded-l-full text-center text-color_white text-2xl p-3">
                มังงะ
              </div>
              <div className="status_showing bg-pages_status_showing flex items-center justify-center w-full rounded-r-full text-center text-color_white text-2xl">
                วันพฤษหัสบดี
              </div>
            </div>
            <div className="star w-full h-[50px] bg-pages_bg_star flex justify-center items-center rounded-full my-2">
              <div className="icon relative">
                <FaStar className="text-pages_star text-[20px] absolute right-6 top-[3px]" />
                <span className="text-[20px] leading-2 text-color_white font-bold">
                  1.5
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
              <p className="text-color_gray"> มีผู้ติดตามจำนวน ?</p>
            </div>
            <div className="sub w-full rounded-md bg-header_bg_dark p-5 ">
              <ul>
                <li>
                  <p className="font-bold text-color_gray text-2xl">
                    English: <span> One pice</span>
                  </p>
                </li>
                <li>
                  <p className="font-bold text-color_gray text-2xl">
                    ภาษาไทย: <span> วันพีช</span>
                  </p>
                </li>
                <li>
                  <p className="font-bold text-color_gray text-2xl">
                    ตอนที่: <span> last_show</span>
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
