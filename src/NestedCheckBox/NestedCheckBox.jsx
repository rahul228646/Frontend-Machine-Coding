import React, { useState } from "react";
import { data } from "./data";

const CheckListCompomnent = ({ item, onCheckBoxClick }) => {
  return (
    <div>
      <input
        type="checkbox"
        checked={item.checked}
        onChange={(e) => {
          onCheckBoxClick(item.id, e.target.checked);
        }}
      />
      <span>{item.name}</span>
    </div>
  );
};

const List = ({ data, onCheckBoxClick }) => {
  return (
    <div
      style={{
        paddingLeft: "40px",
      }}
    >
      {data.map((item) => {
        return (
          <div key={item.id}>
            <CheckListCompomnent
              item={item}
              onCheckBoxClick={onCheckBoxClick}
            />
            <List data={item.children} onCheckBoxClick={onCheckBoxClick} />
          </div>
        );
      })}
    </div>
  );
};

const NestedCheckBox = () => {
  const [nestedData, setNestedData] = useState(data);
  const onCheckBoxClick = (id, value) => {
    const updateList = (list) => {
      return list.map((item) => {
        if (item.id === id) {
          const updateChildren = (children) =>
            children.map((child) => ({
              ...child,
              checked: value,
              children: updateChildren(child.children || []),
            }));

          return {
            ...item,
            checked: value,
            children: updateChildren(item.children || []),
          };
        } else {
          const updatedChildren = updateList(item.children || []);

          const areAllChildrenChecked =
            updatedChildren.length > 0 &&
            updatedChildren.every((child) => child.checked);

          return {
            ...item,
            children: updatedChildren,
            checked: areAllChildrenChecked ? true : item.checked,
          };
        }
      });
    };

    setNestedData((prev) => {
      return updateList(prev);
    });
  };
  return <List data={nestedData} onCheckBoxClick={onCheckBoxClick} />;
};

export default NestedCheckBox;
