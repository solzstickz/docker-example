import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FaMoon } from "react-icons/fa";
import Layer from "../../components/Layer";
import moment from "moment";
import Poster from "../../components/Poster";
interface pages {
  pages_id: number;
  pages_slug: string;
  pages_thumbnail: string;
  pages_detail: object;
}
export default function Home({ ...props }) {
  return (
    <>
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
                {props.pages.map((pages: any, i: number) => {
                  return (
                    <div
                      className="poppular-item mx-auto flex col relative max-w-[160px] "
                      key={i}
                    >
                      <Link href={`/series/${pages.pages_slug}`}>
                        <div className="poppular-item-img h-[220px] w-[160px] relative">
                          <Image
                            src={pages.pages_detail.thumbnail}
                            fill={true}
                            className="mx-auto rounded-md"
                            alt={pages.pages_detail.title}
                          />
                          <div className="poppular-status absolute w-[40px] h-[20px] bg-site_color shadow-2xl rounded-tl-md rounded-br-md">
                            <p className="text-[16px] text-color_white text-center pt-[2px]">
                              HIT
                            </p>
                          </div>
                        </div>
                        <div className="poppular-item-title text-center h-auto relative">
                          <h3 className="text-2xl dark:text-text_color text-dark_gray line-clamp-2">
                            {pages.pages_detail.title}
                          </h3>
                        </div>
                      </Link>
                    </div>
                  );
                })}
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
              <div className="update_new-content grid grid-cols-5">
                {props.pages_lastep.map((pages: any, i: number) => {
                  return (
                    <Poster
                      key={i}
                      i={i}
                      pages_slug={pages.pages_slug}
                      pages_detail={pages.pages_detail}
                      posts_slug={pages.posts_slug}
                      posts_ep={pages.posts_ep}
                      posts_date={pages.posts_create}
                    />
                  );
                })}
              </div>
            </div>
          </section>
        </section>
      </Layer>
    </>
  );
}
export async function getServerSideProps(context: any) {
  let res = await axios.get(`${process.env.API_END_POINT}/public/pages`);
  let res_lastep = await axios.get(
    `${process.env.API_END_POINT}/public/last_updated`
  );
  let pages_lastep = await res_lastep.data;
  let pages = await res.data;
  console.log(pages_lastep, pages);

  return { props: { pages, pages_lastep } };
}
