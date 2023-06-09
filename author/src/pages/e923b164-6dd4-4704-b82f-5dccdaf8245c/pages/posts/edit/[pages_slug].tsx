import React from "react";
import { useRouter } from "next/router";
export default function posts_edit_pages_slug() {
  const router = useRouter();
  const { pages_slug } = router.query;
  return <div>{pages_slug}</div>;
}
