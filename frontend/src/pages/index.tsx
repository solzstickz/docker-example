import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { FaMoon } from "react-icons/fa";
import Layer from "../../components/Layer";
import moment from "moment";
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
        <div className="container mx-auto">
          <section>
            <div className="poppular w-full ">
              <div className="poppular-title">
                <h2 className="text-3xl text-site_color">
                  Poppular <span className="text-color_white">สุดฮิต</span>
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
                          <h3 className="text-2xl text-text_color line-clamp-2">
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
                <h2 className="text-3xl text-site_color">
                  SITE_NAME{" "}
                  <span className="text-color_white">อัพเดทล่าสุด</span>
                </h2>
              </div>
              <div className="update_new-content grid grid-cols-6">
                {props.pages_lastep.map((pages: any, i: number) => {
                  return (
                    <div
                      className="update_new-item mx-auto flex flex-col relative max-w-[250px] hover:scale-110 transition-all hover:bg-color_white hover:rounded-md"
                      key={i}
                    >
                      <Link href={`/series/${pages.pages_slug}`}>
                        <div className="update_new-item-img h-[250px] w-[200px] relative  p-3 ">
                          <Image
                            src={pages.pages_detail.thumbnail}
                            fill={true}
                            className="mx-auto rounded-md "
                            alt={pages.pages_detail.title}
                          />
                          <div className="update_new-status absolute w-[60px] h-[25px] bg-site_color shadow-2xl rounded-tl-md rounded-br-md">
                            <p className="text-[16px] text-color_white text-center pt-[2px]">
                              HIT
                            </p>
                          </div>
                        </div>
                        <div className="update_new-item-title text-center h-auto relative">
                          <h3 className="text-2xl text-text_color line-clamp-2">
                            {pages.pages_detail.info.EN}
                          </h3>
                        </div>
                      </Link>
                      <div className="last_ep flex justify-around items-center">
                        <Link
                          href={`/${pages.posts_slug}`}
                          className="text-[16px] text-color_white text-center my-2 px-3 py-1 rounded-full bg-header_bg_dark hover:bg-site_color transition-all"
                        >
                          ตอนที่ {pages.posts_ep}
                        </Link>
                        <span className="text-[16px] text-color_gray">
                          {moment(pages.posts_date).startOf("day").fromNow()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </Layer>
    </>
  );
}
export async function getServerSideProps(context: any) {
  let res = await axios.post(`${process.env.API_END_POINT}pages/`);
  let res_lastep = await axios.post(`${process.env.API_END_POINT}last_updated`);
  let pages_lastep = await res_lastep.data;
  let pages = await res.data;
  console.log(pages);
  return { props: { pages, pages_lastep } };
}
