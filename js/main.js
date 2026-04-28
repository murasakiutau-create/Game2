function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');

    if (screenId === 'screen-quest') {
        renderQuestList();
    } else if (screenId === 'screen-crafting') {
        renderRecipeList();
    } else if (screenId === 'screen-inventory') {
        renderInventory();
    } else if (screenId === 'screen-battle') {
        if (!BattleSystem.battleActive) {
            BattleSystem.startBattle();
        }
        BattleSystem.updateDisplay();
    } else if (screenId === 'screen-save') {
        updateSaveInfo();
    }
}

// 依頼画面
function renderQuestList() {
    const questList = document.getElementById('quest-list');
    questList.innerHTML = '';

    GameData.quests.forEach(quest => {
        const completed = GameState.isQuestCompleted(quest.id);
        const itemCount = GameState.getItemCount(quest.requiredItem);
        const canComplete = itemCount >= quest.quantity;

        const questEl = document.createElement('div');
        questEl.className = 'quest-item';
        questEl.innerHTML = `
            <div class="quest-title">${quest.title}</div>
            <div class="quest-desc">${quest.description}</div>
            <div class="quest-status">
                ${completed ? '[完了]' : `必要: ${quest.requiredItem} x${quest.quantity} (所持: ${itemCount})`}
            </div>
            <div class="quest-reward">報酬: 素材 x${quest.reward.materials.length}個</div>
            ${!completed && canComplete ? `<button class="btn" onclick="completeQuest(${quest.id})">提出</button>` : ''}
        `;
        questList.appendChild(questEl);
    });
}

function completeQuest(questId) {
    const quest = GameData.getQuestById(questId);
    GameState.removeItem(quest.requiredItem, quest.quantity);
    GameState.completeQuest(questId);
    
    // 報酬素材を付与
    quest.reward.materials.forEach(materialId => {
        GameState.addMaterial(materialId, 1);
    });

    alert('依頼を完了しました！素材を獲得しました。');
    renderQuestList();
}

// 調合画面
function renderRecipeList() {
    const recipeList = document.getElementById('recipe-list');
    recipeList.innerHTML = '';

    GameData.recipes.forEach(recipe => {
        const recipeEl = document.createElement('div');
        recipeEl.className = 'recipe-item';
        recipeEl.innerHTML = recipe.name;
        recipeEl.onclick = () => {
            CraftingSystem.selectRecipe(recipe.id);
            renderRecipeDetail();
        };
        recipeList.appendChild(recipeEl);
    });
}

function renderRecipeDetail() {
    const recipe = CraftingSystem.selectedRecipe;
    const detail = document.getElementById('recipe-detail');
    
    if (!recipe) {
        detail.innerHTML = '<p>レシピを選択してください</p>';
        return;
    }

    let html = `
        <div class="recipe-detail-item">
            <div class="recipe-detail-label">レシピ名</div>
            <div class="recipe-detail-value">${recipe.name}</div>
        </div>
        <div class="recipe-detail-item">
            <div class="recipe-detail-label">説明</div>
            <div class="recipe-detail-value">${recipe.description}</div>
        </div>
        <div class="recipe-detail-item">
            <div class="recipe-detail-label">必要素材</div>
    `;

    const selectedMaterials = {};
    recipe.materials.forEach(req => {
        const material = GameData.getMaterialById(req.materialId);
        const count = GameState.getMaterialCount(req.materialId);
        const options = GameData.materials
            .filter(m => GameState.getMaterialCount(m.id) >= req.quantity)
            .map(m => `<option value="${m.id}">${m.name} (所持: ${GameState.getMaterialCount(m.id)})</option>`)
            .join('');
        
        html += `
            <div class="material-row">
                <span>${material.name} x${req.quantity}</span>
                <select id="material-${req.materialId}" class="material-select">
                    <option value="">選択...</option>
                    ${options}
                </select>
            </div>
        `;
    });

    html += `
        </div>
        <div class="recipe-detail-item">
            <div class="recipe-detail-label">生成アイテム</div>
            <div class="recipe-detail-value">${recipe.result}</div>
        </div>
        <button class="craft-button" onclick="executeCraft()">調合実行</button>
    `;

    detail.innerHTML = html;
}

