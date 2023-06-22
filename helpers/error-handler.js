function errorHandler(err, req, res, next) {
    // Handle the error here
    console.error(err);
  
    // Set the appropriate status code for the response
    res.status(500).json({ error: 'Internal Server Error' });
  }

module.exports = errorHandler;