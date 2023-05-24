import React, { useEffect } from "react";
import Layer from "../../components/Layer";
import Router from "next/router";
export default function Home() {
  useEffect(() => {
    Router.push("/404");
  }, []);
  return <></>;
}
