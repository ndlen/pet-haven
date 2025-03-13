const firebaseConfig = {
    apiKey: "AIzaSyDbS-1FULvtPhOKsQBfLcamsQDUmMyfyOo",
    authDomain: "pet-haven-fb90f.firebaseapp.com",
    projectId: "pet-haven-fb90f",
    storageBucket: "pet-haven-fb90f.appspot.com",
    messagingSenderId: "910697102356",
    appId: "1:910697102356:web:b980f8219ab73019c0fb01"
};

// Khởi tạo Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const appointmentForm = document.getElementById("appointment-form");
const appointmentList = document.getElementById("appointment-list");

// Kiểm tra và điền sẵn dữ liệu từ localStorage
document.addEventListener("DOMContentLoaded", () => {
    const selectedService = JSON.parse(localStorage.getItem("selectedService"));
    const selectedFood = JSON.parse(localStorage.getItem("selectedFood"));

    if (selectedService) {
        document.getElementById("service").value = selectedService.name;
    } else if (selectedFood) {
        document.getElementById("service").value = selectedFood.name;
    }

    // Hiển thị danh sách lịch hẹn khi tải trang
    displayAppointments();
});

// Thêm lịch hẹn mới
appointmentForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const userId = document.getElementById("userId").value;
    const date = document.getElementById("date").value;
    const service = document.getElementById("service").value;
    const status = "Chờ xác nhận"; // Trạng thái mặc định
    const id = `id${Date.now()}`; // Tạo ID dựa trên thời gian

    db.collection("appointments").add({
        id,
        userId,
        date,
        service,
        status
    }).then(() => {
        appointmentForm.reset();
        localStorage.removeItem("selectedService"); // Xóa dữ liệu tạm
        localStorage.removeItem("selectedFood");
        displayAppointments();
        alert("Đặt lịch thành công!");
    }).catch(error => {
        console.error("Lỗi khi thêm lịch hẹn: ", error);
        alert("Có lỗi xảy ra, vui lòng thử lại!");
    });
});

// Hiển thị danh sách lịch hẹn
function displayAppointments() {
    appointmentList.innerHTML = "";
    db.collection("appointments").get().then((snapshot) => {
        snapshot.forEach((doc) => {
            const appointment = doc.data();
            const appointmentCard = document.createElement("div");
            appointmentCard.classList.add("appointment-card");
            appointmentCard.innerHTML = `
                <h3>ID: ${appointment.id}</h3>
                <p>User ID: ${appointment.userId}</p>
                <p>Ngày: ${appointment.date}</p>
                <p>Dịch vụ/Thức ăn: ${appointment.service}</p>
                <span class="status">${appointment.status}</span>
            `;
            appointmentList.appendChild(appointmentCard);
        });
    }).catch(error => {
        console.error("Lỗi khi hiển thị lịch hẹn: ", error);
    });
}