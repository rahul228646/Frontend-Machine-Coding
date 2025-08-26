import React, { useEffect, useRef, useState } from "react";

const OtpOptimised = ({ digits = 6 }) => {
  const [fields, setFields] = useState(
    Array.from({ length: digits }).map(() => "")
  );
  const refArray = useRef([]);
  const handleOnChange = (e, index) => {
    const value = e.target.value.trim();
    if (isNaN(value)) return;
    const newArray = [...fields];
    newArray[index] = value.slice(-1);
    setFields(newArray);
    if (value && index + 1 < digits) {
      refArray.current[index + 1]?.focus();
    }
  };

  useEffect(() => {
    refArray.current[0]?.focus();
  }, []);
  const hanldeKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index - 1 >= 0) {
      refArray.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index + 1 < digits) {
      refArray.current[index + 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index - 1 >= 0) {
      refArray.current[index - 1]?.focus();
    }
  };
  return (
    <div
      style={{
        display: "flex",
        gap: "4px",
      }}
    >
      {fields.map((value, index) => {
        return (
          <input
            key={index}
            style={{
              width: "30px",
              height: "30px",
            }}
            ref={(input) => (refArray.current[index] = input)}
            value={value}
            data-index={index}
            onChange={(e) => handleOnChange(e, index)}
            onKeyDown={(e) => hanldeKeyDown(e, index)}
          />
        );
      })}
    </div>
  );
};

export default OtpOptimised;
