const allowedEntries = ['search', 'source', 'bounds']

const buildQuery = (params) => {
  const query = {}

  Object.entries(params).forEach(([key, value]) => {
    const param = allowedEntries.find(entry => key === entry)

    switch (param) {
      case 'search':
        query.$text = { $search: String(value) }
        break
      case 'source':
        query.source = value
        break
      case 'bounds':
        const bounds = value.split(',').map(str => Number(Number(str).toFixed(4)))
        const [S, N, W, E] = bounds

        query['location.latitude'] = { $gte: S, $lte: N }
        query['location.longitude'] = { $gte: W, $lte: E }
        break
    }
  })

  return query
}

module.exports = buildQuery
