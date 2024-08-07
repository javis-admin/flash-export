export const validateAndReturnData = (key, val, substituteValues) => {
  if (val === null || val === "-") return "";
  if (key === "rowud") {
    if (val.indexOf(".") === -1) return val;
    return val.substring(0, val.indexOf(".")).replace("T", " ");
  }

  if (
    substituteValues &&
    key in substituteValues
    // && val in substituteValues[key]
  ) {
    return substituteValues[key][val];
  }
  return val;
};

export const filterKeys = (arr, keys) => {
  return arr.map((obj) => {
    return keys.reduce((filteredObj, key) => {
      if (key in obj) {
        filteredObj[key] = obj[key];
      }
      return filteredObj;
    }, {});
  });
};

// export const callWork
export const getFilteredData = (data, columns = [], substituteValues = {}) => {
  const filteredData = columns.length ? filterKeys(data, columns) : data;
  const temp = [];
  filteredData.forEach((element) => {
    Object.keys(element).forEach((key) => {
      const val = element[key];
      element[key] = validateAndReturnData(key, val, substituteValues);
    });
    temp.push(element);
  });
  return temp;
};
