import React from "react";
import Layer from "../../../../../components/Layer";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import moment from "moment";
import Select from "react-select";
import { FaUpload } from "react-icons/fa";
import config from "../../../../../config/config";
import Image from "next/image";

export default function create_pages({ ...props }) {
  const [uploas_page_thumbnail, setuploas_page_thumbnail] = useState<File>();
  const [create_pages, set_create_pages] = useState({
    pages_slug: "",
    pages_view: 0,
    pages_status_showing: "",
    pages_tags: "",
    pages_detail: {
      title: "",
      description: "",
      simple: "",
      last_ep: 0,
      thumbnail: "",
      info: {
        EN: "",
        TH: "",
        star: "",
        type: "",
        follow: 0,
      },
    },
  });

  const handleUpload = async () => {
    if (!uploas_page_thumbnail) {
      return;
    }
    const formData = new FormData();
    formData.append("uploads_pages_thumbnail", uploas_page_thumbnail);
    axios
      .post(`${config.API_URL}/pages/uploads/images`, formData)
      .then((res) => {
        console.log(res.data);
        set_create_pages({
          ...create_pages,
          pages_detail: {
            ...create_pages.pages_detail,
            thumbnail: `http://localhost:7777/${res.data}`,
          },
        });
      })
      .catch((err) => console.error(err));
  };

  const handleSubmid = async () => {
    let tags_uppercase = create_pages.pages_tags.toUpperCase();
    set_create_pages({
      ...create_pages,
      pages_tags: tags_uppercase,
    });

    if (
      create_pages.pages_detail.title.length < 50 ||
      create_pages.pages_detail.title.length > 60
    ) {
      alert("กรุณากรอก Title ให้ถูกต้อง");
    } else if (
      create_pages.pages_detail.description.length < 145 ||
      create_pages.pages_detail.description.length > 160
    ) {
      alert("กรุณากรอก Description ให้ถูกต้อง");
    } else if (create_pages.pages_slug === "") {
      alert("กรุณากรอก Slug ให้ถูกต้อง");
    } else if (create_pages.pages_detail.thumbnail === "") {
      alert("กรุณาอัพโหลดรูปภาพ");
    } else {
      axios
        .post(`${config.API_URL}/pages/create/page`, create_pages)
        .then((res) => {
          console.log(res.data);
          if (res.status === 200) {
            alert("สร้างหน้าเรียบร้อย");
            set_create_pages({
              pages_slug: "",
              pages_view: 0,
              pages_status_showing: "",
              pages_tags: "",
              pages_detail: {
                title: "",
                description: "",
                simple: "",
                last_ep: 0,
                thumbnail: "",
                info: {
                  EN: "",
                  TH: "",
                  star: "",
                  type: "",
                  follow: 0,
                },
              },
            });
          } else {
            alert("สร้างหน้าไม่สำเร็จ");
          }
        });
    }
  };
  return (
    <>
      <Layer>
        <div className="container px-6 mx-auto grid">
          <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Create Pages Amime :D
          </h2>

          {/* <div className="flex items-center justify-between p-4 mb-8 text-sm font-semibold text-purple-100 bg-purple-600 rounded-lg shadow-md focus:outline-none focus:shadow-outline-purple">
            <div className="flex items-center">
              <span>สร้างโพส</span>
            </div>
            <span>View more →</span>
          </div> */}
          <h4 className="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
            Seo Config
          </h4>
          <div className="px-4 py-3 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <span className="text-gray-700 dark:text-gray-400 mt-4 text-sm">
              Title | Exapmle : One Piece อ่านมังงะ วันพีช แปลไทย TH
            </span>

            <span className="text-xs">
              {" "}
              {create_pages.pages_detail.title.length}/60
            </span>
            <input
              className={`${
                create_pages.pages_detail.title.length >= 50 &&
                create_pages.pages_detail.title.length <= 60
                  ? "border-green-600 border-2"
                  : "border-red-600 border-2"
              } block w-full mt-1 text-sm  dark:text-gray-300 dark:bg-gray-700  focus:outline-none focus:shadow-outline-red form-input`}
              type="text"
              onChange={(e) => {
                set_create_pages({
                  ...create_pages,
                  pages_detail: {
                    ...create_pages.pages_detail,
                    title: e.target.value,
                  },
                });
              }}
              required
            />
            <span className="text-gray-700 dark:text-gray-400 mt-4 text-sm">
              Description | Exapmle : One Piece แปลไทย อ่านมังงะ One Piece
            </span>
            <span className="text-xs">
              {" "}
              {create_pages.pages_detail.description.length}/160
            </span>
            <input
              className={`${
                create_pages.pages_detail.description.length >= 145 &&
                create_pages.pages_detail.description.length <= 160
                  ? "border-green-600 border-2"
                  : "border-red-600 border-2"
              } block w-full mt-1 text-sm  dark:text-gray-300 dark:bg-gray-700  focus:outline-none focus:shadow-outline-red form-input`}
              type="text"
              onChange={(e) => {
                set_create_pages({
                  ...create_pages,
                  pages_detail: {
                    ...create_pages.pages_detail,
                    description: e.target.value,
                  },
                });
              }}
              required
            />
            <span className="text-gray-700 dark:text-gray-400 text-sm">
              Page_slug | Example : One-piece (ห้ามเว้นวรรค หากจะเว้นวรรคให้ใช้
              -)
            </span>
            <input
              className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
              required
              onChange={(e) => {
                set_create_pages({
                  ...create_pages,
                  pages_slug: e.target.value,
                });
              }}
            />
          </div>
          <h4 className="my-3 text-lg font-semibold text-gray-600 dark:text-gray-300">
            Thumbnail
          </h4>
          <div className="px-4 py-3 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <div className="mt-4">
              <span className="text-gray-700 dark:text-gray-400 mt-4 text-sm">
                thumbnail | Example : รูปภาพ Thumbnail
              </span>
              <input
                className="block w-full mb-5 text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 p-3"
                type="file"
                onChange={(e) => {
                  if (e.target.files) {
                    setuploas_page_thumbnail(e.target.files[0]);
                  }
                  console.log(uploas_page_thumbnail);
                }}
              />
              <span className="text-sm"></span>
              <button
                className="w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                onClick={handleUpload}
              >
                Upload
              </button>
              <div className="preview_imges">
                {create_pages.pages_detail.thumbnail}
                {create_pages.pages_detail.thumbnail ? (
                  <Image
                    src={create_pages.pages_detail.thumbnail}
                    width={200}
                    height={200}
                    className="mx-auto my-5"
                    alt=""
                  />
                ) : null}
                {/* <Image
                  src={create_pages.pages_detail.thumbnail}
                  width={200}
                  height={200}
                  className="mx-auto my-5"
                  alt=""
                /> */}
              </div>
            </div>
          </div>

          <h4 className="my-3 text-lg font-semibold text-gray-600 dark:text-gray-300">
            Pages_detail
          </h4>
          <div className="px-4 py-3 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <div className="mt-4">
              <span className="text-gray-700 dark:text-gray-400 text-sm">
                Simple | Example :
                สุดยอดการ์ตูนที่พิสูจน์ความเหนือชั้นมากว่า20ปี
                กับความสนุกไร้เทียมทาน
                กับการออกผจญภัยของกลุ่มโจรสลัดหมวกฝางที่ออกตามล่าหาสมบัติที่เรียกว่า
                “ONEPIECE”
              </span>
              <textarea
                className="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-textarea focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                rows={3}
                onChange={(e) => {
                  set_create_pages({
                    ...create_pages,
                    pages_detail: {
                      ...create_pages.pages_detail,
                      simple: e.target.value,
                    },
                  });
                }}
              />
            </div>
            <div className="mt-4">
              <span className="text-gray-700 dark:text-gray-400 text-sm">
                Pages_status_showing
              </span>

              <select
                className="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                onChange={(e) => {
                  set_create_pages({
                    ...create_pages,
                    pages_status_showing: e.target.value,
                  });
                }}
                value={create_pages.pages_status_showing}
              >
                <option value={""}></option>
                <option value={"อาทิตย์"}>อาทิตย์</option>
                <option value={"จันทร์"}>จันทร์</option>
                <option value={"วันอังคาร"}>อังคาร</option>
                <option value={"วันพุธ"}>พุธ</option>
                <option value={"พฤษหัสบดี"}>พฤษหัสบดี</option>
                <option value={"ศุกร์"}>ศุกร์</option>
                <option value={"เสาร์"}>เสาร์</option>
              </select>
            </div>

            <div className="mt-4">
              <span className="text-gray-700 dark:text-gray-400 text-sm">
                Pages_tags | Example : ACTION,ADVENTURE,COMEDY
                (ใส่ตัวใหญ่ทั้งหมดเท่านั้น)
              </span>
              <input
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                required
                onChange={(e) => {
                  set_create_pages({
                    ...create_pages,
                    pages_tags: e.target.value,
                  });
                }}
              />
            </div>

            <div className="mt-4">
              <span className="text-gray-700 dark:text-gray-400 mt-4 text-sm">
                EN | Exapmle : One Piece
              </span>
              <input
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                required
                onChange={(e) => {
                  set_create_pages({
                    ...create_pages,
                    pages_detail: {
                      ...create_pages.pages_detail,
                      info: {
                        ...create_pages.pages_detail.info,
                        EN: e.target.value,
                      },
                    },
                  });
                }}
              />
            </div>
            <div className="mt-4">
              <span className="text-gray-700 dark:text-gray-400 mt-4 text-sm">
                TH | Exapmle : วันพีช
              </span>
              <input
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                onChange={(e) => {
                  set_create_pages({
                    ...create_pages,
                    pages_detail: {
                      ...create_pages.pages_detail,
                      info: {
                        ...create_pages.pages_detail.info,
                        TH: e.target.value,
                      },
                    },
                  });
                }}
              />
            </div>
            <div className="mt-4">
              <span className="text-gray-700 dark:text-gray-400 mt-4 text-sm">
                Star | Example : 9.5
              </span>
              <input
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                type="number"
                required
                onChange={(e) => {
                  set_create_pages({
                    ...create_pages,
                    pages_detail: {
                      ...create_pages.pages_detail,
                      info: {
                        ...create_pages.pages_detail.info,
                        star: e.target.value,
                      },
                    },
                  });
                }}
              />
            </div>
            <div className="mt-4">
              {" "}
              <span className="text-gray-700 dark:text-gray-400 mt-4 text-sm">
                Type | Example : Mangga
              </span>
              <select
                className="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray"
                onChange={(e) => {
                  set_create_pages({
                    ...create_pages,
                    pages_detail: {
                      ...create_pages.pages_detail,
                      info: {
                        ...create_pages.pages_detail.info,
                        type: e.target.value,
                      },
                    },
                  });
                }}
                value={create_pages.pages_detail.info.type}
              >
                <option value={""}></option>
                <option value={"Manga"}>Manga</option>
                <option value={"Manhua"}>Manhua</option>
                <option value={"Novel"}>Novel</option>
              </select>
            </div>
            <div className="mt-4">
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
