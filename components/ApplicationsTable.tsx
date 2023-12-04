"use client";
import { Application } from "@/@types";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowData,
  SortingState,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import Button from "./Button";
import {
  AiOutlineArrowDown,
  AiOutlineArrowUp,
  AiOutlinePlus,
} from "react-icons/ai";
import { columns } from "@/lib/table.helpers";
import NewRow from "./NewRow";
import { createApplication } from "@/lib/api.service";
import { ApplicationRequest } from "@/@types";

interface Props {
  applications: Application[] | null;
}

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
    deleteData: (rowIndex: number) => void;
  }
}

const ApplicationsTable = ({ applications }: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);

  const [data, setData] = useState(() => [...(applications || [])]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // Provide our updateData function to our table meta
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
      deleteData: (rowIndex) => {
        setData((old) => old.filter((_, index) => index !== rowIndex));
      },
    },
    debugTable: true,
    state: {
      sorting,
      columnVisibility: {
        id: false,
      },
    },
    onSortingChange: setSorting,
  });
  const { pageSize, pageIndex } = table.getState().pagination;

  const hideNew = () => {
    setIsVisible(false);
  };

  const submitNew = async (data: ApplicationRequest) => {
    console.log({ data });
    const [res, err] = await createApplication(data);
    console.log({ res, err });
    if (!err) {
      hideNew();
      setData((old) => [...old, res]);
    }
  };

  return (
    <>
      <Button
        variant="custom"
        className="inline-flex w-fit items-center gap-2 rounded-lg p-2 hover:bg-zinc-950/70"
        onClick={() => setIsVisible(true)}
      >
        <AiOutlinePlus size={16} />
        Add new
      </Button>
      <div className="w-full overflow-auto rounded-lg border border-gray-600/50">
        <table className="w-full">
          <thead className="hidden md:table-header-group">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-zinc-950">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="p-2 text-left"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none inline-flex items-center gap-4"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <AiOutlineArrowUp />,
                          desc: <AiOutlineArrowDown />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isVisible && <NewRow hideNew={hideNew} submitNew={submitNew} />}
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="group flex flex-col odd:bg-zinc-800/50 md:table-row"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="flex flex-col p-2 md:table-cell">
                    <span className="px-1 text-sm font-semibold text-slate-400 md:hidden">
                      {cell.column.columnDef.header?.toString()}:
                    </span>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ApplicationsTable;
