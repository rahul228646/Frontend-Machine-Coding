import React, { useState } from "react";

const TodoList = () => {
  const [list, setList] = useState([]);
  const [input, setInput] = useState("");

  const handleOnChange = (e) => {
    setInput(e.target.value.trim());
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input) {
      addToList(input);
    }
  };

  const addToList = (value) => {
    setList((prev) => [
      ...prev,
      { id: Date.now(), name: value, completed: false },
    ]);
    setInput("");
  };

  const deleteFromList = (id) => {
    setList((prev) => {
      return prev.filter((item) => item.id != id);
    });
  };

  const handleCompleted = (id) => {
    let newList = [...list];
    newList = newList.map((item) => {
      if (id === item.id) {
        item.completed = !item.completed;
      }
      return item;
    });
    setList(newList);
  };

  return (
    <div>
      <div>
        <input
          value={input}
          onChange={handleOnChange}
          onKeyDown={handleKeyDown}
        />
        <button onClick={() => addToList(input)}>Add</button>
      </div>
      <ul>
        {list?.map((item, index) => {
          return (
            <li key={item.id}>
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => handleCompleted(item.id)}
              />
              <span
                style={{
                  textDecoration: item.completed && "line-through",
                }}
              >
                {item.name}
              </span>
              <button onClick={() => deleteFromList(item.id)}>delete</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TodoList;
