import React, { useCallback, useState, useEffect, useMemo } from "react";
import { ObjectSchema } from "yup";

interface useFormInterface {
  initialValues: Record<string, string | number | Date | boolean>;
  onSubmit?: Function;
  validationSchema?: ObjectSchema<any>;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
}

const useForm = ({
  initialValues,
  validationSchema,
  onSubmit,
  validateOnBlur = true,
  validateOnChange,
}: useFormInterface): {
  values: Record<string, string | number | Date | boolean>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
} => {
  const [values, setValues] = useState(initialValues);

  const touchedObj = useMemo(() => {
    let obj = {};
    for (let key in initialValues) {
      obj[key] = false;
    }
    return obj;
  }, []);

  const errorObj = useMemo(() => {
    let obj = {};
    for (let key in initialValues) {
      obj[key] = "";
    }
    return obj;
  }, []);

  const [touched, setTouched] = useState(touchedObj);
  const [errors, setErrors] = useState(errorObj);
  const [isSubmitting, setSubmitting] = useState(false);
  const [isSubmited, setSubmited] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedValues = Object.assign({}, values);
    updatedValues[e.target.name] = e.target.value;
    setValues(updatedValues);
    if (validationSchema && validateOnChange) {
      try {
        await validationSchema.validate(updatedValues, {
          abortEarly: false,
        });
        setErrors({});
      } catch (err: any) {
        let errObj = {};
        for (let i = 0; i < err?.errors.length; i++) {
          let error = err?.errors[i];
          let errorKey = error.split(" ")[0];
          errObj[errorKey] = error;
        }
        setErrors(errObj);
        setTouched((prevState) => {
          return {
            ...prevState,
            [e.target.name]: true,
          };
        });
      }
    }
  };

  const handleBlur = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (validateOnBlur) {
      const updatedTouched = Object.assign({}, touched);
      updatedTouched[e.target.name] = true;
      setTouched(updatedTouched);
    }
    if (validationSchema && validateOnBlur) {
      try {
        await validationSchema.validate(values, {
          abortEarly: false,
        });
        setErrors({});
      } catch (err: any) {
        let errObj = {};
        for (let i = 0; i < err?.errors.length; i++) {
          let error = err?.errors[i];
          let errorKey = error.split(" ")[0];
          errObj[errorKey] = error;
        }
        setErrors(errObj);
      }
    }
  };

  const handleSubmit = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setSubmitting(true);
    if (validationSchema) {
      try {
        await validationSchema.validate(values, {
          abortEarly: false,
        });
        setErrors({});
        await onSubmit(values, event);
      } catch (err: any) {
        let errObj = {};
        for (let i = 0; i < err?.errors.length; i++) {
          let error = err?.errors[i];
          let errorKey = error.split(" ")[0];
          errObj[errorKey] = error;
        }
        setErrors(errObj);
        let touchedObj = {};
        for (let key in initialValues) {
          touchedObj[key] = true;
        }
        setTouched(touchedObj);
      }
    } else {
      await onSubmit(values, event);
    }
    setSubmited(true);
  };

  useEffect(() => {
    if (isSubmited) {
      setSubmitting(false);
      setSubmited(false);
    }
  }, [isSubmited]);

  return {
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    handleSubmit,
    isSubmitting,
  };
};

export default useForm;
