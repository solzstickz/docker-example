import React from "react";
import Layer from "../../../../../components/Layer";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
export default function edit_pages({ ...props }) {
  const [create_pages, set_create_pages] = useState({
    pages_title: "",
    pages_description: "",
  });

  const handdlesubmid = (e) => {};

  return (
    <>
      <Layer>
        <h1>{`${props.edit_pages.pages_slug}`}</h1>
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
              {create_pages.pages_title.length}/60
            </span>
            <input
              className={`${
                create_pages.pages_title.length >= 50 &&
                create_pages.pages_title.length <= 60
                  ? "border-green-600 border-2"
                  : "border-red-600 border-2"
              } block w-full mt-1 text-sm  dark:text-gray-300 dark:bg-gray-700  focus:outline-none focus:shadow-outline-red form-input`}
              type="text"
              onChange={(e) => {
                set_create_pages({
                  ...create_pages,
                  pages_title: e.target.value,
                });
              }}
              required
            />
            <span className="text-gray-700 dark:text-gray-400 mt-4 text-sm">
              Description | Exapmle : One Piece แปลไทย อ่านมังงะ One Piece
            </span>
            <span className="text-xs">
              {" "}
              {create_pages.pages_description.length}/160
            </span>
            <input
              className={`${
                create_pages.pages_description.length >= 145 &&
                create_pages.pages_description.length <= 160
                  ? "border-green-600 border-2"
                  : "border-red-600 border-2"
              } block w-full mt-1 text-sm  dark:text-gray-300 dark:bg-gray-700  focus:outline-none focus:shadow-outline-red form-input`}
              type="text"
              onChange={(e) => {
                set_create_pages({
                  ...create_pages,
                  pages_description: e.target.value,
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
            />
          </div>
          <h4 className="mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
            Pages_detail
          </h4>
          <div className="px-4 py-3 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <div className="mt-4">
              <span className="text-gray-700 dark:text-gray-400">
                Pages_status_showing
              </span>
              <select className="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray">
                <option selected>?</option>
                <option value={"อาทิตย์"}>อาทิตย์</option>
                <option value={"จันทร์"}>จันทร์</option>
                <option value={"วันอังคาร"}>อังคาร</option>
                <option value={"วันพุธ"}>พุธ</option>
                <option value={"พฤษหัสบดี"}>พฤษหัสบดี</option>
                <option value={"ศุกร์"}>ศุกร์</option>
                <option>เสาร์</option>
              </select>
            </div>

            <div className="mt-4">
              <span className="text-gray-700 dark:text-gray-400">
                Pages_tags | Example : ACTION,ADVENTURE,COMEDY
                (ใส่ตัวใหญ่ทั้งหมดเท่านั้น)
              </span>
              <input
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                required
              />
            </div>

            <div className="mt-4">
              <span className="text-gray-700 dark:text-gray-400 mt-4 text-sm">
                EN | Exapmle : One Piece
              </span>
              <input
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                required
              />
            </div>
            <div className="mt-4">
              <span className="text-gray-700 dark:text-gray-400 mt-4 text-sm">
                TH | Exapmle : วันพีช
              </span>
              <input className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input" />
            </div>
            <div className="mt-4">
              <span className="text-gray-700 dark:text-gray-400 mt-4 text-sm">
                Star | Example : 9.5
              </span>
              <input
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
                type="number"
                required
              />
            </div>
            <div className="mt-4">
              {" "}
              <span className="text-gray-700 dark:text-gray-400 mt-4 text-sm">
                Type | Example : Mangga
              </span>
              <select className="block w-full mt-1 text-sm dark:text-gray-300 dark:border-gray-600 dark:bg-gray-700 form-select focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:focus:shadow-outline-gray">
                <option selected>?</option>
                <option value={"Mangga"}>Mangga</option>
                <option value={"Manhwa"}>Manhwa</option>
                <option value={"Novel"}>Novel</option>
              </select>
            </div>
          </div>
        </div>
      </Layer>
    </>
  );
}

export async function getServerSideProps(context: any) {
  let res = await axios.post(
    `${process.env.API_END_POINT}/pages/${context.params.slug}`
  );
  let edit_pages = res.data[0];
  console.log(edit_pages);
  return {
    props: {
      edit_pages,
    },
  };
}
