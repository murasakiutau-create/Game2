const GameData = {
    // 素材マスター
    materials: [
        { id: 1, name: '核融合セル', element: '火', quality: '純度', description: 'エネルギー源となる基本素材' },
        { id: 2, name: 'プラズマコア', element: '火', quality: '純度', description: '高温のプラズマを封閉' },
        { id: 3, name: 'アイスクリスタル', element: '水', quality: '純度', description: '凍結した深宇宙の氷' },
        { id: 4, name: 'ニューロジェル', element: '水', quality: '安定', description: 'AI用の神経ジェル' },
        { id: 5, name: '雷石', element: '雷', quality: '純度', description: '帯電した隕石の破片' },
        { id: 6, name: 'サイバーチップ', element: '雷', quality: '汚染', description: '古い制御回路' },
        { id: 7, name: 'ナノペイント', element: '虚', quality: '不安定', description: '存在感の薄い塗料' },
        { id: 8, name: 'メモリクリスタル', element: '虚', quality: '安定', description: 'データを保存するクリスタル' },
        { id: 9, name: 'チタニウム合金', element: 'メタル', quality: '純度', description: '高強度のメタル' },
        { id: 10, name: 'ポリマーフィルム', element: 'メタル', quality: '汚染', description: 'リサイクル素材' }
    ],

    // レシピマスター
    recipes: [
        {
            id: 1,
            name: '火の鎮静剤',
            description: '火属性を抑制する調合品',
            materials: [
                { materialId: 1, required: true, quantity: 2 },
                { materialId: 3, required: true, quantity: 1 }
            ],
            result: '火の鎮静剤'
        },
        {
            id: 2,
            name: 'アイスバリア',
            description: '氷の防壁を展開',
            materials: [
                { materialId: 3, required: true, quantity: 2 },
                { materialId: 4, required: true, quantity: 1 }
            ],
            result: 'アイスバリア'
        },
        {
            id: 3,
            name: 'エネルギー弾',
            description: '雷属性の攻撃アイテム',
            materials: [
                { materialId: 1, required: true, quantity: 1 },
                { materialId: 5, required: true, quantity: 2 }
            ],
            result: 'エネルギー弾'
        },
        {
            id: 4,
            name: 'スーパーコンピュータ',
            description: '複雑な計算を行う装置',
            materials: [
                { materialId: 6, required: true, quantity: 2 },
                { materialId: 8, required: true, quantity: 1 },
                { materialId: 9, required: true, quantity: 1 }
            ],
            result: 'スーパーコンピュータ'
        },
        {
            id: 5,
            name: 'ハイブリッドコア',
            description: 'あらゆる属性を兼ねた融合素材',
            materials: [
                { materialId: 1, required: true, quantity: 1 },
                { materialId: 3, required: true, quantity: 1 },
                { materialId: 5, required: true, quantity: 1 },
                { materialId: 8, required: true, quantity: 1 }
            ],
            result: 'ハイブリッドコア'
        }
    ],

    // 敵マスター
    enemies: [
        {
            id: 1,
            name: 'スコーピオンドローン',
            hp: 30,
            attack: 8,
            dropMaterials: [1, 2, 6]
        },
        {
            id: 2,
            name: 'フローズンセンチネル',
            hp: 25,
            attack: 6,
            dropMaterials: [3, 4, 10]
        },
        {
            id: 3,
            name: 'ラッシュプロトタイプ',
            hp: 35,
            attack: 10,
            dropMaterials: [5, 6, 9]
        },
        {
            id: 4,
            name: 'エコープレイ',
            hp: 20,
            attack: 5,
            dropMaterials: [7, 8, 4]
        }
    ],

    // 依頼マスター
    quests: [
        {
            id: 1,
            title: 'エネルギー供給',
            description: 'ステーション内のエネルギーが不足しています。火の鎮静剤を1個用意してください。',
            requiredItem: '火の鎮静剤',
            quantity: 1,
            reward: { materials: [1, 2] }
        },
        {
            id: 2,
            title: '温度管理',
            description: '冷却室の温度が上昇しています。アイスバリアを1個提供してください。',
            requiredItem: 'アイスバリア',
            quantity: 1,
            reward: { materials: [3, 4] }
        },
        {
            id: 3,
            title: 'システム修復',
            description: 'メインシステムが故障しました。スーパーコンピュータを1個用意してください。',
            requiredItem: 'スーパーコンピュータ',
            quantity: 1,
            reward: { materials: [5, 6, 9] }
        }
    ],

    // 初期素材
    initialMaterials: {
        1: { count: 3, proficiency: 0 },
        2: { count: 2, proficiency: 0 },
        3: { count: 2, proficiency: 0 },
        4: { count: 1, proficiency: 0 },
        5: { count: 2, proficiency: 0 },
        8: { count: 1, proficiency: 0 }
    },

    getMaterialById(id) {
        return this.materials.find(m => m.id === id);
    },

    getRecipeById(id) {
        return this.recipes.find(r => r.id === id);
    },

    getEnemyById(id) {
        return this.enemies.find(e => e.id === id);
    },

    getQuestById(id) {
        return this.quests.find(q => q.id === id);
    },

    getRandomEnemy() {
        return this.enemies[Math.floor(Math.random() * this.enemies.length)];
    }
};
