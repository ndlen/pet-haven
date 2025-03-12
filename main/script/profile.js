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

document.addEventListener("DOMContentLoaded", function () {
    const userData = JSON.parse(localStorage.getItem("user"));

    if (userData) {
        document.getElementById("fullname").value = userData.fullname || "";
        document.getElementById("email").value = userData.email || "";
        document.getElementById("phone").value = userData.phone || "";
        document.getElementById("dob").value = userData.dob || "";
        document.getElementById("gender").value = userData.gender || "";
        document.getElementById("password").value = ""; // Mật khẩu không hiển thị
        document.getElementById("confirm-password").value = ""; // Mật khẩu không hiển thị
    }
});

document.getElementById("profileForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const updatedUser = {
        fullname: document.getElementById("fullname").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        dob: document.getElementById("dob").value,
        gender: document.getElementById("gender").value,
        password: document.getElementById("password").value
    };

    if (updatedUser.password && updatedUser.password !== document.getElementById("confirm-password").value) {
        alert("Mật khẩu mới và xác nhận mật khẩu không khớp!");
        return;
    }

    // Cập nhật vào localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser));
    alert("Thông tin đã được cập nhật!");
});

// Hàm bật/tắt hiển thị mật khẩu
function togglePassword(fieldId) {
    const passwordField = document.getElementById(fieldId);
    const toggleIcon = passwordField.nextElementSibling;

    if (passwordField.type === "password") {
        passwordField.type = "text";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
    } else {
        passwordField.type = "password";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
    }
}