import { getClasses } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  squared?: boolean;
}

const Skeleton = ({ className, squared = false, ...props }: Props) => {
  return (
    <div
      className={getClasses(
        "h-4 animate-pulse rounded-md bg-gray-200",
        className,
        {
          "rounded-none": squared,
        }
      )}
      {...props}
    />
  );
};

export default Skeleton;
