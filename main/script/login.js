import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
        import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

        const firebaseConfig = {
            apiKey: "AIzaSyDbS-1FULvtPhOKsQBfLcamsQDUmMyfyOo",
            authDomain: "pet-haven-fb90f.firebaseapp.com",
            projectId: "pet-haven-fb90f",
            storageBucket: "pet-haven-fb90f.appspot.com",
            messagingSenderId: "910697102356",
            appId: "1:910697102356:web:b980f8219ab73019c0fb01"
        };

        // Khởi tạo Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        // Xử lý đăng nhập từ Firestore
        document.getElementById("loginForm").addEventListener("submit", async function (e) {
            e.preventDefault(); // Ngăn chặn load lại trang

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                // Truy vấn Firestore để kiểm tra email & password
                const usersRef = collection(db, "users");
                const q = query(usersRef, where("email", "==", email), where("password", "==", password));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0]; // Lấy document đầu tiên
                    const userData = userDoc.data(); // Lấy dữ liệu của người dùng

                    localStorage.setItem("user", JSON.stringify(userData));
                    window.location.href = "home.html"; // Chuyển đến trang home.html
                } else {
                    alert("Sai email hoặc mật khẩu! Vui lòng thử lại.");
                }
            } catch (error) {
                alert("Lỗi khi đăng nhập: " + error.message);
            }
        });

        // Hàm bật/tắt hiển thị mật khẩu
        window.togglePassword = function (fieldId) {
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
        };