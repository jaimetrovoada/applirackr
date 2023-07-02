import { Application } from "@/@types";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowData,
  Row,
} from "@tanstack/react-table";

export const columnHelper = createColumnHelper<Application>();

  export const getRowValues = (row: Row<Application>) => {
    return row.getAllCells().map((cell) => {
      return { name: cell.column.id, value: cell.getValue() };
    });
  };

