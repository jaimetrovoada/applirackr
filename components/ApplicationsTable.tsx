"use client";
import { Application } from "@/@types";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  Row,
} from "@tanstack/react-table";
import { useState } from "react";
import Button from "./Button";
import { AiOutlineDelete } from "react-icons/ai";
import EditableCell from "./EditableCell";
import { deleteApplication, updateApplication } from "@/lib/api.service";
import { columnHelper, getRowValues } from "@/lib/table.helpers";
import NewRow from "./NewRow";
import { createApplication } from "@/lib/api.service";
import { ApplicationRequest } from "@/@types";

interface Props {
  applications: Application[] | null;
}

const ApplicationsTable = ({ applications }: Props) => {
  const [disabled, setDisabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleEdit = async (row: Row<Application>) => {
    setDisabled(true);
    const rowData = getRowValues(row);
    console.log({ rowData });
    const id = rowData.find((col) => col.name === "id")?.value as string;

    const payload = {
      title: rowData.find((col) => col.name === "title")?.value as string,
      company: rowData.find((col) => col.name === "company")?.value as string,
      status: rowData.find((col) => col.name === "status")?.value as
        | "APPLIED"
        | "INTERVIEW"
        | "OFFER"
        | "REJECTED"
        | "SAVED",
      dateApplied: rowData.find((col) => col.name === "dateApplied")
        ?.value as Date,
      postingUrl: rowData.find((col) => col.name === "postingUrl")
        ?.value as string,
    };

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
    columnHelper.accessor("title", {
      header: "Title",
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
    columnHelper.accessor("status", {
      header: "Status",
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
      cell: (info) => (
        <Button
          useResetStyles
          variant="custom"
          onClick={() => handleDelete(info.row)}
          className="mx-auto group-hover:text-red-500"
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
      columnVisibility: {
        id: false,
      },
    },
  });

  const hideNew = () => {
    setIsVisible(false);
  };

  const submitNew = async (data: ApplicationRequest) => {
    console.log({ data });
    const [res, err] = await createApplication(data);
    console.log({ res, err });
    if (res?.ok) {
      hideNew();
      setData((old) => [...old, res.body]);
    }
  };

  return (
    <>
      <div className="w-full overflow-auto rounded-lg border border-gray-600/50">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-zinc-950">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-2 text-left">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
            <tr>
              <td colSpan={100} className="">
                <Button
                  variant="custom"
                  className="w-full rounded-none bg-zinc-950/50 p-2 font-semibold"
                  onClick={() => setIsVisible(true)}
                >
                  Add new
                </Button>
              </td>
            </tr>
          </thead>
          <tbody>
            {isVisible && <NewRow hideNew={hideNew} submitNew={submitNew} />}
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="group odd:bg-zinc-800/50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-2">
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
