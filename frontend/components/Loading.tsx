import React from "react";

export default function Loading() {
  return (
    <>
      <div className="flex items-center justify-center w-full h-full">
        <div className="border-text-color h-20 w-20 animate-spin rounded-full border-8 border-t-site_color" />
      </div>
    </>
  );
}
