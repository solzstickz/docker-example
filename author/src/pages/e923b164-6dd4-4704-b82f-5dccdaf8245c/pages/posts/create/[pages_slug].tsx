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
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { create } from "domain";
interface Posts {
  posts_id: number;
  posts_slug: string;
  pages_id: number;
  posts_ep: number;
  posts_detail: Post_detail[];
  posts_view: number;
}
interface Post_detail {
  url: string;
  image_no: number;
}

export default function create_posts({ ...props }) {
  const router = useRouter();
  const MySwal = withReactContent(Swal);

  const [create_posts, setCreate_posts] = useState<Posts>({
    posts_id: 0,
    posts_slug: "",
    pages_id: 0,
    posts_ep: 0,
    posts_detail: [],
    posts_view: 0,
  });
  const [uploads_progress, setUploads_progress] = useState<boolean>(false);
  const [filesArray, setFilesArray] = useState<any[]>([]);

  const handleUpload = async () => {
    if (filesArray.length) {
      const formData = new FormData();
      for (let i = 0; i < filesArray.length; i++) {
        formData.append("uploads_posts_images", filesArray[i]);
      }

      try {
        Swal.fire({
          title: "กำลังอัพโหลดรูปภาพ",
          timerProgressBar: true,

          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        const res = await axios_client.post(`/posts/uploads/posts`, formData);
        Swal.close();
        Swal.fire({
          position: "center",
          icon: "success",
          title: "อัพโหลดรูปภาพสำเร็จแล้ว",
          showConfirmButton: false,
          timer: 1500,
        });
        console.log(res.data);
        setCreate_posts({
          ...create_posts,
          posts_detail: res.data,
        });
      } catch (err: any) {
        console.log(`pages/create/index` + err.response);
        if (err.response === undefined) {
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "ขนาดไฟล์ Size ใหญ่เกินไป",
            showConfirmButton: false,
            timer: 1500,
          });
        } else {
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "อัพโหลดรูปภาพไม่สำเร็จ กรุณาอัพโหลดไฟล์ .PNG .WEBP .GIF",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
    } else {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "กรุณาเลือกไฟล์ที่ต้องการอัพโหลด",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleFileEvent = (e: ChangeEvent<HTMLInputElement>) => {
    if (create_posts.posts_detail.length == 0) {
      if (e.target.files) {
        setFilesArray(Array.from(e.target.files));
      }
    } else {
      console.log(create_posts.posts_detail);
      // try {
      //   axios_client.post(`/posts/uploads/delete`, create_posts.posts_detail);
      // } catch (err: any) {
      //   console.log(`pages/uploads/delete` + err);
      // }
      Swal.fire({
        position: "center",
        icon: "success",
        title: "ลบรูปภาพเก่าเรียบร้อยแล้ว",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  // const handleSubmid = async (e: FormEvent) => {
  //   e.preventDefault();

  //   const formData = new FormData();

  //   for (let i = 0; i < uploadedFiles.length; i++) {
  //     formData.append("files", uploadedFiles[i]);
  //   }

  //   try {
  //     const response = await axios.post("/upload", formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     });

  //     console.log(response.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

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

            <p className="text-gray-400">/create</p>
          </div>
          <div className="px-6 my-3 flex justify-end">
            <button
              className="flex items-center justify-between p-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
              onClick={() => {
                router.push(`/${config.ADMIN_PATH}/posts/`);
              }}
            >
              <FaReply className="w-3 h-3 m-2" />
              Posts
            </button>
          </div>
          <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Create Posts
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
                  setCreate_posts({
                    ...create_posts,
                    posts_slug: e.target.value,
                  });
                }}
              />
            </div>
            <div className="my-2">
              <span className="text-gray-700 dark:text-gray-400 mt-4 text-sm">
                posts_ep | Exapmle : one-pice-ตอนที่-1
              </span>

              <input
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                required
                type="text"
              />
            </div>
          </div>

          <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Create Posts_detail
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
            <div className="uploaded-files-list flex gap-10 flex-warp justify-center">
              {create_posts.posts_detail.length === 0 ? (
                <div className="text-gray-700 dark:text-gray-400 text-sm">
                  <p className="text-2xl">กรุณาอัพโหลดรูปภาพ</p>
                </div>
              ) : (
                create_posts.posts_detail.map((item: any, index: number) => (
                  <div className="flex flex-warp flex-col" key={index}>
                    <img
                      className="h-[500px]  object-cover"
                      src={`https://sv1.skz.app/${item.url}`}
                      alt=""
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
                onClick={() => {
                  console.log(create_posts);
                }}
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
