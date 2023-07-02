"use client";
import { Application } from "@/@types";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  Row,
} from "@tanstack/react-table";
import { useRef, useState } from "react";
import Modal, { ModalHandler } from "./Modal";
import JobForm from "./Job.form";
import Button from "./Button";
import { AiOutlineDelete } from "react-icons/ai";
import EditableCell from "./EditableCell";
import { deleteApplication, updateApplication } from "@/lib/api.service";
import { columnHelper, getRowValues } from "@/lib/table.helpers";

interface Props {
  applications: Application[] | null;
}

const ApplicationsTable = ({ applications }: Props) => {
  const [disabled, setDisabled] = useState(false);

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
          value={info.getValue().toString()}
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

  const modalRef = useRef<ModalHandler>(null);

  if (!data || data.length === 0) {
    return (
      <>
        <Modal ref={modalRef}>
          <JobForm />
        </Modal>
        <div className="flex h-1/3 w-full flex-col items-center justify-around overflow-auto rounded-lg border border-gray-600/50 p-4">
          <p className="text-2xl font-semibold">
            You haven&apos;t added any applications yet.
          </p>
          <Button onClick={() => modalRef.current?.show()} className="w-fit">
            Add new application
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Modal ref={modalRef}>
        <JobForm />
      </Modal>
      <Button onClick={() => modalRef.current?.show()} className="w-fit">
        Add new application
      </Button>

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
          </thead>
          <tbody>
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
