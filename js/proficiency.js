const ProficiencySystem = {
    useMaterial(materialId) {
        GameState.increaseProficiency(materialId, 1);
    },

    getProficiencyBonus(materialId) {
        const prof = GameState.getProficiency(materialId);
        if (prof < 25) return 1.0;
        if (prof < 50) return 1.1;
        if (prof < 75) return 1.2;
        return 1.3;
    },

    getAttackBonus(materialId) {
        return this.getProficiencyBonus(materialId);
    },

    getCraftingQualityBonus(materialId) {
        const prof = GameState.getProficiency(materialId);
        return prof / 100;
    }
};
