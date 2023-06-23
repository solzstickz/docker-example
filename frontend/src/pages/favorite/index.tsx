import React, { useEffect, useState } from "react";
import Layer from "../../../components/Layer";
import Poster from "../../../components/Poster";
import axios_client from "../../../config/axios_client";
type PostDetail = {
  alt: string;
  url: string;
  image_no: number;
};

type Post = {
  posts_id: number;
  posts_slug: string;
  pages_id: number;
  posts_ep: number;
  posts_detail: PostDetail[];
  posts_create: string;
  posts_views: number;
};

type Page = {
  posts_id: number;
  posts_slug: string;
  pages_id: number;
  posts_ep: number;
  posts_detail: PostDetail[];
  posts_create: string;
  posts_views: number;
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
};
export default function Favorite() {
  const [currentPage, setCurrentPage] = useState(1); // หน้าปัจจุบัน
  const [itemsPerPage, setItemsPerPage] = useState(12); // จำนวนรายการต่อหน้า
  const [totalPages, setTotalPages] = useState(0); // จำนวนหน้าทั้งหมด
  const [displayedPages, setDisplayedPages] = useState([]); // รายการหน้าที่จะแสดงในหน้าปัจจุบัน
  const [favorite, setFavorite] = useState([]); // ค่า favorite จาก localStorage
  useEffect(() => {
    const favoriteData = JSON.parse(localStorage.getItem("favorite") || "[]");
    setFavorite(favoriteData);

    // คำนวณจำนวนหน้าทั้งหมด
    const total = Math.ceil(favorite.length / itemsPerPage);
    setTotalPages(total);
  }, [favorite, itemsPerPage]);
  useEffect(() => {
    // กำหนดรายการหน้าที่จะแสดงในหน้าปัจจุบัน
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const pagesToDisplay = favorite.slice(startIndex, endIndex);
    setDisplayedPages(pagesToDisplay);
  }, [favorite, currentPage, itemsPerPage]);
  // ฟังก์ชันเปลี่ยนหน้า
  const changePage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    console.log(currentPage);

    // เพิ่มโค้ดด้านล่างเพื่อให้หน้าปัจจุบันแสดงตรงตามหน้าที่คลิกเลือก
    setDisplayedPages(
      favorite.slice((pageNumber - 1) * itemsPerPage, pageNumber * itemsPerPage)
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
          }  px-[10px] py-[5px] m-2 rounded-md  text-color_white hover:bg-site_color hover:text-color_white ease-out duration-300`}
        >
          <button className={`cursor-pointer`} onClick={() => changePage(i)}>
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
  //! set favorite
  const handleUnfavoriteClick = () => {
    const favoriteStatus = localStorage.getItem("favorite");
    if (favoriteStatus) {
      const favoriteData = JSON.parse(favoriteStatus);
      const pagesSlug = favorite.pages_slug;
      const updatedFavoriteData = favoriteData.filter(
        (favorite: any) => favorite.pages_slug !== pagesSlug
      );
      localStorage.setItem("favorite", JSON.stringify(updatedFavoriteData));
    }
  };
  return (
    <Layer>
      <div className="container mx-auto max-w-[1080px]">
        <section>
          <section>
            <div className="tags w-full ">
              <div className="tags-title">
                <h2 className="text-3xl text-site_color">รายการที่ชื่นชอบ:</h2>
              </div>
              <div className="update_new-content grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-10">
                {favorite.length > 0 ? (
                  displayedPages.map((pages: any, i: number) => (
                    <>
                      <div className="relative">
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

                        <div
                          className="flex justify-center items-center text-center w-full my-4"
                          onClick={handleUnfavoriteClick}
                        >
                          <button className=" w-5/6  text-color_white justify-between mx-auto px-4 py-2 text-xl font-medium leading-5 text-white transition-colors duration-150 bg-color_red rounded-lg active:bg-color_red hover:bg-color_red focus:outline-none focus:shadow-outline-bg-color_red">
                            Unfavorite
                          </button>
                        </div>
                      </div>
                    </>
                  ))
                ) : (
                  <div className="flex flex-col justify-center items-center w-full h-[300px]">
                    <h2 className="text-2xl font-bold text-center">
                      ยังไม่มีรายการที่ชื่นชอบ
                    </h2>
                  </div>
                )}
              </div>
              <div className="pagination">
                <div className="w-full">
                  <div className="items-per-page">
                    <ul className="flex justify-center items-center gap-1 py-5">
                      {currentPage > 1 ? (
                        <li className="bg-header_bg_menu  px-[10px] py-[5px] m-2 rounded-md  text-color_white hover:bg-site_color hover:text-color_white ease-out duration-300">
                          <button
                            className="cursor-pointer"
                            onClick={() => changePage(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </button>
                        </li>
                      ) : null}
                      {renderPageNumbers()}
                      {currentPage < totalPages ? (
                        <li className="bg-header_bg_menu  px-[10px] py-[5px] m-2 rounded-md  text-color_white hover:bg-site_color hover:text-color_white ease-out duration-300">
                          <button
                            className="cursor-pointer"
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
      </div>
    </Layer>
  );
}