function executeCraft() {
    const recipe = CraftingSystem.selectedRecipe;
    const selectedMaterials = {};

    recipe.materials.forEach(req => {
        const select = document.getElementById(`material-${req.materialId}`);
        if (select.value) {
            selectedMaterials[req.materialId] = parseInt(select.value);
        }
    });

    if (CraftingSystem.craft(selectedMaterials)) {
        renderRecipeList();
        renderRecipeDetail();
    }
}

// 素材管理画面
function renderInventory() {
    const inventory = document.getElementById('inventory-list');
    inventory.innerHTML = '';

    const materials = GameState.getAllMaterials();
    
    if (materials.length === 0) {
        inventory.innerHTML = '<p>素材がありません</p>';
        return;
    }

    materials.forEach(mat => {
        const material = GameData.getMaterialById(mat.id);
        const proficiency = GameState.getProficiency(mat.id);
        const proficiencyPercent = proficiency;

        const itemEl = document.createElement('div');
        itemEl.className = 'inventory-item';
        itemEl.innerHTML = `
            <div class="item-name">${material.name}</div>
            <div class="item-count">所持: ${mat.count}個</div>
            <div class="item-proficiency">熟練度: ${proficiency}/100</div>
            <div class="proficiency-bar">
                <div class="proficiency-fill" style="width: ${proficiencyPercent}%"></div>
            </div>
            <div class="item-attributes">
                <span class="attribute-tag">属性: ${material.element}</span>
                <span class="attribute-tag">品質: ${material.quality}</span>
            </div>
        `;
        inventory.appendChild(itemEl);
    });

    // アイテム欄
    const itemsHtml = '<hr style="border-color: #FF00FF; margin: 20px 0;"><h3 style="color: #FF00FF; margin: 15px 0;">完成アイテム</h3>';
    inventory.innerHTML += itemsHtml;

    GameState.items.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'inventory-item';
        itemEl.innerHTML = `
            <div class="item-name">${item.name}</div>
            <div class="item-count">個数: ${item.count}個</div>
        `;
        inventory.appendChild(itemEl);
    });
}

// バトル画面
function playerAttack() {
    BattleSystem.playerAttack();
}

function playerDefend() {
    BattleSystem.playerDefend();
}

function playerEscape() {
    BattleSystem.playerEscape();
}

// セーブ/ロード画面
function updateSaveInfo() {
    for (let i = 1; i <= 3; i++) {
        const info = SaveSystem.getSaveInfo(i);
        const infoEl = document.getElementById(`slot-${i}-info`);
        infoEl.textContent = info ? info : '空';
    }
}

function quickSave(slotNumber) {
    SaveSystem.save(slotNumber);
    alert(`スロット ${slotNumber} にセーブしました`);
    updateSaveInfo();
}

function quickLoad(slotNumber) {
    if (SaveSystem.load(slotNumber)) {
        alert(`スロット ${slotNumber} からロードしました`);
        updateSaveInfo();
    }
}

function exportCurrentData() {
    const exported = SaveSystem.exportData();
    document.getElementById('export-data').value = exported;
}

function copyToClipboard() {
    const textarea = document.getElementById('export-data');
    textarea.select();
    document.execCommand('copy');
    alert('クリップボードにコピーしました');
}

function importData() {
    const imported = document.getElementById('import-data').value;
    if (imported.trim() === '') {
        alert('データを入力してください');
        return;
    }
    if (SaveSystem.importData(imported)) {
        updateSaveInfo();
    }
}

// ゲーム開始
window.onload = function() {
    GameState.init();
    showScreen('screen-home');
};
