import React, { use, useState } from "react";
import Layer from "../../../../../components/Layer";
import DataTable, {
  createTheme,
  ExpanderComponentProps,
} from "react-data-table-component";
import axios_client from "../../../../../config/axios_client";
import { useEffect } from "react";
import moment from "moment-timezone";
import Link from "next/link";
import config from "../../../../../config/config";
import { useRouter } from "next/router";

import { FaEdit, FaRecycle, FaTrash } from "react-icons/fa";

type Tags = {
  tags_id: number;
  tags_slug: string;
  tags_name: string;
};

type Posts_Detail = {
  alt: string;
  url: string;
  image_no: number;
};

type Pages_Posts = {
  posts_id: number;
  posts_slug: string;
  pages_id: number;
  posts_ep: number;
  posts_detail: Posts_Detail[];
  posts_create: string;
  posts_views: number;
  pages_slug: string;
  pages_view: number;
  pages_last_update: string;
  pages_status_showing: string;
  pages_last_ep: number;
  pages_en: string;
  pages_th: string;
  pages_star: number;
  pages_type: string;
  pages_follow: number;
  pages_publish: number;
  pages_title: string;
  pages_simple: string;
  pages_thumbnail: string;
  pages_description: string;
};

export default function pages_post_pages_slug({ ...props }) {
  const router = useRouter();
  const [pages_posts, setPages_posts] = React.useState<Pages_Posts[]>([]);
  const [pages_tags, setPages_tags] = React.useState<Tags[]>([]);
  useEffect(() => {
    get_pages_posts();
    get_pages_tags();
    console.log(router.query.pages_slug);
  }, []);
  useEffect(() => {}, []);

  const get_pages_posts = async () => {
    axios_client
      .post(`/pages/posts/${router.query.pages_slug}`)
      .then((res) => {
        if (res.status) {
          setPages_posts(res.data);
          console.log(res.data);
        }
      })
      .catch((err) => {
        if (err) {
          console.log(`pages:edit:index` + err);
        }
      });
  };

  const get_pages_tags = async () => {
    axios_client
      .post(`/tags/pages/${router.query.pages_slug}`)
      .then((res) => {
        if (res.status) {
          console.log(res.data);
          setPages_tags(res.data.pages_tags);
        }
      })
      .catch((err) => {
        if (err) {
          console.log(`pages:edit:index` + err);
        }
      });
  };
  return (
    <>
      <Layer>
        <div className="pages_posts">
          <div className="px-6 my-3 flex justify-start">
            <Link href={`/${config.ADMIN_PATH}/pages/`}>Pages</Link>
            <p className="text-gray-400">/{router.query.pages_slug}</p>
          </div>
          <div className="px-6 my-3 flex justify-end gap-3">
            <button
              className="flex items-center justify-between px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
              onClick={() => {
                router.push(
                  `/${config.ADMIN_PATH}/pages/posts/create/${router.query.pages_slug}`
                );
              }}
            >
              Create Posts {router.query.pages_slug}
              <span className="ml-2" aria-hidden="true">
                +
              </span>
            </button>
          </div>
          <div className="posts_tags my-3">
            <h1 className="text-md my-3">Posts_tags:</h1>
            {pages_tags.map((item, index) => {
              return (
                <span
                  className="m-1 p-1 cursor-pointer text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                  key={index}
                >
                  {item.tags_name}
                </span>
              );
            })}
          </div>
        </div>

        <div className="table_pages mt-5">
          <Table_pages_posts
            data_table={pages_posts}
            pages_slug={router.query.pages_slug}
          />
        </div>
      </Layer>
    </>
  );
}

createTheme(
  "solarized",
  {
    text: {
      primary: "9E9E9E",
      secondary: "#9E9E9E",
    },
    background: {
      default: "#1a1c23",
    },
    context: {
      background: "#7e3af2",
      text: "#FFFFFF",
    },
    divider: {
      default: "#7e3af2",
    },
    action: {
      button: "rgba(0,0,0,.54)",
      hover: "rgba(0,0,0,.08)",
      disabled: "rgba(0,0,0,.12)",
    },
  },
  "dark"
);

const handdleDelete = (id: number) => {
  window.confirm(`Are you sure you want to delete:\r ${id}?`);
  let delete_id = [{ pages_id: id }];
  axios_client
    .post(`/pages/delete/page`, delete_id)
    .then((res) => {
      if (res.status === 200) {
        alert(`${res.data.message}`);
        window.location.reload();
        console.log(delete_id);
      }
      if (res.status === 201) {
        alert(`${res.data.message}`);
      }
      if (res.status === 400) {
        alert(`${res.data.message}`);
      }
    })
    .catch((err) => {
      console.log(`pages:edit:index` + err);
    });
};

