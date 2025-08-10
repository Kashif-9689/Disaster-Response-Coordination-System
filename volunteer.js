document.getElementById("volunteerForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const area = document.getElementById("area").value;
  const contact = document.getElementById("contact").value;
  const status = document.getElementById("status").value;

  db.collection("volunteers").add({
    name: name,
    area: area,
    contact: contact,
    status: status,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    alert("Volunteer registered successfully!");
    document.getElementById("volunteerForm").reset();
  }).catch((error) => {
    console.error("Error adding volunteer: ", error);
  });
});
