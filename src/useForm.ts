import React, { useCallback, useState } from "react";

interface useFormInterface {
  initialValues: any;
  onSubmit: any;
  validationSchema: any;
}

const useForm = ({
  initialValues,
  validationSchema,
  onSubmit,
}: useFormInterface) => {
  const [values, setValues] = useState(initialValues);

  const touchedObj = useCallback(() => {
    let obj = {};
    for (let key in initialValues) {
      obj[key] = false;
    }
    return obj;
  }, [initialValues]);

  const errorObj = useCallback(() => {
    let obj = {};
    for (let key in initialValues) {
      obj[key] = "";
    }
    return obj;
  }, [initialValues]);

  const [touched, setTouched] = useState(touchedObj);
  const [errors, setErrors] = useState(errorObj);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedValues = Object.assign({}, values);
    updatedValues[e.target.name] = e.target.value;
    setValues(updatedValues);
  };

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedTouched = Object.assign({}, touched);
    updatedTouched[e.target.name] = true;
    setTouched(updatedTouched);
    let errObj = {};
    validationSchema
      .validate(values, { abortEarly: false })
      .then((valid) => valid)
      .catch((err) => {
        for (let i = 0; i < err.errors.length; i++) {
          let error = err.errors[i];
          let errorKey = error.split(" ")[0];
          errObj[errorKey] = error;
        }
        setErrors(errObj);
      });
  };

  const handleSubmit = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSubmitting(true);
    await onSubmit(values, event);
    setIsSubmitting(false);
  };

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
