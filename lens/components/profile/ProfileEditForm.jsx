"use client";

import { useState } from "react";
import Button from "@/components/common/Button/Button";

const LIFE_STAGES = [
  { value: "STUDENT", label: "Student" },
  { value: "EARLY_CAREER", label: "Early Career" },
  { value: "CAREER_BUILDING", label: "Career Building" },
  { value: "FAMILY_BUILDING", label: "Family Building" },
  { value: "MID_CAREER", label: "Mid Career" },
  { value: "PRE_RETIREMENT", label: "Pre Retirement" },
  { value: "RETIREMENT", label: "Retirement" },
  { value: "SENIOR", label: "Senior" },
];

const INPUT_CLASS =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 disabled:opacity-50";

/**
 * ProfileEditForm
 *
 * Props:
 *   initialValues       — { firstName, lastName, dateOfBirth, lifeStage, currentOccupation, educationLevelCode, monthlyIncome }
 *   educationLevels     — [{ levelCode, levelName }]
 *   loading             — boolean (save in progress)
 *   error               — string | null (save error from the server)
 *   onSave(formValues)  — called when validation passes
 *   onCancel()          — called when Cancel is clicked
 */
const ProfileEditForm = ({
  initialValues,
  educationLevels = [],
  loading = false,
  error = null,
  onSave,
  onCancel,
}) => {
  const [values, setValues] = useState({
    firstName: initialValues?.firstName ?? "",
    lastName: initialValues?.lastName ?? "",
    dateOfBirth: initialValues?.dateOfBirth ?? "",
    lifeStage: initialValues?.lifeStage ?? "",
    currentOccupation: initialValues?.currentOccupation ?? "",
    educationLevelCode: initialValues?.educationLevelCode ?? "",
    monthlyIncome: initialValues?.monthlyIncome ?? "",
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear the field error as the user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const errors = {};

    // First name is required
    if (!values.firstName || values.firstName.trim().length === 0) {
      errors.firstName = "First name is required.";
    }

    // Monthly income: if provided, must be a non-negative number
    if (values.monthlyIncome !== "" && values.monthlyIncome !== null) {
      const income = Number(values.monthlyIncome);
      if (isNaN(income) || income < 0) {
        errors.monthlyIncome = "Monthly income must be 0 or greater.";
      }
    }

    // Date of birth: if provided, must be a past date
    if (values.dateOfBirth) {
      const dob = new Date(values.dateOfBirth);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (isNaN(dob.getTime()) || dob >= today) {
        errors.dateOfBirth = "Date of birth must be a past date.";
      }
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});

    // Build the payload, converting empty strings to null for optional fields
    const formValues = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim() || null,
      dateOfBirth: values.dateOfBirth || null,
      lifeStage: values.lifeStage || null,
      currentOccupation: values.currentOccupation.trim() || null,
      educationLevelCode: values.educationLevelCode || null,
      monthlyIncome:
        values.monthlyIncome !== "" ? Number(values.monthlyIncome) : null,
    };

    onSave(formValues);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* First name */}
      <div>
        <label
          htmlFor="firstName"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          First name <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={values.firstName}
          onChange={handleChange}
          disabled={loading}
          className={INPUT_CLASS}
          aria-required="true"
          aria-describedby={fieldErrors.firstName ? "firstName-error" : undefined}
        />
        {fieldErrors.firstName && (
          <p id="firstName-error" role="alert" className="mt-1 text-xs text-red-600">
            {fieldErrors.firstName}
          </p>
        )}
      </div>

      {/* Last name */}
      <div>
        <label
          htmlFor="lastName"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Last name
        </label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={values.lastName}
          onChange={handleChange}
          disabled={loading}
          className={INPUT_CLASS}
          aria-describedby={fieldErrors.lastName ? "lastName-error" : undefined}
        />
        {fieldErrors.lastName && (
          <p id="lastName-error" role="alert" className="mt-1 text-xs text-red-600">
            {fieldErrors.lastName}
          </p>
        )}
      </div>

      {/* Date of birth */}
      <div>
        <label
          htmlFor="dateOfBirth"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Date of birth
        </label>
        <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          value={values.dateOfBirth}
          onChange={handleChange}
          disabled={loading}
          className={INPUT_CLASS}
          aria-describedby={fieldErrors.dateOfBirth ? "dateOfBirth-error" : undefined}
        />
        {fieldErrors.dateOfBirth && (
          <p id="dateOfBirth-error" role="alert" className="mt-1 text-xs text-red-600">
            {fieldErrors.dateOfBirth}
          </p>
        )}
      </div>

      {/* Life stage */}
      <div>
        <label
          htmlFor="lifeStage"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Life stage
        </label>
        <select
          id="lifeStage"
          name="lifeStage"
          value={values.lifeStage}
          onChange={handleChange}
          disabled={loading}
          className={INPUT_CLASS}
        >
          <option value="">Select...</option>
          {LIFE_STAGES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Current occupation */}
      <div>
        <label
          htmlFor="currentOccupation"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Current occupation
        </label>
        <input
          type="text"
          id="currentOccupation"
          name="currentOccupation"
          value={values.currentOccupation}
          onChange={handleChange}
          disabled={loading}
          className={INPUT_CLASS}
        />
      </div>

      {/* Education level */}
      <div>
        <label
          htmlFor="educationLevelCode"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Education level
        </label>
        <select
          id="educationLevelCode"
          name="educationLevelCode"
          value={values.educationLevelCode}
          onChange={handleChange}
          disabled={loading}
          className={INPUT_CLASS}
        >
          <option value="">Select...</option>
          {educationLevels.map(({ levelCode, levelName }) => (
            <option key={levelCode} value={levelCode}>
              {levelName}
            </option>
          ))}
        </select>
      </div>

      {/* Monthly income */}
      <div>
        <label
          htmlFor="monthlyIncome"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Monthly income
        </label>
        <input
          type="number"
          id="monthlyIncome"
          name="monthlyIncome"
          min="0"
          value={values.monthlyIncome}
          onChange={handleChange}
          disabled={loading}
          className={INPUT_CLASS}
          aria-describedby={fieldErrors.monthlyIncome ? "monthlyIncome-error" : undefined}
        />
        {fieldErrors.monthlyIncome && (
          <p id="monthlyIncome-error" role="alert" className="mt-1 text-xs text-red-600">
            {fieldErrors.monthlyIncome}
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" loading={loading} aria-label="Save profile changes">
          Save Changes
        </Button>
        <Button
          variant="secondary"
          disabled={loading}
          aria-label="Cancel profile editing"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>

      {/* Server-side save error */}
      {error && (
        <p role="alert" className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </form>
  );
};

export default ProfileEditForm;
