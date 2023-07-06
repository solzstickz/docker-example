import React, { useState, useEffect } from "react";
import Layer from "../../../components/Layer";
import { Suspense } from "react";
import Clear_storate from "../../../components/Clear_storate";
import Loading from "../../../components/Loading";
export default function Dashboard() {
  return (
    <>
      <Layer>
        <div className="container px-6 mx-auto">
          <h2 className="text-gray-700 dark:text-gray-200 text-xl font-medium my-5">
            Dashboard
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 mt-6">
            <Suspense fallback={<Loading />}>
              <Clear_storate />
            </Suspense>
          </div>
        </div>
      </Layer>
    </>
  );
}

//path : author\src\pages\e923b164-6dd4-4704-b82f-5dccdaf8245c\dashboard.tsx
