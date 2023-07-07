import React, { useEffect, useState } from "react";
import Layer from "../../../components/Layer";
import config from "../../../config/config";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [displayedPages, setDisplayedPages] = useState<Page[]>([]);
  const [favorite, setFavorite] = useState<Page[]>([]);
  const router = useRouter();
  useEffect(() => {
    const favoriteData = JSON.parse(localStorage.getItem("favorite") || "[]");
    setFavorite(favoriteData);
    const total = Math.ceil(favoriteData.length / itemsPerPage);
    setTotalPages(total);
  }, [itemsPerPage]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pagesToDisplay = favorite.slice(startIndex, endIndex);
    setDisplayedPages(pagesToDisplay);
  }, [favorite, currentPage, itemsPerPage]);

  const changePage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pagesToDisplay = favorite.slice(startIndex, endIndex);
    setDisplayedPages(pagesToDisplay);
  };

  const handleUnfavoriteClick = (pagesSlug: string) => {
    const updatedFavorite = favorite.filter(
      (page) => page.pages_slug !== pagesSlug
    );
    setFavorite(updatedFavorite);
    localStorage.setItem("favorite", JSON.stringify(updatedFavorite));
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
          <a>
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
          <a>
            <button
              className="cursor-pointer"
              onClick={() => changePage(totalPages)}
            >
              {totalPages}
            </button>
          </a>
        </li>
      );
    }

    return pageNumbers;
  };
  return (
    <>
      <NextSeo canonical={`${config.SITE_URL}favorite`} />
      <Layer>
        <section>
          <div className="notify w-full bg-site_color">
            <h1 className="text-center text-3xl text-color_white">
              อ่านการ์ตูนแปลไทย ที่ชื่นชอบ เสพความสนุกก่อนใครได้ที่{" "}
              {config.SITE_NAME}
            </h1>
          </div>
        </section>
        <div className="container mx-auto md:max-w-[1080px] px-3">
          <section>
            <section>
              <div className="favorite w-full ">
                <div className="favorite-title py-5">
                  <h2 className="text-3xl text-site_color font-bold">
                    FAVORITE LIST
                  </h2>
                </div>
                <div className="update_new-content grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-10">
                  {favorite.length > 0 ? (
                    displayedPages.map((pages: any, i: number) => (
                      <div className="relative" key={pages.pages_slug}>
                        <div className="update_new-item flex flex-col relative mx-auto   md:max-w-[200px] hover:animate-pulse transition-all ease-out delay-300  dark:text-text_color text-color_dark_gray hover:bg-site_color hover:text-site_color shadow-2xl rounded-md hover:border-none">
                          <Link
                            href={`/series/${pages.pages_slug}`}
                            title={`อ่านการ์ตูน ${pages.pages_en}`}
                          >
                            <div className="update_new-item-img min-h-[230px] max-h-[230px] overflow-hidden md:w-[200px] md:min-h-[280px] md:max-h-[280px] md:h-[280px] w-full relative">
                              <Image
                                src={`${config.CDN_URL}${pages.pages_thumbnail}`}
                                className="mx-auto rounded-tl-md rounded-tr-md"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                priority
                                alt={pages.pages_title}
                                title={`${pages.pages_title}`}
                              />
                              <div
                                className={`update_new-status absolute w-[25px] h-[17px] shadow-2xl rounded-tl-md rounded-br-md top-0 left-0`}
                              >
                                {pages.pages_type === "Manga" ? (
                                  <Image
                                    className="rounded-tl-md rounded-br-md"
                                    src="/img/Manga.png"
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    alt="Manga"
                                    title="Manga"
                                    priority
                                  />
                                ) : pages.pages_type === "Manhwa" ? (
                                  <Image
                                    className="rounded-tl-md rounded-br-md"
                                    src="/img/Manhwa.png"
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    alt="Manhwa"
                                    title="Manhwa"
                                    priority
                                  />
                                ) : pages.pages_type === "Manhua" ? (
                                  <Image
                                    className="rounded-tl-md rounded-br-md"
                                    src="/img/Manhua.png"
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    alt="Manhua"
                                    title="Manhua"
                                    priority
                                  />
                                ) : null}
                              </div>
                            </div>
                            <div className="update_new-item-title text-center h-auto relative md:max-w-[200px] mx-auto">
                              <p className="text-2xl font-bold line-clamp-1">
                                {pages.pages_en}
                              </p>
                              <div className="last_ep flex justify-center items-center text-center w-full mb-4">
                                <Link
                                  className=" w-5/6  text-color_white justify-between mx-auto px-1 py-2 text-md font-medium leading-5  transition-colors duration-150 bg-site_color rounded-lg active:bg-site_color hover:bg-site_color focus:outline-none focus:shadow-outline-bg-site_color"
                                  href={`/series/${pages.pages_slug}`}
                                >
                                  รับชมได้ทุก {pages.pages_status_showing}
                                </Link>
                              </div>
                            </div>
                          </Link>
                          <div
                            className="flex justify-center items-center text-center w-full my-4"
                            onClick={() =>
                              handleUnfavoriteClick(pages.pages_slug)
                            }
                          >
                            <button className=" w-5/6  text-color_white justify-between mx-auto px-1 py-2 text-xl font-medium leading-5  transition-colors duration-150 bg-color_red rounded-lg active:bg-color_red hover:bg-color_red focus:outline-none focus:shadow-outline-bg-color_red">
                              ลบ
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col justify-center items-center w-full h-[300px]">
                      <h2 className="text-2xl font-bold text-center dark:text-color_white text-color_dark">
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
                            <a href={`/favorite#`}>
                              <button
                                className="cursor-pointer"
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
                          <li className="bg-header_bg_menu  px-[10px] py-[5px] m-2 rounded-md  text-color_white hover:bg-site_color hover:text-color_white ease-out duration-300">
                            <a href={`/favorite#`}>
                              <button
                                className="cursor-pointer"
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
