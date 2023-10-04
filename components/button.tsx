"use client";
import { type } from "os";
import React from "react";
import { ThemeContext } from "@/context/theme";

interface ButtonProps {
  onClick: any;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  primary?: boolean;
  secondary?: boolean;
  style?: {};
  variant?: string;
  border?: string;
  className?: string;
}


const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  type = "button",
  disabled = false,
  size = "md",
  primary = false,
  secondary = false,
  border = "",
  style = {},
  variant = "",
  className = ""
}) => {
  const getSizeClasses = (size: string) => {
    switch (size) {
      case "xs":
        return "px-4 py-1 text-sm font-medium rounded-md";
      case "sm":
        return "px-[18px] py-[7px] text-sm font-medium rounded-md";
      case "lg":
        return "px-6 py-2 text-md sm:px-16 sm:py-3 sm:text-lg font-medium rounded-xl";
      default:
        return "px-[1.5rem] py-[1rem] text-md font-medium rounded-[14px]";
    }
  }

  const getStyleClasses = (style: string, theme: string) => {
    if (variant === "blue") return `bg-blue-100 text-${theme}-bg-primary`;
    if (variant === "disabled") return `bg-gray-300 text-gray-500`;
    if (variant === "grey") return `bg-gray-300`;

    switch (style) {
      case "secondary":
        return `text-${theme}-text-primary border-2 border-${theme}-border-primary`;
      default:
        return `bg-${theme}-button-primary text-${theme}-bg-primary`;
    }
  }

  if (!primary && !secondary) primary = true;
  const { theme, setTheme } = React.useContext(ThemeContext) || { theme: 'light', setTheme: () => { } };
  const classes = getStyleClasses((primary ? 'primary' : 'secondary'), theme)
  return (
    <button
      type={type}
      className={`${getSizeClasses(size)} ${classes} bg-${theme}-secondary text-${theme}-primary bg-${theme}-button-${style} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
};

export default Button;