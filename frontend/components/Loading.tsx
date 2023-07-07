import React from "react";

export default function Loading() {
  return (
    <>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex items-center justify-center w-full h-full">
          <div className="border-text-color h-20 w-20 animate-spin rounded-full border-8 border-t-site_color" />
        </div>
      </div>
    </>
  );
}
