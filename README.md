#🚨 Disaster Response Coordination System
A real-time web-based platform to manage disaster incident reports, prioritize them using trust-based and urgency-based parameters, and allocate available resources efficiently. Built with **Firebase Firestore** for backend data handling and responsive UI for incident and resource management.

📂 Project Structure

DisasterResponseForm/
│
├── .firebaserc
├── .gitignore
├── admin-dashboard.html
├── admin-dashboard.css
├── admin-dashboard.js
├── admin-reports.html
├── admin-reports.css
├── admin-reports.js
├── background.jpg / background_01.webp / background_02.webp / background_03.webp
├── chatbot.css
├── chatbot.js
├── cors.json
├── firebase.json
├── firebase-config.js
├── firebase-report.js
├── firestore.indexes.json
├── firestore.rules
├── homepage.html
├── homepage.css
├── index.html
├── pglite-debug.txt
├── resource-allocation.html
├── resource-allocation.css
├── resource-allocation.js
├── script.js
├── Storage.rules
├── style.css
├── toast.css
├── toast.js
├── volunteer.html
├── volunteer.css
├── volunteer.js
├── volunteer-coordination.html
├── volunteer-coordination.css
├── volunteer-coordination.js
├── volunteer-panel.html
├── volunteer-panel.css
├── volunteer-panel.js

⚙️ Setup Instructions

1️⃣ Clone the Repository

git clone https://github.com/your-username/DisasterResponseSystem.git
cd DisasterResponseSystem

2️⃣ Configure Firebase

* Go to [Firebase Console](https://console.firebase.google.com/)
* Create a project
* Enable Firestore Database
* Copy your Firebase config and paste into `firebase-config.js`:


const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

Populating Firestore with Test Data

Incidents Collection

Open browser console on `resource-allocation.html` and run:

const testIncidents = [
  {
    sender: "volunteer",
    urgency: 4,
    severity: 3,
    duplicateCount: 2,
    mediaAttached: true,
    timestamp: firebase.firestore.Timestamp.fromDate(new Date("2025-08-01T13:45:00")),
    assigned: false
  },
  {
    sender: "public",
    urgency: 3,
    severity: 3,
    duplicateCount: 1,
    mediaAttached: false,
    timestamp: firebase.firestore.Timestamp.fromDate(new Date("2025-08-01T15:10:00")),
    assigned: false
  }
];
testIncidents.forEach((incident, index) => {
  db.collection("incidents").add(incident)
    .then(() => console.log(`✅ Incident ${index + 1} added.`))
    .catch(err => console.error(`❌ Error adding incident ${index + 1}:`, err));
});

Resources Collection

const testResources = [
  { name: "Ambulance", type: "Medical", status: "Available", assignedTo: "" },
  { name: "Rescue Boat", type: "Rescue", status: "Available", assignedTo: "" },
  { name: "Water Truck", type: "Utility", status: "Available", assignedTo: "" },
  { name: "Medical Van", type: "Medical", status: "Available", assignedTo: "" }
];
testResources.forEach((resource, index) => {
  db.collection("resources").add(resource)
    .then(() => console.log(`✅ Resource ${index + 1} added.`))
    .catch(err => console.error(`❌ Error adding resource ${index + 1}:`, err));
});

Running the Project

1. Open `homepage.html` for the main entry point.
2. Navigate to:

   * Admin Dashboard → `admin-dashboard.html`
   * Reports → `admin-reports.html`
   * Resource Allocation Panel → `resource-allocation.html`
3. Use the search and filter features to locate incidents and allocate resources.

Features

* Incident prioritization based on urgency, severity, and trust score.
* Resource filtering by type and status.
* Real-time database sync via Firebase Firestore.
* Interactive UI for manual and automated resource allocation.

Do you want me to go ahead and make that file for you?
