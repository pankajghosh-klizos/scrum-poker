import { FC } from "react";

interface CardProps {
  value?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Card: FC<CardProps> = ({ value, className, onClick, disabled }) => {
  return (
    <div className="d-flex flex-column align-items-center">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`btn border ${className}`}
        style={{ width: "60px", height: "90px", borderRadius: "8px" }}
      >
        {value}
      </button>
    </div>
  );
};

export default Card;
