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

// Xử lý sự kiện khi nhấn nút Đăng ký
document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const dob = document.getElementById("dob").value;
    const gender = document.getElementById("gender").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
    }

    try {

        // KIỂM TRA EMAIL ĐÃ TỒN TẠI TRONG FIRESTORE CHƯA
        const usersRef = db.collection("users");
        const querySnapshot = await usersRef.where("email", "==", email).get();

        if (!querySnapshot.empty) {
            alert("Email này đã được đăng ký. Vui lòng sử dụng email khác!");
            return;
        }

        console.log("Bắt đầu ghi dữ liệu vào Firestore...");

        const docRef = await db.collection("users").add({
            fullname: fullname,
            email: email,
            phone: phone,
            dob: firebase.firestore.Timestamp.fromDate(new Date(dob)),
            gender: gender,
            password: password,
            role: "user",
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });


        console.log("Dữ liệu đã lưu, ID:", docRef.id);
        alert("Đăng ký thành công! ID người dùng: " + docRef.id);

        // Reset form sau khi đăng ký thành công
        document.getElementById("registerForm").reset();
    } catch (error) {
        console.error("Lỗi khi lưu dữ liệu:", error);
        alert("Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại!");
    }
});

function togglePassword(fieldId) {
    const passwordField = document.getElementById(fieldId);
    if (passwordField.type === "password") {
        passwordField.type = "text"; // Hiển thị mật khẩu
    } else {
        passwordField.type = "password"; // Ẩn mật khẩu
    }
}