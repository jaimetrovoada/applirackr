import { Application } from "@/@types";
import Button from "./Button";
import { deleteApplication } from "@/lib/api.service";
import { CellContext } from "@tanstack/react-table";
import { AiOutlineDelete } from "react-icons/ai";

const ActionCell = ({ row, table }: CellContext<Application, string>) => {
  const handleDelete = async (itemId: string, rowIndex: number) => {
    const [ok, err] = await deleteApplication(itemId);
    console.log({ ok });

    if (ok) {
      table.options.meta?.deleteData(rowIndex);
    }
    if (err) {
      console.log({ err });
    }
  };
  return (
    <Button
      useResetStyles
      variant="custom"
      onClick={() => handleDelete(row.original.id, row.index)}
      className="group-hover:text-red-500 md:mx-auto"
    >
      <AiOutlineDelete size={24} />
    </Button>
  );
};

export default ActionCell;
