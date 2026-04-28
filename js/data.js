// Master data for the cyberpunk alchemy game

const GAME_DATA = {
  // Material attributes
  ELEMENTS: {
    FIRE: 'fire',
    WATER: 'water',
    LIGHTNING: 'lightning',
    ICE: 'ice',
    VOID: 'void'
  },

  QUALITIES: {
    PURE: 'pure',
    CONTAMINATED: 'contaminated',
    STABLE: 'stable',
    UNSTABLE: 'unstable'
  },

  // Materials (素材)
  MATERIALS: [
    { id: 'fusion-cell', name: 'Nuclear Fusion Cell', element: 'fire', quality: 'pure', desc: '高温プラズマを放つ核融合エネルギー源' },
    { id: 'cryo-gel', name: 'Cryo-Gel', element: 'ice', quality: 'stable', desc: '極低温凍結ジェル、安定した冷却能力' },
    { id: 'plasma-core', name: 'Plasma Core', element: 'fire', quality: 'unstable', desc: '不安定なプラズマコア、扱い危険' },
    { id: 'synth-polymer', name: 'Synthetic Polymer', element: 'void', quality: 'pure', desc: 'ナノ合成ポリマー、多用途素材' },
    { id: 'neural-fluid', name: 'Neural Fluid', element: 'water', quality: 'contaminated', desc: 'AI脳髄液、汚染されている' },
    { id: 'titanium-alloy', name: 'Titanium Alloy', element: 'void', quality: 'stable', desc: '高強度チタン合金' },
    { id: 'nanotech-chip', name: 'Nanotech Chip', element: 'lightning', quality: 'pure', desc: '高度な量子ナノチップ' },
    { id: 'bioluminous-vial', name: 'Bioluminous Vial', element: 'water', quality: 'pure', desc: '生物発光体を封入したバイアル' },
    { id: 'corrupted-data-shard', name: 'Corrupted Data Shard', element: 'lightning', quality: 'contaminated', desc: 'ハッキングされたデータシャード' },
    { id: 'void-catalyst', name: 'Void Catalyst', element: 'void', quality: 'unstable', desc: '虚の触媒、予測不可能な効果' }
  ],

  // Recipes (レシピ)
  RECIPES: [
    {
      id: 'nano-blade',
      name: 'ナノブレード',
      materials: ['nanotech-chip', 'titanium-alloy', 'fusion-cell'],
      elementRequirement: 'fire',
      qualityRequirement: 'pure',
      product: 'Nano Blade',
      desc: '切れ味抜群のナノサイズの刃'
    },
    {
      id: 'cryo-bomb',
      name: 'クライオボム',
      materials: ['cryo-gel', 'plasma-core', 'synth-polymer'],
      elementRequirement: 'ice',
      qualityRequirement: 'stable',
      product: 'Cryo Bomb',
      desc: '極低温爆発を起こす冷却爆弾'
    },
    {
      id: 'neural-virus',
      name: 'ニューラルウイルス',
      materials: ['neural-fluid', 'corrupted-data-shard', 'nanotech-chip'],
      elementRequirement: 'lightning',
      qualityRequirement: 'contaminated',
      product: 'Neural Virus',
      desc: 'AIシステムへの攻撃プログラム'
    },
    {
      id: 'void-shield',
      name: 'ボイドシールド',
      materials: ['void-catalyst', 'titanium-alloy', 'synth-polymer'],
      elementRequirement: 'void',
      qualityRequirement: 'pure',
      product: 'Void Shield',
      desc: '虚の力で物理攻撃を無効化する盾'
    },
    {
      id: 'plasma-torch',
      name: 'プラズマトーチ',
      materials: ['fusion-cell', 'plasma-core', 'nanotech-chip'],
      elementRequirement: 'fire',
      qualityRequirement: 'unstable',
      product: 'Plasma Torch',
      desc: '高温プラズマの火炎放射器'
    }
  ],

  // Enemies (敵)
  ENEMIES: [
    {
      id: 'rogue-drone',
      name: 'Rogue Security Drone',
      hp: 30,
      attack: 8,
      drops: ['synth-polymer', 'titanium-alloy', 'nanotech-chip'],
      desc: '暴走した警備ドローン'
    },
    {
      id: 'corrupted-ai',
      name: 'Corrupted AI Unit',
      hp: 50,
      attack: 12,
      drops: ['corrupted-data-shard', 'neural-fluid', 'nanotech-chip'],
      desc: '破損したAI制御ユニット'
    },
    {
      id: 'void-entity',
      name: 'Void Entity',
      hp: 40,
      attack: 15,
      drops: ['void-catalyst', 'plasma-core', 'synth-polymer'],
      desc: '虚の次元から迷い込んだ存在'
    },
    {
      id: 'plasma-mutant',
      name: 'Plasma Mutant',
      hp: 35,
      attack: 11,
      drops: ['fusion-cell', 'plasma-core', 'bioluminous-vial'],
      desc: 'プラズマ放射線の被曝者'
    },
    {
      id: 'hades-guard',
      name: 'Hades Guard Robot',
      hp: 60,
      attack: 13,
      drops: ['titanium-alloy', 'nanotech-chip', 'corrupted-data-shard'],
      desc: 'ハデス駅舎の警備ロボット'
    }
  ],

  // Requests (依頼)
  REQUESTS: [
    {
      id: 'request-1',
      title: '警備ドローン撃破用武器製造',
      description: 'ナノブレードを納めてほしい',
      requiredProduct: 'Nano Blade',
      reward: { exp: 100, materials: ['fusion-cell', 'synth-polymer'] },
      completed: false
    },
    {
      id: 'request-2',
      title: '冷却爆弾製造依頼',
      description: 'クライオボムを納めてほしい',
      requiredProduct: 'Cryo Bomb',
      reward: { exp: 120, materials: ['cryo-gel', 'plasma-core'] },
      completed: false
    },
    {
      id: 'request-3',
      title: 'AI破壊プログラム開発',
      description: 'ニューラルウイルスを納めてほしい',
      requiredProduct: 'Neural Virus',
      reward: { exp: 150, materials: ['neural-fluid', 'nanotech-chip'] },
      completed: false
    }
  ],

  // Initial inventory
  INITIAL_INVENTORY: [
    { materialId: 'fusion-cell', quantity: 2, proficiency: 0 },
    { materialId: 'synth-polymer', quantity: 3, proficiency: 0 },
    { materialId: 'titanium-alloy', quantity: 2, proficiency: 0 },
    { materialId: 'cryo-gel', quantity: 1, proficiency: 0 }
  ]
};
