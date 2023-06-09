import React, { useState, ChangeEvent, FormEvent } from "react";
import Layer from "../../../../../components/Layer";
import axios from "axios";
import Link from "next/link";
import moment from "moment";
import Select from "react-select";
import { FaUpload, FaReply } from "react-icons/fa";
import config from "../../../../../config/config";
import { useRouter } from "next/router";
import axios_client from "../../../../../config/axios_client";

const MAX_COUNT = 5;

export default function create_posts({ ...props }) {
  const router = useRouter();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileLimit, setFileLimit] = useState(false);

  const handleUploadFiles = async (files: File[]) => {
    const uploaded: File[] = [...uploadedFiles];
    let limitExceeded = false;

    Array.prototype.some.call(files, (file: File) => {
      if (uploaded.findIndex((f) => f.name === file.name) === -1) {
        uploaded.push(file);
        if (uploaded.length === MAX_COUNT) setFileLimit(true);
        if (uploaded.length > MAX_COUNT) {
          alert(`คุณสามารถเพิ่มไฟล์ได้สูงสุด ${MAX_COUNT} ไฟล์เท่านั้น`);
          setFileLimit(false);
          limitExceeded = true;
          return true;
        }
      }
    });

    if (!limitExceeded) {
      setUploadedFiles(uploaded);

      const formData = new FormData();
      files.forEach((file) => {
        formData.append("uploads_pages_thumbnail", file);
      });

      try {
        const response = await axios_client.post(
          `/pages/uploads/pages`,
          formData
        );
        alert("อัพโหลดรูปภาพสำเร็จ");
        // set_create_pages({
        //   ...create_pages,
        //   pages_thumbnail: response.data.url,
        // });
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleFileEvent = (e: ChangeEvent<HTMLInputElement>) => {
    const chosenFiles = Array.from(e.target.files);
    handleUploadFiles(chosenFiles);
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
              />
            </div>
            <div className="my-2">
              <span className="text-gray-700 dark:text-gray-400 mt-4 text-sm">
                pages_id | Exapmle : 1
              </span>
              <input
                name="pages_id"
                className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
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
                accept="application/pdf, image/png"
                onChange={handleFileEvent}
                disabled={fileLimit}
              />
              <button
                className="p-4 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                onClick={handleUploadFiles}
              >
                Upload
              </button>
              <div className="uploaded-files-list">
                {uploadedFiles.map((file) => (
                  <div key={file.name}>{file.name}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layer>
    </>
  );
}
