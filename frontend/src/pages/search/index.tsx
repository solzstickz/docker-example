import React from "react";
import Layer from "../../../components/Layer";
import Poster from "../../../components/Poster";
import axios from "axios";
export default function search_index({ ...props }) {
  return (
    <Layer>
      <div className="container mx-auto max-w-[1080px]">
        <section>
          <section>
            <div className="search w-full ">
              <div className="search-title">
                <h2 className="text-3xl text-site_color">
                  search:
                  <span className="text-color_white"> {props.keyword}</span>
                </h2>
              </div>
              <div className="search-content grid grid-cols-6">
                {props.search.map((pages: any, i: number) => {
                  return (
                    <Poster
                      key={i}
                      i={i}
                      pages_slug={pages.pages_slug}
                      pages_detail={pages.pages_detail}
                      posts_slug={pages.posts_slug}
                      posts_ep={pages.posts_ep}
                      posts_date={pages.posts_create}
                    />
                  );
                })}
              </div>
            </div>
          </section>
        </section>
      </div>
    </Layer>
  );
}
export async function getServerSideProps(context: any) {
  let res_lastep = await axios.post(`${process.env.API_END_POINT}last_updated`);
  let search = await res_lastep.data;

  return { props: { search } };
}
