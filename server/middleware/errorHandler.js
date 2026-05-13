function errorHandler(err, req, res, _next) {
  console.error(err.stack)

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message)
    return res.status(400).json({ success: false, error: messages.join(', ') })
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, error: 'Invalid ID format' })
  }

  if (err.code === 11000) {
    return res.status(400).json({ success: false, error: 'Duplicate entry' })
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error',
  })
}

export default errorHandler
