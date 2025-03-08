// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA1FdUSVK7LLX50iDdQBLRfczAS3_gXSAs",
    authDomain: "cruduser-1bde1.firebaseapp.com",
    projectId: "cruduser-1bde1",
    storageBucket: "cruduser-1bde1.firebasestorage.app",
    messagingSenderId: "692323390500",
    appId: "1:692323390500:web:4201733b2baeec435674b1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const appointmentForm = document.getElementById("appointment-form");
const appointmentTable = document.getElementById("appointment-table").getElementsByTagName('tbody')[0];
let currentEditingId = null;

// Thêm hoặc cập nhật đặt lịch
appointmentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const userId = document.getElementById("userId").value;
    const date = document.getElementById("date").value;
    const service = document.getElementById("service").value;
    const status = document.getElementById("status").value;

    const id = `id${Date.now()}`;  // Tạo ID mới từ thời gian

    if (currentEditingId) {
        // Cập nhật dữ liệu nếu đang chỉnh sửa
        db.collection("appointments").doc(currentEditingId).update({
            id, userId, date, service, status
        }).then(() => {
            resetForm();
            displayAppointments();
        }).catch(error => console.error("Lỗi cập nhật: ", error));
    } else {
        // Thêm mới dữ liệu
        db.collection("appointments").add({
            id,  // Lưu ID thực tế
            userId, 
            date, 
            service,  
            status
        }).then(() => {
            resetForm();
            displayAppointments();
        }).catch(error => console.error("Lỗi thêm: ", error));
    }
});

// Hiển thị danh sách đặt lịch
function displayAppointments() {
    appointmentTable.innerHTML = "";
    db.collection("appointments").get().then(snapshot => {
        snapshot.forEach(doc => {
            const appointment = doc.data();  // Lấy dữ liệu từ Firestore
            console.log(appointment); // Debug dữ liệu lấy được

            // Kiểm tra nếu dữ liệu bị undefined, dùng giá trị mặc định
            const id = appointment.id || "No ID";  // Lấy ID thực tế từ Firestore
            const userId = appointment.userId || "No Data";
            const date = appointment.date || "No Data";
            const service = appointment.service || "No Data"; // Sửa từ `Service` thành `service`
            const status = appointment.status || "No Data"; // Sửa từ `Status` thành `status`

            const row = appointmentTable.insertRow();
            row.innerHTML = `
                <td>${id}</td> <!-- Hiển thị ID thực tế -->
                <td>${userId}</td>
                <td>${date}</td>
                <td>${service}</td>
                <td>${status}</td>
                <td>
                    <button class="edit-btn" onclick="editAppointment('${doc.id}')">Sửa</button>
                    <button class="delete-btn" onclick="deleteAppointment('${doc.id}')">Xóa</button>
                </td>
            `;
        });
    }).catch(error => console.error("Lỗi hiển thị: ", error));
}


// Sửa đặt lịch
window.editAppointment = function(id) {
    db.collection("appointments").doc(id).get().then(doc => {
        const appointment = doc.data();
        document.getElementById("userId").value = appointment.userId;
        document.getElementById("date").value = appointment.date;
        document.getElementById("service").value = appointment.service;
        document.getElementById("status").value = appointment.status;

        currentEditingId = id;
        toggleForm();
    });
};

// Xóa đặt lịch
window.deleteAppointment = function(id) {
    db.collection("appointments").doc(id).delete().then(() => {
        displayAppointments();
    }).catch(error => console.error("Lỗi xóa: ", error));
};

// Ẩn/hiện form
window.toggleForm = function() {
    const formContainer = document.getElementById("appointment-form-container");
    const overlay = document.getElementById("overlay");
    const isVisible = formContainer.style.display === "block";
    formContainer.style.display = isVisible ? "none" : "block";
    overlay.style.display = isVisible ? "none" : "block";
};

// Reset form
function resetForm() {
    appointmentForm.reset();
    currentEditingId = null;
    toggleForm();
}

// Hiển thị danh sách khi tải trang
displayAppointments();
