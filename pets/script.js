// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDbS-1FULvtPhOKsQBfLcamsQDUmMyfyOo",
    authDomain: "pet-haven-fb90f.firebaseapp.com",
    databaseURL: "https://pet-haven-fb90f-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "pet-haven-fb90f",
    storageBucket: "pet-haven-fb90f.firebasestorage.app",
    messagingSenderId: "910697102356",
    appId: "1:910697102356:web:b980f8219ab73019c0fb01"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const petForm = document.getElementById("pet-form");
const petTable = document.getElementById("pet-table").getElementsByTagName('tbody')[0];
let currentEditingId = null;

// Thêm hoặc cập nhật thông tin thú cưng
petForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const petName = document.getElementById("petName").value;
    const petAge = document.getElementById("petAge").value;
    const petSpecies = document.getElementById("petSpecies").value;
    const petDescription = document.getElementById("petDescription").value;
    const petImage = document.getElementById("petImage").value;
    const userId = document.getElementById("userId").value;

    const petId = `id${Date.now()}`;  // Tạo ID mới từ thời gian

    if (currentEditingId) {
        // Cập nhật dữ liệu nếu đang chỉnh sửa
        db.collection("pets").doc(currentEditingId).update({
            id: petId, petName, petAge, petSpecies, petDescription, petImage, userId
        }).then(() => {
            resetPetForm();
            displayPets();
        }).catch(error => console.error("Lỗi cập nhật: ", error));
    } else {
        // Thêm mới dữ liệu
        db.collection("pets").add({
            id: petId,  // Lưu ID thực tế
            petName,
            petAge,
            petSpecies,
            petDescription,
            petImage,
            userId
        }).then(() => {
            resetPetForm();
            displayPets();
        }).catch(error => console.error("Lỗi thêm: ", error));
    }
});

// Hiển thị danh sách thú cưng
function displayPets() {
    petTable.innerHTML = "";
    db.collection("pets").get().then(snapshot => {
        snapshot.forEach(doc => {
            const pet = doc.data();  // Lấy dữ liệu từ Firestore
            console.log(pet); // Debug dữ liệu lấy được

            // Kiểm tra nếu dữ liệu bị undefined, dùng giá trị mặc định
            const petId = pet.id || "No ID"; 
            const petName = pet.petName || "No Data";
            const petAge = pet.petAge || "No Data";
            const petSpecies = pet.petSpecies || "No Data";
            const petDescription = pet.petDescription || "No Data";
            const petImage = pet.petImage || "No Data";
            const userId = pet.userId || "No Data";

            const row = petTable.insertRow();
            row.innerHTML = `
                <td>${petId}</td>
                <td>${petName}</td>
                <td>${petAge}</td>
                <td>${petSpecies}</td>
                <td>${petDescription}</td>
                <td>
                    <button class="edit-btn" onclick="editPet('${doc.id}')">Sửa</button>
                    <button class="delete-btn" onclick="deletePet('${doc.id}')">Xóa</button>
                </td>
            `;
        });
    }).catch(error => console.error("Lỗi hiển thị: ", error));
}

// Sửa thông tin thú cưng
window.editPet = function(id) {
    db.collection("pets").doc(id).get().then(doc => {
        const pet = doc.data();
        document.getElementById("petName").value = pet.petName;
        document.getElementById("petAge").value = pet.petAge;
        document.getElementById("petSpecies").value = pet.petSpecies;
        document.getElementById("petDescription").value = pet.petDescription;
        document.getElementById("petImage").value = pet.petImage;
        document.getElementById("userId").value = pet.userId;

        currentEditingId = id;
        togglePetForm();
    });
};

// Xóa thú cưng
window.deletePet = function(id) {
    db.collection("pets").doc(id).delete().then(() => {
        displayPets();
    }).catch(error => console.error("Lỗi xóa: ", error));
};

// Ẩn/hiện form
window.togglePetForm = function() {
    const formContainer = document.getElementById("pet-form-container");
    const overlay = document.getElementById("overlay");
    const isVisible = formContainer.style.display === "block";
    formContainer.style.display = isVisible ? "none" : "block";
    overlay.style.display = isVisible ? "none" : "block";
};

// Reset form
function resetPetForm() {
    petForm.reset();
    currentEditingId = null;
    togglePetForm();
}

// Hiển thị danh sách khi tải trang
displayPets();
