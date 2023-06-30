import { getClasses } from "@/lib/utils";
import Link from "next/link";
import React from "react";

type AsProp<C extends React.ElementType> = {
  as?: C extends "button" | typeof Link ? C : never;
};

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

type PolymorphicComponentProp<
  C extends React.ElementType,
  Props = {}
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

type ButtonProps = {
  variant?: "primary" | "secondary" | "tertiary" | "custom";
  useResetStyles?: boolean;
};

type Props<C extends React.ElementType> = PolymorphicComponentProp<
  C,
  ButtonProps
>;

interface VariantStyles {
  primary: string;
  secondary: string;
  tertiary: string;
  custom: string;
}

const baseStyles: VariantStyles = {
  primary: "rounded-xl p-2 font-semibold",
  secondary: "rounded-xl p-2 font-semibold",
  tertiary: "font-semibold",
  custom: "",
};

const disabledStyles: VariantStyles = {
  primary:
    "disabled:bg-gray-500 disabled:cursor-not-allowed disabled:hover:outline-0",
  secondary:
    "disabled:cursor-not-allowed disabled:text-gray-500 disabled:border-gray-500 disabled:hover:outline-0",
  tertiary: "disabled:cursor-not-allowed disabled:text-gray-500",
  custom: "disabled:cursor-not-allowed",
};

const resetStyles: VariantStyles = {
  primary:
    "bg-red-400 text-white shadow-lg hover:outline hover:outline-2 hover:outline-offset-2 hover:outline-red-400",
  secondary:
    "border border-red-400 shadow-lg text-red-400 hover:outline hover:outline-2 hover:outline-red-400",
  tertiary: "text-red-400 underline",
  custom: "",
};

const normalStyles: VariantStyles = {
  primary:
    "shadow-lg bg-blue-600 text-white hover:outline hover:outline-2 hover:outline-offset-2 hover:outline-blue-600",
  secondary:
    "border border-blue-600 shadow-lg text-blue-600 hover:outline hover:outline-2 hover:outline-blue-600",
  tertiary: "underline text-blue-600",
  custom: ``,
};

const Button = <C extends React.ElementType = "button">({
  as,
  children,
  variant = "primary",
  useResetStyles = false,
  className,
  ...props
}: Props<C>) => {
  const Component = as || "button";

  const isReset = props.type === "reset" || useResetStyles;

  return (
    <Component
      {...props}
      className={getClasses(
        baseStyles[variant],
        !isReset && normalStyles[variant],
        disabledStyles[variant],
        isReset && resetStyles[variant],
        className
      )}
    >
      {children}
    </Component>
  );
};

export default Button;
