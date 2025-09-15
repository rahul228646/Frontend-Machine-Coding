import React, { useEffect, useRef } from "react";


const usePrev = (count) => {
  const prevValueRef = useRef(count);
  useEffect(() => {
    prevValueRef.current = count;
  }, [count]);

  return prevValueRef.current;
};

export default usePrev;
