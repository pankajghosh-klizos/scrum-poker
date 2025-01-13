import { FiCheckCircle } from "react-icons/fi";
import { CardProps } from "../../interfaces";

const Card = ({ value, className, onClick, disabled, checked }: CardProps) => {
  return (
    <div className="d-flex flex-column align-items-center">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`btn border fs-5 ${className}`}
        style={{ width: "60px", height: "90px" }}
      >
        {checked ? (
          <FiCheckCircle size={25} color="#ffffff" />
        ) : (
          <span>{value}</span>
        )}
      </button>
    </div>
  );
};

export default Card;
