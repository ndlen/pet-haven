import { db, collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from "./firebase.js";

const addServiceBtn = document.getElementById("addServiceBtn");
const modal = document.getElementById("serviceModal");
const closeModal = document.querySelector(".close");
const saveServiceBtn = document.getElementById("saveService");
const serviceList = document.getElementById("serviceList");

// Các input trong modal
const serviceNameInput = document.getElementById("serviceName");
const serviceDescInput = document.getElementById("serviceDesc");
const servicePriceInput = document.getElementById("servicePrice");
const servicePictureInput = document.getElementById("servicePicture");

let editId = null;  // Dùng để theo dõi trạng thái sửa

// 🔹 **Lưu dịch vụ vào Firestore**
async function saveServiceToFirestore(service) {
    const servicesRef = collection(db, "services");

    try {
        if (editId) {
            const serviceDoc = doc(db, "services", editId);
            await updateDoc(serviceDoc, service);
            editId = null;
        } else {
            await addDoc(servicesRef, service);
        }
        loadServicesFromFirestore();
    } catch (error) {
        console.error("Lỗi khi lưu dịch vụ:", error);
    }
}

// 🔹 **Tải danh sách dịch vụ từ Firestore**
async function loadServicesFromFirestore() {
    const servicesRef = collection(db, "services");
    try {
        const snapshot = await getDocs(servicesRef);
        const services = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderServices(services);
    } catch (error) {
        console.error("Lỗi khi tải dịch vụ:", error);
    }
}

// 🔹 **Hiển thị danh sách dịch vụ**
function renderServices(services) {
    serviceList.innerHTML = "";
    services.forEach(service => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${service.id}</td>
            <td>${service.nameService}</td>
            <td>${service.describe}</td>
            <td>${service.price}</td>
            <td>
                <img src="${service.picture}" alt="Hình Ảnh" 
                     onerror="this.onerror=null; this.src='default.jpg';"
                     style="width:50px; height:50px; object-fit:cover;">
            </td>
            <td>
                <button class="edit-btn" data-id="${service.id}">✏ Sửa</button>
                <button class="delete-btn" data-id="${service.id}">🗑 Xóa</button>
            </td>
        `;
        serviceList.appendChild(row);
    });

    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", handleEditService);
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", handleDeleteService);
    });
}

// 🔹 **Xóa dịch vụ khỏi Firestore**
async function handleDeleteService(event) {
    let id = event.target.getAttribute("data-id");
    if (confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) {
        try {
            await deleteDoc(doc(db, "services", id));
            loadServicesFromFirestore();
        } catch (error) {
            console.error("Lỗi khi xóa dịch vụ:", error);
        }
    }
}

// 🔹 **Chỉnh sửa dịch vụ**
function handleEditService(event) {
    editId = event.target.getAttribute("data-id");
    const serviceDoc = doc(db, "services", editId);
    getDocs(collection(db, "services")).then(snapshot => {
        snapshot.docs.forEach(doc => {
            if (doc.id === editId) {
                const data = doc.data();
                serviceNameInput.value = data.nameService;
                serviceDescInput.value = data.describe;
                servicePriceInput.value = data.price;
                servicePictureInput.value = data.picture;
                modal.style.display = "flex";
            }
        });
    }).catch(error => console.error("Lỗi khi tải dịch vụ cần sửa:", error));
}

// 🔹 **Mở modal để thêm dịch vụ mới**
addServiceBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    clearForm();
    editId = null;
});

// 🔹 **Đóng modal**
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

// 🔹 **Lưu dịch vụ khi nhấn "Lưu"**
saveServiceBtn.addEventListener("click", async () => {
    const nameService = serviceNameInput.value.trim();
    const describe = serviceDescInput.value.trim();
    const price = parseFloat(servicePriceInput.value.trim());
    const picture = servicePictureInput.value.trim();

    if (!nameService || !describe || isNaN(price) || !picture) {
        alert("⚠ Vui lòng nhập đầy đủ thông tin hợp lệ!");
        return;
    }

    let newService = { nameService, describe, price, picture };
    await saveServiceToFirestore(newService);
    modal.style.display = "none";
});

// 🔹 **Xóa thông tin trong form**
function clearForm() {
    serviceNameInput.value = "";
    serviceDescInput.value = "";
    servicePriceInput.value = "";
    servicePictureInput.value = "";
}

// 🔹 **Tải danh sách dịch vụ từ Firestore khi trang load**
loadServicesFromFirestore();
