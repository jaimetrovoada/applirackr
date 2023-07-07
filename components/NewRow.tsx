import { ApplicationRequest } from "@/@types";
import { useForm } from "react-hook-form";
import Button from "./Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApplicationValidator, STAGES } from "@/lib/validators/schemas";
import { AiOutlineClose, AiOutlineCheck } from "react-icons/ai";

type Inputs = ApplicationRequest;

interface Props {
  hideNew: () => void;
  submitNew: (data: Inputs) => void;
}

const NewRow = ({ hideNew, submitNew }: Props) => {
  const { watch, register } = useForm<Inputs>({
    defaultValues: {
      stage: "SAVED",
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
    <tr className="group flex flex-col odd:bg-zinc-800/50 md:table-row">
      <td className="flex flex-col p-2 md:table-cell">
        <span className="px-1 text-sm font-semibold text-slate-400 md:hidden">
          Title
        </span>
        <input
          {...register("position")}
          placeholder="Job Title"
          className="rounded-lg border border-transparent bg-transparent p-1 group-hover:border-gray-600/50"
        />
      </td>
      <td className="flex flex-col p-2 md:table-cell">
        <span className="px-1 text-sm font-semibold text-slate-400 md:hidden">
          Company
        </span>
        <input
          {...register("company")}
          placeholder="Company Name"
          className="rounded-lg border border-transparent bg-transparent p-1 group-hover:border-gray-600/50"
        />
      </td>
      <td className="flex flex-col p-2 md:table-cell">
        <span className="px-1 text-sm font-semibold text-slate-400 md:hidden">
          Status
        </span>
        <select
          id="status"
          {...register("stage")}
          className="rounded-lg border border-transparent bg-transparent p-1 focus-within:rounded-b-none group-hover:border-gray-600/50"
        >
          <optgroup className="bg-zinc-900 text-white" label="Status">
            {STAGES.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </optgroup>
        </select>
      </td>
      <td className="flex flex-col p-2 md:table-cell">
        <span className="px-1 text-sm font-semibold text-slate-400 md:hidden">
          Date Applied
        </span>
        <input
          type="date"
          {...register("dateApplied")}
          className="rounded-lg border border-transparent bg-transparent p-1 group-hover:border-gray-600/50"
        />
      </td>
      <td className="flex flex-col p-2 md:table-cell">
        <span className="px-1 text-sm font-semibold text-slate-400 md:hidden">
          Posting URL
        </span>
        <input
          type="url"
          {...register("postingUrl")}
          placeholder="Job Post URL"
          className="rounded-lg border border-transparent bg-transparent p-1 group-hover:border-gray-600/50"
        />
      </td>
      <td className="flex flex-row justify-evenly p-2 md:grid md:grid-cols-2">
        <Button
          onClick={() =>
            submitNew({ ...watch(), dateApplied: watch("dateApplied") || null })
          }
          variant="custom"
          className="hover:text-green-500"
        >
          <AiOutlineCheck size={24} />
        </Button>
        <Button
          onClick={hideNew}
          variant="custom"
          className="hover:text-red-500"
        >
          <AiOutlineClose size={24} />
        </Button>
      </td>
    </tr>
  );
};

export default NewRow;
