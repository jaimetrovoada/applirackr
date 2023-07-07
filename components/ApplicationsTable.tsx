"use client";
import { Application, Stages } from "@/@types";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  Row,
  RowData,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import Button from "./Button";
import {
  AiOutlineArrowDown,
  AiOutlineArrowUp,
  AiOutlineDelete,
} from "react-icons/ai";
import EditableCell from "./EditableCell";
import { deleteApplication, updateApplication } from "@/lib/api.service";
import { columnHelper, getRowValues } from "@/lib/table.helpers";
import NewRow from "./NewRow";
import { createApplication } from "@/lib/api.service";
import { ApplicationRequest } from "@/@types";
import { ApplicationValidator, STAGES } from "@/lib/validators/schemas";
import { z } from "zod";

interface Props {
  applications: Application[] | null;
}

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (
      rowIndex: number,
      columnId: string,
      value: unknown,
      rowId: string
    ) => void;
  }
}

const ApplicationsTable = ({ applications }: Props) => {
  const [disabled, setDisabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [sorting, setSorting] = useState<SortingState>([]);

  const handleEdit = async (row: Row<Application>) => {
    setDisabled(true);
    const rowData = getRowValues(row);
    console.log({ rowData });
    const id = rowData.find((col) => col.name === "id")?.value as string;

    const payload = {
      position: rowData.find((col) => col.name === "position")?.value as string,
      company: rowData.find((col) => col.name === "company")?.value as string,
      stage: rowData.find((col) => col.name === "stage")?.value as Stages,
      dateApplied: rowData.find((col) => col.name === "dateApplied")
        ?.value as Date,
      postingUrl: rowData.find((col) => col.name === "postingUrl")
        ?.value as string,
    };
    console.log({ payload });

    const [res, err] = await updateApplication(id, payload);

    if (res || err) {
      setDisabled(false);
    }

    if (err) {
      return false;
    }
    return true;
  };

  const handleDelete = async (row: Row<Application>) => {
    const rowData = getRowValues(row);
    console.log("delete", { rowData });
    const id = rowData.find((col) => col.name === "id")?.value as string;

    const [res, err] = await deleteApplication(id);
    console.log({ res });
    const dataCopy = [...data];

    if (res && res.ok) {
      dataCopy.splice(row.index, 1);
      setData(dataCopy);
    }
    if (err) {
      console.log({ err });
    }
  };

  const columns = [
    columnHelper.accessor("position", {
      header: "Position",
      cell: (info) => (
        <EditableCell
          rowIndex={info.row.index}
          columnId={info.column.id}
          rowId={info.row.id}
          value={info.getValue()}
          updateMyData={info.table.options.meta?.updateData!}
          disabled={disabled}
        />
      ),
    }),
    columnHelper.accessor("company", {
      header: "Company",
      cell: (info) => (
        <EditableCell
          rowIndex={info.row.index}
          columnId={info.column.id}
          rowId={info.row.id}
          value={info.getValue()}
          updateMyData={info.table.options.meta?.updateData!}
          disabled={disabled}
        />
      ),
    }),
    columnHelper.accessor("stage", {
      header: "Stage",
      cell: (info) => (
        <EditableCell
          rowIndex={info.row.index}
          columnId={info.column.id}
          rowId={info.row.id}
          value={info.getValue()}
          updateMyData={info.table.options.meta?.updateData!}
          disabled={disabled}
        />
      ),
    }),
    columnHelper.accessor("dateApplied", {
      header: "Date Applied",
      cell: (info) => (
        <EditableCell
          rowIndex={info.row.index}
          columnId={info.column.id}
          rowId={info.row.id}
          value={info.getValue()?.toString()}
          updateMyData={info.table.options.meta?.updateData!}
          disabled={disabled}
        />
      ),
    }),
    columnHelper.accessor("postingUrl", {
      header: "Job Post URL",
      cell: (info) => (
        <EditableCell
          rowIndex={info.row.index}
          columnId={info.column.id}
          rowId={info.row.id}
          value={info.getValue()}
          updateMyData={info.table.options.meta?.updateData!}
          disabled={disabled}
        />
      ),
    }),
    columnHelper.accessor(() => "actions", {
      header: "Actions",
      enableSorting: false,
      cell: (info) => (
        <Button
          useResetStyles
          variant="custom"
          onClick={() => handleDelete(info.row)}
          className="group-hover:text-red-500 md:mx-auto"
          disabled={disabled}
        >
          <AiOutlineDelete size={24} />
        </Button>
      ),
    }),
    columnHelper.accessor("id", {}),
  ];

  const [data, setData] = useState(() => [...(applications || [])]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // Provide our updateData function to our table meta
    meta: {
      updateData: async (rowIndex, columnId, value, rowId) => {
        // Skip page index reset until after next rerender
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

        const ok = await handleEdit(table.getRow(rowId));
        if (!ok) {
          setData(data);
        }
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
      <Button className="w-fit" onClick={() => setIsVisible(true)}>
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
