const fs = require('fs-extra');
const path = require('path');

class DataManager {
    constructor(dataType) {
        this.dataType = dataType;
        this.dataDir = path.join(__dirname, '..', 'data');
        this.filePath = path.join(this.dataDir, `${dataType}.json`);
        this.ensureFile();
    }

    ensureFile() {
        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
        }
    }

    async read() {
        try {
            const data = await fs.readFile(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error(`Erro ao ler ${this.dataType}:`, error);
            return [];
        }
    }

    async write(data) {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            console.error(`Erro ao escrever ${this.dataType}:`, error);
            throw error;
        }
    }

    async getAll() {
        return await this.read();
    }

    async getById(id) {
        const data = await this.read();
        return data.find(item => item.id === id);
    }

    async create(item) {
        const data = await this.read();
        if (!item.id) {
            item.id = Date.now().toString();
        }
        item.createdAt = new Date().toISOString();
        item.updatedAt = new Date().toISOString();
        data.push(item);
        await this.write(data);
        return item;
    }

    async update(id, updates) {
        const data = await this.read();
        const index = data.findIndex(item => item.id === id);
        if (index === -1) {
            return null;
        }
        data[index] = { ...data[index], ...updates, updatedAt: new Date().toISOString() };
        await this.write(data);
        return data[index];
    }

    async delete(id) {
        const data = await this.read();
        const filtered = data.filter(item => item.id !== id);
        await this.write(filtered);
        return filtered.length < data.length;
    }

    async deleteAll() {
        await this.write([]);
        return true;
    }

    async find(query) {
        const data = await this.read();
        return data.filter(item => {
            return Object.keys(query).every(key => {
                return item[key] === query[key];
            });
        });
    }
}

module.exports = DataManager;










