// Kết nối Firebase
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

// Hiển thị danh sách sản phẩm
db.collection('foods').get().then(snapshot => {
    snapshot.forEach(doc => {
        renderFood(doc);
    });
});

// Thêm sản phẩm
document.getElementById('addFoodForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const foodData = {
        name: document.getElementById('addFoodName').value,
        price: Number(document.getElementById('addFoodPrice').value),
        category: document.getElementById('addFoodCategory').value,
        status: document.getElementById('addFoodStatus').value
    };

    db.collection('foods').add(foodData).then(() => {
        console.log("Thêm món ăn thành công!");
        location.reload();
    }).catch(err => console.error("Lỗi khi thêm món ăn: ", err));

    $('#addFoodModal').modal('hide');
});

// Sửa sản phẩm
document.getElementById('editFoodForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const id = document.getElementById('editFoodId').value;
    const foodData = {
        name: document.getElementById('editFoodName').value,
        price: Number(document.getElementById('editFoodPrice').value),
        category: document.getElementById('editFoodCategory').value,
        status: document.getElementById('editFoodStatus').value
    };

    db.collection('foods').doc(id).update(foodData).then(() => {
        console.log("Cập nhật thành công!");
        location.reload();
    }).catch(err => console.error("Lỗi khi cập nhật: ", err));

    $('#editFoodModal').modal('hide');
});

// Hiển thị dữ liệu lên bảng
const renderFood = (doc) => {
    const row = document.createElement('tr');
    row.setAttribute('data-id', doc.id);
    row.innerHTML = `
        <td>${doc.data().name}</td>
        <td>${doc.data().price}</td>
        <td>${doc.data().category}</td>
        <td>${doc.data().status}</td>
        <td>
            <button class="btn btn-warning btn-sm btn-edit">Sửa</button>
            <button class="btn btn-danger btn-sm btn-del">Xóa</button>
        </td>
    `;

    row.querySelector('.btn-edit').addEventListener('click', () => {
        document.getElementById('editFoodId').value = doc.id;
        document.getElementById('editFoodName').value = doc.data().name;
        document.getElementById('editFoodPrice').value = doc.data().price;
        document.getElementById('editFoodCategory').value = doc.data().category;
        document.getElementById('editFoodStatus').value = doc.data().status;
        $('#editFoodModal').modal('show');
    });

    row.querySelector('.btn-del').addEventListener('click', () => {
        db.collection('foods').doc(doc.id).delete().then(() => {
            console.log("Xóa thành công!");
            location.reload();
        });
    });

    tableFoods.appendChild(row);
};
