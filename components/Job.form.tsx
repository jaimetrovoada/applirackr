"use client";
import { createApplication } from "@/lib/api.service";
import { ApplicationRequest } from "@/@types";
import { SubmitHandler, useForm } from "react-hook-form";
import Button from "./Button";
import Form from "./Form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApplicationValidator } from "@/lib/validators/schemas";

type Inputs = ApplicationRequest;

const JobForm = () => {
  const {
    handleSubmit,
    watch,
    register,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
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

  const submit: SubmitHandler<Inputs> = async (data) => {
    console.log({ data });
    const [res, err] = await createApplication(data);
    console.log({ res, err });
  };
  return (
    <Form onSubmit={handleSubmit(submit)} onReset={() => reset}>
      <Form.Input
        register={register}
        error={errors.position}
        name="position"
        label="Position"
      />
      <Form.Input
        register={register}
        error={errors.company}
        name="company"
        label="Company"
      />
      <div className="flex flex-row gap-4">
        <label htmlFor="">Status</label>
        <select id="status" {...register("stage")}>
          <option value="SAVED">saved</option>
          <option value="APPLIED">applied</option>
          <option value="INTERVIEW">interview</option>
          <option value="REJECTED">rejected</option>
          <option value="OFFER">offer</option>
        </select>
      </div>
      <Form.Input
        register={register}
        error={errors.dateApplied}
        type="date"
        name="dateApplied"
        label="Date Applied"
        rules={{ valueAsDate: true }}
      />
      <Form.Input
        register={register}
        error={errors.postingUrl}
        name="postingUrl"
        label="Posting URL"
      />
      <div className="flex flex-row justify-between">
        <Button type="submit">Submit</Button>
        <Button type="reset">Reset</Button>
      </div>
    </Form>
  );
};

export default JobForm;
