import { HTMLAttributes } from "react";
import "./Loader.css";

interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  size?: "small" | "medium" | "large";
  revert?: boolean;
}

const Loader = ({
  className = "",
  size = "medium",
  revert,
  ...props
}: LoaderProps) => {
  const sizeClass = {
    small: "spinner-border-sm",
    medium: "",
    large: "spinner-border-lg",
  }[size];

  return (
    <div
      className={`spinner-border text-primary ${sizeClass} ${className} ${
        revert ? "spinner-border-revert" : ""
      }`.trim()}
      aria-live="polite"
      aria-atomic="true"
      {...props}
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

export default Loader;
