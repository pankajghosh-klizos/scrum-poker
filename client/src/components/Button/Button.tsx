import { ReactNode, MouseEventHandler } from "react";

interface ButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const Button = ({ children, className = "", onClick }: ButtonProps) => {
  return (
    <button className={`btn ${className}`.trim()} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
