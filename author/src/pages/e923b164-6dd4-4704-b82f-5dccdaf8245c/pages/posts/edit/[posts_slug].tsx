import React, { useState, ChangeEvent, FormEvent } from "react";
import Layer from "../../../../../../components/Layer";
import axios from "axios";
import Link from "next/link";
import moment from "moment";
import Select from "react-select";
import { FaUpload, FaReply } from "react-icons/fa";
import config from "../../../../../../config/config";
import { useRouter } from "next/router";
import axios_client from "../../../../../../config/axios_client";
import { useEffect } from "react";
import Image from "next/image";
const popup = require("../../../../../../lib/popup");
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
interface Posts {
  posts_slug: string;
  pages_slug: string;
  posts_ep: number;
  posts_detail: Post_detail[];
}
interface Post_detail {
  url: string;
  image_no: number;
}

export default function edit_posts({ ...props }) {
  const router = useRouter();
  const MySwal = withReactContent(Swal);

  const [edit_posts, setedit_posts] = useState<Posts>({
    posts_slug: "",
    pages_slug: "",
    posts_ep: 0,
    posts_detail: [],
  });
  const [filesArray, setFilesArray] = useState<any[]>([]);

  useEffect(() => {
    setedit_posts({
      ...edit_posts,
      pages_slug: router.query.posts_slug as string,
    });

    if (router.query.posts_slug) {
      const slug = router.query.posts_slug as string;
      get_edit_posts(slug);
    }
  }, [router.query.posts_slug]);

  const get_edit_posts = async (slug: string) => {
    try {
      if (slug != undefined) {
        const res = await axios_client.post(`/posts/${slug}`);
        setedit_posts(res.data);
        console.log(edit_posts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpload = async () => {
    if (filesArray.length) {
      const formData = new FormData();
      for (let i = 0; i < filesArray.length; i++) {
        formData.append("uploads_posts_images", filesArray[i]);
      }

      try {
        MySwal.fire({
          title: "กำลังอัพโหลดรูปภาพ",
          timerProgressBar: true,

          showConfirmButton: false,
          didOpen: () => {
            MySwal.showLoading();
          },
        });
        const res = await axios_client.post(`posts/uploads/posts`, formData);
        MySwal.close();
        popup.success("อัพโหลดรูปภาพสำเร็จแล้ว", "");
        setedit_posts({
          ...edit_posts,
          posts_detail: res.data,
        });
      } catch (err: any) {
        console.log(`pages/edit/index` + err.response);
        if (err.response === undefined) {
          popup.warning("ขนาดไฟล์ Size ใหญ่เกินไป", "");
        } else {
          popup.warning(
            "อัพโหลดรูปภาพไม่สำเร็จ กรุณาอัพโหลดไฟล์ .PNG .WEBP .GIF",
            ""
          );
        }
      }
    } else {
      popup.warning("กรุณาเลือกไฟล์ที่ต้องการอัพโหลด", "");
    }
  };

  const handleFileEvent = (e: ChangeEvent<HTMLInputElement>) => {
    if (edit_posts.posts_detail.length == 0) {
      if (e.target.files) {
        setFilesArray(Array.from(e.target.files));
      }
    } else {
      console.log(edit_posts.posts_detail);
      try {
        axios_client.post(`posts/uploads/delete`, edit_posts.posts_detail);
      } catch (err: any) {
        console.log(`pages/uploads/delete` + err);
      }
      if (e.target.files) {
        setFilesArray(Array.from(e.target.files));
      }

      popup.success("ลบรูปภาพเก่าเรียบร้อยแล้ว", "");
    }
  };

  const handleSubmid = async () => {
    console.log(edit_posts);
    try {
      const res = await axios_client.post(`/posts/edit/post`, edit_posts);
      console.log(res.data);

      popup.success("เพิ่มข้อมูลสำเร็จแล้ว", "");
      router.back();
    } catch (err: any) {
      console.log(`pages/posts/edit:submit` + err);
      popup.warning("เพิ่มข้อมูลไม่สำเร็จ", "");
    }
  };

  return (
    <>
      <Layer>
        <div className="container px-6 mx-auto grid">
          <div className="px-6 my-3 flex justify-start">
            <Link href={`/${config.ADMIN_PATH}/pages/`}>Pages</Link>
            <Link
              href={`/${config.ADMIN_PATH}/pages/posts/${router.query.pages_slug}`}
            >
              /{router.query.pages_slug}
            </Link>

            <p className="text-gray-400">/edit</p>
          </div>
          <div className="px-6 my-3 flex justify-end">
            <button
              className="flex items-center justify-between p-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
              onClick={() => {
                router.push(
                  `/${config.ADMIN_PATH}/pages/posts/${router.query.pages_slug}`
                );
              }}
            >
              <FaReply className="w-3 h-3 m-2" />
              Posts
            </button>
          </div>
          <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
            edit Posts
          </h2>

          <div className="px-4 py-3 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <div className="my-2">
              <span className="text-gray-700 dark:text-gray-400 mt-4 text-sm">
                posts_slug | Exapmle : one-pice-ตอนที่-1
              </span>

              <input
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                required
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setedit_posts({
                    ...edit_posts,
                    posts_slug: e.target.value.split(" ").join("-"),
                  });
                }}
                value={edit_posts.posts_slug || ""}
              />
            </div>
            <div className="my-2">
              <span className="text-gray-700 dark:text-gray-400 mt-4 text-sm">
                posts_ep | Exapmle : one-pice-ตอนที่-1
              </span>

              <input
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                required
                type="number"
                step="0.1"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setedit_posts({
                    ...edit_posts,
                    posts_ep: parseFloat(e.target.value),
                  });
                }}
                value={edit_posts.posts_ep || 0}
              />
            </div>
          </div>

          <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
            edit Posts_detail
          </h2>
          <div className="px-4 py-3 bg-white rounded-lg shadow-md dark:bg-gray-800 my-3">
            <div className="my-2 flex flex-row items-center gap-5">
              <span className="text-gray-700 dark:text-gray-400 text-sm">
                1
              </span>

              <input
                type="file"
                className="block my-5 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 p-3 "
                multiple
                id="fileUpload"
                accept="image/gif,image/webp, image/png"
                onChange={handleFileEvent}
              />
              <button
                className="p-4 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                onClick={handleUpload}
              >
                Upload
              </button>
            </div>
            <div className="uploaded-files-list flex gap-10 flex-wrap justify-center">
              {edit_posts.posts_detail == undefined ? (
                <>
                  <div className="text-gray-700 dark:text-gray-400 text-sm">
                    <p className="text-2xl">กรุณาอัพโหลดรูปภาพ</p>
                  </div>
                </>
              ) : (
                edit_posts.posts_detail.map((item: any, index: number) => (
                  <div
                    className="flex flex-warp flex-col relative h-[500px] w-auto"
                    key={index}
                    style={{ height: "500px", width: "auto" }}
                  >
                    <Image
                      className="w-full h-full block"
                      src={`https://sv3.9tailmanga.com/${item.url}`}
                      alt=""
                      object-fit="cover"
                      width={500}
                      height={500}
                      quality={1}
                      // priority={true}
                    />

                    <span className="text-gray-700 dark:text-gray-400 text-xl text-center">
                      {item.image_no}
                    </span>
                  </div>
                ))
              )}
            </div>
            <div className="my-2">
              <button
                className="w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-600 border border-transparent rounded-lg active:bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-green my-3"
                type="button"
                onClick={handleSubmid}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </Layer>
    </>
  );
}
