import React, { useEffect, useState } from "react";
import * as styles from "./progressBar.module.css";

const ProgressBar = (startPercentage = 50) => {
  const [progress, setProgress] = useState(50);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 1;
        } else {
          return 100;
        }
      });
      return () => {
        clearInterval(intervalId);
      };
    }, 100);
  }, []);

  return (
    <>
      <div>
        <span>Progress : </span>
        <span>
          {progress} {"%"}
        </span>
      </div>
      <div className={styles.root}>
        <div
          className={styles.progress}
          //   style={{
          //     width: `${progress}%`,
          //   }}
          style={{
            transform: `translateX(-${100 - progress}%)`, // better as browser doesn't repaint
          }}
        />
      </div>
    </>
  );
};

export default ProgressBar;
