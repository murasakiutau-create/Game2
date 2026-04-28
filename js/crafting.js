const CraftingSystem = {
    selectedRecipe: null,

    selectRecipe(recipeId) {
        this.selectedRecipe = GameData.getRecipeById(recipeId);
    },

    canCraft(selectedMaterials) {
        if (!this.selectedRecipe) return false;

        for (const req of this.selectedRecipe.materials) {
            const materialId = selectedMaterials[req.materialId];
            if (!materialId) return false;
            if (GameState.getMaterialCount(materialId) < req.quantity) return false;
        }
        return true;
    },

    craft(selectedMaterials) {
        if (!this.canCraft(selectedMaterials)) {
            alert('素材が足りません');
            return false;
        }

        // 素材を消費
        for (const req of this.selectedRecipe.materials) {
            const materialId = selectedMaterials[req.materialId];
            for (let i = 0; i < req.quantity; i++) {
                GameState.removeMaterial(materialId);
                ProficiencySystem.useMaterial(materialId);
            }
        }

        // アイテムを生成
        GameState.addItem(this.selectedRecipe.result, 1);
        alert(`${this.selectedRecipe.result}を作成しました！`);
        this.selectedRecipe = null;
        return true;
    }
};
