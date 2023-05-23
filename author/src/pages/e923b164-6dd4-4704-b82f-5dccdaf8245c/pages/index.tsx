import React from "react";
import Layer from "../../../../components/Layer";
import DataTable, { createTheme } from "react-data-table-component";
export default function pages() {
  return (
    <>
      <Layer>
        <h1>welcome to pages</h1>
        <Table_pages />
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
    name: "Title",
    selector: (row) => row.title,
    sortable: true,
  },
  {
    name: "Director",
    selector: (row) => row.director,
    sortable: true,
  },
  {
    name: "Year",
    selector: (row) => row.year,
    sortable: true,
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

const FilterComponent = ({ filterText, onFilter, onClear }) => (
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

export const Table_pages = () => {
  const [pending, setPending] = React.useState(true);
  const [rows, setRows] = React.useState([]);
  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const filteredItems = data.filter(
    (item) =>
      item.title && item.title.toLowerCase().includes(filterText.toLowerCase())
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
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  //!! select_row_logs
  function handleChange({ selectedRows }): void {
    // You can set state or dispatch with something like Redux so we can use the retrieved data
    console.log("Selected Rows: ", selectedRows);
  }

  return (
    <>
      <div className="table_pages">
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
        />
      </div>
    </>
  );
};
