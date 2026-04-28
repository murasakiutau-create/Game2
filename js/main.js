// Main game logic and screen management

function showScreen(screenName) {
  // Hide all screens
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });

  // Show selected screen
  const targetScreen = document.getElementById(screenName + '-screen');
  if (targetScreen) {
    targetScreen.classList.add('active');
    gameState.currentScreen = screenName;

    // Update screen content based on type
    if (screenName === 'requests') {
      updateRequestsList();
    } else if (screenName === 'inventory') {
      updateInventoryList();
    } else if (screenName === 'crafting') {
      updateCraftingScreen();
    } else if (screenName === 'battle') {
      updateBattleScreen();
    } else if (screenName === 'save-load') {
      updateSaveLoadScreen();
    }
  }
}

function showMessage(text) {
  const messageBox = document.getElementById('message-box');
  const messageContent = document.getElementById('message-content');
  messageContent.textContent = text;
  messageBox.classList.remove('hidden');
}

function closeMessage() {
  const messageBox = document.getElementById('message-box');
  messageBox.classList.add('hidden');
}

// Requests Screen
function updateRequestsList() {
  const container = document.getElementById('requests-list');
  container.innerHTML = '';

  GAME_DATA.REQUESTS.forEach(request => {
    const div = document.createElement('div');
    div.className = 'request-item';
    if (gameState.isRequestCompleted(request.id)) {
      div.classList.add('completed');
    }

    const html = `
      <div class="request-title">${request.title}</div>
      <div class="request-desc">${request.description}</div>
      <div style="color: #00ff00; font-size: 12px; margin: 8px 0;">
        Required: ${request.requiredProduct}
      </div>
      ${gameState.isRequestCompleted(request.id)
        ? '<div style="color: #666;">COMPLETED</div>'
        : `<button class="btn-small" onclick="submitRequest('${request.id}', '${request.requiredProduct}')">[ SUBMIT ]</button>`
      }
    `;

    div.innerHTML = html;
    container.appendChild(div);
  });
}

function submitRequest(requestId, requiredProduct) {
  // Check if player has crafted the required product
  const hasCrafted = gameState.craftedItems.some(item => item.name === requiredProduct);

  if (!hasCrafted) {
    showMessage(`You don't have ${requiredProduct}. Craft it first!`);
    return;
  }

  if (gameState.completeRequest(requestId)) {
    showMessage('Request completed! Reward received.');
    updateRequestsList();
  } else {
    showMessage('Request already completed.');
  }
}

// Inventory Screen
function updateInventoryList() {
  const container = document.getElementById('inventory-list');
  container.innerHTML = '';

  if (gameState.inventory.length === 0) {
    container.innerHTML = '<div class="list-item">No materials in inventory</div>';
  } else {
    gameState.inventory.forEach(inv => {
      const material = gameState.getMaterial(inv.materialId);
      const div = document.createElement('div');
      div.className = 'list-item';

      const profLevel = proficiencySystem.getDisplayProficiency(inv.proficiency);
      const html = `
        <div class="list-item-title">${material.name}</div>
        <div class="list-item-desc">Quantity: ${inv.quantity}</div>
        <div class="list-item-desc">Proficiency: ${profLevel}</div>
        <div class="list-item-desc" style="color: #ffff00;">Element: ${material.element}</div>
      `;

      div.innerHTML = html;
      container.appendChild(div);
    });
  }

  // Show crafted items
  const craftedSection = document.getElementById('crafted-items');
  craftedSection.innerHTML = '<div class="crafted-title">CRAFTED ITEMS</div>';

  if (gameState.craftedItems.length === 0) {
    craftedSection.innerHTML += '<div class="list-item">No crafted items yet</div>';
  } else {
    const list = document.createElement('div');
    gameState.craftedItems.forEach((item, idx) => {
      const div = document.createElement('div');
      div.className = 'list-item';
      div.innerHTML = `
        <div class="list-item-title">${idx + 1}. ${item.name}</div>
        <div class="list-item-desc">Quality: ${item.quality}</div>
      `;
      list.appendChild(div);
    });
    craftedSection.appendChild(list);
  }
}

// Crafting Screen
function updateCraftingScreen() {
  const recipesList = document.getElementById('recipes-list');
  const detailsPanel = document.getElementById('crafting-details');

  recipesList.innerHTML = '';
  detailsPanel.innerHTML = '<div style="color: #00ff00;">Select a recipe</div>';

  GAME_DATA.RECIPES.forEach(recipe => {
    const div = document.createElement('div');
    div.className = 'recipe-item';
    div.innerHTML = `
      <div class="recipe-name">${recipe.name}</div>
      <div class="recipe-product">→ ${recipe.product}</div>
    `;
    div.onclick = () => showRecipeDetails(recipe);
    recipesList.appendChild(div);
  });
}

