const formatStr = (str: string) => {
  return (
    str[0].toUpperCase() +
    str
      .slice(1)
      .replace(/([A-Z]+)/g, " $1")
      .toLowerCase()
  );
};

interface FormatArgsReturn {
  args: Obj;
  errors: Obj;
  isValidInput: boolean;
}

export function formatArgs(args: Obj): FormatArgsReturn {
  const errors: Obj = {};

  Object.entries(args).forEach(([key, value]) => {
    args[key] = value.trim();
    if (args[key] === "") {
      errors[key] = `${formatStr(key)} can not be empty`;
    }
  });

  return { args, errors, isValidInput: Object.keys(errors).length === 0 };
}
