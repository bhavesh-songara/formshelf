import { useCallback, useState } from "react";

const useForm = ({ initialValues, validationSchema, onSubmit }) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState(initialValues);

  const touchedObj = useCallback(() => {
    let obj = {};
    for (let key in initialValues) {
      obj[key] = false;
    }
    return obj;
  }, [initialValues]);

  const [touched, setTouched] = useState(touchedObj);

  const handleChange = (e) => {
    const updatedValues = Object.assign({}, values);
    updatedValues[e.target.name] = e.target.value;
    setValues(updatedValues);
  };

  const handleBlur = (e) => {
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

  const handleSubmit = (event) => {
    onSubmit(values, event);
  };

  return { values, handleChange, handleBlur, touched, errors, handleSubmit };
};
export default useForm;
