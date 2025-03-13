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
const tableFoods = document.querySelector('#table-foods');
const foodModal = document.getElementById('foodModal');
const foodForm = document.getElementById('foodForm');
const formTitle = document.getElementById('formTitle');
let isEditing = false;

// Hiển thị danh sách thức ăn
function fetchFoods() {
    tableFoods.innerHTML = `
        <tr>
            <th>Tên món ăn</th>
            <th>Danh mục</th>
            <th>Giá</th>
            <th>Hình ảnh</th> <!-- Thêm cột Hình ảnh vào tiêu đề -->
            <th>Trạng thái</th>
            <th>Hành động</th>
        </tr>`;
    db.collection('foods').get().then(snapshot => {
        snapshot.forEach(doc => {
            renderFood(doc);
        });
    });
}
fetchFoods();

// Hiển thị Modal Thêm
document.getElementById('showAddForm').addEventListener('click', () => {
    isEditing = false;
    formTitle.innerText = "THÊM THỨC ĂN";
    foodForm.reset();
    foodModal.style.display = "flex";
});

// Hủy Modal
document.getElementById('cancelForm').addEventListener('click', () => {
    foodModal.style.display = "none";
});

// Đóng modal khi click ra ngoài
window.onclick = function(event) {
    if (event.target == foodModal) {
        foodModal.style.display = "none";
    }
}

// Thêm hoặc Cập nhật thức ăn
foodForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const foodData = {
        name: document.getElementById('foodName').value,
        category: document.getElementById('foodCategory').value,
        price: Number(document.getElementById('foodPrice').value),
        status: document.getElementById('foodStatus').value,
        picture: document.getElementById('foodPicture').value // Lưu ảnh vào Firestore
    };

    if (isEditing) {
        const id = document.getElementById('foodId').value;
        db.collection('foods').doc(id).update(foodData).then(() => {
            foodModal.style.display = "none";
            fetchFoods();
        });
    } else {
        db.collection('foods').add(foodData).then(() => {
            foodModal.style.display = "none";
            fetchFoods();
        });
    }
});

// Hiển thị dữ liệu lên bảng
function renderFood(doc) {
    const row = document.createElement('tr');
    row.setAttribute('data-id', doc.id);
    row.innerHTML = `
        <td>${doc.data().name}</td>
        <td>${doc.data().category}</td>
        <td>${doc.data().price} VND</td>
        <td><img src="${doc.data().picture}" alt="Ảnh món ăn" class="food-img"></td> <!-- Hình ảnh sau cột Giá -->
        <td>${doc.data().status}</td>
        <td>
            <button class="btn btn-warning btn-sm btn-edit">Sửa</button>
            <button class="btn btn-danger btn-sm btn-del">Xóa</button>
        </td>
    `;

    // Sửa dữ liệu
    row.querySelector('.btn-edit').addEventListener('click', () => {
        isEditing = true;
        formTitle.innerText = "SỬA THỨC ĂN";
        document.getElementById('foodId').value = doc.id;
        document.getElementById('foodName').value = doc.data().name;
        document.getElementById('foodCategory').value = doc.data().category;
        document.getElementById('foodPrice').value = doc.data().price;
        document.getElementById('foodStatus').value = doc.data().status;
        document.getElementById('foodPicture').value = doc.data().picture; // Hiển thị ảnh trong form
        foodModal.style.display = "flex";
    });

    // Xóa dữ liệu
    row.querySelector('.btn-del').addEventListener('click', () => {
        db.collection('foods').doc(doc.id).delete().then(() => {
            fetchFoods();
        });
    });

    tableFoods.appendChild(row);
}