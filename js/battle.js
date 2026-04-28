const BattleSystem = {
    playerHp: 100,
    playerMaxHp: 100,
    currentEnemy: null,
    isDefending: false,
    battleActive: false,

    startBattle() {
        this.currentEnemy = GameData.getRandomEnemy();
        this.playerHp = this.playerMaxHp;
        this.isDefending = false;
        this.battleActive = true;
        this.updateDisplay();
    },

    playerAttack() {
        if (!this.battleActive) return;
        
        const damage = Math.floor(Math.random() * 15) + 10;
        this.currentEnemy.hp -= damage;
        this.addBattleMessage(`攻撃！${damage}のダメージを与えた。`);

        if (this.currentEnemy.hp <= 0) {
            this.battleWin();
        } else {
            this.isDefending = false;
            setTimeout(() => this.enemyAttack(), 800);
        }
        this.updateDisplay();
    },

    playerDefend() {
        if (!this.battleActive) return;
        
        this.isDefending = true;
        this.addBattleMessage('防御態勢に入った！ダメージが軽減される。');
        setTimeout(() => this.enemyAttack(), 800);
    },

    playerEscape() {
        if (!this.battleActive) return;
        
        const escapeChance = Math.random();
        if (escapeChance > 0.3) {
            this.addBattleMessage('逃げ出した！');
            this.battleActive = false;
            this.currentEnemy = null;
        } else {
            this.addBattleMessage('逃げられなかった！');
            setTimeout(() => this.enemyAttack(), 800);
        }
        this.updateDisplay();
    },

    enemyAttack() {
        if (!this.battleActive) return;
        
        let damage = Math.floor(Math.random() * 12) + 5;
        if (this.isDefending) {
            damage = Math.floor(damage * 0.5);
            this.addBattleMessage(`${this.currentEnemy.name}の攻撃！防御により${damage}のダメージを受けた。`);
        } else {
            this.addBattleMessage(`${this.currentEnemy.name}の攻撃！${damage}のダメージを受けた。`);
        }
        
        this.playerHp -= damage;
        this.isDefending = false;

        if (this.playerHp <= 0) {
            this.battleLose();
        }
        this.updateDisplay();
    },

    battleWin() {
        this.battleActive = false;
        this.addBattleMessage(`${this.currentEnemy.name}を倒した！`);
        
        // ドロップ素材を取得
        const dropIndex = Math.floor(Math.random() * this.currentEnemy.dropMaterials.length);
        const dropMaterialId = this.currentEnemy.dropMaterials[dropIndex];
        GameState.addMaterial(dropMaterialId, 1);
        
        const dropMaterial = GameData.getMaterialById(dropMaterialId);
        this.addBattleMessage(`${dropMaterial.name}を獲得した！`);
        this.updateDisplay();
    },

    battleLose() {
        this.battleActive = false;
        this.addBattleMessage('ゲームオーバー...ステーションに戻った。');
        this.playerHp = this.playerMaxHp;
        this.updateDisplay();
    },

    addBattleMessage(message) {
        const messageEl = document.getElementById('battle-message');
        messageEl.innerHTML = messageEl.innerHTML + '<br>' + message;
        const battleLog = document.querySelector('.battle-log');
        battleLog.scrollTop = battleLog.scrollHeight;
    },

    updateDisplay() {
        const playerHpFill = document.getElementById('player-hp-fill');
        const playerHpText = document.getElementById('player-hp-text');
        const enemyHpFill = document.getElementById('enemy-hp-fill');
        const enemyHpText = document.getElementById('enemy-hp-text');
        const enemyName = document.getElementById('enemy-name');

        const playerPercent = (this.playerHp / this.playerMaxHp) * 100;
        playerHpFill.style.width = playerPercent + '%';
        playerHpText.textContent = `HP: ${this.playerHp}/${this.playerMaxHp}`;

        if (this.currentEnemy) {
            const enemyPercent = (this.currentEnemy.hp / GameData.getEnemyById(this.currentEnemy.id).hp) * 100;
            enemyHpFill.style.width = Math.max(0, enemyPercent) + '%';
            enemyHpText.textContent = `HP: ${Math.max(0, this.currentEnemy.hp)}/${GameData.getEnemyById(this.currentEnemy.id).hp}`;
            enemyName.textContent = this.currentEnemy.name;
        }
    }
};
