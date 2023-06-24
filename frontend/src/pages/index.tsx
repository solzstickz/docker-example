import Image from "next/image";
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { FaMoon } from "react-icons/fa";
import Layer from "../../components/Layer";
import moment from "moment";
import Poster from "../../components/Poster";
import axios_client from "../../config/axios_client";
import axios from "axios";
import config from "../../config/config";

interface pages_lastupdate {
  pages_id: number;
  pages_slug: string;
  pages_view: number;
  pages_last_update: string;
  pages_status_showing: string;
  pages_last_ep: number;
  pages_en: string;
  pages_th: string;
  pages_star: number;
  pages_type: string;
  pages_follow: number;
  pages_publish: number;
  pages_title: string;
  pages_simple: string;
  pages_thumbnail: string;
  pages_description: string;
}

export default function Home({ ...props }) {
  const [currentPage, setCurrentPage] = useState(1); // หน้าปัจจุบัน
  const [itemsPerPage, setItemsPerPage] = useState(12); // จำนวนรายการต่อหน้า
  const [totalPages, setTotalPages] = useState(0); // จำนวนหน้าทั้งหมด
  const [displayedPages, setDisplayedPages] = useState([]); // รายการหน้าที่จะแสดงในหน้าปัจจุบัน

  useEffect(() => {
    // คำนวณจำนวนหน้าทั้งหมด
    const total = Math.ceil(props.pages_lastep.length / itemsPerPage);

    setTotalPages(total);
  }, [props.pages_lastep, itemsPerPage]);

  useEffect(() => {
    // กำหนดรายการหน้าที่จะแสดงในหน้าปัจจุบัน
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pagesToDisplay = props.pages_lastep.slice(startIndex, endIndex);
    setDisplayedPages(pagesToDisplay);

  }, [props.pages_lastep, currentPage, itemsPerPage]);

  // ฟังก์ชันเปลี่ยนหน้า
  const changePage = (pageNumber: number) => {
    setCurrentPage(pageNumber);


    // เพิ่มโค้ดด้านล่างเพื่อให้หน้าปัจจุบันแสดงตรงตามหน้าที่คลิกเลือก
    setDisplayedPages(
      props.pages_lastep.slice(
        (pageNumber - 1) * itemsPerPage,
        pageNumber * itemsPerPage
      )
    );
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const visiblePageRange = 1; // จำนวนหมายเลขเพจที่แสดง

    // หาหมายเลขเพจที่แสดงก่อนหน้า
    let startPage = currentPage - visiblePageRange;
    if (startPage < 1) {
      startPage = 1;
    }

    // หาหมายเลขเพจที่แสดงถัดไป
    let endPage = currentPage + visiblePageRange;
    if (endPage > totalPages) {
      endPage = totalPages;
    }

    // เพิ่มหมายเลขเพจลงในอาร์เรย์
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li
          key={i}
          className={`${
            i === currentPage ? "bg-site_color" : "bg-header_bg_menu"
          }  m-2 rounded-md  text-color_white hover:bg-site_color hover:text-color_white ease-out duration-300`}
        >
          <button
            className={`cursor-pointer  px-[10px] py-[5px]`}
            onClick={() => changePage(i)}
          >
            {i}
          </button>
        </li>
      );
    }

    // กำหนดการแสดงเพิ่มเติมหากหมายเลขเพจไม่ได้อยู่ที่ตำแหน่งสุดท้ายของเพจทั้งหมด
    if (endPage < totalPages) {
      pageNumbers.push(
        <li key="next-dots" className="">
          <span className="dots text-color_white">...</span>
        </li>
      );
      pageNumbers.push(
        <li
          key={totalPages}
          className="bg-header_bg_menu  px-[10px] py-[5px] m-2 rounded-md  text-color_white hover:bg-site_color hover:text-color_white ease-out duration-300"
        >
          <button
            className="cursor-pointer"
            onClick={() => changePage(totalPages)}
          >
            {totalPages}
          </button>
        </li>
      );
    }

    return pageNumbers;
  };

  return (
    <>
    <Head>
        <title>Shiba Manga</title>
        <meta property="og:title" content="Shiba Manga" key="title" />
      </Head>
      <Head>
        <meta property="og:title" content="Shiba Manga" key="title" />
      </Head>
      <Layer>
        <section>
          <div className="notify w-full bg-site_color">
            <p className="text-center text-3xl text-color_white">
              ยินดีต้อนรับเข้าสู่เว็บไซต์
            </p>
          </div>
        </section>
        <section className="container mx-auto md:max-w-[1080px]">
          <section>
            <div className="poppular w-full ">
              <div className="poppular-title">
                <h2 className="text-3xl text-site_color">
                  Poppular{" "}
                  <span className="dark:text-color_white text-color_dark_gray">
                    สุดฮิต
                  </span>
                </h2>
              </div>
              <div className="poppular-content grid grid-cols-6">
                {/* {props.pages.map((pages: any, i: number) => {
                    return (
                      <div
                        className="poppular-item mx-auto flex col relative max-w-[160px] "
                        key={i}
                      >
                        <Link href={`/series/${pages.pages_slug}`}>
                          <div className="poppular-item-img h-[220px] w-[160px] relative">
                            <Image
                              src={`${config.CDN_URL}` + pages.pages_thumbnail}
                              fill={true}
                              className="mx-auto rounded-md"
                              alt={pages.pages_title}
                            />
                            <div className="poppular-status absolute w-[40px] h-[20px] bg-site_color shadow-2xl rounded-tl-md rounded-br-md">
                              <p className="text-[16px] text-color_white text-center pt-[2px]">
                                HIT
                              </p>
                            </div>
                          </div>
                          <div className="poppular-item-title text-center h-auto relative">
                            <h3 className="text-2xl dark:text-text_color text-dark_gray line-clamp-2">
                              {pages.pages_title}
                            </h3>
                          </div>
                        </Link>
                      </div>
                    );
                  })} */}
              </div>
            </div>
          </section>
          <section>
            <div className="update_new w-full ">
              <div className="update_new-title">
                <h3 className="text-3xl text-site_color">
                  SITE_NAME{" "}
                  <span className="dark:text-color_white text-color_dark_gray">
                    อัพเดทล่าสุด
                  </span>
                </h3>
              </div>
              <div className="update_new-content grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-10 px-1">
                {displayedPages.map((pages: any, i: number) => {
                  return (
                    <Poster
                      key={i}
                      i={i}
                      pages_id={pages.pages_id}
                      pages_slug={pages.pages_slug}
                      pages_view={pages.pages_view}
                      pages_last_update={pages.pages_last_update}
                      pages_status_showing={pages.pages_status_showing}
                      pages_last_ep={pages.pages_last_ep}
                      pages_en={pages.pages_en}
                      pages_th={pages.pages_th}
                      pages_star={pages.pages_star}
                      pages_type={pages.pages_type}
                      pages_follow={pages.pages_follow}
                      pages_publish={pages.pages_publish}
                      pages_title={pages.pages_title}
                      pages_simple={pages.pages_simple}
                      pages_thumbnail={pages.pages_thumbnail}
                      pages_description={pages.pages_description}
                      posts_slug={pages.posts_slug}
                    />
                  );
                })}
              </div>
              <div className="pagination">
                <div className="w-full">
                  <div className="items-per-page">
                    <ul className="flex justify-center items-center gap-1 py-5">
                      {currentPage > 1 ? (
                        <li className="bg-header_bg_menu m-2 rounded-md  text-color_white hover:bg-site_color hover:text-color_white ease-out duration-300">
                          <button
                            className="cursor-pointer px-[10px] py-[5px]"
                            onClick={() => changePage(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </button>
                        </li>
                      ) : null}
                      {renderPageNumbers()}
                      {currentPage < totalPages ? (
                        <li className="bg-header_bg_menu   m-2 rounded-md  text-color_white hover:bg-site_color hover:text-color_white ease-out duration-300">
                          <button
                            className="cursor-pointer px-[10px] py-[5px]"
                            onClick={() => changePage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </button>
                        </li>
                      ) : null}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </section>
      </Layer>
    </>
  );
}

export async function getServerSideProps() {
  let res_lastep = await axios_client.get(`public/last_updated`);
  let pages_lastep = await res_lastep.data;
  return { props: { pages_lastep } };
}
