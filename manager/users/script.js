const firebaseConfig = {
    apiKey: "AIzaSyDbS-1FULvtPhOKsQBfLcamsQDUmMyfyOo",
    authDomain: "pet-haven-fb90f.firebaseapp.com",
    projectId: "pet-haven-fb90f",
    storageBucket: "pet-haven-fb90f.appspot.com",
    messagingSenderId: "910697102356",
    appId: "1:910697102356:web:b980f8219ab73019c0fb01"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const tableUsers = document.querySelector('#table-users');

// Hiển thị danh sách người dùng
function fetchUsers() {
    tableUsers.innerHTML = `
        <tr>
            <th>Email</th>
            <th>Mật khẩu</th>
            <th>Số điện thoại</th>
            <th>Vai trò</th>
            <th>Hành động</th>
        </tr>`;
    db.collection('users').get().then(snapshot => {
        snapshot.forEach(doc => {
            renderUser(doc);
        });
    });
}
fetchUsers();

// Hiển thị dữ liệu lên bảng
function renderUser(doc) {
    const row = document.createElement('tr');
    row.setAttribute('data-id', doc.id);
    row.innerHTML = `
        <td>${doc.data().email}</td>
        <td>${doc.data().password}</td>
        <td>${doc.data().phone}</td>
        <td>${doc.data().role}</td>
        <td>
            <button class="btn btn-warning btn-sm btn-edit">Sửa</button>
            <button class="btn btn-danger btn-sm btn-del">Xóa</button>
        </td>
    `;

    // Sự kiện sửa
    row.querySelector('.btn-edit').addEventListener('click', () => {
        const newRole = prompt("Nhập vai trò mới (user/admin):", doc.data().role);
        if (newRole && (newRole === "user" || newRole === "admin")) {
            db.collection('users').doc(doc.id).update({ role: newRole }).then(() => {
                fetchUsers();
            });
        }
    });

    // Sự kiện xóa
    row.querySelector('.btn-del').addEventListener('click', () => {
        if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
            db.collection('users').doc(doc.id).delete().then(() => {
                fetchUsers();
            });
        }
    });

    tableUsers.appendChild(row);
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