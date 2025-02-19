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
import { BlurView } from 'expo-blur';

// Add type definitions for quest and dungeon
interface Quest {
  id: number;
  name: string;
  xp: number;
  completed: boolean;
  target: number;
  type: string;
  requirement?: string;
}

interface Dungeon {
  id: number;
  name: string;
  level: string;
  difficulty: string;
  rewards: string;
  timeLimit: string;
  type: string;
  description: string;
  image: string;
}

// Add props interfaces for components
interface QuestCardProps {
  quest: Quest;
}

interface DungeonCardProps {
  dungeon: Dungeon;
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

  const [hunterStats, setHunterStats] = useState({
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
  const [shadows, setShadows] = useState([
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
    },
     {
      id: 1,
      name: "Iron",
      rank: "D",
      type: "Tank",
      ability: "Defense Boost",
      image: "https://api.a0.dev/assets/image?text=armored shadow soldier with blue aura&aspect=1:1",
      unlocked: false
    },
    {
      id: 2,
      name: "Tank",
      rank: "C",
      type: "Heavy",
      ability: "Strength Boost",
      image: "https://api.a0.dev/assets/image?text=massive shadow soldier with blue crystals&aspect=1:1",
      unlocked: false
    },
    {
      id: 3,
      name: "Beru",
      rank: "B",
      type: "Assassin",
      ability: "Agility Boost",
      image: "https://api.a0.dev/assets/image?text=sleek shadow assassin with blue energy&aspect=1:1",
      unlocked: false
    },
    {
      id: 4,
      name: "Igris",
      rank: "A",
      type: "Knight",
      ability: "All Stats Boost",
      image: "https://api.a0.dev/assets/image?text=noble shadow knight with royal blue armor&aspect=1:1",
      unlocked: false
    }
  ]);

  const [showShadowModal, setShowShadowModal] = useState(false);
  const [selectedShadow, setSelectedShadow] = useState(null);
  const [summoningAnimation] = useState(new Animated.Value(0));
  const [showDungeonModal, setShowDungeonModal] = useState(false);
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
  });

  useEffect(() => {
    loadSounds();
    return () => {
      unloadSounds();
    };
  }, []);

  const loadSounds = async () => {
    try {
      const questSound = new Audio.Sound();
      await questSound.loadAsync(require('../assets/sounds/quest-complete.mp3') as number);
      
      const rankSound = new Audio.Sound();
      await rankSound.loadAsync(require('../assets/sounds/rank-up.mp3') as number);
      
      setSounds({
        questComplete: questSound,
        rankUp: rankSound,
      });
    } catch (error) {
      console.log('Error loading sounds:', error);
    }
  };

  const unloadSounds = async () => {
    if (sounds.questComplete) await sounds.questComplete.unloadAsync();
    if (sounds.rankUp) await sounds.rankUp.unloadAsync();
  };

  const playQuestSound = async () => {
    try {
      if (sounds.questComplete) {
        await sounds.questComplete.setPositionAsync(0);
        await sounds.questComplete.playAsync();
      }
    } catch (error) {
      console.log('Error playing quest sound:', error);
    }
  };

  const playRankUpSound = async () => {
    try {
      if (sounds.rankUp) {
        await sounds.rankUp.setPositionAsync(0);
        await sounds.rankUp.playAsync();
      }
    } catch (error) {
      console.log('Error playing rank up sound:', error);
    }
  };
  const [rewardAnimation] = useState(new Animated.Value(0));
  const [showRewardBox, setShowRewardBox] = useState(false);
  const [currentReward, setCurrentReward] = useState(null);

  const animateRewardBox = () => {
    Animated.sequence([
      Animated.spring(rewardAnimation, {
        toValue: 1,
        tension: 50,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(rewardAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowRewardBox(false);
      rewardAnimation.setValue(0);
    });
  };

  const generateReward = (rank) => {
    const rewards = {
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
    
    return rewards[rank] || rewards['D'];
  };

  const checkRankUp = async (newXP) => {
    const ranks = ['E', 'D', 'C', 'B', 'A', 'S'];
    const currentXP = hunterStats.xp + newXP;
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
  };
  const [availableDungeons, setAvailableDungeons] = useState([
    {
      id: 1,
      name: "Beginner's Gate",
      level: "E",
      difficulty: "Easy",
      rewards: "100-200 XP",
      timeLimit: "20 min",
      type: "strength",
      description: "A perfect dungeon for new hunters. Focus on basic strength training.",
      image: "https://api.a0.dev/assets/image?text=mystical blue dungeon gate with magical energy&aspect=16:9"
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
  ]);

  const generateRankQuests = (rank) => {
    const baseQuests = [
      { id: 1, name: 'Morning Push-ups', xp: 100, completed: false, target: 20, type: 'strength' },
      { id: 2, name: 'Shadow Sprint', xp: 150, completed: false, target: 1, type: 'cardio' },
      { id: 3, name: 'Arise Squats', xp: 120, completed: false, target: 30, type: 'strength' },
    ];

    const rankQuests = {
      'D': [
        { id: 4, name: 'Iron Body Training', xp: 200, completed: false, target: 40, type: 'strength', 
          requirement: 'Unlocks Iron Shadow Soldier' },
      ],
      'C': [
        { id: 5, name: 'Heavy Lifting', xp: 250, completed: false, target: 50, type: 'strength',
          requirement: 'Unlocks Tank Shadow Soldier' },
      ],
      'B': [
        { id: 6, name: 'Assassin Sprint', xp: 300, completed: false, target: 5, type: 'cardio',
          requirement: 'Unlocks Beru Shadow Soldier' },
      ],
      'A': [
        { id: 7, name: 'Knight\'s Challenge', xp: 400, completed: false, target: 100, type: 'mixed',
          requirement: 'Unlocks Igris Shadow Soldier' },
      ],
    };

    return [...baseQuests, ...(rankQuests[rank] || [])];
  };

  const [dailyQuests, setDailyQuests] = useState(generateRankQuests('E'));

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

  const StatBar = ({ value, max, color }) => (
    <View style={styles.statBarContainer}>
      <View style={[styles.statBar, { width: `${(value / max) * 100}%`, backgroundColor: color }]} />
    </View>
  );

  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [showQuestCompleteNotification, setShowQuestCompleteNotification] = useState(false);
  const [completedQuest, setCompletedQuest] = useState(null);
  const [questCompleteAnimation] = useState(new Animated.Value(0));
  const [levelUpAnimation] = useState(new Animated.Value(0));

  const handleQuestComplete = (quest) => {
    setCompletedQuest(quest);
    setShowQuestCompleteNotification(true);
    playQuestSound();
    
    Animated.sequence([
      Animated.spring(questCompleteAnimation, {
        toValue: 1,
        tension: 50,
        friction: 3,
        useNativeDriver: true
      }),
      Animated.delay(2000),
      Animated.timing(questCompleteAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      })
    ]).start(() => {
      setShowQuestCompleteNotification(false);
      checkRankUp(quest.xp);
    });
  };

  const handleLevelUp = (newLevel, rewards) => {
    setShowLevelUpModal(true);
    playRankUpSound();
    
    Animated.sequence([
      Animated.spring(levelUpAnimation, {
        toValue: 1,
        tension: 50,
        friction: 3,
        useNativeDriver: true
      }),
      Animated.delay(3000),
      Animated.timing(levelUpAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      })
    ]).start(() => {
      setShowLevelUpModal(false);
    });
  };

  // Update the QuestCard component with proper typing
  const QuestCard: React.FC<QuestCardProps> = ({ quest }) => {
    const toggleComplete = () => {
      if (!quest.completed) {
        handleQuestComplete(quest);
        setDailyQuests(prev =>
          prev.map(q =>
            q.id === quest.id
              ? { ...q, completed: true }
              : q
          )
        );
      }
    };

    return (
      <TouchableOpacity 
        style={[styles.questCard, quest.completed && styles.questCardCompleted]}
        onPress={toggleComplete}
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

  const [selectedDungeon, setSelectedDungeon] = useState(null);
  const [dungeonEnterAnimation] = useState(new Animated.Value(0));
  const [showDungeonConfirmModal, setShowDungeonConfirmModal] = useState(false);

  // Update the DungeonCard component with proper typing
  const DungeonCard: React.FC<DungeonCardProps> = ({ dungeon }) => (
    <TouchableOpacity 
      style={styles.dungeonCard}
      onPress={() => {
        setSelectedDungeon(dungeon);
        setShowDungeonConfirmModal(true);
      }}
    >
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
  );

  const showSystemAnnouncement = (message: string) => {
    console.log(message);
  };

  const DungeonListModal = ({ visible, onClose, dungeons, onSelectDungeon }) => {
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <BlurView intensity={100} style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Available Dungeons</Text>
              <TouchableOpacity onPress={onClose}>
                <MaterialCommunityIcons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.dungeonList}>
              {dungeons.map((dungeon) => (
                <TouchableOpacity
                  key={dungeon.id}
                  style={styles.dungeonCard}
                  onPress={() => onSelectDungeon(dungeon)}
                >
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
                          <MaterialCommunityIcons name="clock-outline" size={16} color="#4d9fff" />
                          <Text style={styles.dungeonStatText}>{dungeon.timeLimit}</Text>
                        </View>
                        <View style={styles.dungeonStat}>
                          <MaterialCommunityIcons name="star" size={16} color="#4d9fff" />
                          <Text style={styles.dungeonStatText}>{dungeon.rewards}</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </BlurView>
        </View>
      </Modal>
    );
  };

  const DungeonConfirmModal = ({ visible, dungeon, onClose, onEnter }) => {
    if (!dungeon) return null;

    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <BlurView intensity={100} style={styles.dungeonConfirmContent}>
            <ImageBackground
              source={{ uri: dungeon.image }}
              style={styles.dungeonConfirmImage}
              blurRadius={3}
            >
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.9)']}
                style={styles.dungeonConfirmOverlay}
              >
                <Text style={styles.dungeonConfirmTitle}>{dungeon.name}</Text>
                <View style={styles.dungeonConfirmDetails}>
                  <View style={styles.dungeonConfirmRow}>
                    <MaterialCommunityIcons name="sword" size={20} color="#4d9fff" />
                    <Text style={styles.dungeonConfirmText}>
                      Difficulty: Rank {dungeon.level}
                    </Text>
                  </View>
                  <View style={styles.dungeonConfirmRow}>
                    <MaterialCommunityIcons name="clock-outline" size={20} color="#4d9fff" />
                    <Text style={styles.dungeonConfirmText}>
                      Time Limit: {dungeon.timeLimit}
                    </Text>
                  </View>
                  <View style={styles.dungeonConfirmRow}>
                    <MaterialCommunityIcons name="key" size={20} color="#ffd700" />
                    <Text style={styles.dungeonConfirmText}>
                      Required Keys: 1
                    </Text>
                  </View>
                </View>

                <View style={styles.dungeonWarning}>
                  <MaterialCommunityIcons name="alert" size={20} color="#ff4d4d" />
                  <Text style={styles.dungeonWarningText}>
                    Are you sure you want to enter? This will consume 1 Dungeon Key.
                  </Text>
                </View>

                <View style={styles.dungeonConfirmButtons}>
                  <TouchableOpacity
                    style={[styles.dungeonConfirmButton, styles.dungeonCancelButton]}
                    onPress={onClose}
                  >
                    <Text style={styles.dungeonCancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.dungeonConfirmButton, styles.dungeonEnterButton]}
                    onPress={onEnter}
                  >
                    <LinearGradient
                      colors={['#4d9fff', '#0066cc']}
                      style={styles.dungeonEnterGradient}
                    >
                      <Text style={styles.dungeonEnterButtonText}>Enter Dungeon</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </ImageBackground>
          </BlurView>
        </View>
      </Modal>
    );
  };

  const handleDungeonEntry = (dungeon) => {
    if (hunterStats.dungeonKeys > 0) {
      setHunterStats(prev => ({
        ...prev,
        dungeonKeys: prev.dungeonKeys - 1
      }));

      showSystemAnnouncement(`Entering ${dungeon.name}...`);
      
      setShowDungeonConfirmModal(false);
      setSelectedDungeon(null);
      
      // You can add navigation to dungeon screen here
      // navigation.navigate('DungeonScreen', { dungeon });
    } else {
      showSystemAnnouncement("You need a Dungeon Key to enter!");
    }
  };

  const startSummoningAnimation = () => {
    Animated.sequence([
      Animated.spring(summoningAnimation, {
        toValue: 1,
        tension: 50,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(summoningAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
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
      <LinearGradient
        colors={['rgba(11, 22, 34, 0.9)', 'rgba(11, 22, 34, 0.8)']}
        style={styles.shadowArmyGradient}
      >
        <View style={styles.shadowArmyHeader}>
          <MaterialCommunityIcons name="army" size={24} color="#4d9fff" />
          <Text style={styles.shadowArmyTitle}>Shadow Army</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.shadowScroll}>
          {shadows.map(shadow => (
            <TouchableOpacity 
              key={shadow.id} 
              style={[
                styles.shadowCard,
                !shadow.unlocked && styles.shadowCardLocked
              ]}
              onPress={() => {
                if (shadow.unlocked) {
                  setSelectedShadow(shadow);
                  setShowShadowModal(true);
                }
              }}
            >
              <Image
                source={{ uri: shadow.image }}
                style={styles.shadowCardImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.95)']}
                style={styles.shadowCardOverlay}
              >
                <View style={styles.shadowCardContent}>
                  <View style={styles.shadowCardHeader}>
                    <Text style={styles.shadowCardName}>{shadow.name}</Text>
                    <View style={[styles.rankBadge, { backgroundColor: getRankColor(shadow.rank) }]}>
                      <Text style={styles.shadowCardRank}>{shadow.rank}</Text>
                    </View>
                  </View>
                  <Text style={styles.shadowCardType}>{shadow.type}</Text>
                  <View style={styles.shadowCardStats}>
                    <View style={styles.statBar}>
                      <Text style={styles.statLabel}>ATK</Text>
                      <View style={styles.statBarBg}>
                        <View style={[styles.statBarFill, { width: `${shadow.stats.attack}%`, backgroundColor: '#ff4d4d' }]} />
                      </View>
                    </View>
                    <View style={styles.statBar}>
                      <Text style={styles.statLabel}>DEF</Text>
                      <View style={styles.statBarBg}>
                        <View style={[styles.statBarFill, { width: `${shadow.stats.defense}%`, backgroundColor: '#4dff4d' }]} />
                      </View>
                    </View>
                    <View style={styles.statBar}>
                      <Text style={styles.statLabel}>SPD</Text>
                      <View style={styles.statBarBg}>
                        <View style={[styles.statBarFill, { width: `${shadow.stats.speed}%`, backgroundColor: '#4d9fff' }]} />
                      </View>
                    </View>
                  </View>
                  {!shadow.unlocked && (
                    <View style={styles.lockContainer}>
                      <MaterialCommunityIcons name="lock" size={24} color="#4d9fff" />
                      <Text style={styles.lockText}>Reach Rank {shadow.rank}</Text>
                    </View>
                  )}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>
    </View>
  );

  const getRankColor = (rank) => {
    const colors = {
      'S': '#ff9900',
      'A': '#ff3366',
      'B': '#9933ff',
      'C': '#33cc33',
      'D': '#3399ff'
    };
    return colors[rank] || '#4d9fff';
  };

  const QuestCompleteNotification = ({ quest, visible }) => {
    if (!visible || !quest) return null;

    return (
      <Animated.View
        style={[
          styles.questCompleteNotification,
          {
            transform: [{
              scale: questCompleteAnimation
            }],
            opacity: questCompleteAnimation
          }
        ]}
      >
        <LinearGradient
          colors={['rgba(77, 159, 255, 0.9)', 'rgba(0, 102, 204, 0.9)']}
          style={styles.questCompleteGradient}
        >
          <MaterialCommunityIcons name="check-circle" size={30} color="#4dff4d" />
          <Text style={styles.questCompleteTitle}>Quest Complete!</Text>
          <Text style={styles.questCompleteName}>{quest.name}</Text>
          <Text style={styles.questCompleteXP}>+{quest.xp} XP</Text>
        </LinearGradient>
      </Animated.View>
    );
  };

  const LevelUpModal = ({ visible, stats }) => {
    if (!visible) return null;

    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="none"
      >
        <View style={styles.levelUpContainer}>
          <Animated.View
            style={[
              styles.levelUpContent,
              {
                transform: [{
                  scale: levelUpAnimation
                }]
              }
            ]}
          >
            <LinearGradient
              colors={['rgba(77, 159, 255, 0.9)', 'rgba(0, 102, 204, 0.9)']}
              style={styles.levelUpGradient}
            >
              <MaterialCommunityIcons name="star-circle" size={50} color="#ffd700" />
              <Text style={styles.levelUpTitle}>Level Up!</Text>
              <Text style={styles.levelUpLevel}>Level {stats.level}</Text>
              <View style={styles.levelUpStats}>
                <Text style={styles.levelUpStat}>Strength +5</Text>
                <Text style={styles.levelUpStat}>Agility +3</Text>
                <Text style={styles.levelUpStat}>Endurance +4</Text>
              </View>
            </LinearGradient>
          </Animated.View>
        </View>
      </Modal>
    );
  };

  // Add new state variables after the existing ones
  const [showGuildModal, setShowGuildModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [guildData, setGuildData] = useState({
    name: "Shadow Monarchs",
    level: 25,
    members: [
      { id: 1, name: "Sung Jin-Woo", rank: "S", role: "Leader", power: 999999 },
      { id: 2, name: "Cha Hae-In", rank: "S", role: "Officer", power: 85000 },
      { id: 3, name: "Woo Jin-Chul", rank: "A", role: "Member", power: 45000 },
    ],
    achievements: [
      { id: 1, name: "First S-Rank Clear", completed: true },
      { id: 2, name: "Guild War Champions", completed: true },
      { id: 3, name: "Red Gate Survivors", completed: false },
    ],
    currentQuest: {
      name: "Demon Castle Raid",
      difficulty: "S",
      reward: "Legendary Shadow Fragment",
      timeRemaining: "2d 14h",
    }
  });

  const [leaderboardData, setLeaderboardData] = useState({
    global: [
      { rank: 1, name: "Thomas Andre", power: 999999, guild: "Scavenger" },
      { rank: 2, name: "Liu Zhigang", power: 950000, guild: "Hunter's Association" },
      { rank: 3, name: "Christopher Reed", power: 900000, guild: "Knights" },
    ],
    local: [
      { rank: 1, name: "Go Gun-Hee", power: 850000, guild: "Korean Hunters" },
      { rank: 2, name: "Baek Yoon-Ho", power: 800000, guild: "White Tiger" },
      { rank: 3, name: "Cha Hae-In", power: 750000, guild: "Shadow Monarchs" },
    ],
    playerRank: {
      global: 15,
      local: 5,
      powerRating: 650000
    }
  });

  // Add new modal components before the return statement
  const GuildModal = ({ visible, onClose, data }) => {
    // ... GuildModal component code as provided ...
  };

  const LeaderboardModal = ({ visible, onClose, data }) => {
    // ... LeaderboardModal component code as provided ...
  };

  // Add new state variables for modals
  const [showShadowExtractionModal, setShowShadowExtractionModal] = useState(false);
  const [showMonsterGalleryModal, setShowMonsterGalleryModal] = useState(false);
  const [showSkillTreeModal, setShowSkillTreeModal] = useState(false);
  const [showBossRaidModal, setShowBossRaidModal] = useState(false);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [showReputationModal, setShowReputationModal] = useState(false);
  const [showGuildWarModal, setShowGuildWarModal] = useState(false);

  // Add new feature data states
  const [monsterCollection, setMonsterCollection] = useState([
    {
      id: 1,
      name: "High Orc",
      rank: "B",
      status: "Collected",
      image: "https://api.a0.dev/assets/image?text=fierce high orc warrior with battle scars&aspect=1:1",
      abilities: ["Berserker Rage", "Ground Slam"],
      extractable: true
    },
    {
      id: 2,
      name: "Ice Elf",
      rank: "A",
      status: "Not Collected",
      image: "https://api.a0.dev/assets/image?text=mystical ice elf with frost aura&aspect=1:1",
      abilities: ["Frost Nova", "Ice Shield"],
      extractable: true
    }
  ]);

  const [skillTree, setSkillTree] = useState({
    monarch: {
      name: "Shadow Monarch",
      level: 1,
      maxLevel: 5,
      skills: [
        {
          name: "Domain Expansion",
          level: 0,
          maxLevel: 3,
          description: "Expand your domain to strengthen shadow soldiers",
          unlocked: false
        },
        {
          name: "Shadow Extraction",
          level: 1,
          maxLevel: 5,
          description: "Extract shadows from defeated enemies",
          unlocked: true
        }
      ]
    },
    combat: {
      name: "Combat",
      level: 1,
      maxLevel: 5,
      skills: [
        {
          name: "Blade Mastery",
          level: 2,
          maxLevel: 5,
          description: "Increase damage with bladed weapons",
          unlocked: true
        }
      ]
    }
  });

  return (
    <ImageBackground
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
              {dailyQuests.map((quest: Quest) => (
                <QuestCard key={quest.id} quest={quest} />
              ))}
            </View>

            <TouchableOpacity 
              style={styles.dungeonButton}
              onPress={() => setShowDungeonModal(true)}
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

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setShowGuildModal(true)}
            >
              <LinearGradient
                colors={['#4d9fff', '#0066cc']}
                style={styles.menuButtonGradient}
              >
                <MaterialCommunityIcons name="shield-sword" size={24} color="white" />
                <Text style={styles.menuButtonText}>Guild Hall</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setShowLeaderboardModal(true)}
            >
              <LinearGradient
                colors={['#4d9fff', '#0066cc']}
                style={styles.menuButtonGradient}
              >
                <MaterialCommunityIcons name="trophy" size={24} color="white" />
                <Text style={styles.menuButtonText}>Rankings</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.featuresContainer}>
              <TouchableOpacity
                style={styles.featureButton}
                onPress={() => setShowMonsterGalleryModal(true)}
              >
                <LinearGradient
                  colors={['#4d9fff', '#0066cc']}
                  style={styles.featureButtonGradient}
                >
                  <MaterialCommunityIcons name="book-open-variant" size={24} color="white" />
                  <Text style={styles.featureButtonText}>Monster Gallery</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.featureButton}
                onPress={() => setShowSkillTreeModal(true)}
              >
                <LinearGradient
                  colors={['#4d9fff', '#0066cc']}
                  style={styles.featureButtonGradient}
                >
                  <MaterialCommunityIcons name="skill-tree" size={24} color="white" />
                  <Text style={styles.featureButtonText}>Skill Tree</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.featureButton}
                onPress={() => setShowBossRaidModal(true)}
              >
                <LinearGradient
                  colors={['#4d9fff', '#0066cc']}
                  style={styles.featureButtonGradient}
                >
                  <MaterialCommunityIcons name="sword-cross" size={24} color="white" />
                  <Text style={styles.featureButtonText}>Boss Raids</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.featureButton}
                onPress={() => setShowEquipmentModal(true)}
              >
                <LinearGradient
                  colors={['#4d9fff', '#0066cc']}
                  style={styles.featureButtonGradient}
                >
                  <MaterialCommunityIcons name="shield-sword" size={24} color="white" />
                  <Text style={styles.featureButtonText}>Equipment</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <Modal
            visible={showStatsModal}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowStatsModal(false)}
          >
            <View style={styles.modalContainer}>
              <BlurView intensity={100} style={styles.modalContent}>
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
                    <Text style={styles.chartTitle}>Strength Progress</Text>
                    <LineChart
                      data={{
                        labels: progressData.timestamps,
                        datasets: [{
                          data: progressData.strength
                        }]
                      }}
                      width={Dimensions.get('window').width - 40}
                      height={220}
                      chartConfig={{
                        backgroundColor: '#1a1a2e',
                        backgroundGradientFrom: '#1a1a2e',
                        backgroundGradientTo: '#16213e',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(255, 77, 77, ${opacity})`,
                        style: {
                          borderRadius: 16
                        }
                      }}
                      bezier
                      style={styles.chart}
                    />
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
              </BlurView>
            </View>
          </Modal>

          <Modal
            visible={showRankUpModal}
            transparent={true}
            animationType="fade"
          >
            <View style={styles.rankUpModalContainer}>
              <Animated.View 
                style={[
                  styles.rankUpContent,
                  {
                    transform: [{
                      scale: rankUpScale
                    }]
                  }
                ]}
              >
                <LinearGradient
                  colors={['#4d9fff', '#0066cc']}
                  style={styles.rankUpGradient}
                >
                  <MaterialCommunityIcons name="sword-cross" size={50} color="white" />
                  <Text style={styles.rankUpTitle}>Rank Up!</Text>
                  <Text style={styles.rankUpText}>
                    {hunterStats.previousRank} → {hunterStats.rank}
                  </Text>
                  <Text style={styles.rankUpSubtext}>
                    Your power grows stronger, hunter!
                  </Text>
                  <View style={styles.statsIncrease}>
                    <Text style={styles.statIncreaseText}>Strength +5</Text>
                    <Text style={styles.statIncreaseText}>Agility +3</Text>
                    <Text style={styles.statIncreaseText}>Endurance +4</Text>
                  </View>
                </LinearGradient>
              </Animated.View>
            </View>
          </Modal>

          <DungeonListModal
            visible={showDungeonModal}
            onClose={() => setShowDungeonModal(false)}
            dungeons={availableDungeons}
            onSelectDungeon={(dungeon) => {
              setSelectedDungeon(dungeon);
              setShowDungeonModal(false);
              setShowDungeonConfirmModal(true);
            }}
          />

          <DungeonConfirmModal
            visible={showDungeonConfirmModal}
            dungeon={selectedDungeon}
            onClose={() => {
              setShowDungeonConfirmModal(false);
              setSelectedDungeon(null);
            }}
            onEnter={() => {
              handleDungeonEntry(selectedDungeon);
            }}
          />

          <QuestCompleteNotification
            quest={completedQuest}
            visible={showQuestCompleteNotification}
          />
          
          <LevelUpModal
            visible={showLevelUpModal}
            stats={hunterStats}
          />

          <GuildModal
            visible={showGuildModal}
            onClose={() => setShowGuildModal(false)}
            data={guildData}
          />

          <LeaderboardModal
            visible={showLeaderboardModal}
            onClose={() => setShowLeaderboardModal(false)}
            data={leaderboardData}
          />
        </LinearGradient>
      </Animated.View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: 'rgba(0,0,0,0.7)',
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
  },
  shadowModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    flex: 1,
    marginTop: 80,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    backgroundColor: 'rgba(11, 22, 34, 0.98)',
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
  dungeonConfirmContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 25,
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: '10%',
    backgroundColor: 'rgba(11, 22, 34, 0.98)',
  },
  dungeonConfirmImage: {
    width: '100%',
    height: '100%',
  },
  dungeonConfirmOverlay: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-end',
  },
  dungeonConfirmTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  dungeonConfirmDetails: {
    marginBottom: 20,
  },
  dungeonConfirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dungeonConfirmText: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 10,
  },
  dungeonWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 77, 77, 0.2)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  dungeonWarningText: {
    color: '#ffffff',
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  dungeonConfirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  dungeonConfirmButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  dungeonCancelButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dungeonCancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  dungeonEnterButton: {
    overflow: 'hidden',
  },
  dungeonEnterGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dungeonEnterButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  questCompleteNotification: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    right: '10%',
    alignItems: 'center',
    zIndex: 1000,
  },
  questCompleteGradient: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: '100%',
  },
  questCompleteTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  questCompleteName: {
    color: 'white',
    fontSize: 18,
    marginBottom: 5,
  },
  questCompleteXP: {
    color: '#ffd700',
    fontSize: 20,
    fontWeight: 'bold',
  },
  levelUpContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  levelUpContent: {
    width: '80%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  levelUpGradient: {
    padding: 30,
    alignItems: 'center',
  },
  levelUpTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  levelUpLevel: {
    color: '#ffd700',
    fontSize: 24,
    marginBottom: 20,
  },
  levelUpStats: {
    alignItems: 'center',
  },
  levelUpStat: {
    color: 'white',
    fontSize: 18,
    marginVertical: 5,
  },
  menuButton: {
    margin: 10,
    marginHorizontal: 20,
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
  menuButtonGradient: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 148, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0, 148, 255, 0.5)',
  },
  menuButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  guildModalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 25,
    overflow: 'hidden',
  },
  featuresContainer: {
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureButton: {
    width: '48%',
    marginBottom: 10,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
  },
  featureButtonGradient: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  extractionModal: {
    width: '90%',
    height: '70%',
    borderRadius: 25,
    overflow: 'hidden',
  },
  extractionContent: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  extractionTitle: {
    color: '#4d9fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  extractionProgress: {
    height: 4,
    backgroundColor: '#4d9fff',
    borderRadius: 2,
    marginBottom: 10,
  },
  extractionText: {
    color: 'white',
    fontSize: 16,
  },
});

export default HunterDashboard;