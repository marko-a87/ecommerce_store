const availableSize = (size) => {
  let isTrue = false;
  const size_options = ["small", "medium", "large"];
  const str_lowercase = size.toLowerCase();
  for (let i = 0; i < size_options.length; i++) {
    if (str_lowercase == size_options[i]) {
      isTrue = true;
      return isTrue;
    }
  }
  return isTrue;
};

export { availableSize };
