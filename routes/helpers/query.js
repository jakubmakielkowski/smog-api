const allowedQueries = ['search', 'source']

const buildQuery = (params) => {
  const query = {}

  Object.entries(params).forEach(([key, value]) => {
    if (allowedQueries.includes(key)) {
      if (key === 'search') {
        query.$text = { $search: String(value) }
      } else {
        query[key] = value
      }
    }
  })

  return query
}

module.exports = buildQuery
