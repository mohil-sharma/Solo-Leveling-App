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
  });  const [shadows, setShadows] = useState([
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
  const [summoningAnimation] = useState(new Animated.Value(0));  const [showDungeonModal, setShowDungeonModal] = useState(false);
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
      await questSound.loadAsync(require('../assets/sounds/quest-complete.mp3'));
      
      const rankSound = new Audio.Sound();
      await rankSound.loadAsync(require('../assets/sounds/rank-up.mp3'));
      
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
  };  const [rewardAnimation] = useState(new Animated.Value(0));
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
        setShowConfetti(true);        celebrateRankUp();
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

  const QuestCard = ({ quest }) => {
    const toggleComplete = () => {
      setDailyQuests(prev => 
        prev.map(q => 
          q.id === quest.id 
            ? { ...q, completed: !q.completed }
            : q
        )
      );      if (!quest.completed) {
        playQuestSound();
        checkRankUp(quest.xp);
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

  const DungeonCard = ({ dungeon }) => (
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
          </View>        </LinearGradient>
      </ScrollView>

      {/* Modals */}
      {renderShadowModal()}
      {renderRankUpModal()}
      {renderRewardModal()}
      {renderStatsModal()}
      {renderDungeonModal()}
    </LinearGradient>
  </Animated.View>
</ImageBackground>

        {/* Modals */}
        {renderShadowModal()}
        {renderRankUpModal()}
        {renderRewardModal()}
        {renderStatsModal()}
        {renderDungeonModal()}
      </ImageBackground>
    </TouchableOpacity>
  );  const startSummoningAnimation = () => {
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
              <Text style={styles.shadowTitle}>ARISE!</Text>            <Image
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
};  return (
    <ImageBackground
      source={{ uri: 'https://api.a0.dev/assets/image?text=dark mystical dungeon with blue magical energy&aspect=9:16' }}
      style={styles.container}
    >
      <Animated.View style={styles.animatedBackground}>
        <LinearGradient
          colors={['rgba(10, 10, 26, 0.95)', 'rgba(11, 22, 34, 0.95)']}
          style={StyleSheet.absoluteFill}
        >          {Array.from({ length: 20 }).map((_, index) => (
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
          )}          <ScrollView style={styles.scrollView}>
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
        </TouchableOpacity>        <TouchableOpacity 
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
                </View>        </View>

        {hunterStats.unlockedShadows && renderShadowArmy()}
      </ScrollView>

      {renderShadowModal()}
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

      <Modal
        visible={showDungeonModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDungeonModal(false)}
      >
        <View style={styles.modalContainer}>
          <BlurView intensity={100} style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Available Dungeons</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowDungeonModal(false)}
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.dungeonList}>
              {availableDungeons.map(dungeon => (
                <DungeonCard key={dungeon.id} dungeon={dungeon} />
              ))}        <TouchableOpacity 
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
                </View>        </View>

        {hunterStats.unlockedShadows && renderShadowArmy()}
      </ScrollView>

      {renderShadowModal()}

      {/* Reward Box Modal */}
      <Modal
        visible={showRewardBox}
        transparent={true}
        animationType="none"
      >
        <BlurView intensity={100} style={styles.rewardModalContainer}>
          <Animated.View 
            style={[
              styles.rewardBox,
              {
                transform: [
                  {
                    scale: rewardAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1]
                    })
                  },
                  {
                    rotate: rewardAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg']
                    })
                  }
                ],
                opacity: rewardAnimation
              }
            ]}
          >
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
                    {currentReward.amount}x {currentReward.rarity.charAt(0).toUpperCase() + currentReward.rarity.slice(1)} Dungeon Key
                  </Text>
                  <View style={styles.rarityBadge}>
                    <Text style={styles.rarityText}>{currentReward.rarity.toUpperCase()}</Text>
                  </View>
                </>
              )}
            </LinearGradient>
          </Animated.View>
        </BlurView>
      </Modal>            </ScrollView>
          </LinearGradient>
        </Animated.View>

        {/* Modals */}
        {renderShadowModal()}
        {renderRankUpModal()}
        {renderRewardModal()}
        {renderStatsModal()}
        {renderDungeonModal()}
      </ImageBackground>
  );
};

const styles = StyleSheet.create({  animatedBackground: {
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
  },  shadowModalContent: {
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
  },  rankUpContent: {
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
  },
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  scrollView: {
    flex: 1,
  },  header: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(11, 22, 34, 0.8)', // Slightly transparent dark blue
    borderRadius: 15,
    margin: 10,
    shadowColor: "#0094FF", // Solo Leveling's iconic blue
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
    backgroundColor: 'rgba(0, 148, 255, 0.2)', // Transparent Solo Leveling blue
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#0094FF',
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
  },  shadowModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },  shadowModalContent: {
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
  },  statsContainer: {
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
    backgroundColor: 'rgba(0, 148, 255, 0.05)', // Very subtle blue tint
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
  },  questCard: {
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
    backgroundColor: 'rgba(0, 148, 255, 0.05)', // Very subtle blue tint
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
  },  dungeonButton: {
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
    backgroundColor: 'rgba(0, 148, 255, 0.15)', // Solo Leveling blue with transparency
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
  },  modalContent: {
    flex: 1,
    marginTop: 80,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    backgroundColor: 'rgba(11, 22, 34, 0.98)', // Almost solid dark blue
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
  },  dungeonCard: {
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

export default HunterDashboard;