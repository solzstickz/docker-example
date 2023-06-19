import React from "react";
import Layer from "../../../components/Layer";
import Poster from "../../../components/Poster";
import axios from "axios";
export default function tags_index({ ...props }) {
  return (
    <Layer>
      <div className="container mx-auto max-w-[1080px]">
        <section>
          <section>
            <div className="tags w-full ">
              <div className="tags-title">
                <h2 className="text-3xl text-site_color">
                  Tags:
                  <span className="text-color_white"> {props.keyword}</span>
                </h2>
              </div>
              <div className="update_new-content grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-10">
                {props.tags.map((pages: any, i: number) => {
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
  let tags = await res_lastep.data;

  return { props: { tags } };
}
