import React from "react";
import axios from "axios";
import Layer from "../../components/Layer";
import Image from "next/image";
interface post {
  posts_id: number;
  posts_slug: string;
  pages_id: number;
  posts_ep: number;
  posts_detail: {};
  posts_create: Date;
  posts_views: number;
}

export default function post({ ...props }) {
  return (
    <>
      <Layer>
        <div className="container mx-auto">
          <div className="content w-full flex justify-center flex-col text-center">
            <div className="title my-3">
              <h2 className="dark:text-color_white text-5xl font-bold">
                {props.post.pages_detail.info.EN} ตอนที่
                {props.post.posts_ep}
              </h2>
            </div>
            <div className="desc my-3">
              <p className="dark:text-color_gray">
                อ่านมังงะ มังฮวา การ์ตูนเรื่อง {props.post.pages_detail.info.EN}
                {props.post.pages_detail.info.TH} ตอนที่ {props.post.posts_ep}
                at SITE_NAME – มังงะแปลไทย
              </p>
            </div>
            <div className="reading">
              {props.post.posts_detail.image.map((images: any, i: number) => {
                return (
                  <div className="relative mx-auto w-full h-auto" key={i}>
                    <Image
                      src={images.url}
                      alt={images.alt}
                      width={100}
                      height={100}
                      layout="responsive"
                      objectFit="contain"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Layer>
    </>
  );
}

export async function getServerSideProps(context: any) {
  let res = await axios.post(
    `http://localhost:7777/posts/${context.query.post}`
  );
  let post = res.data[0];
  console.log(post);
  return {
    props: {
      post,
    },
  };
}
