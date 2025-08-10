let allVolunteers = [];

document.addEventListener("DOMContentLoaded", () => {
  fetchVolunteers();
  document.getElementById("searchArea").addEventListener("input", filterTable);
  document.getElementById("statusFilter").addEventListener("change", filterTable);
  document.getElementById("themeToggle").addEventListener("click", toggleTheme);

  document.querySelectorAll("th[data-sort]").forEach(th => {
    th.addEventListener("click", () => sortTable(th.dataset.sort));
  });
});

function fetchVolunteers() {
  db.collection("volunteers")
    .orderBy("timestamp", "desc")
    .onSnapshot(snapshot => {
      allVolunteers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      renderTable(allVolunteers);
    });
}

function renderTable(data) {
  const tbody = document.getElementById("volunteerTableBody");
  tbody.innerHTML = "";

  data.forEach(volunteer => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${volunteer.name || "-"}</td>
      <td>${volunteer.area || "-"}</td>
      <td>${volunteer.contact || "-"}</td>
      <td><span class="status-circle status-${volunteer.status}"></span>${volunteer.status || "-"}</td>
      <td>${
        volunteer.timestamp && volunteer.timestamp.toDate
          ? volunteer.timestamp.toDate().toLocaleString()
          : "-"
      }</td>
    `;
    tbody.appendChild(row);
  });
}

function filterTable() {
  const area = document.getElementById("searchArea").value.toLowerCase();
  const status = document.getElementById("statusFilter").value;

  const filtered = allVolunteers.filter(v => {
    const areaMatch = v.area?.toLowerCase().includes(area);
    const statusMatch = !status || v.status === status;
    return areaMatch && statusMatch;
  });

  renderTable(filtered);
}

let currentSort = { key: '', asc: true };

function sortTable(key) {
  if (currentSort.key === key) {
    currentSort.asc = !currentSort.asc;
  } else {
    currentSort = { key, asc: true };
  }

  const sorted = [...allVolunteers].sort((a, b) => {
    let valA = a[key] || '';
    let valB = b[key] || '';
    if (key === 'timestamp') {
      valA = valA?.toDate?.() || new Date(0);
      valB = valB?.toDate?.() || new Date(0);
    }
    return currentSort.asc ? valA > valB ? 1 : -1 : valA < valB ? 1 : -1;
  });

  renderTable(sorted);
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}

showToast("New report received!", "success");