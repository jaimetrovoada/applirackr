"use client";
import { Application } from "@/@types";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  Column,
  Table,
  ColumnDef,
  getFilteredRowModel,
  getPaginationRowModel,
  RowData,
  Row,
} from "@tanstack/react-table";
import Link from "next/link";
import { useRef, useState, useEffect, useMemo } from "react";
import Modal, { ModalHandler } from "./Modal";
import JobForm from "./Job.form";
import Button from "./Button";
import { Edit, Trash } from "react-feather";

interface Props {
  applications: Application[] | null;
}
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

const defaultColumn: Partial<ColumnDef<Application>> = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue();
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue);

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
      console.log(index, id, value);
      table.options.meta?.updateData(index, id, value);
    };

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    if (id === "status") {
      return (
        <select
          id="status"
          value={initialValue as string}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          className="rounded-lg border border-transparent bg-transparent p-1 focus-within:rounded-b-none group-hover:border-gray-600/50"
        >
          <optgroup className="bg-zinc-900 text-white" label="Status">
            <option value="SAVED">saved</option>
            <option value="APPLIED">applied</option>
            <option value="INTERVIEW">interview</option>
            <option value="REJECTED">rejected</option>
            <option value="OFFER">offer</option>
          </optgroup>
        </select>
      );
    }

    if (id === "dateApplied") {
      return (
        <input
          type="date"
          value={new Date(initialValue as string).toISOString().slice(0, 10)}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
          className="rounded-lg border border-transparent bg-transparent p-1 group-hover:border-gray-600/50"
        />
      );
    }
    return (
      <input
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        className="rounded-lg border border-transparent bg-transparent p-1 group-hover:border-gray-600/50"
      />
    );
  },
};

const ApplicationsTable = ({ applications }: Props) => {
  const columnHelper = createColumnHelper<Application>();

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
    []
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
