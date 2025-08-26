import React, { useState, useRef, useEffect } from "react";
import { fileDataOptimized as initialData } from "./Data";

const FileComponent = ({
  file,
  isExpanded,
  setExpanded,
  addFile,
  deleteFile,
}) => {
  const [showInput, setShowInput] = useState(false);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef(null);

  const handleExpand = (e) => {
    e.stopPropagation();
    const action = e.target.dataset.value;
    if (action === "expand") {
      setExpanded(file.id);
    }
    if (action === "add") {
      setExpanded(file.id, true);
      setShowInput(true);
    }
    if (action === "delete") {
      deleteFile(file.id);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && fileName.trim()) {
      addFile(file.id, fileName);
      setFileName("");
      setShowInput(false);
    }
  };

  useEffect(() => {
    if (showInput && inputRef.current) inputRef.current.focus();
  }, [showInput]);

  return (
    <div style={{ paddingLeft: "15px" }}>
      <div style={{ display: "flex", gap: "5px" }} onClick={handleExpand}>
        {file.isFolder && (
          <span data-value="expand">{isExpanded[file.id] ? "↓" : "↑"}</span>
        )}
        <span>{file.name}</span>
        {file.isFolder && <span data-value="add">+</span>}
        {!file.disableDelete && <span data-value="delete">-</span>}
      </div>
      {showInput && (
        <input
          ref={inputRef}
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      )}
    </div>
  );
};

const List = ({
  rootId,
  data,
  isExpanded,
  setExpanded,
  addFile,
  deleteFile,
}) => {
  const root = data[rootId];
  if (!root) return null;

  return (
    <>
      <FileComponent
        file={root}
        isExpanded={isExpanded}
        setExpanded={setExpanded}
        addFile={addFile}
        deleteFile={deleteFile}
      />
      {root.isFolder && isExpanded[root.id] && root.children.length > 0 && (
        <div style={{ paddingLeft: "15px" }}>
          {root.children.map((childId) => (
            <List
              key={childId}
              rootId={childId}
              data={data}
              isExpanded={isExpanded}
              setExpanded={setExpanded}
              addFile={addFile}
              deleteFile={deleteFile}
            />
          ))}
        </div>
      )}
    </>
  );
};

const FileExplorerOptimized = () => {
  const [data, setData] = useState(initialData);
  const [isExpanded, setIsExpanded] = useState({ 1: true }); // root open

  const addFile = (parentId, name) => {
    const newId = Date.now();
    setData((prev) => {
      const parent = prev[parentId];
      return {
        ...prev,
        [newId]: {
          id: newId,
          name,
          isFolder: true,
          children: [],
          parent: parentId,
        },
        [parentId]: {
          ...parent,
          children: [...parent.children, newId],
        },
      };
    });
  };

  const deleteFile = (id) => {
    setData((prev) => {
      const copy = { ...prev };
      const parentId = copy[id].parent;
      if (parentId && copy[parentId]) {
        copy[parentId] = {
          ...copy[parentId],
          children: copy[parentId].children.filter((cid) => cid !== id),
        };
      }
      delete copy[id];
      return copy;
    });
  };

  const setExpanded = (id, forceValue = null) => {
    setIsExpanded((prev) => ({
      ...prev,
      [id]: forceValue ?? !prev[id],
    }));
  };

  return (
    <div>
      <List
        rootId={1}
        data={data}
        isExpanded={isExpanded}
        setExpanded={setExpanded}
        addFile={addFile}
        deleteFile={deleteFile}
      />
    </div>
  );
};

export default FileExplorerOptimized;
