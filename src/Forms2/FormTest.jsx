import { rules } from "eslint-plugin-react-refresh";
import React, { useState } from "react";

const formSchema = {
  name: {
    displayName: "name",
    value: "",
    type: "string",
    rules: [{ type: "required", error: "name is required" }],
  },
  email: {
    displayName: "email",
    value: "",
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
  phoneNumbers: {
    displayName: "Ph no",
    value: "",
    type: "array",
    rules: [{ type: "required", error: "Ph is required" }],
  },
  address: {
    displayName: "address",
    properties: {
      city: {
        displayName: "city",
        value: "",
        type: "string",
        rules: [{ type: "required", error: "city is required" }],
      },
      state: {
        displayName: "state",
        value: "",
        type: "string",
      },
    },
    type: "object",
  },
  siblings: {
    displayName: "sblings",
    properties: {
      name: {
        displayName: "name",
        value: "",
        type: "string",
        rules: [{ type: "required", error: "name is required" }],
      },
      email: {
        displayName: "email",
        value: "",
        type: "string",
      },
    },
    type: "objectArray",
  },
};

const renderForm = (
  formSchema,
  values,
  handleChange,
  errors,
  parentKey = ""
) => {
  return Object.entries(formSchema).map(([key, field]) => {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;

    switch (field.type) {
      case "string":
        return (
          <React.Fragment key={fullKey}>
            <div>{field.displayName}</div>
            <input
              name={fullKey}
              value={values?.[key] || ""}
              onChange={(e) => {
                handleChange(fullKey, e.target.value);
              }}
            />
            <div style={{ color: "red" }}>{errors[fullKey]}</div>
          </React.Fragment>
        );
      case "object": {
        return (
          <div key={fullKey}>
            <div>{field.displayName}</div>
            <div
              style={{
                paddingLeft: "40px",
              }}
            >
              {renderForm(
                formSchema?.[key]?.properties,
                values?.[key] || {},
                handleChange,
                errors,
                fullKey
              )}
            </div>
            <div style={{ color: "red" }}>{errors[fullKey]}</div>
          </div>
        );
      }
      case "array": {
        return (
          <div key={fullKey}>
            <div>{field.displayName}</div>
            {(values?.[key] || []).map((value, index) => {
              let pathKey = `${fullKey}.${index}`;
              return (
                <div key={pathKey}>
                  <input
                    name={pathKey}
                    value={value}
                    onChange={(e) => {
                      handleChange(pathKey, e.target.value);
                    }}
                  />
                </div>
              );
            })}
            <div style={{ color: "red" }}>{errors[fullKey]}</div>
            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
              key={fullKey + "add-btn"}
            >
              <button
                onClick={() => {
                  handleChange(fullKey, [...(values?.[key] || []), ""]);
                }}
              >
                +
              </button>
              <button
                key={fullKey + "del-btn"}
                onClick={() => {
                  const newValuesArray = [...(values?.[key] || [])].slice(
                    0,
                    -1
                  );
                  handleChange(fullKey, newValuesArray || []);
                }}
              >
                -
              </button>
            </div>
          </div>
        );
      }
      case "objectArray": {
        return (
          <div key={fullKey}>
            <div>{field.displayName}</div>
            <div>
              {(values?.[key] || []).map((value, index) => {
                let pathKey = `${fullKey}.${index}`;
                return (
                  <div
                    style={{
                      paddingLeft: "40px",
                    }}
                    key={pathKey}
                  >
                    {renderForm(
                      formSchema?.[key]?.properties,
                      value,
                      handleChange,
                      errors,
                      pathKey
                    )}
                  </div>
                );
              })}
            </div>
            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <button
                onClick={() => {
                  const newProps = Object.fromEntries(
                    Object.keys(field.properties).map((key) => [key, ""])
                  );
                  handleChange(fullKey, [...(values?.[key] || []), newProps]);
                }}
              >
                +
              </button>
              <button
                onClick={() => {
                  const newValuesArray = [...(values?.[key] || [])].slice(
                    0,
                    -1
                  );
                  handleChange(fullKey, newValuesArray || []);
                }}
              >
                -
              </button>
            </div>
          </div>
        );
      }
    }
  });
};

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

const validateAllFields = (schema, values, errors, parentKey = "") => {
  console.log("validateAllFields", schema, values, errors, parentKey);

  Object.entries(schema).forEach(([key, field]) => {
    const fullKey = parentKey ? `${parentKey}.${key}` : key;
    const value = values?.[key];
    switch (field.type) {
      case "string":
      case "array":
        errors[fullKey] = validateField(field, value);
        break;

      case "object":
        validateAllFields(field.properties, value || {}, errors, fullKey);
        break;

      case "objectArray":
        (value || []).forEach((item, index) => {
          validateAllFields(
            field.properties,
            item,
            errors,
            `${fullKey}.${index}`
          );
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
};

const setValue = (formObject, path, value) => {
  let keys = path.split(".");
  const newObject = { ...formObject };
  let curr = newObject;
  keys.forEach((k, i) => {
    if (keys.length - 1 == i) {
      curr[k] = value;
    } else {
      if (!(k in curr)) {
        curr[k] = isNaN(keys[i + 1]) ? {} : [];
      }
      curr[k] = Array.isArray(curr[k]) ? [...curr[k]] : { ...curr[k] };
      curr = curr[k];
    }
  });
  return newObject;
};

const FormTest = () => {
  const [valueObject, setValueObject] = useState({});
  const [errorObject, setErrorObject] = useState({});

  const handleChange = (path, value) => {
    setValueObject((prev) => setValue(prev, path, value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allErrors = validateAllFields(formSchema, valueObject, {
      ...errorObject,
    });
    console.log(allErrors);

    const hasErrors = Object.values(allErrors).some((error) => error != null);
    setErrorObject(allErrors);
    console.log(allErrors, hasErrors);
  };

  return (
    <form onSubmit={handleSubmit}>
      {renderForm(formSchema, valueObject, handleChange, errorObject)}
      <button>Submit</button>
    </form>
  );
};

export default FormTest;
