import fs from 'fs';

class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async loadCarts() {
        if (fs.existsSync(this.filePath)) {
            const data = await fs.promises.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        } else {
            return [];
        }
    }

    async saveCarts(carts) {
        await fs.promises.writeFile(this.filePath, JSON.stringify(carts, null, 2));
    }

    async getNextId() {
        const carts = await this.loadCarts();
        if (carts.length === 0) return 1;
        return carts[carts.length - 1].id + 1;
    }
}

export default CartManager;
