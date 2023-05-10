import React from "react";
import Link from "next/link";
import Image from "next/image";
import Layer from "../../../components/Layer";
import axios from "axios";
interface post {
  pages_id: number;
  pages_slug: string;
  pages_thumbnail: string;
  pages_detail: object;
}
export default function index({ ...props }, post: post, i: number) {
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
            {props.res_posts.map((post: any, i: number) => {
              return (
                <div
                  className="poppular-item mx-auto flex col relative max-w-[160px] "
                  key={i}
                >
                  <Link href={`/pages/${post.pages_slug}`}>
                    <div className="poppular-item-img h-[220px] w-[160px] relative">
                      <Image
                        src={post.pages_thumbnail}
                        fill={true}
                        className="mx-auto rounded-md"
                        alt={post.pages_detail.title}
                      />
                      <div className="poppular-status absolute w-[40px] h-[20px] bg-site_color shadow-2xl rounded-tl-md rounded-br-md">
                        <p className="text-[16px] text-color_white text-center pt-[2px]">
                          HIT
                        </p>
                      </div>
                    </div>
                    <div className="poppular-item-title text-center h-auto relative">
                      <h3 className="text-2xl text-text_color line-clamp-2">
                        {post.pages_detail.title}
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
  let res = await axios.get("http://localhost:7777/");
  let res_posts = await res.data;
  console.log(res_posts);
  return { props: { res_posts } };
}
