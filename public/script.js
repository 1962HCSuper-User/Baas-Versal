const socket = io();
let lineChart, memoryChart, cpuChart;

// Init Charts
document.addEventListener('DOMContentLoaded', () => {
  // Line Chart
  const lineCtx = document.getElementById('metricsChart').getContext('2d');
  lineChart = new Chart(lineCtx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        { label: 'CPU %', data: [], borderColor: 'red', fill: false },
        { label: 'Memory %', data: [], borderColor: 'blue', fill: false },
        { label: 'Response Time (ms)', data: [], borderColor: 'green', yAxisID: 'y1', fill: false },
        { label: 'Throughput (req/min)', data: [], borderColor: 'orange', yAxisID: 'y2', fill: false }
      ]
    },
    options: {
      scales: {
        y: { beginAtZero: true },
        y1: { position: 'right', beginAtZero: true },
        y2: { position: 'right', grid: { drawOnChartArea: false }, beginAtZero: true }
      }
    }
  });

  // Memory Doughnut
  const memCtx = document.getElementById('memoryChart').getContext('2d');
  memoryChart = new Chart(memCtx, {
    type: 'doughnut',
    data: { labels: ['Heap Used', 'Heap Available', 'RSS', 'External'], datasets: [{ data: [0,0,0,0], backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'] }] },
    options: { responsive: true }
  });

  // CPU Doughnut
  const cpuCtx = document.getElementById('cpuChart').getContext('2d');
  cpuChart = new Chart(cpuCtx, {
    type: 'doughnut',
    data: { labels: [], datasets: [{ data: [], backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'] }] },
    options: { responsive: true }
  });
});

// Socket Events
socket.on('metricsUpdate', (metrics) => {
  // Update cards
  document.getElementById('cpuLoad').textContent = metrics.cpuLoad.toFixed(1) + '%';
  document.getElementById('memoryUsage').innerHTML = metrics.heapUsedPercent.toFixed(1) + '%<br><small>' + metrics.memoryBreakdown.heapUsed + ' / ' + metrics.memoryBreakdown.heapTotal + '</small>';
  document.getElementById('throughput').textContent = metrics.throughput + ' req/min';
  document.getElementById('responseTime').textContent = metrics.avgResponseTime.toFixed(0) + 'ms';
  document.getElementById('capacity').textContent = '~' + metrics.estimatedConcurrent;
  document.getElementById('ipCount').textContent = metrics.connectedIPs.length;
  document.getElementById('liveIpCount').textContent = metrics.connectedIPs.length;

  // Update line chart (last 20)
  const time = new Date().toLocaleTimeString();
  lineChart.data.labels.push(time);
  lineChart.data.datasets[0].data.push(metrics.cpuLoad);
  lineChart.data.datasets[1].data.push(metrics.heapUsedPercent);
  lineChart.data.datasets[2].data.push(metrics.avgResponseTime);
  lineChart.data.datasets[3].data.push(metrics.throughput);
  if (lineChart.data.labels.length > 20) {
    lineChart.data.labels.shift();
    lineChart.data.datasets.forEach(ds => ds.data.shift());
  }
  lineChart.update();

  // Update doughnuts
  // Memory
  const heapAvailable = metrics.memoryBreakdown.heapTotal.replace(/[^\d.]/g, '') - metrics.memoryBreakdown.heapUsed.replace(/[^\d.]/g, '');
  memoryChart.data.datasets[0].data = [
    parseFloat(metrics.memoryBreakdown.heapUsed.replace(/[^\d.]/g, '')),
    heapAvailable,
    parseFloat(metrics.memoryBreakdown.rss.replace(/[^\d.]/g, '')),
    parseFloat(metrics.memoryBreakdown.external.replace(/[^\d.]/g, ''))
  ];
  memoryChart.update();

  // CPU Cores
  cpuChart.data.labels = metrics.coreLoads.map((_, i) => `Core ${i + 1}`);
  cpuChart.data.datasets[0].data = metrics.coreLoads;
  cpuChart.update();

  // Alerts
  const alertsList = document.getElementById('alertsList');
  if (metrics.alerts.length > 0) {
    alertsList.innerHTML = metrics.alerts.map(alert => `<div class="alert alert-danger">${alert}</div>`).join('');
    Toastify({
      text: metrics.alerts[0],
      duration: 5000,
      gravity: "top",
      backgroundColor: "linear-gradient(to right, #ff6b6b, #ee5a52)"
    }).showToast();
  } else {
    alertsList.innerHTML = '<p class="text-success">All systems nominal.</p>';
  }

  // Logs
  const logsList = document.getElementById('logsList');
  logsList.innerHTML = metrics.logs.map(log => `
    <li class="list-group-item">
      <span class="badge ${log.type === 'warn' ? 'bg-warning' : 'bg-info'}">${log.type.toUpperCase()}</span>
      ${log.message} <small class="text-muted">${log.formattedTime}</small>
    </li>
  `).join('');
});

// IP Updates
socket.on('ipUpdate', ({ ip, action }) => {
  const ipList = document.getElementById('ipList');
  if (action === 'add') {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between';
    li.innerHTML = `<span>${ip}</span> <small class="text-muted">${new Date().toLocaleTimeString()}</small>`;
    ipList.appendChild(li);
  } else if (action === 'remove') {
    const items = ipList.querySelectorAll('li');
    for (let item of items) {
      if (item.textContent.includes(ip)) {
        item.remove();
        break;
      }
    }
  }
  document.getElementById('liveIpCount').textContent = ipList.children.length;
});

function clearAlerts() {
  document.getElementById('alertsList').innerHTML = '<p class="text-success">Alerts cleared.</p>';
}