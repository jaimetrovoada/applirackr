import { Application } from "@/@types";
import { createColumnHelper } from "@tanstack/react-table";
import EditableCell from "@/components/EditableCell";
import ActionCell from "@/components/ActionCell";

export const columnHelper = createColumnHelper<Application>();

export const columns = [
  columnHelper.accessor("position", {
    header: "Position",
    cell: EditableCell,
  }),
  columnHelper.accessor("company", {
    header: "Company",
    cell: EditableCell,
  }),
  columnHelper.accessor("stage", {
    header: "Stage",
    cell: EditableCell,
  }),
  columnHelper.accessor("dateApplied", {
    header: "Date Applied",
    cell: EditableCell,
  }),
  columnHelper.accessor("postingUrl", {
    header: "Job Post URL",
    cell: EditableCell,
  }),
  columnHelper.accessor(() => "actions", {
    header: "Actions",
    enableSorting: false,
    cell: ActionCell,
  }),
  columnHelper.accessor("id", {}),
];
