# formshelf

- Very small package for field state managment.

- React package for form state managment.

- Provides Fields State Managment, Validation etc.

## How to Install?

- ```
  npm install formshelf
  ```

- ```
  yarn add formshelf
  ```

## How to Use ?

```
export default function Form() {
  const formshelf = useForm({
    initialValues: {
      name: "",
      age: "",
    },
    validationSchema: schema,
    onSubmit: (values, event) => {
      event.preventDefault();
      console.log(values, "submitted");
    },
  });

  return (
    <form onSubmit={formshelf.handleSubmit}>
      <input
        name="name"
        value={formshelf.values.name}
        onChange={formshelf.handleChange}
        onBlur={formshelf.handleBlur}
      />
      <input
        name="age"
        value={formshelf.values.age}
        onChange={formshelf.handleChange}
        onBlur={formshelf.handleBlur}
      />
      <input type={"submit"} />
      {formshelf.touched.age && <p>{formshelf.errors.age}</p>}
      {formshelf.touched.name && <p>{formshelf.errors.name}</p>}
    </form>
  );
}

```
