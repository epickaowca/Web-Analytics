import React, { FC } from "react";
import styles from "./ArrowBackSvg.module.scss";

type ArrowBackSvgProps = {
  className?: string;
};

export const ArrowBackSvg: FC<ArrowBackSvgProps> = ({ className }) => {
  return (
    <svg
      className={styles.inheritFill}
      width="23"
      height="16"
      viewBox="0 0 23 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className={styles.inheritFill}
        d="M0.292891 7.29289C-0.097633 7.68342 -0.097633 8.31658 0.292891 8.70711L6.65685 15.0711C7.04738 15.4616 7.68054 15.4616 8.07107 15.0711C8.46159 14.6805 8.46159 14.0474 8.07107 13.6569L2.41421 8L8.07107 2.34315C8.46159 1.95262 8.46159 1.31946 8.07107 0.928932C7.68054 0.538408 7.04738 0.538408 6.65685 0.928932L0.292891 7.29289ZM22.4996 7L0.999998 7V9L22.4996 9V7Z"
      />
    </svg>
  );
};
