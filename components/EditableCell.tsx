import { STAGES } from "@/lib/validators/schemas";
import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/lib/useDebounce.hook";
import { ApplicationValidator } from "@/lib/validators/schemas";
import { updateApplication } from "@/lib/api.service";
import { CellContext } from "@tanstack/react-table";
import { Application } from "@/@types";

const EditableCell = ({
  getValue,
  row,
  column,
  table,
}: CellContext<Application, string | Date | null | undefined>) => {
  const initialValue = getValue();
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, 300);

  const handleEdit = useCallback(
    async (value: unknown) => {
      const payload = ApplicationValidator.partial().parse({
        [column.id]: value,
      });

      const [res, err] = await updateApplication(row.original.id, payload);
      console.log({ res, err, payload });

      if (!err) {
        table.options.meta?.updateData(row.index, column.id, value);
      }
    },
    [row.original.id, column.id, table.options.meta, row.index]
  );

  useEffect(() => {
    console.log({ debouncedValue });
    if (debouncedValue !== initialValue) {
      handleEdit(debouncedValue);
    }
  }, [debouncedValue]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setValue(e.target.value);
  };

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  if (column.id === "stage") {
    return (
      <select
        id="stage"
        value={value as string}
        onChange={handleChange}
        className="rounded-lg border border-transparent bg-transparent p-1 uppercase focus-within:rounded-b-none group-hover:border-gray-600/50"
      >
        <optgroup className="bg-zinc-900 uppercase text-white" label="Stage">
          {STAGES.map((stage) => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </optgroup>
      </select>
    );
  }

  if (column.id === "dateApplied") {
    return (
      <input
        type="date"
        value={
          initialValue
            ? new Date(value as string).toISOString().slice(0, 10)
            : undefined
        }
        max={new Date().toISOString().slice(0, 10)}
        onChange={handleChange}
        className="rounded-lg border border-transparent bg-transparent p-1 group-hover:border-gray-600/50"
      />
    );
  }
  return (
    <input
      value={value as string}
      onChange={handleChange}
      className="rounded-lg border border-transparent bg-transparent p-1 group-hover:border-gray-600/50"
    />
  );
};

export default EditableCell;
