import React, { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { LineChart } from 'react-native-chart-kit';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
  Animated,
  Modal,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';

interface HunterStats {
  rank: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  strength: number;
  agility: number;
  endurance: number;
  dungeonKeys: number;
  previousRank: string | null;
  shadowArmy: any[]; // Define proper type if known
  unlockedShadows: boolean;
}

interface Quest {
  id: number;
  name: string;
  type: string;
  xp: number;
  completed: boolean;
  target: number;
  reward?: any;
}

interface Shadow {
  id: number;
  name: string;
  rank: string;
  type: string;
  ability: string;
  image: string;
  unlocked: boolean;
  level: number;
  experience: number;
  loyalty: number;
  specialAbilities: string[];
  description?: string; // Make description optional
}

interface Dungeon {
  id: number;
  name: string;
  level: string;
  rewards: string;
  timeLimit: string;
  description: string;
  image: string;
  type?: string; // Make type optional
  specialRewards?: any;
}

interface QuestRewards {
  dailyStreak: number;
  lastCompletedDate: string | null;
  inventory: any[];
}

const HunterDashboard = () => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 15000,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        })
      ]).start(() => animate());
    };

    animate();
  }, []);

  const [showRankUpModal, setShowRankUpModal] = useState(false);
  const [celebrationParticles] = useState(new Animated.Value(0));
  const [rankUpScale] = useState(new Animated.Value(0));
  const [showConfetti, setShowConfetti] = useState(false);

  const [hunterStats, setHunterStats] = useState<HunterStats>({
    rank: 'E',
    level: 1,
    xp: 240,
    xpToNextLevel: 500,
    strength: 15,
    agility: 12,
    endurance: 8,
    dungeonKeys: 3,
    previousRank: null,
    shadowArmy: [],
    unlockedShadows: false,
  });
  const [shadows, setShadows] = useState<Shadow[]>([
    {
      id: 1,
      name: "Iron",
      rank: "D",
      type: "Tank",
      ability: "Defense Boost",
      image: "https://api.a0.dev/assets/image?text=armored shadow soldier with blue aura and mystical energy, solo leveling style&aspect=1:1",
      unlocked: false,
      description: "A sturdy shadow soldier specializing in defense.",
      level: 1,
      experience: 0,
      loyalty: 50,
      specialAbilities: ["Shield Wall", "Iron Defense"]
    },
    {
      id: 2,
      name: "Tank",
      rank: "C",
      type: "Heavy",
      ability: "Strength Boost",
      level: 1,
      experience: 0,
      loyalty: 0,
      specialAbilities: {
        "Ground Breaker": { unlocked: false, requirement: 5 },
        "Seismic Slam": { unlocked: false, requirement: 10 },
        "Titan's Rage": { unlocked: false, requirement: 15 }
      },
      image: "https://api.a0.dev/assets/image?text=massive shadow soldier with blue crystals and powerful aura, solo leveling style&aspect=1:1",
      unlocked: false,
      description: "A powerful shadow soldier with immense strength."
    },    {
      id: 3,
      name: "Beru",
      rank: "B",
      type: "Assassin",
      ability: "Agility Boost",
      level: 1,
      experience: 0,
      loyalty: 0,
      specialAbilities: {
        "Shadow Step": { unlocked: false, requirement: 5 },
        "Poison Strike": { unlocked: false, requirement: 10 },
        "Death Mark": { unlocked: false, requirement: 15 }
      },
      image: "https://api.a0.dev/assets/image?text=sleek shadow assassin with blue energy and swift movement, solo leveling style&aspect=1:1",
      unlocked: false,
      description: "An agile shadow soldier with incredible speed."
    },    {
      id: 4,
      name: "Igris",
      rank: "A",
      type: "Knight",
      ability: "All Stats Boost",
      level: 1,
      experience: 0,
      loyalty: 0,
      specialAbilities: {
        "Shadow Lance": { unlocked: false, requirement: 5 },
        "Royal Guard": { unlocked: false, requirement: 10 },
        "Commander's Presence": { unlocked: false, requirement: 15 }
      },
      image: "https://api.a0.dev/assets/image?text=noble shadow knight with royal blue armor and commanding presence, solo leveling style&aspect=1:1",
      unlocked: false,
      description: "The loyal shadow knight, commander of the shadow army."
    },    {
      id: 5,
      name: "Tusk",
      rank: "S",
      type: "Demon",
      ability: "Ultimate Power",
      level: 1,
      experience: 0,
      loyalty: 0,
      specialAbilities: {
        "Demon's Rage": { unlocked: false, requirement: 5 },
        "Hellfire Breath": { unlocked: false, requirement: 10 },
        "Apocalypse Form": { unlocked: false, requirement: 15 }
      },
      image: "https://api.a0.dev/assets/image?text=demonic shadow warrior with massive tusks and overwhelming blue energy, solo leveling style&aspect=1:1",
      unlocked: false,
      description: "The mighty demon shadow, ultimate power incarnate."
    },
    {
      id: 1,
      name: "Iron",
      rank: "D",
      type: "Tank",
      ability: "Defense Boost",
      image: "https://api.a0.dev/assets/image?text=armored shadow soldier with blue aura and mystical energy&aspect=1:1",
      unlocked: false
    },
    {
      id: 2,
      name: "Tank",
      rank: "C",
      type: "Heavy",
      ability: "Strength Boost",
      image: "https://api.a0.dev/assets/image?text=massive shadow soldier with blue crystals and powerful aura&aspect=1:1",
      unlocked: false
    },
    {
      id: 3,
      name: "Beru",
      rank: "B",
      type: "Assassin",
      ability: "Agility Boost",
      image: "https://api.a0.dev/assets/image?text=sleek shadow assassin with blue energy and swift movement&aspect=1:1",
      unlocked: false
    },
    {
      id: 4,
      name: "Igris",
      rank: "A",
      type: "Knight",
      ability: "All Stats Boost",
      image: "https://api.a0.dev/assets/image?text=noble shadow knight with royal blue armor and commanding presence&aspect=1:1",
      unlocked: false
    },
    {
      id: 5,
      name: "Tusk",
      rank: "S",
      type: "Demon",
      ability: "Ultimate Power",
      image: "https://api.a0.dev/assets/image?text=demonic shadow warrior with massive tusks and overwhelming blue energy&aspect=1:1",
      unlocked: false
    }
  ]);

  const [showShadowModal, setShowShadowModal] = useState(false);
  const [selectedShadow, setSelectedShadow] = useState<Shadow | null>(null);
  const [summoningAnimation] = useState(new Animated.Value(0));
  const [showDungeonModal, setShowDungeonModal] = useState(false);
  const [selectedDungeon, setSelectedDungeon] = useState<Dungeon | null>(null);
  const [dungeonAnimation] = useState(new Animated.Value(0));
  const [isSummoning, setIsSummoning] = useState(false);
  const [activeShadow, setActiveShadow] = useState<Shadow | null>(null);
  
  const summonShadow = (shadow: Shadow) => {
    if (!shadow.unlocked) {
      if ((shadow.name === 'Igris' && hunterStats.rank !== 'A') ||
          (shadow.name === 'Tusk' && hunterStats.rank !== 'S')) {
        alert(`You need to be rank ${shadow.name === 'Igris' ? 'A' : 'S'} to summon ${shadow.name}`);
        return;
      }
    }
    setIsSummoning(true);
    setSelectedShadow(shadow);
    setShowShadowModal(true);
    startSummoningAnimation();
    
    // Set as active shadow
    setActiveShadow(shadow);
    
    // Apply shadow's buff
    const buffStats = { ...hunterStats };
    switch(shadow.ability) {
      case 'Defense Boost':
        buffStats.endurance += 10;
        break;
      case 'Strength Boost':
        buffStats.strength += 15;
        break;
      case 'Agility Boost':
        buffStats.agility += 12;
        break;
      case 'All Stats Boost':
        buffStats.strength += 20;
        buffStats.agility += 20;
        buffStats.endurance += 20;
        break;
      case 'Ultimate Power':
        buffStats.strength += 50;
        buffStats.agility += 50;
        buffStats.endurance += 50;
        break;
    }
    setHunterStats(buffStats);
  };  const enterDungeon = (dungeon: Dungeon) => {
    if (hunterStats.dungeonKeys <= 0) {
      showSystemNotification('SYSTEM: Insufficient Dungeon Keys', 'warning');
      return;
    }

    if (getRankValue(hunterStats.rank) < getRankValue(dungeon.level)) {
      showSystemNotification(`SYSTEM: Required Rank ${dungeon.level} Not Met`, 'warning');
      return;
    }

    setSelectedDungeon(dungeon);
    setShowDungeonModal(true);

    // Enhanced dungeon entry sequence
    const isHighRank = dungeon.level === 'S' || dungeon.level === 'A';
    const particleCount = isHighRank ? 100 : 50;
    const gateParticles = Array(particleCount).fill(0).map(() => ({
      animation: new Animated.Value(0),
      scale: 0.5 + Math.random() * 1.5,
      angle: Math.random() * Math.PI * 2,
      distance: 150 + Math.random() * 250,
      delay: Math.random() * 1000,
      duration: 2000 + Math.random() * 1000,
      color: isHighRank ? '#ff4d4d' : '#4d9fff',
    }));

    showSystemNotification('SYSTEM: Initializing Dungeon Gate...', 'system');
    setTimeout(() => showSystemNotification(`SYSTEM: ${dungeon.level}-Rank Dungeon Detected`, 'system'), 800);
    setTimeout(() => showSystemNotification('SYSTEM: Gate Opening Sequence Started...', 'system'), 1600);
    
    if (isHighRank) {
      setTimeout(() => showSystemNotification('WARNING: High-Rank Dungeon Detected!', 'warning'), 2400);
      setTimeout(() => showSystemNotification('SYSTEM: Enhanced Safety Protocols Activated', 'system'), 3200);
    }

    Animated.parallel([
      // Gate opening animation
      Animated.sequence([
        Animated.spring(gateAnimation, {
          toValue: 1,
          tension: isHighRank ? 40 : 30,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.timing(gateAnimation, {
          toValue: 0.9,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // Particle effects
      ...gateParticles.map(particle =>
        Animated.sequence([
          Animated.delay(particle.delay),
          Animated.timing(particle.animation, {
            toValue: 1,
            duration: particle.duration,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start(() => {
      startDungeonChallenge(dungeon);
    });

    // Animation for dungeon entrance
    Animated.sequence([
      Animated.timing(dungeonAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(dungeonAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Start dungeon challenge
      startDungeonChallenge(dungeon);
    });
  };

  const getRankValue = (rank: string) => {
    const ranks = ['E', 'D', 'C', 'B', 'A', 'S'];
    return ranks.indexOf(rank);
  };

  const startDungeonChallenge = (dungeon: Dungeon) => {
    // Deduct key
    setHunterStats(prev => ({
      ...prev,
      dungeonKeys: prev.dungeonKeys - 1
    }));

    // Calculate success chance based on stats and active shadow
    let successChance = 0.5; // Base 50% chance

    // Add bonus from stats
    successChance += (hunterStats.strength + hunterStats.agility + hunterStats.endurance) / 300;

    // Add bonus from active shadow
    if (activeShadow) {
      switch(activeShadow.rank) {
        case 'S': successChance += 0.3; break;
        case 'A': successChance += 0.25; break;
        case 'B': successChance += 0.2; break;
        case 'C': successChance += 0.15; break;
        case 'D': successChance += 0.1; break;
      }
    }

    // Cap at 95% chance
    successChance = Math.min(successChance, 0.95);

    // Determine outcome
    const success = Math.random() < successChance;

    if (success) {
      // Calculate rewards
      const baseXP = parseInt(dungeon.rewards.split('-')[1]);
      const bonusXP = Math.floor(baseXP * (activeShadow ? 0.5 : 0)); // 50% bonus XP with active shadow
      const totalXP = baseXP + bonusXP;

      // Show success message
      alert(`Dungeon Cleared!\nGained ${totalXP} XP${activeShadow ? ` (${bonusXP} bonus from ${activeShadow.name})` : ''}`);

      // Add XP
      checkRankUp(totalXP);
    } else {
      // Failed dungeon
      alert('Dungeon Failed! Try improving your stats or summoning a stronger shadow soldier.');
    }

    setShowDungeonModal(false);
  };
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [progressData, setProgressData] = useState({
    strength: [15],
    agility: [12],
    endurance: [8],
    timestamps: [new Date().toLocaleDateString()],
  });

  const [sounds, setSounds] = useState({
    questComplete: null,
    rankUp: null,
  });  // Removed sound effects for now to ensure stability
  useEffect(() => {
    // Initial animation setup
    const animate = () => {
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 15000,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        })
      ]).start(() => animate());
    };

    animate();
  }, []);  const [rewardAnimation] = useState(new Animated.Value(0));
  const [rewardRotation] = useState(new Animated.Value(0));
  const [rewardScale] = useState(new Animated.Value(0));
  const [rewardGlow] = useState(new Animated.Value(0));
  const [showRewardBox, setShowRewardBox] = useState(false);
  const [currentReward, setCurrentReward] = useState(null);
  const [particleSystem] = useState(Array(20).fill(0).map(() => ({
    animation: new Animated.Value(0),
    startX: Math.random() * 100,
    startY: Math.random() * 100,
    scale: 0.5 + Math.random() * 1.5,
    angle: Math.random() * 360,
    speed: 0.5 + Math.random() * 1.5,
  })));
  const [showQuestComplete, setShowQuestComplete] = useState(false);
  const [questCompleteAnimation] = useState(new Animated.Value(0));
  const [particleAnimation] = useState(new Animated.Value(0));
  const [showLevelUpEffects, setShowLevelUpEffects] = useState(false);  const animateRewardBox = () => {
    // Reset animations
    rewardRotation.setValue(0);
    rewardScale.setValue(0);
    rewardGlow.setValue(0);
    particleSystem.forEach(particle => particle.animation.setValue(0));

    // Create animation sequence
    Animated.parallel([
      // Box appearance
      Animated.sequence([
        Animated.spring(rewardScale, {
          toValue: 1,
          tension: 50,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.timing(rewardRotation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      // Glow effect
      Animated.sequence([
        Animated.timing(rewardGlow, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(rewardGlow, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // Particle effects
      ...particleSystem.map(particle =>
        Animated.sequence([
          Animated.delay(Math.random() * 500),
          Animated.timing(particle.animation, {
            toValue: 1,
            duration: 1500 + Math.random() * 1000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start(() => {
      setTimeout(() => {
        Animated.timing(rewardScale, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          setShowRewardBox(false);
          rewardAnimation.setValue(0);
        });
      }, 3000);
    });
  };

  const generateReward = (rank: string) => {
    const rewards: Record<string, any> = {
      'D': {
        type: 'key',
        amount: 2,
        rarity: 'common',
        image: 'https://api.a0.dev/assets/image?text=mystical blue key with magical energy&aspect=1:1'
      },
      'C': {
        type: 'key',
        amount: 3,
        rarity: 'rare',
        image: 'https://api.a0.dev/assets/image?text=rare golden key with blue magical aura&aspect=1:1'
      },
      'B': {
        type: 'key',
        amount: 4,
        rarity: 'epic',
        image: 'https://api.a0.dev/assets/image?text=epic crystal key with intense blue energy&aspect=1:1'
      },
      'A': {
        type: 'key',
        amount: 5,
        rarity: 'legendary',
        image: 'https://api.a0.dev/assets/image?text=legendary royal key with divine blue light&aspect=1:1'
      },
      'S': {
        type: 'key',
        amount: 10,
        rarity: 'mythic',
        image: 'https://api.a0.dev/assets/image?text=mythical sovereign key with celestial blue power&aspect=1:1'
      }
    };

    return rewards[rank as keyof typeof rewards] || rewards['D'];
  };  const checkRankUp = async (newXP: number) => {
    const ranks = ['E', 'D', 'C', 'B', 'A', 'S'];
    const currentXP = hunterStats.xp + newXP;
    
    // Enhanced stat progression animations
    const animateStatIncrease = (statName: string, increase: number) => {
      const progressAnimation = new Animated.Value(0);
      const particles = Array(20).fill(0).map(() => ({
        animation: new Animated.Value(0),
        scale: 0.5 + Math.random() * 1.5,
        angle: Math.random() * Math.PI * 2,
        distance: 50 + Math.random() * 100,
        delay: Math.random() * 500,
      }));

      Animated.parallel([
        Animated.timing(progressAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        ...particles.map(particle =>
          Animated.sequence([
            Animated.delay(particle.delay),
            Animated.timing(particle.animation, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();

      return { progressAnimation, particles };
    };
    if (currentXP >= hunterStats.xpToNextLevel) {
      const currentRankIndex = ranks.indexOf(hunterStats.rank);
      if (currentRankIndex < ranks.length - 1) {
        const newRank = ranks[currentRankIndex + 1];
        const reward = generateReward(newRank);

        setCurrentReward(reward);
        setShowRewardBox(true);
        animateRewardBox();

        setHunterStats(prev => ({
          ...prev,
          previousRank: prev.rank,
          rank: newRank,
          xp: 0,
          xpToNextLevel: prev.xpToNextLevel * 1.5,
          level: prev.level + 1,
          strength: prev.strength + 5,
          agility: prev.agility + 3,
          endurance: prev.endurance + 4,
          dungeonKeys: prev.dungeonKeys + reward.amount,
          unlockedShadows: true
        }));

        // Update quests for new rank
        setDailyQuests(generateRankQuests(newRank));

        // Check for shadow soldier unlock
        const newShadow = shadows.find(s => s.rank === newRank);
        if (newShadow) {
          setShadows(prev =>
            prev.map(shadow =>
              shadow.id === newShadow.id
                ? { ...shadow, unlocked: true }
                : shadow
            )
          );
          setSelectedShadow(newShadow);
          setTimeout(() => {
            setShowShadowModal(true);
            startSummoningAnimation();
          }, 3000); // Show after rank up celebration
        }
        setShowRankUpModal(true);
        setShowConfetti(true);
        celebrateRankUp();
        playRankUpSound();

        // Update progress data
        setProgressData(prev => ({
          strength: [...prev.strength, hunterStats.strength + 5],
          agility: [...prev.agility, hunterStats.agility + 3],
          endurance: [...prev.endurance, hunterStats.endurance + 4],
          timestamps: [...prev.timestamps, new Date().toLocaleDateString()],
        }));
      }
    } else {
      setHunterStats(prev => ({
        ...prev,
        xp: currentXP,
      }));
    }
  };

  const celebrateRankUp = () => {
    Animated.sequence([
      Animated.spring(rankUpScale, {
        toValue: 1,
        tension: 50,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(celebrationParticles, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        setShowRankUpModal(false);
        setShowConfetti(false);
        rankUpScale.setValue(0);
        celebrationParticles.setValue(0);
      }, 3000);
    });
  };  const [specialEvents, setSpecialEvents] = useState({
    redGate: false,
    doubleDungeon: false,
    bossRush: false,
    monarchEvent: false
  });

  const [availableDungeons, setAvailableDungeons] = useState<Dungeon[]>([    {
      id: 1,
      name: "Beginner's Gate",
      level: "E",
      difficulty: "Easy",
      rewards: "100-200 XP",
      timeLimit: "20 min",
      type: "strength",
      description: "A perfect dungeon for new hunters. Focus on basic strength training.",
      image: "https://api.a0.dev/assets/image?text=mystical blue dungeon gate with magical energy&aspect=16:9",
      specialRewards: {
        items: ["Basic Healing Potion", "Training Manual"],
        chance: 0.3
      }
    },
    {
      id: 2,
      name: "Cardio Canyon",
      level: "D",
      difficulty: "Medium",
      rewards: "200-300 XP",
      timeLimit: "30 min",
      type: "cardio",
      description: "Test your endurance in this challenging cardio-focused dungeon.",
      image: "https://api.a0.dev/assets/image?text=mystical canyon with blue fog and magical runes&aspect=16:9"
    },
    {
      id: 3,
      name: "Shadow's Trial",
      level: "C",
      difficulty: "Hard",
      rewards: "300-500 XP",
      timeLimit: "45 min",
      type: "mixed",
      description: "A high-intensity dungeon combining strength and cardio.",
      image: "https://api.a0.dev/assets/image?text=dark mystical trial chamber with blue magical energy&aspect=16:9"
    },
  ]);  const generateRankQuests = (rank: string) => {
    const difficultyMultiplier: Record<string, number> = {
      E: 1,
      D: 1.2,
      C: 1.5,
      B: 2,
      A: 2.5,
      S: 3
    };

    const multiplier = difficultyMultiplier[rank] || 1;
    
    const generateQuestReward = (rank: keyof typeof difficultyMultiplier) => {
      const rewards = {
        E: [
          { type: 'potion', name: 'Minor Healing Potion', rarity: 'common', effect: 'Heal 20 HP' },
          { type: 'material', name: 'Shadow Essence', rarity: 'common', effect: 'Used for shadow soldier enhancement' }
        ],
        D: [
          { type: 'potion', name: 'Healing Potion', rarity: 'uncommon', effect: 'Heal 50 HP' },
          { type: 'material', name: 'Concentrated Shadow Essence', rarity: 'uncommon', effect: 'Used for shadow soldier enhancement' }
        ],
        C: [
          { type: 'potion', name: 'Greater Healing Potion', rarity: 'rare', effect: 'Heal 100 HP' },
          { type: 'material', name: 'Pure Shadow Essence', rarity: 'rare', effect: 'Used for shadow soldier enhancement' }
        ],
        B: [
          { type: 'potion', name: 'Superior Healing Potion', rarity: 'epic', effect: 'Heal 200 HP' },
          { type: 'material', name: 'Crystallized Shadow Essence', rarity: 'epic', effect: 'Used for shadow soldier enhancement' }
        ],
        A: [
          { type: 'potion', name: 'Divine Healing Potion', rarity: 'legendary', effect: 'Heal 500 HP' },
          { type: 'material', name: 'Monarch Shadow Essence', rarity: 'legendary', effect: 'Used for shadow soldier enhancement' }
        ],
        S: [
          { type: 'potion', name: 'Sovereign\'s Healing Potion', rarity: 'mythic', effect: 'Heal 1000 HP' },
          { type: 'material', name: 'Sovereign Shadow Essence', rarity: 'mythic', effect: 'Used for shadow soldier enhancement' }
        ]
      };
      
      return rewards[rank as keyof typeof rewards] || rewards['D'];
    };

    const baseQuests = [
      { 
        id: 1, 
        name: 'Morning Push-ups', 
        xp: Math.floor(100 * multiplier), 
        completed: false, 
        target: Math.floor(20 * multiplier), 
        type: 'strength',
        reward: generateQuestReward('E'),
      },
      { 
        id: 2, 
        name: 'Shadow Sprint', 
        xp: Math.floor(150 * multiplier), 
        completed: false, 
        target: Math.floor(2 * multiplier), 
        type: 'cardio',
        reward: generateQuestReward('D')
      },
      { 
        id: 3, 
        name: 'Arise Squats', 
        xp: Math.floor(120 * multiplier), 
        completed: false, 
        target: Math.floor(30 * multiplier), 
        type: 'strength',
        reward: generateQuestReward('C')
      },
    ];

    const rankQuests = {
      D: [
        { id: 4, name: 'Iron Body Training', xp: 200, completed: false, target: 40, type: 'strength', 
          requirement: 'Unlocks Iron Shadow Soldier' },
      ],
      C: [
        { id: 5, name: 'Heavy Lifting', xp: 250, completed: false, target: 50, type: 'strength',
          requirement: 'Unlocks Tank Shadow Soldier' },
      ],
      B: [
        { id: 6, name: 'Assassin Sprint', xp: 300, completed: false, target: 5, type: 'cardio',
          requirement: 'Unlocks Beru Shadow Soldier' },
      ],
      A: [
        { id: 7, name: 'Knight\'s Challenge', xp: 400, completed: false, target: 100, type: 'mixed',
          requirement: 'Unlocks Igris Shadow Soldier' },
      ],
    };

    return [...baseQuests, ...(rankQuests[rank] || [])];
  };  const [dailyQuests, setDailyQuests] = useState<Quest[]>(generateRankQuests('E'));
  const [sideQuests, setSideQuests] = useState<Quest[]>([]);
  const [customQuests, setCustomQuests] = useState<Quest[]>([]);
  const [questRewards, setQuestRewards] = useState<QuestRewards>({
    dailyStreak: 0,
    lastCompletedDate: null,
    inventory: []
  });

  const [motivation] = useState(new Animated.Value(0));

  useEffect(() => {
    const pulseAnimation = Animated.sequence([
      Animated.timing(motivation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(motivation, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(pulseAnimation).start();
  }, []);

  const StatBar: React.FC<{value: number; max: number; color: string}> = ({ value, max, color }) => (
    <View style={styles.statBarContainer}>
      <View style={[styles.statBar, { width: `${(value / max) * 100}%`, backgroundColor: color }]} />
    </View>
  );

  const QuestCard: React.FC<{quest: Quest}> = ({ quest }) => {
    const addCustomQuest = (questData: Quest) => {
      const newQuest = {
        id: Date.now(),
        ...questData,
        completed: false,
        reward: generateQuestReward(hunterStats.rank)
      };
      setCustomQuests(prev => [...prev, newQuest]);
    };

    const generateSideQuests = () => {
      const sideQuestTemplates = [
        {
          name: 'Shadow Extraction',
          description: 'Extract shadow essence from defeated monsters',
          reward: { type: 'material', name: 'Shadow Extract', amount: 5 }
        },
        {
          name: 'Dungeon Mapping',
          description: 'Map out an entire dungeon floor',
          reward: { type: 'item', name: 'Dungeon Scanner', amount: 1 }
        },
        {
          name: 'Monster Study',
          description: 'Analyze monster patterns and behaviors',
          reward: { type: 'buff', name: 'Monster Knowledge', duration: '24h' }
        }
      ];

      return sideQuestTemplates.map(template => ({
        ...template,
        id: Date.now() + Math.random(),
        completed: false,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }));
    };

    const toggleComplete = (quest: Quest) => {
      // Show quest completion animation
      setShowQuestComplete(true);
      Animated.sequence([
        Animated.timing(questCompleteAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        }),
        Animated.delay(1500),
        Animated.timing(questCompleteAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true
        })
      ]).start(() => {
        setShowQuestComplete(false);
      });

      // Particle effect animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(particleAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true
          }),
          Animated.timing(particleAnimation, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true
          })
        ])
      ).start();

      const currentDate = new Date().toDateString();
      
      if (currentDate === questRewards.lastCompletedDate) {
        setQuestRewards(prev => ({
          ...prev,
          dailyStreak: prev.dailyStreak + 1
        }));
      } else {
        setQuestRewards(prev => ({
          ...prev,
          dailyStreak: 1,
          lastCompletedDate: currentDate
        }));
      }

      // Add reward to inventory
      if (quest.reward) {
        setQuestRewards(prev => ({
          ...prev,
          inventory: [...prev.inventory, quest.reward]
        }));

        // Show reward notification
        showRewardNotification(quest.reward);
      }

      // Update quest completion status
      if (quest.type === 'custom') {
        setCustomQuests(prev =>
          prev.map(q =>
            q.id === quest.id
              ? { ...q, completed: !q.completed }
              : q
          )
        );
      } else if (quest.type === 'side') {
        setSideQuests(prev =>
          prev.map(q =>
            q.id === quest.id
              ? { ...q, completed: !q.completed }
              : q
          )
        );
      } else {
        setDailyQuests(prev =>
          prev.map(q =>
            q.id === quest.id
              ? { ...q, completed: !q.completed }
              : q
          )
        );
      }
      if (!quest.completed) {
        checkRankUp(quest.xp);
      }
    };

    return (
      <TouchableOpacity
        style={[styles.questCard, quest.completed && styles.questCardCompleted]}
        onPress={() => toggleComplete(quest)}
      >
        <LinearGradient
          colors={quest.completed ? ['#1a2e1a', '#163e16'] : ['#1a1a2e', '#16213e']}
          style={styles.questGradient}
        >
          <View style={styles.questHeader}>
            <MaterialCommunityIcons
              name={quest.type === 'strength' ? 'arm-flex' : 'run-fast'}
              size={24}
              color={quest.completed ? '#4dff4d' : '#4d9fff'}
            />
            <Text style={[styles.questName, quest.completed && styles.questNameCompleted]}>
              {quest.name}
            </Text>
            {quest.completed && (
              <MaterialCommunityIcons
                name="check-circle"
                size={24}
                color="#4dff4d"
                style={styles.checkmark}
              />
            )}
          </View>
          <View style={styles.questDetails}>
            <Text style={[styles.questXP, quest.completed && styles.questXPCompleted]}>
              +{quest.xp} XP
            </Text>
            <Text style={styles.questTarget}>Target: {quest.target}</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const DungeonCard = ({ dungeon }: {dungeon: Dungeon}) => (
    <TouchableOpacity style={styles.dungeonCard}>
      <ImageBackground
        source={{ uri: dungeon.image }}
        style={styles.dungeonImage}
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.dungeonOverlay}
        >
          <View style={styles.dungeonHeader}>
            <Text style={styles.dungeonName}>{dungeon.name}</Text>
            <View style={styles.dungeonBadge}>
              <Text style={styles.dungeonLevel}>Rank {dungeon.level}</Text>
            </View>
          </View>
          <Text style={styles.dungeonDescription}>{dungeon.description}</Text>
          <View style={styles.dungeonFooter}>
            <View style={styles.dungeonStat}>
              <FontAwesome5 name="clock" size={14} color="#4d9fff" />
              <Text style={styles.dungeonStatText}>{dungeon.timeLimit}</Text>
            </View>
            <View style={styles.dungeonStat}>
              <FontAwesome5 name="star" size={14} color="#4d9fff" />
              <Text style={styles.dungeonStatText}>{dungeon.rewards}</Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );  const startSummoningAnimation = (shadow: Shadow) => {
    // Reset animations
    summoningAnimation.setValue(0);
    const particleCount = getRankParticleCount(shadow.rank);
    const particleSystem = Array(particleCount).fill(0).map(() => ({
      animation: new Animated.Value(0),
      scale: 0.5 + Math.random() * 1.5,
      angle: Math.random() * Math.PI * 2,
      distance: 100 + Math.random() * 200,
      delay: Math.random() * 1000,
      duration: 1500 + Math.random() * 1000,
      color: getRankColor(shadow.rank),
    }));

    // Enhanced summoning sequence
    showSystemNotification('SYSTEM: Initializing Shadow Extraction...', 'system');
    setTimeout(() => showSystemNotification('SYSTEM: Analyzing Shadow Data...', 'system'), 800);
    setTimeout(() => showSystemNotification(`SYSTEM: ${shadow.rank}-Rank Shadow Detected`, 'system'), 1600);
    setTimeout(() => showSystemNotification('SYSTEM: Beginning Summoning Sequence...', 'system'), 2400);
    setTimeout(() => showSystemNotification('ARISE!', 'quest'), 3200);

    Animated.parallel([
      // Main shadow appearance with rank-based effects
      Animated.sequence([
        Animated.spring(summoningAnimation, {
          toValue: 1,
          tension: getRankTension(shadow.rank),
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.timing(summoningAnimation, {
          toValue: 0.95,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // Enhanced particle system
      ...particleSystem.map(particle =>
        Animated.sequence([
          Animated.delay(particle.delay),
          Animated.timing(particle.animation, {
            toValue: 1,
            duration: particle.duration,
            useNativeDriver: true,
          }),
        ])
      ),
      // Aura effect
      Animated.loop(
        Animated.sequence([
          Animated.timing(auraAnimation, {
            toValue: 1,
            duration: getRankAuraDuration(shadow.rank),
            useNativeDriver: true,
          }),
          Animated.timing(auraAnimation, {
            toValue: 0.5,
            duration: getRankAuraDuration(shadow.rank),
            useNativeDriver: true,
          }),
        ])
      ),
      // Glow effect
      Animated.sequence([
        Animated.timing(rewardGlow, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(rewardGlow, {
          toValue: 0.5,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ]).start();

    // Show system messages in sequence
    showSystemNotification('SYSTEM: Shadow Extraction Process Initiated', 'system');
    setTimeout(() => {
      showSystemNotification('SYSTEM: Analyzing Shadow Data...', 'system');
    }, 1000);
    setTimeout(() => {
      showSystemNotification('SYSTEM: Shadow Soldier Rising...', 'system');
    }, 2000);
    setTimeout(() => {
      showSystemNotification('ARISE!', 'quest');
    }, 3000);
  };

  const renderShadowModal = () => {
    if (!selectedShadow) return null;

    return (
      <Modal
        visible={showShadowModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowShadowModal(false)}
      >
        <View style={styles.shadowModalContainer}>
          <Animated.View
            style={[
              styles.shadowModalContent,
              {
                transform: [{
                  scale: summoningAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                }],
              },
            ]}
          >
            <LinearGradient
              colors={['#1a1a2e', '#16213e']}
              style={styles.shadowGradient}
            >
              <Text style={styles.shadowTitle}>ARISE!</Text>
              <Image
                source={{ uri: selectedShadow.image }}
                style={styles.shadowImage}
                resizeMode="cover"
              />
              <Text style={styles.shadowName}>{selectedShadow.name}</Text>
              <Text style={styles.shadowType}>{selectedShadow.type}</Text>
              <Text style={styles.shadowAbility}>{selectedShadow.ability}</Text>
              <TouchableOpacity
                style={styles.summonButton}
                onPress={() => setShowShadowModal(false)}
              >
                <LinearGradient
                  colors={['#4d9fff', '#0066cc']}
                  style={styles.summonButtonGradient}
                >
                  <Text style={styles.summonButtonText}>Accept Shadow Soldier</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        </View>
      </Modal>
    );
  };

  const renderShadowArmy = () => (
    <View style={styles.shadowArmyContainer}>
      <Text style={styles.shadowArmyTitle}>Shadow Army</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.shadowScroll}>
        {shadows.map(shadow => (
          <View
            key={shadow.id}
            style={[
              styles.shadowCard,
              !shadow.unlocked && styles.shadowCardLocked
            ]}
          >
            <Image
              source={{ uri: shadow.image }}
              style={styles.shadowCardImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.9)']}
              style={styles.shadowCardOverlay}
            >
              <Text style={styles.shadowCardName}>{shadow.name}</Text>
              <Text style={styles.shadowCardRank}>Rank {shadow.rank}</Text>
              {!shadow.unlocked && (
                <View style={styles.lockContainer}>
                  <MaterialCommunityIcons name="lock" size={24} color="#4d9fff" />
                </View>
              )}
            </LinearGradient>
          </View>
        ))}
      </ScrollView>
    </View>
  );  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://api.a0.dev/assets/image?text=dark mystical dungeon with blue magical energy and solo leveling style&aspect=9:16' }}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Quest Complete Popup */}
      {showQuestComplete && (
        <Animated.View
          style={[
            styles.questCompletePopup,
            {
              transform: [
                {
                  scale: questCompleteAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1]
                  })
                }
              ],
              opacity: questCompleteAnimation
            }
          ]}
        >
          <LinearGradient
            colors={['rgba(77, 159, 255, 0.9)', 'rgba(0, 102, 204, 0.9)']}
            style={styles.questCompleteGradient}
          >
            <Text style={styles.questCompleteText}>Quest Complete!</Text>
            <Text style={styles.questRewardText}>+{quest?.xp || 0} XP</Text>
          </LinearGradient>
        </Animated.View>
      )}

      {/* Level Up Effects */}
      {showLevelUpEffects && (
        <View style={styles.levelUpContainer}>
          <Animated.View style={[styles.levelUpEffect, {
            transform: [{
              scale: rankUpScale.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 1.2]
              })
            }]
          }]}>
            <Text style={styles.levelUpText}>LEVEL UP!</Text>
          </Animated.View>
          {/* Particle Effects */}
          {Array.from({ length: 20 }).map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.particle,
                {
                  left: `${Math.random() * 100}%`,
                  transform: [{
                    translateY: particleAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1000]
                    })
                  }]
                }
              ]}
            />
          ))}
        </View>
      )}
      source={{ uri: 'https://api.a0.dev/assets/image?text=dark mystical dungeon with blue magical energy&aspect=9:16' }}
      style={styles.container}
    >
      <Animated.View style={styles.animatedBackground}>
        <LinearGradient
          colors={['rgba(10, 10, 26, 0.95)', 'rgba(11, 22, 34, 0.95)']}
          style={StyleSheet.absoluteFill}
        >
          {Array.from({ length: 20 }).map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.particleEffect,
                {
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  transform: [{
                    translateY: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1000],
                    })
                  }]
                }
              ]}
            />
          ))}
          {showConfetti && (
            <View style={styles.confettiContainer}>
              {[...Array(20)].map((_, i) => (
                <Animated.View
                  key={i}
                  style={[
                    styles.confettiPiece,
                    {
                      left: `${Math.random() * 100}%`,
                      transform: [{
                        translateY: celebrationParticles.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-20, 600],
                        }),
                      }],
                    },
                  ]}
                />
              ))}
            </View>
          )}
          <ScrollView style={styles.scrollView}>
            <View style={styles.header}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>{hunterStats.rank}</Text>
              </View>
              <View style={styles.levelInfo}>
                <Text style={styles.levelText}>Level {hunterStats.level}</Text>
                <StatBar value={hunterStats.xp} max={hunterStats.xpToNextLevel} color="#4d9fff" />
              </View>
              <View style={styles.keyContainer}>
                <MaterialCommunityIcons name="key" size={24} color="#ffd700" />
                <Text style={styles.keyText}>{hunterStats.dungeonKeys}</Text>
              </View>
            </View>

            <View style={styles.statsContainer}>
              <LinearGradient
                colors={['rgba(26, 26, 46, 0.9)', 'rgba(22, 33, 62, 0.9)']}
                style={styles.statsGradient}
              >
                <View style={styles.statRow}>
                  <Ionicons name="fitness" size={20} color="#ff4d4d" />
                  <Text style={styles.statLabel}>Strength</Text>
                  <Text style={styles.statValue}>{hunterStats.strength}</Text>
                </View>
                <View style={styles.statRow}>
                  <Ionicons name="flash" size={20} color="#4dff4d" />
                  <Text style={styles.statLabel}>Agility</Text>
                  <Text style={styles.statValue}>{hunterStats.agility}</Text>
                </View>
                <View style={styles.statRow}>
                  <Ionicons name="shield" size={20} color="#ffd700" />
                  <Text style={styles.statLabel}>Endurance</Text>
                  <Text style={styles.statValue}>{hunterStats.endurance}</Text>
                </View>
              </LinearGradient>
            </View>

            <Text style={styles.sectionTitle}>Daily Quests</Text>
            <View style={styles.questsContainer}>
              {dailyQuests.map(quest => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
            </View>            <TouchableOpacity
              style={styles.dungeonButton}
              onPress={() => enterDungeon(availableDungeons[0])}
            >
              <LinearGradient
                colors={['#4d9fff', '#0066cc']}
                style={styles.dungeonGradient}
              >
                <Animated.View style={{
                  transform: [{
                    scale: motivation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.1],
                    }),
                  }],
                }}>
                  <Text style={styles.dungeonButtonText}>Enter Dungeon</Text>
                </Animated.View>
                <MaterialCommunityIcons name="door-open" size={24} color="white" />
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.statsButton}
              onPress={() => setShowStatsModal(true)}
            >
              <LinearGradient
                colors={['#1a1a2e', '#16213e']}
                style={styles.statsButtonGradient}
              >
                <MaterialCommunityIcons name="chart-line" size={24} color="#4d9fff" />
                <Text style={styles.statsButtonText}>View Progress</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>

          <Modal
            visible={showStatsModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowStatsModal(false)}
          >
            <View style={styles.modalContainer}>              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Hunter Progress</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowStatsModal(false)}
                  >
                    <Ionicons name="close" size={24} color="white" />
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.statsModalContent}>
                  <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Strength Progress</Text>                    <View style={[styles.progressBar, styles.chart]}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { 
                            width: `${(progressData.strength[progressData.strength.length - 1] / 100) * 100}%`,
                            backgroundColor: 'rgba(255, 77, 77, 0.8)'
                          }
                        ]} 
                      />
                      <Text style={styles.progressText}>
                        {progressData.strength[progressData.strength.length - 1]}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Agility Progress</Text>
                    <LineChart
                      data={{
                        labels: progressData.timestamps,
                        datasets: [{
                          data: progressData.agility
                        }]
                      }}
                      width={Dimensions.get('window').width - 40}
                      height={220}
                      chartConfig={{
                        backgroundColor: '#1a1a2e',
                        backgroundGradientFrom: '#1a1a2e',
                        backgroundGradientTo: '#16213e',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(77, 255, 77, ${opacity})`,
                        style: {
                          borderRadius: 16
                        }
                      }}
                      bezier
                      style={styles.chart}
                    />
                  </View>

                  <View style={styles.chartContainer}>
                    <Text style={styles.chartTitle}>Endurance Progress</Text>
                    <LineChart
                      data={{
                        labels: progressData.timestamps,
                        datasets: [{
                          data: progressData.endurance
                        }]
                      }}
                      width={Dimensions.get('window').width - 40}
                      height={220}
                      chartConfig={{
                        backgroundColor: '#1a1a2e',
                        backgroundGradientFrom: '#1a1a2e',
                        backgroundGradientTo: '#16213e',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(255, 215, 0, ${opacity})`,
                        style: {
                          borderRadius: 16
                        }
                      }}
                      bezier
                      style={styles.chart}
                    />
                  </View>

                  <View style={styles.statsOverview}>
                    <Text style={styles.statsOverviewTitle}>Training Overview</Text>
                    <View style={styles.statsOverviewContent}>
                      <View style={styles.overviewItem}>
                        <Text style={styles.overviewLabel}>Total XP Gained</Text>
                        <Text style={styles.overviewValue}>{hunterStats.xp}</Text>
                      </View>
                      <View style={styles.overviewItem}>
                        <Text style={styles.overviewLabel}>Quests Completed</Text>
                        <Text style={styles.overviewValue}>
                          {dailyQuests.filter(q => q.completed).length}
                        </Text>
                      </View>
                      <View style={styles.overviewItem}>
                        <Text style={styles.overviewLabel}>Current Rank</Text>
                        <Text style={[styles.overviewValue, styles.rankValue]}>
                          {hunterStats.rank}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {hunterStats.unlockedShadows && renderShadowArmy()}
                </ScrollView>

                {renderShadowModal()}  {/* Reward Box Modal */}
                <Modal
                  visible={showRewardBox}
                  transparent={true}
                  animationType="none"
                >
                  <View style={styles.rewardModalContainer}>
                    <Animated.View
                      style={[
                        styles.rewardBox,
                        {
                          transform: [
                            {
                              scale: rewardScale
                            },
                            {
                              rotateY: rewardRotation.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0deg', '360deg']
                              })
                            }
                          ]
                        }
                      ]}
                    >
                      <Animated.View
                        style={[
                          styles.rewardGlow,
                          {
                            opacity: rewardGlow
                          }
                        ]}
                      />
                      <LinearGradient
                        colors={['rgba(77, 159, 255, 0.9)', 'rgba(0, 102, 204, 0.9)']}
                        style={styles.rewardGradient}
                      >
                        {currentReward && (
                          <>
                            <View style={styles.rewardImageContainer}>
                              <Image
                                source={{ uri: currentReward.image }}
                                style={styles.rewardImage}
                                resizeMode="cover"
                              />
                            </View>
                            <Text style={styles.rewardTitle}>Reward Acquired!</Text>
                            <Text style={styles.rewardDescription}>
                              {currentReward.amount}x {currentReward.rarity.charAt(0).toUpperCase() + currentReward.rarity.slice(1)} {currentReward.name}
                            </Text>
                            <View style={[styles.rarityBadge, getRarityStyle(currentReward.rarity)]}>
                              <Text style={styles.rarityText}>{currentReward.rarity.toUpperCase()}</Text>
                            </View>
                          </>
                        )}
                      </LinearGradient>
                      
                      {/* Particle Effects */}
                      <View style={styles.particleContainer}>
                        {particleSystem.map((particle, index) => (
                          <Animated.View
                            key={index}
                            style={[
                              styles.particle,
                              {
                                left: `${particle.startX}%`,
                                top: `${particle.startY}%`,
                                transform: [
                                  {
                                    scale: particle.scale
                                  },
                                  {
                                    translateX: particle.animation.interpolate({
                                      inputRange: [0, 1],
                                      outputRange: [0, Math.cos(particle.angle) * 200 * particle.speed]
                                    })
                                  },
                                  {
                                    translateY: particle.animation.interpolate({
                                      inputRange: [0, 1],
                                      outputRange: [0, Math.sin(particle.angle) * 200 * particle.speed]
                                    })
                                  }
                                ],
                                opacity: particle.animation.interpolate({
                                  inputRange: [0, 0.8, 1],
                                  outputRange: [1, 0.5, 0]
                                })
                              }
                            ]}
                          />
                        ))}
                      </View>
                    </Animated.View>
                  </View>                </Modal>
              </View>
            </ScrollView>
          </View>
        </ImageBackground>
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(11, 22, 34, 0.8)',
    borderRadius: 15,
    margin: 10,
    shadowColor: "#0094FF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  rankBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 148, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#4d9fff',
    shadowColor: "#0094FF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  // ... rest of your styles ...
});

// Helper functions
const showSystemNotification = (message: string, type: 'quest' | 'level' | 'system' | 'warning' = 'system') => {
  const notificationColors = {
    quest: ['#4d9fff', '#0066cc'],
    level: ['#ffd700', '#cc9900'],
    system: ['#ffffff', '#cccccc'],
    warning: ['#ff4d4d', '#cc0000']
  };
  
  toast(message, {
    duration: 3000,
    style: {
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      borderWidth: 1,
      borderColor: colors[type][0],
      padding: 16,
    },
    textStyle: {
      color: colors[type][0],
      fontWeight: 'bold',
      fontSize: 16,
    },
    iconElement: 
      type === 'system' ? 
        <MaterialCommunityIcons name="script-text" size={24} color={colors[type][0]} /> :
      type === 'quest' ?
        <MaterialCommunityIcons name="sword" size={24} color={colors[type][0]} /> :
      type === 'level' ?
        <MaterialCommunityIcons name="arrow-up-bold" size={24} color={colors[type][0]} /> :
        <MaterialCommunityIcons name="alert" size={24} color={colors[type][0]} />
  });
};  const checkRankUp = async (newXP: number) => {
    const ranks = ['E', 'D', 'C', 'B', 'A', 'S'];
    const currentXP = hunterStats.xp + newXP;
    
    // Enhanced stat progression animations
    const animateStatIncrease = (statName: string, increase: number) => {
      const progressAnimation = new Animated.Value(0);
      const particles = Array(20).fill(0).map(() => ({
        animation: new Animated.Value(0),
        scale: 0.5 + Math.random() * 1.5,
        angle: Math.random() * Math.PI * 2,
        distance: 50 + Math.random() * 100,
        delay: Math.random() * 500,
      }));

      Animated.parallel([
        Animated.timing(progressAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        ...particles.map(particle =>
          Animated.sequence([
            Animated.delay(particle.delay),
            Animated.timing(particle.animation, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();

      return { progressAnimation, particles };
    };
  if (currentXP >= hunterStats.xpToNextLevel) {
    const currentRankIndex = ranks.indexOf(hunterStats.rank);
    if (currentRankIndex < ranks.length - 1) {
      const newRank = ranks[currentRankIndex + 1];
      const reward = generateReward(newRank);

      showSystemNotification('SYSTEM: Hunter Rank Up Detected', 'system');
      setTimeout(() => {
        showSystemNotification(`SYSTEM: Rank ${hunterStats.rank} → Rank ${newRank}`, 'level');
      }, 1000);
      setTimeout(() => {
        showSystemNotification('SYSTEM: New Shadow Soldier Available', 'quest');
      }, 2000);

      setCurrentReward(reward);
      setShowRewardBox(true);
      animateRewardBox();

      setHunterStats(prev => ({
        ...prev,
        previousRank: prev.rank,
        rank: newRank,
        xp: 0,
        xpToNextLevel: prev.xpToNextLevel * 1.5,
        level: prev.level + 1,
        strength: prev.strength + 5,
        agility: prev.agility + 3,
        endurance: prev.endurance + 4,
        dungeonKeys: prev.dungeonKeys + reward.amount,
        unlockedShadows: true
      }));

      setDailyQuests(generateRankQuests(newRank));

      const newShadow = shadows.find(s => s.rank === newRank);
      if (newShadow) {
        setShadows(prev =>
          prev.map(shadow =>
            shadow.id === newShadow.id
              ? { ...shadow, unlocked: true }
              : shadow
          )
        );
        setSelectedShadow(newShadow);
        setTimeout(() => {
          setShowShadowModal(true);
          startSummoningAnimation();
        }, 3000);
      }
      setShowRankUpModal(true);
      setShowConfetti(true);
      celebrateRankUp();
    }
  } else {
    setHunterStats(prev => ({
      ...prev,
      xp: currentXP,
    }));
  }
};

const summonShadow = (shadow: Shadow) => {
  if (!shadow.unlocked) {
    showSystemNotification(`SYSTEM: Insufficient Rank to Summon ${shadow.name}`, 'warning');
    return;
  }
  
  showSystemNotification('SYSTEM: Shadow Extraction Process Initiated', 'system');
  setTimeout(() => {
    showSystemNotification(`SYSTEM: ${shadow.name} Successfully Summoned`, 'quest');
  }, 1500);

  setIsSummoning(true);
  setSelectedShadow(shadow);
  setShowShadowModal(true);
  startSummoningAnimation();
  setActiveShadow(shadow);

  const buffStats = { ...hunterStats };
  switch(shadow.ability) {
    case 'Defense Boost':
      buffStats.endurance += 10;
      break;
    case 'Strength Boost':
      buffStats.strength += 15;
      break;
    case 'Agility Boost':
      buffStats.agility += 12;
      break;
    case 'All Stats Boost':
      buffStats.strength += 20;
      buffStats.agility += 20;
      buffStats.endurance += 20;
      break;
    case 'Ultimate Power':
      buffStats.strength += 50;
      buffStats.agility += 50;
      buffStats.endurance += 50;
      break;
  }
  setHunterStats(buffStats);
};const styles = StyleSheet.create({
  questCompletePopup: {position: 'absolute',
    top: '20%', 
    left: '50%',
    transform: [{ translateX: -100 }],
    width: 200,
    borderRadius: 15,
    overflow: 'hidden',
    zIndex: 1000,
  },
});
  questCompleteGradient: {
    padding: 20,
    alignItems: 'center',
  },
  questCompleteText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  questRewardText: {
    color: '#ffd700',
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
  },
  levelUpContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  levelUpEffect: {
    backgroundColor: 'rgba(77, 159, 255, 0.3)',
    padding: 30,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#4d9fff',
  },
  levelUpText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    textShadowColor: '#4d9fff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: '#4d9fff',
    borderRadius: 2,
  },
  animatedBackground: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  particleEffect: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: '#4d9fff',
    borderRadius: 1,
    opacity: 0.5,
  },
  rewardModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.85)',
  },
  rewardBox: {
    width: 300,
    height: 400,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#4d9fff',
    shadowColor: "#4d9fff",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 15,
  },
  rewardGradient: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardImageContainer: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 75,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: "#4d9fff",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  rewardImage: {
    width: '100%',
    height: '100%',
  },
  rewardTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textShadowColor: 'rgba(77, 159, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  rewardDescription: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  rarityBadge: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#fff',
  },
  rarityText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },  shadowModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadowModalContent: {
    width: '90%',
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: 'rgba(11, 22, 34, 0.98)',
    borderWidth: 1,
    borderColor: 'rgba(0, 148, 255, 0.5)',
    shadowColor: "#0094FF",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  shadowGradient: {
    padding: 30,
    alignItems: 'center',
  },
  shadowTitle: {
    color: '#4d9fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  shadowImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  shadowName: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  shadowType: {
    color: '#4d9fff',
    fontSize: 18,
    marginBottom: 5,
  },
  shadowAbility: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginBottom: 20,
  },
  summonButton: {
    width: '100%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  summonButtonGradient: {
    padding: 15,
    alignItems: 'center',
  },
  summonButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  shadowArmyContainer: {
    marginTop: 20,
    padding: 20,
  },
  shadowArmyTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  shadowScroll: {
    flexGrow: 0,
  },
  shadowCard: {
    width: 150,
    height: 200,
    marginRight: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  shadowCardLocked: {
    opacity: 0.5,
  },
  shadowCardImage: {
    width: '100%',
    height: '100%',
  },
  shadowCardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
  },
  shadowCardName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  shadowCardRank: {
    color: '#4d9fff',
    fontSize: 14,
  },
  lockContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -12 },
      { translateY: -12 },
    ],
  },
  statsButton: {
    margin: 20,
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  statsButtonGradient: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  statsModalContent: {
    padding: 20,
  },
  chartContainer: {
    marginBottom: 30,
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
    borderRadius: 16,
    padding: 15,
  },
  chartTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsOverview: {
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  statsOverviewTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsOverviewContent: {
    gap: 15,
  },
  overviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  overviewLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
  },
  overviewValue: {
    color: '#4d9fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  rankValue: {
    backgroundColor: '#4d9fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    color: 'white',
  },
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  confettiPiece: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: '#4d9fff',
    borderRadius: 4,
  },
  rankUpModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankUpContent: {
    width: '85%',
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: 'rgba(11, 22, 34, 0.98)',
    borderWidth: 2,
    borderColor: 'rgba(0, 148, 255, 0.6)',
    shadowColor: "#0094FF",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  rankUpGradient: {
    padding: 30,
    alignItems: 'center',
  },
  rankUpTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
  },
  rankUpText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  rankUpSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  statsIncrease: {
    marginTop: 20,
    alignItems: 'center',
  },
  statIncreaseText: {
    color: '#ffd700',
    fontSize: 18,
    marginVertical: 5,
  },
  questCardCompleted: {
    opacity: 0.8,
  },
  questNameCompleted: {
    color: '#4dff4d',
    textDecorationLine: 'line-through',
  },
  questXPCompleted: {
    color: '#4dff4d',
  },
  checkmark: {
    marginLeft: 'auto',
  },  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(11, 22, 34, 0.8)',
    borderRadius: 15,
    margin: 10,
    shadowColor: "#0094FF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },  rankBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 148, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#4d9fff',
    shadowColor: "#0094FF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  rankText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  levelInfo: {
    flex: 1,
  },
  levelText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 5,
  },
  keyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 8,
    borderRadius: 15,
  },
  keyText: {
    color: '#ffd700',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  statBarContainer: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  statBar: {
    height: '100%',
    borderRadius: 3,
  },
  statsContainer: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(11, 22, 34, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(0, 148, 255, 0.3)',
    shadowColor: "#0094FF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  statsGradient: {
    padding: 20,
    backgroundColor: 'rgba(0, 148, 255, 0.05)',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  statLabel: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  statValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    margin: 20,
    marginBottom: 10,
  },
  questsContainer: {
    padding: 10,
  },
  questCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(11, 22, 34, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(0, 148, 255, 0.3)',
    shadowColor: "#0094FF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  questGradient: {
    padding: 20,
    backgroundColor: 'rgba(0, 148, 255, 0.05)',
  },
  questHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  questName: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
  questDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  questXP: {
    color: '#4d9fff',
    fontWeight: 'bold',
  },
  questTarget: {
    color: '#888',
  },
  dungeonButton: {
    margin: 20,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: "#0094FF",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  dungeonGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 148, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 148, 255, 0.5)',
  },
  dungeonButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  progressBar: {
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    overflow: 'hidden',
    marginVertical: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 15,
  },
  progressText: {
    position: 'absolute',
    right: 10,
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 30,
  },
  modalContent: {
    flex: 1,
    marginTop: 80,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    backgroundColor: 'rgba(11, 22, 34, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(0, 148, 255, 0.3)',
    shadowColor: "#0094FF",
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  modalTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  dungeonList: {
    padding: 15,
  },
  dungeonCard: {
    height: 220,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(11, 22, 34, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(0, 148, 255, 0.3)',
    shadowColor: "#0094FF",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  dungeonImage: {
    flex: 1,
  },
  dungeonOverlay: {
    flex: 1,
    padding: 15,
    justifyContent: 'flex-end',
  },
  dungeonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dungeonName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  dungeonBadge: {
    backgroundColor: '#4d9fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  dungeonLevel: {
    color: 'white',
    fontWeight: 'bold',
  },
  dungeonDescription: {
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 10,
  },
  dungeonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dungeonStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dungeonStatText: {
    color: '#4d9fff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
});

const playRankUpSound = async () => {
  if (sounds?.rankUp) {
    await sounds.rankUp.playAsync();
  }
};

const showRewardNotification = (reward: any) => {
  console.log('Reward received:', reward);
};

export default HunterDashboard;