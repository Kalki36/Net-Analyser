let rateData = [];
let timeLabels = [];

const protocolChart = new Chart(document.getElementById("protocolChart"), {
  type: "doughnut",
  data: {
    labels: ["TCP", "UDP", "ICMP", "IP", "Others"],
    datasets: [{
      label: "Protocol Distribution",
      data: [0, 0, 0, 0, 0],
      backgroundColor: ["#66fcf1", "#45a29e", "#c5c6c7", "#1f2833", "#ff7f50"]
    }]
  },
  options: {
    plugins: {
      legend: { position: "bottom", labels: { color: "#c5c6c7" } }
    }
  }
});

const rateChart = new Chart(document.getElementById("rateChart"), {
  type: "line",
  data: {
    labels: [],
    datasets: [{
      label: "Packets per Interval",
      data: [],
      borderColor: "#66fcf1",
      fill: false,
      tension: 0.3
    }]
  },
  options: {
    plugins: { legend: { labels: { color: "#c5c6c7" } } },
    scales: {
      x: { title: { display: true, text: "Time", color: "#c5c6c7" }, ticks: { color: "#c5c6c7" } },
      y: { title: { display: true, text: "Packets", color: "#c5c6c7" }, ticks: { color: "#c5c6c7" } }
    }
  }
});

const topSrcChart = new Chart(document.getElementById("topSrcChart"), {
  type: "bar",
  data: {
    labels: [],
    datasets: [{
      label: "Top 5 Source IPs",
      data: [],
      backgroundColor: "#45a29e"
    }]
  },
  options: {
    indexAxis: 'y',
    plugins: { legend: { labels: { color: "#c5c6c7" } } },
    scales: {
      x: { beginAtZero: true, ticks: { color: "#c5c6c7" } },
      y: { ticks: { color: "#c5c6c7" } }
    }
  }
});

async function startSniff() {
  const formData = new FormData();
  formData.append("interface", "Wi-Fi");
  await fetch("/start", { method: "POST", body: formData });
  alert("Packet capturing started on Wi-Fi");
  fetchPackets();
  fetchStats();
}

async function stopSniff() {
  await fetch("/stop", { method: "POST" });
  alert("Packet capturing stopped.");
}

async function fetchPackets() {
  setInterval(async () => {
    const res = await fetch("/packets");
    const data = await res.json();

    const table = document.getElementById("packetTable");
    table.innerHTML = "";
    data.forEach(p => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${p.src || "-"}</td>
        <td>${p.dst || "-"}</td>
        <td>${p.protocol || "-"}</td>
        <td>${p.sport || "-"}</td>
        <td>${p.dport || "-"}</td>
      `;
      table.appendChild(row);
    });

    updateCharts(data);
  }, 2000);
}

async function fetchStats() {
  setInterval(async () => {
    const res = await fetch("/stats");
    const stats = await res.json();

    const statBox = Object.entries(stats)
      .map(([k, v]) => `<div class="stat-box">${k}: ${v}</div>`)
      .join("");
    document.getElementById("stats").innerHTML = statBox;
  }, 3000);
}

function updateCharts(packets) {
  const counts = { TCP: 0, UDP: 0, ICMP: 0, IP: 0, Others: 0 };
  const srcCount = {};

  packets.forEach(p => {
    counts[p.protocol] = (counts[p.protocol] || 0) + 1;
    srcCount[p.src] = (srcCount[p.src] || 0) + 1;
  });

  protocolChart.data.datasets[0].data = [
    counts.TCP, counts.UDP, counts.ICMP, counts.IP, counts.Others
  ];
  protocolChart.update();

  const totalPackets = packets.length;
  const now = new Date().toLocaleTimeString();
  timeLabels.push(now);
  rateData.push(totalPackets);

  if (rateData.length > 10) {
    rateData.shift();
    timeLabels.shift();
  }

  rateChart.data.labels = timeLabels;
  rateChart.data.datasets[0].data = rateData;
  rateChart.update();

  const sortedSrc = Object.entries(srcCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  topSrcChart.data.labels = sortedSrc.map(x => x[0]);
  topSrcChart.data.datasets[0].data = sortedSrc.map(x => x[1]);
  topSrcChart.update();
}

function exportCSV() {
  window.location.href = "/export/csv";
}
