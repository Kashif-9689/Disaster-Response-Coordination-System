const resourceContainer = document.getElementById("resourceContainer");
const incidentContainer = document.getElementById("incidentContainer");
const searchInput = document.getElementById("searchResource");
const statusFilter = document.getElementById("statusFilter");

// =================== RESOURCE FETCH ===================
db.collection("resources").onSnapshot(snapshot => {
  let resources = [];
  snapshot.forEach(doc => resources.push({ id: doc.id, ...doc.data() }));
  renderResources(resources);

  searchInput.addEventListener("input", () => filterResources(resources));
  statusFilter.addEventListener("change", () => filterResources(resources));
});

function renderResources(resources) {
  resourceContainer.innerHTML = "";
  resources.forEach(resource => {
    const div = document.createElement("div");
    div.className = "resource-card";

    const statusClass = resource.status.replace(/\s+/g, "");

    div.innerHTML = `
      <h3>${resource.name}</h3>
      <p><strong>Type:</strong> ${resource.type}</p>
      <p><strong>Status:</strong> ${resource.status}</p>
      <div class="status-bar status-${statusClass}"></div>
      
      <input type="text" placeholder="Report ID" id="assign-${resource.id}" style="width: 90%; padding: 5px;">
      <button class="assign-btn" onclick="assignResource('${resource.id}')">Assign</button>

      <select onchange="updateStatus('${resource.id}', this.value)">
        <option ${resource.status === "Available" ? "selected" : ""}>Available</option>
        <option ${resource.status === "Deployed" ? "selected" : ""}>Deployed</option>
        <option ${resource.status === "In Transit" ? "selected" : ""}>In Transit</option>
        <option ${resource.status === "Completed" ? "selected" : ""}>Completed</option>
      </select>
    `;
    resourceContainer.appendChild(div);
  });
}

function filterResources(resources) {
  const searchText = searchInput.value.toLowerCase();
  const status = statusFilter.value;
  const filtered = resources.filter(r =>
    (r.name.toLowerCase().includes(searchText) || r.type.toLowerCase().includes(searchText)) &&
    (status === "" || r.status === status)
  );
  renderResources(filtered);
}

function assignResource(id) {
  const reportId = document.getElementById(`assign-${id}`).value;
  if (!reportId) return showToast("Enter Report ID to assign!");

  db.collection("resources").doc(id).update({ assignedTo: reportId, status: "Deployed" })
    .then(() => showToast("Resource Assigned Successfully!"))
    .catch(err => console.error(err));
}

function updateStatus(id, status) {
  db.collection("resources").doc(id).update({ status })
    .then(() => showToast(`Status updated to ${status}`))
    .catch(err => console.error(err));
}

// =================== INCIDENT FETCH & DISPLAY ===================
db.collection("incidents").onSnapshot(snapshot => {
  let incidents = [];
  snapshot.forEach(doc => {
    incidents.push({ id: doc.id, ...doc.data() });
  });
  renderIncidents(incidents);
});

function renderIncidents(incidents) {
  incidentContainer.innerHTML = "";
  incidents.forEach(incident => {
    const div = document.createElement("div");
    div.className = "resource-card";

    div.innerHTML = `
      <h3>Incident ID: ${incident.id}</h3>
      <p><strong>Sender:</strong> ${incident.sender}</p>
      <p><strong>Urgency:</strong> ${incident.urgency}</p>
      <p><strong>Severity:</strong> ${incident.severity}</p>
      <p><strong>Trust Score:</strong> ${calculateTrustScore(incident)}</p>
      <p><strong>Assigned:</strong> ${incident.assigned ? "✅ Yes" : "❌ No"}</p>
      <button class="assign-btn" onclick="assignBestResource('${incident.id}')">Assign Best Resource</button>
    `;
    incidentContainer.appendChild(div);
  });
}

function calculateTrustScore(incident) {
  let trust = 0;
  if (incident.sender === "official") trust += 50;
  if (incident.mediaAttached) trust += 30;
  trust += Math.min(incident.duplicateCount * 10, 20);
  return trust;
}

// =================== ASSIGNMENT CONTROLLER ===================
function assignBestResource(incidentId) {
  const mode = document.getElementById("modeSelector").value;
  if (mode === "Trust-Based") {
    assignBasedOnTrust(incidentId);
  } else if (mode === "Urgency-Based") {
    assignBasedOnUrgency();
  }
}

// =================== TRUST-BASED ASSIGNMENT ===================
function assignBasedOnTrust(incidentId) {
  db.collection("resources").where("status", "==", "Available").limit(1).get()
    .then(snapshot => {
      if (snapshot.empty) {
        showToast("No available resources.");
        return;
      }

      const resource = snapshot.docs[0];
      db.collection("resources").doc(resource.id).update({
        assignedTo: incidentId,
        status: "Deployed"
      });

      db.collection("incidents").doc(incidentId).update({
        assigned: true
      });

      showToast(`Assigned Resource ${resource.id} to Incident ${incidentId}`);
    })
    .catch(err => {
      console.error("Error assigning:", err);
      showToast("Assignment failed.");
    });
}

// =================== URGENCY-BASED ASSIGNMENT ===================
async function assignBasedOnUrgency() {
  try {
    const incidentSnapshot = await db.collection("incidents").where("assigned", "==", false).get();
    let unassignedIncidents = [];

    incidentSnapshot.forEach(doc => {
      const data = doc.data();
      unassignedIncidents.push({ id: doc.id, ...data });
    });

    if (unassignedIncidents.length === 0) return showToast("No unassigned incidents.");

    unassignedIncidents.sort((a, b) => {
      if (b.urgency !== a.urgency) return b.urgency - a.urgency;
      if (b.severity !== a.severity) return b.severity - a.severity;
      return a.timestamp.toDate() - b.timestamp.toDate();
    });

    const topIncident = unassignedIncidents[0];

    const resourceSnapshot = await db.collection("resources").where("status", "==", "Available").limit(1).get();
    if (resourceSnapshot.empty) return showToast("No available resources.");

    const resourceDoc = resourceSnapshot.docs[0];
    const resourceId = resourceDoc.id;

    await db.collection("resources").doc(resourceId).update({
      assignedTo: topIncident.id,
      status: "Deployed"
    });

    await db.collection("incidents").doc(topIncident.id).update({
      assigned: true
    });

    showToast(`✅ Assigned Resource ${resourceId} to Incident ${topIncident.id}`);
  } catch (err) {
    console.error("Urgency-based assignment error:", err);
    showToast("Error occurred during urgency-based assignment.");
  }
}

// =================== TOAST ===================
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.getElementById("toast-container").appendChild(toast);

  setTimeout(() => {
    toast.classList.add("fade-out");
    setTimeout(() => toast.remove(), 500);
  }, 3000);
}
