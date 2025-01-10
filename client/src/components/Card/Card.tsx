import { FC } from "react";
import { FiCheckCircle } from "react-icons/fi";

interface CardProps {
  value?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  checked?: boolean;
}

const Card: FC<CardProps> = ({
  value,
  className,
  onClick,
  disabled,
  checked,
}) => {
  return (
    <div className="d-flex flex-column align-items-center">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`btn border fs-5 ${className}`}
        style={{ width: "60px", height: "90px" }}
      >
        {checked ? <FiCheckCircle size={25} color="#ffffff" /> : value}
      </button>
    </div>
  );
};

export default Card;
