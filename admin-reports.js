window.onload = () => {
  const filterSelect = document.getElementById("statusFilter");
  filterSelect.addEventListener("change", fetchReports);
  fetchReports();
};

async function fetchReports() {
  const container = document.getElementById("reportsContainer");
  container.innerHTML = "<p>Loading reports...</p>";

  const status = document.getElementById("statusFilter").value;
  let query = db.collection("reports").orderBy("timestamp", "desc");
  if (status !== "All") {
    query = query.where("status", "==", status);
  }

  try {
    const snapshot = await query.get();

    if (snapshot.empty) {
      container.innerHTML = "<p>No reports found.</p>";
      return;
    }

    let html = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      html += `
        <div class="report-card">
          <img src="${data.imageUrl || '#'}" alt="Image" />
          <p><strong>Description:</strong> ${data.description || 'N/A'}</p>
          <p><strong>Status:</strong> ${data.status || 'N/A'}</p>
          <p><strong>Location:</strong> Lat: ${data.latitude || 'N/A'}, Lng: ${data.longitude || 'N/A'}</p>
          <p><strong>Timestamp:</strong> ${
            data.timestamp?.toDate ? new Date(data.timestamp.toDate()).toLocaleString() : 'N/A'
          }</p>
        </div>
      `;
    });

    container.innerHTML = html;

    showToast(`Displaying ${snapshot.size} report${snapshot.size > 1 ? 's' : ''}`);
  } catch (err) {
    console.error("Error loading reports:", err);
    container.innerHTML = "<p>Error loading reports.</p>";
  }
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = "toast show";
  setTimeout(() => (toast.className = toast.className.replace("show", "")), 3000);
}

showToast("New report received!", "success");