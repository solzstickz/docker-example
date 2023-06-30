import React, { useEffect, useState } from "react";
import Layer from "../../../components/Layer";
import Poster from "../../../components/Poster";
import axios_client from "../../../config/axios_client";
import { NextSeo } from "next-seo";
import config from "../../../config/config";
import { useRouter } from "next/router";
export default function Search_slug({ ...props }) {
  const [currentPage, setCurrentPage] = useState(1); // หน้าปัจจุบัน
  const [itemsPerPage, setItemsPerPage] = useState(20); // จำนวนรายการต่อหน้า
  const [totalPages, setTotalPages] = useState(0); // จำนวนหน้าทั้งหมด
  const [displayedPages, setDisplayedPages] = useState([]); // รายการหน้าที่จะแสดงในหน้าปัจจุบัน
  const router = useRouter();
  useEffect(() => {
    // คำนวณจำนวนหน้าทั้งหมด
    const total = Math.ceil(props.search.length / itemsPerPage);

    setTotalPages(total);
  }, [props.search, itemsPerPage]);

  useEffect(() => {
    // กำหนดรายการหน้าที่จะแสดงในหน้าปัจจุบัน
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pagesToDisplay = props.search.slice(startIndex, endIndex);
    setDisplayedPages(pagesToDisplay);
  }, [props.search, currentPage, itemsPerPage]);

  // ฟังก์ชันเปลี่ยนหน้า
  const changePage = (pageNumber: number) => {
    setCurrentPage(pageNumber);

    // เพิ่มโค้ดด้านล่างเพื่อให้หน้าปัจจุบันแสดงตรงตามหน้าที่คลิกเลือก
    setDisplayedPages(
      props.search.slice(
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
          <a href={`/search/${router.query.slug}#`}>
            <button
              className={`cursor-pointer  px-[10px] py-[5px]`}
              onClick={() => changePage(i)}
            >
              {i}
            </button>
          </a>
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
        title={`Search: ${props.keyword}`}
        description={`Search: ${props.keyword}`}
        canonical={`${config.SITE_URL}search/${props.keyword}`}
      />
      <Layer>
        <div className="container mx-auto md:max-w-[1080px] px-3">
          <section>
            <section>
              <div className="search w-full">
                <div className="search-title py-5">
                  <h2 className="text-3xl text-site_color ">
                    Search:
                    <span className="text-color_white"> {props.keyword}</span>
                  </h2>
                </div>
                <div className="update_new-content grid grid-cols-2  md:grid-cols-3 gap-1  lg:grid-cols-5">
                  {props.search.map((pages: any, i: number) => {
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
                            <a href={`/search/${router.query.slug}#`}>
                              <button
                                className="cursor-pointer px-[10px] py-[5px]"
                                onClick={() => changePage(currentPage - 1)}
                                disabled={currentPage === 1}
                              >
                                Previous
                              </button>
                            </a>
                          </li>
                        ) : null}
                        {renderPageNumbers()}
                        {currentPage < totalPages ? (
                          <li className="bg-header_bg_menu   m-2 rounded-md  text-color_white hover:bg-site_color hover:text-color_white ease-out duration-300">
                            <a href={`/search/${router.query.slug}#`}>
                              <button
                                className="cursor-pointer px-[10px] py-[5px]"
                                onClick={() => changePage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                              >
                                Next
                              </button>
                            </a>
                          </li>
                        ) : null}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </section>
        </div>
      </Layer>
    </>
  );
}
export async function getServerSideProps(context: any) {
  try {
    let keyword = context.params.slug;
    let res = await axios_client.get(`public/search/${context.query.slug}`);
    let search = await res.data;

    return { props: { search, keyword } };
  } catch (err) {
    console.log(err);
    return { props: { search: [], keyword: context.query.slug } };
  }
}
