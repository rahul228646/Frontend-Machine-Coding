import React, { useEffect, useRef, useState } from "react";
import { fileData } from "./Data";

const FileComponent = ({
  file,
  isExpanded = false,
  setExpanded,
  addFile,
  deleteFile,
}) => {
  const [showInput, setShowInput] = useState(false);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef(null);
  const handleExpand = (e) => {
    if (e.target.dataset.value === "expand") {
      setExpanded();
    }
    if (e.target.dataset.value === "add") {
      setExpanded(true);
      setShowInput((prev) => !prev);
    }
    if (e.target.dataset.value === "delete") {
      deleteFile(e.target.dataset.id);
    }
  };
  const handleChange = (e) => {
    setFileName(e.target.value);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && fileName.trim() != "") {
      addFile(e.target.dataset.id, fileName);
      setFileName("");
      setShowInput(false);
    }
  };
  const RenderExpandedSpan = () => {
    if (!file.isFolder) return null;
    return (
      <>
        {isExpanded ? (
          <span data-value="expand">↓</span>
        ) : (
          <span data-value="expand">↑</span>
        )}
      </>
    );
  };
  return (
    <>
      <div style={{ display: "flex", gap: "5px" }} onClick={handleExpand}>
        <RenderExpandedSpan />

        <span>{file.name}</span>
        {file.isFolder && (
          <span data-value="add" data-id={file.id}>
            +
          </span>
        )}
        {file?.diableDelete ?? (
          <span data-value="delete" data-id={file.id}>
            -
          </span>
        )}
      </div>
      {showInput && (
        <input
          data-id={file.id}
          ref={inputRef}
          value={fileName}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      )}
    </>
  );
};

const List = ({ list, addFile, deleteFile }) => {
  const [isExpanded, setIsExpanded] = useState({});
  return (
    <>
      {list.map((item) => {
        return (
          <div key={item.id} style={{ paddingLeft: "15px" }}>
            <FileComponent
              file={item}
              isExpanded={isExpanded[item.id]}
              setExpanded={(val = null) =>
                setIsExpanded((prev) => {
                  return {
                    ...prev,
                    [item.id]: val != null ? val : !prev[item.id],
                  };
                })
              }
              deleteFile={(id) => deleteFile(id)}
              addFile={(id, name) => addFile(id, name)}
            />
            {isExpanded[item.id] && (
              <List
                list={item.children}
                addFile={addFile}
                deleteFile={deleteFile}
              />
            )}
          </div>
        );
      })}
    </>
  );
};

const FileExplorer = () => {
  const [data, setData] = useState(fileData);

  const addFile = (id, name) => {
    const updateList = (list) => {
      return list.map((item) => {
        if (item.id == id) {
          return {
            ...item,
            children: [
              ...(item.children ? item.children : []),
              {
                id: crypto.randomUUID(),
                name: name,
                isFolder: true,
                children: [],
              },
            ],
          };
        }
        if (item.children) {
          return {
            ...item,
            children: updateList(item.children),
          };
        }
        return item;
      });
    };

    setData((prev) => updateList(prev));
  };

  const deleteFile = (id) => {
    const updateList = (list) => {
      return list
        .filter((item) => item.id != id)
        .map((item) => {
          if (item.children) {
            return {
              ...item,
              children: updateList(item.children),
            };
          }
          return item;
        });
    };

    setData((prev) => updateList(prev));
  };
  return (
    <div>
      <List
        list={data}
        deleteFile={(id) => deleteFile(id)}
        addFile={(id, name) => addFile(id, name)}
      />
    </div>
  );
};

export default FileExplorer;
