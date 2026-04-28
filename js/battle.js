// Battle system logic

class BattleSystem {
  constructor() {
    this.isPlayerTurn = true;
    this.battleActive = false;
  }

  startBattle(enemyId) {
    const success = gameState.startBattle(enemyId);
    if (success) {
      this.isPlayerTurn = true;
      this.battleActive = true;
    }
    return success;
  }

  playerAttack() {
    if (!this.battleActive) return { damage: 0 };

    const damage = this.calculatePlayerDamage();
    const alive = gameState.enemyTakeDamage(damage);

    this.addBattleLog(`[PLAYER] Attack for ${damage} damage!`, 'player');

    if (!alive) {
      this.addBattleLog('[ENEMY] Defeated!', 'enemy');
      this.endBattle(true);
      return { damage, won: true };
    }

    this.isPlayerTurn = false;
    this.enemyTurn();

    return { damage, won: false };
  }

  playerDefend() {
    if (!this.battleActive) return {};

    this.addBattleLog('[PLAYER] Defending...', 'player');
    this.isPlayerTurn = false;
    this.enemyTurn(true);

    return { defended: true };
  }

  playerFlee() {
    if (!this.battleActive) return { success: false };

    const fleeChance = 0.4;
    if (Math.random() < fleeChance) {
      this.addBattleLog('[PLAYER] Escaped from battle!', 'player');
      this.endBattle(false);
      return { success: true };
    }

    this.addBattleLog('[PLAYER] Escape attempt failed!', 'player');
    this.isPlayerTurn = false;
    this.enemyTurn();

    return { success: false };
  }

  calculatePlayerDamage() {
    const baseDamage = 15;
    const randomVariance = Math.floor(Math.random() * 10) + 1;
    return baseDamage + randomVariance;
  }

  calculateEnemyDamage(defended = false) {
    let damage = gameState.currentEnemy.attack;
    const randomVariance = Math.floor(Math.random() * 8) + 1;
    damage += randomVariance;

    if (defended) {
      damage = Math.floor(damage / 2);
    }

    return damage;
  }

  enemyTurn(playerDefended = false) {
    const damage = this.calculateEnemyDamage(playerDefended);
    const alive = gameState.playerTakeDamage(damage);

    if (playerDefended) {
      this.addBattleLog(`[${gameState.currentEnemy.name}] Attack blocked! ${damage} damage`, 'enemy');
    } else {
      this.addBattleLog(`[${gameState.currentEnemy.name}] Attack for ${damage} damage!`, 'enemy');
    }

    if (!alive) {
      this.addBattleLog('[PLAYER] Defeated...', 'damage');
      this.endBattle(false);
    }

    this.isPlayerTurn = true;
  }

  addBattleLog(message, type = 'normal') {
    gameState.battleLog.push({ message, type, timestamp: Date.now() });
  }

  endBattle(won) {
    this.battleActive = false;
    const drops = gameState.endBattle(won);

    if (won) {
      let dropMessage = '[VICTORY] Materials obtained:';
      if (drops && drops.length > 0) {
        drops.forEach(drop => {
          const material = gameState.getMaterial(drop);
          dropMessage += ` ${material.name},`;
        });
        dropMessage = dropMessage.slice(0, -1);
      }
      this.addBattleLog(dropMessage, 'player');
    }

    return { won, drops };
  }

  isBattleActive() {
    return this.battleActive;
  }

  getEnemyInfo() {
    if (!gameState.currentEnemy) return null;
    return {
      name: gameState.currentEnemy.name,
      hp: gameState.currentEnemy.currentHP,
      maxHP: gameState.currentEnemy.hp,
      description: gameState.currentEnemy.desc
    };
  }

  getPlayerInfo() {
    return {
      hp: gameState.playerHP,
      maxHP: gameState.playerMaxHP
    };
  }
}

const battleSystem = new BattleSystem();
