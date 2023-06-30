"use client";
import { createJob } from "@/lib/api.service";
import { ApplicationRequest } from "@/lib/validators/types";
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

  const title = watch("title");
  const company = watch("company");
  const status = watch("status");
  const dateApplied = watch("dateApplied");
  const postingUrl = watch("postingUrl");

  console.log({ errors, title, company, status, dateApplied, postingUrl });

  const submit: SubmitHandler<Inputs> = async (data) => {
    console.log({ data });
    const [res, err] = await createJob(data);
    console.log({ res, err });
  };
  return (
    <Form onSubmit={handleSubmit(submit)} onReset={() => reset}>
      <Form.Input
        register={register}
        error={errors.title}
        name="title"
        label="Title"
      />
      <Form.Input
        register={register}
        error={errors.company}
        name="company"
        label="Company"
      />
      <div className="flex flex-row gap-4">
        <label htmlFor="">Status</label>
        <select id="status" {...register("status")}>
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