function showRecipeDetails(recipe) {
  const detailsPanel = document.getElementById('crafting-details');
  detailsPanel.innerHTML = '';

  const div = document.createElement('div');
  let html = `
    <div style="color: #ff00ff; font-weight: bold; margin-bottom: 10px;">${recipe.product}</div>
    <div style="color: #00ff00; font-size: 12px; margin-bottom: 10px;">${recipe.desc}</div>
    <div style="border-top: 1px solid #00ff00; padding-top: 10px; margin-bottom: 10px;">
      <div style="color: #ff00ff; margin-bottom: 5px;">Requirements:</div>
      <div style="color: #00ff00; font-size: 12px;">Element: ${recipe.elementRequirement}</div>
      <div style="color: #00ff00; font-size: 12px;">Quality: ${recipe.qualityRequirement}</div>
    </div>
    <div style="color: #ff00ff; margin-bottom: 5px;">Select Materials:</div>
    <div class="materials-grid">
  `;

  recipe.materials.forEach((_, idx) => {
    const matList = gameState.inventory.map(inv => gameState.getMaterial(inv.materialId))
      .filter(m => m !== null);

    if (idx === 0) {
      html += '<div style="grid-column: 1/-1; color: #ffff00; font-size: 11px;">Choose ' + recipe.materials.length + ' materials</div>';
    }

    html += '<div class="material-checkbox">';
    html += '<input type="checkbox" id="material-' + idx + '" onchange="updateCraftingDisplay(\'' + recipe.id + '\')">';
    html += '<label for="material-' + idx + '">Select material</label>';
    html += '</div>';
  });

  html += `
    </div>
    <button class="btn-small" onclick="executeCraft('${recipe.id}')">[ CRAFT ]</button>
  `;

  div.innerHTML = html;
  detailsPanel.appendChild(div);

  // Populate material options
  const checkboxes = detailsPanel.querySelectorAll('input[type="checkbox"]');
  const materials = gameState.inventory.map(inv => gameState.getMaterial(inv.materialId));

  checkboxes.forEach((cb, idx) => {
    const label = cb.nextElementSibling;
    if (idx < materials.length) {
      label.textContent = materials[idx].name;
      cb.dataset.materialId = materials[idx].id;
    }
  });
}

function updateCraftingDisplay(recipeId) {
  // This can be extended for real-time validation
}

function executeCraft(recipeId) {
  const recipe = GAME_DATA.RECIPES.find(r => r.id === recipeId);
  const detailsPanel = document.getElementById('crafting-details');
  const checkboxes = detailsPanel.querySelectorAll('input[type="checkbox"]:checked');

  const selectedMaterials = Array.from(checkboxes).map(cb => cb.dataset.materialId);

  const result = craftingSystem.craft(recipeId, selectedMaterials);

  if (result.success) {
    showMessage(`✓ Crafted ${result.product.name}! (${result.product.quality})`);
    updateCraftingScreen();
  } else {
    showMessage(`✗ Crafting failed: ${result.error}`);
  }
}

// Battle Screen
function updateBattleScreen() {
  const container = document.getElementById('battle-commands');

  if (!battleSystem.isBattleActive()) {
    container.innerHTML = '';
    const enemiesList = document.createElement('div');
    enemiesList.style.display = 'grid';
    enemiesList.style.gap = '10px';

    GAME_DATA.ENEMIES.forEach(enemy => {
      const btn = document.createElement('button');
      btn.className = 'btn-small';
      btn.style.width = '100%';
      btn.textContent = `[ ${enemy.name} - HP: ${enemy.hp} ]`;
      btn.onclick = () => startBattle(enemy.id);
      enemiesList.appendChild(btn);
    });

    container.appendChild(enemiesList);
  } else {
    updateBattleUI();
  }
}

function startBattle(enemyId) {
  if (battleSystem.startBattle(enemyId)) {
    updateBattleUI();
  }
}

