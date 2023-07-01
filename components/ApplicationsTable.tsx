"use client";
import { Application } from "@/@types";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { useRef, useState } from "react";
import Modal, { ModalHandler } from "./Modal";
import JobForm from "./Job.form";
import Button from "./Button";

interface Props {
  applications: Application[] | null;
}

const ApplicationsTable = ({ applications }: Props) => {
  const columnHelper = createColumnHelper<Application>();

  const columns = [
    columnHelper.accessor("title", {
      header: "Title",
    }),
    columnHelper.accessor("company", {
      header: "Company",
    }),
    columnHelper.accessor("status", {
      header: "Status",
    }),
    columnHelper.accessor("dateApplied", {
      header: "Date Applied",
      cell: (info) => {
        const date = new Date(info.getValue());
        return date.toLocaleDateString();
      },
    }),
    columnHelper.accessor("postingUrl", {
      header: "Job Post URL",
      cell: (info) => (
        <Link
          href={info.getValue()}
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 underline"
          prefetch={false}
        >
          {info.getValue()}
        </Link>
      ),
    }),
  ];

  const [data, setData] = useState(() => [...(applications || [])]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const modalRef = useRef<ModalHandler>(null);
  return (
    <>
      <Modal ref={modalRef}>
        <JobForm />
      </Modal>
      <Button onClick={() => modalRef.current?.show()} className="w-fit">
        Add new application
      </Button>

      <div className="w-full overflow-hidden rounded-lg border border-gray-600/50">
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
                <th className="p-2 text-left">Actions</th>
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="odd:bg-zinc-800/50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="flex-1 p-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                <td className="">
                  <Button useResetStyles variant="custom">
                    🗑️
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ApplicationsTable;
