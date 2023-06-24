import React from "react";
import Link from "next/link";
import Image from "next/image";
import Layer from "../../../components/Layer";
import axios from "axios";
interface pages {
  pages_id: number;
  pages_slug: string;
  pages_thumbnail: string;
  pages_detail: object;
}
export default function index({ ...props }, pages: pages, i: number) {
  
  return (
    <>
      <Layer>
        <div className="poppular w-full ">
          <div className="poppular-title">
            <h2 className="text-3xl text-site_color">
              Poppular <span className="text-color_white">สุดฮิต</span>
            </h2>
          </div>
          <div className="poppular-content grid grid-cols-6">
            {props.res_pages.map((pages: any, i: number) => {
              return (
                <div
                  className="poppular-item mx-auto flex col relative max-w-[160px] "
                  key={i}
                >
                  <Link href={`/pages/${pages.pages_slug}`}>
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
      </Layer>
    </>
  );
}

export async function getServerSideProps(context: any) {
  let res = await axios.post("http://localhost:7777/pages/");
  let res_pages = await res.data;

  return { props: { res_pages } };
}
