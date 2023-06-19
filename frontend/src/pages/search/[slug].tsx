import React from "react";
import Layer from "../../../components/Layer";
import Poster from "../../../components/Poster";
import axios_client from "../../../config/axios_client";
export default function search_slug({ ...props }) {
  return (
    <Layer>
      <div className="container mx-auto max-w-[1080px]">
        <section>
          <section>
            <div className="search w-full ">
              <div className="search-title">
                <h2 className="text-3xl text-site_color">
                  Search:
                  <span className="text-color_white"> {props.keyword}</span>
                </h2>
              </div>
              <div className="update_new-content grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-10">
                {props.search.map((pages: any, i: number) => {
                  return (
                    <Poster
                      key={i}
                      i={i}
                      pages_id={pages.pages_id}
                      pages_slug={pages.pages_slug}
                      pages_view={pages.pages_view}
                      pages_last_update={pages.pages_last_update}
                      pages_status_showing={pages.pages_status_showing}
                      pages_last_ep={pages.pages_last_ep}
                      pages_en={pages.pages_en}
                      pages_th={pages.pages_th}
                      pages_star={pages.pages_star}
                      pages_type={pages.pages_type}
                      pages_follow={pages.pages_follow}
                      pages_publish={pages.pages_publish}
                      pages_title={pages.pages_title}
                      pages_simple={pages.pages_simple}
                      pages_thumbnail={pages.pages_thumbnail}
                      pages_description={pages.pages_description}
                      posts_slug={pages.posts_slug}
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
  try {
    let keyword = context.params.slug;
    let res = await axios_client.get(`public/pages/${context.query.slug}`);
    let search = await res.data;
    console.log(search);
    return { props: { search, keyword } };
  } catch (err) {
    console.log(err);
    return { props: { search: [], keyword: context.query.slug } };
  }
}
