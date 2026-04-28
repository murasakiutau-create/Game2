// Save system with anti-tamper protection

class SaveSystem {
  constructor() {
    this.slots = ['game_slot_1', 'game_slot_2', 'game_slot_3'];
  }

  serializeGameState(state) {
    return JSON.stringify({
      currentScreen: state.currentScreen,
      inventory: state.inventory,
      completedRequests: state.completedRequests,
      playerHP: state.playerHP,
      craftedItems: state.craftedItems
    });
  }

  deserializeGameState(data) {
    const parsed = JSON.parse(data);
    gameState.currentScreen = parsed.currentScreen;
    gameState.inventory = parsed.inventory;
    gameState.completedRequests = parsed.completedRequests;
    gameState.playerHP = parsed.playerHP;
    gameState.craftedItems = parsed.craftedItems;
  }

  saveSlot(slotNumber, state) {
    if (slotNumber < 1 || slotNumber > 3) return false;

    const serialized = this.serializeGameState(state);
    const checksum = CRC32.calculate(serialized);

    const saveData = {
      data: serialized,
      checksum: checksum,
      timestamp: new Date().toISOString()
    };

    try {
      localStorage.setItem(this.slots[slotNumber - 1], JSON.stringify(saveData));
      return true;
    } catch (e) {
      console.error('Save failed:', e);
      return false;
    }
  }

  loadSlot(slotNumber, state) {
    if (slotNumber < 1 || slotNumber > 3) return false;

    try {
      const saveData = localStorage.getItem(this.slots[slotNumber - 1]);
      if (!saveData) {
        return { success: false, error: 'No save in this slot' };
      }

      const parsed = JSON.parse(saveData);
      const { data, checksum } = parsed;

      // Verify checksum
      if (!CRC32.verify(data, checksum)) {
        return { success: false, error: 'Save data corrupted or tampered' };
      }

      this.deserializeGameState(data);
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Failed to load save: ' + e.message };
    }
  }

  exportSlot(slotNumber) {
    if (slotNumber < 1 || slotNumber > 3) return null;

    try {
      const saveData = localStorage.getItem(this.slots[slotNumber - 1]);
      if (!saveData) return null;

      // Encode to Base64 for easy copy-paste
      const encoded = btoa(unescape(encodeURIComponent(saveData)));
      return encoded;
    } catch (e) {
      console.error('Export failed:', e);
      return null;
    }
  }

  importSlot(slotNumber, encodedData) {
    if (slotNumber < 1 || slotNumber > 3) {
      return { success: false, error: 'Invalid slot number' };
    }

    try {
      // Decode from Base64
      const decoded = decodeURIComponent(escape(atob(encodedData)));
      const saveData = JSON.parse(decoded);
      const { data, checksum } = saveData;

      // Verify checksum
      if (!CRC32.verify(data, checksum)) {
        return { success: false, error: 'Imported data is corrupted or tampered' };
      }

      // Save to slot
      localStorage.setItem(this.slots[slotNumber - 1], decoded);
      this.deserializeGameState(data);

      return { success: true };
    } catch (e) {
      return { success: false, error: 'Invalid save data: ' + e.message };
    }
  }

  hasSlot(slotNumber) {
    if (slotNumber < 1 || slotNumber > 3) return false;
    return localStorage.getItem(this.slots[slotNumber - 1]) !== null;
  }

  deleteSlot(slotNumber) {
    if (slotNumber < 1 || slotNumber > 3) return false;
    localStorage.removeItem(this.slots[slotNumber - 1]);
    return true;
  }
}

const saveSystem = new SaveSystem();
