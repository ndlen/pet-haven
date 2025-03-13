// Điền dữ liệu cho ngày và năm
for (let i = 1; i <= 31; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    document.getElementById("day").appendChild(option);
}
const currentYear = new Date().getFullYear();
for (let i = currentYear; i >= 1900; i--) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    document.getElementById("year").appendChild(option);
}

// Cấu hình Firebase
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
const auth = firebase.auth();

let isEmailVerificationSent = false; // Biến kiểm tra xem link xác thực đã gửi chưa
let tempUser = null; // Lưu user tạm
let userEmail = null; // Lưu email tạm để kiểm tra
let userPassword = null; // Lưu mật khẩu tạm để kiểm tra

// Kiểm tra email khi nhập
const emailInput = document.getElementById("email");
const emailError = document.getElementById("email-error");
const emailSuccess = document.getElementById("email-success");
const verificationGroup = document.getElementById("verification-group");

emailInput.addEventListener("blur", async () => {
    const email = emailInput.value.trim();
    emailError.style.display = "none";
    emailSuccess.style.display = "none";
    verificationGroup.style.display = "none";

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        emailError.textContent = "Định dạng email không hợp lệ";
        emailError.style.display = "block";
        return;
    }

    // Kiểm tra email trong Firebase Authentication
    try {
        const signInMethods = await auth.fetchSignInMethodsForEmail(email);
        if (signInMethods.length > 0) {
            emailError.textContent = "Email đã tồn tại trong hệ thống";
            emailError.style.display = "block";
            return;
        }

        // Kiểm tra email trong Firestore
        const usersRef = db.collection("users");
        const querySnapshot = await usersRef.where("email", "==", email).get();
        if (!querySnapshot.empty) {
            emailError.textContent = "Email đã tồn tại trong cơ sở dữ liệu";
            emailError.style.display = "block";
            return;
        }

        // Nếu email hợp lệ và chưa tồn tại, hiển thị nút gửi link xác thực
        userEmail = email; // Lưu email để sử dụng sau
        verificationGroup.style.display = "block";
    } catch (error) {
        console.error("Lỗi kiểm tra email:", error);
        emailError.textContent = "Lỗi khi kiểm tra email";
        emailError.style.display = "block";
    }
});

// Gửi link xác thực qua email
document.getElementById("send-verification").addEventListener("click", async () => {
    const email = userEmail;
    const password = document.getElementById("password").value;

    if (!password) {
        alert("Vui lòng nhập mật khẩu trước khi gửi link xác thực!");
        return;
    }

    // Kiểm tra lại email trước khi gửi
    try {
        const signInMethods = await auth.fetchSignInMethodsForEmail(email);
        if (signInMethods.length > 0) {
            emailError.textContent = "Email đã tồn tại trong hệ thống";
            emailError.style.display = "block";
            return;
        }

        const usersRef = db.collection("users");
        const querySnapshot = await usersRef.where("email", "==", email).get();
        if (!querySnapshot.empty) {
            emailError.textContent = "Email đã tồn tại trong cơ sở dữ liệu";
            emailError.style.display = "block";
            return;
        }

        // Tạo tài khoản trong Firebase Authentication
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        tempUser = userCredential.user;

        // Gửi email xác thực
        await tempUser.sendEmailVerification();
        isEmailVerificationSent = true;
        userPassword = password; // Lưu mật khẩu để sử dụng sau

        // Theo dõi trạng thái xác thực
        const checkVerification = setInterval(async () => {
            await tempUser.reload(); // Cập nhật thông tin user
            if (tempUser.emailVerified) {
                clearInterval(checkVerification);
                emailError.style.display = "none";
                emailSuccess.style.display = "block"; // Hiển thị dòng "Đã xác thực"
                verificationGroup.style.display = "none"; // Ẩn nút "Gửi link xác thực"
            }
        }, 2000); // Kiểm tra mỗi 2 giây

        alert("Link xác thực đã được gửi đến email của bạn. Vui lòng kiểm tra và nhấp vào link để xác thực!");
    } catch (error) {
        console.error("Lỗi khi gửi link xác thực:", error);
        if (error.code === "auth/email-already-in-use") {
            emailError.textContent = "Email đã tồn tại trong hệ thống";
            emailError.style.display = "block";
        } else {
            alert("Đã xảy ra lỗi: " + error.message);
        }
    }
});

// Xử lý đăng ký
document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();

    // Kiểm tra xem đã gửi link xác thực chưa
    if (!isEmailVerificationSent) {
        alert("Vui lòng nhấn 'Gửi link xác thực' và xác thực email trước khi đăng ký!");
        return;
    }

    // Kiểm tra trạng thái xác thực email
    if (!tempUser) {
        alert("Không tìm thấy thông tin tài khoản. Vui lòng thử lại!");
        return;
    }

    await tempUser.reload(); // Cập nhật trạng thái user
    if (!tempUser.emailVerified) {
        alert("Email chưa được xác thực. Vui lòng kiểm tra email và nhấp vào link xác thực!");
        return;
    }

    const fullname = document.getElementById("fullname").value;
    const phone = document.getElementById("phone").value;
    const day = document.getElementById("day").value;
    const month = document.getElementById("month").value;
    const year = document.getElementById("year").value;
    const gender = document.getElementById("gender").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
    }

    // Kiểm tra nếu mật khẩu đã thay đổi
    if (password !== userPassword) {
        try {
            await tempUser.updatePassword(password);
        } catch (error) {
            console.error("Lỗi khi cập nhật mật khẩu:", error);
            alert("Lỗi khi cập nhật mật khẩu: " + error.message);
            return;
        }
    }

    try {
        // Tạo ngày sinh từ day, month, year
        const dob = new Date(`${year}-${month}-${day}`);
        if (isNaN(dob)) throw new Error("Ngày sinh không hợp lệ!");

        // Lưu thông tin vào Firestore
        await db.collection("users").add({
            fullname: fullname,
            email: email,
            phone: phone,
            dob: firebase.firestore.Timestamp.fromDate(dob),
            gender: gender,
            password: password,
            role: "user",
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert("Đăng ký thành công!");
        document.getElementById("registerForm").reset();
        verificationGroup.style.display = "none";
        emailSuccess.style.display = "none"; // Ẩn dòng "Đã xác thực" sau khi đăng ký
        isEmailVerificationSent = false;
        tempUser = null;
        userEmail = null;
        userPassword = null;
    } catch (error) {
        console.error("Lỗi khi đăng ký:", error);
        alert("Lỗi: " + error.message);
    }
});

// Toggle hiển thị mật khẩu
function togglePassword(fieldId) {
    const passwordField = document.getElementById(fieldId);
    passwordField.type = passwordField.type === "password" ? "text" : "password";
}