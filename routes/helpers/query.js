const allowedQueries = [
  "search",
  "source"
];
  
const buildQuery = (params) => {
  const query = {};
  for (param in params) {
    if (allowedQueries.includes(param)) {
      if (param === "search") {
        query.$text = { $search: String(params[param]) }
      } else {
        query[param] = params[param];
      }
    }
  };

  return query;
}

module.exports = buildQuery;