import { db, storage } from './firebase-report.js';
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import {
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

let latitude = "";
let longitude = "";

// Detect location
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      document.getElementById("location").innerText = `Lat: ${latitude}, Lon: ${longitude}`;
    },
    (error) => {
      document.getElementById("location").innerText = "Unable to detect location.";
    }
  );
} else {
  document.getElementById("location").innerText = "Geolocation not supported.";
}

// Submit report function
async function submitReport() {
  const description = document.getElementById("description").value;
  const imageFile = document.getElementById("imageUpload").files[0];

  let imageUrl = "";

  try {
    if (imageFile) {
      const imageRef = ref(storage, `images/${Date.now()}_${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }

    await addDoc(collection(db, "reports"), {
      description,
      imageUrl,
      latitude,
      longitude,
      status: "Pending",
      timestamp: serverTimestamp()
    });

    alert("Disaster report submitted successfully!");
    document.getElementById("description").value = "";
    document.getElementById("imageUpload").value = "";
  } catch (err) {
    console.error("Error submitting report: ", err);
    alert("Failed to submit report.");
  }
}

window.submitReport = submitReport;
