function getLogs(recentLogs) {
  return recentLogs.map(log => ({
    ...log,
    formattedTime: new Date(log.timestamp).toLocaleTimeString()
  }));
}

module.exports = { getLogs };