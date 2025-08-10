let map;
let markers = [];

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 22.9734, lng: 78.6569 },
    zoom: 5,
    styles: [/* optional: futuristic dark theme */]
  });

  loadReports();

  document.getElementById("statusFilter").addEventListener("change", () => {
    loadReports();
  });
}

function loadReports() {
  markers.forEach(marker => marker.setMap(null));
  markers = [];

  const selectedStatus = document.getElementById("statusFilter").value;
  let query = db.collection("reports");
  if (selectedStatus !== "All") {
    query = query.where("status", "==", selectedStatus);
  }

  query.get().then(snapshot => {
    snapshot.forEach(doc => {
      const data = doc.data();
      const position = { lat: data.latitude, lng: data.longitude };

      const marker = new google.maps.Marker({
        position,
        map,
        title: data.description,
        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
      });

      marker.addListener("click", () => {
        showReportDetails(doc.id, data);
      });

      markers.push(marker);
    });
  }).catch(console.error);
}

function showReportDetails(docId, data) {
  const container = document.getElementById("reportDetails");
  container.innerHTML = `
    <h2>📝 Report Details</h2>
    <p><strong>Description:</strong> ${data.description}</p>
    <img src="${data.imageUrl}" alt="Report Image" class="report-image"/>
    <p><strong>Location:</strong> (${data.latitude}, ${data.longitude})</p>
    <p><strong>Status:</strong>
      <select id="statusSelect">
        <option ${data.status === "Pending" ? "selected" : ""}>Pending</option>
        <option ${data.status === "In Progress" ? "selected" : ""}>In Progress</option>
        <option ${data.status === "Resolved" ? "selected" : ""}>Resolved</option>
      </select>
    </p>
    <p><strong>Timestamp:</strong> ${new Date(data.timestamp.seconds * 1000).toLocaleString()}</p>
  `;

  document.getElementById("statusSelect").addEventListener("change", (e) => {
    const newStatus = e.target.value;
    db.collection("reports").doc(docId).update({ status: newStatus }).then(() => {
      alert(`✅ Status updated to "${newStatus}"`);
      loadReports();
    }).catch(err => {
      alert("❌ Failed to update status");
      console.error(err);
    });
  });
}

showToast("New report received!", "success");