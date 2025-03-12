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
const tableServices = document.querySelector('#table-services');
const serviceModal = document.getElementById('serviceModal');
const serviceForm = document.getElementById('serviceForm');
const formTitle = document.getElementById('formTitle');
let isEditing = false;

// Hiển thị danh sách dịch vụ
db.collection('services').get().then(snapshot => {
    snapshot.forEach(doc => {
        renderService(doc);
    });
});

// Hiển thị Modal Thêm
document.getElementById('showAddForm').addEventListener('click', () => {
    isEditing = false;
    formTitle.innerText = "THÊM DỊCH VỤ";
    serviceForm.reset();
    serviceModal.style.display = "flex";
});

// Hủy Modal
document.getElementById('cancelForm').addEventListener('click', () => {
    serviceModal.style.display = "none";
});

// Đóng modal khi click ra ngoài
window.onclick = function(event) {
    if (event.target == serviceModal) {
        serviceModal.style.display = "none";
    }
}

// Thêm hoặc Cập nhật dịch vụ
serviceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const serviceData = {
        nameService: document.getElementById('serviceName').value,
        describe: document.getElementById('serviceDescription').value,
        picture: document.getElementById('servicePicture').value,
        price: Number(document.getElementById('servicePrice').value)
    };

    if (isEditing) {
        const id = document.getElementById('serviceId').value;
        db.collection('services').doc(id).update(serviceData).then(() => {
            location.reload();
        });
    } else {
        db.collection('services').add(serviceData).then(() => {
            location.reload();
        });
    }
    serviceModal.style.display = "none";
});

// Hiển thị dữ liệu lên bảng
const renderService = (doc) => {
    const row = document.createElement('tr');
    row.setAttribute('data-id', doc.id);
    row.innerHTML = `
        <td>${doc.data().nameService}</td>
        <td>${doc.data().describe}</td>
        <td><img src="${doc.data().picture}" width="50"></td>
        <td>${doc.data().price}</td>
        <td>
            <button class="btn btn-warning btn-sm btn-edit">Sửa</button>
            <button class="btn btn-danger btn-sm btn-del">Xóa</button>
        </td>
    `;

    row.querySelector('.btn-edit').addEventListener('click', () => {
        isEditing = true;
        formTitle.innerText = "SỬA DỊCH VỤ";
        document.getElementById('serviceId').value = doc.id;
        document.getElementById('serviceName').value = doc.data().nameService;
        document.getElementById('serviceDescription').value = doc.data().describe;
        document.getElementById('servicePicture').value = doc.data().picture;
        document.getElementById('servicePrice').value = doc.data().price;
        serviceModal.style.display = "flex";
    });

    row.querySelector('.btn-del').addEventListener('click', () => {
        db.collection('services').doc(doc.id).delete().then(() => {
            location.reload();
        });
    });

    tableServices.appendChild(row);
};
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