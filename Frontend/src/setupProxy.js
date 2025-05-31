// This file configures the development proxy
// It intercepts API calls and avoids sending them to the backend
module.exports = function (app) {
  app.use("/api", (req, res) => {
    console.log(`Mock API request: ${req.method} ${req.url}`);

    // Return a 200 response for all API requests
    res.status(200).json({
      message: "This is a mock API response. No backend is actually running.",
      endpoint: req.url,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  });
};
