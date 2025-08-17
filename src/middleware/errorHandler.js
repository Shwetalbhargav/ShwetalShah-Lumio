// [Purpose] Consistent 404 and error handling responses.
// [Why] Avoids duplicated try/catch + improves DX.
function notFound(req, res, next) {
  res.status(404).json({ error: 'Not Found' });
}

function errorHandler(err, req, res, next) { // eslint-disable-line
  console.error('❌', err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
}

module.exports = { notFound, errorHandler };
