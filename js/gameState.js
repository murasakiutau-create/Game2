const GameState = {
    materials: {},
    items: [],
    completedQuests: [],
    currentBattle: null,
    
    init() {
        // LocalStorageからロード、なければ初期化
        const saved = localStorage.getItem('gameState');
        if (saved) {
            const state = JSON.parse(saved);
            this.materials = state.materials;
            this.items = state.items;
            this.completedQuests = state.completedQuests;
        } else {
            this.resetToInitial();
        }
    },

    resetToInitial() {
        this.materials = JSON.parse(JSON.stringify(GameData.initialMaterials));
        this.items = [];
        this.completedQuests = [];
        this.save();
    },

    save() {
        const state = {
            materials: this.materials,
            items: this.items,
            completedQuests: this.completedQuests
        };
        localStorage.setItem('gameState', JSON.stringify(state));
    },

    getMaterialCount(materialId) {
        return this.materials[materialId]?.count || 0;
    },

    addMaterial(materialId, count = 1) {
        if (!this.materials[materialId]) {
            this.materials[materialId] = { count: 0, proficiency: 0 };
        }
        this.materials[materialId].count += count;
        this.save();
    },

    removeMaterial(materialId, count = 1) {
        if (this.materials[materialId]) {
            this.materials[materialId].count = Math.max(0, this.materials[materialId].count - count);
            this.save();
        }
    },

    getProficiency(materialId) {
        return this.materials[materialId]?.proficiency || 0;
    },

    increaseProficiency(materialId, amount = 1) {
        if (!this.materials[materialId]) {
            this.materials[materialId] = { count: 0, proficiency: 0 };
        }
        this.materials[materialId].proficiency += amount;
        if (this.materials[materialId].proficiency > 100) {
            this.materials[materialId].proficiency = 100;
        }
        this.save();
    },

    addItem(itemName, quantity = 1) {
        const existing = this.items.find(i => i.name === itemName);
        if (existing) {
            existing.count += quantity;
        } else {
            this.items.push({ name: itemName, count: quantity });
        }
        this.save();
    },

    removeItem(itemName, quantity = 1) {
        const item = this.items.find(i => i.name === itemName);
        if (item) {
            item.count -= quantity;
            if (item.count <= 0) {
                this.items = this.items.filter(i => i.name !== itemName);
            }
        }
        this.save();
    },

    getItemCount(itemName) {
        const item = this.items.find(i => i.name === itemName);
        return item ? item.count : 0;
    },

    completeQuest(questId) {
        if (!this.completedQuests.includes(questId)) {
            this.completedQuests.push(questId);
            this.save();
        }
    },

    isQuestCompleted(questId) {
        return this.completedQuests.includes(questId);
    },

    getAllMaterials() {
        return Object.keys(this.materials)
            .map(id => ({ id: parseInt(id), ...this.materials[id] }))
            .filter(m => m.count > 0);
    }
};

// 初期化
GameState.init();
