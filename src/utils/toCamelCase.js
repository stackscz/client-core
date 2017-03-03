export default str =>
  str.replace(
    /\W+(.)/g,
    (match, chr) => chr.toUpperCase(),
  );
