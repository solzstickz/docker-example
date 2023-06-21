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
import { useRouter } from "next/router";
import axios_client from "../../../../../config/axios_client";
import Search_tags from "../../../../../components/Search_tags";
import { useEffect } from "react";
import { FaReply } from "react-icons/fa";
const popup = require("../../../../../lib/popup");
interface CreateTags {
  tags_slug: string;
  tags_name: string;
}

export default function Edit_tags({ ...props }) {
  const router = useRouter();

  const [create_tags, set_create_tags] = useState<CreateTags>({
    tags_slug: "",
    tags_name: "",
  });

  useEffect(() => {
    getTags();
  }, [router.query.slug]);

  const getTags = async () => {
    axios_client
      .post(`/tags/${router.query.slug}`)
      .then((res) => {
        set_create_tags(res.data);
      })
      .catch((err) => {
        console.log(`tags/:slug` + err);
      });
  };

  const handleSubmid = async () => {
    if (create_tags.tags_slug !== "" && create_tags.tags_name !== "") {
      axios_client
        .post(`/tags/edit/tag`, create_tags)
        .then((res) => {
          console.log(res.data);
          if (res.status === 200) {
            popup.success("อัพเดท tags เรียบร้อย");
            set_create_tags({
              tags_slug: "",
              tags_name: "",
            });
            router.push(`/${config.ADMIN_PATH}/tags/`);
          } else {
            popup.error("อัพเดท tags ไม่สำเร็จ");
          }
        })
        .catch((err) => {
          console.log(`tags/edit/tag` + err);
        });
    } else {
      popup.warning("กรุณากรอกข้อมูลให้ถูกต้อง");
    }
  };
  return (
    <>
      <Layer>
        <div className="container px-6 mx-auto grid">
          <div className="px-6 my-3 flex justify-start">
            <Link href={`/${config.ADMIN_PATH}/tags/`}>Tags</Link>
            <p className="text-gray-400">/edit_tags</p>
          </div>
          <div className="px-6 my-3 flex justify-end">
            <button
              className="flex items-center justify-between p-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
              onClick={() => {
                router.push(`/${config.ADMIN_PATH}/tags/`);
              }}
            >
              <FaReply className="w-3 h-3 m-2" />
              Tags
            </button>
          </div>
          <h2 className="my-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Edit Tags
          </h2>

          {/* <div className="flex items-center justify-between p-4 mb-8 text-sm font-semibold text-purple-100 bg-purple-600 rounded-lg shadow-md focus:outline-none focus:shadow-outline-purple">
            <div className="flex items-center">
              <span>สร้างโพส</span>
            </div>
            <span>View more →</span>
          </div> */}

          <div className="px-4 py-3 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <span className="text-gray-700 dark:text-gray-400 mt-4 text-sm">
              tags_slug | Exapmle : one-piece (ห้ามเว้นวรรค หากจะเว้นวรรคให้ใช้
              -)
            </span>

            <input
              className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
              required
              value={create_tags.tags_slug || ""}
              onChange={(e) => {
                let check_slug = e.target.value.split(" ").join("-");
                set_create_tags({
                  ...create_tags,
                  tags_slug: check_slug.toLowerCase(),
                });
              }}
            />
            <span className="text-gray-700 dark:text-gray-400 mt-4 text-sm">
              tags_name | Exapmle : one piece
            </span>

            <input
              className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
              required
              value={create_tags.tags_name || ""}
              onChange={(e) => {
                let name_uppercase = e.target.value.toLowerCase();
                set_create_tags({
                  ...create_tags,
                  tags_name: name_uppercase,
                });
              }}
            />
            <div className="mt-4">
              <button
                className="w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-green-600 border border-transparent rounded-lg active:bg-green-600 hover:bg-green-700 focus:outline-none focus:shadow-outline-green my-3"
                type="button"
                onClick={handleSubmid}
              >
                Update Tags
              </button>
            </div>
            <div className="mt-4">{`tags_slug : ${create_tags.tags_slug}`}</div>

            <div className="mt-4">{`tags_name : ${create_tags.tags_name}`}</div>
          </div>
        </div>
      </Layer>
    </>
  );
}
