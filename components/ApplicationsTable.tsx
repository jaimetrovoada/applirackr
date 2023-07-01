"use client";
import { Application } from "@/@types";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnDef,
  RowData,
  Row,
} from "@tanstack/react-table";
import { useRef, useState, useMemo } from "react";
import Modal, { ModalHandler } from "./Modal";
import JobForm from "./Job.form";
import Button from "./Button";
import { Edit, Trash } from "react-feather";
import EditableCell from "./EditableCell";

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

  const defaultColumn: Partial<ColumnDef<Application>> = {
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue = getValue();

      return (
        <EditableCell
          index={index}
          id={id}
          value={initialValue as string}
          updateMyData={table.options.meta?.updateData!}
        />
      );
    },
  };
  const columns = useMemo(
    () => [
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
      }),
      columnHelper.accessor("postingUrl", {
        header: "Job Post URL",
      }),
    ],
    [columnHelper]
  );

  const [data, setData] = useState(() => [...(applications || [])]);
  const table = useReactTable({
    data,
    columns,
    defaultColumn,
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
  });
  const getRowValues = (row: Row<Application>) => {
    return row.getAllCells().map((cell) => {
      return { name: cell.column.id, value: cell.getValue() };
    });
  };

  const modalRef = useRef<ModalHandler>(null);

  const handleEdit = (rowId: string) => {
    const rowData = getRowValues(table.getRow(rowId));
    console.log({ rowData });
  };

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
                <th className="p-2 text-left">Actions</th>
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
                <td className="">
                  <Button useResetStyles variant="custom">
                    <Trash />
                  </Button>
                  <Button onClick={() => handleEdit(row.id)} variant="custom">
                    <Edit />
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
