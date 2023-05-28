import React from "react";
import Layer from "../../../../components/Layer";
import DataTable, {
  createTheme,
  ExpanderComponentProps,
} from "react-data-table-component";
import axios from "axios";
import { useEffect } from "react";
import moment from "moment";
import Link from "next/link";
import config from "../../../../config/config";
import { useRouter } from "next/router";
import { setWithExpiry, getWithExpiry } from "../../../../lib/localstorage";
import axios_client from "../../../../config/axios_client";
type pages = {
  pages_id: number;
  pages_slug: string;
  pages_view: number;
  pages_last_update: string;
  pages_status_showing: string;
  pages_tags: string;
  pages_last_ep: number;
  pages_detail: [];
};

export default function pages({ ...props }) {
  const router = useRouter();
  const [pages, setPages] = React.useState<pages[]>([]);

  useEffect(() => {
    axios_client
      .post(`/pages/`)
      .then((res) => {
        setPages(res.data);
      })
      .catch((err) => {
        console.log(`pages:edit:index` + err);
      });
  }, []);
  return (
    <>
      <Layer>
        <div className="create_pages">
          <div className="px-6 my-6 flex justify-end">
            <button
              className="flex items-center justify-between px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
              onClick={() => {
                router.push(`pages/create`);
              }}
            >
              Create Pages
              <span className="ml-2" aria-hidden="true">
                +
              </span>
            </button>
          </div>
        </div>

        <div className="table_pages mt-[50px]">
          <Table_pages data_table={pages} />
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

const columns = [
  {
    name: "pages_slug",
    selector: (row: any) => row.pages_slug,
    cell: (row: any, index: number) => (
      <Link href={`pages/edit/${row.pages_slug}`}>{row.pages_slug}</Link>
    ),
    sortable: true,
  },
  {
    name: "pages_last_update",
    selector: (row: any) =>
      moment(row.pages_last_update).startOf("day").fromNow(),
    sortable: true,
  },
  {
    name: "View",
    selector: (row: any) => row.pages_view,
    sortable: true,
  },
  {
    name: "Follow",
    selector: (row: any) => row.pages_detail.info.follow,
    sortable: true,
  },
  {
    name: "type",
    selector: (row: any) => row.pages_detail.info.type,
    sortable: true,
  },
  {
    name: "status_showing",
    selector: (row: any) => row.pages_status_showing,
    sortable: true,
  },
  {
    name: "Edit",
    cell: () => (
      <button className="text-orange-500 bg-orange-100 rounded-md dark:text-orange-100 dark:bg-orange-500 p-2">
        Edit
      </button>
    ),
    ignoreRowClick: true,
    allowOverflow: true,
    button: true,
  },
];

const data = [
  {
    id: 1,
    title: "Beetlejuice",
    year: "1988",
  },
  {
    id: 2,
    title: "Ghostbusters",
    year: "1984",
  },
];

const FilterComponent = ({ filterText, onFilter, onClear }: any) => {
  return (
    <>
      <input
        id="search"
        type="text"
        className="w-full pl-8 pr-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md dark:placeholder-gray-500 dark:focus:shadow-outline-gray dark:focus:placeholder-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:placeholder-gray-500 focus:bg-white focus:border-purple-300 focus:outline-none focus:shadow-outline-purple form-input"
        placeholder="Filter By Name"
        aria-label="Search Input"
        value={filterText}
        onChange={onFilter}
      />
      <button type="button" onClick={onClear}>
        X
      </button>
    </>
  );
};

export const Table_pages = ({ data_table }: any) => {
  const [pending, setPending] = React.useState(true);
  const [rows, setRows] = React.useState([]);
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const filteredItems = data_table.filter(
    (item: any) =>
      item.pages_slug &&
      item.pages_detail.title.toLowerCase().includes(filterText.toLowerCase())
  );

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

  //!! select_row_logs
  function handleChange({ selectedRows }: any): void {
    // You can set state or dispatch with something like Redux so we can use the retrieved data
    console.log("Selected Rows: ", selectedRows);
  }
  const ExpandedComponent: React.FC<ExpanderComponentProps<pages>> = ({
    data,
  }) => {
    return <pre className="text-[8px]">{JSON.stringify(data, null, 2)}</pre>;
  };

  return (
    <>
      <div className="table_pages grid ">
        <DataTable
          title="Movie List"
          columns={columns}
          data={filteredItems}
          progressPending={pending}
          pagination
          paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
          selectableRows
          persistTableHead
          onSelectedRowsChange={handleChange}
          theme="solarized"
          expandableRows
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
