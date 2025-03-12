document.addEventListener("DOMContentLoaded", function () {
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {
        const question = item.querySelector(".faq-question");

        question.addEventListener("click", function () {
            item.classList.toggle("active");
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const userNav = document.getElementById("userNav");
    const userData = JSON.parse(localStorage.getItem("user")); // Lấy thông tin từ localStorage

    if (userData) {
        // Nếu đã đăng nhập, hiển thị tên user + dropdown menu
        userNav.innerHTML = `
    <div class="user-menu">
        <span onclick="toggleDropdown()" class="user-name">${userData.fullname} </span>
        <ul id="dropdownMenu" class="dropdown-menu">
            <li><a href="profile.html">Thông tin tài khoản</a></li>
            <li><a href="#" onclick="logout()">Đăng xuất</a></li>
        </ul>
    </div>
`;
    }
});

// Hàm hiển thị/ẩn dropdown menu
function toggleDropdown() {
    const menu = document.getElementById("dropdownMenu");
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

// Hàm đăng xuất
function logout() {
    localStorage.removeItem("user"); // Xóa dữ liệu user
    window.location.href = "./home.html"; // Tải lại trang
}
