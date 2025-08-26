import React, { useEffect, useRef, useState } from "react";

const Otp = ({ fileds = 6 }) => {
  const focusRef = useRef(null);
  const [input, setInput] = useState(
    Array.from({ length: fileds }).map(() => "")
  );

  const hanldeChange = (e) => {
    let id = e.target.dataset.value;
    let value = e.target.value;
    value = value.replace(/[^0-9]/g, "");
    if (id) {
      const copy = [...input];
      copy[id] = value.slice(-1);
      setInput(copy);
      id++;
      if (id < fileds) {
        const inputs = focusRef?.current?.childNodes;
        if (inputs && inputs.length >= id) {
          inputs[id]?.focus();
        }
      }
    }
  };

  const hanldeKeyDown = (e) => {
    let id = e.target.dataset.value;
    let key = e.key;
    if (key === "Backspace" && id) {
      e.preventDefault();
      const copy = [...input];
      copy[id] = "";
      setInput(copy);
      id--;
      if (id >= 0) {
        const inputs = focusRef?.current?.childNodes;
        if (inputs && inputs.length >= id) {
          console.log("focus back");
          inputs[id]?.focus();
        }
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "4px",
      }}
      ref={focusRef}
    >
      {Array.from({ length: fileds }).map((_, index) => {
        return (
          <input
            key={index}
            data-value={index}
            style={{
              width: "30px",
              height: "30px",
            }}
            value={input[index]}
            onChange={hanldeChange}
            onKeyDown={hanldeKeyDown}
          />
        );
      })}
    </div>
  );
};

export default Otp;
