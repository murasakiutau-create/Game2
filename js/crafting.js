// Crafting system logic

class CraftingSystem {
  craft(recipeId, selectedMaterialIds) {
    const recipe = GAME_DATA.RECIPES.find(r => r.id === recipeId);
    if (!recipe) return { success: false, error: 'Recipe not found' };

    // Check if we have required materials
    for (const materialId of selectedMaterialIds) {
      if (!gameState.hasMaterial(materialId)) {
        return { success: false, error: `Missing material: ${materialId}` };
      }
    }

    // Calculate element attributes
    const elements = {};
    const qualities = {};

    for (const materialId of selectedMaterialIds) {
      const material = gameState.getMaterial(materialId);
      elements[material.element] = (elements[material.element] || 0) + 1;
      qualities[material.quality] = (qualities[material.quality] || 0) + 1;

      // Increase proficiency for used materials
      gameState.increaseProficiency(materialId, 1);

      // Remove from inventory
      gameState.removeMaterial(materialId, 1);
    }

    // Check if recipe requirements are met
    const dominantElement = Object.keys(elements).reduce((a, b) =>
      elements[a] > elements[b] ? a : b
    );

    if (dominantElement !== recipe.elementRequirement) {
      return { success: false, error: `Wrong element combination (needed ${recipe.elementRequirement})` };
    }

    // Calculate quality
    let qualityBonus = 0;
    if (qualities[recipe.qualityRequirement] !== undefined) {
      qualityBonus = qualities[recipe.qualityRequirement];
    }

    // Calculate proficiency bonus
    let proficiencyBonus = 0;
    for (const materialId of selectedMaterialIds) {
      const inv = gameState.inventory.find(i => i.materialId === materialId);
      if (inv) {
        proficiencyBonus += inv.proficiency / 100;
      }
    }

    // Create the final product
    const product = {
      name: recipe.product,
      recipeId: recipeId,
      quality: qualityBonus > 0 ? 'Enhanced' : 'Normal',
      proficiencyBonus: Math.floor(proficiencyBonus)
    };

    gameState.addCraftedItem(product);

    return {
      success: true,
      product: product
    };
  }

  validateRecipe(recipeId, selectedMaterialIds) {
    const recipe = GAME_DATA.RECIPES.find(r => r.id === recipeId);
    if (!recipe) return { valid: false, error: 'Recipe not found' };

    if (selectedMaterialIds.length === 0) {
      return { valid: false, error: 'Select materials first' };
    }

    // Check material count matches
    if (selectedMaterialIds.length !== recipe.materials.length) {
      return { valid: false, error: `Need ${recipe.materials.length} materials` };
    }

    // Check if all selected materials exist
    for (const materialId of selectedMaterialIds) {
      if (!gameState.hasMaterial(materialId)) {
        return { valid: false, error: `Don't have material: ${materialId}` };
      }
    }

    return { valid: true };
  }
}

const craftingSystem = new CraftingSystem();
