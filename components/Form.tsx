import { getClasses } from "@/lib/utils";
import {
  Path,
  UseFormRegister,
  RegisterOptions,
  FieldError,
  FieldValues,
} from "react-hook-form";
type FormProps = React.HTMLAttributes<HTMLFormElement>;

type InputProps<TFormValues extends FieldValues> = {
  label: string;
  register: UseFormRegister<TFormValues>;
  rules?: RegisterOptions;
  name: Path<TFormValues>;
  error?: FieldError;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name">;

const Form = ({ ...props }: FormProps) => {
  return (
    <form
      {...props}
      className={getClasses(
        "mx-auto flex w-full max-w-screen-sm flex-col gap-6 rounded-lg border border-gray-600/50 bg-zinc-950 p-4 shadow-md",
        props.className
      )}
    >
      {props.children}
    </form>
  );
};

const Input = <TFormValues extends {}>({
  className,
  name,
  label,
  register,
  rules,
  error,
  ...props
}: InputProps<TFormValues>) => {
  return (
    <div className={getClasses("flex flex-col", className)}>
      <label htmlFor={name}>{label}</label>
      <input
        {...props}
        {...register(name, rules)}
        id={name}
        className={getClasses(
          "rounded border border-gray-400/40 bg-zinc-900 p-2 placeholder:capitalize",
          className
        )}
      />
      {error && <p className="text-xs text-red-600">{error.message}</p>}
    </div>
  );
};

Form.Input = Input;
export default Form;
