import React, {  useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";

export const ReusableTable = ({ data, columns, pageSize = 3 }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filteredData, setFilteredData] = useState(data);
  const [sortedData, setSortedData] = useState(data);
  const [currentPage, setCurrentPage] = useState(0);
  // const [clientX, setClientX] = useState("");
  // const [columnIndex, setColumnIndex] = useState("");
  const [columnss, setColoumnss] = useState(columns);
  const [visibleColumns, setVisibleColumns] = useState(columnss);
  const tableContainerRef = React.createRef();
  const tableColumnRefs = Array(columns.length).fill(null);

  const [state, setState] = useState({
    sortedData: data,
    currentPage: 1,
    columnss,
    tableContainerRef,
    tableColumnRefs,
  });

  var handleColumnResize = (columnIndex, clientX) => {
    // setColumnIndex(columnIndex);
    // setClientX(setClientX);
    console.log(
      clientX,
      "newWidthnewWidth",
      columnIndex,
      "columnIndex",
      state.tableContainerRef?.current,
      " state.tableContainerRef.current"
    );
    const tableContainerBoundingClientRect =
      state?.tableContainerRef?.current?.getBoundingClientRect();

    console.log(
      tableContainerBoundingClientRect,
      "tableContainerBoundingClientRect",
      state.tableContainerRef.current,
      " state.tableContainerRef.current"
    );

    const newColumnWidth = clientX - tableContainerBoundingClientRect?.left;
    console.log(newColumnWidth, "newColumnWidth");
    setState((prevState) => {
      const updatedColumns = prevState.columnss.map((column, index) => {
        if (index === columnIndex) {
          return { ...column, width: newColumnWidth };
        } else {
          return column;
        }
      });
      setColoumnss(updatedColumns);
      return { ...prevState, columnss: updatedColumns };
    });
  };

  // useLayoutEffect(() => {
  //   if (state.tableContainerRef.current) {
  //     const tableContainerBoundingClientRect =
  //       state.tableContainerRef.current.getBoundingClientRect();
  //     const newColumnWidth = clientX - tableContainerBoundingClientRect.left;

  //     setState((prevState) => {
  //       const updatedColumns = prevState.columnss.map((column, index) => {
  //         if (index === columnIndex) {
  //           return { ...column, width: newColumnWidth };
  //         } else {
  //           return column;
  //         }
  //       });

  //       return { ...prevState, columns: updatedColumns };
  //     });
  //   }
  // }, [state.tableContainerRef]);

  // const tableElement = document.querySelector('table-head');

  // tableElement.addEventListener('mousedown', 'th', (event) => {
  //   const draggedColumn = event.currentTarget;
  //   const oldIndex = draggedColumn.cellIndex;

  //   draggedColumn.addEventListener('mouseup', () => {
  //     const droppedColumn = document.elementFromPoint(event.clientX, event.clientY);
  //     const newIndex = droppedColumn.cellIndex;

  //     if (oldIndex !== newIndex) {
  //       handleColumnReorder(oldIndex, newIndex);
  //       // updateTableUI();
  //        // Update the table UI based on the new column order
  //     }

  //     draggedColumn.removeEventListener('mouseup');
  //   });
  // });

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData("text/plain"), 10);

    // Reorder the columns
    setVisibleColumns((prevColumns) => {
      const updatedColumns = [...prevColumns];
      const [draggedColumn] = updatedColumns.splice(sourceIndex, 1);
      console.log(draggedColumn,"draggedColumndraggedColumn",targetIndex,"targetIndextargetIndex");
      updatedColumns.splice(targetIndex, 0, draggedColumn);
      console.log(updatedColumns,"updatedColumnsupdatedColumns");
      return updatedColumns;
    });
  };

  const handleColumnReorder = (oldIndex, newIndex) => {
    const updatedColumns = [...columns];
    const [column] = updatedColumns.splice(oldIndex, 1);
    updatedColumns.splice(newIndex, 0, column);
    // Update state with the new column order
  };

  const handleColumnSort = () => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setSortedData(sortedData);
    // Update state with the sorted data
  };

  const handleSort = (key) => {
    // If the same column is clicked, reverse the sorting direction
    const direction =
      key === sortConfig.key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
    handleColumnSort();
  };

  //fitering data
  const handleColumnFilter = (columnIndex, filterValue, accessorKey) => {
    const filteredDatas = data.filter((row) =>
      row[columnss[columnIndex].accessorKey]
        .toString()
        .toLowerCase()
        .includes(filterValue.toLowerCase())
    );
    setFilteredData(filteredDatas);
    setSortedData(filteredDatas);
  };

  const handleWholeTableSearch = (searchValue) => {
    console.log(searchValue, "searchValuesearchValue");
    // Convert the search value to lowercase for case-insensitive search
    const lowercasedSearchValue = searchValue.toLowerCase();

    // Filter the data based on the search value
    const filteredData = data.filter((row) => {
      return Object.values(row).some(
        (value) =>
          value !== null &&
          value.toString().toLowerCase().includes(lowercasedSearchValue)
      );
    });

    setFilteredData(filteredData);
    setSortedData(filteredData);
    // Update state with the filtered data
  };



  const toggleColumnVisibility = (accessorKey) => {
    setVisibleColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.accessorKey === accessorKey
          ? { ...column, isVisible: !column.isVisible }
          : column
      )
    );
  };


  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <input
        type="text"
        className="border ml-10"
        onChange={(e) => {
          handleWholeTableSearch(e.target.value);
        }}
        placeholder="Search..."
      />

      <TableContainer component={Paper}>
        <Table ref={tableContainerRef} className="table">
          <TableHead className="table-head">
            <TableRow>
              {console.log(columnss, "columnsscolumnss")}
              {visibleColumns
                    .filter((column) => column.isVisible).map((column, index) => (
                <TableCell
                  className="bg-gray-500 "
                  key={index}
                  //

                  ref={(ref) => {
                    tableColumnRefs[index] = ref;
                  }}
                  onMouseDown={(e) => handleColumnResize(index, e.clientX)}
                  style={{ width: column.width }}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  {column.header}
                  <input
                    className="bg-[#eee8e8] rounded-sm ml-3"
                    type="search"
                    placeholder="Filter"
                    onChange={(e) =>
                      handleColumnFilter(
                        index,
                        e.target.value,
                        column.accessorKey
                      )
                    }
                  />

                  <button
                    className="bg-[#919191]  border border-r-2"
                    onClick={() => handleSort(column.accessorKey)}
                  >
                    {
                      // sortConfig.key === column.accessorKey &&
                      sortConfig.direction !== "asc" ? " ▲" : " ▼"
                    }
                  </button>
                  <button
                      onClick={() => toggleColumnVisibility(column.accessorKey)}
                      style={{ marginLeft: '5px' }}
                    >
                      Close
                    </button>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData
              .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
              .map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {visibleColumns
                    .filter((column) => column.isVisible)
                    .map((column, colIndex) => (
                      <TableCell
                        key={colIndex}
                        style={{
                          width: column.width,
                          borderRight: "1px solid grey",
                        }}
                      >
                        {row[column.accessorKey]}
                      </TableCell>
                    ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={sortedData.length}
        page={currentPage}
        onPageChange={handlePageChange}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[pageSize]}
      />
    </div>
  );
};
export default ReusableTable;
