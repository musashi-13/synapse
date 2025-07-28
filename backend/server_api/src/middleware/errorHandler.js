// server_api/src/middleware/errorHandler.js

/**
 * A centralized error handling middleware.
 * It catches errors passed by next(error) and sends a generic 500 response.
 */
const errorHandler = (err, req, res, next) => {
    // Log the error for debugging purposes.
    // In a real production app, you'd use a more robust logger like Winston.
    console.error('❌ Global Error Handler:', err.stack);

    // If the response headers have already been sent, delegate to the default Express error handler.
    if (res.headersSent) {
        return next(err);
    }

    // Send a generic error response to the client
    res.status(500).json({
        error: 'Internal Server Error',
        message: 'Something went wrong on our end. Please try again later.',
    });
};

export default errorHandler;
