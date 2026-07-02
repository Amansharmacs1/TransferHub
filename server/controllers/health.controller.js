const getHealthStatus = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TransferHub API is running smoothly',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
};

module.exports = {
  getHealthStatus
};
