import { STAGES } from "@/lib/validators/schemas";
import { useState, useEffect } from "react";

interface Props {
  value: string | undefined;
  rowIndex: number;
  columnId: string;
  rowId: string;
  updateMyData: (
    rowIndex: number,
    columnId: string,
    value: unknown,
    rowId: string
  ) => void;
  disabled?: boolean;
}

const EditableCell = ({
  value: initialValue,
  rowIndex,
  columnId,
  rowId,
  updateMyData, // This is a custom function that we supplied to our table instance
  disabled = false,
}: Props) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue);

  // When the input is blurred, we'll call our table meta's updateData function
  const onBlur = () => {
    console.log({ rowIndex, columnId, value, rowId });
    updateMyData(rowIndex, columnId, value, rowId);
  };

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  if (columnId === "stage") {
    return (
      <select
        id="stage"
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        onKeyUp={(e) => e.key === "Enter" && onBlur()}
        className="rounded-lg border border-transparent bg-transparent p-1 uppercase focus-within:rounded-b-none group-hover:border-gray-600/50"
        disabled={disabled}
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

  if (columnId === "dateApplied") {
    return (
      <input
        type="date"
        value={
          initialValue
            ? new Date(value as string).toISOString().slice(0, 10)
            : undefined
        }
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
        onKeyUp={(e) => e.key === "Enter" && onBlur()}
        className="rounded-lg border border-transparent bg-transparent p-1 group-hover:border-gray-600/50"
        disabled={disabled}
      />
    );
  }
  return (
    <input
      value={value as string}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      onKeyUp={(e) => e.key === "Enter" && onBlur()}
      className="rounded-lg border border-transparent bg-transparent p-1 group-hover:border-gray-600/50"
      disabled={disabled}
    />
  );
};

export default EditableCell;
