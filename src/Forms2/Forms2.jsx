import React, { useState } from "react";

const formSchema = {
  name: {
    displayName: "Name",
    type: "string",
    rules: [{ type: "required", error: "name is required" }],
  },
  email: {
    displayName: "Email",
    type: "string",
    rules: [
      { type: "required", error: "email is required" },
      {
        type: "regex",
        regex: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
        error: "invalid email",
      },
    ],
  },
  phoneNumber: {
    displayName: "Phone Number",
    type: "array",
    value: [],
  },
  address: {
    displayName: "Address",
    type: "object",
    properties: {
      city: { displayName: "City", type: "string" },
      state: { displayName: "State", type: "string" },
    },
  },
  sibblings: {
    displayName: "Siblings",
    type: "objectArray",
    properties: {
      name: { displayName: "Name", type: "string" },
      age: { displayName: "Age", type: "string" },
    },
  },
};

function setDeep(obj, path, value) {
  const keys = path.replace(/\[(\d+)\]/g, ".$1").split(".");
  const newObj = { ...obj };
  let curr = newObj;

  keys.forEach((k, i) => {
    if (i === keys.length - 1) {
      curr[k] = value;
    } else {
      if (!(k in curr)) {
        curr[k] = isNaN(keys[i + 1]) ? {} : [];
      }
      curr[k] = Array.isArray(curr[k]) ? [...curr[k]] : { ...curr[k] };
      curr = curr[k];
    }
  });

  return newObj;
}

const renderForm = (schema, values, handleChange, parentKey = "") => {
  return Object.entries(schema).map(([key, field]) => {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;

    switch (field.type) {
      case "string":
        return (
          <React.Fragment key={fullKey}>
            <div>{field.displayName}</div>
            <input
              name={fullKey}
              value={values?.[key] || ""}
              onChange={(e) => handleChange(fullKey, e.target.value)}
            />
          </React.Fragment>
        );

      case "array":
        return (
          <React.Fragment key={fullKey}>
            <div>{field.displayName}</div>
            {(values?.[key] || []).map((item, index) => (
              <input
                key={`${fullKey}[${index}]`}
                value={item}
                onChange={(e) =>
                  handleChange(`${fullKey}[${index}]`, e.target.value)
                }
              />
            ))}
            <button
              type="button"
              onClick={() => handleChange(fullKey, [...(values?.[key] || []), ""])}
            >
              Add
            </button>
          </React.Fragment>
        );

      case "object":
        return (
          <React.Fragment key={fullKey}>
            <div style={{ marginTop: "20px", fontWeight: "bold" }}>
              {field.displayName}
            </div>
            <div style={{ paddingLeft: "20px" }}>
              {renderForm(field.properties, values?.[key] || {}, handleChange, fullKey)}
            </div>
          </React.Fragment>
        );

      case "objectArray":
        return (
          <React.Fragment key={fullKey}>
            <div style={{ marginTop: "20px", fontWeight: "bold" }}>
              {field.displayName}
            </div>
            <div style={{ paddingLeft: "20px" }}>
              {(values?.[key] || []).map((item, index) => (
                <div
                  key={`${fullKey}[${index}]`}
                  style={{
                    border: "1px solid #ccc",
                    padding: "10px",
                    marginBottom: "10px",
                  }}
                >
                  {renderForm(
                    field.properties,
                    item,
                    handleChange,
                    `${fullKey}[${index}]`
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const newArr = [...(values?.[key] || [])];
                      newArr.splice(index, 1);
                      handleChange(fullKey, newArr);
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newItem = Object.fromEntries(
                    Object.keys(field.properties).map((k) => [k, ""])
                  );
                  handleChange(fullKey, [...(values?.[key] || []), newItem]);
                }}
              >
                Add {field.displayName}
              </button>
            </div>
          </React.Fragment>
        );

      default:
        return null;
    }
  });
};

const Forms2 = () => {
  const [valueObject, setValueObject] = useState({});

  const handleChange = (path, value) => {
    setValueObject((prev) => setDeep(prev, path, value));
  };

  return (
    <div>
      {renderForm(formSchema, valueObject, handleChange)}
      <pre>{JSON.stringify(valueObject, null, 2)}</pre>
    </div>
  );
};

export default Forms2;