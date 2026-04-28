// Game state management

class GameState {
  constructor() {
    this.currentScreen = 'home';
    this.inventory = [];
    this.completedRequests = [];
    this.currentEnemy = null;
    this.playerHP = 100;
    this.playerMaxHP = 100;
    this.battleLog = [];
    this.craftedItems = [];

    this.loadInitialInventory();
  }

  loadInitialInventory() {
    this.inventory = GAME_DATA.INITIAL_INVENTORY.map(item => ({
      ...item
    }));
  }

  // Material management
  getMaterial(materialId) {
    return GAME_DATA.MATERIALS.find(m => m.id === materialId);
  }

  addMaterial(materialId, quantity = 1) {
    const inv = this.inventory.find(i => i.materialId === materialId);
    if (inv) {
      inv.quantity += quantity;
    } else {
      this.inventory.push({
        materialId,
        quantity,
        proficiency: 0
      });
    }
  }

  removeMaterial(materialId, quantity = 1) {
    const inv = this.inventory.find(i => i.materialId === materialId);
    if (inv) {
      inv.quantity = Math.max(0, inv.quantity - quantity);
      if (inv.quantity === 0) {
        this.inventory = this.inventory.filter(i => i.materialId !== materialId);
      }
      return true;
    }
    return false;
  }

  hasMaterial(materialId, quantity = 1) {
    const inv = this.inventory.find(i => i.materialId === materialId);
    return inv && inv.quantity >= quantity;
  }

  increaseProficiency(materialId, amount = 1) {
    const inv = this.inventory.find(i => i.materialId === materialId);
    if (inv) {
      inv.proficiency = Math.min(100, inv.proficiency + amount);
    }
  }

  // Request management
  getRequest(requestId) {
    return GAME_DATA.REQUESTS.find(r => r.id === requestId);
  }

  completeRequest(requestId) {
    const request = this.getRequest(requestId);
    if (request && !this.completedRequests.includes(requestId)) {
      this.completedRequests.push(requestId);
      // Add reward materials
      if (request.reward.materials) {
        request.reward.materials.forEach(mat => {
          this.addMaterial(mat, 1);
        });
      }
      return true;
    }
    return false;
  }

  isRequestCompleted(requestId) {
    return this.completedRequests.includes(requestId);
  }

  // Battle management
  startBattle(enemyId) {
    const enemy = GAME_DATA.ENEMIES.find(e => e.id === enemyId);
    if (enemy) {
      this.currentEnemy = {
        ...enemy,
        currentHP: enemy.hp
      };
      this.playerHP = this.playerMaxHP;
      this.battleLog = [];
      return true;
    }
    return false;
  }

  playerTakeDamage(damage) {
    this.playerHP = Math.max(0, this.playerHP - damage);
    return this.playerHP > 0;
  }

  enemyTakeDamage(damage) {
    this.currentEnemy.currentHP = Math.max(0, this.currentEnemy.currentHP - damage);
    return this.currentEnemy.currentHP > 0;
  }

  endBattle(won = false) {
    if (won && this.currentEnemy) {
      // Drop random materials
      const dropCount = Math.floor(Math.random() * 2) + 1;
      const drops = [];
      for (let i = 0; i < dropCount; i++) {
        const drop = this.currentEnemy.drops[Math.floor(Math.random() * this.currentEnemy.drops.length)];
        this.addMaterial(drop, 1);
        drops.push(drop);
      }
      return drops;
    }
    return [];
  }

  // Crafted items
  addCraftedItem(itemName) {
    this.craftedItems.push(itemName);
  }

  getCraftedItems() {
    return this.craftedItems;
  }

  // Reset game
  reset() {
    this.currentScreen = 'home';
    this.inventory = [];
    this.completedRequests = [];
    this.currentEnemy = null;
    this.playerHP = this.playerMaxHP;
    this.battleLog = [];
    this.craftedItems = [];
    this.loadInitialInventory();
  }
}

// Create global game state instance
const gameState = new GameState();
