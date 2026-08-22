(() => {
  'use strict';

  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  let W = 960;
  let H = 640;
  const TAU = Math.PI * 2;

  const els = {
    shell: document.getElementById('shell'),
    timeValue: document.getElementById('timeValue'),
    hpFill: document.getElementById('hpFill'),
    fpsValue: document.getElementById('fpsValue'),
    hpValue: document.getElementById('hpValue'),
    levelValue: document.getElementById('levelValue'),
    xpFill: document.getElementById('xpFill'),
    xpValue: document.getElementById('xpValue'),
    damageValue: document.getElementById('damageValue'),
    critValue: document.getElementById('critValue'),
    critDamageValue: document.getElementById('critDamageValue'),
    scoreValue: document.getElementById('scoreValue'),
    waveValue: document.getElementById('waveValue'),
    comboStat: document.getElementById('comboStat'),
    comboValue: document.getElementById('comboValue'),
    logList: document.getElementById('logList'),
    overlay: document.getElementById('overlay'),
    overlayTitle: document.getElementById('overlayTitle'),
    overlayStats: document.getElementById('overlayStats'),
    resumeBtn: document.getElementById('resumeBtn'),
    victorySettleBtn: document.getElementById('victorySettleBtn'),
    continueEndlessBtn: document.getElementById('continueEndlessBtn'),
    restartBtn: document.getElementById('restartBtn'),
    menuBtn: document.getElementById('menuBtn'),
    bombBtn: document.getElementById('bombBtn'),
    dashBtn: document.getElementById('dashBtn'),
    dashBtnCount: document.getElementById('dashBtnCount'),
    soundBtn: document.getElementById('soundBtn'),
    soundIcon: document.getElementById('soundIcon'),
    pauseBtn: document.getElementById('pauseBtn'),
    pauseIcon: document.getElementById('pauseIcon'),
    settleBtn: document.getElementById('settleBtn'),
    ultBtn: document.getElementById('ultBtn'),
    levelUpOverlay: document.getElementById('levelUpOverlay'),
    levelUpTitle: document.getElementById('levelUpTitle'),
    upgradeChoices: document.getElementById('upgradeChoices'),
    bossRewardOverlay: document.getElementById('bossRewardOverlay'),
    bossRewardTitle: document.getElementById('bossRewardTitle'),
    bossRewardChoices: document.getElementById('bossRewardChoices'),
    bossRewardPreview: document.getElementById('bossRewardPreview'),
    bossSelfSelectOverlay: document.getElementById('bossSelfSelectOverlay'),
    bossSelfSelectList: document.getElementById('bossSelfSelectList'),
    contractSection: document.getElementById('contractSection'),
    contractList: document.getElementById('contractList'),
    checkpointToast: document.getElementById('checkpointToast'),
    mainMenu: document.getElementById('mainMenu'),
    metaPointsValue: document.getElementById('metaPointsValue'),
    rewardPointsValue: document.getElementById('rewardPointsValue'),
    talentTreeBtn: document.getElementById('talentTreeBtn'),
    talentTreeOverlay: document.getElementById('talentTreeOverlay'),
    talentTreeCloseBtn: document.getElementById('talentTreeCloseBtn'),
    talentTreeResetBtn: document.getElementById('talentTreeResetBtn'),
    encyclopediaBtn: document.getElementById('encyclopediaBtn'),
    encyclopediaOverlay: document.getElementById('encyclopediaOverlay'),
    encyclopediaCloseBtn: document.getElementById('encyclopediaCloseBtn'),
    encyclopediaSearch: document.getElementById('encyclopediaSearch'),
    encyclopediaTabs: document.getElementById('encyclopediaTabs'),
    encyclopediaList: document.getElementById('encyclopediaList'),
    encyclopediaCount: document.getElementById('encyclopediaCount'),
    tutorialBtn: document.getElementById('tutorialBtn'),
    tutorialOverlay: document.getElementById('tutorialOverlay'),
    tutorialCloseBtn: document.getElementById('tutorialCloseBtn'),
    firstSeenOverlay: document.getElementById('firstSeenOverlay'),
    firstSeenPreview: document.getElementById('firstSeenPreview'),
    firstSeenKicker: document.getElementById('firstSeenKicker'),
    firstSeenName: document.getElementById('firstSeenName'),
    firstSeenDesc: document.getElementById('firstSeenDesc'),
    firstSeenStats: document.getElementById('firstSeenStats'),
    firstSeenContinue: document.getElementById('firstSeenContinue'),
    treePointsValue: document.getElementById('treePointsValue'),
    treeMaxValue: document.getElementById('treeMaxValue'),
    metaList: document.getElementById('metaList'),
    skinList: document.getElementById('skinList'),
    buildList: document.getElementById('buildList'),
    buildSummary: document.getElementById('buildSummary'),
    affixList: document.getElementById('affixList'),
    affixSummary: document.getElementById('affixSummary'),
    affixAllBtn: document.getElementById('affixAllBtn'),
    startBtn: document.getElementById('startBtn'),
    dailyBtn: document.getElementById('dailyBtn'),
    dailyInfo: document.getElementById('dailyInfo'),
    dailyBadges: document.getElementById('dailyBadges'),
    battleSetupOverlay: document.getElementById('battleSetupOverlay'),
    setupBuildSummary: document.getElementById('setupBuildSummary'),
    battleSetupBackBtn: document.getElementById('battleSetupBackBtn'),
    battleSetupSkipBtn: document.getElementById('battleSetupSkipBtn'),
    battleSetupStartBtn: document.getElementById('battleSetupStartBtn'),
    bossWarning: document.getElementById('bossWarning'),
    bossWarningText: document.getElementById('bossWarningText'),
    bossWarningPreview: document.getElementById('bossWarningPreview'),
    bossBar: document.getElementById('bossBar'),
    bossLabel: document.querySelector('.boss-label'),
    bossFill: document.getElementById('bossFill'),
    bossValue: document.getElementById('bossValue'),
    gameHud: document.getElementById('gameHud'),
    hudCollapseBtn: document.getElementById('hudCollapseBtn'),
  };

  const BASE_DAMAGE_PER_LEVEL = 2;
  const ULT_MAX_ENERGY = 120;
  const ULT_AUTO_COOLDOWN = 40;
  const ULT_ENERGY_DIVISOR = 7;
  const HIT_INVULN = 0.6;
  const COMBO_WINDOW = 2.6;
  // 连杀反馈（2026-08-17）：里程碑 + 爆发多重击杀，克制式（非逐杀刷屏）
  const COMBO_MILESTONES = [10, 25, 50, 100];
  const COMBO_MILESTONE_COLORS = { 10: '#7fe7ff', 25: '#ffd166', 50: '#ff9e45', 100: '#ff6670' };
  const MULTI_KILL_WINDOW = 0.6;        // 多重击杀判定窗口（秒）
  const MULTI_KILL_TEXT = {
    3: { text: '三连杀！', color: '#ffd166', size: 18 },
    5: { text: '狂杀！', color: '#ff9e45', size: 22 },
    8: { text: '毁灭风暴！', color: '#ff6670', size: 26 },
  };
  // 经验光点吸入（2026-08-17）：击杀后小光点飞向机体，VS 式反馈环；有数量上限防刷屏
  const MAX_XP_ORBS = 28;
  const XP_ORB_SPEED = 460;
  const XP_ORB_LIFE = 4;
  // BOSS 击破慢动作（2026-08-17）：仅 BOSS 死亡瞬间短暂慢放
  const SLOWMO_BOSS_SCALE = 0.35;
  const SLOWMO_BOSS_DURATION = 0.8;
  const TARGET_FPS = 60;
  const FRAME_INTERVAL_MS = 1000 / TARGET_FPS;
  const MAX_PARTICLES = 280;
  const SHOW_HITBOX = new URLSearchParams(window.location.search).has('hitbox');
  const MAX_TEXTS = 28;
  const MAX_ENEMY_BULLETS = 720;
  const HUD_UPDATE_INTERVAL = 0.1;
  const PLAYER_MODEL_SCALE = 1.22;
  const PLAYER_SPRITE_SIZE = 96;
  const PLAYER_SPRITE_CENTER_X = 48;
  const PLAYER_SPRITE_CENTER_Y = 43;
  const PLAYER_SHOT_SPACING = 32;
  const PLAYER_SHOT_FAN = 0.025;
  const PLAYER_SCATTER_FAN = 0.12;
  const MAX_DRONES = 8;
  const DRONE_DAMAGE_SHARE = [0, 1, 0.95, 0.7333, 0.625, 0.54, 0.4833, 0.4286, 0.3875];
  const DRONE_HOMING_TURN = 3.8;
  // 浮游炮追踪弹寿命上限（秒）：追踪弹用 bolt 基础弹（life 1.5s，约 840px 射程），
  // 而锁定范围是全屏对角线 + 160px，二者不匹配会导致"锁了远敌、子弹半路消失"。
  // 这里按锁定范围反推所需寿命并留 1.2 倍转向余量，再封顶避免超大屏寿命爆炸。
  const DRONE_BULLET_LIFE_MAX = 3.5;
  const BULLET_SIZE_PER_LEVEL = 0.5;
  const MAX_AFFIX_LEVEL = 3;
  const TALENT_RESET_COST = 30;
  const BOSS_CORE_DURATION = 5;
  const BOSS_CORE_HITS = 3;
  const BOSS_PHASE_HP = [0.72, 0.42];
  // 狂暴期核心暴露窗口（方案 C，2026-08-16，奖励型）：狂暴后的 Boss 每 BOSS_RAGE_CORE_CYCLE 秒
  // 有 BOSS_RAGE_CORE_WINDOW 秒核心暴露，期间命中 Boss 伤害 ×BOSS_RAGE_CORE_BONUS（爆发奖励，鼓励
  // 抓窗口输出）。不做减伤惩罚——早期"护盾减伤"版与满词缀重型装甲叠加导致满词缀 175pt 8/8→2/8
  // 且高度依赖爆发 RNG，故改为纯奖励型（节奏由狂暴弹幕逼走位，而非减伤拖时间）。
  const BOSS_RAGE_CORE_BONUS = 1.5;
  const BOSS_RAGE_CORE_CYCLE = 5;
  const BOSS_RAGE_CORE_WINDOW = 1.8;
  const BOSS_HP_MULTIPLIER = 4;
  const BOSS_TOUGHNESS = 1.0;
  // 受击无敌缩短为 0.2s 后的容错补偿：同一轮 BOSS 弹幕互相更分开（减少每轮弹数、拉宽扇形/弧形），
  // 保留发射间隔不变。2026-08-14 按需求再扩大 30%（1.35 × 1.3 → 1.75）。
  const BOSS_VOLLEY_SPREAD = 1.75;
  // 狂暴状态弹幕密度额外分散：只在首领进入狂暴（enraged）时再除以该系数，非狂暴弹幕不受影响。
  // 玩家反馈狂暴弹幕密度仍偏高 → 2026-08-16 新增，值越大越稀疏。
  const BOSS_RAGE_SPREAD = 1.3;
  // 浮游炮追踪弹·曳光弹机制（2026-08-16）：画面中浮游炮子弹数超过阈值时，每 DRONE_TRACER_EVERY 发
  // 只完整渲染 1 发曳光弹，其余淡化（仅保留极淡尾迹），压下高射速弹幕的视觉杂乱。
  const DRONE_TRACER_THRESHOLD = 24;
  const DRONE_TRACER_EVERY = 3;
  // 核心质变（2026-08-17）：每局一次、改变打法的关键强化，与流派正交组合。
  // 三者都是"命中/击杀改变弹道行为"，加法/递减、带冷却或代数上限，避免指数膨胀与无限连锁。
  const CORE_TRANSFORM_WAVE = 3;        // 第 3 波触发核心质变三选一
  const ARC_CORE_HOPS = 3;              // 电弧核心：连锁跳跃次数
  const ARC_CORE_RANGE = 230;           // 电弧跳跃范围
  const ARC_CORE_COOLDOWN = 0.15;       // 电弧触发冷却（秒），防止高射速下电弧过载
  const ARC_CORE_DAMAGE = 0.5;          // 首跳伤害 = 命中子弹伤害 × 此值
  const ARC_CORE_DECAY = 0.8;           // 每跳伤害衰减
  const BLAST_CORE_RADIUS = 110;        // 爆裂核心：爆炸半径
  const BLAST_CORE_DEPTH = 4;           // 爆炸连锁最大代数
  const BLAST_CORE_DECAY = 0.7;         // 每代爆炸伤害衰减
  const BLAST_CORE_DAMAGE = 0.6;        // 爆炸基础伤害 = 主炮伤害 × 此值
  const RICOCHET_CORE_BOUNCES = 5;      // 弹射核心：最大弹射次数
  const RICOCHET_CORE_RANGE = 300;      // 弹射寻敌范围
  const RICOCHET_CORE_DECAY = 0.75;     // 每次弹射伤害衰减
  const RICOCHET_CORE_SPEED = 520;      // 弹射后弹速
  // 第二批核心质变（形态型，2026-08-17）
  const BEAM_TICK = 0.12;               // 光束核心：伤害 tick 间隔（秒）
  const BEAM_BASE_HALF_WIDTH = 26;      // 光束半宽基数（随弹列增宽；与收窄后的视觉宽度对齐）
  const BEAM_ROWS_WIDTH = 8;            // 每排弹列额外半宽
  const BEAM_DAMAGE_MUL = 1.2;          // 光束 tick 伤害 = 主炮伤害 × 此值（持续贯穿光束，略高于单发主炮）
  const MIRROR_COUNT = 2;               // 分身核心：镜像数量
  const MIRROR_DAMAGE_SHARE = 0.3;      // 每个镜像伤害 = 主炮伤害 × 此值
  const MIRROR_OFFSET = 46;             // 镜像与机体横向间距
  const OVERLOAD_DURATION = 4;          // 超载核心：持续（秒）
  const OVERLOAD_CYCLE = 16;            // 超载核心：周期（秒）
  const OVERLOAD_RATE_BONUS = 0.4;      // 超载射速加成
  const OVERLOAD_DMG_MUL = 1.2;         // 超载伤害倍率
  const OVERLOAD_SIZE_BONUS = 0.4;      // 超载子弹体积加成
  // 2026-08-14 可躲避性调整（保持 0.2s 无敌与判定/视觉一致）：
  // BOSS 基础弹速 ×0.7（-30%），基础发射频率 ×0.8（间隔 ×1.25，-20%）
  const BOSS_BULLET_SPEED_MUL = 0.7;
  const BOSS_FIRE_INTERVAL_MUL = 1.25;
  const DASH_COOLDOWN = 15;
  const DASH_DURATION = 0.35;
  const DASH_SPEED = 2.4;
  // 反击流·弹幕反弹：命中玩家的敌弹被反弹为追踪弹，命中敌人时对周围造成溅射伤害
  const COUNTER_REFLECT_SPEED = 480;
  const COUNTER_REFLECT_SPLASH = 170;
  const COUNTER_REFLECT_TARGET_HP_RATIO = 0.08;
  const GOLD_MODULE_CHANCE = 0.1;
  const BLADE_DAMAGE_RATIO = 0.35;
  const BLADE_HIT_COOLDOWN = 0.55;
  const ORBITAL_CLEAR_INTERVAL = 5;
  const ORBITAL_CLEAR_AMOUNT = 2;
  const ULT_INSTANT_HEAL_RATIO = 0.12;
  const ULT_REGEN_RATIO = 0.012;
  const ULT_REGEN_DURATION = 15;
  const MISSION_FINAL_WAVE = 10;
  const ABYSS_START_WAVE = 50;
  const WAVE_END_DELAY = 0.8;
  const BOSS_WARNING_DURATION = 2;
  const SPAWN_DELAY_SCALE = 0.85;
  const COMPLETION_REWARD_RATE = 0.2;
  const FIRST_CLEAR_REWARD_POINTS = 15;
  const ENDLESS_MILESTONE_REWARD_POINTS = 8;
  const ENDLESS_MILESTONE_INTERVAL = 5;
  const ENDLESS_HEALING_STEP = 0.03;
  const ENDLESS_HEALING_FLOOR = 0.65;
  const ENDLESS_HEALING_START_WAVE = MISSION_FINAL_WAVE + 1;

  // Tuning variants. `v0` is the shipped baseline; v1-v4 are balance harness
  // candidates that can be forced through `?variant=...`.
  const BALANCE_VARIANTS = {
    v0: {
      pressure: {
        hp: 1.6,
        bossHp: 0.26,
        damage: 0.6,
        speed: 0.45,
        fireRate: 0.6,
        bulletSpeed: 0.4,
        count: 0.15,
      },
    },
    v1: {
      pressure: {
        hp: 1.45,
        bossHp: 0.12,
        damage: 0.5,
        speed: 0.22,
        fireRate: 0.6,
        bulletSpeed: 0.32,
        count: 0.1,
      },
    },
    v2: {
      pressure: {
        hp: 1.15,
        bossHp: 0.1,
        damage: 0.4,
        speed: 0.16,
        fireRate: 0.48,
        bulletSpeed: 0.24,
        count: 0.08,
      },
    },
    v3: {
      pressure: {
        hp: 1.3,
        bossHp: 0.11,
        damage: 0.46,
        speed: 0.2,
        fireRate: 0.55,
        bulletSpeed: 0.28,
        count: 0.09,
      },
    },
    v4: {
      pressure: {
        hp: 1.3,
        bossHp: 0.11,
        damage: 0.42,
        speed: 0.18,
        fireRate: 0.5,
        bulletSpeed: 0.26,
        count: 0.07,
      },
    },
  };
  let activeBalanceVariant = BALANCE_VARIANTS.v0;
  {
    const requested = new URLSearchParams(window.location.search).get('variant');
    if (requested && BALANCE_VARIANTS[requested]) activeBalanceVariant = BALANCE_VARIANTS[requested];
  }

  const UPGRADES = [
    { id: 'baseWeapon', name: '基础弹列', desc: '单次基础伤害 +1/+1/+2/+3，最多 3 次', icon: '#i-layers', max: 3, apply(p, scale = 1) {
      const amount = scale >= 2 ? 3 : scale >= 1.3 ? 2 : 1;
      p.basePicksAmount = (p.basePicksAmount || 0) + amount;
      p.basePicks = (p.basePicks || 0) + 1;
      p.baseDamageBonus += amount;
      if (p.basePicks % 3 === 0) p.baseDamageBonus += p.basePicksAmount;
    } },
    { id: 'barrel', name: '主炮扩容', desc: '绿蓝 +1 排，紫橙 +2 排，可突破 3 排上限', icon: '#i-target', max: 3, apply(p, scale = 1) {
      const amount = scale >= 1.3 ? 2 : 1;
      p.rows = Math.min(6, p.rows + amount);
      if (p.rows > 3) p.barrelBroke = true;
    } },
    { id: 'drone', name: '浮游炮', desc: '绿蓝 +1 座，紫 +2 座，橙 +3 座；无人机流派上限 6，其他 4，紫橙可突破', icon: '#i-rocket', max: MAX_DRONES, apply(p, scale = 1) {
      const amount = scale >= 2 ? 3 : scale >= 1.3 ? 2 : 1;
      p.droneCount = Math.min(MAX_DRONES, (p.droneCount || 0) + amount);
      const libraryMax = p.buildId === 'drone' ? 6 : 4;
      if (p.droneCount > libraryMax) p.droneBroke = true;
    } },
    { id: 'bulletSize', name: '巨型弹芯', desc: '单次体积 +35%/+50%/+65%/+100%，绿蓝累计上限 +150%', icon: '#i-plus', max: 3, apply(p, scale = 1) {
      const amount = Math.round(0.5 * scale * 100) / 100;
      if (scale >= 1.3) {
        p.bulletSizeBonus = Math.min(3, (p.bulletSizeBonus || 0) + amount);
        if (p.bulletSizeBonus > 1.5) p.bulletSizeBroke = true;
      } else {
        p.bulletSizeBonus = Math.min(1.5, (p.bulletSizeBonus || 0) + amount);
      }
    } },
    { id: 'damage', name: '火力强化', desc: '单次伤害 ×1.13/×1.18/×1.23/×1.36，最多 5 次', icon: '#i-crosshair', max: 5, apply(p, scale = 1) {
      p.damage = Math.round(p.damage * (1 + 0.18 * scale));
    } },
    { id: 'rate', name: '速射引擎', desc: '单次间隔 ×0.93/×0.90/×0.87/×0.80，最多 5 次', icon: '#i-zap', max: 5, apply(p, scale = 1) {
      p.fireInterval = Math.max(0.06, Math.round(p.fireInterval * (1 - 0.10 * scale) * 1000) / 1000);
    } },
    { id: 'pierce', name: '穿甲弹头', desc: '穿透 +1/+1/+2/+3；橙卡额外独立伤害 +10%', icon: '#i-target', max: 3, apply(p, scale = 1) {
      const pierceAmount = scale >= 2 ? 3 : scale >= 1.3 ? 2 : 1;
      const jam = Math.round(0.8 * scale * 10) / 10;
      p.pierce += pierceAmount;
      if (scale >= 1.3) p.jamDuration = (p.jamDuration || 0) + jam;
      else p.jamDuration = Math.min(1.6, (p.jamDuration || 0) + jam);
      if (scale >= 2) p.independentDamageBonus = (p.independentDamageBonus || 0) + 0.10;
    } },
    { id: 'hp', name: '装甲改造', desc: '单次 +18/+25/+33/+50，绿蓝数值上限 75', icon: '#i-shield', max: 3, apply(p, scale = 1) {
      const amount = Math.round(25 * scale);
      const bonus = p.armorBuffBonus || 0;
      const granted = scale >= 1.3 ? amount : Math.min(amount, Math.max(0, 75 - bonus));
      p.armorBuffBonus = bonus + granted;
      if (scale >= 1.3 && p.armorBuffBonus > 75) p.armorBroke = true;
      p.maxHp += granted;
      healPlayer(p, granted);
    } },
    { id: 'regen', name: '纳米修复', desc: '单次 +0.7/+1/+1.3/+2，绿蓝数值上限 3', icon: '#i-heart', max: 3, apply(p, scale = 1) {
      const amount = Math.round(1 * scale * 10) / 10;
      const bonus = p.regenBuffBonus || 0;
      const granted = scale >= 1.3 ? amount : Math.min(amount, Math.round((3 - bonus) * 10) / 10);
      p.regenBuffBonus = Math.round((bonus + granted) * 10) / 10;
      if (scale >= 1.3 && p.regenBuffBonus > 3) p.regenBroke = true;
      p.regen = Math.round((p.regen + granted) * 10) / 10;
    } },
    { id: 'speed', name: '矢量推进', desc: '单次 +11%/+15%/+20%/+30%，绿蓝数值上限 +45%', icon: '#i-right', max: 3, apply(p, scale = 1) {
      const amount = Math.round(0.15 * scale * 100) / 100;
      const bonus = p.speedBonus || 0;
      const granted = scale >= 1.3 ? amount : Math.min(amount, Math.round((0.45 - bonus) * 100) / 100);
      p.speedBonus = Math.round((bonus + granted) * 100) / 100;
      if (scale >= 1.3 && p.speedBonus > 0.45) p.speedBroke = true;
      p.speed = Math.round((p.baseSpeedRef || 250) * (1 + p.speedBonus + (p.endlessSpeedBonus || 0)));
    } },
    { id: 'bomb', name: '轨道炸弹', desc: '绿蓝 +1 颗，紫 +2 颗，橙 +3 颗，不设上限', icon: '#i-bomb', max: Infinity, apply(p, scale = 1) {
      p.bombs += scale >= 2 ? 3 : scale >= 1.3 ? 2 : 1;
    } },
    { id: 'life', name: '掠夺核心', desc: '单次回血 +0.7/+1/+1.3/+2，绿蓝数值上限 3', icon: '#i-sparkles', max: 3, apply(p, scale = 1) {
      const amount = Math.round(1 * scale * 10) / 10;
      const bonus = p.lifeBuffBonus || 0;
      const granted = scale >= 1.3 ? amount : Math.min(amount, Math.round((3 - bonus) * 10) / 10);
      p.lifeBuffBonus = Math.round((bonus + granted) * 10) / 10;
      if (scale >= 1.3 && p.lifeBuffBonus > 3) p.lifeBroke = true;
      p.lifesteal = Math.round((p.lifesteal + granted) * 10) / 10;
    } },
    { id: 'crit', name: '弱点锁定', desc: '暴击 +5.6%/+8%/+10.4%/+16%，暴伤 +17.5%/+25%/+32.5%/+50%（不设上限）', icon: '#i-star', max: 4, apply(p, scale = 1) {
      const chanceGain = Math.round(0.08 * scale * 1000) / 1000;
      const damageGain = Math.round(0.25 * scale * 100) / 100;
      p.critChance = scale >= 1.3
        ? Math.min(0.99, p.critChance + chanceGain)
        : Math.min(p.maxCritChance || 0.6, p.critChance + chanceGain);
      p.critDamage = p.critDamage + damageGain;
    } },
    { id: 'split', name: '分裂弹', desc: '概率 +14%/+20%/+26%/+40%，绿蓝封顶 60%', icon: '#i-plus', max: 2, apply(p, scale = 1) {
      const gain = Math.round(0.20 * scale * 1000) / 1000;
      p.splitChance = scale >= 1.3
        ? Math.min(0.99, p.splitChance + gain)
        : Math.min(0.6, p.splitChance + gain);
    } },
    { id: 'burnAmmo', name: '灼烧弹', desc: '燃烧持续与伤害随品质提升', icon: '#i-zap', max: 3, apply(p, scale = 1) {
      p.burnDurationBonus = Math.round(((p.burnDurationBonus || 0) + 2 * (scale - 1)) * 10) / 10;
      p.burnDpsBonus = Math.round(((p.burnDpsBonus || 0) + 6 * scale) * 10) / 10;
    } },
    { id: 'executeAmmo', name: '处决强化', desc: '低血伤害 +8.4%/+12%/+15.6%/+24%，最多 3 层', icon: '#i-target', max: 3, apply(p, scale = 1) {
      p.executeMul = Math.round(((p.executeMul || 0) + 0.12 * scale) * 1000) / 1000;
    } },
    { id: 'magnet', name: '磁吸弹药', desc: '追踪 1.05s/1.5s/1.95s/3s，冷却 7s', icon: '#i-wind', max: 1, apply(p, scale = 1) {
      p.magnetOnKill = true;
      p.magnetDuration = Math.round(1.5 * scale * 100) / 100;
    } },
    { id: 'shieldCore', name: '护盾核心', desc: '每 20s +14/+20/+26/+40 盾，最多 2 层', icon: '#i-shield', max: 2, apply(p, scale = 1) {
      p.shieldRegen = (p.shieldRegen || 0) + Math.round(20 * scale);
    } },
    { id: 'frenzy', name: '弹药狂热', desc: '持续 1s，射速 +28%/+40%/+52%/+80%，最多 2 次', icon: '#i-zap', max: 2, apply(p, scale = 1) {
      p.frenzyDuration = Math.min(2, (p.frenzyDuration || 0) + 1);
      p.frenzyRateBonus = Math.round(((p.frenzyRateBonus || 0) + 0.40 * scale) * 1000) / 1000;
    } },
  ];

  const META_UPGRADES = [
    { id: 'damage', name: '火力强化', branch: 'offense', desc: '伤害 +4.5% / 级', max: 15, icon: '#i-crosshair' },
    { id: 'rate', name: '速射引擎', branch: 'offense', desc: '射速 +2% / 级', max: 15, icon: '#i-zap' },
    { id: 'crit', name: '弱点锁定', branch: 'offense', desc: '暴击率 +1.5% / 级，暴击伤害 +4% / 级', max: 10, icon: '#i-star' },
    { id: 'pierce', name: '穿甲弹头', branch: 'offense', desc: '穿透 +0.15 / 级', max: 10, icon: '#i-target' },
    { id: 'overload', name: '震荡弹头', branch: 'offense', desc: '命中 3% / 级概率眩晕敌人 0.5 秒（BOSS 免控）', max: 10, icon: '#i-crosshair' },
    { id: 'hp', name: '装甲核心', branch: 'survival', desc: '生命上限 +5% / 级', max: 10, icon: '#i-shield' },
    { id: 'regen', name: '纳米再生', branch: 'survival', desc: '每秒回复 +0.8 / 级', max: 10, icon: '#i-heart' },
    { id: 'recover', name: '应急维修', branch: 'survival', desc: '受击 8% / 级概率修复 25% 最大生命（15 秒冷却）', max: 10, icon: '#i-heart' },
    { id: 'dodge', name: '相位闪避', branch: 'survival', desc: '弹幕 4% / 级概率闪避', max: 10, icon: '#i-wind' },
    { id: 'lifesteal', name: '血溢护盾', branch: 'survival', desc: '击杀回复溢出转化为护盾，护盾上限 +8% / 级最大生命', max: 5, icon: '#i-heart' },
    { id: 'speed', name: '矢量机动', branch: 'energy', desc: '移速 +2% / 级', max: 15, icon: '#i-right' },
    { id: 'bomb', name: '弹药整备', branch: 'energy', desc: '1 级起每 120 秒回复 1 颗炸弹，每级缩短 5 秒（最高 6 颗）', max: 10, icon: '#i-bomb' },
    { id: 'ult', name: '充能核心', branch: 'energy', desc: '大招能量获取 +10% / 级', max: 10, icon: '#i-sparkles' },
    { id: 'autoUlt', name: '概率核心', branch: 'energy', desc: '子弹 0.2% / 级概率自动大招', max: 10, icon: '#i-sparkles' },
    { id: 'chain', name: '连锁电弧', branch: 'chaos', desc: '击杀 3% / 级概率电击附近', max: 10, icon: '#i-zap' },
    { id: 'plunder', name: '贪婪核心', branch: 'chaos', desc: '击杀 5% / 级概率额外经验', max: 10, icon: '#i-star' },
    { id: 'orangeLuck', name: '橙色命运', branch: 'chaos', desc: '每级橙色品质概率 +1%（最高 5 级）', max: 5, icon: '#i-star' },
  ];

  const TALENT_BRANCHES = [
    {
      id: 'offense',
      name: '火力分支',
      icon: '#i-crosshair',
      talentIds: ['damage', 'rate', 'crit', 'pierce', 'overload'],
      milestones: [
        { level: 10, name: '弹列扩容', desc: '开局主炮 +1 排' },
        { level: 20, name: '过热核心', desc: '开局穿透 +0.4' },
      ],
    },
    {
      id: 'survival',
      name: '生存分支',
      icon: '#i-shield',
      talentIds: ['hp', 'regen', 'recover', 'dodge', 'lifesteal'],
      milestones: [
        { level: 10, name: '波次维修', desc: '每波结束额外回复 5% 生命' },
        { level: 20, name: '反应装甲', desc: '开局生命上限 +30' },
      ],
    },
    {
      id: 'energy',
      name: '机动能量分支',
      icon: '#i-sparkles',
      talentIds: ['speed', 'bomb', 'ult', 'autoUlt'],
      milestones: [
        { level: 10, name: '预热核心', desc: '大招能量获取效率 +20%' },
        { level: 20, name: '满载出发', desc: '开局炸弹 +1' },
      ],
    },
    {
      id: 'chaos',
      name: '特殊分支',
      icon: '#i-star',
      talentIds: ['chain', 'plunder', 'orangeLuck'],
      milestones: [
        { level: 5, name: '连锁初段', desc: '连锁电弧触发率 +10%' },
        { level: 10, name: '掠夺本能', desc: '贪婪核心触发率 +10%' },
      ],
    },
  ];

  const DIFFICULTY_AFFIXES = [
    {
      id: 'armored',
      name: '重装集群',
      icon: '#i-shield',
      desc: '敌机生命 ×1.35/1.9/2.1，首领 ×1.5/2.2/2.5，经验 +35%',
      hpMulLevels: [1, 1.35, 1.9, 2.1],
      bossHpMulLevels: [1, 1.5, 2.2, 2.5],
      scoreMul: 1.35,
      xpMul: 1.35,
      techPer5: 1,
    },
    {
      id: 'barrage',
      name: '弹幕风暴',
      icon: '#i-wind',
      desc: '每层敌弹速度 +12%、射击间隔 -10%，首领更早狂暴',
      bulletSpeedMul: 1.12,
      fireIntervalMul: 0.9,
      scoreMul: 1.5,
      techPer5: 2,
    },
    {
      id: 'rush',
      name: '急速突袭',
      icon: '#i-right',
      desc: '敌机速度 ×1.3/1.7/2.0，敌群数量少量增加，敌机价值提高',
      speedMulLevels: [1, 1.3, 1.7, 2.0],
      waveCountMulLevels: [1, 1.05, 1.1, 1.18],
      waveScoreMulLevels: [1, 1.2, 1.4, 1.6],
      scoreMul: 1.3,
      techPer5: 1,
    },
    {
      id: 'elite',
      name: '精英猎场',
      icon: '#i-star',
      desc: '每层每波追加 1 架精英，10 波后再追加 1 架',
      scoreMul: 1.6,
      techPer5: 2,
    },
    {
      id: 'lethal',
      name: '致命校准',
      icon: '#i-crosshair',
      desc: '每层敌机碰撞与弹幕伤害 +15%',
      damageMul: 1.15,
      scoreMul: 1.3,
      techPer5: 1,
    },
    {
      id: 'heavyShells',
      name: '巨型弹幕',
      icon: '#i-target',
      desc: '每层敌方子弹命中体积 +10%',
      enemyBulletRadiusMul: 1.1,
      scoreMul: 1.25,
      techPer5: 1,
    },
    {
      id: 'repairJam',
      name: '修复干扰',
      icon: '#i-heart',
      desc: '每层所有回复效果降至 88%',
      healingMul: 0.88,
      scoreMul: 1.3,
      techPer5: 1,
    },
    {
      id: 'blackout',
      name: '能源封锁',
      icon: '#i-zap',
      desc: '每层击杀与补给获得的大招能量降至 90%',
      ultGainMul: 0.9,
      scoreMul: 1.25,
      techPer5: 1,
    },
  ];

  const PLAYER_SKINS = [
    {
      id: 'prototype', name: '雷霆原型', type: 'prototype', price: 0,
      desc: '蓝白涂装均衡制式战机，机翼线条简洁，机动与火力兼顾，适合各类战局。', primary: '#d7f8ff', secondary: '#0e3b54', accent: '#54d7ff', flame: '#ffc857', flameCore: '#fff1a8',
    },
    {
      id: 'ember', name: '赤焰截击', type: 'interceptor', price: 30,
      desc: '赤红锐角高速截击战机，三角翼与流线机身适合快速穿插，专攻高机动拦截。', primary: '#ffdfd1', secondary: '#651d2a', accent: '#ff5e4f', flame: '#ff7438', flameCore: '#ffe0a3',
    },
    {
      id: 'verdant', name: '翠影蜂鸟', type: 'hummingbird', price: 55,
      desc: '翠绿轻型侦察战机，仿蜂鸟双翼结构机动灵活，擅长在密集弹幕中快速闪避。', primary: '#d9ffe7', secondary: '#12493d', accent: '#62e6a1', flame: '#54d7ff', flameCore: '#e5fbff',
    },
    {
      id: 'solar', name: '黄金圣翼', type: 'wing', price: 90,
      desc: '金色宽翼重型轰炸战机，厚实装甲与大展弦机翼提供稳定火力覆盖和持续压制。', primary: '#fff0bd', secondary: '#594018', accent: '#ffc857', flame: '#ff9e45', flameCore: '#fff4c2',
    },
    {
      id: 'void', name: '虚空幽灵', type: 'ghost', price: 135,
      desc: '紫影无尾隐形战机，低轮廓机身与幽灵翼型适合潜行突袭，机动轨迹难以预判。', primary: '#eee6ff', secondary: '#241744', accent: '#b28cff', flame: '#8f6cff', flameCore: '#f0e9ff',
    },
    {
      id: 'prism', name: '极光棱镜', type: 'prism', price: 190,
      desc: '青色晶体能量实验战机，棱镜装甲与高能光翼折射极光，科技感与火力兼备。', primary: '#e8ffff', secondary: '#173a52', accent: '#72f1ff', flame: '#b28cff', flameCore: '#ffffff',
    },
  ];

  const BUILD_PRESETS = [
    {
      id: 'balanced',
      name: '均衡弹道',
      icon: '#i-target',
      desc: '标准射速与伤害，每升 1 级基础伤害 +3%',
      fireRateMul: 1,
      damageMul: 1,
      critChance: 0,
      critBonusMul: 1,
      maxCritChance: 0.75,
      maxHpDamage: 0,
      levelDamageBonus: 0.03,
    },
    {
      id: 'rapid',
      name: '射速流',
      icon: '#i-zap',
      desc: '射速 +35%，伤害 -28%，每发附加 1.6% 目标最大生命伤害',
      fireRateMul: 1.35,
      damageMul: 0.72,
      critChance: 0,
      critBonusMul: 1,
      maxCritChance: 0.75,
      maxHpDamage: 0.016,
    },
    {
      id: 'crit',
      name: '暴击流',
      icon: '#i-star',
      desc: '射速 -25%，初始 20% 暴击，暴击造成原暴击伤害的 170%，每击杀暴击伤害 +0.2%（无上限）',
      fireRateMul: 0.8,
      damageMul: 1,
      critChance: 0.2,
      critBonusMul: 1.7,
      maxCritChance: 0.8,
      maxHpDamage: 0,
      critKillPower: 0.002,
    },
    {
      id: 'drone',
      name: '无人机召唤流',
      icon: '#i-rocket',
      desc: '主炮伤害 -25%，开局 2 座浮游炮，索敌效率 95%，每击杀无人机火力 +0.2%（无上限）',
      fireRateMul: 1,
      damageMul: 0.8,
      critChance: 0,
      critBonusMul: 1,
      maxCritChance: 0.75,
      maxHpDamage: 0,
      droneCount: 2,
      droneShareMul: 0.95,
      droneKillPower: 0.002,
      lifesteal: 1.5,
    },
    {
      id: 'counter',
      name: '反击流',
      icon: '#i-shield',
      desc: '生命上限 +40%，主炮伤害 -8%，初始闪避 -100%（受击必中），受击触发范围反击，命中玩家的弹幕会被反弹并溅射周围敌人',
      fireRateMul: 0.9,
      damageMul: 0.92,
      critChance: 0,
      critBonusMul: 1,
      maxCritChance: 0.75,
      maxHpDamage: 0,
      maxHpMul: 1.45,
      regen: 2.5,
      counterDamage: 100,
      counterHpRatio: 0.75,
      counterRadius: 280,
      counterCooldown: 0.9,
      counterEnemyHpRatio: 0.08,
      dodgeChanceBase: -1,
    },
  ];

  const DEFAULT_META = {
    points: 0,
    rewardPoints: 0,
    levels: { damage: 0, rate: 0, speed: 0, ult: 0 },
    ownedSkins: ['prototype'],
    selectedSkin: 'prototype',
    selectedBuild: 'balanced',
  };

  const AMMO_TYPES = {
    bolt: { name: '基础', damage: 1, speed: 560, radius: 5, life: 1.5, color: '#9ff3ff' },
    slow: { name: '减速', damage: 0.55, speed: 470, radius: 5, life: 1.7, color: '#7de8ff', slow: 0.45, slowDuration: 1.8 },
    burn: { name: '燃烧', damage: 0.4, speed: 500, radius: 5, life: 1.6, color: '#ff9f5a', burnDps: 0.3, burnDuration: 2 },
    blast: { name: '范围', damage: 0.65, speed: 430, radius: 6, life: 1.25, color: '#ffd166', blastRadius: 72 },
    homing: { name: '追踪', damage: 0.5, speed: 430, radius: 5, life: 1.15, color: '#c3a5ff', homing: true, turn: 2.4, range: 260 },
  };

  const RESOURCE_DROPS = {
    bomb: { name: '炸弹补给', color: '#ffe08a' },
    ult: { name: '大招能量', color: '#b28cff' },
  };

  const SPECIAL_ORDER = ['slow', 'burn', 'blast', 'homing'];

  const ENDLESS_UPGRADES = [
    { id: 'endlessDamage', name: '无尽火力', desc: '伤害 ×1.07/×1.10/×1.13/×1.20', icon: '#i-crosshair', max: Infinity, apply(p, scale = 1) {
      p.damage = Math.round(p.damage * (1 + 0.10 * scale));
    } },
    { id: 'endlessRate', name: '无尽速射', desc: '间隔 ×0.944/×0.92/×0.896/×0.84', icon: '#i-zap', max: Infinity, apply(p, scale = 1) {
      p.fireInterval = Math.max(0.045, Math.round(p.fireInterval * (1 - 0.08 * scale) * 1000) / 1000);
    } },
    { id: 'endlessArmor', name: '无尽装甲', desc: '生命/修复 +14/+20/+26/+40', icon: '#i-shield', max: Infinity, apply(p, scale = 1) {
      const amount = Math.round(20 * scale);
      p.maxHp += amount;
      healPlayer(p, amount);
    } },
    { id: 'endlessLoot', name: '无尽补给', desc: '炸弹 +1/+1/+2/+3，移速 +3.5%/+5%/+6.5%/+10%', icon: '#i-bomb', max: Infinity, apply(p, scale = 1) {
      p.bombs += scale >= 2 ? 3 : scale >= 1.3 ? 2 : 1;
      p.endlessSpeedBonus = Math.round(((p.endlessSpeedBonus || 0) + 0.05 * scale) * 1000) / 1000;
      p.speed = Math.round((p.baseSpeedRef || 250) * (1 + p.speedBonus + p.endlessSpeedBonus));
    } },
    { id: 'endlessCrit', name: '无尽锁定', desc: '暴击与伤害 +2.8%/+4%/+5.2%/+8%', icon: '#i-star', max: Infinity, apply(p, scale = 1) {
      const gain = Math.round(0.04 * scale * 1000) / 1000;
      p.critChance = scale >= 1.3
        ? Math.min(0.99, p.critChance + gain)
        : Math.min(p.maxCritChance || 0.75, p.critChance + gain);
      p.damage = Math.round(p.damage * (1 + 0.04 * scale));
    } },
    { id: 'endlessVamp', name: '无尽掠夺', desc: '回血 +1/+1/+2/+3，独立伤害 +3.5%/+5%/+6.5%/+10%', icon: '#i-sparkles', max: Infinity, apply(p, scale = 1) {
      p.lifesteal = Math.round((p.lifesteal + (scale >= 2 ? 3 : scale >= 1.3 ? 2 : 1)) * 10) / 10;
      p.independentDamageBonus = Math.round(((p.independentDamageBonus || 0) + 0.05 * scale) * 1000) / 1000;
    } },
  ];

  const GOLD_MODULES = [
    { id: 'orbitalBlade', name: '环绕护盾刃', desc: '两枚能量刃环绕战机，周期性切割敌机；每 5 秒最多拦截 2 颗敌弹', icon: '#i-target', max: 1, apply(p) { p.gold.orbitalBlade = true; } },
    { id: 'timeRift', name: '时间裂隙', desc: '每 18 秒触发 2 秒敌方弹幕减速 65%', icon: '#i-sparkles', max: 1, apply(p) { p.gold.timeRift = true; p.timeRiftTimer = 18; } },
    { id: 'warpDrive', name: '相位引擎', desc: '解锁主动技能相位冲刺：向移动方向突进并短暂无敌，15 秒冷却', icon: '#i-right', max: 1, apply(p) { p.gold.warpDrive = true; p.dashUnlocked = true; } },
  ];

  // 核心质变：每局限 1 个，第 3 波三选一，改变打法而非数值
  const CORE_TRANSFORMS = [
    {
      id: 'arc', name: '电弧核心', icon: '#i-zap',
      desc: '每次命中触发连锁闪电，跳跃 3 个敌人，伤害逐跳递减',
      apply(p) { p.core = 'arc'; p.arcCd = 0; },
    },
    {
      id: 'blast', name: '爆裂核心', icon: '#i-bomb',
      desc: '击杀引发范围爆炸，爆炸可连锁（最多 4 代，伤害递减）',
      apply(p) { p.core = 'blast'; },
    },
    {
      id: 'ricochet', name: '弹射核心', icon: '#i-target',
      desc: '子弹命中后弹射到附近敌人（最多 5 次，伤害递减）',
      apply(p) { p.core = 'ricochet'; },
    },
    {
      id: 'beam', name: '光束核心', icon: '#i-layers',
      desc: '主炮变为持续贯穿激光束，命中路径上所有敌人',
      apply(p) { p.core = 'beam'; p.beamTick = 0; },
    },
    {
      id: 'mirror', name: '分身核心', icon: '#i-rocket',
      desc: '两架镜像机体随行，各自复制 30% 主炮火力',
      apply(p) { p.core = 'mirror'; },
    },
    {
      id: 'overload', name: '超载核心', icon: '#i-sparkles',
      desc: '每 15 秒进入 5 秒超载：机体放大，射速与伤害暴涨',
      apply(p) { p.core = 'overload'; p.overloadCd = 2; p.overloadTimer = 0; },
    },
  ];

  const ENDLESS_CONTRACTS = [
    { id: 'overdrive', name: '火力过载', desc: '本段伤害 +20%，敌弹速度 +15%，奖励 ×1.25', icon: '#i-zap', rewardMul: 1.25, damageMul: 1.2, bulletSpeedMul: 1.15 },
    { id: 'scavenger', name: '弹药储备', desc: '炸弹 +1、大招能量 +60，回复效率 -30%', icon: '#i-bomb', rewardMul: 1.1, healingMul: 0.7, bombs: 1, ultEnergy: 60 },
    { id: 'bounty', name: '赏金猎手', desc: '本段结算积分 ×1.3，敌机数量 +20%', icon: '#i-star', rewardMul: 1.3, waveCountMul: 1.2 },
  ];

  const SPECIAL_EVENTS = ['meteor', 'convoy', 'splitter'];

  const OBJECTIVE_POOL = [
    { id: 'noHit', name: '无伤清波', desc: '本波不受到伤害', reward: 200, tech: 1 },
    { id: 'droneKills', name: '无人机猎手', desc: '本波浮游炮击杀 5 架', reward: 180, tech: 1, target: 5 },
    { id: 'fastClear', name: '速清', desc: '本波在 25 秒内清空', reward: 220, tech: 1, target: 25 },
  ];

  const ENEMY_TYPES = {
    scout: { hp: 18, speed: 62, r: 36, score: 10, xp: 7, contact: 8, color: '#58e0ff', fire: null },
    striker: { hp: 24, speed: 50, r: 33, score: 20, xp: 11, contact: 10, color: '#ffb65e', fire: { interval: 2.4, speed: 165, damage: 8 } },
    twin: { hp: 30, speed: 53, r: 34, score: 30, xp: 13, contact: 10, color: '#ff7bd5', fire: { interval: 2.7, speed: 165, damage: 8 } },
    brute: { hp: 52, speed: 36, r: 33, score: 45, xp: 22, contact: 14, color: '#ff6670', fire: { interval: 3.2, speed: 145, damage: 12 } },
    ace: { hp: 38, speed: 68, r: 34, score: 55, xp: 26, contact: 12, color: '#b98aff', fire: { interval: 2.6, speed: 175, damage: 10 } },
    meteor: { hp: 90, speed: 58, r: 36, score: 35, xp: 16, contact: 16, color: '#b28cff', fire: null },
    special: { hp: 150, speed: 28, r: 36, score: 120, xp: 60, contact: 14, color: '#ffd166', fire: null, metaReward: 1 },
    boss: { hp: 560, speed: 26, r: 50, score: 520, xp: 220, contact: 26, color: '#ff4f63', fire: { interval: 0.72, speed: 190, damage: 16 } },
  };

  const BOSS_TYPES = {
    warlord: {
      id: 'warlord',
      name: '装甲要塞',
      color: '#ff6675',
      accent: '#ffd166',
      glow: '#ff5e6c',
      bullet: '#ffd166',
      bulletAlt: '#ff8a5e',
      speedMul: 0.9,
      fireIntervalMul: 1.08,
      bulletSpeedMul: 0.96,
      lateralRate: 0.62,
      lateralAmp: 40,
      summonCooldown: 9,
      summonCount: 2,
      patternShift: 0,
      ringBonus: 0,
      fanBonus: 0,
      arcBonus: 0,
      spiralBonus: 0,
    },
    hive: {
      id: 'hive',
      name: '蜂巢母舰',
      color: '#ffd166',
      accent: '#b7ff7d',
      glow: '#ffb347',
      bullet: '#ffd166',
      bulletAlt: '#b7ff7d',
      speedMul: 1,
      fireIntervalMul: 0.94,
      bulletSpeedMul: 1,
      lateralRate: 0.85,
      lateralAmp: 55,
      summonCooldown: 6,
      summonCount: 3,
      patternShift: 2,
      ringBonus: -2,
      fanBonus: 1,
      arcBonus: 1,
      spiralBonus: -1,
    },
    phantom: {
      id: 'phantom',
      name: '相位猎手',
      color: '#b98aff',
      accent: '#e0ccff',
      glow: '#a77bff',
      bullet: '#c9a2ff',
      bulletAlt: '#8be9ff',
      speedMul: 1.35,
      fireIntervalMul: 1.12,
      bulletSpeedMul: 1.05,
      lateralRate: 1.35,
      lateralAmp: 92,
      summonCooldown: 12,
      summonCount: 0,
      patternShift: 4,
      ringBonus: -3,
      fanBonus: 2,
      arcBonus: 0,
      spiralBonus: 1,
    },
  };

  const ENEMY_INFO = {
    scout: { name: '侦察机', firstWave: 1, desc: '轻型高速侦察单位，速度快但生命较低，是前期最常见的敌机。' },
    striker: { name: '突击机', firstWave: 2, desc: '单发瞄准炮的中型突击机，火力稳定但弹速不快。' },
    twin: { name: '双发机', firstWave: 3, desc: '双炮并射的菱形战机，弹道略有夹角；分裂母舰事件中会携带分裂标签。' },
    brute: { name: '重装兵', firstWave: 4, desc: '六边形重甲单位，使用三发扇形弹幕，接触伤害较高。' },
    ace: { name: '王牌机', firstWave: 5, desc: '高速精锐战机，会横向摆动并使用三连瞄准弹幕。' },
    meteor: { name: '陨石', firstWave: '随机特殊波', desc: '陨石带事件中的无火单位，碰撞体积大，击落后提供分数但不射击。' },
    special: { name: '特殊舰', firstWave: '随机特殊波', desc: '特殊波事件的旗舰，击落可获得科技点，行动路线为缓速横向摆动。' },
    boss: { name: '首领', firstWave: 5, desc: '每 5 波出现的重型旗舰，拥有阶段核心、三倍血量与 100% 韧性（免控），击落后可回收残骸。' },
  };

  const BOSS_VARIANT_INFO = {
    warlord: { name: '装甲要塞', firstWave: 5, desc: '重装低速炮舰，擅长环形与旋转弹幕；狂暴后每轮召唤 2 架援军。' },
    hive: { name: '蜂巢母舰', firstWave: 10, desc: '蜂巢结构母舰，弹幕更密、召唤更快；狂暴后每轮召唤 3 架援军。' },
    phantom: { name: '相位猎手', firstWave: 15, desc: '高速精准猎手，瞄准弹幕密集、横向摆幅大；狂暴后不召唤援军。' },
  };

  const EVENT_INFO = {
    meteor: { name: '陨石带', desc: '特殊波追加陨石与特殊舰，注意大体积碰撞。' },
    convoy: { name: '补给舰队', desc: '特殊波追加补给旗舰与护航单位，击落可获取资源。' },
    splitter: { name: '分裂母舰', desc: '特殊波追加携带分裂标签的双发机，击落后会分裂成侦察机。' },
  };

  const SOUNDS = {
    kill: [[0, 150, 0.09, 0.045, 'triangle'], [0.05, 240, 0.09, 0.04, 'triangle']],
    hit: [[0, 280, 0.05, 0.03, 'triangle']],
    level: [[0, 520, 0.1, 0.06, 'triangle'], [0.09, 780, 0.14, 0.06, 'triangle']],
    bomb: [[0, 95, 0.4, 0.11, 'sawtooth'], [0, 180, 0.2, 0.04, 'square']],
    ultimate: [[0, 120, 0.14, 0.09, 'sawtooth'], [0.06, 190, 0.18, 0.08, 'sawtooth'], [0.12, 320, 0.22, 0.08, 'square']],
    hurt: [[0, 120, 0.18, 0.09, 'sawtooth']],
    wave: [[0, 330, 0.12, 0.05, 'triangle'], [0.1, 495, 0.16, 0.05, 'triangle']],
    over: [[0, 220, 0.2, 0.07, 'sawtooth'], [0.14, 165, 0.34, 0.07, 'sawtooth']],
    pickup: [[0, 740, 0.05, 0.03, 'triangle'], [0.03, 980, 0.05, 0.025, 'triangle']],
  };

  let state = null;
  let paused = false;
  let soundOn = true;
  let audioCtx = null;
  let bestScore = 0;
  let enemyId = 0;
  let fpsFrames = 0;
  let fpsTimer = 0;
  let displayFps = 0;
  let pointerActive = false;
  let pointerX = W / 2;
  let pointerY = H * 0.8;
  let hudDimActive = false;   // HUD 拖动淡出状态（移动端拖动移动时让出视野）
  let hudCollapsed = false;   // HUD 手动收起状态（顶部按钮切换）
  let skinConfirmCard = null; // 皮肤购买二次确认：当前武装的卡片
  let skinConfirmTimer = null;
  const selectedAffixLevels = Object.create(null);
  let lastTime = performance.now();
  let lastFrameTime = 0;
  let backgroundCache = null;
  const enemySpriteCache = new Map();
  const playerSkinSpriteCache = new Map();
  const droneSpriteCache = new Map();
  const bulletSpriteCache = new Map();
  const spriteImageCache = new Map();
  // 无 PNG 的精灵：只用程序化绘制（新增无 PNG 的敌机/BOSS 时加入此处，跳过 PNG 加载避免 404）
  const PROCEDURAL_ONLY_SPRITES = new Set();
  let battleBackgroundImage = null;
  let battleBackgroundReady = false;
  let battleBackgroundFailed = false;
  const keys = Object.create(null);
  const touchDirs = Object.create(null);

  try {
    bestScore = Number(localStorage.getItem('thunderStrikeBest') || localStorage.getItem('nebulaStrikeBest') || 0) || 0;
  } catch (_) {
    bestScore = 0;
  }

  function normalizeMeta(parsed) {
    const source = parsed && typeof parsed === 'object' ? parsed : {};
    const levels = {};
    for (const def of META_UPGRADES) {
      const value = Number(source.levels && source.levels[def.id]);
      levels[def.id] = Number.isFinite(value) ? clamp(Math.floor(value), 0, def.max) : 0;
    }
    const milestones = {};
    for (const key of ['firstClear', ...endlessMilestoneKeys()]) {
      milestones[key] = Boolean(source.milestones && source.milestones[key]);
    }
    const validSkinIds = new Set(PLAYER_SKINS.map((skin) => skin.id));
    const ownedSkins = Array.isArray(source.ownedSkins)
      ? [...new Set(source.ownedSkins.filter((id) => validSkinIds.has(id)))]
      : [];
    if (!ownedSkins.includes('prototype')) ownedSkins.unshift('prototype');
    const selectedSkin = ownedSkins.includes(source.selectedSkin) ? source.selectedSkin : 'prototype';
    const validBuildIds = new Set(BUILD_PRESETS.map((build) => build.id));
    return {
      points: Number.isFinite(Number(source.points)) ? Math.max(0, Math.floor(Number(source.points))) : 0,
      rewardPoints: Number.isFinite(Number(source.rewardPoints)) ? Math.max(0, Math.floor(Number(source.rewardPoints))) : 0,
      levels,
      milestones,
      ownedSkins,
      selectedSkin,
      selectedBuild: validBuildIds.has(source.selectedBuild) ? source.selectedBuild : 'balanced',
    };
  }

  let meta = normalizeMeta(DEFAULT_META);
  try {
    const raw = localStorage.getItem('thunderStrikeMeta');
    meta = normalizeMeta(raw ? JSON.parse(raw) : DEFAULT_META);
  } catch (_) {
    meta = normalizeMeta(DEFAULT_META);
  }

  function saveMeta() {
    try {
      localStorage.setItem('thunderStrikeMeta', JSON.stringify(meta));
    } catch (_) {
      // Meta upgrades are optional and only persist when storage is available.
    }
  }

  // 天赋树已投入/总容量
  function talentTreeSpent() {
    return META_UPGRADES.reduce((sum, def) => sum + (meta.levels[def.id] || 0), 0);
  }
  function talentTreeCapacity() {
    return META_UPGRADES.reduce((sum, def) => sum + def.max, 0);
  }
  // 科技点入账：天赋树已满时溢出自动按 1:1 折算为奖励积分（避免"玩一会就溢出"浪费）
  function grantTechPoints(amount) {
    if (!amount || amount <= 0) return 0;
    if (talentTreeSpent() >= talentTreeCapacity()) {
      meta.rewardPoints = (meta.rewardPoints || 0) + amount;
      if (state) state.convertedTechPoints = (state.convertedTechPoints || 0) + amount;
      return amount;
    }
    meta.points = (meta.points || 0) + amount;
    return 0;
  }

  // 每日挑战（2026-08-17）：固定日期种子，评级徽章 + 每日一次积分奖励
  const DAILY_REWARD_BY_RATING = { S: 60, A: 40, B: 25, C: 15 };
  const DAILY_RATING_WAVES = { S: 10, A: 7, B: 4, C: 1 };
  const DAILY_RATING_ORDER = ['S', 'A', 'B', 'C'];
  const DAILY_STORAGE_KEY = 'thunderStrikeDaily';

  function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function dailySeedFor(key) {
    let h = 0;
    for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
    return h || 1;
  }

  const nativeMathRandom = Math.random;
  function seedMathRandom(seed) {
    let s = seed >>> 0;
    Math.random = () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }
  function restoreMathRandom() {
    Math.random = nativeMathRandom;
  }

  let dailyState = { date: '', bestRating: '', bestScore: 0, claimedRating: '', badges: {} };
  try {
    const raw = localStorage.getItem(DAILY_STORAGE_KEY);
    if (raw) dailyState = { ...dailyState, ...JSON.parse(raw) };
  } catch (_) {
    dailyState = { date: '', bestRating: '', bestScore: 0, claimedRating: '', badges: {} };
  }
  function saveDailyState() {
    try { localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(dailyState)); } catch (_) {}
  }

  function dailyRatingForWave(wave) {
    if (wave >= DAILY_RATING_WAVES.S) return 'S';
    if (wave >= DAILY_RATING_WAVES.A) return 'A';
    if (wave >= DAILY_RATING_WAVES.B) return 'B';
    return 'C';
  }

  function startDailyChallenge() {
    const key = todayKey();
    dailyState.date = key;
    // 固定难度（无词缀）+ 固定日期种子
    for (const def of DIFFICULTY_AFFIXES) selectedAffixLevels[def.id] = 0;
    try { ensureAudio(); resumeAudio(); } catch (_) {}
    seedMathRandom(dailySeedFor(key));
    startGame();
    state.dailyChallengeKey = key;
    addLog(`每日挑战开始（${key}，固定种子）`);
  }

  function renderDailyMenu() {
    if (els.dailyInfo) {
      const key = todayKey();
      const badge = dailyState.badges[key];
      const claimed = badge && dailyState.claimedRating === badge;
      els.dailyInfo.replaceChildren();
      const goal = document.createElement('div');
      goal.className = 'daily-goal';
      if (badge) {
        goal.innerHTML = `今日评级 <strong class="daily-rating-${badge}">${badge}</strong>${claimed ? ` · 已领 ${DAILY_REWARD_BY_RATING[badge]} 积分` : ''}（规则：S=通关10波 / A=7波 / B=4波 / C=参与）`;
      } else {
        goal.innerHTML = '今日挑战：<strong>固定种子，人人同一局</strong>，冲击最高评级（S=通关10波 / A=7波 / B=4波 / C=参与）';
      }
      const reward = document.createElement('div');
      reward.className = 'daily-reward';
      reward.textContent = '评级奖励：S 60 / A 40 / B 25 / C 15 积分 · 每日按最高评级领一次';
      els.dailyInfo.append(goal, reward);
    }
    if (els.dailyBadges) {
      els.dailyBadges.replaceChildren();
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const chip = document.createElement('span');
        chip.className = 'daily-badge';
        const rating = dailyState.badges[key];
        if (rating) {
          chip.textContent = rating;
          chip.classList.add(`rating-${rating}`);
          chip.title = `${key} 评级 ${rating}`;
        } else {
          chip.textContent = '·';
          chip.classList.add('empty');
          chip.title = `${key} 未挑战`;
        }
        els.dailyBadges.appendChild(chip);
      }
    }
  }

  // 成就系统（2026-08-17）：图鉴「成就」分类，localStorage 持久化
  const ACHIEVEMENTS = [
    { id: 'firstClear', name: '初战告捷', desc: '首次通关（到达第 10 波）', icon: '#i-star' },
    { id: 'bossSlayer', name: '屠龙者', desc: '首次击杀 BOSS', icon: '#i-crosshair' },
    { id: 'kills100', name: '百人斩', desc: '累计击杀 100 架敌机', icon: '#i-target' },
    { id: 'kills1000', name: '千人斩', desc: '累计击杀 1000 架敌机', icon: '#i-target' },
    { id: 'waves50', name: '深空航行', desc: '累计到达 50 波', icon: '#i-layers' },
    { id: 'coreFirst', name: '觉醒者', desc: '首次获得核心质变', icon: '#i-sparkles' },
    { id: 'coreCollector', name: '形态大师', desc: '使用过全部 6 个核心质变', icon: '#i-sparkles' },
    { id: 'buildExplorer', name: '战术家', desc: '使用过全部 5 个流派', icon: '#i-rocket' },
    { id: 'dailyGold', name: '每日王者', desc: '每日挑战取得 S 评级', icon: '#i-target' },
    { id: 'endlessDeep', name: '深渊行者', desc: '无尽模式到达 30 波', icon: '#i-zap' },
  ];
  const ACH_STORAGE_KEY = 'thunderStrikeAchievements';
  let achievementUnlocked = new Set();
  let achievementStats = { kills: 0, waves: 0, endlessWaves: 0, cores: [], builds: [] };
  try {
    const raw = localStorage.getItem(ACH_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      achievementUnlocked = new Set(parsed.unlocked || []);
      achievementStats = { ...achievementStats, ...(parsed.stats || {}) };
    }
  } catch (_) {
    achievementUnlocked = new Set();
    achievementStats = { kills: 0, waves: 0, endlessWaves: 0, cores: [], builds: [] };
  }
  function saveAchievements() {
    try {
      localStorage.setItem(ACH_STORAGE_KEY, JSON.stringify({
        unlocked: [...achievementUnlocked],
        stats: achievementStats,
      }));
    } catch (_) {}
  }
  function unlockAchievement(id) {
    if (achievementUnlocked.has(id)) return false;
    const def = ACHIEVEMENTS.find((a) => a.id === id);
    if (!def) return false;
    achievementUnlocked.add(id);
    saveAchievements();
    addLog(`成就解锁：${def.name}（${def.desc}）`);
    if (state && state.player) {
      addText(`成就解锁 · ${def.name}`, state.player.x, state.player.y - 86, '#ffd166', { size: 16, weight: 900, outline: true, life: 1.6 });
    }
    playSound('level');
    return true;
  }
  function checkAchievements() {
    const s = achievementStats;
    if (s.waves >= 10) unlockAchievement('firstClear');
    if (s.kills >= 100) unlockAchievement('kills100');
    if (s.kills >= 1000) unlockAchievement('kills1000');
    if (s.waves >= 50) unlockAchievement('waves50');
    if ((s.cores || []).length >= 6) unlockAchievement('coreCollector');
    if ((s.builds || []).length >= 5) unlockAchievement('buildExplorer');
    if (s.endlessWaves >= 30) unlockAchievement('endlessDeep');
  }
  // 局内累计成就进度（击杀/波次/流派在结算时合并，核心与 BOSS 即时解锁）
  function updateAchievementRunStats() {
    if (!state) return;
    achievementStats.kills += state.kills;
    achievementStats.waves += state.wave;
    if (state.endless) achievementStats.endlessWaves = Math.max(achievementStats.endlessWaves || 0, state.wave);
    const build = meta.selectedBuild;
    if (build && !achievementStats.builds.includes(build)) achievementStats.builds.push(build);
    saveAchievements();
    checkAchievements();
  }
  function achievementEntry(id) {
    return {
      id,
      unlocked: achievementUnlocked.has(id),
      name: (ACHIEVEMENTS.find((a) => a.id === id) || {}).name || id,
      desc: (ACHIEVEMENTS.find((a) => a.id === id) || {}).desc || '',
      icon: (ACHIEVEMENTS.find((a) => a.id === id) || {}).icon || '#i-star',
    };
  }

  // 兑换码（2026-08-17）：图鉴「兑换码」分类输入兑换，一次有效，localStorage 持久化
  const REDEMPTION_CODES = {
    '26710': { techPoints: 200, rewardPoints: 1000 },
  };
  const REDEEMED_STORAGE_KEY = 'thunderStrikeRedeemed';
  let redeemedCodes = new Set();
  try {
    const raw = localStorage.getItem(REDEEMED_STORAGE_KEY);
    if (raw) redeemedCodes = new Set(JSON.parse(raw));
  } catch (_) {
    redeemedCodes = new Set();
  }
  function saveRedeemed() {
    try { localStorage.setItem(REDEEMED_STORAGE_KEY, JSON.stringify([...redeemedCodes])); } catch (_) {}
  }
  function redeemCode(code) {
    const key = String(code || '').trim().toUpperCase();
    if (!key) return { ok: false, text: '请输入兑换码' };
    if (redeemedCodes.has(key)) return { ok: false, text: '该兑换码已使用过' };
    const def = REDEMPTION_CODES[key];
    if (!def) return { ok: false, text: '兑换码无效' };
    const tech = def.techPoints || 0;
    const converted = grantTechPoints(tech);
    meta.rewardPoints = (meta.rewardPoints || 0) + (def.rewardPoints || 0);
    redeemedCodes.add(key);
    saveRedeemed();
    saveMeta();
    const rewardText = converted > 0
      ? `+${(def.rewardPoints || 0) + converted} 奖励积分（${tech} 天赋点已折算）`
      : `+${tech} 天赋点、+${def.rewardPoints || 0} 奖励积分`;
    addLog(`兑换码 ${key} 兑换成功：${rewardText}`);
    playSound('level');
    return { ok: true, text: `兑换成功：${rewardText}` };
  }

  let seenEnemyTypes = new Set();
  let firstSeenEnabled = true;
  let encyclopediaActiveTab = '全部';
  let encyclopediaQuery = '';

  try {
    const raw = localStorage.getItem('thunderStrikeSeenEnemies');
    if (raw) seenEnemyTypes = new Set(JSON.parse(raw));
  } catch (_) {
    seenEnemyTypes = new Set();
  }

  function saveSeenEnemyTypes() {
    try {
      localStorage.setItem('thunderStrikeSeenEnemies', JSON.stringify([...seenEnemyTypes]));
    } catch (_) {
      // Discovery progress is optional and only persists when storage is available.
    }
  }

  function endlessMilestoneKeys() {
    const keys = [];
    for (let wave = MISSION_FINAL_WAVE + ENDLESS_MILESTONE_INTERVAL; wave <= 100; wave += ENDLESS_MILESTONE_INTERVAL) {
      keys.push(`wave${wave}`);
    }
    return keys;
  }

  function milestoneWave(wave) {
    return wave > MISSION_FINAL_WAVE && wave % ENDLESS_MILESTONE_INTERVAL === 0 ? wave : 0;
  }

  function pendingMilestoneRewards(run) {
    if (!run) return 0;
    let points = 0;
    if (run.missionComplete && !meta.milestones.firstClear) points += FIRST_CLEAR_REWARD_POINTS;
    const wave = milestoneWave(run.wave);
    if (wave && !meta.milestones[`wave${wave}`]) points += ENDLESS_MILESTONE_REWARD_POINTS;
    return points;
  }

  function claimMilestoneRewards(run) {
    if (!run) return 0;
    let points = 0;
    if (run.missionComplete && !meta.milestones.firstClear) {
      meta.milestones.firstClear = true;
      points += FIRST_CLEAR_REWARD_POINTS;
    }
    const wave = milestoneWave(run.wave);
    if (wave && !meta.milestones[`wave${wave}`]) {
      meta.milestones[`wave${wave}`] = true;
      points += ENDLESS_MILESTONE_REWARD_POINTS;
    }
    return points;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function syncCanvasSize() {
    const rect = canvas.getBoundingClientRect();
    const nextW = Math.max(320, Math.round(rect.width));
    const nextH = Math.max(280, Math.round(rect.height));
    if (nextW === W && nextH === H) return;
    W = nextW;
    H = nextH;
    canvas.width = W;
    canvas.height = H;
    backgroundCache = null;
    if (state) {
      const p = state.player;
      p.x = clamp(p.x, 26, W - 26);
      p.y = clamp(p.y, 46, H - 28);
      state.stars = makeStars();
    }
  }

  function randRange(min, max) {
    return min + Math.random() * (max - min);
  }

  function randInt(min, max) {
    return Math.floor(randRange(min, max + 1));
  }

  function shuffle(items) {
    const arr = items.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function selectedAffixLevel(id) {
    return clamp(Math.floor(Number(selectedAffixLevels[id]) || 0), 0, MAX_AFFIX_LEVEL);
  }

  function affixLevel(affix, id) {
    return affix && affix.levels ? (affix.levels[id] || 0) : 0;
  }

  function buildAffixConfig() {
    const entries = DIFFICULTY_AFFIXES
      .map((def) => ({ def, level: selectedAffixLevel(def.id) }))
      .filter((entry) => entry.level > 0);
    if (!entries.length) return null;

    const config = {
      entries,
      levels: Object.create(null),
      scoreMul: 1,
      techPer5: 0,
      hpMul: 1,
      bossHpMul: 1,
      bulletSpeedMul: 1,
      fireIntervalMul: 1,
      speedMul: 1,
      waveCountMul: 1,
      damageMul: 1,
      enemyBulletRadiusMul: 1,
      healingMul: 1,
      ultGainMul: 1,
      waveScoreMul: 1,
    };
    for (const { def, level } of entries) {
      config.levels[def.id] = level;
      config.scoreMul += (def.scoreMul - 1) * level;
      config.techPer5 += (def.techPer5 || 0) * level;
      for (const field of ['hpMul', 'bossHpMul', 'bulletSpeedMul', 'fireIntervalMul', 'speedMul', 'waveCountMul', 'waveScoreMul', 'damageMul', 'enemyBulletRadiusMul', 'healingMul', 'ultGainMul']) {
        const levelCurve = def[`${field}Levels`];
        if (levelCurve) config[field] *= levelCurve[level] || 1;
        else if (def[field] != null) config[field] *= Math.pow(def[field], level);
      }
    }
    config.scoreMul = Math.round(config.scoreMul * 100) / 100;
    config.name = entries.map(({ def, level }) => `${def.name} Lv.${level}`).join('、');
    config.totalLevels = entries.reduce((sum, entry) => sum + entry.level, 0);
    return config;
  }

  function formatRunTime(seconds) {
    const total = Math.max(0, Math.floor(Number(seconds) || 0));
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor(total % 3600 / 60);
    const secs = total % 60;
    return hours > 0
      ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      : `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function endlessHealingMultiplier(run = state) {
    if (!run || !run.endless || run.wave < ENDLESS_HEALING_START_WAVE) return 1;
    const steps = Math.floor((run.wave - ENDLESS_HEALING_START_WAVE) / 5) + 1;
    return Math.max(ENDLESS_HEALING_FLOOR, 1 - steps * ENDLESS_HEALING_STEP);
  }

  function healPlayer(player, amount) {
    if (!player || amount <= 0 || player.hp >= player.maxHp) return 0;
    const affixHealingMul = state && state.affix ? state.affix.healingMul : 1;
    const contractHealingMul = state && state.contract ? state.contract.healingMul : 1;
    const healingMul = affixHealingMul * endlessHealingMultiplier(state) * contractHealingMul;
    const before = player.hp;
    player.hp = Math.min(player.maxHp, player.hp + amount * healingMul);
    const healed = player.hp - before;
    if (healed > 0) markHud();
    return healed;
  }

  // 血溢护盾上限：随当前 maxHp 动态计算（避免血量加成后上限停留在旧值导致盾不再增长）
  function overflowShieldCapFor(player) {
    if (!player || !(player.overflowShieldCap > 0)) return 0;
    return Math.max(1, Math.round(player.maxHp * meta.levels.lifesteal * 0.08));
  }

  function grantUltimateEnergy(player, amount) {
    if (!player || amount <= 0) return 0;
    const gainMul = (player.ultGainMul || 1) * (state && state.affix ? state.affix.ultGainMul : 1);
    const before = player.ultEnergy;
    player.ultEnergy = Math.min(player.ultMax, player.ultEnergy + amount * gainMul);
    return player.ultEnergy - before;
  }

  function markHud() {
    if (state) state.hudDirty = true;
  }

  function addLog(text) {
    const div = document.createElement('div');
    div.textContent = text;
    els.logList.appendChild(div);
    while (els.logList.children.length > 4) {
      els.logList.firstElementChild.remove();
    }
  }

  function makeStars() {
    return Array.from({ length: 130 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() < 0.2 ? 2 : 1,
      z: 0.2 + Math.random() * 0.8,
    }));
  }

  function branchLevel(branchId) {
    const branch = TALENT_BRANCHES.find((item) => item.id === branchId);
    if (!branch) return 0;
    return branch.talentIds.reduce((sum, id) => sum + (meta.levels[id] || 0), 0);
  }

  function applyBranchMilestones(p) {
    if (branchLevel('offense') >= 10) p.rows = Math.min(3, p.rows + 1);
    if (branchLevel('offense') >= 20) p.pierce += 0.4;
    if (branchLevel('survival') >= 20) {
      p.maxHp += 30;
      p.hp = p.maxHp;
    }
    if (branchLevel('energy') >= 10) p.ultGainMul += 0.2;
    if (branchLevel('energy') >= 20) p.bombs += 1;
    if (branchLevel('chaos') >= 5) p.chainChance = Math.min(1, p.chainChance + 0.1);
    if (branchLevel('chaos') >= 10) p.plunderChance = Math.min(1, p.plunderChance + 0.1);
  }

  function newPlayer() {
    const metaDamage = 1 + meta.levels.damage * 0.045;
    const metaRate = 1 + meta.levels.rate * 0.02;
    const metaSpeed = 1 + meta.levels.speed * 0.02;
    const build = buildById(meta.selectedBuild);
    const baseMaxHp = Math.round(130 * (1 + meta.levels.hp * 0.05) * (build.maxHpMul || 1));
    const buildCritChance = Math.min(
      build.maxCritChance || 0.6,
      meta.levels.crit * 0.015 + (build.critChance || 0)
    );
    const player = {
      x: W / 2,
      y: H - 84,
      r: 48,
      hp: baseMaxHp,
      maxHp: baseMaxHp,
      baseSpeedRef: Math.round(250 * metaSpeed),
      speed: Math.round(250 * metaSpeed),
      speedBonus: 0,
      endlessSpeedBonus: 0,
      speedBroke: false,
      damage: Math.max(1, Math.round(12 * metaDamage * (build.damageMul || 1))),
      baseDamageRef: Math.max(1, Math.round(12 * metaDamage * (build.damageMul || 1))),
      baseHpRef: baseMaxHp,
      fireInterval: Math.max(0.045, Math.round(0.17 / metaRate / (build.fireRateMul || 1) * 1000) / 1000),
      rows: 1,
      barrelBroke: false,
      scatter: false,
      droneCount: build.droneCount || 0,
      droneBroke: false,
      droneShareMul: build.droneShareMul || 1,
      dronePower: 1,
      droneKillPower: build.droneKillPower || 0,
      critKillPower: build.critKillPower || 0,
      levelDamageBonus: build.levelDamageBonus || 0,
      counterEnemyHpRatio: build.counterEnemyHpRatio || 0,
      stunChance: meta.levels.overload * 0.03,
      shield: 0,
      shieldTimer: 0,
      overflowShieldCap: Math.round(baseMaxHp * meta.levels.lifesteal * 0.08),
      shieldRegen: 0,
      armorBuffBonus: 0,
      armorBroke: false,
      regenBuffBonus: 0,
      regenBroke: false,
      lifeBuffBonus: 0,
      lifeBroke: false,
      magnetDuration: 0,
      burnDurationBonus: 0,
      burnDpsBonus: 0,
      independentDamageBonus: 0,
      shieldRegenTimer: 20,
      magnetOnKill: false,
      magnetTimer: 0,
      magnetCd: 0,
      bombCd: 0,
      frenzyTimer: 0,
      frenzyDuration: 0,
      frenzyRateBonus: 0,
      core: null,
      arcCd: 0,
      beamTick: 0,
      overloadTimer: 0,
      overloadCd: 0,
      executeMul: 0,
      splitChance: 0,
      bulletSizeLevel: 0,
      bulletSizeBonus: 0,
      bulletSizeBroke: false,
      baseLevel: 1,
      basePicks: 0,
      basePicksAmount: 0,
      baseDamageBonus: 0,
      special: { slow: 0, burn: 0, blast: 0, homing: 0 },
      pierce: meta.levels.pierce * 0.15,
      jamDuration: 0,
      critChance: buildCritChance,
      critDamage: 1.5 + meta.levels.crit * 0.04,
      critBonusMul: build.critBonusMul || 1,
      maxCritChance: build.maxCritChance || 0.6,
      maxHpDamage: build.maxHpDamage || 0,
      buildId: build.id,
      buildName: build.name,
      counterDamage: build.counterDamage || 0,
      counterHpRatio: build.counterHpRatio || 0,
      counterRadius: build.counterRadius || 0,
      counterCooldown: build.counterCooldown || 1,
      counterTimer: 0,
      ultHitChance: meta.levels.autoUlt * 0.002,
      chainChance: meta.levels.chain * 0.03,
      recoverChance: meta.levels.recover * 0.08,
      recoverCooldown: 0,
      dodgeChance: (build.dodgeChanceBase || 0) + meta.levels.dodge * 0.04,
      plunderChance: meta.levels.plunder * 0.05,
      bombs: 3,
      bombRegenTimer: 0,
      bombRegenInterval: meta.levels.bomb > 0 ? Math.max(70, 120 - meta.levels.bomb * 5) : 0,
      ultEnergy: 30,
      ultMax: ULT_MAX_ENERGY,
      ultGainMul: 1 + meta.levels.ult * 0.1,
      ultShield: 0,
      ultRate: 0,
      ultAutoCd: 0,
      ultRegenTimer: 0,
      regen: Math.round((meta.levels.regen * 0.8 + (build.regen || 0)) * 10) / 10,
      lifesteal: build.lifesteal || 0,
      fireTimer: 0.45,
      invuln: 0,
      tilt: 0,
      level: 1,
      exp: 0,
      xpNext: 60,
      upgrades: {},
      gold: {},
      timeRiftTimer: 0,
      timeRiftActive: 0,
      dashUnlocked: false,
      dashCd: 0,
      dashTimer: 0,
    };
    applyBranchMilestones(player);
    return player;
  }

  function renderMetaMenu() {
    const points = meta.points;
    els.metaPointsValue.textContent = points;
    if (els.treePointsValue) els.treePointsValue.textContent = points;
    const totalMax = META_UPGRADES.reduce((sum, def) => sum + def.max, 0);
    const totalLevel = META_UPGRADES.reduce((sum, def) => sum + (meta.levels[def.id] || 0), 0);
    if (els.treeMaxValue) els.treeMaxValue.textContent = `${totalLevel}/${totalMax}`;
    if (totalMax > 0) {
      const treeProgress = Math.round(totalLevel / totalMax * 100);
      els.talentTreeOverlay.style.setProperty('--tree-progress', `${treeProgress}%`);
    }
    if (els.talentTreeResetBtn) {
      const hasLevels = totalLevel > 0;
      const canReset = hasLevels && meta.rewardPoints >= TALENT_RESET_COST;
      els.talentTreeResetBtn.disabled = !canReset;
      els.talentTreeResetBtn.title = canReset
        ? `花费 ${TALENT_RESET_COST} 奖励积分，返还全部已投入天赋点`
        : hasLevels
          ? `需要 ${TALENT_RESET_COST} 奖励积分`
          : '尚未投入天赋点';
    }
    els.metaList.replaceChildren();

    if (totalLevel >= totalMax) {
      const maxBadge = document.createElement('div');
      maxBadge.className = 'tree-max-badge';
      maxBadge.textContent = '天赋树已满级';
      els.metaList.appendChild(maxBadge);
    }

    const tree = document.createElement('div');
    tree.className = 'talent-tree-grid';
    for (const branch of TALENT_BRANCHES) {
      const branchTotal = branchLevel(branch.id);
      const section = document.createElement('section');
      section.className = 'talent-branch';
      section.dataset.branch = branch.id;

      const branchMax = branch.talentIds.reduce(
        (sum, id) => sum + (META_UPGRADES.find((upgrade) => upgrade.id === id)?.max || 0),
        0
      );
      const branchProgress = branchMax > 0 ? Math.round(branchTotal / branchMax * 100) : 0;

      const head = document.createElement('div');
      head.className = 'talent-branch-head';
      const branchIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      branchIcon.setAttribute('class', 'icon talent-branch-icon');
      branchIcon.setAttribute('aria-hidden', 'true');
      const branchUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      branchUse.setAttribute('href', branch.icon);
      branchIcon.appendChild(branchUse);

      const titleWrap = document.createElement('div');
      titleWrap.className = 'talent-branch-title';
      const name = document.createElement('h3');
      name.textContent = `${branch.name} ${branchTotal}/${branchMax}`;
      const milestoneStrip = document.createElement('div');
      milestoneStrip.className = 'talent-milestones';
      for (const milestone of branch.milestones) {
        const chip = document.createElement('span');
        chip.className = 'talent-milestone-chip';
        const unlocked = branchTotal >= milestone.level;
        chip.classList.toggle('unlocked', unlocked);
        const chipTitle = document.createElement('span');
        chipTitle.textContent = `${unlocked ? '已解锁 ' : ''}${milestone.level}级 ${milestone.name}`;
        const chipEffect = document.createElement('span');
        chipEffect.className = 'talent-milestone-effect';
        chipEffect.textContent = `：${milestone.desc}`;
        chip.append(chipTitle, chipEffect);
        milestoneStrip.appendChild(chip);
      }
      // 分支数值总揽：当前已激活的天赋加成 + 已解锁里程碑效果
      const summary = document.createElement('div');
      summary.className = 'talent-branch-summary';
      const activeParts = [];
      for (const def of META_UPGRADES.filter((upgrade) => branch.talentIds.includes(upgrade.id))) {
        const level = meta.levels[def.id] || 0;
        if (level <= 0) continue;
        activeParts.push(`${def.name} ${metaUpgradeEffectText(def, level)}`);
      }
      for (const milestone of branch.milestones) {
        if (branchTotal < milestone.level) continue;
        activeParts.push(`里程碑·${milestone.name}（${milestone.desc}）`);
      }
      summary.textContent = activeParts.length
        ? `当前加成：${activeParts.join(' · ')}`
        : '当前加成：无（尚未激活）';
      titleWrap.append(name, milestoneStrip, summary);
      head.append(branchIcon, titleWrap);
      section.appendChild(head);

      const progress = document.createElement('div');
      progress.className = 'talent-branch-progress';
      progress.style.setProperty('--branch-progress', `${branchProgress}%`);
      section.appendChild(progress);

      const nodeGrid = document.createElement('div');
      nodeGrid.className = 'talent-node-grid';
      for (const def of META_UPGRADES.filter((upgrade) => branch.talentIds.includes(upgrade.id))) {
        const current = Math.min(meta.levels[def.id] || 0, def.max);
        const maxed = current >= def.max;
        const next = Math.min(current + 1, def.max);
        const currentEffect = metaUpgradeEffectText(def, current);
        const nextEffect = metaUpgradeEffectText(def, next);
        const cost = def.cost || 1;
        const canAffordBulk = def.max >= 10 && points >= cost && !maxed && cost === 1;
        const row = document.createElement('div');
        row.className = 'meta-row';
        row.dataset.nodeId = def.id;
        row.style.setProperty('--node-progress', `${Math.round(current / def.max * 100)}%`);

        const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        icon.setAttribute('class', 'icon');
        icon.setAttribute('aria-hidden', 'true');
        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        use.setAttribute('href', def.icon);
        icon.appendChild(use);

        const main = document.createElement('div');
        main.className = 'meta-main';
        const title = document.createElement('h3');
        title.textContent = `${def.name} Lv.${current}/${def.max}`;
        const desc = document.createElement('p');
        const effectLine = current > 0
          ? `当前累计 ${currentEffect}`
          : `下一级 ${nextEffect}`;
        desc.textContent = `${def.desc} · 每级 ${cost} 天赋点 · ${effectLine}`;
        const levelTrack = document.createElement('span');
        levelTrack.className = 'meta-level-track';
        const levelFill = document.createElement('i');
        levelFill.style.width = `${Math.round(current / def.max * 100)}%`;
        levelTrack.appendChild(levelFill);
        main.append(title, desc, levelTrack);

        const buttons = document.createElement('div');
        buttons.className = 'meta-actions';
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'meta-btn';
        button.disabled = maxed || points < cost;
        button.textContent = maxed ? '满级' : current === 0 ? `${cost}点解锁` : `${cost}点升级`;
        button.addEventListener('click', () => buyMetaUpgrade(def.id));
        buttons.appendChild(button);

        if (canAffordBulk) {
          const bulkButton = document.createElement('button');
          bulkButton.type = 'button';
          bulkButton.className = 'meta-btn bulk-meta-btn';
          const affordable = Math.min(10, points, def.max - current);
          bulkButton.textContent = `+${affordable} 级`;
          bulkButton.title = '花费 10 天赋点，一次提升 10 级';
          bulkButton.addEventListener('click', () => buyMetaUpgrade(def.id, 10));
          buttons.appendChild(bulkButton);
        }

        row.append(icon, main, buttons);
        nodeGrid.appendChild(row);
      }
      section.appendChild(nodeGrid);
      tree.appendChild(section);
    }
    els.metaList.appendChild(tree);
  }

  function metaUpgradeEffectText(def, level) {
    if (def.id === 'damage') return `+${Math.round(level * 4.5)}%`;
    if (def.id === 'rate') return `+${Math.round(level * 2)}%`;
    if (def.id === 'speed') return `+${Math.round(level * 2)}%`;
    if (def.id === 'hp') return `+${Math.round(level * 5)}% 生命`;
    if (def.id === 'regen') return `+${Math.round(level * 0.8 * 10) / 10}/秒`;
    if (def.id === 'crit') return `+${Math.round(level * 1.5)}%暴击 +${Math.round(level * 4)}%暴伤`;
    if (def.id === 'pierce') return `+${Math.round(level * 0.15 * 100) / 100} 穿透`;
    if (def.id === 'bomb') return level > 0 ? `每 ${120 - level * 5} 秒 +1 炸弹` : '未生效';
    if (def.id === 'ult') return `获取 +${level * 10}%`;
    if (def.id === 'autoUlt') return `${level * 0.2}% 概率`;
    if (def.id === 'overload') return `眩晕 ${level * 3}%`;
    if (def.id === 'chain') return `${level * 3}% 连锁`;
    if (def.id === 'recover') return `${level * 8}% 修复·15s`;
    if (def.id === 'dodge') return `${level * 4}% 闪避`;
    if (def.id === 'plunder') return `${level * 5}% 经验`;
    if (def.id === 'lifesteal') return `护盾上限+${level * 8}%`;
    if (def.id === 'orangeLuck') return `橙色概率 +${level}%`;
    return `${level} 级`;
  }

  function buildById(id) {
    return BUILD_PRESETS.find((build) => build.id === id) || BUILD_PRESETS[0];
  }

  function renderBuildMenu() {
    if (!els.buildList) return;
    els.buildList.replaceChildren();
    const selected = buildById(meta.selectedBuild);
    if (els.buildSummary) {
      els.buildSummary.textContent = selected.name;
    }
    for (const build of BUILD_PRESETS) {
      const active = build.id === selected.id;
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'build-card';
      card.classList.toggle('selected', active);
      card.setAttribute('aria-pressed', active ? 'true' : 'false');

      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('class', 'icon');
      icon.setAttribute('aria-hidden', 'true');
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('href', build.icon);
      icon.appendChild(use);

      const main = document.createElement('span');
      main.className = 'build-main';
      const title = document.createElement('strong');
      title.textContent = build.name;
      const desc = document.createElement('span');
      desc.textContent = build.desc;
      main.append(title, desc);
      card.append(icon, main);
      card.addEventListener('click', () => {
        meta.selectedBuild = build.id;
        saveMeta();
        renderBuildMenu();
        playSound('level');
      });
      els.buildList.appendChild(card);
    }
  }

  function skinById(id) {
    return PLAYER_SKINS.find((skin) => skin.id === id) || PLAYER_SKINS[0];
  }

  let selectedSkinCache = null;
  function getSelectedSkin() {
    if (!selectedSkinCache || selectedSkinCache.id !== meta.selectedSkin) {
      selectedSkinCache = skinById(meta.selectedSkin);
    }
    return selectedSkinCache;
  }

  function renderSkinMenu() {
    resetSkinConfirm();
    els.rewardPointsValue.textContent = meta.rewardPoints;
    els.skinList.replaceChildren();
    for (const skin of PLAYER_SKINS) {
      const owned = meta.ownedSkins.includes(skin.id);
      const selected = meta.selectedSkin === skin.id;
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'skin-card';
      card.classList.toggle('owned', owned);
      card.classList.toggle('selected', selected);
      card.setAttribute('aria-pressed', selected ? 'true' : 'false');

      const preview = document.createElement('canvas');
      preview.className = 'skin-preview';
      preview.width = 72;
      preview.height = 62;
      const previewCtx = preview.getContext('2d');
      previewCtx.drawImage(ensurePlayerSkinSprite(skin.id), 0, 0, PLAYER_SPRITE_SIZE, PLAYER_SPRITE_SIZE, 0, -5, 72, 72);

      const main = document.createElement('span');
      main.className = 'skin-main';
      const title = document.createElement('strong');
      title.textContent = skin.name;
      const desc = document.createElement('span');
      desc.textContent = skin.desc;
      const action = document.createElement('span');
      action.className = 'skin-action';
      if (selected) action.textContent = '使用中';
      else if (owned) action.textContent = '点击装备';
      else action.textContent = `${skin.price} 积分`;
      main.append(title, desc, action);
      card.append(preview, main);

      card.disabled = !owned && meta.rewardPoints < skin.price;
      card.addEventListener('click', () => onSkinCardClick(card, skin));
      els.skinList.appendChild(card);
    }
  }

  // 皮肤购买二次确认：未拥有的皮肤首次点击进入"确认购买"状态，再次点击才扣积分；
  // 只切换 .skin-action 文本与 .confirming 样式，不触碰 canvas 预览（innerHTML 会丢失预览图）
  function resetSkinConfirm() {
    if (skinConfirmTimer) { clearTimeout(skinConfirmTimer); skinConfirmTimer = null; }
    if (skinConfirmCard) {
      const card = skinConfirmCard;
      const action = card.querySelector('.skin-action');
      if (action && action.dataset.orig != null) action.textContent = action.dataset.orig;
      card.classList.remove('confirming');
      skinConfirmCard = null;
    }
  }

  function onSkinCardClick(card, skin) {
    const owned = meta.ownedSkins.includes(skin.id);
    if (owned) {
      buyOrEquipSkin(skin.id);
      return;
    }
    if (meta.rewardPoints < skin.price) return;   // 积分不足：不响应（与软禁用一致）
    if (skinConfirmCard === card) {                // 再次点击：确认购买
      resetSkinConfirm();
      buyOrEquipSkin(skin.id);
      return;
    }
    resetSkinConfirm();                            // 换卡或首次点击：武装当前卡片
    skinConfirmCard = card;
    card.classList.add('confirming');
    const action = card.querySelector('.skin-action');
    if (action) {
      action.dataset.orig = action.textContent;
      action.textContent = '确认购买？';
    }
    skinConfirmTimer = setTimeout(resetSkinConfirm, 2800);
  }

  function buyOrEquipSkin(id) {
    const skin = skinById(id);
    const owned = meta.ownedSkins.includes(skin.id);
    if (!owned) {
      if (meta.rewardPoints < skin.price) return;
      meta.rewardPoints -= skin.price;
      meta.ownedSkins.push(skin.id);
    }
    meta.selectedSkin = skin.id;
    saveMeta();
    renderSkinMenu();
    playSound('level');
  }

  function allAffixesMaxed() {
    return DIFFICULTY_AFFIXES.every((def) => selectedAffixLevel(def.id) === MAX_AFFIX_LEVEL);
  }

  function renderAffixMenu() {
    els.affixList.replaceChildren();
    const config = buildAffixConfig();
    if (els.affixSummary) {
      els.affixSummary.textContent = config
        ? `已选 ${config.totalLevels} 层 · 结算 ×${config.scoreMul.toFixed(2)}`
        : `点击可叠加，单词缀最高 ${MAX_AFFIX_LEVEL} 层`;
    }
    if (els.affixAllBtn) {
      els.affixAllBtn.textContent = allAffixesMaxed() ? '一键取消' : '一键满词缀';
    }

    for (const def of DIFFICULTY_AFFIXES) {
      const level = selectedAffixLevel(def.id);
      const card = document.createElement('div');
      card.className = 'affix-card';
      card.classList.toggle('selected', level > 0);
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-pressed', level > 0 ? 'true' : 'false');
      card.setAttribute('aria-label', `${def.name}，当前 ${level} 层，点击增加一层，满级后点击清除`);
      card.title = `点击叠加；Lv.${MAX_AFFIX_LEVEL} 后再次点击清除`;

      const iconCol = document.createElement('div');
      iconCol.className = 'affix-icon-col';
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('class', 'icon');
      icon.setAttribute('aria-hidden', 'true');
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('href', def.icon);
      icon.appendChild(use);
      const clear = document.createElement('button');
      clear.type = 'button';
      clear.className = 'affix-clear';
      clear.textContent = '取消';
      clear.title = '重置该词缀选择';
      clear.setAttribute('aria-label', `取消 ${def.name}`);
      clear.style.visibility = level > 0 ? 'visible' : 'hidden';
      clear.addEventListener('click', (event) => {
        event.stopPropagation();
        selectedAffixLevels[def.id] = 0;
        renderAffixMenu();
        playSound('level');
      });
      iconCol.append(icon, clear);

      const main = document.createElement('div');
      main.className = 'affix-main';
      const title = document.createElement('h3');
      title.textContent = def.name;
      const levelBadge = document.createElement('span');
      levelBadge.className = 'affix-level';
      levelBadge.textContent = `Lv.${level}/${MAX_AFFIX_LEVEL}`;
      title.appendChild(levelBadge);
      const desc = document.createElement('p');
      desc.textContent = def.desc;
      const reward = document.createElement('span');
      reward.className = 'affix-reward';
      reward.textContent = `每层奖励 +${Math.round((def.scoreMul - 1) * 100)}%`;
      main.append(title, desc, reward);

      card.append(iconCol, main);
      card.addEventListener('click', () => {
        selectedAffixLevels[def.id] = level >= MAX_AFFIX_LEVEL ? 0 : level + 1;
        renderAffixMenu();
        playSound('level');
      });
      card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          card.click();
        }
      });
      els.affixList.appendChild(card);
    }
  }

  function encyclopediaEntries() {
    const entries = [];
    const add = (category, id, name, desc, icon, meta = [], tags = []) => {
      const haystack = [category, name, desc, id, ...tags, ...meta.flat()].join(' ').toLowerCase();
      entries.push({ category, id, name, desc, icon, meta, tags: haystack });
    };

    for (const [type, info] of Object.entries(ENEMY_INFO)) {
      const enemy = ENEMY_TYPES[type];
      const meta = [
        ['生命', enemy.hp],
        ['速度', enemy.speed],
        ['半径', enemy.r],
        ['得分', enemy.score],
        ['经验', enemy.xp],
        ['接触', enemy.contact],
        ['首见', info.firstWave],
      ];
      if (enemy.fire) meta.push(['弹幕', `${enemy.fire.damage} 伤 · ${Math.round(enemy.fire.interval * 10) / 10}s`]);
      add('敌机', type, info.name, info.desc, '#i-target', meta, [type]);
    }

    for (const bossType of Object.keys(BOSS_TYPES)) {
      const cfg = BOSS_TYPES[bossType];
      const info = BOSS_VARIANT_INFO[bossType];
      add('首领', `boss:${bossType}`, info.name, info.desc, '#i-crosshair', [
        ['生命', ENEMY_TYPES.boss.hp * BOSS_HP_MULTIPLIER],
        ['速度', Math.round(ENEMY_TYPES.boss.speed * cfg.speedMul * 10) / 10],
        ['韧性', '100%（免控）'],
        ['首见', info.firstWave],
        ['召唤', `${cfg.summonCount} 架`],
      ], [bossType, cfg.name]);
    }

    for (const def of UPGRADES) {
      const rarityLines = BUFF_RARITIES
        .map((rarity) => `${rarity.name}：${upgradeRarityDesc(def, rarity)}`)
        .join(' / ');
      add('局内增益', def.id, def.name, def.desc, def.icon, [
        ['上限', def.max],
        ['品质明细', rarityLines],
      ], [def.id]);
    }
    for (const def of ENDLESS_UPGRADES) {
      const rarityLines = BUFF_RARITIES
        .map((rarity) => `${rarity.name}：${upgradeRarityDesc(def, rarity)}`)
        .join(' / ');
      add('无尽增益', def.id, def.name, def.desc, def.icon, [
        ['上限', '无限'],
        ['品质明细', rarityLines],
      ], [def.id]);
    }
    for (const def of GOLD_MODULES) {
      add('金色模组', def.id, def.name, def.desc, def.icon, [['获取', '25% 混入升级三选一']], [def.id]);
    }
    for (const def of CORE_TRANSFORMS) {
      add('核心质变', def.id, def.name, def.desc, def.icon, [['获取', `第 ${CORE_TRANSFORM_WAVE} 波三选一，每局限 1 个`]], [def.id]);
    }
    for (const def of ACHIEVEMENTS) {
      const entry = achievementEntry(def.id);
      add('成就', def.id, def.name, def.desc, def.icon, [
        ['状态', entry.unlocked ? '已解锁' : '未解锁'],
      ], [def.id]);
    }
    for (const def of META_UPGRADES) {
      const branch = TALENT_BRANCHES.find((item) => item.id === def.branch);
      add('天赋', def.id, def.name, def.desc, def.icon, [
        ['分支', branch ? branch.name : def.branch],
        ['上限', def.max],
      ], [def.id, def.branch]);
    }
    for (const def of DIFFICULTY_AFFIXES) {
      add('词缀', def.id, def.name, def.desc, def.icon, [['最高', `${MAX_AFFIX_LEVEL} 层`]], [def.id]);
    }
    for (const eventId of SPECIAL_EVENTS) {
      const info = EVENT_INFO[eventId];
      add('事件契约', `event:${eventId}`, info.name, info.desc, '#i-sparkles', [['类型', '特殊波']], [eventId]);
    }
    for (const def of ENDLESS_CONTRACTS) {
      add('事件契约', `contract:${def.id}`, def.name, def.desc, def.icon, [['类型', '无尽契约']], [def.id]);
    }
    for (const def of OBJECTIVE_POOL) {
      add('支线', `objective:${def.id}`, def.name, def.desc, '#i-star', [
        ['奖励', `${def.reward} 分${def.tech ? ` + ${def.tech} 科技点` : ''}`],
      ], [def.id]);
    }
    for (const [ammoId, cfg] of Object.entries(AMMO_TYPES)) {
      const meta = [
        ['倍率', cfg.damage],
        ['速度', cfg.speed],
        ['半径', cfg.radius],
      ];
      if (cfg.slow) meta.push(['减速', `${Math.round(cfg.slow * 100)}% · ${cfg.slowDuration}s`]);
      if (cfg.burnDps) meta.push(['燃烧', `${cfg.burnDuration}s`]);
      if (cfg.blastRadius) meta.push(['范围', cfg.blastRadius]);
      if (cfg.homing) meta.push(['追踪', `${cfg.range} 范围`]);
      add('弹药补给', `ammo:${ammoId}`, `${cfg.name}弹`, `玩家基础弹药的${cfg.name}变体。`, '#i-target', meta, [ammoId]);
    }
    for (const [dropId, cfg] of Object.entries(RESOURCE_DROPS)) {
      add('弹药补给', `drop:${dropId}`, cfg.name, '战斗中掉落的资源补给。', dropId === 'bomb' ? '#i-bomb' : '#i-sparkles', [['类型', dropId]], [dropId]);
    }
    for (const build of BUILD_PRESETS) {
      add('流派机体', build.id, build.name, build.desc, build.icon, [['类型', '开局流派']], [build.id]);
    }
    for (const skin of PLAYER_SKINS) {
      add('流派机体', skin.id, skin.name, skin.desc, '#i-rocket', [
        ['价格', `${skin.price} 积分`],
        ['定位', skin.type],
      ], [skin.id, skin.type]);
    }
    return entries;
  }

  function encyclopediaMatches(entry, query) {
    if (!query) return true;
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    return tokens.every((token) => entry.tags.includes(token));
  }

  function encyclopediaIcon(href) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', href);
    svg.appendChild(use);
    return svg;
  }

  function enemyPreviewSprite(entry) {
    const bossType = entry.id.startsWith('boss:') ? entry.id.slice('boss:'.length) : null;
    const type = bossType ? 'boss' : entry.id;
    const radius = type === 'boss'
      ? ENEMY_TYPES.boss.r
      : (ENEMY_TYPES[type] || ENEMY_TYPES.scout).r;
    return ensureEnemySprite(type, false, radius, bossType);
  }

  function drawEnemyPreviewInto(canvas, entry) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const sprite = enemyPreviewSprite(entry);
    const size = sprite.width;
    const maxSide = Math.min(canvas.width, canvas.height) - 8;
    const scale = Math.max(0.2, Math.min(maxSide / size, 2));
    const drawSize = size * scale;
    ctx.drawImage(
      sprite,
      (canvas.width - drawSize) / 2,
      (canvas.height - drawSize) / 2,
      drawSize,
      drawSize,
    );
  }

  function enemyPreviewCanvas(entry, size = 72) {
    const canvas = document.createElement('canvas');
    canvas.className = 'encyclopedia-preview';
    canvas.width = size;
    canvas.height = size;
    drawEnemyPreviewInto(canvas, entry);
    return canvas;
  }

  function playerSkinPreviewCanvas(skinId, size = 72) {
    const canvas = document.createElement('canvas');
    canvas.className = 'encyclopedia-preview';
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const sprite = ensurePlayerSkinSprite(skinId);
    ctx.drawImage(sprite, (size - PLAYER_SPRITE_SIZE) / 2, (size - PLAYER_SPRITE_SIZE) / 2, PLAYER_SPRITE_SIZE, PLAYER_SPRITE_SIZE);
    return canvas;
  }

  function renderEncyclopedia() {
    const entries = encyclopediaEntries();
    const categories = ['全部', ...new Set(entries.map((entry) => entry.category))];
    if (!categories.includes('兑换码')) categories.push('兑换码');
    els.encyclopediaTabs.replaceChildren();
    for (const category of categories) {
      const tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'encyclopedia-tab';
      tab.classList.toggle('active', category === encyclopediaActiveTab);
      tab.dataset.tab = category;
      tab.textContent = category;
      tab.addEventListener('click', () => {
        encyclopediaActiveTab = category;
        renderEncyclopedia();
      });
      els.encyclopediaTabs.appendChild(tab);
    }

    // 兑换码分类：渲染兑换面板而非卡片列表
    if (encyclopediaActiveTab === '兑换码') {
      renderRedemptionPanel();
      if (els.encyclopediaCount) els.encyclopediaCount.textContent = '';
      const searchRow = els.encyclopediaSearch ? els.encyclopediaSearch.closest('.encyclopedia-search-row') : null;
      if (searchRow) searchRow.classList.add('hidden');
      return;
    }
    const searchRow = els.encyclopediaSearch ? els.encyclopediaSearch.closest('.encyclopedia-search-row') : null;
    if (searchRow) searchRow.classList.remove('hidden');

    const filtered = entries.filter((entry) => (
      (encyclopediaActiveTab === '全部' || entry.category === encyclopediaActiveTab)
      && encyclopediaMatches(entry, encyclopediaQuery)
    ));
    els.encyclopediaList.replaceChildren();
    for (const entry of filtered) {
      const card = document.createElement('article');
      card.className = 'encyclopedia-card';
      card.dataset.id = entry.id;

      const iconBox = document.createElement('span');
      iconBox.className = 'encyclopedia-icon';
      if (entry.category === '敌机' || entry.category === '首领') {
        iconBox.classList.add('has-preview');
        iconBox.appendChild(enemyPreviewCanvas(entry));
      } else if (entry.category === '流派机体' && PLAYER_SKINS.some((skin) => skin.id === entry.id)) {
        iconBox.classList.add('has-preview');
        iconBox.appendChild(playerSkinPreviewCanvas(entry.id));
      } else {
        iconBox.appendChild(encyclopediaIcon(entry.icon));
      }

      const main = document.createElement('div');
      main.className = 'encyclopedia-main';
      const title = document.createElement('strong');
      title.textContent = entry.name;
      const category = document.createElement('span');
      category.className = 'encyclopedia-category';
      category.textContent = entry.category;
      const desc = document.createElement('span');
      desc.className = 'encyclopedia-desc';
      desc.textContent = entry.desc;
      const meta = document.createElement('div');
      meta.className = 'encyclopedia-meta';
      for (const [label, value] of entry.meta) {
        const chip = document.createElement('span');
        chip.textContent = `${label} ${value}`;
        meta.appendChild(chip);
      }
      main.append(title, category, desc, meta);
      card.append(iconBox, main);
      els.encyclopediaList.appendChild(card);
    }
    if (els.encyclopediaCount) {
      els.encyclopediaCount.textContent = `${filtered.length} / ${entries.length}`;
    }
  }

  function renderRedemptionPanel() {
    els.encyclopediaList.replaceChildren();
    const panel = document.createElement('div');
    panel.className = 'redemption-panel';

    const hint = document.createElement('p');
    hint.className = 'redemption-hint';
    hint.textContent = '输入兑换码兑换奖励，每个兑换码每账号限用一次。';

    const row = document.createElement('div');
    row.className = 'redemption-row';
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'redemption-input';
    input.placeholder = '输入兑换码';
    input.maxLength = 24;
    input.autocomplete = 'off';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'action-btn redemption-btn';
    btn.textContent = '兑换';
    const msg = document.createElement('div');
    msg.className = 'redemption-msg';

    const doRedeem = () => {
      const result = redeemCode(input.value);
      msg.textContent = result.text;
      msg.className = `redemption-msg ${result.ok ? 'ok' : 'bad'}`;
      if (result.ok) input.value = '';
    };
    btn.addEventListener('click', doRedeem);
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') doRedeem();
    });
    row.append(input, btn);
    panel.append(hint, row, msg);
    els.encyclopediaList.appendChild(panel);
    input.focus();
  }

  function openEncyclopedia() {
    renderEncyclopedia();
    if (els.encyclopediaSearch) els.encyclopediaSearch.value = encyclopediaQuery;
    els.encyclopediaOverlay.classList.remove('hidden');
  }

  function closeEncyclopedia() {
    els.encyclopediaOverlay.classList.add('hidden');
  }

  function openTutorial() {
    els.tutorialOverlay.classList.remove('hidden');
  }

  function closeTutorial() {
    els.tutorialOverlay.classList.add('hidden');
  }

  function firstSeenKeyForEnemy(enemy) {
    return enemy.type === 'boss' ? `boss:${enemy.bossType}` : enemy.type;
  }

  function findEncyclopediaEntry(id) {
    return encyclopediaEntries().find((entry) => entry.id === id);
  }

  function maybeOpenFirstSeen(enemy) {
    if (!firstSeenEnabled || !state || state.over || state.firstSeenOpen) return;
    const key = firstSeenKeyForEnemy(enemy);
    if (state.seenEnemies.has(key)) return;
    const entry = findEncyclopediaEntry(key);
    if (!entry) return;

    state.seenEnemies.add(key);
    seenEnemyTypes.add(key);
    saveSeenEnemyTypes();
    state.firstSeenEntry = entry;
    state.firstSeenOpen = true;
    if (els.firstSeenKicker) {
      els.firstSeenKicker.textContent = entry.category === '首领' ? '首次遭遇首领' : '首次遭遇';
    }
    if (els.firstSeenPreview) drawEnemyPreviewInto(els.firstSeenPreview, entry);
    els.firstSeenName.textContent = entry.name;
    els.firstSeenDesc.textContent = entry.desc;
    els.firstSeenStats.replaceChildren();
    for (const [label, value] of entry.meta) {
      const stat = document.createElement('div');
      stat.className = 'first-seen-stat';
      const labelEl = document.createElement('span');
      labelEl.textContent = label;
      const valueEl = document.createElement('strong');
      valueEl.textContent = value;
      stat.append(labelEl, valueEl);
      els.firstSeenStats.appendChild(stat);
    }
    els.firstSeenOverlay.classList.remove('hidden');
    markHud();
  }

  function closeFirstSeen() {
    if (!state) return;
    state.firstSeenOpen = false;
    state.firstSeenEntry = null;
    els.firstSeenOverlay.classList.add('hidden');
    paused = false;
  }

  function markAllEnemiesSeen() {
    for (const entry of encyclopediaEntries()) {
      if (entry.category === '敌机' || entry.category === '首领') {
        seenEnemyTypes.add(entry.id);
      }
    }
    saveSeenEnemyTypes();
    if (state) state.seenEnemies = new Set(seenEnemyTypes);
  }

  function clearEnemySeen() {
    seenEnemyTypes = new Set();
    saveSeenEnemyTypes();
    if (state) state.seenEnemies = new Set();
  }

  function buyMetaUpgrade(id, count = 1) {
    const def = META_UPGRADES.find((upgrade) => upgrade.id === id);
    if (!def) return;
    const cost = def.cost || 1;
    const affordable = Math.min(count, Math.floor(meta.points / cost), def.max - (meta.levels[def.id] || 0));
    if (affordable <= 0) return;
    meta.levels[def.id] = (meta.levels[def.id] || 0) + affordable;
    meta.points -= cost * affordable;
    saveMeta();
    renderMetaMenu();
    playSound('level');
  }

  function resetTalentTree() {
    const refunded = META_UPGRADES.reduce((sum, def) => sum + (meta.levels[def.id] || 0), 0);
    if (refunded <= 0 || meta.rewardPoints < TALENT_RESET_COST) return;
    meta.rewardPoints -= TALENT_RESET_COST;
    meta.points += refunded;
    for (const def of META_UPGRADES) {
      meta.levels[def.id] = 0;
    }
    saveMeta();
    renderMetaMenu();
    renderSkinMenu();
    playSound('level');
  }

  function openBattleSetup() {
    if (state) return;
    resumeAudio();
    els.mainMenu.classList.add('hidden');
    els.battleSetupOverlay.classList.remove('hidden');
    renderBuildMenu();
    renderAffixMenu();
  }

  function skipBattleSetup() {
    for (const def of DIFFICULTY_AFFIXES) selectedAffixLevels[def.id] = 0;
    startGame();
  }

  function openMainMenu() {
    state = null;
    paused = false;
    els.shell.classList.add('menu-mode');
    els.mainMenu.classList.remove('hidden');
    els.overlay.classList.add('hidden');
    els.levelUpOverlay.classList.add('hidden');
    els.battleSetupOverlay.classList.add('hidden');
    els.bossRewardOverlay.classList.add('hidden');
    els.bossSelfSelectOverlay.classList.add('hidden');
    els.contractSection.classList.add('hidden');
    els.talentTreeOverlay.classList.add('hidden');
    els.encyclopediaOverlay.classList.add('hidden');
    els.tutorialOverlay.classList.add('hidden');
    els.firstSeenOverlay.classList.add('hidden');
    els.bossWarning.classList.add('hidden');
    els.bossBar.classList.add('hidden');
    hideRunDecisionButtons();
    els.timeValue.textContent = '00:00';
    renderMetaMenu();
    renderBuildMenu();
    renderSkinMenu();
    renderDailyMenu();
    updatePauseIcon();
  }

  function openTalentTree() {
    renderMetaMenu();
    els.talentTreeOverlay.classList.remove('hidden');
  }

  function closeTalentTree() {
    els.talentTreeOverlay.classList.add('hidden');
  }

  function startGame() {
    // 在开局点击手势内创建/恢复音频上下文，避免首个音效在游戏帧（非手势）触发时
    // 上下文以 suspended 创建、resume 被浏览器自动播放策略拒绝 → 全程无声
    try { ensureAudio(); resumeAudio(); } catch (_) {}
    els.shell.classList.remove('menu-mode');
    els.mainMenu.classList.add('hidden');
    els.battleSetupOverlay.classList.add('hidden');
    els.talentTreeOverlay.classList.add('hidden');
    els.encyclopediaOverlay.classList.add('hidden');
    els.tutorialOverlay.classList.add('hidden');
    els.firstSeenOverlay.classList.add('hidden');
    syncCanvasSize();
    state = {
      player: newPlayer(),
      bullets: [],
      playerShotSeq: 0,
      drones: [],
      mirrors: [],
      beamVisual: null,
      enemyBullets: [],
      enemies: [],
      specialDrops: [],
      orbitals: [],
      orbitalClearTimer: 0,
      orbitalClearLeft: 0,
      specialDropTimer: 60,
      particles: [],
      muzzleFlashes: [],
      arcs: [],
      texts: [],
      stars: makeStars(),
      wave: 0,
      spawnQueue: [],
      spawnIndex: 0,
      spawnTimer: 0,
      waveEndTimer: 0,
      waveBanner: null,
      pendingLevels: 0,
      levelUpOpen: false,
      coreTransformPending: false,
      coreTransformOffered: false,
      blastChainActive: false,
      elapsed: 0,
      lastHitSoundAt: -99,
      score: 0,
      kills: 0,
      combo: 0,
      comboMax: 0,
      comboTimer: 0,
      comboTextAt: -10,
      multiKillCount: 0,
      multiKillTimer: 0,
      xpOrbs: [],
      xpPickupSoundAt: -99,
      slowmoTimer: 0,
      slowmoScale: 1,
      convertedTechPoints: 0,
      dailyChallengeKey: null,
      dailyRewardDelta: 0,
      dailyRating: null,
      lastKillSource: null,
      damageDealt: 0,
      metaGained: 0,
      affix: buildAffixConfig(),
      affixRewardScore: 0,
      affixRewardMeta: 0,
      rewardPointsGained: 0,
      rewardPointsBase: 0,
      completionRewardPoints: 0,
      missionComplete: false,
      completionTime: 0,
      endless: false,
      abyss: false,
      checkpointOpen: false,
      lastCheckpointWave: 0,
      displayedSecond: -1,
      specialWaves: Object.create(null),
      specialEvent: null,
      bossWarningTimer: 0,
      lastBossType: null,
      bossType: null,
      shake: 0,
      milestoneRewardPoints: 0,
      ultFlash: null,
      contract: null,
      contractWavesLeft: 0,
      bossRewardPending: false,
      bossChoiceOpen: false,
      bossSelfSelectOpen: false,
      objective: null,
      objectiveProgress: 0,
      objectiveDone: false,
      objectiveFailed: false,
      objectiveSchedule: null,
      objectiveScheduleBlock: -1,
      seenEnemies: new Set(seenEnemyTypes),
      firstSeenOpen: false,
      firstSeenEntry: null,
      waveStartTime: 0,
      over: false,
      hudDirty: true,
      hudTimer: 0,
    };
    paused = false;
    pointerActive = false;
    els.overlay.classList.add('hidden');
    els.levelUpOverlay.classList.add('hidden');
    els.bossRewardOverlay.classList.add('hidden');
    els.bossSelfSelectOverlay.classList.add('hidden');
    els.bossWarning.classList.add('hidden');
    els.bossBar.classList.add('hidden');
    els.menuBtn.classList.add('hidden');
    els.victorySettleBtn.classList.add('hidden');
    els.continueEndlessBtn.classList.add('hidden');
    els.timeValue.textContent = '00:00';
    updatePauseIcon();
    prewarmEnemySprites();
    nextWave();
    addLog('星穹雷霆启动');
    if (state.affix) addLog(`难度词缀激活：${state.affix.totalLevels} 层`);
    logGame('game', `开始 流派=${meta.selectedBuild} 皮肤=${meta.selectedSkin} 难度=${state.affix ? state.affix.totalLevels : 0}层`);
  }

  // ===== 调试日志工具（F8 开合面板，错误自动记录并持久化）=====
  const DEBUG_LOG_MAX = 600;
  const debugLogs = [];
  let logOverlayEl = null;
  let logOverlayVisible = false;

  function logGame(tag, ...args) {
    let msg;
    try {
      msg = args.map((item) => (item && typeof item === 'object' ? JSON.stringify(item) : String(item))).join(' ');
    } catch {
      msg = String(args[0]);
    }
    const entry = {
      t: state && state.elapsed != null ? Math.round(state.elapsed * 10) / 10 : null,
      tag,
      msg,
    };
    debugLogs.push(entry);
    if (debugLogs.length > DEBUG_LOG_MAX) debugLogs.splice(0, debugLogs.length - DEBUG_LOG_MAX);
    try { console.debug(`[${tag}]`, msg); } catch {}
    return entry;
  }

  function persistDebugLogs() {
    try {
      localStorage.setItem('thunderStrikeDebugLog', JSON.stringify(debugLogs.slice(-200)));
    } catch {}
  }

  function restoreDebugLogs() {
    try {
      const raw = localStorage.getItem('thunderStrikeDebugLog');
      if (raw) {
        const saved = JSON.parse(raw);
        if (Array.isArray(saved)) {
          debugLogs.push(...saved.slice(-DEBUG_LOG_MAX));
          logGame('tool', `已载入上次会话 ${saved.length} 条日志`);
        }
      }
    } catch {}
  }

  function escapeLogText(text) {
    return String(text).replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[ch]));
  }

  function renderLogOverlay() {
    if (!logOverlayEl) return;
    const rows = debugLogs.slice(-80).map((entry) => {
      const time = entry.t == null ? '  --  ' : String(entry.t).padStart(6, ' ');
      return `<div><span style="color:#6b8">${time}s</span> <span style="color:#8af">[${escapeLogText(entry.tag)}]</span> <span>${escapeLogText(entry.msg)}</span></div>`;
    }).join('');
    logOverlayEl.innerHTML = rows;
    logOverlayEl.scrollTop = logOverlayEl.scrollHeight;
  }

  function toggleLogOverlay() {
    if (!logOverlayEl) {
      logOverlayEl = document.createElement('div');
      logOverlayEl.id = 'debugLogOverlay';
      logOverlayEl.style.cssText = 'position:fixed;right:12px;bottom:12px;width:540px;max-height:46vh;overflow:auto;z-index:9999;background:rgba(8,10,20,.93);color:#9fe8b4;font:11px/1.5 monospace;padding:8px 10px;border:1px solid #3a6;border-radius:8px;white-space:pre-wrap;box-sizing:border-box;';
      document.body.appendChild(logOverlayEl);
    }
    logOverlayVisible = !logOverlayVisible;
    logOverlayEl.style.display = logOverlayVisible ? 'block' : 'none';
    if (logOverlayVisible) renderLogOverlay();
    logGame('tool', `日志面板${logOverlayVisible ? '打开' : '关闭'}`);
  }

  window.addEventListener('error', (event) => {
    logGame('error', event.message, event.filename ? `${event.filename}:${event.lineno}` : '');
    persistDebugLogs();
  });
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason && event.reason.message ? event.reason.message : String(event.reason);
    logGame('error', 'unhandledrejection', reason);
    persistDebugLogs();
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'F8') {
      event.preventDefault();
      toggleLogOverlay();
    }
  });
  restoreDebugLogs();

  function specialWavesForBlock(block) {
    if (!state.specialWaves[block]) {
      const start = block * 50 + 1;
      const pool = Array.from({ length: 50 }, (_, index) => start + index);
      const count = 5 + Math.floor(Math.random() * 6);
      state.specialWaves[block] = shuffle(pool).slice(0, count);
    }
    return state.specialWaves[block];
  }

  function objectiveWavesForBlock(block) {
    const base = block * 50;
    const count = 6 + Math.floor(Math.random() * 7);
    const pool = Array.from({ length: 49 }, (_, index) => base + 2 + index);
    const waves = [];
    while (waves.length < count && pool.length) {
      const pick = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
      if (waves.every((wave) => Math.abs(wave - pick) >= 3)) waves.push(pick);
    }
    waves.sort((a, b) => a - b);
    return waves;
  }

  function buildWave(wave) {
    const queue = [];
    const specialThisWave = state.specialEvent != null;

    if (wave % 5 === 0) {
      queue.push({ type: 'boss', delay: BOSS_WARNING_DURATION });
      const escorts = Math.min(3 + Math.floor(wave / 5), 8);
      for (let i = 0; i < escorts; i++) {
        queue.push({ type: i % 2 === 0 ? 'scout' : 'striker', delay: (1.1 + i * 0.5) * SPAWN_DELAY_SCALE });
      }
      if (specialThisWave) {
        if (state.specialEvent === 'meteor') {
          queue.push({ type: 'meteor', delay: 2.8 });
          queue.push({ type: 'meteor', delay: 3.4 });
          queue.push({ type: 'special', delay: 4.4 });
        } else if (state.specialEvent === 'convoy') {
          queue.push({ type: 'special', delay: 3.2 });
          queue.push({ type: 'scout', delay: 4.0 });
        } else if (state.specialEvent === 'splitter') {
          queue.push({ type: 'twin', delay: 3.0, splitter: true });
          queue.push({ type: 'twin', delay: 3.7, splitter: true });
          queue.push({ type: 'special', delay: 4.6 });
        } else {
          queue.push({ type: 'special', delay: 3.6 });
        }
      }
      const eliteLevel = affixLevel(state.affix, 'elite');
      for (let i = 0; i < eliteLevel; i++) {
        queue.push({ type: pickEnemyType(wave), delay: 1.65 + i * 0.2, elite: true });
      }
      queue.sort((a, b) => a.delay - b.delay);
      return queue;
    }

    const affix = state.affix;
    const contractCountMul = state.contract && state.contract.waveCountMul ? state.contract.waveCountMul : 1;
    const count = Math.min(Math.ceil((8 + Math.floor((wave - 1) * 2.2)) * (affix && affix.waveCountMul ? affix.waveCountMul : 1) * contractCountMul * metaPressure().count), 30);
    let delay = 0.35 * SPAWN_DELAY_SCALE;
    for (let i = 0; i < count; i++) {
      queue.push({ type: pickEnemyType(wave), delay });
      delay += (0.18 + Math.random() * 0.42) * SPAWN_DELAY_SCALE;
    }
    if (specialThisWave) {
      if (state.specialEvent === 'meteor') {
        queue.push({ type: 'meteor', delay: 1.2 });
        queue.push({ type: 'meteor', delay: 2.0 });
        queue.push({ type: 'special', delay: 3.2 });
      } else if (state.specialEvent === 'convoy') {
        queue.push({ type: 'special', delay: 1.4 });
        queue.push({ type: 'scout', delay: 2.1 });
        queue.push({ type: 'striker', delay: 2.9 });
      } else if (state.specialEvent === 'splitter') {
        queue.push({ type: 'twin', delay: 1.2, splitter: true });
        queue.push({ type: 'twin', delay: 2.0, splitter: true });
        queue.push({ type: 'special', delay: 3.4 });
      } else {
        queue.push({ type: 'special', delay: randRange(1.0, 2.05) });
      }
    }
    const eliteLevel = affixLevel(affix, 'elite');
    if (eliteLevel > 0) {
      const eliteCount = eliteLevel + (wave >= 10 ? 1 : 0);
      for (let i = 0; i < eliteCount; i++) {
        queue.push({ type: pickEnemyType(wave), delay: randRange(0.65, 1.05) + i * 0.18, elite: true });
      }
    }
    queue.sort((a, b) => a.delay - b.delay);
    return queue;
  }

  function pickEnemyType(wave) {
    const pool = [['scout', 4]];
    if (wave >= 2) pool.push(['striker', 3]);
    if (wave >= 3) pool.push(['twin', 2]);
    if (wave >= 4) pool.push(['brute', 2]);
    if (wave >= 5) pool.push(['ace', 2]);
    if (wave >= 6) pool.push(['twin', 2], ['striker', 2]);
    if (wave >= 7) pool.push(['brute', 2], ['ace', 2]);
    if (wave >= 9) pool.push(['brute', 2], ['twin', 1]);

    const total = pool.reduce((sum, entry) => sum + entry[1], 0);
    let roll = Math.random() * total;
    for (const [name, weight] of pool) {
      roll -= weight;
      if (roll <= 0) return name;
    }
    return 'scout';
  }

  function nextWave() {
    if (state.wave > 0 && state.player.hp > 0 && state.player.hp < state.player.maxHp) {
      const repair = Math.max(5, Math.round(state.player.maxHp * 0.05));
      healPlayer(state.player, repair);
    }
    if (state.wave > 0 && branchLevel('survival') >= 10 && state.player.hp > 0 && state.player.hp < state.player.maxHp) {
      const repair = Math.max(5, Math.round(state.player.maxHp * 0.05));
      healPlayer(state.player, repair);
    }
    state.wave++;
    // BOSS 波：本波开始时确定 BOSS 类型（随机、不重复上一只），预警与生成共用
    state.bossType = null;
    if (state.wave % 5 === 0) state.bossType = bossTypeForWave(state.wave);
    if (state.wave === CORE_TRANSFORM_WAVE && !state.coreTransformOffered) {
      state.coreTransformPending = true;
    }
    logGame('wave', `第 ${state.wave} 波`);
    if (state.wave === MISSION_FINAL_WAVE && !state.missionComplete) {
      const p = state.player;
      const healed = healPlayer(p, Math.round(p.maxHp * 0.4));
      p.bombs = Math.min(5, p.bombs + 1);
      addLog(healed > 0 ? `最终决战补给：修复 ${Math.round(healed)}，炸弹 +1` : '最终决战补给：炸弹 +1');
    }
    const isSpecialWave = specialWavesForBlock(Math.floor((state.wave - 1) / 50)).includes(state.wave);
    state.specialEvent = isSpecialWave
      ? SPECIAL_EVENTS[Math.floor(Math.random() * SPECIAL_EVENTS.length)]
      : null;
    const objectiveBlock = Math.floor((state.wave - 1) / 50);
    if (state.objectiveScheduleBlock !== objectiveBlock) {
      state.objectiveSchedule = objectiveWavesForBlock(objectiveBlock);
      state.objectiveScheduleBlock = objectiveBlock;
    }
    if (state.objectiveSchedule.includes(state.wave)) {
      state.objective = OBJECTIVE_POOL[Math.floor(Math.random() * OBJECTIVE_POOL.length)];
      state.objectiveProgress = 0;
      state.objectiveDone = false;
      state.objectiveFailed = false;
    } else {
      state.objective = null;
      state.objectiveProgress = 0;
      state.objectiveDone = false;
      state.objectiveFailed = false;
    }
    state.waveStartTime = state.elapsed;
    state.spawnQueue = buildWave(state.wave);
    state.spawnIndex = 0;
    state.spawnTimer = 0;
    state.waveEndTimer = 0;
    const bannerText = state.wave === MISSION_FINAL_WAVE
      ? '最终决战 · 第 10 波'
      : state.abyss
        ? `无尽深渊 第 ${state.wave} 波`
        : state.endless
          ? `无尽 第 ${state.wave} 波`
          : `第 ${state.wave}/${MISSION_FINAL_WAVE} 波`;
    state.waveBanner = { text: bannerText, t: 2 };
    if (state.wave % 5 === 0) {
      state.bossWarningTimer = BOSS_WARNING_DURATION;
      const bossType = bossTypeForWave(state.wave);
      els.bossWarningText.textContent = state.wave === MISSION_FINAL_WAVE
        ? `最终 BOSS ${bossNameForWave(state.wave)} 即将降临 ${BOSS_WARNING_DURATION}秒`
        : `BOSS ${bossNameForWave(state.wave)} 即将降临 ${BOSS_WARNING_DURATION}秒`;
      if (els.bossWarningPreview) drawEnemyPreviewInto(els.bossWarningPreview, { id: `boss:${bossType}` });
      els.bossWarning.classList.remove('hidden');
    }
    playSound('wave');
    addLog(state.wave === MISSION_FINAL_WAVE ? '最终决战开始' : `第 ${state.wave} 波来袭`);
    if (state.specialEvent) {
      const eventNames = { meteor: '陨石带', convoy: '补给舰队', splitter: '分裂母舰' };
      addLog(`特殊波事件：${eventNames[state.specialEvent] || state.specialEvent}`);
    }
    if (state.objective) {
      const techText = state.objective.tech ? ` +${state.objective.tech} 科技点` : '';
      addLog(`支线目标：${state.objective.name}（${state.objective.desc}）奖励 ${state.objective.reward} 分${techText}`);
    }
    markHud();
  }

  function bossHpScale(wave) {
    if (wave === 5) return 1.52;
    if (wave <= 9) return 1.52 + (wave - 5) * 0.345;
    if (wave <= 15) return 2.9 + (wave - 10) * 0.58;
    if (wave <= 20) return 5.8 + (wave - 15) * 0.536;
    return 8.48 + (wave - 20) * 0.7;
  }

  // BOSS 类型：当前波若已定（state.bossType）则复用，保证预警预览与实际生成一致；
  // 首 BOSS（第 5 波）固定装甲要塞，第 10 波起随机且不重复上一只（state.lastBossType）
  function bossTypeForWave(wave) {
    if (state && state.bossType) return state.bossType;
    if (wave <= 5) return 'warlord';
    const ids = Object.keys(BOSS_TYPES);
    const pool = ids.filter((id) => id !== (state ? state.lastBossType : null));
    return pool[Math.floor(Math.random() * pool.length)] || ids[0];
  }

  function bossNameForWave(wave) {
    return BOSS_TYPES[bossTypeForWave(wave)].name;
  }

  function bossFireIntervalScale(wave, affix) {
    let scale = wave === 5 ? 1.25 : wave < 10 ? 0.95 : wave < 15 ? 0.95 : wave < 20 ? 0.8 : 0.68;
    const barrageLevel = affixLevel(affix, 'barrage');
    if (barrageLevel > 0) scale *= Math.pow(0.82, barrageLevel);
    return scale;
  }

  function metaPressure() {
    const totalMax = META_UPGRADES.reduce((sum, def) => sum + def.max, 0);
    const totalLevel = META_UPGRADES.reduce((sum, def) => sum + (meta.levels[def.id] || 0), 0);
    const p = totalMax > 0 ? Math.min(1, totalLevel / totalMax) : 0;
    const b = activeBalanceVariant && activeBalanceVariant.pressure
      ? activeBalanceVariant.pressure
      : {};
    return {
      hp: 1 + p * (b.hp != null ? b.hp : 1.45),
      bossHp: 1 + p * (b.bossHp != null ? b.bossHp : 0.12),
      damage: 1 + p * (b.damage != null ? b.damage : 0.5),
      speed: 1 + p * (b.speed != null ? b.speed : 0.22),
      fireRate: 1 + p * (b.fireRate != null ? b.fireRate : 0.6),
      bulletSpeed: 1 + p * (b.bulletSpeed != null ? b.bulletSpeed : 0.32),
      count: 1 + p * (b.count != null ? b.count : 0.1),
    };
  }

  function spawnEnemy(type, opts = {}) {
    const base = ENEMY_TYPES[type];
    const affix = state.affix;
    const wave = state.wave;
    const isBoss = type === 'boss';
    const bossCfg = isBoss
      ? BOSS_TYPES[opts.bossType] || BOSS_TYPES[bossTypeForWave(wave)]
      : null;
    const pressure = metaPressure();
    let hpMul = isBoss ? bossHpScale(wave) * BOSS_HP_MULTIPLIER : 1 + (wave - 1) * (state.endless ? 0.18 : 0.26);
    if (state.abyss && wave > ABYSS_START_WAVE) {
      hpMul += (wave - ABYSS_START_WAVE) * 0.05;
      if (isBoss) hpMul += (wave - ABYSS_START_WAVE) * 0.05;
    }
    if (isBoss && affix && affix.bossHpMul) hpMul *= affix.bossHpMul;
    else if (!isBoss && affix && affix.hpMul) hpMul *= affix.hpMul;
    hpMul *= isBoss ? pressure.bossHp : pressure.hp;

    let dmgMul = 1 + Math.min(wave - 1, 40) * 0.06;
    if (state.abyss && wave > ABYSS_START_WAVE) {
      dmgMul += (wave - ABYSS_START_WAVE) * 0.015;
    }
    if (affix && affix.damageMul) dmgMul *= affix.damageMul;
    dmgMul *= pressure.damage;
    let speedMul = 1 + Math.min((wave - 1) * 0.016, 0.35);
    if (affix && affix.speedMul) speedMul *= affix.speedMul;
    speedMul *= pressure.speed;

    const fire = base.fire ? { ...base.fire } : null;
    if (fire && affix && affix.fireIntervalMul) fire.interval *= affix.fireIntervalMul;
    if (fire) fire.interval /= pressure.fireRate;
    if (isBoss && fire) fire.interval *= bossFireIntervalScale(wave, affix);
    if (isBoss && fire && bossCfg) fire.interval *= bossCfg.fireIntervalMul;
    // 基础发射频率 -20%（间隔 ×1.25），仅作用于 BOSS 基础频率，词缀/狂暴倍率不变
    if (isBoss && fire) fire.interval *= BOSS_FIRE_INTERVAL_MUL;

    // BOSS 基础弹速 -30%（基础与波次成长项 ×0.7），词缀/首领差异/压力倍率不变
    let bulletSpeed = ((fire ? fire.speed : 150) + wave * (isBoss ? 7 : 5)) * (isBoss ? BOSS_BULLET_SPEED_MUL : 1);
    if (affix && affix.bulletSpeedMul) bulletSpeed *= affix.bulletSpeedMul;
    bulletSpeed *= pressure.bulletSpeed;
    if (isBoss && bossCfg) bulletSpeed *= bossCfg.bulletSpeedMul;
    bulletSpeed = Math.min(bulletSpeed, isBoss ? 280 : 280);

    const enemy = {
      id: ++enemyId,
      type,
      x: isBoss ? W / 2 : randRange(58, W - 58),
      y: isBoss ? -80 : -46,
      r: base.r,
      hp: Math.round(base.hp * hpMul),
      maxHp: Math.round(base.hp * hpMul),
      speed: base.speed * (bossCfg ? bossCfg.speedMul : 1) * speedMul + Math.min(wave * 1.5, 34),
      phase: Math.random() * TAU,
      slowUntil: 0,
      slowFactor: 1,
      toughness: isBoss ? BOSS_TOUGHNESS : 0,
      burns: [],
      fireTimer: fire ? randRange(0.7, Math.max(0.8, fire.interval * 0.75)) : 999,
      score: Math.round((base.score + wave * 1.5) * (affix && affix.waveScoreMul ? affix.waveScoreMul : 1)),
      xp: Math.round(base.xp * (1 + (wave - 1) * 0.07) * (affix && affix.xpMul ? affix.xpMul : 1)),
      contact: Math.min(Math.round(base.contact * dmgMul), Math.round(base.contact * 2.2)),
      bulletDamage: Math.round((fire ? fire.damage : 8) * dmgMul),
      bulletSpeed,
      color: bossCfg ? bossCfg.color : base.color,
      bossFire: 0,
      fire,
      metaReward: base.metaReward || 0,
      jamUntil: 0,
      hitFlash: 0,
      enraged: false,
      bossType: bossCfg ? bossCfg.id : null,
      bossName: bossCfg ? bossCfg.name : '',
      bossSummonCd: isBoss ? (bossCfg.summonCooldown || 8) : 0,
      bossPhase: 1,
      coreExposed: false,
      coreTimer: 0,
      coreHits: 0,
      coreHitFlash: 0,
      rageCoreTimer: 0,
      splitter: Boolean(opts.splitter),
      bladeCd: 0,
    };

    if (opts.x != null) enemy.x = opts.x;
    if (opts.y != null) enemy.y = opts.y;

    if (opts.elite) {
      const eliteHpMul = 2.2 + Math.min(wave * 0.04, 0.8);
      enemy.hp = Math.round(enemy.hp * eliteHpMul);
      enemy.maxHp = enemy.hp;
      enemy.speed *= 1.12;
      enemy.r = Math.max(base.r + 3, Math.round(enemy.r * 1.1));
      enemy.score = Math.round(enemy.score * 2.1);
      enemy.xp = Math.round(enemy.xp * 1.8);
      enemy.contact = Math.round(enemy.contact * 1.5);
      enemy.bulletDamage = Math.round(enemy.bulletDamage * 1.45);
      enemy.bulletSpeed = Math.min(300, enemy.bulletSpeed * 1.1);
      enemy.elite = true;
      enemy.elitePulse = Math.random() * TAU;
    }

    state.enemies.push(enemy);
    maybeOpenFirstSeen(enemy);
    if (isBoss) {
      state.bossWarningTimer = 0;
      els.bossWarning.classList.add('hidden');
      addLog(`${enemy.bossName} 降临，韧性 ${Math.round(BOSS_TOUGHNESS * 100)}%`);
      markHud();
    }
    if (type === 'special') addLog('特殊怪降临，击落可获得科技点');
  }

  function updateStars(dt) {
    for (const star of state.stars) {
      star.y += (24 + star.z * 165) * dt;
      if (star.y > H + 2) {
        star.y = -2;
        star.x = Math.random() * W;
      }
    }
  }

  function updatePlayer(dt) {
    const p = state.player;
    let dx = 0;
    let dy = 0;

    if (pointerActive) {
      dx = pointerX - p.x;
      dy = pointerY - p.y;
    } else {
      const up = keys.KeyW || keys.ArrowUp || touchDirs.up;
      const down = keys.KeyS || keys.ArrowDown || touchDirs.down;
      const left = keys.KeyA || keys.ArrowLeft || touchDirs.left;
      const right = keys.KeyD || keys.ArrowRight || touchDirs.right;
      if (up) dy -= 1;
      if (down) dy += 1;
      if (left) dx -= 1;
      if (right) dx += 1;
    }

    const speedMul = p.afterHitTimer > 0 ? p.afterHitSpeedMul || 1 : 1;
    const dashBoost = p.dashTimer > 0 ? DASH_SPEED : 1;
    const len = Math.hypot(dx, dy);
    const step = p.speed * speedMul * dashBoost * dt;
    const nx = len > 0 ? dx / len : 0;
    const ny = len > 0 ? dy / len : 0;
    if (pointerActive && len > 0 && len <= step) {
      p.x = clamp(pointerX, 26, W - 26);
      p.y = clamp(pointerY, 46, H - 28);
    } else {
      p.x = clamp(p.x + nx * step, 26, W - 26);
      p.y = clamp(p.y + ny * step, 46, H - 28);
    }
    p.tilt += (clamp(nx * 0.08, -0.16, 0.16) - p.tilt) * Math.min(1, dt * 10);
    p.invuln = Math.max(0, p.invuln - dt);
    if (p.dashTimer > 0) {
      p.dashTimer = Math.max(0, p.dashTimer - dt);
      if (p.dashTimer === 0) markHud();
    }
    if (p.dashCd > 0) {
      p.dashCd = Math.max(0, p.dashCd - dt);
      if (p.dashCd === 0) markHud();
    }
    if (p.ultShield > 0) {
      p.ultShield = Math.max(0, p.ultShield - dt);
      if (p.ultShield === 0) markHud();
    }
    if (p.ultRate > 0) {
      p.ultRate = Math.max(0, p.ultRate - dt);
      if (p.ultRate === 0) markHud();
    }
    if (p.ultAutoCd > 0) {
      p.ultAutoCd = Math.max(0, p.ultAutoCd - dt);
      if (p.ultAutoCd === 0) markHud();
    }

    for (const type of SPECIAL_ORDER) {
      if (p.special[type] > 0) {
        const before = p.special[type];
        p.special[type] = Math.max(0, p.special[type] - dt);
        if (before > 0 && p.special[type] === 0) markHud();
      }
    }
    if (p.gold && p.gold.timeRift) {
      p.timeRiftTimer = (p.timeRiftTimer || 0) - dt;
      if (p.timeRiftTimer <= 0) {
        p.timeRiftTimer = 18;
        p.timeRiftActive = 2;
        addText('时间裂隙', p.x, p.y - 58, '#c3a5ff', { size: 18, weight: 900 });
        playSound('level');
        markHud();
      }
      if (p.timeRiftActive > 0) {
        p.timeRiftActive = Math.max(0, p.timeRiftActive - dt);
        if (p.timeRiftActive === 0) markHud();
      }
    }
    if (p.counterTimer > 0) {
      p.counterTimer = Math.max(0, p.counterTimer - dt);
    }

    if (p.regen > 0 && p.hp < p.maxHp) {
      healPlayer(p, p.regen * dt);
    }
    if (p.ultRegenTimer > 0) {
      const regenDt = Math.min(dt, p.ultRegenTimer);
      p.ultRegenTimer = Math.max(0, p.ultRegenTimer - dt);
      if (p.ultRegenTimer < 0.000001) p.ultRegenTimer = 0;
      if (p.hp < p.maxHp) healPlayer(p, p.maxHp * ULT_REGEN_RATIO * regenDt);
      if (p.ultRegenTimer === 0) markHud();
    }

    if (p.bombRegenInterval > 0 && p.bombs < 6) {
      p.bombRegenTimer += dt;
      if (p.bombRegenTimer >= p.bombRegenInterval) {
        p.bombRegenTimer = 0;
        p.bombs += 1;
        addText('+炸弹', p.x, p.y - 46, '#ffd166', { size: 16, weight: 900 });
        markHud();
      }
    }

    if (p.shield > 0) {
      p.shieldTimer -= dt;
      if (p.shieldTimer <= 0) {
        p.shield = 0;
        markHud();
      }
    }
    if (p.shieldRegen > 0) {
      p.shieldRegenTimer = (p.shieldRegenTimer || 0) - dt;
      if (p.shieldRegenTimer <= 0) {
        p.shieldRegenTimer = 20;
        p.shield = (p.shield || 0) + p.shieldRegen;
        p.shieldTimer = 20;
        markHud();
      }
    }
    if (p.recoverCooldown > 0) p.recoverCooldown = Math.max(0, p.recoverCooldown - dt);
    if (p.bombCd > 0) p.bombCd = Math.max(0, p.bombCd - dt);
    if (p.magnetCd > 0) p.magnetCd = Math.max(0, p.magnetCd - dt);
    if (p.magnetTimer > 0) p.magnetTimer = Math.max(0, p.magnetTimer - dt);
    if (p.frenzyTimer > 0) p.frenzyTimer = Math.max(0, p.frenzyTimer - dt);
    if (p.arcCd > 0) p.arcCd = Math.max(0, p.arcCd - dt);
    if (p.afterHitTimer > 0) {
      p.afterHitTimer = Math.max(0, p.afterHitTimer - dt);
    }
    if (p.pulseHeal > 0) {
      p.pulseTimer -= dt;
      if (p.pulseTimer <= 0) {
        p.pulseTimer = 10;
        healPlayer(p, Math.max(1, Math.round(p.maxHp * p.pulseHeal)));
      }
    }

    const fireInterval = (p.ultRate > 0 ? p.fireInterval / 1.5 : p.fireInterval)
      / ((p.frenzyTimer > 0 ? 1 + (p.frenzyRateBonus || 0) : 1) * (p.overloadTimer > 0 ? 1 + OVERLOAD_RATE_BONUS : 1));
    p.fireTimer -= dt;
    if (p.fireTimer <= 0) {
      firePlayer();
      p.fireTimer = fireInterval;
    }
    // 超载核心：周期进入超载（机体放大 + 射速/伤害暴涨）
    if (p.core === 'overload') {
      if (p.overloadTimer <= 0) {
        p.overloadCd = Math.max(0, p.overloadCd - dt);
        if (p.overloadCd <= 0) {
          p.overloadTimer = OVERLOAD_DURATION;
          p.overloadCd = OVERLOAD_CYCLE;
          addText('超载', p.x, p.y - 60, '#ff9e45', { size: 24, weight: 900 });
          playSound('ultimate');
          state.shake = Math.max(state.shake, 8);
          spawnExplosion(p.x, p.y, '#ff9e45', 22);
          markHud();
        }
      } else {
        p.overloadTimer = Math.max(0, p.overloadTimer - dt);
        if (p.overloadTimer === 0) markHud();
      }
    }
    // 光束核心：主炮被持续贯穿激光束替代——每帧结算贯穿伤害（碰到即受伤，光束实时跟随玩家）
    if (p.core === 'beam') {
      updateBeamCore(dt);
    }
  }

  function playerBulletScale(p = state.player) {
    const overloadBonus = p.overloadTimer > 0 ? OVERLOAD_SIZE_BONUS : 0;
    return 1 + Math.min(3.5, (p.bulletSizeBonus || 0) + overloadBonus);
  }

  function addPlayerShot(angle, xOffset, yOffset, ammoType, specialTypes = [], options = {}) {
    const config = AMMO_TYPES[ammoType] || AMMO_TYPES.bolt;
    const p = state.player;
    const has = (type) => specialTypes.includes(type);
    const slowConfig = has('slow') ? AMMO_TYPES.slow : null;
    const burnConfig = has('burn') ? AMMO_TYPES.burn : null;
    const blastConfig = has('blast') ? AMMO_TYPES.blast : null;
    const damageScale = options.damageScale == null ? 1 : options.damageScale;
    const sizeScale = playerBulletScale(p);
    const baseDamage = p.damage + (p.baseDamageBonus || 0);
    const speed = config.speed;
    const independentMul = 1 + (p.independentDamageBonus || 0);
    const overloadMul = p.overloadTimer > 0 ? OVERLOAD_DMG_MUL : 1;
    const damage = Math.max(1, Math.round(baseDamage * config.damage * damageScale * independentMul * overloadMul));
    const originX = options.originX == null ? p.x : options.originX;
    const originY = options.originY == null ? p.y : options.originY;
    const specialColor = specialTypes.length ? AMMO_TYPES[specialTypes[specialTypes.length - 1]].color : null;
    const color = specialColor || options.color || config.color;
    const x = originX + xOffset;
    const y = originY + yOffset;
    state.bullets.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: config.radius * sizeScale,
      sizeScale,
      damage,
      pierce: blastConfig ? 1 : p.pierce + 1,
      ammoType,
      homing: Boolean(options.forceHoming || has('homing') || p.magnetTimer > 0),
      homingRange: options.homingRange || AMMO_TYPES.homing.range,
      homingTurn: options.homingTurn || AMMO_TYPES.homing.turn,
      source: options.source || 'player',
      targetId: options.targetId || null,
      critChance: p.critChance,
      critDamage: p.critDamage,
      critBonusMul: p.critBonusMul || 1,
      maxHpDamage: p.maxHpDamage || 0,
      executeMul: p.executeMul || 0,
      splitChance: p.splitChance || 0,
      ultHitChance: p.ultHitChance,
      ultTriggered: false,
      jamDuration: p.jamDuration || 0,
      hitIds: new Set(),
      life: options.life || config.life,
      ricochet: p.core === 'ricochet' ? RICOCHET_CORE_BOUNCES : 0,
      tailX: x,
      tailY: y,
      color,
      slowPower: slowConfig ? slowConfig.slow : 0,
      slowDuration: slowConfig ? slowConfig.slowDuration : 0,
      burnDps: burnConfig ? Math.max(1, Math.round((p.burnDpsBonus || 0) > 0
        ? p.burnDpsBonus * damageScale
        : baseDamage * burnConfig.burnDps * damageScale)) : 0,
      burnDuration: burnConfig ? Math.max(0.5, burnConfig.burnDuration + (p.burnDurationBonus || 0)) : 0,
      blastRadius: blastConfig ? blastConfig.blastRadius : 0,
      seq: state.playerShotSeq++,
    });
    if (options.source !== 'drone') {
      state.muzzleFlashes.push({
        x,
        y,
        angle,
        color,
        life: 0.075,
        maxLife: 0.075,
        size: (blastConfig ? 11 : 8) * Math.min(1.8, Math.sqrt(sizeScale)),
      });
    }
  }

  function droneFormation(count) {
    if (count === 1) return [[-48, 7]];
    if (count === 2) return [[-50, 7], [50, 7]];
    if (count === 3) return [[-54, 3], [0, 38], [54, 3]];
    if (count === 4) return [[-58, 1], [-24, 37], [24, 37], [58, 1]];
    if (count === 5) return [[-62, 1], [-32, 38], [0, -10], [32, 38], [62, 1]];
    if (count === 6) return [[-62, 1], [-32, 38], [0, -10], [0, 44], [32, 38], [62, 1]];
    if (count === 7) return [[-62, 1], [-32, 38], [0, -10], [0, 44], [32, 38], [62, 1], [0, -24]];
    return [[-62, 1], [-32, 38], [0, -10], [0, 44], [32, 38], [62, 1], [-48, -28], [48, -28]];
  }

  function updateDrones(dt) {
    const p = state.player;
    const count = Math.min(MAX_DRONES, p.droneCount || 0);
    while (state.drones.length < count) {
      state.drones.push({ x: p.x, y: p.y + 24, tilt: 0, index: state.drones.length });
    }
    if (state.drones.length > count) state.drones.length = count;
    if (state.drones.length !== (state.lastLoggedDroneCount || 0)) {
      state.lastLoggedDroneCount = state.drones.length;
      logGame('drone', `浮游炮数量 → ${state.drones.length}`);
    }
    const formation = droneFormation(count);
    const follow = Math.min(1, dt * 9);
    for (let i = 0; i < state.drones.length; i++) {
      const drone = state.drones[i];
      const offset = formation[i] || [0, 24];
      const targetX = clamp(p.x + offset[0], 20, W - 20);
      const targetY = clamp(p.y + offset[1], 34, H - 18);
      const beforeX = drone.x;
      drone.x += (targetX - drone.x) * follow;
      drone.y += (targetY - drone.y) * follow;
      drone.tilt += (clamp((drone.x - beforeX) * 0.035, -0.18, 0.18) - drone.tilt) * follow;
      drone.index = i;
    }
  }

  function updateOrbitals(dt) {
    const p = state.player;
    if (!p.gold || !p.gold.orbitalBlade) {
      state.orbitals.length = 0;
      return;
    }
    while (state.orbitals.length < 2) {
      state.orbitals.push({ angle: state.orbitals.length * Math.PI, x: p.x, y: p.y });
    }
    const independentMul = 1 + (p.independentDamageBonus || 0);
    const damage = Math.max(1, Math.round((p.damage + (p.baseDamageBonus || 0)) * BLADE_DAMAGE_RATIO * independentMul));
    for (const enemy of state.enemies) {
      enemy.bladeCd = Math.max(0, (enemy.bladeCd || 0) - dt);
    }
    state.orbitalClearTimer = (state.orbitalClearTimer || 0) - dt;
    if (state.orbitalClearTimer <= 0) {
      state.orbitalClearTimer = ORBITAL_CLEAR_INTERVAL;
      state.orbitalClearLeft = ORBITAL_CLEAR_AMOUNT;
    }
    for (let i = 0; i < state.orbitals.length; i++) {
      const o = state.orbitals[i];
      o.angle += dt * 3.2;
      o.x = p.x + Math.cos(o.angle) * 42;
      o.y = p.y + Math.sin(o.angle) * 30 + 6;
      for (let j = state.enemies.length - 1; j >= 0; j--) {
        const enemy = state.enemies[j];
        if (!enemy) continue;
        const dx = enemy.x - o.x;
        const dy = enemy.y - o.y;
        const rr = enemy.r + 13;
        if (enemy.bladeCd <= 0 && dx * dx + dy * dy <= rr * rr) {
          enemy.hp -= damage;
          state.damageDealt += damage;
          enemy.bladeCd = BLADE_HIT_COOLDOWN;
          applyHitFeedback(enemy, damage, enemy.x, enemy.y, false);
          if (enemy.hp <= 0) killEnemy(enemy, j);
        }
      }
      for (let j = state.enemyBullets.length - 1; j >= 0; j--) {
        const b = state.enemyBullets[j];
        const dx = b.x - o.x;
        const dy = b.y - o.y;
        if (state.orbitalClearLeft > 0 && dx * dx + dy * dy <= (b.r + 13) * (b.r + 13)) {
          state.enemyBullets.splice(j, 1);
          spawnParticles(b.x, b.y, '#8be9ff', 5, 110);
          state.orbitalClearLeft--;
          break;
        }
      }
    }
  }

  function fireDrones(specialTypes) {
    const p = state.player;
    const count = Math.min(MAX_DRONES, p.droneCount || 0);
    if (!count) return;
    const share = DRONE_DAMAGE_SHARE[count] * (p.droneShareMul || 1) * (p.dronePower || 1);
    const range = Math.hypot(W, H) + 160;
    const droneLife = Math.min((range / AMMO_TYPES.bolt.speed) * 1.2, DRONE_BULLET_LIFE_MAX);
    const skin = getSelectedSkin();
    const claimedTargets = new Set();
    for (const drone of state.drones) {
      let target = nearestEnemy(drone.x, drone.y, range, claimedTargets);
      if (!target) target = nearestEnemy(drone.x, drone.y, range);
      if (target) claimedTargets.add(target.id);
      const angle = target
        ? Math.atan2(target.y - drone.y, target.x - drone.x)
        : -Math.PI / 2;
      addPlayerShot(angle, 0, -10, 'bolt', specialTypes, {
        originX: drone.x,
        originY: drone.y,
        damageScale: share,
        forceHoming: true,
        homingRange: range,
        homingTurn: DRONE_HOMING_TURN,
        life: droneLife,
        color: skin.accent,
        source: 'drone',
        targetId: target ? target.id : null,
      });
    }
  }

  function firePlayer() {
    const p = state.player;
    const specialTypes = SPECIAL_ORDER.filter((type) => p.special[type] > 0);
    if (p.core !== 'beam') {
      // 主炮射击（光束核心下主炮被持续激光替代，不射弹）
      const shotSlots = p.rows === 1 ? [0]
        : p.rows === 2 ? [-0.7, 0.7]
          : p.rows === 3 ? [-1, 0, 1]
            : p.rows === 4 ? [-1.2, -0.4, 0.4, 1.2]
              : p.rows === 5 ? [-1.4, -0.7, 0, 0.7, 1.4]
                : [-1.5, -0.9, -0.3, 0.3, 0.9, 1.5];
      const fan = p.scatter ? PLAYER_SCATTER_FAN : PLAYER_SHOT_FAN;
      for (const slot of shotSlots) {
        const angle = -Math.PI / 2 + slot * fan;
        const muzzleY = -22 + Math.abs(slot) * 3;
        addPlayerShot(angle, slot * PLAYER_SHOT_SPACING, muzzleY, 'bolt', specialTypes);
      }
    }
    if (p.core === 'mirror') fireMirrors(specialTypes);
    fireDrones(specialTypes);
  }

  // 分身核心：每架镜像复制一发主炮弹（向两侧微偏），伤害按 MIRROR_DAMAGE_SHARE
  function fireMirrors(specialTypes) {
    const p = state.player;
    const fan = p.scatter ? PLAYER_SCATTER_FAN : PLAYER_SHOT_FAN;
    for (const mirror of state.mirrors) {
      if (!mirror) continue;
      const angle = -Math.PI / 2 + mirror.side * fan;
      addPlayerShot(angle, 0, -16, 'bolt', specialTypes, {
        originX: mirror.x,
        originY: mirror.y,
        damageScale: MIRROR_DAMAGE_SHARE,
      });
    }
  }

  // 光束核心：主炮被持续贯穿激光束替代——每帧对光束列内所有敌人结算连续伤害（碰到即受伤），
  // 总 DPS 与原 tick 模型一致；暴击判定保持每 BEAM_TICK 一次的节奏，不额外消耗 Math.random。
  function updateBeamCore(dt) {
    const p = state.player;
    const baseDamage = p.damage + (p.baseDamageBonus || 0);
    const halfWidth = BEAM_BASE_HALF_WIDTH + (p.rows || 1) * BEAM_ROWS_WIDTH;
    const overloadMul = p.overloadTimer > 0 ? OVERLOAD_DMG_MUL : 1;
    // 暴击节奏：每 BEAM_TICK 判定一次，持续到下一次判定
    p.beamTick -= dt;
    let tickEdge = false;
    if (p.beamTick <= 0) {
      p.beamTick = BEAM_TICK;
      p.beamCrit = Math.random() < p.critChance;
      tickEdge = true;
    }
    const crit = !!p.beamCrit;
    let damage = baseDamage * BEAM_DAMAGE_MUL * overloadMul;
    if (crit) damage *= p.critDamage * (p.critBonusMul || 1);
    const frameDamage = damage * (dt / BEAM_TICK);
    let topHit = p.y;
    let hitAny = false;
    let hitThisTick = false;
    for (let i = state.enemies.length - 1; i >= 0; i--) {
      const enemy = state.enemies[i];
      if (enemy.y > p.y) continue;
      if (Math.abs(enemy.x - p.x) > enemy.r + halfWidth) continue;
      enemy.hp -= frameDamage;
      state.damageDealt += frameDamage;
      enemy.hitFlash = 0.06;
      topHit = Math.min(topHit, enemy.y);
      hitAny = true;
      // 命中反馈按 BEAM_TICK 节流：伤害数字显示该窗口累积值；粒子全确定性（不消耗 Math.random）
      enemy.beamDmgAcc = (enemy.beamDmgAcc || 0) + frameDamage;
      if (enemy.beamFx === undefined) enemy.beamFx = BEAM_TICK * 0.5; // 首次进入错开半拍，避免齐射
      enemy.beamFx -= dt;
      if (enemy.beamFx <= 0) {
        enemy.beamFx = BEAM_TICK;
        if (enemy.beamDmgAcc >= 1) {
          addDamageTextDet(Math.round(enemy.beamDmgAcc), enemy.x, enemy.y - enemy.r - 8, crit);
          enemy.beamDmgAcc = 0;
        }
        burstParticlesDet(enemy.x, enemy.y - enemy.r * 0.35, '#aef8ff', 4, 170, 0.42, 2.2, i * 11 + 5);
        burstParticlesDet(enemy.x, enemy.y, enemy.color, 2, 120, 0.5, 2.6, i * 17 + 9);
        if (crit) hitThisTick = true;
      }
      if (enemy.hp <= 0) killEnemy(enemy, i);
    }
    if (tickEdge && hitThisTick && crit) {
      state.shake = Math.max(state.shake, 3);
      playSound('hit');
    }
    // 每帧刷新光束几何：实时跟随玩家位置；无目标时贯穿至屏幕顶端（持续发射观感）
    state.beamVisual = { x: p.x, y0: p.y - 26, y1: Math.max(0, topHit < p.y ? topHit - 8 : 2) };
  }

  // 分身核心：镜像跟随机体并带轻微摆动
  function updateMirrors(dt) {
    const p = state.player;
    if (p.core !== 'mirror') {
      state.mirrors.length = 0;
      return;
    }
    while (state.mirrors.length < MIRROR_COUNT) {
      state.mirrors.push({ side: state.mirrors.length === 0 ? -1 : 1, x: p.x, y: p.y });
    }
    state.mirrors.length = MIRROR_COUNT;
    for (let i = 0; i < state.mirrors.length; i++) {
      const m = state.mirrors[i];
      m.side = i === 0 ? -1 : 1;
      const wobble = Math.sin(state.elapsed * 3 + i * 2) * 4;
      m.x = p.x + m.side * MIRROR_OFFSET + wobble;
      m.y = p.y + 6;
    }
  }

  function nearestEnemy(x, y, radius, excludedIds = null) {
    let best = null;
    let bestDist = radius * radius;
    for (const enemy of state.enemies) {
      if (excludedIds && excludedIds.has(enemy.id)) continue;
      const dx = enemy.x - x;
      const dy = enemy.y - y;
      const dist = dx * dx + dy * dy;
      if (dist < bestDist) {
        bestDist = dist;
        best = enemy;
      }
    }
    return best;
  }

  // 电弧核心：从 (x,y) 出发连锁闪电，最多 hops 跳，首跳伤害 baseDamage，逐跳 ×decay
  function triggerArcCore(x, y, baseDamage, sourceId) {
    const p = state.player;
    if (!p || p.arcCd > 0) return;
    p.arcCd = ARC_CORE_COOLDOWN;
    let cx = x;
    let cy = y;
    let damage = Math.max(1, Math.round(baseDamage * ARC_CORE_DAMAGE));
    const visited = new Set();
    if (sourceId != null) visited.add(sourceId); // 跳过来源敌人，避免自跳
    for (let hop = 0; hop < ARC_CORE_HOPS; hop++) {
      const next = nearestEnemy(cx, cy, ARC_CORE_RANGE, visited);
      if (!next) break;
      visited.add(next.id);
      addArc(cx, cy, next.x, next.y, '#bff6ff');
      next.hp -= damage;
      state.damageDealt += damage;
      applyHitFeedback(next, damage, next.x, next.y, false);
      if (next.hp <= 0) {
        const idx = state.enemies.indexOf(next);
        if (idx >= 0) killEnemy(next, idx);
      }
      cx = next.x;
      cy = next.y;
      damage = Math.max(1, Math.round(damage * ARC_CORE_DECAY));
    }
  }

  // 爆裂核心：以 (x,y) 为中心范围爆炸，击杀的敌人按代数连锁（伤害逐代衰减）
  function triggerBlastCore(x, y, baseDamage, depth = 1) {
    if (depth > BLAST_CORE_DEPTH) return;
    const p = state.player;
    const damage = Math.max(1, Math.round(baseDamage * Math.pow(BLAST_CORE_DECAY, depth - 1)));
    spawnExplosion(x, y, '#ffb35c', 14);
    const hits = [];
    for (const enemy of state.enemies) {
      if (Math.hypot(enemy.x - x, enemy.y - y) <= enemy.r + BLAST_CORE_RADIUS) hits.push(enemy);
    }
    for (const enemy of hits) {
      if (!state.enemies.includes(enemy) || enemy.hp <= 0) continue;
      enemy.hp -= damage;
      state.damageDealt += damage;
      applyHitFeedback(enemy, damage, enemy.x, enemy.y, false);
      if (enemy.hp <= 0) {
        const ex = enemy.x;
        const ey = enemy.y;
        const idx = state.enemies.indexOf(enemy);
        if (idx >= 0) killEnemy(enemy, idx);
        triggerBlastCore(ex, ey, baseDamage, depth + 1);
      }
    }
  }

  function updatePlayerBullets(dt) {
    for (let i = state.bullets.length - 1; i >= 0; i--) {
      const bullet = state.bullets[i];
      if (bullet.homing) {
        let target = bullet.targetId
          ? state.enemies.find((enemy) => enemy.id === bullet.targetId)
          : null;
        if (!target) {
          target = nearestEnemy(bullet.x, bullet.y, bullet.homingRange || AMMO_TYPES.homing.range);
          bullet.targetId = target ? target.id : null;
        }
        if (target) {
          const speed = Math.hypot(bullet.vx, bullet.vy);
          const current = Math.atan2(bullet.vy, bullet.vx);
          const desired = Math.atan2(target.y - bullet.y, target.x - bullet.x);
          let diff = desired - current;
          while (diff > Math.PI) diff -= TAU;
          while (diff < -Math.PI) diff += TAU;
          const turn = (bullet.homingTurn || AMMO_TYPES.homing.turn) * dt;
          const next = current + clamp(diff, -turn, turn);
          bullet.vx = Math.cos(next) * speed;
          bullet.vy = Math.sin(next) * speed;
        }
      }
      const prevX = bullet.x;
      const prevY = bullet.y;
      bullet.x += bullet.vx * dt;
      bullet.y += bullet.vy * dt;
      bullet.tailX = prevX;
      bullet.tailY = prevY;
      bullet.life -= dt;
      if (bullet.life <= 0) {
        state.bullets.splice(i, 1);
        continue;
      }
      if (bullet.x < -40 || bullet.x > W + 40 || bullet.y < -60 || bullet.y > H + 60) {
        state.bullets.splice(i, 1);
      }
    }
  }

  function spawnSpecialDrop() {
    if (state.specialDrops.length > 0) return;
    const waveResourceChance = Math.min(0.55, 0.3 + state.wave * 0.015);
    const resourceDrop = state.elapsed < 90 || Math.random() < waveResourceChance;
    const type = state.elapsed < 90
      ? 'bomb'
      : resourceDrop
        ? (Math.random() < 0.55 ? 'bomb' : 'ult')
        : SPECIAL_ORDER[Math.floor(Math.random() * SPECIAL_ORDER.length)];
    state.specialDrops.push({
      type,
      x: randRange(58, W - 58),
      y: randRange(72, Math.max(82, H * 0.48)),
      life: 20,
      maxLife: 20,
      drift: randRange(20, 34),
    });
    addLog('特殊增益投放，20 秒后消失');
  }

  function collectSpecialDrop(drop, index) {
    const p = state.player;
    const type = drop.type;
    const config = RESOURCE_DROPS[type] || AMMO_TYPES[type];
    state.specialDrops.splice(index, 1);
    spawnParticles(drop.x, drop.y, config.color, 14, 190);
    addText(config.name, drop.x, drop.y - 24, config.color);
    if (type === 'bomb') {
      p.bombs += 1;
      addLog('炸弹补给 +1');
    } else if (type === 'ult') {
      const wasReady = p.ultEnergy >= p.ultMax;
      const gained = grantUltimateEnergy(p, 50);
      if (!wasReady && p.ultEnergy >= p.ultMax) addLog('大招已就绪');
      addLog(`大招能量 +${Math.round(gained)}`);
    } else {
      p.special[type] = 20;
      addLog(`${config.name}增益激活 20 秒`);
    }
    if (state.objective && state.objective.id === 'pickups') markObjectiveProgress();
    playSound('level');
    markHud();
  }

  function updateSpecialDrops(dt) {
    state.specialDropTimer -= dt;
    if (state.specialDropTimer <= 0) {
      spawnSpecialDrop();
      state.specialDropTimer = Math.max(45, 60 - Math.floor(state.wave / 5) * 3);
    }

    const p = state.player;
    for (let i = state.specialDrops.length - 1; i >= 0; i--) {
      const drop = state.specialDrops[i];
      drop.life -= dt;
      drop.y += drop.drift * dt;
      if (drop.life <= 0 || drop.y > H + 40) {
        state.specialDrops.splice(i, 1);
        continue;
      }
      const dx = p.x - drop.x;
      const dy = p.y - drop.y;
      if (dx * dx + dy * dy <= 34 * 34) collectSpecialDrop(drop, i);
    }
  }

  function updateEnemies(dt) {
    for (let i = state.enemies.length - 1; i >= 0; i--) {
      const enemy = state.enemies[i];
      if ((enemy.hitFlash || 0) > 0) enemy.hitFlash = Math.max(0, enemy.hitFlash - dt);
      if (enemy.burns.length) {
        let dead = false;
        for (let b = enemy.burns.length - 1; b >= 0; b--) {
          const burn = enemy.burns[b];
          burn.remaining -= dt;
          burn.tick -= dt;
          if (burn.tick <= 0) {
            burn.tick = 0.3;
            const burnDamage = burn.dps * 0.3;
            enemy.hp -= burnDamage;
            state.damageDealt += burnDamage;
            markHud();
            if (Math.random() < 0.3) {
              spawnParticles(
                enemy.x + randRange(-enemy.r, enemy.r),
                enemy.y + randRange(-enemy.r, enemy.r),
                '#ff9f5a',
                1,
                70
              );
            }
            if (enemy.hp <= 0) {
              killEnemy(enemy, i);
              dead = true;
              break;
            }
          }
          if (burn.remaining <= 0) enemy.burns.splice(b, 1);
        }
        if (dead) continue;
      }

      const barrageLevel = affixLevel(state.affix, 'barrage');
      const bossRageThreshold = Math.min(0.72, 0.45 + barrageLevel * 0.13);
      if (enemy.type === 'boss' && !enemy.enraged && enemy.hp <= enemy.maxHp * bossRageThreshold) {
        enemy.enraged = true;
        enemy.bossSummonCd = Math.min(enemy.bossSummonCd, 3);
        enemy.fireTimer = Math.min(enemy.fireTimer, enemy.fire.interval * 0.45);
        state.shake = Math.max(state.shake, 8);
        addText('BOSS 狂暴', enemy.x, enemy.y - enemy.r - 28, '#ff5e6c', {
          size: 26,
          weight: 900,
          shadow: '#ff3d50',
        });
        addLog('首领进入狂暴状态');
        markHud();
      }

      if (enemy.type === 'boss') {
        let nextPhase = enemy.bossPhase;
        if (enemy.hp <= enemy.maxHp * BOSS_PHASE_HP[1]) nextPhase = 3;
        else if (enemy.hp <= enemy.maxHp * BOSS_PHASE_HP[0]) nextPhase = 2;
        if (nextPhase > enemy.bossPhase) {
          enemy.bossPhase = nextPhase;
          enemy.coreExposed = true;
          enemy.coreTimer = BOSS_CORE_DURATION;
          enemy.coreHits = 0;
          enemy.coreHitFlash = 0;
          state.shake = Math.max(state.shake, 10);
          addText('核心暴露', enemy.x, enemy.y - enemy.r - 40, '#7fe7ff', {
            size: 24,
            weight: 900,
            shadow: '#54d7ff',
          });
          addLog(`首领进入第 ${nextPhase} 阶段，核心暴露`);
          markHud();
        }
        if (enemy.coreExposed) {
          enemy.coreTimer -= dt;
          enemy.coreHitFlash = Math.max(0, (enemy.coreHitFlash || 0) - dt);
          if (enemy.coreTimer <= 0) {
            enemy.coreExposed = false;
            enemy.coreTimer = 0;
            addText('核心关闭', enemy.x, enemy.y - enemy.r - 34, '#ff8a5e', { size: 16, weight: 800 });
          }
        }
        // 狂暴期核心暴露循环：rageCoreTimer 在 [0, WINDOW) 为满伤窗口，其余为护盾减伤
        if (enemy.enraged) {
          enemy.rageCoreTimer = ((enemy.rageCoreTimer || 0) + dt) % BOSS_RAGE_CORE_CYCLE;
        }
      }

      if (enemy.stunTimer > 0) {
        enemy.stunTimer -= dt;
        if (enemy.stunTimer < 0) enemy.stunTimer = 0;
        continue;
      }

      const moveSpeed = state.elapsed < enemy.slowUntil ? enemy.speed * enemy.slowFactor : enemy.speed;
      if (enemy.type === 'ace') {
        enemy.y += moveSpeed * dt;
        enemy.x += Math.sin(state.elapsed * 1.9 + enemy.phase) * 70 * dt;
      } else if (enemy.type === 'special') {
        enemy.y += moveSpeed * dt;
        enemy.x += Math.sin(state.elapsed * 1.15 + enemy.phase) * 60 * dt;
      } else if (enemy.type === 'boss') {
        const bossCfg = BOSS_TYPES[enemy.bossType] || BOSS_TYPES.warlord;
        enemy.y += moveSpeed * dt;
        if (enemy.y > 112) enemy.y = 112;
        const rageMul = enemy.enraged ? 1.45 : 1;
        enemy.x += Math.sin(state.elapsed * bossCfg.lateralRate * (enemy.enraged ? 1.4 : 1) + enemy.phase)
          * bossCfg.lateralAmp
          * rageMul
          * dt;
      } else {
        enemy.y += moveSpeed * dt;
      }
      enemy.x = clamp(enemy.x, enemy.r + 4, W - enemy.r - 4);

      if (enemy.fire && state.elapsed >= (enemy.jamUntil || 0) && enemy.y > 62 && enemy.y < H * 0.78) {
        if (enemy.type === 'boss' && enemy.bossSummonCd > 0) {
          enemy.bossSummonCd -= dt;
        }
        enemy.fireTimer -= dt;
        if (enemy.fireTimer <= 0) {
          fireEnemy(enemy);
          const intervalMul = enemy.type === 'boss' && enemy.enraged ? 0.68 : 1;
          const coreIntervalMul = enemy.type === 'boss' && enemy.coreExposed ? 1.5 : 1;
          enemy.fireTimer = enemy.fire.interval * intervalMul * coreIntervalMul * randRange(0.9, 1.12);
        }
      }

      if (enemy.y > H + enemy.r + 40) {
        state.enemies.splice(i, 1);
      }
    }
  }

  function addEnemyBullet(bullet) {
    if (state.enemyBullets.length >= MAX_ENEMY_BULLETS) return;
    const radiusMul = state.affix ? state.affix.enemyBulletRadiusMul : 1;
    bullet.r = Math.max(1, (bullet.r || 5) * radiusMul);
    if (bullet.tailX == null) bullet.tailX = bullet.x;
    if (bullet.tailY == null) bullet.tailY = bullet.y;
    if (bullet.sprite == null) bullet.sprite = 'enemy';
    state.enemyBullets.push(bullet);
  }

  function fireEnemy(enemy) {
    const p = state.player;
    const aim = Math.atan2(p.y - enemy.y, p.x - enemy.x);
    const contractBulletMul = state.contract ? state.contract.bulletSpeedMul : 1;
    const speed = enemy.bulletSpeed * contractBulletMul;
    const push = (angle, color, r = 5) => {
      addEnemyBullet({
        x: enemy.x + Math.cos(angle) * (enemy.r + 6),
        y: enemy.y + Math.sin(angle) * (enemy.r + 6),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r,
        damage: enemy.bulletDamage,
        color: color || enemy.color,
        sprite: 'enemy',
      });
    };

    switch (enemy.type) {
      case 'striker':
        push(aim);
        break;
      case 'twin':
        push(aim - 0.18);
        push(aim + 0.18);
        break;
      case 'brute':
        push(aim - 0.26);
        push(aim);
        push(aim + 0.26);
        break;
      case 'ace':
        push(aim - 0.46);
        push(aim);
        push(aim + 0.46);
        break;
      case 'boss': {
        enemy.bossFire++;
        const affix = state.affix;
        const barrageLevel = affixLevel(affix, 'barrage');
        const enraged = !!enemy.enraged;
        const wave = state.wave;
        const bossCfg = BOSS_TYPES[enemy.bossType] || BOSS_TYPES.warlord;
        const pattern = (enemy.bossFire + (enemy.bossPhase - 1) * 3 + bossCfg.patternShift) % (wave >= 10 ? 7 : 6);
        const extra = wave === 5 ? 0 : Math.floor(wave / 5);
        // BOSS_VOLLEY_SPREAD>1：同一轮弹幕互相更分开（弹数减少 → 夹角变大），发射间隔不变
        const spread = BOSS_VOLLEY_SPREAD;
        // 狂暴态额外分散（BOSS_RAGE_SPREAD>1）：仅 enraged 时生效，把狂暴弹幕密度再降一档
        const rageSpread = enraged ? BOSS_RAGE_SPREAD : 1;
        const ringCount = clamp(Math.round((8 + extra + (enraged ? 3 : 0) + barrageLevel * 2 + bossCfg.ringBonus) / (spread * rageSpread)), 3, 12);
        const fanCount = clamp(Math.round((4 + extra + (enraged ? 2 : 0) + barrageLevel + bossCfg.fanBonus) / (spread * rageSpread)), 2, 8);
        const arcCount = clamp(Math.round((6 + extra + (enraged ? 2 : 0) + barrageLevel + bossCfg.arcBonus) / (spread * rageSpread)), 3, 10);
        const spiralCount = clamp(Math.round((6 + extra + (enraged ? 2 : 0) + bossCfg.spiralBonus) / (spread * rageSpread)), 3, 10);
        const primary = bossCfg.bullet || bossCfg.color;
        const secondary = bossCfg.bulletAlt || bossCfg.accent;
        const bossPush = (angle, color, r = 6, speedMul = 1) => {
          const shotSpeed = enemy.bulletSpeed * (enraged ? 1.08 : 1) * Math.pow(1.06, barrageLevel) * speedMul * contractBulletMul;
          addEnemyBullet({
            x: enemy.x + Math.cos(angle) * (enemy.r + 6),
            y: enemy.y + Math.sin(angle) * (enemy.r + 6),
            vx: Math.cos(angle) * shotSpeed,
            vy: Math.sin(angle) * shotSpeed,
            r,
            damage: enemy.bulletDamage,
            color,
            sprite: 'boss',
          });
        };
        if (pattern === 0) {
          const base = enemy.bossFire * 0.41;
          for (let i = 0; i < ringCount; i++) {
            bossPush(base + i * TAU / ringCount, primary, 6);
          }
        } else if (pattern === 1) {
          const span = (0.7 + extra * 0.08 + (enraged ? 0.14 : 0)) * spread;
          for (let i = 0; i < fanCount; i++) {
            const offset = -span / 2 + i * (span / Math.max(1, fanCount - 1));
            bossPush(aim + offset, secondary, 6, 0.85);
          }
        } else if (pattern === 2) {
          const start = -Math.PI / 2 - 0.56 - (enraged ? 0.12 : 0);
          for (let i = 0; i < arcCount; i++) {
            bossPush(start + i * 0.14 * spread, enraged ? '#ff5e6c' : secondary, 6);
          }
        } else if (pattern === 3) {
          const offsets = enraged
            ? [-0.26 * spread, -0.13 * spread, 0, 0.13 * spread, 0.26 * spread]
            : [-0.2 * spread, 0, 0.2 * spread];
          for (const offset of offsets) {
            bossPush(aim + offset, primary, 5, 0.9);
          }
          const miniRing = Math.max(3, Math.round(Math.min(5 + extra, 9) / (spread * rageSpread)));
          const ringStep = TAU / miniRing;
          // 迷你环与瞄准弹错位：环弹起始角避开瞄准弹方向（消除"瞄准弹贴环弹"的局部细缝）。
          // 细步进 + 多轮 + 最优追踪：某些弹数组合（如 4 环 vs 3 瞄准）半格步进会绕回原点，
          // 必须用更细步进采样并保留全程最大净空的结果。
          const aimed = offsets.map((offset) => aim + offset);
          let ringBase = enemy.bossFire * 0.36;
          let bestBase = ringBase;
          let bestClearance = -Infinity;
          for (let attempt = 0; attempt < 16; attempt++) {
            let minDist = Infinity;
            for (const aa of aimed) {
              for (let i = 0; i < miniRing; i++) {
                let diff = Math.abs((ringBase + i * ringStep - aa) % TAU);
                if (diff > Math.PI) diff = TAU - diff;
                if (diff < minDist) minDist = diff;
              }
            }
            if (minDist > bestClearance) {
              bestClearance = minDist;
              bestBase = ringBase;
            }
            if (minDist >= 0.2) break;
            ringBase += ringStep * 0.25;
          }
          ringBase = bestBase;
          for (let i = 0; i < miniRing; i++) {
            bossPush(ringBase + i * ringStep, secondary, 5);
          }
        } else if (pattern === 4) {
          const base = enemy.bossFire * 0.29;
          const count = Math.max(3, Math.round(Math.min(7 + extra + (enraged ? 3 : 0), 14) / (spread * rageSpread)));
          for (let i = 0; i < count; i++) {
            bossPush(base + i * TAU / count, primary, 5);
          }
          const base2 = base + Math.PI / count;
          for (let i = 0; i < count; i++) {
            bossPush(base2 + i * TAU / count, secondary, 5);
          }
        } else if (pattern === 5) {
          const doubleRing = Math.max(3, Math.round(Math.min(7 + extra + (enraged ? 2 : 0), 11) / (spread * rageSpread)));
          for (let half = 0; half < 2; half++) {
            const base = enemy.bossFire * 0.34 + half * Math.PI / 2;
            const color = half === 0 ? primary : secondary;
            for (let i = 0; i < doubleRing; i++) {
              bossPush(base + i * TAU / doubleRing, color, 5);
            }
          }
        } else {
          const rotation = enemy.bossFire * 0.42;
          for (let i = 0; i < spiralCount; i++) {
            bossPush(rotation + i * TAU / spiralCount, i % 2 === 0 ? primary : secondary, 5);
          }
        }
        if (enraged && wave >= 10 && bossCfg.summonCount > 0 && enemy.bossSummonCd <= 0) {
          enemy.bossSummonCd = bossCfg.summonCooldown;
          const summonTypes = ['scout', 'striker'];
          for (let i = 0; i < bossCfg.summonCount; i++) {
            spawnEnemy(summonTypes[i % 2], { summoned: true });
          }
          addText('援军来袭', enemy.x, enemy.y - enemy.r - 54, secondary, {
            size: 18,
            weight: 800,
            shadow: bossCfg.glow,
          });
        }
        break;
      }
    }
  }

  function updateEnemyBullets(dt) {
    const timeMul = state.player.gold && state.player.gold.timeRift && state.player.timeRiftActive > 0
      ? 0.35
      : 1;
    for (let i = state.enemyBullets.length - 1; i >= 0; i--) {
      const bullet = state.enemyBullets[i];
      const prevX = bullet.x;
      const prevY = bullet.y;
      bullet.x += bullet.vx * timeMul * dt;
      bullet.y += bullet.vy * timeMul * dt;
      bullet.tailX = prevX;
      bullet.tailY = prevY;
      if (bullet.x < -40 || bullet.x > W + 40 || bullet.y < -60 || bullet.y > H + 60) {
        state.enemyBullets.splice(i, 1);
      }
    }
  }

  function addArc(x1, y1, x2, y2, color = '#b28cff') {
    if (!state || state.arcs.length > 60) return;
    const segments = [];
    const steps = 5;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const jx = x1 + (x2 - x1) * t + (i > 0 && i < steps ? (Math.random() - 0.5) * 26 : 0);
      const jy = y1 + (y2 - y1) * t + (i > 0 && i < steps ? (Math.random() - 0.5) * 26 : 0);
      segments.push([jx, jy]);
    }
    state.arcs.push({ segments, life: 0.14, maxLife: 0.14, color });
  }

  function updateArcs(dt) {
    if (!state) return;
    for (let i = state.arcs.length - 1; i >= 0; i--) {
      state.arcs[i].life -= dt;
      if (state.arcs[i].life <= 0) state.arcs.splice(i, 1);
    }
  }

  function drawArcs() {
    if (!state || state.arcs.length === 0) return;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    for (const arc of state.arcs) {
      const alpha = clamp(arc.life / arc.maxLife, 0, 1);
      ctx.globalAlpha = alpha * 0.9;
      ctx.strokeStyle = arc.color;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(arc.segments[0][0], arc.segments[0][1]);
      for (let i = 1; i < arc.segments.length; i++) {
        ctx.lineTo(arc.segments[i][0], arc.segments[i][1]);
      }
      ctx.stroke();
      ctx.globalAlpha = alpha * 0.4;
      ctx.lineWidth = 5;
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawXpOrbs() {
    if (!state || !state.xpOrbs.length) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const orb of state.xpOrbs) {
      const fade = Math.min(1, orb.life / 0.4);
      const pulse = 0.6 + 0.4 * Math.sin(state.elapsed * 10 + orb.x);
      ctx.globalAlpha = pulse * fade;
      ctx.fillStyle = orb.color;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, 3.5, 0, TAU);
      ctx.fill();
      ctx.globalAlpha = pulse * fade * 0.35;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, 7.5, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }

  function spawnParticles(x, y, color, count, speed = 150) {
    if (count <= 0) return;
    const overflow = state.particles.length + count - MAX_PARTICLES;
    if (overflow > 0) state.particles.splice(0, overflow);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * TAU;
      const sp = randRange(speed * 0.35, speed);
      const life = randRange(0.35, 0.85);
      state.particles.push({
        x,
        y,
        vx: Math.cos(angle) * sp,
        vy: Math.sin(angle) * sp,
        life,
        maxLife: life,
        color,
        size: randRange(2, 4.5),
      });
    }
  }

  function spawnExplosion(x, y, color, count) {
    spawnParticles(x, y, color, count, 190);
  }

  // 确定性粒子：反馈层专用，不消耗 Math.random（避免扰动种子化测试的随机序列）
  function pushParticleDet(x, y, color, angle, speed, life, size) {
    if (state.particles.length >= MAX_PARTICLES) return;
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life,
      maxLife: life,
      color,
      size,
    });
  }
  function burstParticlesDet(x, y, color, count, speed, life = 0.6, size = 3, seedOffset = 0) {
    const start = seedOffset + state.kills * 13 + state.elapsed * 37;
    for (let i = 0; i < count; i++) {
      const angle = start + i * (TAU / count);
      pushParticleDet(x, y, color, angle, speed * (0.5 + ((i * 7) % 10) / 10), life, size);
    }
  }

  function updateParticles(dt) {
    for (let i = state.particles.length - 1; i >= 0; i--) {
      const particle = state.particles[i];
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vx *= 0.96;
      particle.vy *= 0.96;
      particle.life -= dt;
      if (particle.life <= 0) state.particles.splice(i, 1);
    }
  }

  function updateMuzzleFlashes(dt) {
    for (let i = state.muzzleFlashes.length - 1; i >= 0; i--) {
      const flash = state.muzzleFlashes[i];
      flash.life -= dt;
      if (flash.life <= 0) state.muzzleFlashes.splice(i, 1);
    }
  }

  function updateCombo(dt) {
    // 多重击杀窗口衰减
    if (state.multiKillTimer > 0) {
      state.multiKillTimer = Math.max(0, state.multiKillTimer - dt);
      if (state.multiKillTimer === 0) state.multiKillCount = 0;
    }
    // 连杀窗口衰减
    if (state.comboTimer > 0) {
      state.comboTimer = Math.max(0, state.comboTimer - dt);
      if (state.comboTimer === 0) state.combo = 0;
    }
    // 连杀 HUD（每帧更新，廉价）
    if (els.comboStat) {
      const show = state.combo >= 5;
      els.comboStat.classList.toggle('hidden', !show);
      if (show) {
        els.comboValue.textContent = state.combo;
        els.comboStat.classList.toggle('tier-2', state.combo >= 25);
        els.comboStat.classList.toggle('tier-3', state.combo >= 50);
      }
    }
  }

  // 经验光点：加速飞向机体，靠近即收集（XP 已即时入账，光点为反馈）
  function updateXpOrbs(dt) {
    if (!state.xpOrbs.length) return;
    const p = state.player;
    for (let i = state.xpOrbs.length - 1; i >= 0; i--) {
      const orb = state.xpOrbs[i];
      orb.life -= dt;
      if (orb.life <= 0) {
        state.xpOrbs.splice(i, 1);
        continue;
      }
      const dx = p.x - orb.x;
      const dy = p.y - orb.y;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist < 26) {
        state.xpOrbs.splice(i, 1);
        burstParticlesDet(orb.x, orb.y, orb.color, 3, 90, 0.4, 2.5, i);
        if (state.elapsed - (state.xpPickupSoundAt || -99) >= 0.07) {
          state.xpPickupSoundAt = state.elapsed;
          playSound('pickup');
        }
        continue;
      }
      const sp = XP_ORB_SPEED * (1 + Math.min(2.2, (orb.maxLife - orb.life) * 2));
      orb.x += (dx / dist) * sp * dt;
      orb.y += (dy / dist) * sp * dt;
    }
  }

  function addText(text, x, y, color, options = {}) {
    if (state.texts.length >= MAX_TEXTS) state.texts.shift();
    const life = options.life || 1.1;
    state.texts.push({
      text,
      x,
      y,
      color,
      life,
      maxLife: life,
      size: options.size || 14,
      weight: options.weight || 700,
      shadow: options.shadow || null,
      shadowBlur: options.shadowBlur || null,
      outline: options.outline || false,
      rise: options.rise || 38,
    });
  }

  function addDamageText(damage, x, y, crit) {
    addText(`${Math.round(damage)}`, x + randRange(-6, 6), y + randRange(-4, 2), crit ? '#ffd166' : '#fff4c2', {
      size: crit ? 30 : 22,
      weight: crit ? 900 : 800,
      shadow: null,
      outline: true,
      rise: crit ? 78 : 62,
      life: crit ? 1.35 : 1.2,
    });
  }

  // 确定性伤害数字（无随机抖动）：用于光束等高频 tick 伤害，避免消耗 Math.random 影响测试种子
  function addDamageTextDet(damage, x, y, crit) {
    addText(`${Math.round(damage)}`, x, y, crit ? '#ffd166' : '#fff4c2', {
      size: crit ? 30 : 22,
      weight: crit ? 900 : 800,
      shadow: null,
      outline: true,
      rise: crit ? 78 : 62,
      life: crit ? 1.35 : 1.2,
    });
  }

  function applyHitFeedback(enemy, damage, x, y, crit) {
    addDamageText(damage, x, y - enemy.r - 8, crit);
    enemy.hitFlash = 0.09;
    spawnParticles(x, y, enemy.color, crit ? 6 : 3, crit ? 170 : 120);
    if (crit) state.shake = Math.max(state.shake, 3);
    if (state.elapsed - (state.lastHitSoundAt || -99) >= 0.05) {
      state.lastHitSoundAt = state.elapsed;
      playSound('hit');
    }
  }

  function updateTexts(dt) {
    for (let i = state.texts.length - 1; i >= 0; i--) {
      const text = state.texts[i];
      text.y -= (text.rise || 38) * dt;
      text.life -= dt;
      if (text.life <= 0) state.texts.splice(i, 1);
    }
  }

  function triggerCounterAttack() {
    const p = state.player;
    if (!p.counterDamage || p.counterTimer > 0) return;
    p.counterTimer = p.counterCooldown || 1;
    const baseDamage = p.counterDamage + Math.round(p.maxHp * (p.counterHpRatio || 0));
    const radius = p.counterRadius || 180;
    for (let i = state.enemies.length - 1; i >= 0; i--) {
      const enemy = state.enemies[i];
      if (!enemy) continue;
      const dist = Math.hypot(enemy.x - p.x, enemy.y - p.y);
      if (dist > enemy.r + radius) continue;
      const damage = baseDamage + Math.round(enemy.maxHp * (p.counterEnemyHpRatio || 0));
      enemy.hp -= damage;
      state.damageDealt += damage;
      applyHitFeedback(enemy, damage, enemy.x, enemy.y, false);
      if (enemy.hp <= 0) killEnemy(enemy, i);
    }
    healPlayer(p, Math.max(1, Math.round(p.maxHp * 0.15)));
    spawnExplosion(p.x, p.y, '#62e6a1', 18);
    spawnParticles(p.x, p.y, '#b28cff', 8, 220);
    addText('反击', p.x, p.y - 44, '#62e6a1', { size: 16, weight: 900 });
    playSound('kill');
    markHud();
  }

  function reflectEnemyBullet(bullet) {
    const p = state.player;
    // 反弹伤害 = 反击基础伤害（100 + 75% 生命）+ 命中时 4% 目标最大生命
    const damage = p.counterDamage + Math.round(p.maxHp * (p.counterHpRatio || 0));
    let target = null;
    let bestDist = Infinity;
    for (const enemy of state.enemies) {
      const dist = Math.hypot(enemy.x - p.x, enemy.y - p.y);
      if (dist < bestDist) {
        bestDist = dist;
        target = enemy;
      }
    }
    let angle;
    if (target) {
      angle = Math.atan2(target.y - p.y, target.x - p.x);
    } else {
      // 无目标时沿来弹方向原路弹回
      angle = Math.atan2(-bullet.vy, -bullet.vx);
    }
    state.bullets.push({
      x: p.x,
      y: p.y,
      vx: Math.cos(angle) * COUNTER_REFLECT_SPEED,
      vy: Math.sin(angle) * COUNTER_REFLECT_SPEED,
      r: 4.5,
      sizeScale: 1,
      damage,
      pierce: 1,
      ammoType: 'bolt',
      homing: true,
      homingRange: 980,
      homingTurn: 5.2,
      source: 'player',
      targetId: null,
      critChance: 0,
      critDamage: 1,
      critBonusMul: 1,
      maxHpDamage: COUNTER_REFLECT_TARGET_HP_RATIO,
      executeMul: 0,
      splitChance: 0,
      ultHitChance: 0,
      ultTriggered: true,
      hitIds: new Set(),
      life: 1.6,
      tailX: p.x,
      tailY: p.y,
      color: '#7ef0d4',
      splashRadius: COUNTER_REFLECT_SPLASH,
    });
    spawnParticles(p.x, p.y, '#7ef0d4', 6, 220);
    addText('反弹', p.x, p.y - 44, '#7ef0d4', { size: 13, weight: 800 });
    playSound('kill');
  }

  function damagePlayer(amount) {
    const p = state.player;
    if (state.over || p.invuln > 0 || p.ultShield > 0) return;
    if (p.shield > 0) {
      const absorbed = Math.min(p.shield, amount);
      p.shield -= absorbed;
      amount -= absorbed;
      if (p.shield < 1) p.shield = 0;
      if (amount <= 0) {
        p.invuln = HIT_INVULN;
        p.shieldTimer = Math.max(p.shieldTimer, 5);
        p.afterHitTimer = 1.2;
        markHud();
        return;
      }
    }
    p.hp -= amount;
    if (state.objective && state.objective.id === 'noHit' && !state.objectiveDone) {
      state.objectiveFailed = true;
    }
    p.invuln = HIT_INVULN;
    state.shake = 10;
    // 受伤跳字：大号 + 深色描边 + 红色光晕，弹幕中一眼可辨
    addText(`${Math.round(amount)}`, p.x, p.y - 32, '#ff5565', {
      size: 34,
      weight: 900,
      outline: true,
      halo: '#ff2d3d',
      life: 1.3,
      rise: 56,
    });
    spawnParticles(p.x, p.y, '#ffd166', 10, 180);
    playSound('hurt');
    if (p.shieldCap > 0) {
      p.shield = Math.max(p.shield, p.shieldCap);
      p.shieldTimer = 5;
    }
    if (p.afterHitSpeedMul > 1) p.afterHitTimer = 1.2;
    markHud();
    triggerCounterAttack();
    if (p.recoverChance > 0 && p.recoverCooldown <= 0 && Math.random() < p.recoverChance && p.hp < p.maxHp) {
      const recovered = healPlayer(p, Math.max(4, Math.round(p.maxHp * 0.2)));
      if (recovered > 0) {
        p.recoverCooldown = 15;
        addText(`修复 +${Math.round(recovered)}`, p.x, p.y + 18, '#62e6a1');
      }
    }
    if (p.hp <= 0) endGame();
  }

  function checkLevel() {
    const p = state.player;
    let leveled = false;
    while (p.exp >= p.xpNext) {
      p.exp -= p.xpNext;
      p.level++;
      if (p.buildId === 'balanced' && p.levelDamageBonus > 0) {
        p.damage += Math.max(1, Math.round(p.baseDamageRef * p.levelDamageBonus));
        p.maxHp += Math.max(1, Math.round(p.baseHpRef * 0.02));
      }
      p.xpNext = Math.round((60 + (p.level - 1) * 40) * (1 + Math.min((p.level - 1) * 0.012, 0.18)));
      state.pendingLevels++;
      leveled = true;
    }
    // 升级瞬间反馈：粒子 + 跳字 + 音效（一次结算一次；粒子用确定性版，不扰动种子序列）
    if (leveled) {
      burstParticlesDet(p.x, p.y, '#ffd166', 12, 220, 0.6, 3, 0);
      addText('升级！', p.x, p.y - 58, '#ffd166', { size: 22, weight: 900, outline: true, life: 0.9 });
      playSound('level');
      state.shake = Math.max(state.shake, 4);
    }
  }

  function killEnemy(enemy, index) {
    state.combo++;
    state.comboMax = Math.max(state.comboMax, state.combo);
    state.comboTimer = COMBO_WINDOW;
    // 连杀里程碑反馈（10/25/50/100，克制式，非逐杀刷屏）
    if (COMBO_MILESTONES.includes(state.combo)) {
      const p = state.player;
      addText(`${state.combo} 连杀！`, p.x, p.y - 72, COMBO_MILESTONE_COLORS[state.combo] || '#ffd166', {
        size: state.combo >= 50 ? 26 : 21,
        weight: 900,
        life: 1,
        outline: true,
      });
      playSound('level');
      state.shake = Math.max(state.shake, state.combo >= 50 ? 8 : 5);
    }
    // 多重击杀：0.6s 窗口内击杀数达 3/5/8 弹爆发跳字
    state.multiKillTimer = MULTI_KILL_WINDOW;
    state.multiKillCount = (state.multiKillCount || 0) + 1;
    const multi = MULTI_KILL_TEXT[state.multiKillCount];
    if (multi) {
      addText(multi.text, enemy.x, enemy.y - 48, multi.color, { size: multi.size, weight: 900, life: 0.95, outline: true });
      if (state.multiKillCount >= 8) state.shake = Math.max(state.shake, 6);
    }
    state.enemies.splice(index, 1);
    state.kills++;
    state.score += enemy.score;
    if (enemy.splitter) {
      for (let s = 0; s < 2; s++) {
        spawnEnemy('scout', { x: enemy.x + (s === 0 ? -20 : 20), y: enemy.y + 8 });
      }
      addText('分裂', enemy.x, enemy.y - 42, '#ff7bd5', { size: 14, weight: 800 });
    }
    if (state.objective && state.objective.id === 'droneKills' && state.lastKillSource === 'drone') {
      markObjectiveProgress();
    }
    const xpGain = enemy.xp;
    const p = state.player;
    p.exp += xpGain;
    // 经验光点吸入：击杀生成小光点飞向机体（上限防刷屏）
    // 注意：抖动用确定性算式而非 randRange，避免消耗 Math.random 扰动种子化测试序列
    if (state.xpOrbs.length < MAX_XP_ORBS) {
      state.xpOrbs.push({
        x: enemy.x + ((state.kills * 7) % 13) - 6,
        y: enemy.y + ((state.kills * 5) % 9) - 4,
        color: '#ffe08a',
        life: XP_ORB_LIFE,
        maxLife: XP_ORB_LIFE,
      });
    }
    if (p.buildId === 'crit' && p.critKillPower > 0) {
      p.critDamage = p.critDamage + p.critKillPower;
    }
    if (p.buildId === 'drone' && p.droneKillPower > 0) {
      p.dronePower = (p.dronePower || 1) + p.droneKillPower;
      p.lifesteal = Math.min(6, 1.5 + (p.dronePower - 1) * 1.5);
    }
    if (p.plunderChance > 0 && Math.random() < p.plunderChance) {
      p.exp += Math.max(1, Math.round(xpGain * 0.5));
      addText('掠夺', enemy.x, enemy.y - 40, '#ffd166', { size: 14 });
    }
    const ultGain = Math.max(1, Math.round(enemy.xp / ULT_ENERGY_DIVISOR));
    const wasUltReady = p.ultEnergy >= p.ultMax;
    grantUltimateEnergy(p, ultGain);
    if (!wasUltReady && p.ultEnergy >= p.ultMax) addLog('大招已就绪');
    spawnExplosion(enemy.x, enemy.y, enemy.color, Math.round(enemy.r * 0.9));
    if (p.chainChance > 0 && Math.random() < p.chainChance) {
      const chainTargets = state.enemies.filter((target) => {
        const dist = Math.hypot(target.x - enemy.x, target.y - enemy.y);
        return dist <= 190;
      });
      for (const target of chainTargets) {
        if (!state.enemies.includes(target) || target.hp <= 0) continue;
        addArc(enemy.x, enemy.y, target.x, target.y, '#b28cff');
        target.hp -= 30;
        state.damageDealt += 30;
        applyHitFeedback(target, 30, target.x, target.y, false);
        if (target.hp <= 0) {
          const index = state.enemies.indexOf(target);
          if (index >= 0) killEnemy(target, index);
        }
      }
    }

    if (enemy.metaReward) {
      const converted = grantTechPoints(enemy.metaReward);
      state.metaGained += enemy.metaReward;
      saveMeta();
      addLog(converted > 0
        ? `科技点已满，溢出 +${converted} 折算为奖励积分`
        : `特殊怪击毁，科技点 +${enemy.metaReward}`);
    }

    if (p.lifesteal > 0) {
      const healed = healPlayer(p, p.lifesteal);
      const overflowCap = overflowShieldCapFor(p);
      if (overflowCap > 0 && p.lifesteal - healed > 0.01) {
        p.shield = Math.min(overflowCap, (p.shield || 0) + (p.lifesteal - healed));
        p.shieldTimer = Math.max(p.shieldTimer || 0, 5);
      }
    }
    if (p.magnetOnKill && p.magnetCd <= 0) {
      p.magnetTimer = p.magnetDuration || 1.5;
      p.magnetCd = 7;
    }
    if (p.frenzyDuration > 0) p.frenzyTimer = p.frenzyDuration;

    if (p.boomChance > 0 && Math.random() < p.boomChance) {
      const boomDamage = 20 + Math.round(p.damage * p.boomDamageMul);
      spawnExplosion(enemy.x, enemy.y, '#ffd166', 8);
      for (let i = state.enemies.length - 1; i >= 0; i--) {
        const target = state.enemies[i];
        if (target === enemy || !target) continue;
        const dist = Math.hypot(target.x - enemy.x, target.y - enemy.y);
        if (dist > target.r + 90) continue;
        target.hp -= boomDamage;
        state.damageDealt += boomDamage;
        applyHitFeedback(target, boomDamage, target.x, target.y, false);
        if (target.hp <= 0) killEnemy(target, i);
      }
    }

    // 爆裂核心：击杀引发范围爆炸（爆炸连锁由 triggerBlastCore 内部处理，guard 防止重复触发）
    if (p.core === 'blast' && !state.blastChainActive) {
      state.blastChainActive = true;
      triggerBlastCore(enemy.x, enemy.y, Math.max(15, Math.round(p.damage * BLAST_CORE_DAMAGE)), 1);
      state.blastChainActive = false;
    }

    if (enemy.type === 'boss') {
      state.lastBossType = enemy.bossType;
      state.bossRewardPending = true;
      // BOSS 击破高光：短暂慢动作 + 多重爆炸 + 大跳字 + 强震屏（粒子用确定性版，不扰动种子序列）
      state.slowmoTimer = SLOWMO_BOSS_DURATION;
      state.slowmoScale = SLOWMO_BOSS_SCALE;
      burstParticlesDet(enemy.x, enemy.y, '#ffd166', 26, 320, 0.8, 4, 0);
      burstParticlesDet(enemy.x, enemy.y, '#ff9e45', 20, 260, 0.7, 3.5, 31);
      burstParticlesDet(enemy.x, enemy.y, '#ff6670', 16, 220, 0.6, 3, 57);
      burstParticlesDet(enemy.x, enemy.y, '#ffffff', 24, 420, 0.5, 2.5, 83);
      addText('BOSS 击破！', enemy.x, enemy.y - enemy.r - 46, '#ffd166', { size: 34, weight: 900, outline: true, life: 1.4 });
      state.shake = Math.max(state.shake, 16);
      playSound('ultimate');
      unlockAchievement('bossSlayer');
    }
    playSound('kill');
    checkLevel();
    markHud();
  }

  function rollBulletCrit(bullet) {
    const crit = Math.random() < bullet.critChance;
    let damage = crit ? Math.round(bullet.damage * bullet.critDamage * (bullet.critBonusMul || 1)) : bullet.damage;
    const overload = bullet.overloadChance > 0 && Math.random() < bullet.overloadChance;
    if (overload) damage = Math.round(damage * 2);
    return {
      damage,
      crit,
      overload,
    };
  }

  function tryUltOnHit(bullet) {
    if (!bullet.ultHitChance || bullet.ultTriggered) return;
    if (Math.random() >= bullet.ultHitChance) return;
    const p = state.player;
    if (p.ultAutoCd > 0) return;
    if (triggerAutoUltimate()) bullet.ultTriggered = true;
  }

  function resistControl(enemy, duration) {
    return Math.max(0, duration * (1 - (enemy.toughness || 0)));
  }

  function applyAmmoEffects(enemy, bullet) {
    if (bullet.jamDuration > 0) {
      const duration = resistControl(enemy, bullet.jamDuration);
      if (duration > 0) {
        enemy.jamUntil = Math.max(enemy.jamUntil || 0, state.elapsed + duration);
      }
    }
    if (bullet.slowPower > 0) {
      const duration = resistControl(enemy, bullet.slowDuration);
      if (duration > 0) {
        enemy.slowUntil = Math.max(enemy.slowUntil, state.elapsed + duration);
        enemy.slowFactor = Math.min(enemy.slowFactor, bullet.slowPower);
      }
    }
    if (bullet.burnDps > 0) {
      enemy.burns.push({ dps: bullet.burnDps, remaining: bullet.burnDuration, tick: 0.1 });
    }
  }

  function segmentCircleHit(ax, ay, bx, by, cx, cy, r) {
    const dx = bx - ax;
    const dy = by - ay;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) {
      const px = ax - cx;
      const py = ay - cy;
      return px * px + py * py <= r * r;
    }
    let t = ((cx - ax) * dx + (cy - ay) * dy) / lenSq;
    t = clamp(t, 0, 1);
    const px = ax + dx * t - cx;
    const py = ay + dy * t - cy;
    return px * px + py * py <= r * r;
  }

  function handleCollisions() {
    const p = state.player;
    state.lastKillSource = null;

    for (let i = state.bullets.length - 1; i >= 0; i--) {
      const bullet = state.bullets[i];
      if (bullet.blastRadius) {
        let exploded = false;
        let blastX = 0;
        let blastY = 0;
        for (let j = state.enemies.length - 1; j >= 0; j--) {
          const enemy = state.enemies[j];
          if (!enemy) continue;
          if (segmentCircleHit(
            bullet.tailX,
            bullet.tailY,
            bullet.x,
            bullet.y,
            enemy.x,
            enemy.y,
            enemy.r + bullet.r,
          )) {
            exploded = true;
            const blastRoll = rollBulletCrit(bullet);
            const blastDamage = blastRoll.damage;
            blastX = enemy.x;
            blastY = enemy.y;
            for (let k = state.enemies.length - 1; k >= 0; k--) {
              const target = state.enemies[k];
              if (!target) continue;
              const tx = target.x - blastX;
              const ty = target.y - blastY;
              const radius = target.r + bullet.blastRadius;
              if (tx * tx + ty * ty <= radius * radius) {
                const distance = Math.hypot(tx, ty);
                const direct = distance <= target.r + bullet.r;
                const percentDamage = bullet.maxHpDamage
                  ? Math.max(1, Math.round(target.maxHp * bullet.maxHpDamage))
                  : 0;
                const damage = (direct
                  ? blastDamage
                  : Math.max(1, Math.round(blastDamage * 0.5))) + percentDamage;
                target.hp -= damage;
                state.damageDealt += damage;
                markHud();
                tryUltOnHit(bullet);
                applyHitFeedback(target, damage, target.x, target.y, direct && blastRoll.crit);
                if (target.hp <= 0) killEnemy(target, k);
              }
            }
            break;
          }
        }
        if (exploded) {
          spawnExplosion(blastX, blastY, '#ffd166', 6);
          state.bullets.splice(i, 1);
        }
        continue;
      }

      let removeBullet = false;
      for (let j = state.enemies.length - 1; j >= 0; j--) {
        const enemy = state.enemies[j];
        if (!enemy) continue;
        if (bullet.hitIds.has(enemy.id)) continue;
        if (segmentCircleHit(
          bullet.tailX,
          bullet.tailY,
          bullet.x,
          bullet.y,
          enemy.x,
          enemy.y,
          enemy.r + bullet.r,
        )) {
          const roll = rollBulletCrit(bullet);
          const percentDamage = bullet.maxHpDamage
            ? Math.max(1, Math.round(enemy.maxHp * bullet.maxHpDamage))
            : 0;
          let damage = roll.damage + percentDamage;
          if (enemy.type === 'boss' && enemy.coreExposed) {
            const coreDx = enemy.x - bullet.x;
            const coreDy = (enemy.y - 8) - bullet.y;
            if (coreDx * coreDx + coreDy * coreDy <= 15 * 15) {
              damage = Math.round(damage * 2.5);
              enemy.coreHits = (enemy.coreHits || 0) + 1;
              enemy.coreHitFlash = 0.15;
              addText('核心命中', enemy.x, enemy.y - enemy.r - 62, '#7fe7ff', {
                size: 18,
                weight: 900,
                life: 0.8,
              });
              if (enemy.coreHits >= BOSS_CORE_HITS) {
                enemy.coreExposed = false;
                enemy.coreTimer = 0;
                enemy.stunTimer = Math.max(enemy.stunTimer || 0, resistControl(enemy, 1.4));
                state.shake = Math.max(state.shake, 6);
                addText('核心击破', enemy.x, enemy.y - enemy.r - 40, '#8be9ff', {
                  size: 20,
                  weight: 900,
                });
              }
            }
          }
          // 狂暴核心暴露窗口（方案 C·奖励型）：狂暴期周期窗口内命中 Boss → 伤害加成，
          // 非窗口期照常满伤（不做减伤惩罚，避免重型装甲 Boss 打不动）。
          if (enemy.type === 'boss' && enemy.enraged
              && (enemy.rageCoreTimer < BOSS_RAGE_CORE_WINDOW)) {
            damage = Math.round(damage * BOSS_RAGE_CORE_BONUS);
          }
          if (p.stunChance > 0 && Math.random() < p.stunChance) {
            enemy.stunTimer = Math.max(enemy.stunTimer || 0, resistControl(enemy, 0.5));
          }
          if (bullet.executeMul > 0 && enemy.hp < enemy.maxHp * 0.25) {
            damage = Math.round(damage * (1 + bullet.executeMul));
          }
          if (bullet.splitChance > 0 && Math.random() < bullet.splitChance) {
            for (let s = 0; s < 2; s++) {
              state.bullets.push({
                x: enemy.x,
                y: enemy.y,
                vx: Math.cos(-Math.PI / 2 + (s * 2 - 1) * 0.5) * 420,
                vy: Math.sin(-Math.PI / 2 + (s * 2 - 1) * 0.5) * 420,
                r: 3.5,
                sizeScale: 1,
                damage: Math.max(1, Math.round(bullet.damage * 0.4)),
                pierce: 0,
                ammoType: 'bolt',
                homing: true,
                homingRange: 420,
                homingTurn: 3.8,
                source: 'player',
                targetId: null,
                critChance: bullet.critChance,
                critDamage: bullet.critDamage,
                critBonusMul: bullet.critBonusMul || 1,
                maxHpDamage: 0,
                executeMul: 0,
                splitChance: 0,
                ultHitChance: bullet.ultHitChance,
                ultTriggered: false,
                hitIds: new Set(),
                life: 1.2,
                tailX: enemy.x,
                tailY: enemy.y,
                color: '#9ff3ff',
              });
            }
          }
          applyAmmoEffects(enemy, bullet);
          enemy.hp -= damage;
          state.damageDealt += damage;
          markHud();
          tryUltOnHit(bullet);
          applyHitFeedback(enemy, damage, bullet.x, bullet.y, roll.crit);
          // 电弧核心：命中触发连锁闪电（带内置冷却）
          if (p.core === 'arc') triggerArcCore(enemy.x, enemy.y, damage, enemy.id);
          // 反弹弹命中时溅射周围敌人（反击流特性）
          if (bullet.splashRadius > 0) {
            for (let k = state.enemies.length - 1; k >= 0; k--) {
              const target = state.enemies[k];
              if (target === enemy || !target) continue;
              const dist = Math.hypot(target.x - enemy.x, target.y - enemy.y);
              if (dist > target.r + bullet.splashRadius) continue;
              target.hp -= damage;
              state.damageDealt += damage;
              applyHitFeedback(target, damage, target.x, target.y, false);
              if (target.hp <= 0) killEnemy(target, k);
            }
            spawnExplosion(enemy.x, enemy.y, '#7ef0d4', 10);
          }
          if (roll.crit && p.buildId === 'crit') healPlayer(p, Math.max(1, Math.round(p.maxHp * 0.03)));
          bullet.hitIds.add(enemy.id);
          if (bullet.ricochet > 0) {
            // 弹射核心：命中后弹向附近未命中敌人，伤害逐跳衰减
            const ricochetNext = nearestEnemy(enemy.x, enemy.y, RICOCHET_CORE_RANGE, bullet.hitIds);
            if (ricochetNext) {
              bullet.ricochet--;
              const ricochetAngle = Math.atan2(ricochetNext.y - enemy.y, ricochetNext.x - enemy.x);
              bullet.vx = Math.cos(ricochetAngle) * RICOCHET_CORE_SPEED;
              bullet.vy = Math.sin(ricochetAngle) * RICOCHET_CORE_SPEED;
              bullet.damage = Math.max(1, Math.round(bullet.damage * RICOCHET_CORE_DECAY));
              bullet.homing = false;
              bullet.targetId = null;
              bullet.tailX = enemy.x;
              bullet.tailY = enemy.y;
              bullet.life = Math.max(bullet.life, 0.55);
              spawnParticles(enemy.x, enemy.y, '#7fe7ff', 4, 170);
            } else {
              removeBullet = true;
            }
          } else {
            bullet.pierce--;
            if (bullet.pierce < 0) removeBullet = true;
          }
          if (bullet.source === 'drone') state.lastKillSource = 'drone';
          if (enemy.hp <= 0) killEnemy(enemy, j);
          break;
        }
      }
      if (removeBullet) state.bullets.splice(i, 1);
    }

    if (p.invuln <= 0) {
      for (let i = state.enemyBullets.length - 1; i >= 0; i--) {
        const bullet = state.enemyBullets[i];
        if (segmentCircleHit(
          bullet.tailX,
          bullet.tailY,
          bullet.x,
          bullet.y,
          p.x,
          p.y,
          p.r + bullet.r,
        )) {
          state.enemyBullets.splice(i, 1);
          const dodgeBonus = p.afterHitTimer > 0 ? p.afterHitDodgeBonus || 0 : 0;
          if (p.dodgeChance + dodgeBonus > 0 && Math.random() < p.dodgeChance + dodgeBonus) {
            addText('闪避', p.x, p.y - 24, '#62e6ff');
          } else {
            damagePlayer(bullet.damage);
            if (state.over) return;
            // 反击流：命中玩家的弹幕直接反弹，命中敌人时溅射周围
            if (p.buildId === 'counter' && p.counterDamage > 0) reflectEnemyBullet(bullet);
          }
          break;
        }
      }

      for (let i = state.enemies.length - 1; i >= 0; i--) {
        const enemy = state.enemies[i];
        if (!enemy) continue;
        const dx = p.x - enemy.x;
        const dy = p.y - enemy.y;
        const rr = p.r + enemy.r;
        if (dx * dx + dy * dy <= rr * rr) {
          damagePlayer(enemy.contact);
          if (state.over) return;
          if (!state.enemies.includes(enemy)) continue;
          // BOSS 免疫碰撞移除：防止"撞一下 BOSS 直接被移除"绕过正常死亡流程
          //（此前任何敌人都能被碰撞 splice 掉，反击流靠高血量+反击回血可稳定撞掉 BOSS）
          if (enemy.type === 'boss') continue;
          spawnExplosion(enemy.x, enemy.y, enemy.color, 12);
          state.enemies.splice(i, 1);
          state.score += Math.floor(enemy.score / 2);
          markHud();
        }
      }
    }
  }

  function shouldShowRunCheckpoint() {
    if (!state) return false;
    if (state.wave === MISSION_FINAL_WAVE && !state.missionComplete) return true;
    return state.endless
      && state.wave > MISSION_FINAL_WAVE
      && state.wave % 5 === 0
      && state.lastCheckpointWave !== state.wave;
  }

  function updateWave(dt) {
    const queue = state.spawnQueue;
    state.spawnTimer += dt;
    while (state.spawnIndex < queue.length && state.spawnTimer >= queue[state.spawnIndex].delay) {
      spawnEnemy(queue[state.spawnIndex].type, queue[state.spawnIndex]);
      state.spawnIndex++;
    }

    if (state.spawnIndex >= queue.length && state.enemies.length === 0) {
      state.waveEndTimer += dt;
      if (state.waveEndTimer >= WAVE_END_DELAY) {
        state.waveEndTimer = 0;
        settleObjective();
        if (shouldShowRunCheckpoint()) showRunCheckpoint();
        else nextWave();
      }
    }
  }

  function update(dt) {
    state.elapsed += dt;
    const displayedSecond = Math.floor(state.elapsed);
    if (displayedSecond !== state.displayedSecond) {
      state.displayedSecond = displayedSecond;
      els.timeValue.textContent = formatRunTime(displayedSecond);
    }
    // 移动端 HUD 拖动淡出：拖动移动（pointerActive）时让出顶部视野，状态翻转时才写 DOM
    if (els.gameHud && hudDimActive !== pointerActive) {
      hudDimActive = pointerActive;
      els.gameHud.classList.toggle('dim', pointerActive);
    }
    updateStars(dt);
    updatePlayer(dt);
    updateDrones(dt);
    updateMirrors(dt);
    updateOrbitals(dt);
    updatePlayerBullets(dt);
    updateSpecialDrops(dt);
    updateEnemies(dt);
    updateEnemyBullets(dt);
    handleCollisions();
    updateParticles(dt);
    updateMuzzleFlashes(dt);
    updateArcs(dt);
    updateXpOrbs(dt);
    updateTexts(dt);
    if (state.ultFlash) {
      state.ultFlash.t += dt;
      if (state.ultFlash.t >= state.ultFlash.duration) state.ultFlash = null;
    }
    updateWave(dt);
    updateCombo(dt);
    if (state.bossWarningTimer > 0) {
      state.bossWarningTimer -= dt;
      if (state.bossWarningTimer <= 0) {
        state.bossWarningTimer = 0;
        els.bossWarning.classList.add('hidden');
      } else {
        els.bossWarningText.textContent = `${state.wave === MISSION_FINAL_WAVE ? '最终 BOSS' : 'BOSS'} ${bossNameForWave(state.wave)} 即将降临 ${Math.ceil(state.bossWarningTimer)}秒`;
      }
    }
    state.shake = Math.max(0, state.shake - dt * 18);
    state.hudTimer += dt;
    if (state.waveBanner) {
      state.waveBanner.t -= dt;
      if (state.waveBanner.t <= 0) state.waveBanner = null;
    }
    if (state.bossRewardPending && !state.over && !state.checkpointOpen && !state.levelUpOpen && !state.firstSeenOpen) {
      openBossReward();
    }
    if (state.pendingLevels > 0 && !state.over && !state.checkpointOpen && !state.bossChoiceOpen && !state.firstSeenOpen) {
      openLevelUp();
    }
    if (state.coreTransformPending && !state.over && !state.checkpointOpen && !state.levelUpOpen && !state.bossChoiceOpen && !state.firstSeenOpen) {
      openCoreTransform();
    }
  }

  function activateUltimate(auto = false) {
    const p = state.player;
    if (!auto) p.ultEnergy = 0;
    // 大招拆解（2026-08-16）：移除"无敌站桩"——免伤无敌 4s→1s（只防抓帧），
    // 受击无敌不再额外拉长到 3s（回落到普通 HIT_INVULN），射速 ×1.5 与回血保留。
    p.ultShield = 1;
    p.ultRate = 10;
    p.invuln = Math.max(p.invuln, HIT_INVULN);
    const instantHeal = healPlayer(p, p.maxHp * ULT_INSTANT_HEAL_RATIO);
    p.ultRegenTimer = Math.max(p.ultRegenTimer, ULT_REGEN_DURATION);
    state.shake = Math.max(state.shake, 10);
    spawnExplosion(p.x, p.y, '#ffd166', 22);
    spawnParticles(p.x, p.y, '#b28cff', 18, 260);
    state.ultFlash = {
      t: 0,
      duration: 0.7,
      x: p.x,
      y: p.y,
      auto,
    };
    addText(auto ? '自动大招' : '大招释放', p.x, p.y - 44, '#ffd166');
    playSound('ultimate');
    const prefix = auto ? `自动大招触发，${ULT_AUTO_COOLDOWN} 秒冷却` : '大招释放';
    addLog(`${prefix}；瞬时修复 ${Math.round(instantHeal)}，持续修复 ${ULT_REGEN_DURATION} 秒`);
    markHud();
  }

  function useUltimate() {
    if (!state || state.over || paused || state.levelUpOpen || state.bossChoiceOpen || state.firstSeenOpen) return;
    const p = state.player;
    if (p.ultEnergy < p.ultMax) return;
    activateUltimate(false);
  }

  function useDash() {
    if (!state || state.over || paused || state.levelUpOpen || state.bossChoiceOpen || state.checkpointOpen || state.firstSeenOpen) return;
    const p = state.player;
    if (!p.dashUnlocked || p.dashCd > 0 || p.dashTimer > 0) return;
    p.dashCd = DASH_COOLDOWN;
    p.dashTimer = DASH_DURATION;
    p.invuln = Math.max(p.invuln, 0.45);
    spawnParticles(p.x, p.y, '#8be9ff', 12, 220);
    addText('冲刺', p.x, p.y - 46, '#8be9ff', { size: 16, weight: 900 });
    playSound('level');
    markHud();
  }

  function triggerAutoUltimate() {
    if (!state || state.over || paused || state.levelUpOpen || state.bossChoiceOpen || state.firstSeenOpen) return;
    const p = state.player;
    if (p.ultAutoCd > 0) return;
    p.ultAutoCd = ULT_AUTO_COOLDOWN;
    activateUltimate(true);
    return true;
  }

  function useBomb() {
    if (!state || state.over || paused || state.levelUpOpen || state.bossChoiceOpen || state.firstSeenOpen) return;
    const p = state.player;
    if (p.bombs <= 0 || p.bombCd > 0) return;
    p.bombs--;
    p.bombCd = 60;
    state.enemyBullets.length = 0;
    const independentMul = 1 + (p.independentDamageBonus || 0);
    const damage = Math.round((250 + p.damage * 12 + state.wave * 20) * independentMul);
    const targets = state.enemies.slice();
    for (const enemy of targets) {
      if (!state.enemies.includes(enemy) || enemy.hp <= 0) continue;
      enemy.hp -= damage;
      state.damageDealt += damage;
      if (enemy.hp <= 0) {
        const index = state.enemies.indexOf(enemy);
        if (index >= 0) killEnemy(enemy, index);
      }
    }
    state.shake = 14;
    spawnExplosion(p.x, p.y, '#ffe08a', 26);
    addText('BOOM', p.x, p.y - 30, '#ffe08a');
    playSound('bomb');
    addLog('炸弹释放');
    markHud();
    if (state.bossRewardPending) openBossReward();
  }

  function calculateRewardPoints(score, wave, kills) {
    if (score <= 0) return 0;
    return Math.floor(score / 240)
      + Math.floor(kills / 18)
      + Math.floor(Math.max(0, wave - 1) / 2);
  }

  function calculateRunRewards(run = state) {
    const affix = run && run.affix;
    const contractMul = run && run.contract ? run.contract.rewardMul : 1;
    const rewardMultiplier = Math.round((affix ? affix.scoreMul : 1) * contractMul * 100) / 100;
    const scoreBeforeMultiplier = run ? run.score : 0;
    const baseRewardPoints = run
      ? calculateRewardPoints(scoreBeforeMultiplier, run.wave, run.kills)
      : 0;
    const completionRewardPoints = run && run.missionComplete
      ? Math.max(0, run.completionRewardPoints || 0)
      : 0;
    const rewardPointsEligibleBase = baseRewardPoints + completionRewardPoints;
    const baseTechPoints = run
      ? Math.floor(run.kills / 30) + Math.floor(run.wave / 3)
      : 0;
    return {
      affix,
      rewardMultiplier,
      scoreBeforeMultiplier,
      baseRewardPoints,
      completionRewardPoints,
      rewardPointsEligibleBase,
      rewardPointsGained: Math.floor(rewardPointsEligibleBase * rewardMultiplier),
      affixScoreBonus: affix ? Math.floor(scoreBeforeMultiplier * (rewardMultiplier - 1)) : 0,
      affixMetaBonus: affix ? Math.floor(run.wave / 5) * (affix.techPer5 || 1) : 0,
      baseTechPoints,
    };
  }

  function renderOverlayStats(stats) {
    els.overlayStats.replaceChildren();
    for (const [label, value] of stats) {
      const stat = document.createElement('div');
      stat.className = 'overlay-stat';
      const labelEl = document.createElement('span');
      labelEl.textContent = label;
      const valueEl = document.createElement('strong');
      valueEl.textContent = value;
      stat.append(labelEl, valueEl);
      els.overlayStats.appendChild(stat);
    }
    renderSettlementBonuses();
  }

  // 结算页"本局加成"：当前局内的核心加成数值（结算页扩宽后以胶囊网格展示，不溢出）
  function settlementBonusChips(p) {
    const chips = [];
    const add = (name, value) => chips.push([name, value]);
    add('主炮伤害', `${p.damage + (p.baseDamageBonus || 0)}`);
    add('射击间隔', `${p.fireInterval.toFixed(3)}s`);
    add('暴击率', `${Math.round(p.critChance * 100)}%`);
    add('暴击伤害', `${Math.round(p.critDamage * (p.critBonusMul || 1) * 100)}%`);
    add('穿透', String(p.pierce));
    add('弹列', `${p.rows || 1} 排`);
    add('浮游炮', String(p.droneCount || 0));
    add('生命上限', `${Math.round(p.maxHp)}`);
    add('移速', String(p.speed));
    if (p.regen > 0) add('每秒回复', `${p.regen}`);
    if (p.lifesteal > 0) add('吸血', `${p.lifesteal}`);
    if (p.bombs > 0) add('炸弹', String(p.bombs));
    if (p.splitChance > 0) add('分裂弹', `${Math.round(p.splitChance * 100)}%`);
    if ((p.burnDpsBonus || 0) > 0) add('灼烧', `${p.burnDpsBonus}/s`);
    if ((p.executeMul || 0) > 0) add('处决加成', `+${Math.round(p.executeMul * 100)}%`);
    if ((p.jamDuration || 0) > 0) add('卡壳', `${p.jamDuration}s`);
    if ((p.shield || 0) > 0) add('护盾', `${Math.round(p.shield)}`);
    if (p.gold && p.gold.orbitalBlade) add('环绕护盾刃', '已激活');
    if (p.gold && p.gold.timeRift) add('时间裂隙', '已激活');
    if (p.gold && p.gold.warpDrive) add('相位引擎', '已激活');
    return chips;
  }

  function renderSettlementBonuses() {
    const el = document.getElementById('overlayBonuses');
    if (!el || !state) return;
    el.replaceChildren();
    const chips = settlementBonusChips(state.player);
    if (!chips.length) {
      el.classList.add('hidden');
      return;
    }
    el.classList.remove('hidden');
    const head = document.createElement('h3');
    head.textContent = '本局加成';
    el.appendChild(head);
    const wrap = document.createElement('div');
    wrap.className = 'bonus-chips';
    for (const [name, value] of chips) {
      const chip = document.createElement('span');
      chip.className = 'bonus-chip';
      const n = document.createElement('span');
      n.textContent = name;
      const v = document.createElement('b');
      v.textContent = value;
      chip.append(n, v);
      wrap.appendChild(chip);
    }
    el.appendChild(wrap);
  }

  function hideRunDecisionButtons() {
    els.victorySettleBtn.classList.add('hidden');
    els.continueEndlessBtn.classList.add('hidden');
  }

  function openBossReward() {
    if (!state || state.over || state.bossChoiceOpen || state.checkpointOpen || state.levelUpOpen || state.firstSeenOpen) return false;
    state.bossRewardPending = false;
    state.bossChoiceOpen = true;
    paused = true;
    els.bossRewardOverlay.classList.remove('hidden');
    els.bossRewardTitle.textContent = 'BOSS 残骸 · 自选强化';
    const sub = document.querySelector('.boss-reward-sub');
    if (sub) sub.textContent = '从全部增益中自选 1 项（已达上限的不可选）';
    if (els.bossRewardPreview) {
      if (state.lastBossType) {
        drawEnemyPreviewInto(els.bossRewardPreview, { id: `boss:${state.lastBossType}` });
      } else {
        const ctx = els.bossRewardPreview.getContext('2d');
        ctx.clearRect(0, 0, els.bossRewardPreview.width, els.bossRewardPreview.height);
      }
    }
    els.bossRewardChoices.replaceChildren();
    renderBossSelfSelectAll();
    updatePauseIcon();
    return true;
  }

  // BOSS 残骸全量自选：列出所有局内/无尽增益与金色模组，每项品质随机，
  // 已达上限（且当前品质无法突破）的置灰不可选
  function renderBossSelfSelectAll() {
    const p = state.player;
    const all = [
      ...UPGRADES.map((upgrade) => ({ upgrade, rarity: rollBuffRarity() })),
      ...ENDLESS_UPGRADES.map((upgrade) => ({ upgrade, rarity: rollBuffRarity() })),
      ...GOLD_MODULES.map((upgrade) => ({ upgrade, rarity: null })),
    ];
    let anyAvailable = false;
    for (const pick of all) {
      const { upgrade, rarity } = pick;
      const available = upgradeAvailable(p, upgrade, rarity);
      if (available) anyAvailable = true;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'boss-reward-card';
      button.disabled = !available;
      if (rarity) button.classList.add(`rarity-${rarity.id}`);
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('class', 'icon');
      icon.setAttribute('aria-hidden', 'true');
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('href', upgrade.icon);
      icon.appendChild(use);
      const main = document.createElement('span');
      main.className = 'boss-reward-main';
      const title = document.createElement('strong');
      title.textContent = upgrade.name;
      if (rarity) {
        const badge = document.createElement('span');
        badge.className = 'rarity-badge';
        badge.textContent = rarity.name;
        badge.style.color = rarity.color;
        title.appendChild(badge);
      }
      if (!available) {
        const tag = document.createElement('span');
        tag.className = 'boss-reward-tag';
        tag.textContent = rarity ? '已达上限' : '已拥有';
        title.appendChild(tag);
      }
      const desc = document.createElement('span');
      desc.textContent = rarity ? upgradeRarityDesc(upgrade, rarity) : upgrade.desc;
      main.append(title, desc);
      button.append(icon, main);
      button.addEventListener('click', () => applyBossSelfSelect(pick));
      els.bossRewardChoices.appendChild(button);
    }
    if (!anyAvailable) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'action-btn';
      button.textContent = '无可选增益 · 继续';
      button.addEventListener('click', closeBossReward);
      els.bossRewardChoices.appendChild(button);
    }
  }

  function closeBossReward() {
    if (!state) return;
    state.bossChoiceOpen = false;
    paused = false;
    els.bossRewardOverlay.classList.add('hidden');
    updatePauseIcon();
    markHud();
  }

  function applyBossSelfSelect(pick) {
    if (!state) return;
    const p = state.player;
    const { upgrade, rarity } = pick;
    p.upgrades[upgrade.id] = (p.upgrades[upgrade.id] || 0) + 1;
    upgrade.apply(p, rarity ? rarity.scale : 1, rarity);
    addLog(`BOSS 自选强化：${upgrade.name}${rarity ? ` [${rarity.name}]` : ''}`);
    playSound('level');
    closeBossReward();
  }

  function renderContractChoices() {
    els.contractList.replaceChildren();
    for (const contract of ENDLESS_CONTRACTS) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'contract-card';
      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      icon.setAttribute('class', 'icon');
      icon.setAttribute('aria-hidden', 'true');
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('href', contract.icon);
      icon.appendChild(use);
      const main = document.createElement('span');
      main.className = 'contract-main';
      const title = document.createElement('strong');
      title.textContent = contract.name;
      const desc = document.createElement('span');
      desc.textContent = contract.desc;
      main.append(title, desc);
      button.append(icon, main);
      button.addEventListener('click', () => {
        applyContract(contract);
        continueEndlessRun();
      });
      els.contractList.appendChild(button);
    }
  }

  function applyContract(contract) {
    if (!state) return;
    const p = state.player;
    state.contract = {
      id: contract.id,
      name: contract.name,
      rewardMul: contract.rewardMul || 1,
      healingMul: contract.healingMul || 1,
      bulletSpeedMul: contract.bulletSpeedMul || 1,
      waveCountMul: contract.waveCountMul || 1,
    };
    state.contractWavesLeft = 5;
    if (contract.damageMul) p.damage = Math.round(p.damage * contract.damageMul);
    if (contract.bombs) p.bombs += contract.bombs;
    if (contract.ultEnergy) grantUltimateEnergy(p, contract.ultEnergy);
    addLog(`契约生效：${contract.name}`);
    playSound('level');
    markHud();
  }

  function markObjectiveProgress(amount = 1) {
    if (!state || !state.objective || state.objectiveDone || state.objectiveFailed) return;
    state.objectiveProgress += amount;
    if (state.objective.target && state.objectiveProgress >= state.objective.target) {
      completeObjective();
    }
  }

  function completeObjective() {
    const obj = state.objective;
    if (!obj || state.objectiveDone || state.objectiveFailed) return;
    state.objectiveDone = true;
    state.score += obj.reward;
    if (obj.tech) {
      const converted = grantTechPoints(obj.tech);
      state.metaGained += obj.tech;
      saveMeta();
      if (converted > 0) addLog(`科技点已满，溢出 +${converted} 折算为奖励积分`);
    }
    addText(`支线完成 +${obj.reward}`, state.player.x, state.player.y - 74, '#ffd166', {
      size: 18,
      weight: 900,
    });
    addLog(`支线完成：${obj.name} +${obj.reward}分`);
    playSound('level');
    markHud();
  }

  function settleObjective() {
    const obj = state.objective;
    if (!obj || state.objectiveDone || state.objectiveFailed) return;
    if (obj.id === 'noHit') {
      completeObjective();
    } else if (obj.id === 'fastClear') {
      if (state.elapsed - state.waveStartTime <= obj.target) completeObjective();
      else state.objectiveFailed = true;
    } else if (obj.target && state.objectiveProgress >= obj.target) {
      completeObjective();
    } else {
      state.objectiveFailed = true;
    }
    if (state.objectiveFailed) {
      addText('支线失败', state.player.x, state.player.y - 74, '#ff8b95', { size: 16, weight: 800 });
      addLog('支线失败，无额外奖励');
      markHud();
    }
  }

  let checkpointToastTimer = null;

  function showCheckpointToast(message) {
    if (!els.checkpointToast) return;
    els.checkpointToast.textContent = message;
    els.checkpointToast.classList.remove('hidden');
    els.checkpointToast.classList.add('show');
    if (checkpointToastTimer) clearTimeout(checkpointToastTimer);
    checkpointToastTimer = setTimeout(() => {
      els.checkpointToast.classList.add('hidden');
      els.checkpointToast.classList.remove('show');
    }, 4000);
  }

  function autoContinueCheckpoint() {
    if (!state || state.over || state.checkpointOpen) return false;
    state.lastCheckpointWave = state.wave;
    const milestonePoints = claimMilestoneRewards(state);
    if (milestonePoints > 0) {
      meta.rewardPoints += milestonePoints;
      state.milestoneRewardPoints += milestonePoints;
      saveMeta();
    }
    let message = `无尽检查点 · 第 ${state.wave} 波 已自动继续`;
    if (state.wave >= ABYSS_START_WAVE && !state.abyss) {
      state.abyss = true;
      message = `无尽深渊 · 第 ${state.wave} 波 已进入`;
      addLog('无尽深渊启动：敌机属性每波按百分比加法成长');
    }
    if (milestonePoints > 0) message += ` · 里程碑 +${milestonePoints} 积分`;
    showCheckpointToast(message);
    addLog(message);
    nextWave();
    markHud();
    return true;
  }

  function showRunCheckpoint() {
    if (!state || state.over || state.checkpointOpen) return false;
    if (!(state.wave === MISSION_FINAL_WAVE && !state.missionComplete)) {
      return autoContinueCheckpoint();
    }
    const firstCompletion = state.wave === MISSION_FINAL_WAVE && !state.missionComplete;
    if (firstCompletion) {
      state.missionComplete = true;
      state.completionTime = state.elapsed;
      const completionBase = calculateRewardPoints(state.score, state.wave, state.kills);
      state.completionRewardPoints = completionBase > 0
        ? Math.max(1, Math.floor(completionBase * COMPLETION_REWARD_RATE))
        : 0;
    }
    const abyssGate = state.endless && !state.abyss && state.wave >= ABYSS_START_WAVE;
    const contractEligible = state.endless
      && state.wave > MISSION_FINAL_WAVE
      && state.wave % 5 === 0
      && !firstCompletion
      && !abyssGate;

    state.checkpointOpen = true;
    state.lastCheckpointWave = state.wave;
    state.enemyBullets.length = 0;
    paused = true;
    const rewards = calculateRunRewards(state);
    const milestonePoints = claimMilestoneRewards(state);
    if (milestonePoints > 0) {
      meta.rewardPoints += milestonePoints;
      state.milestoneRewardPoints += milestonePoints;
      saveMeta();
    }
    els.overlayTitle.textContent = abyssGate
      ? '无尽深渊'
      : firstCompletion ? '任务完成' : '无尽检查点';
    renderOverlayStats([
      ['对局时间', formatRunTime(state.elapsed)],
      ['波次', state.wave],
      ['得分', state.score],
      ['难度倍率', `×${rewards.rewardMultiplier}`],
      ...(state.contract ? [['本段契约', state.contract.name]] : []),
      ['通关奖励', `+${rewards.completionRewardPoints} 积分`],
      ...(milestonePoints > 0 ? [['里程碑奖励', `+${milestonePoints} 积分`]] : []),
      ['预计奖励', `+${rewards.rewardPointsGained} 积分`],
      ...(abyssGate ? [['深渊提示', '敌机属性将按波次加法成长，不再无上限膨胀']] : []),
    ]);
    els.resumeBtn.classList.add('hidden');
    els.restartBtn.classList.add('hidden');
    els.menuBtn.classList.add('hidden');
    els.victorySettleBtn.classList.remove('hidden');
    if (contractEligible) {
      try {
        renderContractChoices();
        els.contractSection.classList.remove('hidden');
      } catch (err) {
        logGame('error', '契约渲染失败', String(err));
        els.contractSection.classList.add('hidden');
      }
      els.continueEndlessBtn.classList.remove('hidden');
    } else {
      els.contractSection.classList.add('hidden');
      els.continueEndlessBtn.classList.remove('hidden');
    }
    const continueLabel = els.continueEndlessBtn.querySelector('span');
    if (continueLabel) {
      continueLabel.textContent = contractEligible
        ? '不选契约继续'
        : abyssGate
          ? '进入深渊'
          : firstCompletion ? '继续无尽' : '继续挑战';
    }
    els.overlay.classList.remove('hidden');
    playSound('level');
    updatePauseIcon();
    markHud();
    return true;
  }

  function continueEndlessRun() {
    if (!state || state.over || !state.checkpointOpen) return false;
    const firstEntry = !state.endless;
    state.endless = true;
    if (state.wave >= ABYSS_START_WAVE && !state.abyss) {
      state.abyss = true;
      logGame('abyss', `进入无尽深渊（第 ${state.wave} 波）`);
      addLog('无尽深渊启动：敌机属性每波按百分比加法成长');
    }
    state.checkpointOpen = false;
    paused = false;
    hideRunDecisionButtons();
    els.overlay.classList.add('hidden');
    nextWave();
    addLog(firstEntry ? '无尽模式启动，每 5 波可安全结算' : '继续无尽挑战');
    updatePauseIcon();
    return true;
  }

  function endGame(options = {}) {
    if (!state || state.over) return false;
    const returnToMenu = Boolean(options.returnToMenu);
    const destroyPlayer = options.destroyPlayer !== false;
    state.over = true;
    state.checkpointOpen = false;
    state.bossChoiceOpen = false;
    state.bossRewardPending = false;
    els.bossRewardOverlay.classList.add('hidden');
    els.bossSelfSelectOverlay.classList.add('hidden');
    const p = state.player;
    if (destroyPlayer) {
      p.hp = 0;
      spawnExplosion(p.x, p.y, '#62e6ff', 30);
    }

    const rewards = calculateRunRewards(state);
    if (rewards.affix) {
      state.score += rewards.affixScoreBonus;
      grantTechPoints(rewards.affixMetaBonus);
    }
    grantTechPoints(rewards.baseTechPoints);
    meta.rewardPoints += rewards.rewardPointsGained;
    const milestonePoints = claimMilestoneRewards(state);
    if (milestonePoints > 0) {
      meta.rewardPoints += milestonePoints;
      state.milestoneRewardPoints += milestonePoints;
    }
    state.affixRewardScore = rewards.affixScoreBonus;
    state.affixRewardMeta = rewards.affixMetaBonus;
    state.rewardPointsGained = rewards.rewardPointsGained;
    state.rewardPointsBase = rewards.baseRewardPoints;
    state.completionRewardPoints = rewards.completionRewardPoints;
    state.baseTechPoints = rewards.baseTechPoints;

    // 每日挑战结算：评级 + 积分（按当日最高评级补差）+ 恢复随机种子
    if (state.dailyChallengeKey) {
      const key = state.dailyChallengeKey;
      const rating = dailyRatingForWave(state.wave);
      const prev = dailyState.badges[key] || '';
      if (!prev || DAILY_RATING_ORDER.indexOf(rating) < DAILY_RATING_ORDER.indexOf(prev)) {
        dailyState.badges[key] = rating;
      }
      const best = dailyState.badges[key];
      const bestPts = DAILY_REWARD_BY_RATING[best] || 0;
      const claimedPts = dailyState.claimedRating ? (DAILY_REWARD_BY_RATING[dailyState.claimedRating] || 0) : 0;
      const delta = Math.max(0, bestPts - claimedPts);
      if (delta > 0) {
        meta.rewardPoints += delta;
        dailyState.claimedRating = best;
        state.dailyRewardDelta = delta;
      }
      state.dailyRating = best;
      state.dailyBestScore = Math.max(dailyState.bestScore || 0, state.score);
      dailyState.bestScore = state.dailyBestScore;
      saveDailyState();
      restoreMathRandom();
      if (best === 'S') unlockAchievement('dailyGold');
    }

    updateAchievementRunStats();
    saveMeta();

    bestScore = Math.max(bestScore, state.score);
    try {
      localStorage.setItem('thunderStrikeBest', String(bestScore));
    } catch (_) {
      // Local storage may be unavailable; best score still works for this run.
    }
    const metaReward = state.metaGained || 0;

    if (returnToMenu) {
      playSound('level');
      openMainMenu();
      return true;
    }

    els.overlayTitle.textContent = state.missionComplete ? '无尽挑战结束' : '本局结束';
    renderOverlayStats([
      ['对局时间', formatRunTime(state.elapsed)],
      ['波次', state.wave],
      ['得分', state.score],
      ['最佳', bestScore],
      ['难度词缀', rewards.affix ? rewards.affix.name : '标准'],
      ['结算倍率', `×${rewards.rewardMultiplier}`],
      ['本段契约', state.contract ? state.contract.name : '无'],
      ['词缀奖励', rewards.affix ? `+${rewards.affixScoreBonus} 分 · +${rewards.affixMetaBonus} 科技点` : '无'],
      ['通关奖励', state.missionComplete ? `+${rewards.completionRewardPoints} 积分` : '未完成'],
      ...(state.milestoneRewardPoints > 0 ? [['里程碑奖励', `+${state.milestoneRewardPoints} 积分`]] : []),
      ['奖励积分', `+${rewards.rewardPointsGained}（基础 ${rewards.baseRewardPoints}）`],
      ['击杀', state.kills],
      ['最高连击', state.comboMax],
      ['等级', p.level],
      ['造成伤害', Math.floor(state.damageDealt)],
      ['科技点', `+${metaReward + rewards.affixMetaBonus + rewards.baseTechPoints}（特殊怪 ${metaReward} · 结算 ${rewards.baseTechPoints}${rewards.affix ? ` · 词缀 ${rewards.affixMetaBonus}` : ''}）`],
      ...(state.convertedTechPoints > 0 ? [['科技点溢出', `天赋树已满，+${state.convertedTechPoints} 折算为奖励积分`]] : []),
      ...(state.dailyRating ? [['每日挑战', `评级 ${state.dailyRating}${state.dailyRewardDelta > 0 ? ` · 奖励 +${state.dailyRewardDelta} 积分` : ''}`]] : []),
    ]);
    hideRunDecisionButtons();
    els.resumeBtn.classList.add('hidden');
    els.restartBtn.classList.remove('hidden');
    els.menuBtn.classList.remove('hidden');
    els.overlay.classList.remove('hidden');
    els.levelUpOverlay.classList.add('hidden');
    state.levelUpOpen = false;
    playSound('over');
    markHud();
    return true;
  }

  function settleCurrentRun() {
    if (!state || state.over) return false;
    return endGame({ returnToMenu: true, destroyPlayer: false });
  }

  const BUFF_RARITIES = [
    { id: 'green', name: '普通', color: '#62e6a1', scale: 0.7 },
    { id: 'blue', name: '精良', color: '#54d7ff', scale: 1 },
    { id: 'purple', name: '史诗', color: '#b28cff', scale: 1.3 },
    { id: 'orange', name: '传说', color: '#ff9e45', scale: 2 },
  ];

  function buffRarityChances() {
    const bonus = Math.min(5, meta.levels.orangeLuck || 0);
    const shrink = bonus * 0.5;
    return { green: 31 - shrink, blue: 41 - shrink, purple: 23, orange: 5 + bonus };
  }

  function rollBuffRarity() {
    const chances = buffRarityChances();
    const roll = Math.random() * 100;
    let acc = 0;
    for (const rarity of BUFF_RARITIES) {
      acc += chances[rarity.id];
      if (roll < acc) return rarity;
    }
    return BUFF_RARITIES[3];
  }

  function droneLibraryMax(p) {
    return p.buildId === 'drone' ? 6 : 4;
  }

  function upgradeAtBaseCap(p, upgrade) {
    const count = p.upgrades[upgrade.id] || 0;
    switch (upgrade.id) {
      case 'barrel':
        return count >= upgrade.max || p.rows >= 3;
      case 'drone':
        return count >= upgrade.max || p.droneCount >= droneLibraryMax(p) || p.droneBroke;
      case 'bulletSize':
        return count >= upgrade.max || p.bulletSizeBonus >= 1.5;
      case 'hp':
        return p.armorBuffBonus >= 75;
      case 'regen':
        return p.regenBuffBonus >= 3;
      case 'speed':
        return p.speedBonus >= 0.45;
      case 'life':
        return p.lifeBuffBonus >= 3;
      default:
        return count >= upgrade.max;
    }
  }

  function upgradeCanBreak(p, upgrade) {
    const count = p.upgrades[upgrade.id] || 0;
    switch (upgrade.id) {
      case 'barrel':
        return !p.barrelBroke && p.rows >= 3 && p.rows < 6 && count < upgrade.max;
      case 'drone':
        return !p.droneBroke && p.droneCount >= droneLibraryMax(p) && p.droneCount < MAX_DRONES && count < upgrade.max;
      case 'bulletSize':
        return !p.bulletSizeBroke && p.bulletSizeBonus >= 1.5 && p.bulletSizeBonus < 3 && count < upgrade.max;
      case 'hp':
        return !p.armorBroke && p.armorBuffBonus >= 75 && p.armorBuffBonus < 150 && count < upgrade.max;
      case 'regen':
        return !p.regenBroke && p.regenBuffBonus >= 3 && p.regenBuffBonus < 6 && count < upgrade.max;
      case 'speed':
        return !p.speedBroke && p.speedBonus >= 0.45 && p.speedBonus < 0.9 && count < upgrade.max;
      case 'life':
        return !p.lifeBroke && p.lifeBuffBonus >= 3 && p.lifeBuffBonus < 6 && count < upgrade.max;
      default:
        return false;
    }
  }

  function upgradeAvailable(p, upgrade, rarity) {
    if (upgrade.id === 'scatter') return false;
    if (rarity && (rarity.id === 'purple' || rarity.id === 'orange')) {
      return !upgradeAtBaseCap(p, upgrade) || upgradeCanBreak(p, upgrade);
    }
    return !upgradeAtBaseCap(p, upgrade);
  }

  function pickUpgradeChoices() {
    const p = state.player;
    const normalAvailable = UPGRADES.filter((upgrade) => !upgradeAtBaseCap(p, upgrade));
    const all = (state.endless || normalAvailable.length < 3)
      ? [...UPGRADES, ...ENDLESS_UPGRADES]
      : [...UPGRADES];
    const chosen = [];
    const used = new Set();
    let forcedCoreIndex = -1;
    const coreIds = ['damage', 'rate', 'barrel', 'hp', 'drone'];
    const totalPicks = Object.values(p.upgrades || {}).reduce((sum, value) => sum + value, 0);
    const hasCore = coreIds.some((id) => (p.upgrades[id] || 0) > 0);
    if (state.wave < 5 && totalPicks < 4 && !hasCore) {
      let coreAttempts = 0;
      while (coreAttempts < 20 && chosen.length === 0) {
        coreAttempts++;
        const rarity = rollBuffRarity();
        const pool = coreIds
          .map((id) => UPGRADES.find((upgrade) => upgrade.id === id))
          .filter((upgrade) => upgrade && !used.has(upgrade.id) && upgradeAvailable(p, upgrade, rarity));
        if (pool.length) {
          const upgrade = pool[Math.floor(Math.random() * pool.length)];
          chosen.push({ upgrade, rarity });
          used.add(upgrade.id);
          forcedCoreIndex = 0;
        }
      }
    }
    let attempts = 0;
    while (chosen.length < 3 && attempts < 80) {
      attempts++;
      const rarity = rollBuffRarity();
      let pool = all.filter((upgrade) => !used.has(upgrade.id) && upgradeAvailable(p, upgrade, rarity));
      if (!pool.length) break;
      const upgrade = pool[Math.floor(Math.random() * pool.length)];
      chosen.push({ upgrade, rarity });
      used.add(upgrade.id);
    }
    const goldAvailable = GOLD_MODULES.filter((module) => !p.gold[module.id]);
    if (goldAvailable.length && Math.random() < GOLD_MODULE_CHANCE && chosen.length) {
      const gold = goldAvailable[Math.floor(Math.random() * goldAvailable.length)];
      const candidates = chosen.map((_, index) => index).filter((index) => index !== forcedCoreIndex);
      const target = candidates.length ? candidates[Math.floor(Math.random() * candidates.length)] : -1;
      if (target >= 0) chosen[target] = { upgrade: gold, rarity: null };
    }
    return chosen;
  }

  // 按品质生成"本次数值 + 总上限"的简短描述（选卡与图鉴共用）
  function upgradeRarityDesc(upgrade, rarity) {
    const s = rarity ? rarity.scale : 1;
    const v = (g, b, p, o) => (s >= 2 ? o : s >= 1.3 ? p : s >= 1 ? b : g);
    const cap = (text) => `（总上限 ${text}）`;
    switch (upgrade.id) {
      case 'baseWeapon': return `基础伤害 +${v(1, 1, 2, 3)}${cap('3 次')}`;
      case 'barrel': return `主炮 +${v(1, 1, 2, 2)} 排${cap('3 排')}`;
      case 'drone': return `浮游炮 +${v(1, 1, 2, 3)} 座${cap('无人机流 6 / 其他 4')}`;
      case 'bulletSize': return `体积 +${v(35, 50, 65, 100)}%${cap('+150%')}`;
      case 'damage': return `伤害 ×${v(1.13, 1.18, 1.23, 1.36)}${cap('5 次')}`;
      case 'rate': return `间隔 ×${v(0.93, 0.9, 0.87, 0.8)}${cap('5 次')}`;
      case 'pierce': return `穿透 +${v(1, 1, 2, 3)}${s >= 2 ? '，橙卡额外独立伤害 +10%' : ''}${cap('3 次')}`;
      case 'hp': return `生命 +${v(18, 25, 33, 50)}${cap('75')}`;
      case 'regen': return `回复 +${v(0.7, 1, 1.3, 2)}${cap('3')}`;
      case 'speed': return `移速 +${v(11, 15, 20, 30)}%${cap('+45%')}`;
      case 'bomb': return `炸弹 +${v(1, 1, 2, 3)} 颗${cap('不设上限')}`;
      case 'life': return `回血 +${v(0.7, 1, 1.3, 2)}${cap('3')}`;
      case 'crit': return `暴击 +${v(5.6, 8, 10.4, 16)}%、暴伤 +${v(17.5, 25, 32.5, 50)}%${cap('4 次')}`;
      case 'split': return `分裂概率 +${v(14, 20, 26, 40)}%${cap('60%')}`;
      case 'burnAmmo': return `燃烧持续 +${v(0, 0, 2, 4)}s、燃烧伤害 +${v(4.2, 6, 7.8, 12)}/s${cap('3 次')}`;
      case 'executeAmmo': return `低血伤害 +${v(8.4, 12, 15.6, 24)}%${cap('3 层')}`;
      case 'magnet': return `追踪 ${v(1.05, 1.5, 1.95, 3)}s${cap('1 次，冷却 7s')}`;
      case 'shieldCore': return `护盾 +${v(14, 20, 26, 40)} / 20s${cap('2 层')}`;
      case 'frenzy': return `狂热射速 +${v(28, 40, 52, 80)}%${cap('2 次，持续 1s')}`;
      case 'endlessDamage': return `伤害 ×${v(1.07, 1.1, 1.13, 1.2)}${cap('不设上限')}`;
      case 'endlessRate': return `间隔 ×${v(0.944, 0.92, 0.896, 0.84)}${cap('不设上限')}`;
      case 'endlessArmor': return `生命/修复 +${v(14, 20, 26, 40)}${cap('不设上限')}`;
      case 'endlessLoot': return `炸弹 +${v(1, 1, 2, 3)}、移速 +${v(3.5, 5, 6.5, 10)}%${cap('不设上限')}`;
      case 'endlessCrit': return `暴击 +${v(2.8, 4, 5.2, 8)}%、伤害 ×${v(1.028, 1.04, 1.052, 1.08)}${cap('不设上限')}`;
      case 'endlessVamp': return `回血 +${v(1, 1, 2, 3)}、独立伤害 +${v(3.5, 5, 6.5, 10)}%${cap('不设上限')}`;
      default: return upgrade.desc;
    }
  }

  function addUpgradeChoice(pick) {
    const { upgrade, rarity } = pick;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'upgrade-card';
    button.dataset.upgradeId = upgrade.id;
    if (rarity) button.classList.add(`rarity-${rarity.id}`);

    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('class', 'icon');
    icon.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', upgrade.icon);
    icon.appendChild(use);

    const text = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = upgrade.name;
    if (rarity) {
      const badge = document.createElement('span');
      badge.className = 'rarity-badge';
      badge.textContent = rarity.name;
      badge.style.color = rarity.color;
      title.appendChild(badge);
    }
    const desc = document.createElement('p');
    // 只显示当前品质的数值与总上限（避免把四档数值全部堆在卡片上）
    desc.textContent = rarity ? upgradeRarityDesc(upgrade, rarity) : upgrade.desc;
    text.append(title, desc);

    button.append(icon, text);
    button.addEventListener('click', () => applyUpgrade(pick));
    els.upgradeChoices.appendChild(button);
  }

  function openLevelUp() {
    const p = state.player;
    state.levelUpOpen = true;
    els.levelUpOverlay.classList.remove('hidden');
    els.levelUpTitle.textContent = state.pendingLevels > 1
      ? `等级 ${p.level} - 选择 1 项增益（剩余 ${state.pendingLevels} 次）`
      : `等级 ${p.level} - 选择 1 项增益`;
    els.upgradeChoices.replaceChildren();

    const choices = pickUpgradeChoices();
    if (choices.length === 0) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'action-btn';
      button.textContent = '继续';
      button.addEventListener('click', () => {
        state.pendingLevels = 0;
        state.levelUpOpen = false;
        els.levelUpOverlay.classList.add('hidden');
      });
      els.upgradeChoices.appendChild(button);
      return;
    }
    choices.forEach(addUpgradeChoice);
  }

  function applyUpgrade(pick) {
    const { upgrade, rarity } = pick;
    const scale = rarity ? rarity.scale : 1;
    const p = state.player;
    p.upgrades[upgrade.id] = (p.upgrades[upgrade.id] || 0) + 1;
    upgrade.apply(p, scale, rarity);
    state.pendingLevels--;
    state.levelUpOpen = false;
    els.levelUpOverlay.classList.add('hidden');
    playSound('level');
    addLog(`${upgrade.name}${rarity ? ` [${rarity.name}]` : ''} 已装备`);
    logGame('upgrade', `${upgrade.name}（${upgrade.id}）${rarity ? rarity.name : '固定'}数量=${p.upgrades[upgrade.id]}`);
    if (state.pendingLevels > 0 && !state.over && !state.checkpointOpen) openLevelUp();
    markHud();
    return true;
  }

  function addCoreChoice(def) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'upgrade-card core-card';
    button.dataset.upgradeId = def.id;

    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('class', 'icon');
    icon.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', def.icon);
    icon.appendChild(use);

    const text = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = def.name;
    const badge = document.createElement('span');
    badge.className = 'rarity-badge';
    badge.textContent = '质变';
    badge.style.color = '#ffd166';
    title.appendChild(badge);
    const desc = document.createElement('p');
    desc.textContent = def.desc;
    text.append(title, desc);

    button.append(icon, text);
    button.addEventListener('click', () => applyCoreTransform(def));
    els.upgradeChoices.appendChild(button);
  }

  function openCoreTransform() {
    state.coreTransformPending = false;
    state.levelUpOpen = true; // 复用 levelUpOpen 作为"暂停 + 弹窗开启"标志
    els.levelUpOverlay.classList.remove('hidden');
    els.levelUpTitle.textContent = '核心质变 · 选择战斗形态';
    els.upgradeChoices.replaceChildren();
    CORE_TRANSFORMS.forEach(addCoreChoice);
    playSound('level');
  }

  function applyCoreTransform(def) {
    const p = state.player;
    if (p.core) return; // 每局限 1 个
    def.apply(p);
    state.coreTransformOffered = true;
    state.levelUpOpen = false;
    els.levelUpOverlay.classList.add('hidden');
    playSound('ultimate');
    addLog(`核心质变：${def.name} 已激活`);
    logGame('core', `${def.name}（${def.id}）`);
    spawnParticles(p.x, p.y, '#ffd166', 26, 260);
    state.shake = Math.max(state.shake, 6);
    // 成就：首次核心 + 全核心收集
    if (!achievementStats.cores.includes(def.id)) achievementStats.cores.push(def.id);
    saveAchievements();
    unlockAchievement('coreFirst');
    checkAchievements();
    markHud();
    return true;
  }

  function statsPanelRows(p) {
    const baseDamage = p.damage + (p.baseDamageBonus || 0);
    const effectiveCritDamage = p.critDamage * (p.critBonusMul || 1);
    const independentMul = 1 + (p.independentDamageBonus || 0);
    const expectedDamage = baseDamage * (1 + p.critChance * (effectiveCritDamage - 1)) * independentMul;
    const droneCount = Math.min(MAX_DRONES, p.droneCount || 0);
    const droneShare = (DRONE_DAMAGE_SHARE[droneCount] || 0) * (p.droneShareMul || 1);
    const droneEquivalentRows = droneCount * droneShare;
    // 光束核心下主炮被持续光束替代：DPS 按光束实际结算公式显示（伤害×1.2/0.12s + 浮游炮），
    // 而非主炮射速模型；排数在光束下只增宽判定列，不乘算单目标 DPS
    const dps = p.core === 'beam'
      ? Math.round((baseDamage * BEAM_DAMAGE_MUL * (p.overloadTimer > 0 ? OVERLOAD_DMG_MUL : 1) * (1 + p.critChance * (effectiveCritDamage - 1))) / BEAM_TICK + droneEquivalentRows * expectedDamage / p.fireInterval)
      : Math.round((p.rows + droneEquivalentRows) * expectedDamage / p.fireInterval);
    const healingEfficiency = (state.affix ? state.affix.healingMul : 1) * endlessHealingMultiplier(state);
    const activeSpecial = SPECIAL_ORDER.filter((type) => p.special[type] > 0);
    const specialIcons = { slow: '#i-wind', burn: '#i-zap', blast: '#i-crosshair', homing: '#i-target' };
    const build = buildById(p.buildId);
    const up = p.upgrades || {};
    const lv = meta.levels;
    const rows = [];
    const group = (name) => rows.push({ group: name });
    const mergeSources = (sources) => {
      const map = new Map();
      for (const s of sources) {
        const key = `${s.type}|${s.label}`;
        if (map.has(key)) map.get(key).count = (map.get(key).count || 1) + (s.count || 1);
        else map.set(key, { ...s, count: s.count || 1 });
      }
      return [...map.values()];
    };
    const row = (icon, name, value, sources) => {
      if (value == null || value === '') return;
      rows.push({ icon, name, value: String(value), sources: sources ? mergeSources(sources) : null });
    };
    const S = (type, label, count) => ({ type, label, count });

    if (p.buildName && p.buildName !== '均衡弹道') row('#i-target', '流派', p.buildName, [S('流派', p.buildName, 1)]);
    if (p.core) {
      const coreDef = CORE_TRANSFORMS.find((def) => def.id === p.core);
      if (coreDef) row('#i-sparkles', '核心质变', coreDef.name, [S('核心', coreDef.name, 1)]);
    }
    row('#i-layers', '等级', p.level, [S('其他', '击杀经验', 1)]);

    group('火力');
    row('#i-crosshair', '综合 DPS', dps, [S('基础', p.core === 'beam' ? `光束 ${Math.round(baseDamage * BEAM_DAMAGE_MUL)} × ${(1 / BEAM_TICK).toFixed(1)}/s` : `伤害 ${baseDamage} × 射速 ${(1 / p.fireInterval).toFixed(1)}/s`), S('其他', `暴击期望 ×${(1 + p.critChance * (effectiveCritDamage - 1)).toFixed(2)}`), S('其他', `${p.core === 'beam' ? '光束宽度' : '排数'} ×${p.rows}${droneCount > 0 ? ` + 浮游炮 ×${droneEquivalentRows.toFixed(2)}` : ''}`)]);
    row('#i-crosshair', '主炮伤害', baseDamage, [
      S('基础', '12'),
      ...(build.damageMul !== 1 ? [S('流派', `×${build.damageMul}`)] : []),
      ...(lv.damage > 0 ? [S('天赋', `火力强化 +4.5%`, lv.damage)] : []),
      ...(up.damage > 0 ? [S('局内', `火力强化 +18%`, up.damage)] : []),
      ...(up.baseWeapon > 0 ? [S('局内', `基础弹列 +1`, up.baseWeapon)] : []),
      ...(p.buildId === 'balanced' && p.level > 1 ? [S('流派', `等级伤害 +3%`, p.level - 1)] : []),
    ]);
    if (p.baseDamageBonus > 0) row('#i-plus', '基础伤害加成', `+${p.baseDamageBonus}`, [S('局内', `基础弹列 +${p.baseDamageBonus}`, up.baseWeapon || 1)]);
    row('#i-zap', '射击间隔', `${p.fireInterval.toFixed(3)} 秒`, [
      S('基础', '0.170 秒'),
      ...(build.fireRateMul !== 1 ? [S('流派', `×${build.fireRateMul}`)] : []),
      ...(lv.rate > 0 ? [S('天赋', `速射引擎 +2%`, lv.rate)] : []),
      ...(up.rate > 0 ? [S('局内', `速射引擎 -10%`, up.rate)] : []),
      ...(p.frenzyTimer > 0 ? [S('局内', `弹药狂热 +${Math.round((p.frenzyRateBonus || 0) * 100)}%`, 1)] : []),
    ]);
    row('#i-star', '暴击率', `${Math.round(p.critChance * 100)}%`, [
      ...(build.critChance > 0 ? [S('流派', `初始 ${Math.round(build.critChance * 100)}%`)] : [S('基础', '0%')]),
      ...(lv.crit > 0 ? [S('天赋', `弱点锁定 +1.5%`, lv.crit)] : []),
      ...(up.crit > 0 ? [S('局内', `弱点锁定 +8%`, up.crit)] : []),
    ]);
    row('#i-sparkles', '暴击伤害', `${Math.round(effectiveCritDamage * 100)}%${p.critBonusMul > 1 ? `（乘区 ×${p.critBonusMul}）` : ''}`, [
      S('基础', '+50%'),
      ...(lv.crit > 0 ? [S('天赋', `弱点锁定 +4%`, lv.crit)] : []),
      ...(up.crit > 0 ? [S('局内', `弱点锁定 +25%`, up.crit)] : []),
      ...(p.buildId === 'crit' && p.critDamage > 1.5 ? [S('流派', `暴击印记 +0.2%/杀`) ] : []),
    ]);
    if (p.pierce > 0) row('#i-target', '穿透', p.pierce, [
      ...(up.pierce > 0 ? [S('局内', `穿甲弹头 +1`, up.pierce)] : []),
      ...(lv.pierce > 0 ? [S('天赋', `穿甲弹头 +0.15`, lv.pierce)] : []),
      ...(lv.damage >= 20 || (branchLevel('offense') >= 20) ? [S('里程碑', '过热核心 +0.4')] : []),
    ]);
    if (p.jamDuration > 0) row('#i-zap', '卡壳', `${p.jamDuration} 秒`, [S('局内', `穿甲弹头 +0.8 秒`, up.pierce || 1)]);
    if ((p.bulletSizeBonus || 0) > 0) row('#i-plus', '弹体倍率', `×${playerBulletScale(p).toFixed(1)}`, [S('局内', `巨型弹芯 +${Math.round(p.bulletSizeBonus * 100)}%`, 1)]);
    if (p.scatter) row('#i-wind', '散射', '广域', [S('局内', '广域散射', 1)]);
    if (p.maxHpDamage > 0) row('#i-crosshair', '百分比伤害', `每发 ${(p.maxHpDamage * 100).toFixed(1)}% 目标生命`, [S('流派', '射速流', 1)]);
    if (droneCount > 0) row('#i-rocket', '浮游炮', `${droneCount} 座 ×${Math.round(droneShare * 100)}% 火力`, [
      ...(p.buildId === 'drone' ? [S('流派', '初始 2 座', 1)] : []),
      ...(up.drone > 0 ? [S('局内', `浮游炮 +1 座`, up.drone)] : []),
      ...(p.buildId === 'drone' && p.dronePower > 1 ? [S('流派', `集群火力 ×${Math.round(p.dronePower * 100) / 100}`)] : []),
    ]);
    if (activeSpecial.length) {
      for (const type of activeSpecial) {
        row(specialIcons[type] || '#i-sparkles', AMMO_TYPES[type].name, `${Math.ceil(p.special[type])} 秒`, [S('局内', `特殊弹药 ${AMMO_TYPES[type].name}`, 1)]);
      }
    }
    if (p.splitChance > 0) row('#i-plus', '分裂弹', `${Math.round(p.splitChance * 100)}% 分裂`, [S('局内', `分裂弹 +20%`, up.split || 1)]);
    if (p.executeMul > 0) row('#i-target', '处决强化', `<25% 血 +${Math.round(p.executeMul * 100)}%`, [S('局内', '处决强化', 1)]);
    if (p.frenzyDuration > 0) row('#i-zap', '弹药狂热', `击杀后 ${p.frenzyDuration} 秒射速 +40%`, [S('局内', `弹药狂热 +2 秒`, up.frenzy || 1)]);
    if (p.magnetOnKill) row('#i-wind', '磁吸弹药', '击杀后追踪 1.5 秒·内置 7s 冷却', [S('局内', '磁吸弹药', 1)]);
    if (p.buildId === 'balanced' && p.level > 1) row('#i-layers', '等级伤害', `+${Math.round((p.level - 1) * (p.levelDamageBonus || 0) * 100)}%`, [S('流派', `等级伤害 +3%/级`, p.level - 1)]);
    if (p.buildId === 'crit' && p.critDamage > 1.5) row('#i-star', '暴击印记', `+${Math.round((p.critDamage - 1.5) * 100)}%`, [S('流派', '暴击印记 +0.2%/杀')]);
    if (p.buildId === 'drone' && p.dronePower > 1) row('#i-rocket', '集群火力', `×${Math.round(p.dronePower * 100) / 100}`, [S('流派', '集群火力 +0.2%/杀')]);

    group('生存');
    row('#i-heart', '生命', `${Math.max(0, Math.ceil(p.hp))} / ${p.maxHp}${p.shield > 0 ? `（盾 ${Math.round(p.shield)}）` : ''}`, [
      S('基础', '130'),
      ...(build.maxHpMul != null && build.maxHpMul !== 1 ? [S('流派', `×${build.maxHpMul}`)] : []),
      ...(lv.hp > 0 ? [S('天赋', `装甲核心 +5%`, lv.hp)] : []),
      ...(up.hp > 0 ? [S('局内', `装甲改造 +25`, up.hp)] : []),
      ...(branchLevel('survival') >= 20 ? [S('里程碑', '反应装甲 +30')] : []),
      ...(p.buildId === 'balanced' && p.level > 1 ? [S('流派', `等级生命 +2%`, p.level - 1)] : []),
    ]);
    if (p.regen > 0) row('#i-heart', '每秒回复', `+${p.regen}`, [
      ...(build.regen > 0 ? [S('流派', `初始 ${build.regen}`)] : []),
      ...(lv.regen > 0 ? [S('天赋', `纳米再生 +0.8`, lv.regen)] : []),
      ...(up.regen > 0 ? [S('局内', `纳米修复 +1.5`, up.regen)] : []),
    ]);
    if (p.lifesteal > 0) row('#i-heart', '击杀回血', p.lifesteal, [
      ...(build.lifesteal > 0 ? [S('流派', `初始 ${build.lifesteal}`)] : []),
      ...(up.life > 0 ? [S('局内', `掠夺核心 +1.5`, up.life)] : []),
    ]);
    if (p.shield > 0) row('#i-shield', '护盾', Math.round(p.shield), [S('其他', '护盾来源', 1)]);
    if (p.recoverChance > 0) row('#i-heart', '应急维修', `${Math.round(p.recoverChance * 100)}% 概率·25% 生命·15s 冷却`, [S('天赋', `应急维修 +8%`, lv.recover)]);
    if (p.dodgeChance > 0) row('#i-wind', '弹幕闪避', `${Math.round(p.dodgeChance * 100)}%`, [S('天赋', `相位闪避 +4%`, lv.dodge)]);
    if (p.buildId === 'counter') row('#i-wind', '初始闪避', '-100%（受击必中，保证触发反击）', [S('流派', '反击流 初始 -100%', 1)]);
    if (p.overflowShieldCap > 0) row('#i-shield', '血溢护盾', `上限 ${overflowShieldCapFor(p)}（随生命成长）`, [S('天赋', `血溢护盾 +8%生命`, lv.lifesteal)]);
    if (healingEfficiency < 1) row('#i-heart', '回复效率', `${Math.round(healingEfficiency * 100)}%`, [S('其他', '词缀/无尽衰减', 1)]);

    group('机动能量');
    row('#i-bomb', '炸弹', `${p.bombs} 颗${p.bombRegenInterval > 0 ? `（每 ${Math.round(p.bombRegenInterval)} 秒 +1）` : ''}`, [
      S('基础', '3 颗'),
      ...(up.bomb > 0 ? [S('局内', `轨道炸弹 +1`, up.bomb)] : []),
      ...(branchLevel('energy') >= 20 ? [S('里程碑', '满载出发 +1')] : []),
    ]);
    row('#i-zap', '大招能量', `${Math.floor(p.ultEnergy)} / ${p.ultMax}`, [S('基础', `初始 30 / 上限 ${p.ultMax}`)]);
    if (p.ultGainMul > 1.01) row('#i-zap', '能量获取', `×${Math.round(p.ultGainMul * 100) / 100}`, [
      ...(lv.ult > 0 ? [S('天赋', `充能核心 +10%`, lv.ult)] : []),
      ...(branchLevel('energy') >= 10 ? [S('里程碑', '预热核心 +20%')] : []),
    ]);
    if (p.ultRegenTimer > 0) row('#i-heart', '大招修复', `${Math.ceil(p.ultRegenTimer)} 秒`, [S('其他', '大招持续回复', 1)]);
    if (p.ultHitChance > 0) row('#i-sparkles', '自动大招', `${Math.round(p.ultHitChance * 100)}% 概率`, [S('天赋', `概率核心 +0.2%`, lv.autoUlt)]);
    if (p.counterDamage > 0) row('#i-shield', '反击', `${p.counterDamage}+${Math.round((p.counterHpRatio || 0) * 100)}% 生命${p.counterEnemyHpRatio > 0 ? `+${Math.round(p.counterEnemyHpRatio * 100)}% 目标生命` : ''}`, [S('流派', '反击流', 1)]);
    if (p.buildId === 'counter') row('#i-wind', '弹幕反弹', `受击弹幕反弹，命中溅射 ${COUNTER_REFLECT_SPLASH} 半径`, [S('流派', '反击流·反弹', 1)]);
    if (p.chainChance > 0) row('#i-zap', '连锁电弧', `${Math.round(p.chainChance * 100)}% 概率`, [S('天赋', `连锁电弧 +3%`, lv.chain)]);
    if (p.plunderChance > 0) row('#i-star', '贪婪核心', `${Math.round(p.plunderChance * 100)}% 额外经验`, [S('天赋', `贪婪核心 +5%`, lv.plunder)]);
    row('#i-right', '移速', p.speed, [
      S('基础', '250'),
      ...(lv.speed > 0 ? [S('天赋', `矢量机动 +2%`, lv.speed)] : []),
      ...(up.speed > 0 ? [S('局内', `矢量推进 +15%`, up.speed)] : []),
    ]);
    const activeGold = GOLD_MODULES.filter((module) => p.gold && p.gold[module.id]);
    if (activeGold.length || p.dashUnlocked) {
      group('金色模组');
      for (const module of activeGold) {
        row(module.icon, module.name, '已激活', [S('局内', module.name, 1)]);
      }
      if (p.dashUnlocked) {
        row('#i-wind', '相位冲刺', `${DASH_COOLDOWN} 秒冷却·短暂无敌`, [S('局内', '相位引擎', 1)]);
      }
    }
    return rows;
  }

  function renderStatsPanel() {
    const list = document.getElementById('statsPanelList');
    if (!list) return;
    list.replaceChildren();
    const rows = statsPanelRows(state ? state.player : {});
    for (const item of rows) {
      if (item.group) {
        const groupEl = document.createElement('div');
        groupEl.className = 'stats-panel-row sp-group';
        groupEl.textContent = `— ${item.group} —`;
        list.appendChild(groupEl);
        continue;
      }
      const rowEl = document.createElement('div');
      rowEl.className = 'stats-panel-row';
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'icon sp-icon');
      svg.setAttribute('aria-hidden', 'true');
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('href', item.icon);
      svg.appendChild(use);
      const nameEl = document.createElement('span');
      nameEl.className = 'sp-name';
      nameEl.textContent = item.name;
      const valueEl = document.createElement('span');
      valueEl.className = 'sp-value';
      valueEl.textContent = item.value;
      rowEl.append(svg, nameEl, valueEl);
      if (item.sources && item.sources.length) {
        const srcEl = document.createElement('div');
        srcEl.className = 'sp-sources';
        srcEl.textContent = item.sources.map((s) => `${s.type} ${s.label}${s.count > 1 ? ` ×${s.count}` : ''}`).join('  ·  ');
        rowEl.appendChild(srcEl);
      }
      list.appendChild(rowEl);
    }
  }

  let statsPanelOpen = false;
  let statsPanelPrevPaused = false;

  function toggleStatsPanel() {
    const panel = document.getElementById('statsPanel');
    if (!panel) return;
    statsPanelOpen = !statsPanelOpen;
    if (statsPanelOpen) {
      statsPanelPrevPaused = paused;
      paused = true;
      if (state && !state.over) els.overlay.classList.add('hidden');
      renderStatsPanel();
    } else {
      paused = statsPanelPrevPaused;
    }
    panel.classList.toggle('hidden', !statsPanelOpen);
    updatePauseIcon();
  }

  function updateHud() {
    if (!state) return;
    const p = state.player;
    const hpPct = clamp(p.hp / p.maxHp * 100, 0, 100);
    const xpPct = clamp(p.exp / p.xpNext * 100, 0, 100);
    const shieldPct = clamp((p.shield || 0) / p.maxHp * 100, 0, 100);
    els.hpFill.style.width = `${hpPct}%`;
    const shieldFrame = document.getElementById('shieldFrame');
    if (shieldFrame) {
      // 护盾长度与血量 1:1：盾量 = 血量时覆盖相同长度
      shieldFrame.style.width = `${shieldPct}%`;
      // 无盾时整体隐藏，避免 0 宽时残留 1px 边框
      shieldFrame.classList.toggle('hidden', !(p.shield > 0));
      const hpBar = document.getElementById('hpBar');
      if (hpBar) hpBar.classList.toggle('shield-overflow', p.shield > p.hp);
    }
    els.hpValue.textContent = `${Math.max(0, Math.ceil(p.hp))}/${p.maxHp}${p.shield > 0 ? ` +${Math.round(p.shield)}盾` : ''}`;
    els.levelValue.textContent = p.level;
    els.xpFill.style.width = `${xpPct}%`;
    els.xpValue.textContent = `${Math.floor(p.exp)}/${p.xpNext}`;
    els.damageValue.textContent = p.damage + (p.baseDamageBonus || 0);
    els.critValue.textContent = `${Math.round(p.critChance * 100)}%`;
    els.critDamageValue.textContent = `${Math.round(p.critDamage * (p.critBonusMul || 1) * 100)}%`;
    const bombCount = document.getElementById('bombBtnCount');
    if (bombCount) bombCount.textContent = p.bombs;
    const bombReady = p.bombs > 0 && p.bombCd <= 0;
    const bombCdPct = p.bombCd > 0 ? clamp(p.bombCd / 60 * 100, 0, 100) : 0;
    const bombChargeRect = document.getElementById('bombChargeRect');
    if (bombChargeRect) {
      const fillH = 24 * bombCdPct / 100;
      bombChargeRect.setAttribute('y', String(24 - fillH));
      bombChargeRect.setAttribute('height', String(fillH));
    }
    const bombBtnEl = document.getElementById('bombBtn');
    if (bombBtnEl) {
      bombBtnEl.classList.toggle('bomb-ready', bombReady);
      bombBtnEl.classList.toggle('bomb-cd', p.bombCd > 0);
    }
    const bombCdText = document.getElementById('bombBtnCd');
    if (bombCdText) bombCdText.textContent = p.bombCd > 0 ? Math.ceil(p.bombCd) : '';
    const ultReady = p.ultEnergy >= p.ultMax;
    const ultPct = clamp(p.ultEnergy / p.ultMax * 100, 0, 100);
    const ultChargeRect = document.getElementById('ultChargeRect');
    if (ultChargeRect) {
      const fillH = 24 * ultPct / 100;
      ultChargeRect.setAttribute('y', String(24 - fillH));
      ultChargeRect.setAttribute('height', String(fillH));
    }
    const ultBtnPct = document.getElementById('ultBtnPct');
    if (ultBtnPct) ultBtnPct.textContent = ultReady ? '就绪' : `${Math.floor(ultPct)}%`;
    els.ultBtn.classList.toggle('ready', ultReady);
    els.ultBtn.classList.toggle('active', p.ultRate > 0 || p.ultShield > 0);
    const dashBtn = document.getElementById('dashBtn');
    const dashCount = document.getElementById('dashBtnCount');
    if (dashBtn) dashBtn.classList.toggle('hidden', !p.dashUnlocked);
    if (dashCount) dashCount.textContent = p.dashCd > 0 ? Math.ceil(p.dashCd) : '';
    if (dashBtn) dashBtn.classList.toggle('ready', p.dashUnlocked && p.dashCd <= 0 && p.dashTimer <= 0);
    const dashChargeRect = document.getElementById('dashChargeRect');
    if (dashChargeRect) {
      const dashReadyPct = p.dashCd > 0
        ? clamp((1 - p.dashCd / DASH_COOLDOWN) * 100, 0, 100)
        : 100;
      const fillH = 24 * dashReadyPct / 100;
      dashChargeRect.setAttribute('y', String(24 - fillH));
      dashChargeRect.setAttribute('height', String(fillH));
    }
    els.scoreValue.textContent = state.score;
    els.waveValue.textContent = state.endless ? `${state.wave}∞` : `${state.wave}/${MISSION_FINAL_WAVE}`;
    const objectivePanel = document.getElementById('objectivePanel');
    const objectiveName = document.getElementById('objectivePanelName');
    const objectiveDesc = document.getElementById('objectivePanelDesc');
    if (objectivePanel && objectiveName && objectiveDesc) {
      const obj = state.objective;
      if (obj && !state.objectiveDone && !state.objectiveFailed) {
        const reward = `奖励 ${obj.reward} 分${obj.tech ? ` + ${obj.tech} 科技点` : ''}`;
        let progressText = '';
        if (obj.id === 'fastClear') {
          const remain = Math.max(0, Math.ceil(obj.target - (state.elapsed - state.waveStartTime)));
          progressText = `剩余 ${remain}s`;
        } else if (obj.target) {
          progressText = `${state.objectiveProgress}/${obj.target}`;
        }
        objectiveName.textContent = `${obj.name}${progressText ? ` ${progressText}` : ''}`;
        objectiveDesc.textContent = `${obj.desc}。${reward}`;
        objectivePanel.classList.remove('hidden');
      } else if (obj && state.objectiveDone) {
        objectiveName.textContent = '支线完成';
        objectiveDesc.textContent = `${obj.name} 完成，奖励已发放。`;
        objectivePanel.classList.remove('hidden');
      } else if (obj && state.objectiveFailed) {
        objectiveName.textContent = '支线失败';
        objectiveDesc.textContent = `${obj.name} 未完成，本局无惩罚。`;
        objectivePanel.classList.remove('hidden');
      } else {
        objectivePanel.classList.add('hidden');
      }
    }

    const boss = state.enemies.find((enemy) => enemy.type === 'boss');
    if (boss) {
      els.bossBar.classList.remove('hidden');
      if (els.bossLabel) els.bossLabel.textContent = boss.bossName || '首领';
      els.bossFill.style.width = `${clamp(boss.hp / boss.maxHp * 100, 0, 100)}%`;
      els.bossValue.textContent = `${Math.max(0, Math.ceil(boss.hp))}/${boss.maxHp}${boss.coreExposed ? ' · 核心' : ''}`;
    } else {
      els.bossBar.classList.add('hidden');
      if (els.bossLabel) els.bossLabel.textContent = '首领';
    }
  }

  function ensureBackgroundCache() {
    if (backgroundCache && backgroundCache.width === W && backgroundCache.height === H) return;
    backgroundCache = document.createElement('canvas');
    backgroundCache.width = W;
    backgroundCache.height = H;
    const bg = backgroundCache.getContext('2d');
    if (battleBackgroundReady && battleBackgroundImage) {
      const iw = battleBackgroundImage.naturalWidth || battleBackgroundImage.width;
      const ih = battleBackgroundImage.naturalHeight || battleBackgroundImage.height;
      const scale = Math.max(W / iw, H / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      bg.drawImage(battleBackgroundImage, (W - dw) / 2, (H - dh) / 2, dw, dh);
    } else {
      const gradient = bg.createLinearGradient(0, 0, 0, H);
      gradient.addColorStop(0, '#04070c');
      gradient.addColorStop(0.55, '#081526');
      gradient.addColorStop(1, '#101126');
      bg.fillStyle = gradient;
      bg.fillRect(0, 0, W, H);
    }

    bg.strokeStyle = battleBackgroundReady ? 'rgba(92, 200, 255, 0.055)' : 'rgba(92, 200, 255, 0.045)';
    bg.lineWidth = 1;
    for (let x = 80; x < W; x += 80) {
      bg.beginPath();
      bg.moveTo(x, 0);
      bg.lineTo(x, H);
      bg.stroke();
    }
    for (let y = 80; y < H; y += 80) {
      bg.beginPath();
      bg.moveTo(0, y);
      bg.lineTo(W, y);
      bg.stroke();
    }
  }

  function drawBackground() {
    ensureBackgroundCache();
    ctx.drawImage(backgroundCache, 0, 0);
    for (const star of state.stars) {
      ctx.globalAlpha = 0.35 + star.z * 0.55;
      ctx.fillStyle = star.z > 0.65 ? '#dff7ff' : '#8fb8d8';
      ctx.fillRect(star.x, star.y, star.r, star.r);
    }
    ctx.globalAlpha = 1;
  }

  function drawPlayerBullets() {
    if (state.bullets.length === 0) return;
    ctx.save();
    ctx.lineCap = 'round';
    const tails = new Map();
    const dots = new Map();
    const strokes = new Map();
    const cores = new Map();
    const rings = new Map();
    const glows = new Map();
    const glowDots = new Map();
    const spriteBullets = [];

    // 浮游炮追踪弹曳光抽稀：先统计本帧 drone 弹数，超阈值才启用
    let droneShotCount = 0;
    for (const b of state.bullets) if (b.source === 'drone') droneShotCount++;
    const tracerOn = droneShotCount > DRONE_TRACER_THRESHOLD;

    for (const bullet of state.bullets) {
      const speed = Math.hypot(bullet.vx, bullet.vy) || 1;
      const nx = bullet.vx / speed;
      const ny = bullet.vy / speed;
      const sizeScale = bullet.sizeScale || 1;
      const lengthScale = 1 + (sizeScale - 1) * 0.38;
      // 曳光弹判定：drone 且处于抽稀态、且非每 N 发中的"亮发" → 淡化
      bullet.dim = Boolean(bullet.source === 'drone' && tracerOn && (bullet.seq % DRONE_TRACER_EVERY !== 0));
      spriteBullets.push(bullet);
      continue;

      if (bullet.source === 'drone') {
        const dotR = 2.1 * sizeScale;
        const glowDotR = dotR * 1.9;
        const glowDotKey = `glowdot|${bullet.color}|${glowDotR}`;
        let glowDotGroup = glowDots.get(glowDotKey);
        if (!glowDotGroup) {
          glowDotGroup = { color: bullet.color, radius: glowDotR, items: [] };
          glowDots.set(glowDotKey, glowDotGroup);
        }
        glowDotGroup.items.push([bullet.x, bullet.y]);
        const dotKey = `dot|${bullet.color}|${dotR}`;
        let dotGroup = dots.get(dotKey);
        if (!dotGroup) {
          dotGroup = { color: bullet.color, radius: dotR, items: [] };
          dots.set(dotKey, dotGroup);
        }
        dotGroup.items.push([bullet.x, bullet.y]);

        const tailW = 1.5 * sizeScale;
        const tailLen = 9 * lengthScale;
        const tailKey = `tail|${bullet.color}|${tailW}|${tailLen}`;
        let tailGroup = tails.get(tailKey);
        if (!tailGroup) {
          tailGroup = { color: bullet.color, lineWidth: tailW, items: [] };
          tails.set(tailKey, tailGroup);
        }
        tailGroup.items.push([
          bullet.x - nx * tailLen,
          bullet.y - ny * tailLen,
          bullet.x - nx * 1,
          bullet.y - ny * 1,
        ]);
        continue;
      }

      const blast = bullet.blastRadius > 0;
      const bulletLen = (bullet.blastRadius ? 16 : 14) * lengthScale;
      const lineW = (bullet.blastRadius ? 4 : 3.2) * sizeScale;
      const strokeKey = `line|${bullet.color}|${lineW}|${bulletLen}`;
      let strokeGroup = strokes.get(strokeKey);
      if (!strokeGroup) {
        strokeGroup = { color: bullet.color, lineWidth: lineW, items: [] };
        strokes.set(strokeKey, strokeGroup);
      }
      strokeGroup.items.push([
        bullet.x - nx * bulletLen * 0.85,
        bullet.y - ny * bulletLen * 0.85,
        bullet.x + nx * bulletLen * 0.15,
        bullet.y + ny * bulletLen * 0.15,
      ]);
      const glowW = lineW * 2.2;
      const glowKey = `glow|${bullet.color}|${glowW}|${bulletLen}`;
      let glowGroup = glows.get(glowKey);
      if (!glowGroup) {
        glowGroup = { color: bullet.color, lineWidth: glowW, items: [] };
        glows.set(glowKey, glowGroup);
      }
      glowGroup.items.push([
        bullet.x - nx * bulletLen * 0.85,
        bullet.y - ny * bulletLen * 0.85,
        bullet.x + nx * bulletLen * 0.15,
        bullet.y + ny * bulletLen * 0.15,
      ]);

      const coreColor = blast ? '#fff3b8' : '#ffffff';
      const coreR = (blast ? 3 : 2.3) * sizeScale;
      const coreKey = `core|${coreColor}|${coreR}`;
      let coreGroup = cores.get(coreKey);
      if (!coreGroup) {
        coreGroup = { color: coreColor, radius: coreR, items: [] };
        cores.set(coreKey, coreGroup);
      }
      coreGroup.items.push([bullet.x, bullet.y]);

      if (blast) {
        const ringR = 5 * sizeScale;
        const ringKey = `ring|${bullet.color}|${ringR}`;
        let ringGroup = rings.get(ringKey);
        if (!ringGroup) {
          ringGroup = { color: bullet.color, radius: ringR, items: [] };
          rings.set(ringKey, ringGroup);
        }
        ringGroup.items.push([bullet.x, bullet.y]);
      }
    }

    ctx.globalAlpha = 0.28;
    for (const group of tails.values()) {
      ctx.strokeStyle = group.color;
      ctx.lineWidth = group.lineWidth;
      ctx.beginPath();
      for (const [x1, y1, x2, y2] of group.items) {
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 0.2;
    for (const group of glowDots.values()) {
      ctx.fillStyle = group.color;
      ctx.beginPath();
      for (const [x, y] of group.items) {
        ctx.moveTo(x + group.radius, y);
        ctx.arc(x, y, group.radius, 0, TAU);
      }
      ctx.fill();
    }
    ctx.globalAlpha = 0.55;
    for (const group of dots.values()) {
      ctx.fillStyle = group.color;
      ctx.beginPath();
      for (const [x, y] of group.items) {
        ctx.moveTo(x + group.radius, y);
        ctx.arc(x, y, group.radius, 0, TAU);
      }
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.globalAlpha = 0.22;
    for (const group of glows.values()) {
      ctx.strokeStyle = group.color;
      ctx.lineWidth = group.lineWidth;
      ctx.beginPath();
      for (const [x1, y1, x2, y2] of group.items) {
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    for (const group of strokes.values()) {
      ctx.strokeStyle = group.color;
      ctx.lineWidth = group.lineWidth;
      ctx.beginPath();
      for (const [x1, y1, x2, y2] of group.items) {
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      ctx.stroke();
    }
    for (const group of cores.values()) {
      ctx.fillStyle = group.color;
      ctx.beginPath();
      for (const [x, y] of group.items) {
        ctx.moveTo(x + group.radius, y);
        ctx.arc(x, y, group.radius, 0, TAU);
      }
      ctx.fill();
    }
    ctx.globalAlpha = 0.28;
    for (const group of rings.values()) {
      ctx.strokeStyle = group.color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (const [x, y] of group.items) {
        ctx.moveTo(x + group.radius, y);
        ctx.arc(x, y, group.radius, 0, TAU);
      }
      ctx.stroke();
    }
    for (const bullet of spriteBullets) {
      const speed = Math.hypot(bullet.vx, bullet.vy) || 1;
      const nx = bullet.vx / speed;
      const ny = bullet.vy / speed;
      const sizeScale = bullet.sizeScale || 1;
      const lengthScale = 1 + (sizeScale - 1) * 0.38;
      // 淡化（曳光抽稀掉的那几发）：只画一条淡尾迹，不画亮核心，把视觉让给曳光弹
      if (bullet.dim) {
        ctx.globalAlpha = 0.25;
        ctx.strokeStyle = bullet.color;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(bullet.x - nx * 8, bullet.y - ny * 8);
        ctx.lineTo(bullet.x, bullet.y);
        ctx.stroke();
        ctx.globalAlpha = 1;
        continue;
      }
      const tailLen = (bullet.source === 'drone' ? 9 : 14) * lengthScale;
      const tailW = (bullet.source === 'drone' ? 1.5 : 3.2) * sizeScale;
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = bullet.color;
      ctx.lineWidth = tailW;
      ctx.beginPath();
      ctx.moveTo(bullet.x - nx * tailLen, bullet.y - ny * tailLen);
      ctx.lineTo(bullet.x, bullet.y);
      ctx.stroke();
      ctx.globalAlpha = 1;
      const sprite = ensureBulletSprite(bulletSpriteKey(bullet));
      const angle = Math.atan2(bullet.vy, bullet.vx) + Math.PI / 2;
      const baseSize = (bullet.blastRadius ? 22 : 17) * sizeScale;
      ctx.save();
      ctx.translate(bullet.x, bullet.y);
      ctx.rotate(angle);
      // 己方子弹相对敌弹低调：光晕更弱、核心略降透明度（读得清威胁、不抢眼）
      ctx.globalAlpha = 0.18;
      ctx.drawImage(sprite, -baseSize * 0.8, -baseSize * 0.8, baseSize * 1.6, baseSize * 1.6);
      ctx.globalAlpha = 0.92;
      ctx.drawImage(sprite, -baseSize / 2, -baseSize / 2, baseSize, baseSize);
      ctx.restore();
    }
    ctx.restore();
  }

  function drawEnemyBullets() {
    if (state.enemyBullets.length === 0) return;
    ctx.save();
    ctx.lineCap = 'round';
    for (const bullet of state.enemyBullets) {
      const speed = Math.hypot(bullet.vx, bullet.vy) || 1;
      const nx = bullet.vx / speed;
      const ny = bullet.vy / speed;
      // 敌方弹幕 = 唯一高对比威胁层：尾迹更亮更长更粗，让"危险"一眼可读
      ctx.globalAlpha = 0.55;
      ctx.strokeStyle = bullet.color;
      ctx.lineWidth = Math.max(2, bullet.r * 0.7);
      ctx.beginPath();
      ctx.moveTo(bullet.x - nx * 14, bullet.y - ny * 14);
      ctx.lineTo(bullet.x, bullet.y);
      ctx.stroke();
      ctx.globalAlpha = 1;
      const sprite = ensureBulletSprite(bullet.sprite === 'boss' ? 'boss' : 'enemy');
      const angle = Math.atan2(bullet.vy, bullet.vx) + Math.PI / 2;
      const size = Math.max(18, bullet.r * 3.6);
      ctx.save();
      ctx.translate(bullet.x, bullet.y);
      ctx.rotate(angle);
      ctx.globalAlpha = 0.4;
      ctx.drawImage(sprite, -size * 0.8, -size * 0.8, size * 1.6, size * 1.6);
      ctx.globalAlpha = 1;
      ctx.drawImage(sprite, -size / 2, -size / 2, size, size);
      ctx.restore();
    }
    ctx.restore();
  }

  function drawEnemyShape(ctx, enemy) {
    const baseRadius = {
      scout: 36,
      striker: 33,
      twin: 34,
      brute: 33,
      ace: 34,
      meteor: 36,
      special: 36,
      boss: 50,
    }[enemy.type] || 15;
    const s = enemy.r / baseRadius;
    ctx.save();
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.shadowBlur = 0;

    const poly = (points, fill, stroke = null, lineWidth = 2) => {
      ctx.beginPath();
      points.forEach(([x, y], index) => {
        const px = x * s;
        const py = y * s;
        if (index === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.closePath();
      if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
      }
      if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }
    };
    const line = (x1, y1, x2, y2, stroke, lineWidth = 1.4, alpha = 1) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(x1 * s, y1 * s);
      ctx.lineTo(x2 * s, y2 * s);
      ctx.stroke();
      ctx.restore();
    };
    const circle = (x, y, radius, fill, stroke = null, lineWidth = 1.5, alpha = 1) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(x * s, y * s, radius * s, 0, TAU);
      if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
      }
      if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }
      ctx.restore();
    };
    const glow = (x, y, radius, color, alpha = 0.5) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x * s, y * s, radius * s, 0, TAU);
      ctx.fill();
      ctx.restore();
    };
    const grad = (x0, y0, x1, y1, stops) => {
      const g = ctx.createLinearGradient(x0 * s, y0 * s, x1 * s, y1 * s);
      for (const [position, color] of stops) g.addColorStop(position, color);
      return g;
    };

    if (enemy.type === 'scout') {
      poly(
        [[0, 19], [8, 4], [13, -8], [3, -4], [0, -10], [-3, -4], [-13, -8], [-8, 4]],
        grad(0, -10, 0, 19, [[0, '#c8f8ff'], [0.45, '#1b7892'], [1, '#083445']]),
        '#6ee8ff',
        2.1,
      );
      line(0, 14, 0, -8, '#bdf5ff', 1.1, 0.55);
      poly([[0, 15], [2, -1], [0, -9], [-2, -1]], '#0c6e85', '#9ceeff', 1.1);
      circle(0, 9, 3.1, grad(0, 6, 0, 13, [[0, '#ffffff'], [1, '#3ac9f5']]), '#d8fbff', 1.2);
      poly([[0, 16], [1.6, 8], [0, 10], [-1.6, 8]], '#d8fbff');
      glow(0, -10, 4.5, '#43d7ff', 0.5);
      circle(0, -12, 2.2, '#e8fdff', '#9ceeff', 1);
      glow(11, -6, 2.4, '#ff8a9a', 0.45);
      glow(-11, -6, 2.4, '#8affd1', 0.45);
      circle(11, -6, 1.3, '#ff9aab', null, 0, 0.95);
      circle(-11, -6, 1.3, '#a5ffdd', null, 0, 0.95);
    } else if (enemy.type === 'striker') {
      poly(
        [[0, 22], [8, 5], [15, -7], [14, -15], [4, -11], [0, -15], [-4, -11], [-14, -15], [-15, -7], [-8, 5]],
        grad(0, -14, 0, 22, [[0, '#ffd9a0'], [0.5, '#d9772c'], [1, '#4e230b']]),
        '#ffc07a',
        2.2,
      );
      poly([[5, -4], [9, -11], [5, -14], [2, -8]], '#7a3a13', '#ffcf8f', 1.1);
      poly([[-5, -4], [-2, -8], [-5, -14], [-9, -11]], '#7a3a13', '#ffcf8f', 1.1);
      circle(0, 10, 3.2, grad(0, 7, 0, 13, [[0, '#ffffff'], [1, '#ff9a3d']]), '#ffe2bd', 1.2);
      poly([[3, -10], [5, 14], [4, 16], [2, 13]], '#5a280d', '#ffd59a', 1.2);
      poly([[-3, -10], [-2, 13], [-4, 16], [-5, 14]], '#5a280d', '#ffd59a', 1.2);
      glow(7, -13, 5, '#ffb95e', 0.55);
      glow(-7, -13, 5, '#ffb95e', 0.55);
      circle(7, -15, 2, '#fff0cf', '#ffcf7d', 1);
      circle(-7, -15, 2, '#fff0cf', '#ffcf7d', 1);
      line(0, 15, 0, -13, '#ffd7a1', 1.1, 0.5);
      line(-6, 5, -9, -7, '#ffb65e', 1, 0.45);
      line(6, 5, 9, -7, '#ffb65e', 1, 0.45);
    } else if (enemy.type === 'twin') {
      poly(
        [[0, 21], [11, 1], [0, -16], [-11, 1]],
        grad(0, -16, 0, 21, [[0, '#ffb3e0'], [0.55, '#b83e93'], [1, '#3c0f31']]),
        '#ff8cd2',
        2.2,
      );
      poly([[-13, 5], [-19, -8], [-9, -12], [-7, -1]], '#63204f', '#ff8cd2', 1.6);
      poly([[13, 5], [7, -1], [9, -12], [19, -8]], '#63204f', '#ff8cd2', 1.6);
      circle(0, 7, 2.7, grad(0, 4, 0, 10, [[0, '#ffffff'], [1, '#ff7bd5']]), '#ffc9ea', 1.1);
      circle(-13, -2, 1.8, '#ffe3f4', '#ffb7e4', 1);
      circle(13, -2, 1.8, '#ffe3f4', '#ffb7e4', 1);
      glow(0, -16, 5, '#ff7bd5', 0.5);
      glow(-13, -11, 4, '#ff8cd2', 0.5);
      glow(13, -11, 4, '#ff8cd2', 0.5);
      circle(0, -18, 2, '#ffe7f7', '#ff9bdd', 1);
      circle(0, 0, 1.8, '#fff0fa');
    } else if (enemy.type === 'brute') {
      poly(
        [[0, 22], [10, 12], [17, 10], [17, -10], [10, -20], [0, -20], [-10, -20], [-17, -10], [-17, 10], [-10, 12]],
        grad(0, -20, 0, 20, [[0, '#ff9a8a'], [0.45, '#c33b4a'], [1, '#420a14']]),
        '#ff7582',
        2.4,
      );
      poly([[0, 12], [9, 6], [9, -6], [0, -12], [-9, -6], [-9, 6]], '#2b0810', '#ff8f99', 1.4);
      line(-14, -12, 14, -12, '#ff8f99', 1.1, 0.45);
      line(-12, 4, 12, 4, '#ff8f99', 1.1, 0.35);
      circle(0, 4, 3.2, grad(0, 1, 0, 8, [[0, '#ffffff'], [1, '#ff5468']]), '#ffb0b8', 1.2);
      poly([[0, 20], [3, 24], [-3, 24]], '#a12b3b', '#ffb0b8', 1);
      glow(-9, -19, 5, '#ff5e6c', 0.55);
      glow(9, -19, 5, '#ff5e6c', 0.55);
      circle(-9, -21, 2, '#ffe6e9', '#ff9aa3', 1);
      circle(9, -21, 2, '#ffe6e9', '#ff9aa3', 1);
      circle(-13, -8, 1.4, '#ff8f99', null, 0, 0.9);
      circle(13, -8, 1.4, '#ff8f99', null, 0, 0.9);
    } else if (enemy.type === 'ace') {
      poly(
        [[0, 23], [10, 2], [13, -13], [6, -6], [0, -18], [-6, -6], [-13, -13], [-10, 2]],
        grad(0, -18, 0, 23, [[0, '#d8b8ff'], [0.45, '#7b4dce'], [1, '#24103c']]),
        '#c9a2ff',
        2.2,
      );
      poly([[-3, -17], [-8, -21], [-4, -14]], '#8a5fe0', '#d0b1ff', 1.2);
      poly([[3, -17], [4, -14], [8, -21]], '#8a5fe0', '#d0b1ff', 1.2);
      circle(0, 11, 3, grad(0, 8, 0, 14, [[0, '#ffffff'], [1, '#a77bff']]), '#e4d2ff', 1.2);
      glow(0, -4, 3.4, '#b98aff', 0.5);
      circle(0, -4, 1.6, '#ffffff', '#e7d8ff', 1);
      glow(-8, -16, 4.5, '#c9a2ff', 0.5);
      glow(8, -16, 4.5, '#c9a2ff', 0.5);
      line(7, 0, 11, -9, '#e7d8ff', 1, 0.6);
      line(-7, 0, -11, -9, '#e7d8ff', 1, 0.6);
    } else if (enemy.type === 'meteor') {
      poly(
        [[0, -18], [13, -9], [17, 5], [8, 15], [-6, 17], [-16, 8], [-14, -6]],
        grad(-14, -10, 12, 14, [[0, '#5b3b86'], [0.55, '#2b1745'], [1, '#130a22']]),
        '#c5a7ff',
        2,
      );
      circle(-5, -3, 4, '#241238', '#8f6dd8', 1.2, 0.85);
      circle(6, 6, 3, '#3a2358', '#a889ef', 1, 0.85);
      circle(-10, 8, 2, '#1c0e2e', '#8f6dd8', 1, 0.8);
      line(-14, -6, -6, -3, '#d8beff', 1.8, 0.9);
      line(-6, -3, -1, 2, '#d8beff', 1.5, 0.85);
      line(-1, 2, 6, 5, '#d8beff', 1.5, 0.8);
      line(6, 5, 14, 7, '#d8beff', 1.6, 0.85);
      glow(2, 1, 5.5, '#a884ff', 0.4);
      circle(-18, 4, 1.6, '#8f6dd8', '#d0baff', 1);
      circle(16, 12, 1.3, '#8f6dd8', '#d0baff', 1);
      circle(5, -18, 1.1, '#a884ff', '#e0d0ff', 0.9);
    } else if (enemy.type === 'special') {
      poly(
        [[0, -24], [18, 0], [0, 24], [-18, 0]],
        grad(0, -24, 0, 24, [[0, '#fff2bd'], [0.5, '#e0a838'], [1, '#4f3708']]),
        '#ffd166',
        2.5,
      );
      poly([[-22, -3], [-24, 2], [-20, 5], [-17, 1]], '#7a5a12', '#ffd166', 1.4);
      poly([[22, -3], [17, 1], [20, 5], [24, 2]], '#7a5a12', '#ffd166', 1.4);
      poly([[0, -15], [10, 0], [0, 15], [-10, 0]], '#33230a', '#ffe08a', 1.5);
      circle(0, -8, 3.2, grad(0, -11, 0, -5, [[0, '#ffffff'], [1, '#ffd166']]), '#fff4cc', 1.2);
      glow(0, 2, 5, '#ffd166', 0.45);
      circle(0, 2, 2.2, '#fff9dc', '#ffe08a', 1.2);
      glow(0, -24, 6, '#ffd166', 0.5);
      glow(-15, -12, 3.5, '#ffcf5e', 0.4);
      glow(15, -12, 3.5, '#ffcf5e', 0.4);
      line(0, 24, 0, -24, '#ffe9a3', 1.2, 0.4);
      line(-12, 7, 12, -7, '#ffe9a3', 1, 0.35);
      line(12, 7, -12, -7, '#ffe9a3', 1, 0.35);
    } else if (enemy.type === 'boss') {
      if (enemy.bossType === 'hive') {
        const body = grad(0, -34, 0, 34, [
          [0, enemy.enraged ? '#ffe08a' : '#7a6114'],
          [0.5, enemy.enraged ? '#c97a1c' : '#42330a'],
          [1, enemy.enraged ? '#3d1c05' : '#171105'],
        ]);
        const stroke = enemy.enraged ? '#ffd166' : '#b7ff7d';
        poly([[0, -32], [26, -14], [28, 10], [10, 30], [-10, 30], [-28, 10], [-26, -14]], body, stroke, 3);
        for (const [cx, cy, r] of [[-13, -8, 5], [13, -8, 5], [0, -14, 5], [-16, 8, 5], [16, 8, 5], [0, 6, 5]]) {
          circle(cx, cy, r, '#241a06', stroke, 1.1, 0.9);
        }
        circle(0, 12, 7, grad(0, 8, 0, 16, [[0, '#ffffff'], [1, '#ffd166']]), '#fff0bd', 1.6);
        glow(0, 12, 10, '#ffd166', 0.45);
        circle(-8, -4, 2.2, '#b7ff7d', '#eaffc9', 1);
        circle(8, -4, 2.2, '#b7ff7d', '#eaffc9', 1);
        glow(-20, -18, 6, stroke, 0.5);
        glow(20, -18, 6, stroke, 0.5);
        circle(-20, -20, 2.2, '#fff6d8', stroke, 1.1);
        circle(20, -20, 2.2, '#fff6d8', stroke, 1.1);
        line(-26, -14, 26, -14, '#ffe08a', 1.1, 0.35);
        line(-14, 20, 14, 20, '#ffe08a', 1.1, 0.3);
      } else if (enemy.bossType === 'phantom') {
        const body = grad(0, -36, 0, 36, [
          [0, enemy.enraged ? '#ead9ff' : '#4a2a86'],
          [0.5, enemy.enraged ? '#8a5fd0' : '#2b1657'],
          [1, enemy.enraged ? '#3d1550' : '#120a2c'],
        ]);
        const stroke = enemy.enraged ? '#ffd166' : '#c9a2ff';
        poly(
          [[0, 36], [12, 14], [24, -2], [30, -10], [20, -20], [10, -18], [0, -36], [-10, -18], [-20, -20], [-30, -10], [-24, -2], [-12, 14]],
          body,
          stroke,
          3,
        );
        poly([[-8, -32], [-16, -36], [-9, -27]], '#6a3fae', '#e0ccff', 1.2);
        poly([[8, -32], [9, -27], [16, -36]], '#6a3fae', '#e0ccff', 1.2);
        poly([[0, 22], [3, 10], [-3, 10]], '#ffffff', '#e0ccff', 1.1);
        glow(0, 0, 8, '#a77bff', 0.45);
        circle(0, 0, 3, '#ffffff', '#e0ccff', 1.4);
        glow(-16, -22, 5, '#a77bff', 0.5);
        glow(16, -22, 5, '#a77bff', 0.5);
        circle(-16, -24, 2, '#eadfff', stroke, 1);
        circle(16, -24, 2, '#eadfff', stroke, 1);
        line(-22, 4, 22, 4, '#e0ccff', 1.1, 0.35);
        line(0, 30, 0, -30, '#e0ccff', 1, 0.3);
      } else {
        const bossFill = grad(0, -36, 0, 34, [
          [0, enemy.enraged ? '#ff9a4d' : '#5a1623'],
          [0.42, enemy.enraged ? '#a83d1e' : '#34101d'],
          [1, enemy.enraged ? '#2a070d' : '#15060d'],
        ]);
        const bossStroke = enemy.enraged ? '#ffb45e' : '#ff6675';
        poly(
          [[0, 34], [18, 10], [30, 4], [30, -18], [10, -14], [0, -36], [-10, -14], [-30, -18], [-30, 4], [-18, 10]],
          bossFill,
          bossStroke,
          3,
        );
        poly(
          [[0, 30], [11, 9], [20, 3], [20, -15], [8, -11], [0, -28], [-8, -11], [-20, -15], [-20, 3], [-11, 9]],
          '#220812',
          bossStroke,
          1.5,
        );
        poly([[0, -30], [7, -24], [5, -16], [-5, -16], [-7, -24]], grad(0, -31, 0, -15, [
          [0, '#ffffff'],
          [0.55, '#9fd8ff'],
          [1, '#2b4f78'],
        ]), bossStroke, 1.4);
        poly([[0, 34], [4, 27], [-4, 27]], '#8c2330', '#ffb0b8', 1.4);
        poly([[22, -8], [26, -4], [24, 6], [21, 4]], '#45121e', bossStroke, 1.4);
        poly([[-22, -8], [-21, 4], [-24, 6], [-26, -4]], '#45121e', bossStroke, 1.4);
        line(0, -30, 0, 28, '#ffb0b8', 1.2, 0.35);
        line(-24, -10, 24, -10, '#ffb0b8', 1.1, 0.4);
        line(-16, 12, 16, 12, '#ffb0b8', 1.1, 0.35);
        glow(-20, -20, 7, bossStroke, 0.45);
        glow(20, -20, 7, bossStroke, 0.45);
        circle(-20, -22, 2.4, '#fff0d8', bossStroke, 1.2);
        circle(20, -22, 2.4, '#fff0d8', bossStroke, 1.2);
        glow(0, 2, 8, enemy.enraged ? '#ffd166' : '#54d7ff', 0.35);
        circle(0, 2, 3, enemy.enraged ? '#fff0c8' : '#bff4ff', '#ffffff', 1.5);
      }
    }

    ctx.restore();
  }

  function preloadSpriteImage(id) {
    if (spriteImageCache.has(id)) return spriteImageCache.get(id);
    // 无 PNG 的精灵（新敌机/BOSS 用程序化绘制）：标记 failed，不发起加载避免 404 控制台报错
    if (PROCEDURAL_ONLY_SPRITES.has(id)) {
      const failedEntry = { id, image: null, ready: false, failed: true };
      spriteImageCache.set(id, failedEntry);
      return failedEntry;
    }
    const entry = { id, image: null, ready: false, failed: false };
    spriteImageCache.set(id, entry);
    const img = new Image();
    img.onload = () => {
      entry.image = img;
      entry.ready = true;
      enemySpriteCache.clear();
      playerSkinSpriteCache.clear();
      droneSpriteCache.clear();
      bulletSpriteCache.clear();
      if (backgroundCache) backgroundCache = null;
      if (!state && els.mainMenu && !els.mainMenu.classList.contains('hidden')) {
        renderSkinMenu();
      }
      if (els.encyclopediaOverlay && !els.encyclopediaOverlay.classList.contains('hidden')) {
        renderEncyclopedia();
      }
      if (state && state.firstSeenOpen && state.firstSeenEntry && els.firstSeenPreview) {
        drawEnemyPreviewInto(els.firstSeenPreview, state.firstSeenEntry);
      }
      if (state && state.bossWarningTimer > 0 && els.bossWarningPreview) {
        drawEnemyPreviewInto(els.bossWarningPreview, { id: `boss:${bossTypeForWave(state.wave)}` });
      }
      if (state && state.bossChoiceOpen && els.bossRewardPreview && state.lastBossType) {
        drawEnemyPreviewInto(els.bossRewardPreview, { id: `boss:${state.lastBossType}` });
      }
      markHud();
    };
    img.onerror = () => {
      entry.failed = true;
    };
    img.src = `assets/sprites/${id}.png`;
    return entry;
  }

  function preloadAllSpriteImages() {
    for (const [key] of Object.entries(ENEMY_INFO)) {
      // 首领（boss）没有 enemy_boss.png，实际使用 boss_* 精灵，跳过避免 404 与控制台报错
      if (key === 'boss') continue;
      preloadSpriteImage(`enemy_${key}`);
    }
    for (const bossType of Object.keys(BOSS_TYPES)) {
      preloadSpriteImage(`boss_${bossType}`);
    }
    preloadSpriteImage('boss_base');
    for (const skin of PLAYER_SKINS) {
      preloadSpriteImage(`player_${skin.id}`);
    }
    for (const bulletId of ['bolt', 'slow', 'burn', 'blast', 'homing', 'drone', 'enemy', 'boss']) {
      preloadSpriteImage(`bullet_${bulletId}`);
    }
    if (!battleBackgroundImage && !battleBackgroundFailed) {
      const bg = new Image();
      bg.onload = () => {
        battleBackgroundImage = bg;
        battleBackgroundReady = true;
        backgroundCache = null;
      };
      bg.onerror = () => {
        battleBackgroundFailed = true;
      };
      bg.src = 'assets/battle.webp';
    }
  }

  function bulletSpriteKey(bullet) {
    if (bullet.sprite === 'enemy' || bullet.sprite === 'boss') return bullet.sprite;
    if (bullet.source === 'drone') return 'drone';
    if (bullet.blastRadius) return 'blast';
    if (bullet.burnDps > 0) return 'burn';
    if (bullet.slowPower > 0) return 'slow';
    if (bullet.homing) return 'homing';
    return bullet.ammoType || 'bolt';
  }

  function ensureBulletSprite(key) {
    if (bulletSpriteCache.has(key)) return bulletSpriteCache.get(key);
    const sprite = document.createElement('canvas');
    sprite.width = 64;
    sprite.height = 64;
    const ctx = sprite.getContext('2d');
    const entry = spriteImageCache.get(`bullet_${key}`);
    if (entry && entry.ready && entry.image) {
      ctx.drawImage(entry.image, 0, 0, 64, 64);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(32, 32, 10, 0, TAU);
      ctx.fill();
    }
    bulletSpriteCache.set(key, sprite);
    return sprite;
  }

  function enemySpriteSize(type) {
    return type === 'boss' ? 128 : 96;
  }

  function enemySpriteImageKey(type, bossType) {
    if (type === 'boss') return bossType ? `boss_${bossType}` : 'boss_base';
    return `enemy_${type}`;
  }

  function ensureEnemySprite(type, enraged, radius, bossType = null) {
    const key = `${type}|${enraged ? 1 : 0}|${bossType || 'none'}|${Math.round(radius)}`;
    let sprite = enemySpriteCache.get(key);
    if (sprite) return sprite;
    const size = enemySpriteSize(type);
    sprite = document.createElement('canvas');
    sprite.width = size;
    sprite.height = size;
    const sc = sprite.getContext('2d');
    sc.translate(size / 2, size / 2);
    const imageEntry = spriteImageCache.get(enemySpriteImageKey(type, bossType));
    if (imageEntry && imageEntry.ready && imageEntry.image) {
      const image = imageEntry.image;
      const margin = 8;
      const maxSide = size - margin * 2;
      const iw = image.naturalWidth || image.width;
      const ih = image.naturalHeight || image.height;
      const scale = Math.min(maxSide / iw, maxSide / ih, 2);
      const dw = iw * scale;
      const dh = ih * scale;
      sc.drawImage(image, -dw / 2, -dh / 2, dw, dh);
    } else {
      drawEnemyShape(sc, { type, r: radius, phase: 0, enraged, bossType });
    }
    enemySpriteCache.set(key, sprite);
    return sprite;
  }

  function prewarmEnemySprites() {
    for (const type of Object.keys(ENEMY_TYPES)) {
      const baseRadius = ENEMY_TYPES[type].r;
      const bossTypes = type === 'boss' ? Object.keys(BOSS_TYPES) : [null];
      const radii = type === 'boss'
        ? [baseRadius, baseRadius + 4, baseRadius + 8, baseRadius + 12]
        : [baseRadius, baseRadius + 3, baseRadius + 6];
      for (const bossType of bossTypes) {
        for (const radius of radii) {
          ensureEnemySprite(type, false, radius, bossType);
          if (type === 'boss') ensureEnemySprite(type, true, radius, bossType);
        }
      }
    }
  }

  function drawEnemy(enemy) {
    const sprite = ensureEnemySprite(
      enemy.type,
      enemy.type === 'boss' && !!enemy.enraged,
      enemy.r,
      enemy.bossType,
    );
    const spriteSize = sprite.width;
    ctx.save();
    ctx.translate(enemy.x, enemy.y);
    if (enemy.type === 'special') {
      const pulse = 1 + Math.sin(state.elapsed * 6 + enemy.phase) * 0.04;
      ctx.scale(pulse, pulse);
    }
    ctx.drawImage(sprite, -spriteSize / 2, -spriteSize / 2);
    ctx.restore();

    // 迷你血条：敌机受击后显示剩余血量（"还差几下"可感知）；BOSS 用 HUD 血条，跳过
    if (enemy.type !== 'boss' && enemy.maxHp > 0 && enemy.hp < enemy.maxHp) {
      const pct = clamp(enemy.hp / enemy.maxHp, 0, 1);
      const w = Math.max(20, enemy.r * 1.6);
      const h = 3.5;
      const x = enemy.x - w / 2;
      const y = enemy.y - enemy.r - 13;
      ctx.save();
      ctx.fillStyle = 'rgba(5, 10, 18, 0.78)';
      ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
      ctx.fillStyle = pct > 0.5 ? '#62e6a1' : pct > 0.25 ? '#ffc857' : '#ff6670';
      ctx.fillRect(x, y, w * pct, h);
      ctx.restore();
    }

    if (enemy.type === 'boss' && enemy.enraged) {
      const pulse = 1 + Math.sin(state.elapsed * 14 + enemy.phase) * 0.08;
      const bossCfg = BOSS_TYPES[enemy.bossType] || BOSS_TYPES.warlord;
      ctx.save();
      ctx.globalAlpha = 0.6;
      ctx.strokeStyle = bossCfg.glow;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, (enemy.r + 8) * pulse, 0, TAU);
      ctx.stroke();
      ctx.restore();
    }

    const rageExposed = enemy.type === 'boss' && enemy.enraged
      && (enemy.rageCoreTimer < BOSS_RAGE_CORE_WINDOW);
    if (enemy.type === 'boss' && (enemy.coreExposed || rageExposed)) {
      const pulse = 1 + Math.sin(state.elapsed * 12) * 0.08;
      // 转阶段核心 = 青色；狂暴暴露窗口 = 琥珀色（都是"现在输出"的信号）
      const isStageCore = enemy.coreExposed && !rageExposed;
      const ringColor = isStageCore ? '#54d7ff' : '#ffb65e';
      const coreColor = enemy.coreHitFlash > 0 ? '#ffffff' : (isStageCore ? '#8be9ff' : '#ffd166');
      ctx.save();
      ctx.globalAlpha = 0.92;
      ctx.shadowColor = ringColor;
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#0e2a3a';
      ctx.strokeStyle = ringColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y - 6, 15 * pulse, 0, TAU);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = coreColor;
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y - 6, 6 * pulse, 0, TAU);
      ctx.fill();
      ctx.restore();
    }

    if (enemy.elite) {
      const pulse = 1 + Math.sin(state.elapsed * 5 + enemy.elitePulse) * 0.05;
      ctx.save();
      ctx.globalAlpha = 0.85;
      ctx.strokeStyle = '#ffd166';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#ffd166';
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, (enemy.r + 5) * pulse, 0, TAU);
      ctx.stroke();
      ctx.fillStyle = '#ffd166';
      ctx.font = '800 12px "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('精英', enemy.x, enemy.y - enemy.r - 24);
      ctx.restore();
    }

    if ((enemy.hitFlash || 0) > 0) {
      const flashAlpha = Math.min(1, enemy.hitFlash / 0.09);
      ctx.save();
      ctx.globalAlpha = flashAlpha;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, enemy.r * (1 + (1 - flashAlpha) * 0.18), 0, TAU);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.24)';
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, enemy.r * 0.45, 0, TAU);
      ctx.fill();
      ctx.restore();
    }

    // 减速：冰霜覆层 + 双层冰环 + 环绕冰晶 + 头顶雪花（明显版）
    if (state.elapsed < enemy.slowUntil) {
      ctx.save();
      const pulse = Math.sin(state.elapsed * 8 + enemy.id);
      ctx.globalAlpha = 0.34 + 0.1 * pulse;
      ctx.fillStyle = '#62e6ff';
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, enemy.r * 0.95, 0, TAU);
      ctx.fill();
      ctx.globalAlpha = 0.5 + 0.2 * pulse;
      ctx.fillStyle = '#d6fbff';
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, enemy.r * 0.55, 0, TAU);
      ctx.fill();
      ctx.globalAlpha = 0.95;
      ctx.strokeStyle = '#9ff3ff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, enemy.r * 1.18, 0, TAU);
      ctx.stroke();
      ctx.globalAlpha = 0.5 + 0.3 * pulse;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, enemy.r * 1.34, 0, TAU);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#eafcff';
      for (let k = 0; k < 5; k++) {
        const a = state.elapsed * 2.6 + (k * TAU) / 5 + enemy.id;
        const r = enemy.r * 1.42;
        const cx = enemy.x + Math.cos(a) * r;
        const cy = enemy.y + Math.sin(a) * r * 0.55;
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.arc(cx, cy, 7, 0, TAU);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, TAU);
        ctx.fill();
      }
      ctx.textAlign = 'center';
      ctx.font = 'bold 19px sans-serif';
      ctx.fillStyle = '#d6fbff';
      ctx.fillText('❄', enemy.x, enemy.y - enemy.r - 28);
      ctx.restore();
    }

    // 眩晕：金色脉冲光环 + 头顶 4 颗旋转星标（明显版）
    if (enemy.stunTimer > 0) {
      ctx.save();
      const sp = state.elapsed * 5;
      ctx.globalAlpha = 0.35 + 0.25 * Math.sin(sp * 2);
      ctx.strokeStyle = '#ffd166';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, enemy.r * (1.15 + 0.12 * Math.sin(sp * 2)), 0, TAU);
      ctx.stroke();
      ctx.textAlign = 'center';
      ctx.font = 'bold 21px sans-serif';
      for (let k = 0; k < 4; k++) {
        const a = sp + (k * TAU) / 4;
        ctx.globalAlpha = 0.95 + 0.05 * Math.sin(sp * 2 + k);
        ctx.fillStyle = k % 2 === 0 ? '#ffd166' : '#ffe9a8';
        ctx.fillText('✦', enemy.x + Math.cos(a) * enemy.r * 0.9, enemy.y + Math.sin(a) * enemy.r * 0.5 - enemy.r * 0.6);
      }
      ctx.restore();
    }

    // 灼烧：橙红覆层 + 顶部跳动火苗（明显版，火焰粒子仍在 updateEnemies 生成）
    if (enemy.burns.length > 0) {
      ctx.save();
      const flicker = Math.sin(state.elapsed * 16 + enemy.id);
      ctx.globalAlpha = 0.26 + 0.1 * flicker;
      ctx.fillStyle = '#ff7b3a';
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, enemy.r * 0.92, 0, TAU);
      ctx.fill();
      const flameX = [enemy.x - enemy.r * 0.55, enemy.x, enemy.x + enemy.r * 0.55];
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = '#ff9f5a';
      for (let k = 0; k < 3; k++) {
        const fy = enemy.y - enemy.r * 0.7;
        const h = enemy.r * (0.5 + 0.18 * Math.sin(state.elapsed * 13 + k * 2.1));
        ctx.beginPath();
        ctx.moveTo(flameX[k] - 4.5, fy + 3);
        ctx.quadraticCurveTo(flameX[k], fy - h, flameX[k] + 4.5, fy + 3);
        ctx.fill();
      }
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = '#ffd166';
      for (let k = 0; k < 3; k++) {
        const fy = enemy.y - enemy.r * 0.7;
        const h = enemy.r * (0.28 + 0.12 * Math.sin(state.elapsed * 15 + k * 2.1));
        ctx.beginPath();
        ctx.moveTo(flameX[k] - 2.5, fy + 2);
        ctx.quadraticCurveTo(flameX[k], fy - h, flameX[k] + 2.5, fy + 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 卡壳：头顶脉冲感叹号徽章（明显版）
    if (state.elapsed < enemy.jamUntil) {
      ctx.save();
      const jp = 0.75 + 0.25 * Math.sin(state.elapsed * 10 + enemy.id);
      ctx.globalAlpha = jp;
      ctx.fillStyle = 'rgba(43, 31, 0, 0.85)';
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y - enemy.r - 18, 10, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = '#ffd166';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y - enemy.r - 18, 10, 0, TAU);
      ctx.stroke();
      ctx.fillStyle = '#ffd166';
      ctx.font = 'bold 15px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('!', enemy.x, enemy.y - enemy.r - 13);
      ctx.restore();
    }

    if (enemy.hp < enemy.maxHp) {
      const barWidth = enemy.r * 2.2;
      const barX = enemy.x - barWidth / 2;
      const barY = enemy.y - enemy.r - 12;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fillRect(barX, barY, barWidth, 5);
      ctx.fillStyle = enemy.hp > enemy.maxHp * 0.35 ? '#62e6a1' : '#ff5e6c';
      ctx.fillRect(barX, barY, barWidth * clamp(enemy.hp / enemy.maxHp, 0, 1), 5);
    }
    if (SHOW_HITBOX) {
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, enemy.r, 0, TAU);
      ctx.strokeStyle = 'rgba(0, 255, 140, 0.9)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  function drawEnemies() {
    for (const enemy of state.enemies) drawEnemy(enemy);
  }

  function drawSpecialDrops() {
    for (const drop of state.specialDrops) {
      const config = RESOURCE_DROPS[drop.type] || AMMO_TYPES[drop.type];
      const pulse = 1 + Math.sin(state.elapsed * 6 + drop.x) * 0.08;
      ctx.save();
      ctx.translate(drop.x, drop.y);
      ctx.scale(pulse, pulse);
      ctx.shadowColor = config.color;
      ctx.shadowBlur = 0;
      ctx.strokeStyle = config.color;
      ctx.lineWidth = 2;
      ctx.fillStyle = 'rgba(10, 20, 32, 0.92)';
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = -Math.PI / 2 + i * TAU / 6;
        const px = Math.cos(angle) * 16;
        const py = Math.sin(angle) * 16;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = config.color;
      ctx.font = '800 13px "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(config.name[0], 0, 0);
      ctx.restore();

      ctx.fillStyle = 'rgba(0, 0, 0, 0.58)';
      ctx.fillRect(drop.x - 18, drop.y + 18, 36, 5);
      ctx.fillStyle = config.color;
      ctx.fillRect(drop.x - 18, drop.y + 18, 36 * clamp(drop.life / drop.maxLife, 0, 1), 5);
    }
  }

  function drawPlayerSkinHull(target, skin) {
    const polygon = (points, fill, stroke = skin.accent, lineWidth = 1.8) => {
      target.beginPath();
      target.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i++) target.lineTo(points[i][0], points[i][1]);
      target.closePath();
      target.fillStyle = fill;
      target.fill();
      if (stroke) {
        target.strokeStyle = stroke;
        target.lineWidth = lineWidth;
        target.stroke();
      }
    };

    const circle = (x, y, radius, fill, stroke = null, lineWidth = 1) => {
      target.beginPath();
      target.arc(x, y, radius, 0, TAU);
      target.fillStyle = fill;
      target.fill();
      if (stroke) {
        target.strokeStyle = stroke;
        target.lineWidth = lineWidth;
        target.stroke();
      }
    };

    const hull = target.createLinearGradient(0, -28, 0, 26);
    hull.addColorStop(0, skin.primary);
    hull.addColorStop(0.55, skin.primary);
    hull.addColorStop(1, skin.secondary);
    const wing = target.createLinearGradient(-30, 0, 30, 0);
    wing.addColorStop(0, skin.secondary);
    wing.addColorStop(0.5, skin.primary);
    wing.addColorStop(1, skin.secondary);
    const glass = target.createLinearGradient(0, -12, 0, 2);
    glass.addColorStop(0, '#ffffff');
    glass.addColorStop(1, skin.accent);

    target.save();
    target.translate(PLAYER_SPRITE_CENTER_X, PLAYER_SPRITE_CENTER_Y);
    target.scale(PLAYER_MODEL_SCALE, PLAYER_MODEL_SCALE);
    target.lineJoin = 'round';
    target.lineCap = 'round';

    if (skin.type === 'interceptor') {
      polygon([[-5, 16], [-28, 13], [-17, 4], [-6, 7]], wing);
      polygon([[5, 16], [28, 13], [17, 4], [6, 7]], wing);
      polygon([[0, -27], [8, -5], [5, 20], [0, 24], [-5, 20], [-8, -5]], hull, skin.accent, 2);
      polygon([[0, -25], [4, -9], [0, -3], [-4, -9]], skin.accent, null);
      polygon([[-4, 7], [0, -1], [4, 7], [0, 15]], skin.secondary, '#ffe2d1', 1.2);
    } else if (skin.type === 'hummingbird') {
      polygon([[-6, 13], [-30, 4], [-24, 17], [-8, 20]], wing);
      polygon([[6, 13], [30, 4], [24, 17], [8, 20]], wing);
      polygon([[-8, 1], [-20, -7], [-15, 7]], hull, skin.accent, 1.4);
      polygon([[8, 1], [20, -7], [15, 7]], hull, skin.accent, 1.4);
      polygon([[0, -24], [9, -4], [7, 18], [0, 23], [-7, 18], [-9, -4]], hull, skin.accent, 2);
      target.beginPath();
      target.ellipse(0, -2, 4, 9, 0, 0, TAU);
      target.fillStyle = skin.secondary;
      target.fill();
      target.strokeStyle = '#bfffe0';
      target.lineWidth = 1.3;
      target.stroke();
    } else if (skin.type === 'wing') {
      polygon([[-4, 14], [-31, 18], [-24, -4], [-8, 3]], wing, skin.accent, 2);
      polygon([[4, 14], [31, 18], [24, -4], [8, 3]], wing, skin.accent, 2);
      polygon([[-10, 10], [-22, 11], [-16, 2]], hull, '#fff0bd', 1.2);
      polygon([[10, 10], [22, 11], [16, 2]], hull, '#fff0bd', 1.2);
      polygon([[0, -23], [10, -2], [6, 21], [0, 17], [-6, 21], [-10, -2]], hull, skin.accent, 2);
      polygon([[0, -18], [4, -7], [0, 2], [-4, -7]], skin.accent, null);
    } else if (skin.type === 'ghost') {
      polygon([[0, -23], [13, -9], [29, 10], [9, 7], [4, 20], [0, 15], [-4, 20], [-9, 7], [-29, 10], [-13, -9]], wing, skin.accent, 2);
      polygon([[0, -19], [8, -7], [4, 10], [0, 15], [-4, 10], [-8, -7]], hull, '#d9c7ff', 1.4);
      target.beginPath();
      target.arc(-12, 3, 2.4, 0, TAU);
      target.arc(12, 3, 2.4, 0, TAU);
      target.fillStyle = skin.accent;
      target.fill();
    } else if (skin.type === 'prism') {
      polygon([[0, -27], [11, -6], [7, 20], [0, 25], [-7, 20], [-11, -6]], hull, skin.accent, 2);
      polygon([[-8, 4], [-29, 14], [-18, -7], [-9, -1]], wing, skin.accent, 1.8);
      polygon([[8, 4], [29, 14], [18, -7], [9, -1]], wing, skin.accent, 1.8);
      polygon([[0, -24], [7, -5], [0, 3], [-7, -5]], '#ffffff', '#baf9ff', 1.1);
      polygon([[0, 3], [6, 16], [0, 21], [-6, 16]], skin.accent, '#ffffff', 1.1);
      polygon([[-21, 8], [-12, 2], [-9, 11]], '#8be9ff', null);
      polygon([[21, 8], [12, 2], [9, 11]], '#cfb8ff', null);
    } else {
      polygon([[-7, 16], [-23, 8], [-25, 14], [-7, 19]], wing, skin.accent, 2);
      polygon([[7, 16], [23, 8], [25, 14], [7, 19]], wing, skin.accent, 2);
      polygon([[0, -24], [9, -6], [6, 18], [0, 22], [-6, 18], [-9, -6]], hull, skin.accent, 2);
      polygon([[0, -24], [3, -12], [-3, -12]], skin.flame, null);
      target.beginPath();
      target.ellipse(0, -3, 3.5, 8, 0, 0, TAU);
      target.fillStyle = '#173a52';
      target.strokeStyle = '#9ff3ff';
      target.lineWidth = 1.5;
      target.fill();
      target.stroke();
    }

    if (!['prototype', 'hummingbird', 'prism'].includes(skin.type)) {
      target.beginPath();
      target.ellipse(0, -8, 3.4, 7, 0, 0, TAU);
      target.fillStyle = glass;
      target.fill();
      target.strokeStyle = '#ffffff';
      target.lineWidth = 1.2;
      target.stroke();
      target.beginPath();
      target.ellipse(0, -11, 1.6, 3, 0, 0, TAU);
      target.fillStyle = 'rgba(255, 255, 255, 0.55)';
      target.fill();
    }

    target.save();
    target.globalAlpha = 0.32;
    target.strokeStyle = '#ffffff';
    target.lineWidth = 1.1;
    target.beginPath();
    target.moveTo(0, -24);
    target.lineTo(0, -10);
    target.stroke();
    target.restore();

    const engineGlow = target.createLinearGradient(0, 14, 0, 22);
    engineGlow.addColorStop(0, skin.flameCore);
    engineGlow.addColorStop(1, skin.flame);
    target.save();
    target.globalAlpha = 0.7;
    target.fillStyle = engineGlow;
    target.beginPath();
    target.ellipse(0, 18, 3.4, 5, 0, 0, TAU);
    target.fill();
    target.restore();

    // 机翼炮口、航行灯和中轴装甲线只绘制进缓存，不增加逐帧路径开销。
    const hardpointSpread = {
      prototype: 20,
      interceptor: 24,
      hummingbird: 25,
      wing: 27,
      ghost: 23,
      prism: 24,
    }[skin.type] || 20;
    target.save();
    target.globalAlpha = 0.9;
    target.strokeStyle = skin.accent;
    target.lineWidth = 1.25;
    for (const side of [-1, 1]) {
      const x = hardpointSpread * side;
      target.beginPath();
      target.moveTo(x, 10);
      target.lineTo(x * 0.9, 1);
      target.stroke();
      target.shadowColor = side < 0 ? '#ff6d7a' : '#62e6ff';
      target.shadowBlur = 6;
      circle(x, 11, 2.1, side < 0 ? '#ff6d7a' : '#62e6ff', '#f4ffff', 0.7);
      target.shadowBlur = 0;
      polygon([[x - 2.2, 8], [x - 1.4, -1], [x + 1.4, -1], [x + 2.2, 8]], skin.secondary, skin.accent, 0.9);
    }
    target.globalAlpha = 0.55;
    target.strokeStyle = '#ffffff';
    target.lineWidth = 0.85;
    target.beginPath();
    target.moveTo(0, -17);
    target.lineTo(0, 14);
    target.stroke();
    target.restore();
    target.restore();
  }

  function ensurePlayerSkinSprite(id) {
    if (playerSkinSpriteCache.has(id)) return playerSkinSpriteCache.get(id);
    const skin = skinById(id);
    const sprite = document.createElement('canvas');
    sprite.width = PLAYER_SPRITE_SIZE;
    sprite.height = PLAYER_SPRITE_SIZE;
    const imageEntry = spriteImageCache.get(`player_${id}`);
    if (imageEntry && imageEntry.ready && imageEntry.image) {
      const image = imageEntry.image;
      const margin = 4;
      const maxSide = PLAYER_SPRITE_SIZE - margin * 2;
      const iw = image.naturalWidth || image.width;
      const ih = image.naturalHeight || image.height;
      const scale = Math.min(maxSide / iw, maxSide / ih, 2);
      const dw = iw * scale;
      const dh = ih * scale;
      sprite.getContext('2d').drawImage(image, (PLAYER_SPRITE_SIZE - dw) / 2, (PLAYER_SPRITE_SIZE - dh) / 2, dw, dh);
    } else {
      drawPlayerSkinHull(sprite.getContext('2d'), skin);
    }
    playerSkinSpriteCache.set(id, sprite);
    return sprite;
  }

  function ensureDroneSprite(id) {
    if (droneSpriteCache.has(id)) return droneSpriteCache.get(id);
    const skin = skinById(id);
    const sprite = document.createElement('canvas');
    sprite.width = 44;
    sprite.height = 44;
    const dc = sprite.getContext('2d');
    dc.translate(22, 21);
    dc.lineJoin = 'round';
    dc.fillStyle = skin.secondary;
    dc.strokeStyle = skin.accent;
    dc.lineWidth = 1.8;
    dc.beginPath();
    dc.moveTo(0, -15);
    dc.lineTo(12, -2);
    dc.lineTo(8, 11);
    dc.lineTo(0, 7);
    dc.lineTo(-8, 11);
    dc.lineTo(-12, -2);
    dc.closePath();
    dc.fill();
    dc.stroke();
    dc.fillStyle = skin.primary;
    dc.beginPath();
    dc.moveTo(0, -12);
    dc.lineTo(5, 1);
    dc.lineTo(0, 8);
    dc.lineTo(-5, 1);
    dc.closePath();
    dc.fill();
    dc.strokeStyle = '#ffffff';
    dc.lineWidth = 1;
    dc.stroke();
    dc.fillStyle = skin.accent;
    dc.fillRect(-2, -18, 4, 10);
    dc.fillStyle = '#ffffff';
    dc.beginPath();
    dc.arc(0, 0, 2.3, 0, TAU);
    dc.fill();
    droneSpriteCache.set(id, sprite);
    return sprite;
  }

  function drawPlayerBeam() {
    const p = state.player;
    if (!p || p.core !== 'beam' || !state.beamVisual) return;
    const v = state.beamVisual;
    const halfW = BEAM_BASE_HALF_WIDTH + (p.rows || 1) * BEAM_ROWS_WIDTH;
    const t = state.elapsed;
    const len = Math.max(1, v.y0 - v.y1);
    const pulse = 0.86 + 0.14 * Math.sin(t * 26);         // 光束整体脉动
    const shimmer = 0.72 + 0.28 * Math.sin(t * 61 + 1.7); // 核心亮度闪烁
    const beamPath = (wTop, wBot) => {
      ctx.beginPath();
      ctx.moveTo(v.x - wTop, v.y0);
      ctx.lineTo(v.x + wTop, v.y0);
      ctx.lineTo(v.x + wBot, v.y1);
      ctx.lineTo(v.x - wBot, v.y1);
      ctx.closePath();
    };
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    // 1) 大范围外辉光（青蓝，最宽最淡）
    const outerGlow = ctx.createLinearGradient(0, v.y1, 0, v.y0);
    outerGlow.addColorStop(0, 'rgba(60, 190, 255, 0.26)');
    outerGlow.addColorStop(1, 'rgba(60, 190, 255, 0.7)');
    ctx.globalAlpha = 0.55 * pulse;
    ctx.fillStyle = outerGlow;
    beamPath(halfW * 1.5, halfW * 0.9);
    ctx.fill();

    // 2) 主辉光（青，光束主体）
    const midGlow = ctx.createLinearGradient(0, v.y1, 0, v.y0);
    midGlow.addColorStop(0, 'rgba(84, 215, 255, 0.5)');
    midGlow.addColorStop(1, 'rgba(150, 238, 255, 0.95)');
    ctx.globalAlpha = 0.8 * pulse;
    ctx.fillStyle = midGlow;
    beamPath(halfW * 0.8, halfW * 0.45);
    ctx.fill();

    // 3) 能量流动条纹：沿光束向尖端流动的亮线
    ctx.globalAlpha = 0.55 * shimmer;
    ctx.fillStyle = '#dffcff';
    for (let i = 0; i < 3; i++) {
      const offset = (t * 340 + i * (len / 3)) % len;
      const fy = v.y0 - offset;
      const w = halfW * (0.4 - 0.13 * i);
      ctx.beginPath();
      ctx.moveTo(v.x - w, fy);
      ctx.lineTo(v.x + w, fy);
      ctx.lineTo(v.x + w * 0.78, fy + 15);
      ctx.lineTo(v.x - w * 0.78, fy + 15);
      ctx.closePath();
      ctx.fill();
    }

    // 4) 核心光束（白亮热核）+ 超亮细芯
    ctx.globalAlpha = 0.92 * shimmer;
    ctx.fillStyle = '#eafcff';
    beamPath(halfW * 0.28, halfW * 0.14);
    ctx.fill();
    ctx.globalAlpha = 0.75 * shimmer;
    ctx.fillStyle = '#ffffff';
    beamPath(halfW * 0.1, halfW * 0.05);
    ctx.fill();

    // 5) 出光口辉光（光源处椭圆光晕）
    const muzzle = ctx.createRadialGradient(v.x, v.y0, 0, v.x, v.y0, halfW * 1.8);
    muzzle.addColorStop(0, 'rgba(230, 252, 255, 0.95)');
    muzzle.addColorStop(0.35, 'rgba(120, 222, 255, 0.45)');
    muzzle.addColorStop(1, 'rgba(120, 222, 255, 0)');
    ctx.globalAlpha = 0.85 * pulse;
    ctx.fillStyle = muzzle;
    ctx.beginPath();
    ctx.ellipse(v.x, v.y0, halfW * 1.8, halfW * 0.75, 0, 0, TAU);
    ctx.fill();

    // 6) 尖端命中脉冲（光束尽头的光点）
    const tip = ctx.createRadialGradient(v.x, v.y1, 0, v.x, v.y1, halfW * 1.3);
    tip.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    tip.addColorStop(0.4, 'rgba(140, 240, 255, 0.42)');
    tip.addColorStop(1, 'rgba(140, 240, 255, 0)');
    ctx.globalAlpha = 0.45 + 0.35 * Math.sin(t * 34);
    ctx.fillStyle = tip;
    ctx.beginPath();
    ctx.arc(v.x, v.y1, halfW * 1.3, 0, TAU);
    ctx.fill();

    ctx.restore();
  }

  function drawMirrors() {
    const p = state.player;
    if (!state || !p || p.core !== 'mirror' || !state.mirrors.length) return;
    const skin = getSelectedSkin();
    ctx.save();
    for (const m of state.mirrors) {
      ctx.save();
      ctx.translate(m.x, m.y);
      ctx.globalAlpha = 0.55;
      ctx.drawImage(ensurePlayerSkinSprite(skin.id), -PLAYER_SPRITE_CENTER_X, -PLAYER_SPRITE_CENTER_Y);
      ctx.restore();
      ctx.globalAlpha = 0.3 + 0.12 * Math.sin(state.elapsed * 6 + m.side);
      ctx.strokeStyle = skin.accent;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(m.x, m.y, 30, 0, TAU);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawDrones() {
    if (!state.drones.length) return;
    const skin = getSelectedSkin();
    const sprite = ensureDroneSprite(skin.id);
    for (let i = 0; i < state.drones.length; i++) {
      const drone = state.drones[i];
      const pulse = 0.65 + Math.sin(state.elapsed * 7 + i * 1.7) * 0.18;
      ctx.save();
      ctx.translate(drone.x, drone.y);
      ctx.rotate(drone.tilt);
      ctx.globalAlpha = 0.38;
      ctx.strokeStyle = skin.accent;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(0, 0, 19 + pulse * 2, 0, TAU);
      ctx.stroke();
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = skin.flame;
      ctx.beginPath();
      ctx.moveTo(-3.5, 11);
      ctx.lineTo(0, 19 + pulse * 4);
      ctx.lineTo(3.5, 11);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.drawImage(sprite, -22, -21);
      ctx.restore();
    }
  }

  function drawOrbitals() {
    if (!state.orbitals.length) return;
    ctx.save();
    for (const o of state.orbitals) {
      const pulse = 1 + Math.sin(state.elapsed * 14 + o.angle) * 0.08;
      ctx.save();
      ctx.translate(o.x, o.y);
      ctx.rotate(o.angle);
      ctx.shadowColor = '#8be9ff';
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#8be9ff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-16 * pulse, 0);
      ctx.lineTo(16 * pulse, 0);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 3.2, 0, TAU);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  function drawTimeRift() {
    const p = state.player;
    if (!p.gold || !p.gold.timeRift || p.timeRiftActive <= 0) return;
    ctx.save();
    ctx.globalAlpha = 0.07 + 0.03 * Math.sin(state.elapsed * 10);
    ctx.fillStyle = '#b28cff';
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = '#b28cff';
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      const y = ((state.elapsed * 40 + i * 140) % (H + 80)) - 40;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawPlayerFlame(skin, p) {
    const flameLen = 30 + Math.sin(state.elapsed * 26) * 6 + (p.ultRate > 0 ? 12 : 0);
    const engineSpread = skin.type === 'wing' ? 7 : skin.type === 'ghost' ? 5 : 0;
    const engines = engineSpread ? [-engineSpread, engineSpread] : [0];
    for (const offset of engines) {
      const width = engines.length > 1 ? 4.5 : 7;
      const gradient = ctx.createLinearGradient(0, 16, 0, flameLen);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.35, skin.flameCore);
      gradient.addColorStop(1, skin.flame);

      ctx.globalAlpha = 0.45;
      ctx.fillStyle = skin.flame;
      ctx.beginPath();
      ctx.moveTo(offset - width * 1.5, 16);
      ctx.quadraticCurveTo(offset - width * 0.7, 24, offset, flameLen);
      ctx.quadraticCurveTo(offset + width * 0.7, 24, offset + width * 1.5, 16);
      ctx.closePath();
      ctx.fill();

      ctx.globalAlpha = 1;
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(offset - width, 16);
      ctx.quadraticCurveTo(offset - width * 0.45, 24, offset, flameLen * 0.92);
      ctx.quadraticCurveTo(offset + width * 0.45, 24, offset + width, 16);
      ctx.closePath();
      ctx.fill();

      ctx.globalAlpha = 0.95;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(offset - width * 0.36, 18);
      ctx.quadraticCurveTo(offset, 22, offset, flameLen * 0.5);
      ctx.quadraticCurveTo(offset, 22, offset + width * 0.36, 18);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function drawPlayer() {
    const p = state.player;
    if (state.over) return;
    if (p.invuln > 0 && p.ultShield <= 0 && Math.floor(state.elapsed * 16) % 2 === 0) return;

    const skin = getSelectedSkin();
    const overloadScale = p.overloadTimer > 0 ? 1.35 : 1;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.tilt);
    ctx.scale(overloadScale, overloadScale);
    ctx.save();
    ctx.scale(PLAYER_MODEL_SCALE, PLAYER_MODEL_SCALE);
    drawPlayerFlame(skin, p);
    ctx.restore();
    ctx.drawImage(
      ensurePlayerSkinSprite(skin.id),
      -PLAYER_SPRITE_CENTER_X,
      -PLAYER_SPRITE_CENTER_Y,
    );
    ctx.restore();

    // 超载核心：机体放大 + 橙色脉冲光环 + 底部橙色光晕
    if (p.overloadTimer > 0) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const glow = ctx.createRadialGradient(p.x, p.y, 10, p.x, p.y, 74);
      glow.addColorStop(0, 'rgba(255, 158, 69, 0.5)');
      glow.addColorStop(1, 'rgba(255, 158, 69, 0)');
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 74, 0, TAU);
      ctx.fill();
      ctx.restore();
      ctx.save();
      const pulse = 0.5 + 0.35 * Math.sin(state.elapsed * 20);
      ctx.globalAlpha = pulse;
      ctx.strokeStyle = '#ff9e45';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 52 + Math.sin(state.elapsed * 14) * 4, 0, TAU);
      ctx.stroke();
      ctx.globalAlpha = pulse * 0.5;
      ctx.lineWidth = 8;
      ctx.stroke();
      ctx.restore();
    }

    if (SHOW_HITBOX) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, TAU);
      ctx.strokeStyle = 'rgba(0, 255, 140, 0.9)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    if (p.ultShield > 0) {
      ctx.save();
      const pulse = 0.42 + 0.24 * Math.sin(state.elapsed * 16);
      ctx.globalAlpha = pulse;
      ctx.strokeStyle = skin.accent;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 41 + Math.sin(state.elapsed * 12) * 3, 0, TAU);
      ctx.stroke();
      ctx.restore();
    }

    // 核心质变：机体环绕对应色光环（电弧=青、爆裂=橙、弹射=蓝），一眼可读当前形态
    if (p.core) {
      const coreColors = { arc: '#bff6ff', blast: '#ffb35c', ricochet: '#7fe7ff' };
      ctx.save();
      ctx.globalAlpha = 0.55 + 0.25 * Math.sin(state.elapsed * 6);
      ctx.strokeStyle = coreColors[p.core] || '#ffd166';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([10, 8]);
      ctx.lineDashOffset = -state.elapsed * 40;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 46, 0, TAU);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }
  }

  function drawMuzzleFlashes() {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    for (const flash of state.muzzleFlashes) {
      const t = flash.life / flash.maxLife;
      const len = (flash.size + 9) * (0.45 + t * 0.75);
      const px = Math.cos(flash.angle);
      const py = Math.sin(flash.angle);
      const ox = -py;
      const oy = px;

      ctx.globalAlpha = t;
      ctx.shadowColor = flash.color;
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(flash.x - px * len * 0.3, flash.y - py * len * 0.3);
      ctx.lineTo(flash.x + px * len, flash.y + py * len);
      ctx.stroke();

      ctx.strokeStyle = flash.color;
      ctx.lineWidth = 1.7;
      ctx.beginPath();
      ctx.moveTo(flash.x - ox * flash.size * 0.62, flash.y - oy * flash.size * 0.62);
      ctx.lineTo(flash.x + ox * flash.size * 0.62, flash.y + oy * flash.size * 0.62);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(flash.x, flash.y, 2.4 + (1 - t) * 2.2, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawParticles() {
    ctx.save();
    let activeColor = '';
    let activeAlpha = -1;
    let commonColor = '';
    let commonCount = 0;
    const counts = Object.create(null);
    for (const particle of state.particles) {
      const next = (counts[particle.color] || 0) + 1;
      counts[particle.color] = next;
      if (next > commonCount) {
        commonCount = next;
        commonColor = particle.color;
      }
    }
    for (const particle of state.particles) {
      if (particle.color === commonColor) continue;
      const alpha = Math.max(0, particle.life / particle.maxLife);
      if (particle.color !== activeColor) {
        activeColor = particle.color;
        ctx.fillStyle = activeColor;
      }
      if (alpha !== activeAlpha) {
        activeAlpha = alpha;
        ctx.globalAlpha = alpha;
      }
      ctx.fillRect(
        particle.x - particle.size,
        particle.y - particle.size,
        particle.size * 2,
        particle.size * 2
      );
    }
    if (commonColor) {
      ctx.fillStyle = commonColor;
      for (const particle of state.particles) {
        if (particle.color !== commonColor) continue;
        const alpha = Math.max(0, particle.life / particle.maxLife);
        if (alpha !== activeAlpha) {
          activeAlpha = alpha;
          ctx.globalAlpha = alpha;
        }
        ctx.fillRect(
          particle.x - particle.size,
          particle.y - particle.size,
          particle.size * 2,
          particle.size * 2
        );
      }
    }
    ctx.restore();
  }

  function drawTexts() {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    for (const text of state.texts) {
      const alpha = Math.max(0, text.life / text.maxLife);
      // 光晕：数字背后的柔和圆盘（纯绘制，不消费随机数）
      if (text.halo) {
        ctx.globalAlpha = alpha * 0.38;
        ctx.fillStyle = text.halo;
        ctx.beginPath();
        ctx.arc(text.x, text.y, (text.size || 14) * 0.98, 0, TAU);
        ctx.fill();
        ctx.globalAlpha = alpha;
      }
      ctx.fillStyle = text.color;
      if (text.shadow) {
        ctx.shadowColor = text.shadow;
        ctx.shadowBlur = 0;
      } else {
        ctx.shadowBlur = 0;
      }
      ctx.font = `${text.weight || 700} ${text.size || 14}px "Segoe UI", sans-serif`;
      if (text.outline) {
        ctx.lineWidth = Math.max(3, Math.round((text.size || 14) / 4));
        ctx.strokeStyle = 'rgba(3, 8, 18, 0.92)';
        ctx.strokeText(text.text, text.x, text.y);
      }
      ctx.fillText(text.text, text.x, text.y);
    }
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  function drawBanner() {
    if (!state.waveBanner) return;
    const banner = state.waveBanner;
    const alpha = Math.min(1, banner.t);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#54d7ff';
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#eafcff';
    ctx.font = '700 58px "Segoe UI", sans-serif';
    ctx.fillText(banner.text, W / 2, H / 2 - 12);
    ctx.fillStyle = '#ffc857';
    ctx.font = '600 18px "Segoe UI", sans-serif';
    ctx.fillText('击落敌机，获取增益', W / 2, H / 2 + 30);
    ctx.restore();
  }

  function render() {
    if (!state) return;
    ctx.save();
    if (state.shake > 0) {
      ctx.translate((Math.random() * 2 - 1) * state.shake, (Math.random() * 2 - 1) * state.shake);
    }
    drawBackground();
    drawTimeRift();
    drawPlayerBeam();
    drawPlayerBullets();
    drawEnemies();
    drawSpecialDrops();
    drawEnemyBullets();
    drawDrones();
    drawMirrors();
    drawOrbitals();
    drawArcs();
    drawXpOrbs();
    drawPlayer();
    drawMuzzleFlashes();
    drawParticles();
    drawTexts();
    drawUltFlash();
    ctx.restore();
    drawBanner();
  }

  function drawUltFlash() {
    const flash = state.ultFlash;
    if (!flash) return;
    const progress = clamp(flash.t / flash.duration, 0, 1);
    const fade = 1 - progress;
    const radius = 260 + progress * Math.max(W, H) * 1.6;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = fade * (flash.auto ? 0.22 : 0.16);
    const edgeGlow = ctx.createRadialGradient(flash.x, flash.y, Math.max(80, radius * 0.24), flash.x, flash.y, radius);
    edgeGlow.addColorStop(0, 'rgba(255, 200, 87, 0)');
    edgeGlow.addColorStop(0.72, 'rgba(255, 200, 87, 0.2)');
    edgeGlow.addColorStop(1, 'rgba(255, 220, 130, 0.9)');
    ctx.fillStyle = edgeGlow;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = fade * 0.85;
    ctx.strokeStyle = '#ffd166';
    ctx.lineWidth = 3 + fade * 3;
    ctx.beginPath();
    ctx.arc(flash.x, flash.y, radius * 0.22 + progress * radius * 0.55, 0, TAU);
    ctx.stroke();
    ctx.restore();
  }

  function frame(now) {
    requestAnimationFrame(frame);
    const rawDt = Math.max(0, (now - lastTime) / 1000);
    lastTime = now;
    if (now - lastFrameTime < FRAME_INTERVAL_MS - 0.5) return;
    const frameDt = Math.max(0, (now - lastFrameTime) / 1000);
    // BOSS 击破慢动作：短暂把游戏时间缩放（真实时间流逝不变）
    const dt = Math.min(frameDt * (state && state.slowmoTimer > 0 ? state.slowmoScale : 1), 0.05);
    if (state && state.slowmoTimer > 0) state.slowmoTimer = Math.max(0, state.slowmoTimer - frameDt);
    lastFrameTime = now;
    fpsFrames++;
    fpsTimer += frameDt;
    if (fpsTimer >= 0.5) {
      displayFps = Math.round(fpsFrames / fpsTimer);
      fpsFrames = 0;
      fpsTimer = 0;
      if (els.fpsValue) els.fpsValue.textContent = displayFps;
    }
    if (state && !state.over && !paused && !state.levelUpOpen && !state.firstSeenOpen) {
      update(dt);
    } else if (state && state.shake > 0) {
      // 弹窗/暂停/结算期间世界冻结，但震屏继续衰减——避免升级/首次遭遇弹窗打开时画面持续抖动
      state.shake = Math.max(0, state.shake - frameDt * 18);
    }
    render();
    if (state && state.hudDirty && state.hudTimer >= HUD_UPDATE_INTERVAL) {
      updateHud();
      state.hudDirty = false;
      state.hudTimer = 0;
    }
  }

  function ensureAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
  }

  function resumeAudio() {
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
  }

  function tone(ctx, delay, freq, duration, volume, type = 'square') {
    const start = ctx.currentTime + delay;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.03);
  }

  function playSound(name) {
    if (!soundOn) return;
    try {
      const ctx = ensureAudio();
      resumeAudio();
      const notes = SOUNDS[name];
      if (!notes) return;
      for (const [delay, freq, duration, volume, type] of notes) {
        tone(ctx, delay, freq, duration, volume, type);
      }
    } catch (_) {
      // Audio is optional; the game still runs without it.
    }
  }

  function toggleSound() {
    soundOn = !soundOn;
    els.soundIcon.setAttribute('href', soundOn ? '#i-volume' : '#i-muted');
    els.soundBtn.classList.toggle('active', soundOn);
    if (soundOn) {
      try {
        const ctx = ensureAudio();
        ctx.resume().catch(() => {});
        playSound('level');
      } catch (_) {
        // Ignore audio init failures.
      }
    }
  }

  function togglePause() {
    if (!state || state.over || state.levelUpOpen || state.checkpointOpen || state.bossChoiceOpen || state.firstSeenOpen) return;
    if (statsPanelOpen) {
      toggleStatsPanel();
      return;
    }
    paused = !paused;
    if (paused) {
      hideRunDecisionButtons();
      els.overlayTitle.textContent = '暂停';
      els.overlayStats.replaceChildren();
      els.resumeBtn.classList.remove('hidden');
      els.restartBtn.classList.remove('hidden');
      els.menuBtn.classList.add('hidden');
      els.overlay.classList.remove('hidden');
    } else {
      els.overlay.classList.add('hidden');
    }
    updatePauseIcon();
  }

  let confirmPending = null;
  let confirmTimer = null;

  function resetConfirmButton() {
    if (!confirmPending) return;
    const btn = confirmPending.button;
    btn.innerHTML = confirmPending.originalHTML;
    btn.classList.remove('confirming');
    confirmPending = null;
    if (confirmTimer) {
      clearTimeout(confirmTimer);
      confirmTimer = null;
    }
  }

  function makeConfirmable(button, action, confirmText = '再次点击确认') {
    button.addEventListener('click', () => {
      if (confirmPending) {
        if (confirmPending.button !== button) {
          resetConfirmButton();
          return;
        }
        clearTimeout(confirmTimer);
        confirmTimer = null;
        const target = confirmPending;
        confirmPending = null;
        button.classList.remove('confirming');
        button.innerHTML = target.originalHTML;
        action();
        return;
      }
      confirmPending = { button, originalHTML: button.innerHTML };
      button.classList.add('confirming');
      button.innerHTML = `<span>${confirmText}</span>`;
      confirmTimer = setTimeout(resetConfirmButton, 2800);
    });
  }

  function updatePauseIcon() {
    els.pauseIcon.setAttribute('href', paused ? '#i-play' : '#i-pause');
    els.pauseBtn.classList.toggle('active', paused);
  }

  function canvasPoint(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: clamp((event.clientX - rect.left) * W / rect.width, 0, W),
      y: clamp((event.clientY - rect.top) * H / rect.height, 0, H),
    };
  }

  document.addEventListener('keydown', (event) => {
    if (event.code === 'KeyP' || event.code === 'Escape') {
      togglePause();
      return;
    }
    // 数字键 1/2/3：选择升级卡 / BOSS 残骸 / 无尽契约
    if (event.code === 'Digit1' || event.code === 'Digit2' || event.code === 'Digit3') {
      const index = Number(event.code.slice(-1)) - 1;
      const pickPanel = () => {
        if (state && state.levelUpOpen && els.levelUpOverlay && !els.levelUpOverlay.classList.contains('hidden')) {
          return els.upgradeChoices.children;
        }
        if (state && state.bossChoiceOpen && els.bossRewardOverlay && !els.bossRewardOverlay.classList.contains('hidden')) {
          return els.bossRewardChoices.children;
        }
        if (state && state.checkpointOpen && els.contractList && !els.contractList.classList.contains('hidden')) {
          return els.contractList.children;
        }
        return null;
      };
      const cards = pickPanel();
      if (cards && cards[index]) {
        event.preventDefault();
        cards[index].click();
        return;
      }
    }
    if (event.code === 'KeyQ') {
      event.preventDefault();
      useDash();
      return;
    }
    if (event.code === 'KeyF') {
      event.preventDefault();
      useBomb();
      return;
    }
    if (event.code === 'KeyE') {
      event.preventDefault();
      useUltimate();
      return;
    }
    keys[event.code] = true;
    if (event.code.startsWith('Arrow')) event.preventDefault();
  });

  document.addEventListener('keyup', (event) => {
    keys[event.code] = false;
  });

  document.querySelectorAll('.pad-btn').forEach((button) => {
    const dir = button.dataset.dir;
    const down = (event) => {
      button.setPointerCapture(event.pointerId);
      touchDirs[dir] = true;
      button.classList.add('active');
      resumeAudio();
    };
    const up = () => {
      touchDirs[dir] = false;
      button.classList.remove('active');
    };
    button.addEventListener('pointerdown', down);
    button.addEventListener('pointerup', up);
    button.addEventListener('pointercancel', up);
  });

  canvas.addEventListener('pointerdown', (event) => {
    pointerActive = true;
    const point = canvasPoint(event);
    pointerX = point.x;
    pointerY = point.y;
    resumeAudio();
    event.preventDefault();
  });
  canvas.addEventListener('pointermove', (event) => {
    if (!pointerActive) return;
    const point = canvasPoint(event);
    pointerX = point.x;
    pointerY = point.y;
  });
  canvas.addEventListener('pointerup', () => {
    pointerActive = false;
  });
  canvas.addEventListener('pointercancel', () => {
    pointerActive = false;
  });

  window.addEventListener('resize', syncCanvasSize);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && state && !state.over && !paused && !state.levelUpOpen && !state.checkpointOpen) {
      togglePause();
    }
  });
  window.addEventListener('blur', () => {
    if (state && !state.over && !paused && !state.levelUpOpen && !state.checkpointOpen) {
      togglePause();
    }
  });
  els.bombBtn.addEventListener('click', useBomb);
  els.ultBtn.addEventListener('click', useUltimate);
  els.dashBtn.addEventListener('click', useDash);
  els.soundBtn.addEventListener('click', toggleSound);
  // 音效按钮初始状态与 soundOn 同步（默认开）
  els.soundBtn.classList.toggle('active', soundOn);
  els.soundIcon.setAttribute('href', soundOn ? '#i-volume' : '#i-muted');
  els.pauseBtn.addEventListener('click', togglePause);
  const statsBtn = document.getElementById('statsBtn');
  const statsPanelClose = document.getElementById('statsPanelClose');
  if (statsBtn) statsBtn.addEventListener('click', toggleStatsPanel);
  if (statsPanelClose) statsPanelClose.addEventListener('click', toggleStatsPanel);
  document.querySelectorAll('[data-stats-close]').forEach((el) => el.addEventListener('click', toggleStatsPanel));
  makeConfirmable(els.settleBtn, settleCurrentRun);
  els.resumeBtn.addEventListener('click', () => {
    if (!state || state.checkpointOpen) return;
    paused = false;
    els.overlay.classList.add('hidden');
    updatePauseIcon();
  });
  els.victorySettleBtn.addEventListener('click', () => {
    endGame({ returnToMenu: true, destroyPlayer: false });
  });
  els.continueEndlessBtn.addEventListener('click', continueEndlessRun);
  makeConfirmable(els.restartBtn, startGame);
  els.startBtn.addEventListener('click', () => {
    resumeAudio();
    openBattleSetup();
  });
  els.dailyBtn.addEventListener('click', () => {
    resumeAudio();
    startDailyChallenge();
  });
  els.battleSetupBackBtn.addEventListener('click', openMainMenu);
  els.battleSetupSkipBtn.addEventListener('click', skipBattleSetup);
  els.battleSetupStartBtn.addEventListener('click', startGame);
  // HUD 收起/展开（顶部中央小按钮，手动隐藏左右面板让出视野）
  els.hudCollapseBtn.addEventListener('click', () => {
    hudCollapsed = !hudCollapsed;
    els.gameHud.classList.toggle('collapsed', hudCollapsed);
    els.hudCollapseBtn.setAttribute('aria-pressed', String(hudCollapsed));
    els.hudCollapseBtn.title = hudCollapsed ? '展开 HUD' : '收起 HUD';
  });
  // 一键满词缀 / 一键取消：全部词缀拉到 Lv3，再点全部重置
  els.affixAllBtn.addEventListener('click', () => {
    if (allAffixesMaxed()) {
      for (const def of DIFFICULTY_AFFIXES) selectedAffixLevels[def.id] = 0;
    } else {
      for (const def of DIFFICULTY_AFFIXES) selectedAffixLevels[def.id] = MAX_AFFIX_LEVEL;
    }
    renderAffixMenu();
    playSound('level');
  });
  els.menuBtn.addEventListener('click', openMainMenu);
  els.talentTreeBtn.addEventListener('click', openTalentTree);
  els.talentTreeCloseBtn.addEventListener('click', closeTalentTree);
  els.encyclopediaBtn.addEventListener('click', openEncyclopedia);
  els.encyclopediaCloseBtn.addEventListener('click', closeEncyclopedia);
  els.tutorialBtn.addEventListener('click', openTutorial);
  els.tutorialCloseBtn.addEventListener('click', closeTutorial);
  els.encyclopediaSearch.addEventListener('input', () => {
    encyclopediaQuery = els.encyclopediaSearch.value.trim();
    renderEncyclopedia();
  });
  els.firstSeenContinue.addEventListener('click', closeFirstSeen);
  makeConfirmable(els.talentTreeResetBtn, resetTalentTree, '再次点击确认重置');

  if (new URLSearchParams(window.location.search).has('debug')) {
    window.__thunderDebug = {
      startGame,
      updateHud,
      update,
      spawnEnemy,
      fireEnemy,
      firePlayer,
      rollBulletCrit,
      useUltimate,
      useDash,
      useBomb,
      damagePlayer,
      endGame,
      settleCurrentRun,
      showRunCheckpoint,
      continueEndlessRun,
      calculateRunRewards,
      formatRunTime,
      endlessHealingMultiplier,
      shouldShowRunCheckpoint,
      rollBuffRarity,
      pickUpgradeChoices,
      applyUpgrade,
      objectiveWavesForBlock,
      upgradeAtBaseCap,
      upgradeCanBreak,
      upgradeAvailable,
      getUpgrade(id) {
        return UPGRADES.find((upgrade) => upgrade.id === id)
          || ENDLESS_UPGRADES.find((upgrade) => upgrade.id === id)
          || GOLD_MODULES.find((upgrade) => upgrade.id === id)
          || CORE_TRANSFORMS.find((upgrade) => upgrade.id === id);
      },
      setAffix(id, level = 1) {
        for (const def of DIFFICULTY_AFFIXES) selectedAffixLevels[def.id] = 0;
        const def = DIFFICULTY_AFFIXES.find((affix) => affix.id === id);
        if (def) selectedAffixLevels[def.id] = clamp(Math.floor(Number(level) || 1), 1, MAX_AFFIX_LEVEL);
        renderAffixMenu();
        return Boolean(def);
      },
      setAffixLevel(id, level) {
        const def = DIFFICULTY_AFFIXES.find((affix) => affix.id === id);
        if (!def) return false;
        selectedAffixLevels[def.id] = clamp(Math.floor(Number(level) || 0), 0, MAX_AFFIX_LEVEL);
        renderAffixMenu();
        return true;
      },
      clearAffixes() {
        for (const def of DIFFICULTY_AFFIXES) selectedAffixLevels[def.id] = 0;
        renderAffixMenu();
      },
      getAffixConfig: buildAffixConfig,
      chooseBossReward(index = 0) {
        if (!state || !state.bossChoiceOpen) return false;
        const choices = els.bossRewardChoices.children;
        // 全量自选列表可能存在置灰卡（已达上限）：自动落到第一个可选卡
        const target = [...choices].find((el, i) => i >= index && !el.disabled) || choices[index];
        if (!target) return false;
        target.click();
        return true;
      },
      chooseContract(index = 0) {
        if (!state || !state.checkpointOpen) return false;
        const buttons = els.contractList.children;
        if (!buttons[index]) return false;
        buttons[index].click();
        return true;
      },
      applyUpgradeById(id) {
        const def = UPGRADES.find((upgrade) => upgrade.id === id)
          || ENDLESS_UPGRADES.find((upgrade) => upgrade.id === id)
          || GOLD_MODULES.find((upgrade) => upgrade.id === id)
          || CORE_TRANSFORMS.find((upgrade) => upgrade.id === id);
        if (!def || !state) return false;
        if (CORE_TRANSFORMS.includes(def)) {
          if (state.player.core) return false;
          def.apply(state.player, 1, null);
          if (!achievementStats.cores.includes(def.id)) achievementStats.cores.push(def.id);
          saveAchievements();
          unlockAchievement('coreFirst');
          checkAchievements();
          markHud();
          return true;
        }
        if (GOLD_MODULES.includes(def) && state.player.gold[def.id]) return false;
        state.player.upgrades[def.id] = (state.player.upgrades[def.id] || 0) + 1;
        def.apply(state.player, 1, null);
        markHud();
        return true;
      },
      chooseUpgradeById(id) {
        if (!state || state.pendingLevels <= 0) return false;
        const def = UPGRADES.find((upgrade) => upgrade.id === id)
          || ENDLESS_UPGRADES.find((upgrade) => upgrade.id === id)
          || GOLD_MODULES.find((upgrade) => upgrade.id === id)
          || CORE_TRANSFORMS.find((upgrade) => upgrade.id === id);
        if (!def) return false;
        if (CORE_TRANSFORMS.includes(def)) return applyCoreTransform(def);
        if (GOLD_MODULES.includes(def)
          ? state.player.gold[def.id]
          : (state.player.upgrades[def.id] || 0) >= def.max) return false;
        applyUpgrade({ upgrade: def, rarity: null });
        return true;
      },
      chooseCoreTransform(index = 0) {
        if (!state || state.player.core) return false;
        const card = els.upgradeChoices.children[index];
        if (!card) return false;
        card.click();
        return true;
      },
      skipCoreTransform() {
        if (!state) return false;
        state.coreTransformPending = false;
        state.coreTransformOffered = true;
        state.levelUpOpen = false;
        els.levelUpOverlay.classList.add('hidden');
        return true;
      },
      availableUpgradeIds() {
        if (!state) return [];
        return [...UPGRADES, ...ENDLESS_UPGRADES, ...GOLD_MODULES, ...CORE_TRANSFORMS]
          .filter((upgrade) => CORE_TRANSFORMS.includes(upgrade)
            ? !state.player.core
            : GOLD_MODULES.includes(upgrade)
              ? !state.player.gold[upgrade.id]
              : upgradeAvailable(state.player, upgrade, null))
          .map((upgrade) => upgrade.id);
      },
      setPointer(x, y, active = true) {
        pointerX = clamp(Number(x) || W / 2, 0, W);
        pointerY = clamp(Number(y) || H * 0.8, 0, H);
        pointerActive = Boolean(active);
      },
      // 只读常量快照：供测试脚本对齐游戏内真实数值，避免测试内复制副本过期（如无人机共享倍率）
      constants() {
        return {
          MAX_DRONES,
          DRONE_DAMAGE_SHARE,
          ULT_MAX_ENERGY,
          MAX_ENEMY_BULLETS,
          MAX_PARTICLES,
          MAX_TEXTS,
          BOSS_HP_MULTIPLIER,
          BOSS_TOUGHNESS,
          DASH_COOLDOWN,
          GOLD_MODULE_CHANCE,
          COUNTER_REFLECT_SPEED,
          COUNTER_REFLECT_SPLASH,
          ABYSS_START_WAVE,
        };
      },
      setSound(enabled) {
        soundOn = Boolean(enabled);
      },
      openEncyclopedia,
      closeEncyclopedia,
      markAllEnemiesSeen,
      clearEnemySeen,
      dismissFirstSeen: closeFirstSeen,
      setFirstSeenEnabled(enabled) {
        firstSeenEnabled = Boolean(enabled);
      },
      getEncyclopediaEntries: encyclopediaEntries,
      log: logGame,
      toggleLogOverlay,
      getLogs() { return debugLogs.slice(); },
      get state() { return state; },
      get meta() { return meta; },
      get skins() { return PLAYER_SKINS; },
      get fps() { return displayFps; },
      get paused() { return paused; },
      set paused(value) { paused = value; },
    };
  }

  syncCanvasSize();
  openMainMenu();
  preloadAllSpriteImages();
  requestAnimationFrame(frame);
})();
