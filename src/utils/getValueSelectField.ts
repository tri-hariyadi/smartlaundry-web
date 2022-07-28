/* eslint-disable @typescript-eslint/no-explicit-any */
const getValueSelectField = (value: any) => {
  if (value)
    Object.keys(value).forEach(key => {
      if (value[key] && value[key].constructor === Object) value[key] = value[key].value;
    });
};

export default getValueSelectField;
