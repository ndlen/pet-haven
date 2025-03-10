// import Service from './service.js';
// import readline from 'readline';
// class ServiceManager {
//     constructor() {
//         //this.se = new service();
//         this.services = [new Service()];
//     }
//     display() {
//         if(this.services.length > 0){
//             console.log('danh sach dich vu la: ');
//             this.services.forEach((service,index) => {
//                 console.log(`dich vu ${index + 1}:`);
//                 service.info();
//             });
//         } else {
//             console.log('khong co dich vu nao!');
//         }
//         //this.se.info();
//     }
//     async inputInfoService() {
//         //console.log("\n📝 Nhập thông tin dịch vụ:");

//         let service = new Service();  // 🛠 Tạo đối tượng `Service`
//         await service.inputInforService();  // 🔹 Gọi phương thức đã có của `Service`
        
//         this.services.push(service);  // ✅ Thêm dịch vụ vào danh sách

//         console.log("\n✅ Dịch vụ đã được thêm thành công!");
//     }
//     async askQuestion(rl, query) {
//         return new Promise(resolve => {
//             rl.question(query, answer => {
//                 resolve(answer.trim());  // Loại bỏ khoảng trắng
//             });
//         });
//     }
//     async updateService() {
//         if (this.services.length === 0) {
//             console.log("\n⚠ Không có dịch vụ nào để cập nhật!");
//             return;
//         }
    
//         const rl = readline.createInterface({
//             input: process.stdin,
//             output: process.stdout,
//             terminal: false
//         });
    
//         let id = await this.askQuestion(rl, 'Enter Service ID cần cập nhật: ');
    
//         let service = this.services.find(s => s.id === id);
//         if (!service) {
//             console.log("\n❌ Không tìm thấy dịch vụ với ID này!");
//             rl.close();
//             return;
//         }
    
//         console.log("\n🔄 Nhập thông tin mới (Nhấn Enter để giữ nguyên giá trị cũ):");
    
//         let nameService = await this.askQuestion(rl, `Enter new Service Name (${service.nameService}): `);
//         if (nameService) service.nameService = nameService;
    
//         let describe = await this.askQuestion(rl, `Enter new Description (${service.describe}): `);
//         if (describe) service.describe = describe;
    
//         let priceInput;
//         do {
//             priceInput = await this.askQuestion(rl, `Enter new Price (Nhập số) (${service.price}): `);
//             if (priceInput && (isNaN(priceInput) || priceInput.trim() === '')) {
//                 console.log("⚠ Giá phải là một số hợp lệ. Vui lòng nhập lại.");
//             }
//         } while (priceInput && (isNaN(priceInput) || priceInput.trim() === ''));
//         if (priceInput) service.price = parseFloat(priceInput);
    
//         let picture = await this.askQuestion(rl, `Enter new Picture URL (${service.picture}): `);
//         if (picture) service.picture = picture;
    
//         rl.close();
        
//         console.log("\n✅ Dịch vụ đã được cập nhật thành công!");
//         service.info();
//     }
    
//     async deleteService() {
//         if (this.services.length === 0) {
//             console.log("\n⚠ Không có dịch vụ nào để xóa!");
//             return;
//         }
    
//         const rl = readline.createInterface({
//             input: process.stdin,
//             output: process.stdout,
//             terminal: false
//         });
    
//         let id = await this.askQuestion(rl, 'Enter Service ID cần xóa: ');
    
//         let index = this.services.findIndex(s => s.id === id);
//         if (index === -1) {
//             console.log("\n❌ Không tìm thấy dịch vụ với ID này!");
//             rl.close();
//             return;
//         }
    
//         // Xác nhận xóa
//         let confirm = await this.askQuestion(rl, `Bạn có chắc chắn muốn xóa dịch vụ ${this.services[index].nameService}? (yes/no): `);
//         if (confirm.toLowerCase() === 'yes' || confirm.toLowerCase() === 'y') {
//             let deletedService = this.services.splice(index, 1);
//             console.log(`\n✅ Dịch vụ '${deletedService[0].nameService}' đã bị xóa!`);
//         } else {
//             console.log("\n❌ Hủy thao tác xóa!");
//         }
    
//         rl.close();
//     }
    
//     // // inputInfoService() {
//     // //     this.services.inputInforService()
//     // // }
//     // async inputInfoService() {
//     //     console.log("\n📝 Nhập thông tin dịch vụ:");

//     //     const rl = readline.createInterface({
//     //         input: process.stdin,
//     //         output: process.stdout
//     //     });

//     //     this.id = await this.askQuestion(rl, 'Enter Service ID: ');
//     //     this.nameService = await this.askQuestion(rl, 'Enter Service Name: ');
//     //     this.describe = await this.askQuestion(rl, 'Enter Description: ');
        
//     //     let priceInput;
//     //     do {
//     //         priceInput = await this.askQuestion(rl, 'Enter Price (Nhập số): ');
//     //         if (isNaN(priceInput)) {
//     //             console.log("⚠ Giá phải là một số hợp lệ. Vui lòng nhập lại.");
//     //         }
//     //     } while (isNaN(priceInput));
//     //     this.price = parseFloat(priceInput);

//     //     this.picture = await this.askQuestion(rl, 'Enter Picture URL: ');

//     //     rl.close();  // Đóng readline sau khi nhập xong
//     //     this.info(); // Hiển thị thông tin dịch vụ
//     // }
        
// }
// export default ServiceManager;
import Service from './service.js';

class ServiceManager {
    constructor() {
        this.services = [];
    }

    display() {
        if (this.services.length > 0) {
            console.log('\n📌 Danh sách dịch vụ:');
            this.services.forEach((service, index) => {
                console.log(`\nDịch vụ ${index + 1}:`);
                service.info();
            });
        } else {
            console.log('\n⚠ Không có dịch vụ nào trong hệ thống!');
        }
    }

    addService(service) {
        this.services.push(service);
        console.log("\n✅ Dịch vụ đã được thêm thành công!");
    }

    updateService(index, newService) {
        if (index >= 0 && index < this.services.length) {
            this.services[index] = newService;
            console.log("\n✅ Dịch vụ đã được cập nhật thành công!");
        }
    }

    deleteService(index) {
        if (index >= 0 && index < this.services.length) {
            this.services.splice(index, 1);
            console.log("\n✅ Dịch vụ đã bị xóa!");
        }
    }
}

export default ServiceManager;
