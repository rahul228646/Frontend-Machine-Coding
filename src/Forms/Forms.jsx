import React, { useState } from "react";

const FormComponet = ({ formAttribute, handleChange }) => {
  const getComponent = () => {
    switch (formAttribute.type) {
      case "INPUT":
        return (
          <input
            name={formAttribute.name}
            value={formAttribute.value}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
          />
        );
    }
  };
  return (
    <div>
      <div>{formAttribute.displayName}</div>
      {getComponent()}
      {formAttribute.error && (
        <div style={{ color: "red" }}>{formAttribute.error}</div>
      )}
    </div>
  );
};

const Forms = () => {
  const formSchema = {
    name: {
      displayName: "Name",
      value: "",
      type: "INPUT",
      name: "name",
      require: true,
      error: "",
      validations: [
        { type: "required", message: "Name is required" },
        {
          type: "minLength",
          value: 3,
          message: "Name must be at least 3 characters",
        },
      ],
    },
    email: {
      displayName: "Email",
      value: "",
      type: "INPUT",
      name: "email",
      require: true,
      error: "",
      validations: [
        { type: "required", message: "Email is required" },
        {
          type: "pattern",
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Invalid email format",
        },
      ],
    },
  };
  const [form, setForm] = useState(formSchema);

  const handleChange = (name, value) => {
    const updatedForm = { ...form };
    updatedForm[name].value = value;
    setForm(updatedForm);
  };

  const validateKey = (key, formAttribute) => {
    let error = "";
    let hasError = false;
    for (let rule of formAttribute.validations) {
      switch (rule.type) {
        case "required":
          if (!formAttribute.value?.trim()) {
            error = rule.message;
          }
          break;
        case "minLength":
          if (formAttribute.value.length < rule.value) {
            error = rule.message;
          }
          break;
        case "maxLength":
          if (formAttribute.value.length > rule.value) {
            error = rule.message;
          }
          break;
        case "pattern":
          if (!rule.value.test(formAttribute.value)) {
            error = rule.message;
          }
          break;
        case "custom":
          if (!rule.validate(formAttribute.value)) {
            error = rule.message;
          }
          break;
        default:
          break;
      }

      if (error) break;
    }

    return {
      hasError,
      error,
    };
  };

  const validateForm = (form) => {
    const formWithErrors = { ...form };
    let hasAnyErrorInForm = false;
    for (let key in formWithErrors) {
      const { hasError, error } = validateKey(key, formWithErrors[key]);
      formWithErrors[key].error = error;
      if (!hasAnyErrorInForm) {
        hasAnyErrorInForm = hasError;
      }
    }
    setForm(formWithErrors);
    return hasAnyErrorInForm;
  };

  const mapFormData = () => {
    const hasError = validateForm(form);
    if (hasError) {
      return;
    }
    const result = {};
    for (let key in form) {
      result[key] = form[key].value;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      {Object.keys(form).map((formAttributeKey) => {
        const formAttribute = form[formAttributeKey];
        return (
          <FormComponet
            formAttribute={formAttribute}
            handleChange={handleChange}
          />
        );
      })}
      <button onClick={mapFormData}>Submit</button>
    </div>
  );
};

export default Forms;
