import { CSSProperties, ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

const Container = ({ children, className = "", style }: ContainerProps) => {
  return (
    <div className={`container ${className}`} style={style}>
      {children}
    </div>
  );
};

export default Container;
