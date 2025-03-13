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

// Hiển thị danh sách dịch vụ
const servicesList = document.getElementById("services-list");

db.collection("services").get().then((snapshot) => {
    snapshot.forEach((doc) => {
        const service = doc.data();
        const serviceCard = document.createElement("div");
        serviceCard.classList.add("service-card");
        serviceCard.innerHTML = `
            <img src="${service.picture}" alt="${service.nameService}">
            <h3>${service.nameService}</h3>
            <p>${service.describe}</p>
            <span class="price">${service.price.toLocaleString()} VND</span>
            <button class="book-btn" onclick="bookService('${doc.id}', '${service.nameService}')">Đặt lịch</button>
        `;
        servicesList.appendChild(serviceCard);
    });
});

// Chức năng đặt lịch
function bookService(serviceId, serviceName) {
    localStorage.setItem("selectedService", JSON.stringify({ id: serviceId, name: serviceName }));
    window.location.href = "appointment.html";
}