function updateBattleUI() {
  const enemyInfo = battleSystem.getEnemyInfo();
  const playerInfo = battleSystem.getPlayerInfo();

  if (!enemyInfo) return;

  // Update enemy name and HP
  document.getElementById('enemy-name').textContent = enemyInfo.name;
  const enemyHPPercent = (enemyInfo.hp / enemyInfo.maxHP) * 100;
  document.getElementById('enemy-hp').innerHTML = `
    <div class="hp-fill" style="width: ${enemyHPPercent}%;">
      ${enemyInfo.hp}/${enemyInfo.maxHP}
    </div>
  `;

  // Update player HP
  const playerHPPercent = (playerInfo.hp / playerInfo.maxHP) * 100;
  document.getElementById('player-hp').innerHTML = `
    <div class="hp-fill" style="width: ${playerHPPercent}%;">
      ${playerInfo.hp}/${playerInfo.maxHP}
    </div>
  `;

  // Update battle log
  const battleLog = document.getElementById('battle-log');
  battleLog.innerHTML = '';
  gameState.battleLog.slice(-10).forEach(entry => {
    const div = document.createElement('div');
    div.className = 'battle-log-entry ' + entry.type;
    div.textContent = entry.message;
    battleLog.appendChild(div);
  });
  battleLog.scrollTop = battleLog.scrollHeight;

  // Update commands
  const commands = document.getElementById('battle-commands');
  if (battleSystem.isBattleActive()) {
    commands.innerHTML = `
      <button class="btn-small" onclick="battleAttack()">[ ATTACK ]</button>
      <button class="btn-small" onclick="battleDefend()">[ DEFEND ]</button>
      <button class="btn-small" onclick="battleFlee()">[ FLEE ]</button>
      <button class="btn-small" onclick="battleSkip()">[ WAIT ]</button>
    `;
  }
}

function battleAttack() {
  const result = battleSystem.playerAttack();
  if (result.won) {
    document.getElementById('battle-back-btn').textContent = '[ CONTINUE ]';
    updateBattleUI();
  } else {
    updateBattleUI();
  }
}

function battleDefend() {
  const result = battleSystem.playerDefend();
  updateBattleUI();
}

function battleFlee() {
  const result = battleSystem.playerFlee();
  if (result.success) {
    showMessage('Successfully escaped from battle!');
    setTimeout(() => showScreen('home'), 1500);
  } else {
    updateBattleUI();
  }
}

function battleSkip() {
  battleSystem.isPlayerTurn = false;
  battleSystem.enemyTurn();
  updateBattleUI();
}

// Save/Load Screen
function updateSaveLoadScreen() {
  for (let i = 1; i <= 3; i++) {
    const info = document.getElementById(`slot-${i}-info`);
    if (saveSystem.hasSlot(i)) {
      info.textContent = 'Slot has data';
    } else {
      info.textContent = 'Empty';
    }
  }
}

function saveToSlot(slotNumber) {
  const success = saveSystem.saveSlot(slotNumber, gameState);
  if (success) {
    showMessage(`Game saved to slot ${slotNumber}`);
    updateSaveLoadScreen();
  } else {
    showMessage('Save failed!');
  }
}

function loadFromSlot(slotNumber) {
  const result = saveSystem.loadSlot(slotNumber, gameState);
  if (result.success) {
    showMessage(`Game loaded from slot ${slotNumber}`);
    updateSaveLoadScreen();
    showScreen('home');
  } else {
    showMessage(`Load failed: ${result.error}`);
  }
}

function toggleExport(slotNumber) {
  const exportData = saveSystem.exportSlot(slotNumber);
  if (!exportData) {
    showMessage('No data to export');
    return;
  }

  const exportSection = document.getElementById('export-section');
  const exportArea = document.getElementById('export-data');
  exportArea.textContent = exportData;
  exportSection.style.display = 'block';
}

function closeExport() {
  document.getElementById('export-section').style.display = 'none';
}

function copyToClipboard() {
  const exportArea = document.getElementById('export-data');
  exportArea.select();
  document.execCommand('copy');
  showMessage('Exported data copied to clipboard!');
}

function importFromText() {
  const importArea = document.getElementById('import-data');
  const encodedData = importArea.value.trim();

  if (!encodedData) {
    showMessage('Paste exported data first');
    return;
  }

  // Find an empty slot or ask user
  let targetSlot = 1;
  for (let i = 1; i <= 3; i++) {
    if (!saveSystem.hasSlot(i)) {
      targetSlot = i;
      break;
    }
  }

  const result = saveSystem.importSlot(targetSlot, encodedData);
  if (result.success) {
    showMessage(`Data imported to slot ${targetSlot}`);
    importArea.value = '';
    updateSaveLoadScreen();
  } else {
    showMessage(`Import failed: ${result.error}`);
  }
}

// Initialize game
window.addEventListener('DOMContentLoaded', () => {
  showScreen('home');
});
