import React from "react";
import { useState } from "react";
import usePrev from "./usePrev";


function PreviousComponent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("Sergey");
  const previousCount = usePrev(count);

  return (
    <div>
      <div>
        {count} - {previousCount}
      </div>
      <div>{name}</div>
      <button onClick={() => setCount((currentCount) => currentCount + 1)}>
        Increment
      </button>
      <button onClick={() => setName("John")}>Change Name</button>
    </div>
  );
}

const UsePrevHookTest = () => {
  return (
    <div>
      <PreviousComponent />
    </div>
  );
};

export default UsePrevHookTest;