const columns = [
  {
    name: "posts_id",
    selector: (row: any) => row.posts_id,
    cell: (row: any, index: number) => (
      <Link href={`pages/edit/${row.posts_slug}`}>{row.posts_id}</Link>
    ),
    sortable: true,
  },
  {
    name: "posts_slug",
    selector: (row: any) => row.posts_slug,
    cell: (row: any, index: number) => (
      <Link href={`/${config.ADMIN_PATH}/pages/posts/edit/${row.posts_slug}`}>
        {row.posts_slug}
      </Link>
    ),
    sortable: true,
  },
  {
    name: "posts_create",
    selector: (row: any) => moment().from(row.posts_create),
    sortable: true,
  },
  {
    name: "posts_views",
    selector: (row: any) => row.posts_views,
    sortable: true,
  },
  {
    name: "Follow",
    selector: (row: any) => row.pages_follow,
    sortable: true,
  },
  {
    name: "type",
    selector: (row: any) => row.pages_type,
    sortable: true,
  },
  {
    name: "status_showing",
    selector: (row: any) => row.pages_status_showing,
    sortable: true,
  },
  {
    name: "Edit",
    selector: (row: any) => row.pages_slug,
    cell: (row: any) => (
      <Link href={`pages/edit/${row.pages_slug}`}>
        <button className="text-orange-500 bg-orange-100 rounded-md dark:text-orange-100 dark:bg-orange-500 p-2">
          <FaEdit className="w-3 h-3 " />
        </button>
      </Link>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
  {
    name: "Delete",
    selector: (row: any) => row.pages_slug,
    cell: (row: any) => (
      <button
        className="text-red-500 bg-orange-100 rounded-md dark:text-red-100 dark:bg-red-500 p-2"
        onClick={() => handdleDelete(row.pages_id)}
      >
        <FaTrash className="w-3 h-3 " />
      </button>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
];

const FilterComponent = ({ filterText, onFilter, onClear }: any) => {
  return (
    <>
      <div className="input_ relative">
        <input
          id="search"
          type="text"
          className="w-full pl-8 pr-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md dark:placeholder-gray-500 dark:focus:shadow-outline-gray dark:focus:placeholder-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:placeholder-gray-500 focus:bg-white focus:border-purple-300 focus:outline-none focus:shadow-outline-purple form-input"
          placeholder="Filter By Name"
          aria-label="Search Input"
          value={filterText}
          onChange={onFilter}
        />
        <button
          className="absolute w-5 h-5 right-2 top-1 "
          type="button"
          onClick={onClear}
        >
          x
        </button>
      </div>
    </>
  );
};

export const Table_pages_posts = ({ data_table, pages_slug }: any) => {
  const [pending, setPending] = React.useState(true);
  useEffect(() => {
    setPending(false);
  }, [data_table]);

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const filteredItems = data_table.filter(
    (item: any) =>
      item.posts_slug &&
      item.posts_slug.toLowerCase().includes(filterText.toLowerCase())
  );
  const [selectedRows, setSelectedRows] = React.useState([]);

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <FilterComponent
        onFilter={(e: { target: { value: React.SetStateAction<string> } }) =>
          setFilterText(e.target.value)
        }
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  //! set_loading
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setPending(false);
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  const ExpandedComponent: React.FC<ExpanderComponentProps<Pages_Posts>> = ({
    data,
  }) => {
    return <pre className="text-[8px]">{JSON.stringify(data, null, 2)}</pre>;
  };

  return (
    <>
      <div className="table_pages grid ">
        <DataTable
          title={`Pages: ${pages_slug}`}
          columns={columns}
          data={filteredItems}
          progressPending={pending}
          pagination
          paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
          persistTableHead
          theme="solarized"
          expandableRowsComponent={ExpandedComponent}
        />
      </div>
    </>
  );
};

// export async function getServerSideProps(context: any, Cookies: any) {
//   let res = await axios.post(
//     `http://localhost:7777/pages/`,
//     {},
//     {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${Cookies.token}`,
//       },
//     }
//   );
//   let pages = res.data;
//   return {
//     props: {
//       pages,
//     },
//   };
// }
