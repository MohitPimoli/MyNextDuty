// formConfig.js

const formConfig = {
  login: {
    fields: [
      {
        name: "email",
        label: "Email Address",
        type: "email",
        placeholder: "Enter your email",
        required: true,
        validation: (value) =>
          /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value) ||
          "Please enter a valid email address.",
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "Enter your password",
        required: true,
        validation: (value) => value.length >= 6 || "Password must be at least 6 characters long.",
      },
    ],
  },
  signup: {
    fields: [
      {
        name: "email",
        label: "Email Address",
        type: "email",
        placeholder: "Enter your email",
        required: true,
        validation: (value) =>
          /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value) ||
          "Please enter a valid email address.",
      },
      {
        name: "username",
        label: "Username",
        type: "text",
        placeholder: "Choose a username",
        required: true,
        validation: (value) => value.length >= 3 || "Username must be at least 3 characters long.",
      },
      {
        name: "firstName",
        label: "First Name",
        type: "text",
        placeholder: "Enter your first name",
        required: true,
      },
      {
        name: "lastName",
        label: "Last Name",
        type: "text",
        placeholder: "Enter your last name",
        required: false,
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "Enter your password",
        required: true,
        validation: (value) => value.length >= 6 || "Password must be at least 6 characters long.",
      },
      {
        name: "confirmPassword",
        label: "Confirm Password",
        type: "password",
        placeholder: "Confirm your password",
        required: true,
        validation: (value, fields) => value === fields.password || "Passwords do not match.",
      },
    ],
  },
};

export default formConfig;
