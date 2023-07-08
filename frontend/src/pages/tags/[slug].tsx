import React from "react";
import Layer from "../../../components/Layer";
import Poster from "../../../components/Poster";
import axios_client from "../../../config/axios_client";
import { useEffect, useState, Suspense } from "react";
import config from "../../../config/config";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import Loading from "../../../components/Loading";
export default function Tags_slug({ ...props }) {
  const [currentPage, setCurrentPage] = useState(1); // หน้าปัจจุบัน
  const [itemsPerPage, setItemsPerPage] = useState(20); // จำนวนรายการต่อหน้า
  const [totalPages, setTotalPages] = useState(0); // จำนวนหน้าทั้งหมด
  const [displayedPages, setDisplayedPages] = useState([]); // รายการหน้าที่จะแสดงในหน้าปัจจุบัน
  // const Poster = React.lazy(() => import("../../../components/Poster"));
  const router = useRouter();

  //! is mobile ? show 10 : show 20
  useEffect(() => {
    const updateItemsPerPage = () => {
      const isMobile = window.innerWidth <= 768; // เช็คว่าเป็นโมบายหรือไม่ (ตัวอย่างใช้ขนาดหน้าจอ <= 768px)
      const perPage = isMobile ? 10 : 20; // กำหนดจำนวนรายการต่อหน้าใหม่ตามเงื่อนไข
      setItemsPerPage(perPage); // อัปเดตจำนวนรายการต่อหน้า
    };

    // เรียกฟังก์ชันอัปเดตเมื่อหน้าจอเปลี่ยนขนาด
    window.addEventListener("resize", updateItemsPerPage);
    updateItemsPerPage(); // เรียกฟังก์ชันเมื่อคอมโพเนนต์ถูกโหลด

    // คืนค่าฟังก์ชันเพื่อทำความสะอาดเมื่อคอมโพเนนต์ถูกยกเลิก
    return () => {
      window.removeEventListener("resize", updateItemsPerPage);
    };
  }, []);

  useEffect(() => {
    // คำนวณจำนวนหน้าทั้งหมด
    const total = Math.ceil(props.tags.length / itemsPerPage);
    setTotalPages(total);
  }, [props.keyword, itemsPerPage, router.query.slug, props.tags]);

  useEffect(() => {
    // กำหนดรายการหน้าที่จะแสดงในหน้าปัจจุบัน
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pagesToDisplay = props.tags.slice(startIndex, endIndex);
    setDisplayedPages(pagesToDisplay);
  }, [props.keyword, currentPage, itemsPerPage, router.query.slug, props.tags]);

  // ฟังก์ชันเปลี่ยนหน้า
  const changePage = (pageNumber: number) => {
    // เพิ่มโค้ดด้านล่างเพื่อให้หน้าปัจจุบันแสดงตรงตามหน้าที่คลิกเลือก
    // ใช้ setTimeout เพื่อให้มีเวลาในการโหลดข้อมูล
    window.scrollTo(0, 0);
    let change_scroll = new Promise((resolve, reject) => {
      setTimeout(() => {
        setCurrentPage(pageNumber);
        resolve(
          setDisplayedPages(
            props.tags.slice(
              (pageNumber - 1) * itemsPerPage,
              pageNumber * itemsPerPage
            )
          )
        );
      }, 800);
    });
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
      <NextSeo
        title={`อ่านมังงะแปลไทย - ${props.keyword} - ${config.SITE_NAME}`}
        description={`อ่านมังงะแปลไทย manga เว็บมังงะ เว็บอ่านการ์ตูนออนไลน์ - ${props.keyword} - อ่านการ์ตูนฟรี มังงะใหม่ เกาหลี จีน ญี่ปุ่น มังงะ18+ - ${config.SITE_NAME} แปลไทยอัพเดทล่าสุด`}
        canonical={`${config.SITE_URL}tags/${props.keyword}`}
      />
      <Layer>
        <section>
          <div className="notify w-full bg-site_color">
            <h1 className="text-center text-3xl text-color_white">
              อ่านการ์ตูนแปลไทย {props.keyword.toUpperCase()} อ่านมังงะแปลไทย{" "}
              เสพความสนุกได้แล้วที่ {config.SITE_NAME}
            </h1>
          </div>
        </section>
        <div className="container mx-auto md:max-w-[1080px] px-3">
          <section>
            <div className="tags w-full ">
              <div className="tags-title py-5">
                <h2 className="text-3xl text-site_color">
                  อ่านการ์ตูน
                  <span className="text-color_dark dark:text-color_white">
                    {" "}
                    {props.keyword.toUpperCase()} อัพเดทล่าสุด
                  </span>
                </h2>
              </div>
              <div className="update_new-content grid grid-cols-2  md:grid-cols-3 gap-1  lg:grid-cols-5 relative min-h-[200px]">
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
        </div>
      </Layer>
    </>
  );
}
export async function getServerSideProps(context: any) {
  let keyword = context.params.slug;
  try {
    let fetch_tags = await axios_client.get(
      `public/tags/${context.params.slug}`
    );
    let res = await fetch_tags;
    let tags = res.data;

    // ตรวจสอบว่ามีข้อมูลใน tags หรือไม่
    if (!tags) {
      return {
        notFound: true,
      };
    }
    return { props: { tags, keyword } };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
