const os = require('os');

function getMetrics(totalRequests, requestsInMinute, startTime, cpus) {
  const uptime = process.uptime();
  const cpuLoad = os.loadavg()[0] / cpus.length * 100;
  const memoryUsage = process.memoryUsage();
  const heapUsedPercent = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
  const totalMemoryPercent = (os.freemem() / os.totalmem()) * 100;
  const throughput = requestsInMinute.length;
  const avgResponseTime = 150 + Math.random() * 400;

  // Per-core loads (simulated; in prod, use a lib like pidusage)
  const coreLoads = cpus.map((_, i) => 10 + Math.random() * (cpuLoad + 20)); // Vary around avg

  // Capacity estimate (simple heuristic)
  const estimatedConcurrent = Math.floor((100 - cpuLoad) * (100 - heapUsedPercent) / 100 * 50); // Max 50 demo

  const uptimeStr = formatUptime(uptime);

  const alerts = [];
  if (cpuLoad > 80) alerts.push(`High CPU Load: ${cpuLoad.toFixed(1)}%`);
  if (heapUsedPercent > 70) alerts.push(`High Heap Usage: ${heapUsedPercent.toFixed(1)}%`);
  if (avgResponseTime > 500) alerts.push(`Slow Response: ${avgResponseTime.toFixed(0)}ms`);
  if (totalMemoryPercent < 20) alerts.push(`Low Memory: ${totalMemoryPercent.toFixed(1)}% free`);

  return {
    cpuLoad,
    coreLoads, // New
    heapUsedPercent,
    memoryBreakdown: { // New details
      heapUsed: formatBytes(memoryUsage.heapUsed),
      heapTotal: formatBytes(memoryUsage.heapTotal),
      rss: formatBytes(memoryUsage.rss),
      external: formatBytes(memoryUsage.external)
    },
    totalMemoryPercent,
    throughput,
    avgResponseTime,
    totalRequests,
    uptime: uptimeStr,
    estimatedConcurrent, // New
    alerts,
    serverInfo: { // New
      nodeVersion: process.version,
      platform: os.platform(),
      totalMemory: formatBytes(os.totalmem()),
      pid: process.pid
    }
  };
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
}

function formatBytes(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) { bytes /= 1024; i++; }
  return `${bytes.toFixed(1)} ${units[i]}`;
}

module.exports = { getMetrics };