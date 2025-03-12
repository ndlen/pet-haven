// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDbS-1FULvtPhOKsQBfLcamsQDUmMyfyOo",
    authDomain: "pet-haven-fb90f.firebaseapp.com",
    databaseURL: "https://pet-haven-fb90f-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "pet-haven-fb90f",
    storageBucket: "pet-haven-fb90f.firebasestorage.app",
    messagingSenderId: "910697102356",
    appId: "1:910697102356:web:b980f8219ab73019c0fb01"
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
document.addEventListener("DOMContentLoaded", () => {
    // Lấy tất cả các liên kết trong thanh điều hướng
    const navLinks = document.querySelectorAll(".navbar ul li a");

    // Lấy đường dẫn hiện tại
    const currentPath = window.location.pathname;

    // Duyệt qua các liên kết để thêm class 'active' cho liên kết phù hợp
    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        if (linkPath === currentPath) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
});
// Hiển thị danh sách khi tải trang
displayAppointments();
