import React, { useEffect, useRef, useState } from "react";

const AutoComplete = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const cacheRef = useRef({});

  const fetchData = async () => {
    if (search && search in cacheRef.current) {
      setResults(cacheRef.current[search]);
      return;
    }
    const data = await fetch(
      "https://dummyjson.com/recipes/search?q=" + search
    );
    const result = await data.json();
    if (search) {
      cacheRef.current[search] = result.recipes;
    }
    setResults(result.recipes);
  };

  useEffect(() => {
    const timeOut = setTimeout(fetchData, 300);
    return () => {
      clearTimeout(timeOut);
    };
  }, [search]);

  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value.trim())}
        style={{
          width: "500px",
        }}
      />
      <div
        style={{
          width: "500px",
          maxHeight: "500px",
          overflowY: "auto",
          paddingLeft: "10px",
          marginTop: "5px",
          border: "1px solid white",
        }}
      >
        {results.map((item, index) => {
          return (
            <div key={item.id} style={{ textAlign: "left" }}>
              {item.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AutoComplete;
