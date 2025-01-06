import { forwardRef, SelectHTMLAttributes, useId } from "react";
import "./Select.css";

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  placeholder?: string;
  containerClassName?: string;
  className?: string;
  errorMessage?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    label,
    options = [],
    placeholder = "Select an option",
    containerClassName = "",
    className = "",
    errorMessage = "",
    ...props
  },
  ref
) {
  const id = useId();

  return (
    <div className={`select position-relative ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className="form-label px-2 bg-white">
          {label}
        </label>
      )}

      <select
        id={id}
        ref={ref}
        className={`form-select shadow-none border-2 ${className}`}
        defaultValue=""
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <p className="m-0 small text-danger">{errorMessage}</p>
    </div>
  );
});

export default Select;
