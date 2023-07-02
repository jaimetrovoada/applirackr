"use client";
import { Application } from "@/@types";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowData,
  Row,
} from "@tanstack/react-table";
import { useRef, useState, useMemo } from "react";
import Modal, { ModalHandler } from "./Modal";
import JobForm from "./Job.form";
import Button from "./Button";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import EditableCell from "./EditableCell";
import { deleteApplication, updateApplication } from "@/lib/api.service";

interface Props {
  applications: Application[] | null;
}
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

const ApplicationsTable = ({ applications }: Props) => {
  const columnHelper = createColumnHelper<Application>();

  const handleEdit = async (rowId: string) => {
    const rowData = getRowValues(table.getRow(rowId));
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
    console.log({ res, err });
  };

  const handleDelete = async (rowId: string, rowIndex: number) => {
    const rowData = getRowValues(table.getRow(rowId));
    console.log("delete", { rowData });
    const id = rowData.find((col) => col.name === "id")?.value as string;

    const [res, err] = await deleteApplication(id);
    console.log({ res });
    const dataCopy = [...data];

    if (res && res.ok) {
      dataCopy.splice(rowIndex, 1);
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
          index={info.row.index}
          id={info.column.id}
          value={info.getValue()}
          updateMyData={info.table.options.meta?.updateData!}
        />
      ),
    }),
    columnHelper.accessor("company", {
      header: "Company",
      cell: (info) => (
        <EditableCell
          index={info.row.index}
          id={info.column.id}
          value={info.getValue()}
          updateMyData={info.table.options.meta?.updateData!}
        />
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => (
        <EditableCell
          index={info.row.index}
          id={info.column.id}
          value={info.getValue()}
          updateMyData={info.table.options.meta?.updateData!}
        />
      ),
    }),
    columnHelper.accessor("dateApplied", {
      header: "Date Applied",
      cell: (info) => (
        <EditableCell
          index={info.row.index}
          id={info.column.id}
          value={info.getValue().toString()}
          updateMyData={info.table.options.meta?.updateData!}
        />
      ),
    }),
    columnHelper.accessor("postingUrl", {
      header: "Job Post URL",
      cell: (info) => (
        <EditableCell
          index={info.row.index}
          id={info.column.id}
          value={info.getValue()}
          updateMyData={info.table.options.meta?.updateData!}
        />
      ),
    }),
    columnHelper.accessor("id", {}),
    columnHelper.accessor(() => "actions", {
      header: "Actions",
      cell: (info) => (
        <div className="inline-flex w-full items-center justify-evenly">
          <Button
            onClick={() => handleEdit(info.row.id)}
            variant="custom"
            className="group-hover:text-blue-500"
          >
            <AiOutlineEdit size={24} />
          </Button>
          <Button
            useResetStyles
            variant="custom"
            onClick={() => handleDelete(info.row.id, info.row.index)}
            className="group-hover:text-red-500"
          >
            <AiOutlineDelete size={24} />
          </Button>
        </div>
      ),
    }),
  ];

  const [data, setData] = useState(() => [...(applications || [])]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // Provide our updateData function to our table meta
    meta: {
      updateData: (rowIndex, columnId, value) => {
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
      },
    },
    debugTable: true,
    state: {
      columnVisibility: {
        id: false,
      },
    },
  });

  const getRowValues = (row: Row<Application>) => {
    return row.getAllCells().map((cell) => {
      return { name: cell.column.id, value: cell.getValue() };
    });
  };

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
          <thead className="bg-zinc-950">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
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
                  <td key={cell.id} className="flex-1 p-2">
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
