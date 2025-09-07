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
    rules: [{ type: "required", error: "at least one phone is required" }],
  },
  address: {
    displayName: "Address",
    type: "object",
    properties: {
      city: {
        displayName: "City",
        type: "string",
        rules: [{ type: "required", error: "city is required" }],
      },
      state: { displayName: "State", type: "string" },
    },
  },
  sibblings: {
    displayName: "Siblings",
    type: "objectArray",
    rules: [{ type: "required", error: "at least one sibling is required" }],
    properties: {
      name: {
        displayName: "Name",
        type: "string",
        rules: [{ type: "required", error: "sibling name is required" }],
      },
      age: { displayName: "Age", type: "string" },
    },
  },
};

// ✅ setDeep
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

// ✅ validate one field
function validateField(field, value) {
  if (!field.rules) return null;

  for (let rule of field.rules) {
    if (rule.type === "required") {
      if (
        value === "" ||
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0)
      ) {
        return rule.error;
      }
    }
    if (rule.type === "regex" && value) {
      const regex = new RegExp(rule.regex);
      if (!regex.test(value)) {
        return rule.error;
      }
    }
  }
  return null;
}

// ✅ validate all fields (recursively)
function validateAll(schema, values, parentKey = "", errors = {}) {
  Object.entries(schema).forEach(([key, field]) => {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;
    const value = values?.[key];

    switch (field.type) {
      case "string":
      case "array":
        errors[fullKey] = validateField(field, value);
        break;

      case "object":
        validateAll(field.properties, value || {}, fullKey, errors);
        break;

      case "objectArray":
        (value || []).forEach((item, index) => {
          validateAll(field.properties, item, `${fullKey}[${index}]`, errors);
        });
        if (field.rules) {
          errors[fullKey] = validateField(field, value);
        }
        break;

      default:
        break;
    }
  });

  return errors;
}

// ✅ renderer
const renderForm = (schema, values, handleChange, errors, parentKey = "") => {
  return Object.entries(schema).map(([key, field]) => {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;
    const error = errors[fullKey];

    switch (field.type) {
      case "string":
        return (
          <React.Fragment key={fullKey}>
            <div>{field.displayName}</div>
            <input
              name={fullKey}
              value={values?.[key] || ""}
              onChange={(e) => handleChange(fullKey, e.target.value, field)}
            />
            {error && <div style={{ color: "red" }}>{error}</div>}
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
                  handleChange(`${fullKey}[${index}]`, e.target.value, field)
                }
              />
            ))}
            <button
              type="button"
              onClick={() =>
                handleChange(fullKey, [...(values?.[key] || []), ""], field)
              }
            >
              Add
            </button>
            {error && <div style={{ color: "red" }}>{error}</div>}
          </React.Fragment>
        );

      case "object":
        return (
          <React.Fragment key={fullKey}>
            <div style={{ marginTop: "20px", fontWeight: "bold" }}>
              {field.displayName}
            </div>
            <div style={{ paddingLeft: "20px" }}>
              {renderForm(
                field.properties,
                values?.[key] || {},
                handleChange,
                errors,
                fullKey
              )}
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
                    errors,
                    `${fullKey}[${index}]`
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const newArr = [...(values?.[key] || [])];
                      newArr.splice(index, 1);
                      handleChange(fullKey, newArr, field);
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
                  handleChange(
                    fullKey,
                    [...(values?.[key] || []), newItem],
                    field
                  );
                }}
              >
                Add {field.displayName}
              </button>
              {error && <div style={{ color: "red" }}>{error}</div>}
            </div>
          </React.Fragment>
        );

      default:
        return null;
    }
  });
};

// ✅ Main
const Forms2 = () => {
  const [valueObject, setValueObject] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (path, value, field) => {
    setValueObject((prev) => setDeep(prev, path, value));
    if (field) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [path]: error }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allErrors = validateAll(formSchema, valueObject);
    setErrors(allErrors);

    const hasErrors = Object.values(allErrors).some((err) => err !== null);
    if (!hasErrors) {
      alert("Form submitted successfully!");
      console.log("Final Values:", valueObject);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {renderForm(formSchema, valueObject, handleChange, errors)}
      <button type="submit" style={{ marginTop: "20px" }}>
        Submit
      </button>
      <pre>{JSON.stringify(valueObject, null, 2)}</pre>
      <pre>{JSON.stringify(errors, null, 2)}</pre>
    </form>
  );
};

export default Forms2;
