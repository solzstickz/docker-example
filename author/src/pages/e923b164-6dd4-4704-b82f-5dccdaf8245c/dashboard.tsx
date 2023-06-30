import React, { useState, useEffect } from "react";
import Layer from "../../../components/Layer";
import axios_client from "../../../config/axios_client";
import { FaSyncAlt, FaTrash } from "react-icons/fa";
const popup = require("../../../lib/popup");
export default function Dashboard() {
  const [how_img, setHow_img] = useState(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchData();
  }, [loading]);

  const fetchData = async () => {
    try {
      const response = await axios_client.post(`/posts/images/notuse`);
      let data = response.data.images_count;
      setHow_img(data);
      // ทำสิ่งที่คุณต้องการกับ response ที่ได้รับ
    } catch (error) {
      // จัดการข้อผิดพลาดที่เกิดขึ้น
      console.log(`dashboard:fetch_how_img: ${error}`);
    }
  };
  const handdleClearStorage = async () => {
    setLoading(true);
    try {
      let send_req = axios_client.post(`/posts/images/clear`);
      let response = await send_req;
      popup.success(`ลบรูปจำนวน ${response.data.count} รูปเรียบร้อยแล้ว`);
      setLoading(false);
    } catch (error) {
      console.log(`dashboard:handdleClearStorage: ${error}`);
      popup.error(`เกิดข้อผิดพลาด ${error}`);
      setLoading(false);
    }
  };
  return (
    <>
      <Layer>
        <div className="container px-6 mx-auto">
          <h2 className="text-gray-700 dark:text-gray-200 text-xl font-medium my-5">
            Dashboard
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 mt-6">
            <div className="min-w-0 p-4 bg-white rounded-lg shadow-xs dark:bg-gray-800 flex flex-col justify-center w-full">
              <h3 className="text-xl mb-5">Clear Storage </h3>
              <p className="mx-auto text-md my-5">
                รูปที่ไม่ได้ใช้ {""} {how_img} {""}ไฟล์
              </p>

              {how_img > 0 ? (
                <button
                  className={`flex items-center justify-evenly w-full px-4 py-2 my-5 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-purple
                ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={loading}
                  onClick={handdleClearStorage}
                >
                  {loading ? (
                    <FaSyncAlt className="animate-spin" />
                  ) : (
                    <FaTrash className="w-5 h-5" />
                  )}
                  {/* <span> Processing...</span> */}
                  <span>Clear Storage</span>
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </Layer>
    </>
  );
}
