type SelectOption = {
  value: unknown;
  label: string;
};

export const reactSelectFormatOne = <T extends Record<string, unknown>>(
  array: T[],
  valueKey: keyof T,
  labelKeys: (keyof T)[]
): SelectOption[] => {
  if (!Array.isArray(array) || array.length === 0) return [];

  return array.map(item => ({
    value: item[valueKey],
    label: labelKeys.map(key => item[key]).join("/")
  }));
};

export const reactSelectFormatTwo = <T extends Record<string, unknown>>(
  array: T[],
  valueKeys: (keyof T)[] | keyof T,
  labelKeys: (keyof T)[]
): SelectOption[] => {
  if (!Array.isArray(array) || array.length === 0) return [];

  return array.map(item => ({
    value: Array.isArray(valueKeys)
      ? Object.fromEntries(valueKeys.map(key => [key, item[key]]))
      : item[valueKeys],
    label: labelKeys.map(key => item[key]).join("/")
  }));
};
