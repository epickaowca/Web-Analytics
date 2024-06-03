import React, { FC } from "react";
import styles from "./styles.module.scss";

export const DashboardSvg: FC = () => {
  return (
    <svg
      className={styles.Svg}
      width="15"
      height="14"
      viewBox="0 0 15 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        className={styles.Rect}
        x="0.5"
        y="0.5"
        width="5.22222"
        height="5.22222"
        rx="1.5"
        stroke="white"
      />
      <rect
        className={styles.Rect}
        x="0.5"
        y="8.27777"
        width="5.22222"
        height="5.22222"
        rx="1.5"
        stroke="white"
      />
      <rect
        className={styles.Rect}
        x="9.05566"
        y="0.5"
        width="5.22222"
        height="5.22222"
        rx="1.5"
        stroke="white"
      />
      <rect
        className={styles.Rect}
        x="9.05566"
        y="8.27777"
        width="5.22222"
        height="5.22222"
        rx="1.5"
        stroke="white"
      />
    </svg>
  );
};
