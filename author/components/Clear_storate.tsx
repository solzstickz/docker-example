import React, { useEffect, useRef, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import axios_client from "../config/axios_client";
const popup = require("../lib/popup");
import { FaTrash, FaSyncAlt } from "react-icons/fa";
export default function Clear_storate({ ...props }) {
  ChartJS.register(ArcElement, Tooltip, Legend);
  ChartJS.defaults.font.family = "'Inter', sans-serif";

  const chartContainer = useRef(null);
  const [img_value, setImg_value] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [loading]);

  const fetchData = async () => {
    try {
      const response = await axios_client.post(`/posts/images/notuse`);
      let data = response.data.images_count;
      if (data >= 1000) {
        setImg_value(1000);
        return;
      } else {
        setImg_value(data);
        return;
      }

      // ทำสิ่งที่คุณต้องการกับ response ที่ได้รับ
    } catch (error) {
      // จัดการข้อผิดพลาดที่เกิดขึ้น
      console.log(`dashboard:fetch_img_value: ${error}`);
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
    <div className="min-w-0 p-11 bg-white rounded-lg shadow-xs dark:bg-gray-800 flex flex-col justify-center w-full">
      <h3 className="text-xl mb-5">Clear Storage</h3>
      <Doughnut
        data={{
          datasets: [
            {
              data: [img_value, 1000 - img_value],
              backgroundColor: [
                img_value > 999 ? "#e793d3" : "#78e3c3",
                "#323233",
              ],
            },
          ],
        }}
        options={{
          responsive: true,
          elements: {
            arc: {
              borderWidth: 0, // ตั้งค่าความกว้างของเส้นขอบ (border width)
            },
          },
        }}
      />
      <p className="mx-auto text-md my-5">รูปที่ไม่ได้ใช้ {img_value} ไฟล์</p>
      {img_value > 0 ? (
        <button
          className={`flex items-center justify-evenly w-full px-4 py-2 my-5 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-purple
                ${loading ? "opacity-50cursor-not-allowed" : ""}`}
          disabled={loading}
          onClick={handdleClearStorage}
        >
          {loading ? (
            <FaSyncAlt className="animate-spin" />
          ) : (
            <FaTrash className="w-5 h-5" />
          )}
          <span>Clear Storage</span>
        </button>
      ) : null}
    </div>
  );
}
