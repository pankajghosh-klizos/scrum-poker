import { ButtonHTMLAttributes, FC } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const Button: FC<ButtonProps> = ({
  children = "Button",
  type = "button",
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      className={`btn d-flex align-items-center justify-content-center gap-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
