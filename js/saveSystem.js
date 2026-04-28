const SaveSystem = {
    slots: ['game_slot_1', 'game_slot_2', 'game_slot_3'],

    save(slotNumber) {
        const slot = this.slots[slotNumber - 1];
        const data = {
            materials: GameState.materials,
            items: GameState.items,
            completedQuests: GameState.completedQuests,
            timestamp: new Date().toLocaleString()
        };
        const jsonString = JSON.stringify(data);
        const checksum = CRC32.toHex(CRC32.calculate(jsonString));
        const saveData = { data: jsonString, checksum: checksum };
        localStorage.setItem(slot, JSON.stringify(saveData));
    },

    load(slotNumber) {
        const slot = this.slots[slotNumber - 1];
        const saved = localStorage.getItem(slot);
        if (!saved) return null;

        try {
            const saveData = JSON.parse(saved);
            const checksum = CRC32.toHex(CRC32.calculate(saveData.data));
            if (checksum !== saveData.checksum) {
                alert('セーブデータが改竄されています！');
                return null;
            }
            const data = JSON.parse(saveData.data);
            GameState.materials = data.materials;
            GameState.items = data.items;
            GameState.completedQuests = data.completedQuests;
            GameState.save();
            return data;
        } catch (e) {
            alert('セーブデータの読み込みに失敗しました');
            return null;
        }
    },

    getSaveInfo(slotNumber) {
        const slot = this.slots[slotNumber - 1];
        const saved = localStorage.getItem(slot);
        if (!saved) return null;

        try {
            const saveData = JSON.parse(saved);
            const data = JSON.parse(saveData.data);
            return data.timestamp || '日時不明';
        } catch {
            return null;
        }
    },

    exportData() {
        const data = {
            materials: GameState.materials,
            items: GameState.items,
            completedQuests: GameState.completedQuests,
            timestamp: new Date().toLocaleString()
        };
        const jsonString = JSON.stringify(data);
        const checksum = CRC32.toHex(CRC32.calculate(jsonString));
        const exportData = { data: jsonString, checksum: checksum };
        const encoded = btoa(JSON.stringify(exportData));
        return encoded;
    },

    importData(encoded) {
        try {
            const decoded = atob(encoded);
            const importData = JSON.parse(decoded);
            const checksum = CRC32.toHex(CRC32.calculate(importData.data));
            if (checksum !== importData.checksum) {
                alert('インポートデータが改竄されています！');
                return false;
            }
            const data = JSON.parse(importData.data);
            GameState.materials = data.materials;
            GameState.items = data.items;
            GameState.completedQuests = data.completedQuests;
            GameState.save();
            alert('インポートが完了しました！');
            return true;
        } catch (e) {
            alert('インポートに失敗しました');
            return false;
        }
    }
};
