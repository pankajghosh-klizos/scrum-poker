import { forwardRef, InputHTMLAttributes, useId, CSSProperties } from "react";
import "./Input.css";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  containerClassName?: string;
  errorMessage?: string;
  style?: CSSProperties;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    type = "text",
    containerClassName = "",
    className = "",
    errorMessage = "",
    style,
    ...props
  },
  ref
) {
  const id = useId();

  return (
    <div className={`input position-relative ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className="form-label bg-white px-2 rounded">
          {label}
        </label>
      )}

      <input
        type={type}
        id={id}
        className={`form-control shadow-none border-2 bg-white ${className}`}
        ref={ref}
        style={style}
        {...props}
      />

      <p className="m-0 small text-danger">{errorMessage}</p>
    </div>
  );
});

export default Input;
