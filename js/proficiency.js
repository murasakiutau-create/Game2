// Proficiency system

class ProficiencySystem {
  getProficiencyLevel(proficiency) {
    if (proficiency < 20) return 'Novice';
    if (proficiency < 40) return 'Apprentice';
    if (proficiency < 60) return 'Journeyman';
    if (proficiency < 80) return 'Expert';
    if (proficiency < 100) return 'Master';
    return 'Legendary';
  }

  getProficiencyBonus(proficiency) {
    return Math.floor(proficiency / 25);
  }

  getDisplayProficiency(proficiency) {
    const level = this.getProficiencyLevel(proficiency);
    const bonus = this.getProficiencyBonus(proficiency);
    return `${level} (${proficiency}/100) +${bonus}`;
  }

  calculateCraftBonus(selectedMaterialIds) {
    let totalBonus = 0;
    for (const materialId of selectedMaterialIds) {
      const inv = gameState.inventory.find(i => i.materialId === materialId);
      if (inv) {
        totalBonus += this.getProficiencyBonus(inv.proficiency);
      }
    }
    return totalBonus;
  }

  calculateBattleBonus(materialId) {
    const inv = gameState.inventory.find(i => i.materialId === materialId);
    if (inv) {
      return this.getProficiencyBonus(inv.proficiency);
    }
    return 0;
  }
}

const proficiencySystem = new ProficiencySystem();
