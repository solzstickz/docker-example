import React from "react";
import Layer from "../../../components/Layer";
import Poster from "../../../components/Poster";
import axios from "axios";
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
              <div className="search-content grid grid-cols-5">
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
  let keyword = context.params.slug;
  let res = await axios.post(
    `${process.env.API_END_POINT}/search/${context.params.slug}`,
    "",
    {
      headers: {
        Authorization: `bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlN1cGVydXNlciIsImlhdCI6MTY4NTY5NjY3OSwiZXhwIjoxNjg1Njk4NDc5fQ.RuZvr1H_Do6WwSB59YsdRbm821R_6nFR291kk1HZzGo`,
      },
    }
  );
  let search = await res.data;

  return { props: { search, keyword } };
}
