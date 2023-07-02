import { ApplicationRequest } from "@/@types";
import { useForm } from "react-hook-form";
import Button from "./Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApplicationValidator } from "@/lib/validators/schemas";

type Inputs = ApplicationRequest;

interface Props {
  hideNew: () => void;
  submitNew: (data: Inputs) => void;
}

const NewRow = ({ hideNew, submitNew }: Props) => {
  const { watch, register } = useForm<Inputs>({
    defaultValues: {
      status: "SAVED",
    },
    resolver: zodResolver(
      ApplicationValidator.required({
        title: true,
        company: true,
        status: true,
        postingUrl: true,
      })
    ),
  });

  return (
    <tr className="group odd:bg-zinc-800/50">
      <td className="p-2">
        <input
          {...register("title")}
          placeholder="Job Title"
          className="rounded-lg border border-transparent bg-transparent p-1 group-hover:border-gray-600/50"
        />
      </td>
      <td className="p-2">
        <input
          {...register("company")}
          placeholder="Company Name"
          className="rounded-lg border border-transparent bg-transparent p-1 group-hover:border-gray-600/50"
        />
      </td>
      <td className="p-2">
        <select
          id="status"
          {...register("status")}
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
      </td>
      <td className="p-2">
        <input
          type="date"
          {...register("dateApplied")}
          className="rounded-lg border border-transparent bg-transparent p-1 group-hover:border-gray-600/50"
        />
      </td>
      <td className="p-2">
        <input
          type="url"
          {...register("postingUrl")}
          placeholder="Job Post URL"
          className="rounded-lg border border-transparent bg-transparent p-1 group-hover:border-gray-600/50"
        />
      </td>
      <td>
        <Button
          onClick={() =>
            submitNew({ ...watch(), dateApplied: watch("dateApplied") || null })
          }
        >
          Save
        </Button>
        <Button onClick={hideNew}>Hide</Button>
      </td>
    </tr>
  );
};

export default NewRow;
