import { Column, Row } from "@tanstack/react-table";
import { useState, useEffect } from "react";

interface Props {
  value: string;
  index: number;
  id: string;
  updateMyData: (rowIndex: number, columnId: string, value: unknown) => void;
}

const EditableCell = ({
  value: initialValue,
  index,
  id,
  updateMyData, // This is a custom function that we supplied to our table instance
}: Props) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = useState(initialValue);

  // When the input is blurred, we'll call our table meta's updateData function
  const onBlur = () => {
    console.log(index, id, value);
    updateMyData(index, id, value);
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
};

export default EditableCell;
