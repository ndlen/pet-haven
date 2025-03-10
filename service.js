// import readline from 'readline';
// //const readline = require('readline');
// // const rl = readline.createInterface({
// //     input: process.stdin,
// //     output: process.stdout
// // });
// class Service {
//     constructor(id = null, nameService = null, describe = null, price = null, picture = null) {
//         this.id = id;
//         this.nameService = nameService;
//         this.describe = describe;
//         this.price = price;
//         this.picture = picture;
//     }

//     // constructor() {
//     //     this.id = null;
//     //     this.nameService = null;
//     //     this.describe = null;
//     //     this.price = null;
//     //     this.picture = null;
//     // }
//     info() {
//         console.log("id: " + this.id + ", nameService: " + this.nameService +
//             ", describe: " + this.describe + ", price: " + this.price + ", picture: " + this.picture);
//     }

//     static fromFormInputs(id, nameService, describe, price, picture) {
//         return new Service(id, nameService, describe, parseFloat(price), picture);
//     }

//     async askQuestion(rl, query) {
//         return new Promise(resolve => {
//             process.stdout.write(query); // Hiển thị câu hỏi nhưng không xuống dòng
//             // rl.question("", answer => {
//             //     process.stdout.clearLine();  // Xóa dòng vừa nhập
//             //     process.stdout.cursorTo(0); // Đưa con trỏ về đầu dòng
//             //     resolve(answer.trim());  // Loại bỏ khoảng trắng đầu/cuối
//             // });
//         });
//     }

//     async inputInforService() {
//         console.log("\n📝 Nhập thông tin dịch vụ:");

//         // 🛠 Tạo `readline` chỉ một lần và tắt chế độ `echo`
//         // const rl = readline.createInterface({
//         //     input: process.stdin,
//         //     output: process.stdout,
//         //     terminal: false  // 🔹 Tắt `echo` tránh hiển thị trùng ký tự
//         // });

//         // 📌 Nhập dữ liệu từng bước
//         this.id = await this.askQuestion(rl, 'Enter Service ID: ');
//         this.nameService = await this.askQuestion(rl, 'Enter Service Name: ');
//         this.describe = await this.askQuestion(rl, 'Enter Description: ');

//         // 📌 Sửa lỗi nhập số bị lặp
//         while (true) {
//             let priceInput = await this.askQuestion(rl, 'Enter Price (Nhập số): ');
//             if (!isNaN(priceInput) && priceInput.trim() !== '') {
//                 this.price = parseFloat(priceInput);
//                 break; // 🛠 Thoát khỏi vòng lặp khi nhập đúng
//             }
//             console.log("⚠ Giá phải là một số hợp lệ. Vui lòng nhập lại.");
//         }

//         this.picture = await this.askQuestion(rl, 'Enter Picture URL: ');

//         rl.close(); // ✅ Đóng `readline` SAU KHI nhập xong

//         this.info(); // ✅ Hiển thị thông tin sau khi nhập xong
//     }
    
//     setId(id) {
//         this.id = id;
//     }
//     getId() {
//         return this.id;
//     }
//     setNameService(nameService) {
//         this.nameService = nameService;
//     }
//     getNameService() {
//         return this.nameService;
//     }
//     setDescribe(describe) {
//         this.describe = describe;
//     }
//     getDescribe() {
//         return this.describe;
//     }
//     setPrice(price) {
//         this.price = price;
//     }
//     getPrice() {
//         return this.price;
//     }
//     setPicture(picture) {
//         this.picture = picture;
//     }
//     getPicture() {
//         return this.picture;
//     }
// }
// export default Service;
class Service {
    constructor(id = null, nameService = null, describe = null, price = null, picture = null) {
        this.id = id;
        this.nameService = nameService;
        this.describe = describe;
        this.price = price;
        this.picture = picture;
    }

    info() {
        console.log("\n✅ Dịch vụ đã được nhập thành công!");
        console.log("📝 Chi tiết dịch vụ:");
        console.log(`ID: ${this.id}`);
        console.log(`Tên dịch vụ: ${this.nameService}`);
        console.log(`Mô tả: ${this.describe}`);
        console.log(`Giá: ${this.price}`);
        console.log(`Hình ảnh: ${this.picture}`);
    }

    // Hàm nhập thông tin trên trình duyệt
    static fromFormInputs(id, nameService, describe, price, picture) {
        return new Service(id, nameService, describe, parseFloat(price), picture);
    }
}

export default Service;
