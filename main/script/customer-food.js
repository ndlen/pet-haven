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

// Hiển thị danh sách thức ăn
const foodList = document.getElementById("food-list");

db.collection("foods").where("status", "==", "Còn hàng").get().then((snapshot) => {
    snapshot.forEach((doc) => {
        const food = doc.data();
        const foodCard = document.createElement("div");
        foodCard.classList.add("food-card");
        foodCard.innerHTML = `
            <img src="${food.picture}" alt="${food.name}">
            <h3>${food.name}</h3>
            <p>Danh mục: ${food.category}</p>
            <span class="price">${food.price.toLocaleString()} VND</span>
            <button class="book-btn" onclick="bookFood('${doc.id}', '${food.name}')">Đặt mua</button>
        `;
        foodList.appendChild(foodCard);
    });
});

// Chức năng đặt mua thức ăn
function bookFood(foodId, foodName) {
    localStorage.setItem("selectedFood", JSON.stringify({ id: foodId, name: foodName }));
    window.location.href = "appointment.html"; // Chuyển đến trang đặt lịch
}