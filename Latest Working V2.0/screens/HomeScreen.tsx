import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Modal,
  FlatList,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Slider from '@react-native-community/slider';

const HUNTER_RANKS = {
  E: { color: '#8B8B8B', title: 'E-Rank Hunter', requiredExp: 100, systemMessage: 'You have awakened as an E-Rank Hunter' },
  D: { color: '#CD7F32', title: 'D-Rank Hunter', requiredExp: 250, systemMessage: 'Your power has grown. You are now a D-Rank Hunter' },
  C: { color: '#C0C0C0', title: 'C-Rank Hunter', requiredExp: 500, systemMessage: 'Your potential increases. Welcome to C-Rank' },
  B: { color: '#FFD700', title: 'B-Rank Hunter', requiredExp: 1000, systemMessage: 'You have reached B-Rank. Few hunters achieve this level. IGRIS HAS BEEN UNLOCKED!' },
  A: { color: '#E5E4E2', title: 'A-Rank Hunter', requiredExp: 2500, systemMessage: 'A-Rank achieved. You stand among the elite. BERU HAS BEEN UNLOCKED!' },
  S: { color: '#45B6FE', title: 'S-Rank Hunter', requiredExp: 5000, systemMessage: 'S-RANK ACHIEVED. YOU HAVE REACHED THE PINNACLE OF HUNTERS' },
};

const DAILY_QUESTS = [
  {
    id: '1',
    title: 'Arise',
    description: 'Complete 50 push-ups to strengthen your shadow extraction',
    type: 'strength',
    reward: '500 EXP + Shadow Fragment',
    progress: 0,
    total: 50,
    type: 'daily',
    systemMessage: 'QUEST ALERT: Strengthen your authority over shadows',
  },
  {
    id: '2',
    title: 'Shadow Sovereign Training',
    description: 'Train with your shadow army for 30 minutes',
    reward: '750 EXP + Shadow Crystal',
    progress: 0,
    total: 30,
    type: 'daily',
    systemMessage: 'SYSTEM: Shadow Army training available',
  },
  {
    id: '3',
    title: 'Dungeon Clear',
    description: 'Complete a B-Rank training dungeon',
    reward: '1000 EXP + Skill Book',
    progress: 0,
    total: 1,
    type: 'daily',
    systemMessage: 'SYSTEM: B-Rank Dungeon detected nearby',
  },
  {
    id: '4',
    title: 'Monarch\'s Strength',
    description: 'Perform 100 squats to increase physical resistance',
    reward: '600 EXP + Strength Enhancement',
    progress: 0,
    total: 100,
    type: 'daily',
    systemMessage: 'QUEST ALERT: Enhance physical capabilities',
  },
  {
    id: '5',
    title: 'Shadow Extraction',
    description: 'Extract shadows from 5 training dummies',
    reward: '800 EXP + New Shadow Soldier',
    progress: 0,
    total: 5,
    type: 'daily',
    systemMessage: 'SYSTEM: Shadow Extraction available',
  }
];

const EQUIPMENT = [
  {
    id: '1',
    name: 'Shadow Knight Armor',
    type: 'Armor',
    rarity: 'Rare',
    stats: { defense: 45, agility: 15 },
    equipped: true,
  },
  {
    id: '2',
    name: 'Demon Slayer Bracers',
    type: 'Accessory',
    rarity: 'Epic',
    stats: { strength: 25, stamina: 20 },
    equipped: false,
  },
  {
    id: '3',
    name: 'Mystic Enhancement Core',
    type: 'Core',
    rarity: 'Legendary',
    stats: { allStats: 30 },
    equipped: false,
  },
];

const SHADOW_SOLDIERS = [
  {
    id: '1',
    name: 'Igris',
    level: 95,
    type: 'Knight Commander',
    skills: ['Sword Mastery', 'Knight\'s Loyalty', 'Shadow Command'],
    power: 15000,
    description: 'The loyal knight commander of the shadow army',
    image: 'https://api.a0.dev/assets/image?text=shadow%20knight%20commander%20with%20red%20armor%20and%20glowing%20eyes&aspect=1:1'
  },
  {
    id: '2',
    name: 'Beru',
    level: 90,
    type: 'Ant King',
    skills: ['Regeneration', 'Poison Strike', 'Overwhelming Power'],
    power: 14500,
    description: 'Former Ant King, now a powerful shadow soldier',
    image: 'https://api.a0.dev/assets/image?text=ant%20king%20warrior%20with%20sharp%20claws%20and%20glowing%20purple%20eyes&aspect=1:1'
  },
  {
    id: '3',
    name: 'Tank',
    level: 85,
    type: 'Heavy Infantry',
    skills: ['Iron Body', 'Shield Wall', 'Unbreakable Will'],
    power: 13000,
    description: 'An immovable fortress of the shadow army',
    image: 'https://api.a0.dev/assets/image?text=heavily%20armored%20shadow%20warrior%20with%20massive%20shield&aspect=1:1'
  },
  {
    id: '4',
    name: 'Kaisel',
    level: 88,
    type: 'Shadow Dragon',
    skills: ['Flight', 'Dragon\'s Breath', 'Aerial Supremacy'],
    power: 14000,
    description: 'A majestic shadow dragon mount',
    image: 'https://api.a0.dev/assets/image?text=majestic%20black%20dragon%20with%20glowing%20blue%20eyes&aspect=1:1'
  },
  {
    id: '5',
    name: 'Iron',
    level: 82,
    type: 'Shadow Knight',
    skills: ['Double Slash', 'Knight\'s Honor', 'Shadow Step'],
    power: 12500,
    description: 'An elite shadow knight of exceptional skill',
    image: 'https://api.a0.dev/assets/image?text=elite%20shadow%20knight%20with%20dual%20swords&aspect=1:1'
  },
];

const SystemNotification = ({ message, visible, onHide, type = 'normal' }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.delay(type === 'levelup' ? 4000 : 3000),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.delay(type === 'levelup' ? 3500 : 2500),
          Animated.spring(scaleAnim, {
            toValue: 0.8,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
        ]),
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: false,
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 1500,
              useNativeDriver: false,
            }),
          ]),
        ),
      ]).start(() => onHide());
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.systemNotification,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              }),
            },
          ],
        },
      ]}
    >
      <LinearGradient
        colors={['#45B6FE22', '#45B6FE44']}
        style={styles.systemGradient}
      >
        <Text style={styles.systemText}>{message}</Text>
      </LinearGradient>
    </Animated.View>
  );
};

export default function HunterDashboard() {
  const [isPlayer, setIsPlayer] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentRank, setCurrentRank] = useState('E');
  const [level, setLevel] = useState(1);
  const [exp, setExp] = useState(0);
  const [stats, setStats] = useState({
    strength: 10,
    agility: 10,
    stamina: 10
  });
  const [completedTasks, setCompletedTasks] = useState({});
  const [globalRank, setGlobalRank] = useState(0);
  const [powerLevel, setPowerLevel] = useState(0);

  const WelcomeModal = () => (
    <Modal
      visible={showWelcome}
      transparent={true}
      animationType="fade"
    >
      <BlurView intensity={100} style={styles.systemModal}>
        <LinearGradient
          colors={['#1a1a1a', '#2a2a2a']}
          style={styles.systemMessageContainer}
        >
          <Animated.Text style={styles.systemTitle}>
            SYSTEM
          </Animated.Text>
          <Text style={styles.systemMessage}>
            DO YOU WANT TO BECOME A PLAYER?
          </Text>
          <View style={styles.systemButtons}>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => {
                setIsPlayer(true);
                setShowWelcome(false);
                showSystemMessage("YOU HAVE BECOME A PLAYER");
                setTimeout(() => {
                  showSystemMessage("SYSTEM TUTORIAL WILL NOW BEGIN");
                }, 2000);
              }}
            >
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.declineButton}
              onPress={() => setShowWelcome(false)}
            >
              <Text style={styles.buttonText}>Decline</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </BlurView>
    </Modal>
  );  const completeTask = (taskId) => {
    if (completedTasks[taskId]) return;

    const task = DAILY_QUESTS.find(q => q.id === taskId);
    if (!task) return;

    // Parse EXP from reward
    const expGain = parseInt(task.reward.split(' ')[0]);
    
    // Show SYSTEM notification
    showSystemMessage(task.systemMessage, 'quest');
    
    // Update stats automatically based on task type
    const newStats = { ...stats };
    newStats.strength += 5;
    newStats.agility += 5;
    newStats.stamina += 5;
    
    setStats(newStats);
    setCompletedTasks({ ...completedTasks, [taskId]: true });
    
    // Show completion message with animation
    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start(() => {
      showSystemMessage(`QUEST COMPLETE!\n${task.reward}`, 'completion');
      
      // Check level up immediately
      checkLevelUp(expGain);
      
      // Update power level
      const newPowerLevel = calculatePowerLevel(newStats);
      setPowerLevel(newPowerLevel);
      
      // Check for shadow soldier unlocks
      if (currentRank === 'B' && !completedTasks['igris_unlock']) {
        setTimeout(() => {
          showSystemMessage('NEW SHADOW SOLDIER AVAILABLE: IGRIS', 'shadow');
          setCompletedTasks(prev => ({ ...prev, igris_unlock: true }));
        }, 1000);
      } else if (currentRank === 'A' && !completedTasks['beru_unlock']) {
        setTimeout(() => {
          showSystemMessage('NEW SHADOW SOLDIER AVAILABLE: BERU', 'shadow');
          setCompletedTasks(prev => ({ ...prev, beru_unlock: true }));
        }, 1000);
      }
    });
  };

  const calculatePowerLevel = (stats) => {
    return Math.floor((stats.strength + stats.agility + stats.stamina) * level * 100);
  };

  useEffect(() => {
    // Simulate global ranking
    const interval = setInterval(() => {
      setGlobalRank(Math.floor(Math.random() * 10000) + 1);
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  const [systemMessage, setSystemMessage] = useState('');
  const [showSystem, setShowSystem] = useState(false);  const checkLevelUp = (newExp) => {
    const totalExp = exp + newExp;
    
    // Check for rank up first
    let newRank = currentRank;
    Object.entries(HUNTER_RANKS).reverse().forEach(([rank, data]) => {
      if (totalExp >= data.requiredExp && currentRank !== rank) {
        newRank = rank;
        showSystemMessage(data.systemMessage, 'rankup');
        
        // Unlock shadow soldier if applicable
        if (rank === 'B') {
          setTimeout(() => {
            showSystemMessage('NEW SHADOW SOLDIER AVAILABLE: IGRIS', 'shadow');
            // Add shadow soldier unlock animation and logic here
          }, 2000);
        } else if (rank === 'A') {
          setTimeout(() => {
            showSystemMessage('NEW SHADOW SOLDIER AVAILABLE: BERU', 'shadow');
            // Add shadow soldier unlock animation and logic here
          }, 2000);
        }
      }
    });

    if (newRank !== currentRank) {
      setCurrentRank(newRank);
      // Trigger rank up animation
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.5,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }

    // Level up logic
    const levelThreshold = 100;
    const currentTotalExp = totalExp % levelThreshold;
    const levelsGained = Math.floor(totalExp / levelThreshold);

    if (levelsGained > 0) {
      const newLevel = level + levelsGained;
      setLevel(newLevel);
      setExp(currentTotalExp);
      showSystemNotification(`LEVEL UP!\nYou are now level ${newLevel}`);
      
      // Trigger level up animation
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      setExp(currentTotalExp);
    }
  };

  const showSystemNotification = (message) => {
    setSystemMessage(message);
    setShowSystem(true);
    // Auto hide after 3 seconds
    setTimeout(() => setShowSystem(false), 3000);
  };

  const completeQuest = (quest) => {
    const newExp = exp + parseInt(quest.reward.split(' ')[0]);
    checkLevelUp(newExp);
    setSystemMessage(`QUEST COMPLETE!\n${quest.reward}`);
    setShowSystem(true);
  };
  const [shadowArmy, setShadowArmy] = useState(3);
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);
  const [showShadowModal, setShowShadowModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [workoutProgress, setWorkoutProgress] = useState(0);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const workoutAnim = useRef(new Animated.Value(0)).current;
  const shadowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startBaseAnimations();
  }, []);

  const startBaseAnimations = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  const startWorkout = (type) => {
    setCurrentWorkout(type);
    setWorkoutProgress(0);
    setShowWorkoutModal(true);
    Animated.timing(workoutAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const updateWorkoutProgress = (value) => {
    setWorkoutProgress(value);
    if (value >= 100) {
      completeWorkout();
    }
  };

  const completeWorkout = () => {
    Animated.timing(workoutAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setShowWorkoutModal(false);
      setCurrentWorkout(null);
      // Add rewards logic here
    });
  };  const renderQuestItem = ({ item }) => (
  <View style={[styles.questCard, { opacity: completedTasks[item.id] ? 0.7 : 1 }]}>
    <LinearGradient
      colors={['#1f1f1f', '#2a2a2a']}
      style={[
        styles.questGradient,
        completedTasks[item.id] && styles.questGradientCompleted
      ]}
    >
      <View style={styles.questHeader}>
        <Text style={styles.questSystemMessage}>{item.systemMessage}</Text>
      </View>
      <View style={styles.questContent}>
        <Text style={styles.questTitle}>{item.title}</Text>
        <Text style={styles.questDescription}>{item.description}</Text>
        <Text style={styles.questReward}>{item.reward}</Text>
      </View>
      <TouchableOpacity
        style={styles.questTick}
        onPress={() => { if (!completedTasks[item.id]) completeTask(item.id); }}
      >
        {completedTasks[item.id] ? (
          <MaterialCommunityIcons name="check-circle" size={24} color="#45B6FE" />
        ) : (
          <MaterialCommunityIcons name="checkbox-blank-circle-outline" size={24} color="#45B6FE" />
        )}
      </TouchableOpacity>
    </LinearGradient>
  </View>
);

  const renderEquipmentItem = ({ item }) => (
    <TouchableOpacity style={styles.equipmentCard}>
      <LinearGradient
        colors={['#1a1a1a', '#2a2a2a']}
        style={styles.equipmentGradient}
      >
        <View style={styles.equipmentHeader}>
          <Text style={[styles.equipmentName, { color: getRarityColor(item.rarity) }]}>
            {item.name}
          </Text>
          {item.equipped && (
            <View style={styles.equippedBadge}>
              <Text style={styles.equippedText}>Equipped</Text>
            </View>
          )}
        </View>
        <Text style={styles.equipmentType}>{item.type}</Text>
        <View style={styles.statsContainer}>
          {Object.entries(item.stats).map(([stat, value]) => (
            <Text key={stat} style={styles.statText}>
              {stat.charAt(0).toUpperCase() + stat.slice(1)}: +{value}
            </Text>
          ))}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderShadowSoldier = ({ item }) => (
    <TouchableOpacity style={styles.shadowCard}>
      <LinearGradient
        colors={['#1a1a1a', '#2a2a2a']}
        style={styles.shadowGradient}
      >
        <View style={styles.shadowHeader}>
          <Text style={styles.shadowName}>{item.name}</Text>
          <Text style={styles.shadowLevel}>Level {item.level}</Text>
        </View>
        <Text style={styles.shadowType}>{item.type}</Text>
        <View style={styles.shadowStats}>
          <Text style={styles.shadowPower}>Power: {item.power}</Text>
          <View style={styles.skillsContainer}>
            {item.skills.map((skill, index) => (
              <View key={index} style={styles.skillBadge}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Common':
        return '#8B8B8B';
      case 'Rare':
        return '#45B6FE';
      case 'Epic':
        return '#A335EE';
      case 'Legendary':
        return '#FF8C00';
      default:
        return '#FFFFFF';
    }
  };  return (
    <ScrollView style={styles.container}>
      <WelcomeModal />
      <SystemNotification 
        message={systemMessage}
        visible={showSystem}
        onHide={() => setShowSystem(false)}
      />
      <LinearGradient
        colors={['#111111', '#1a1a1a']}
        style={styles.headerGradient}
      >
        <Animated.View
          style={[
            styles.rankBadge,
            {
              transform: [{ scale: pulseAnim }],
              shadowColor: HUNTER_RANKS[currentRank].color,
              shadowOpacity: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.5, 0.8],
              }),
            },
          ]}
        >
          <Text style={[styles.rankText, { color: HUNTER_RANKS[currentRank].color }]}>
            {currentRank}
          </Text>
        </Animated.View>
        <Text style={styles.rankTitle}>{HUNTER_RANKS[currentRank].title}</Text>
        <View style={styles.expBar}>
          <LinearGradient
            colors={['#45B6FE', '#2193b0']}
            style={[styles.expFill, { width: `${exp}%` }]}
          />
        </View>
        <Text style={styles.expText}>
          Level {level} • {exp}/100 EXP
        </Text>
      </LinearGradient>

      <Text style={styles.sectionTitle}>Daily Quests</Text>
      <FlatList
        data={DAILY_QUESTS}
        renderItem={renderQuestItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.questList}
      />

      <View style={styles.statsContainer}>
        <TouchableOpacity 
          style={styles.statBox}
          onPress={() => startWorkout('strength')}
        >
          <LinearGradient
            colors={['#1a1a1a', '#2a2a2a']}
            style={styles.statGradient}
          >          <MaterialCommunityIcons style={styles.neonGlow} name="arm-flex" size={24} color="#45B6FE" />
            <Text style={styles.statValue}>128</Text>
            <Text style={styles.statTitle}>Strength</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.statBox}
          onPress={() => startWorkout('agility')}
        >
          <LinearGradient
            colors={['#1a1a1a', '#2a2a2a']}
            style={styles.statGradient}
          >          <MaterialCommunityIcons style={styles.neonGlow} name="lightning-bolt" size={24} color="#45B6FE" />
            <Text style={styles.statValue}>95</Text>
            <Text style={styles.statTitle}>Agility</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.statBox}
          onPress={() => startWorkout('stamina')}
        >
          <LinearGradient
            colors={['#1a1a1a', '#2a2a2a']}
            style={styles.statGradient}
          >          <MaterialCommunityIcons style={styles.neonGlow} name="heart-pulse" size={24} color="#45B6FE" />
            <Text style={styles.statValue}>156</Text>
            <Text style={styles.statTitle}>Stamina</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.shadowArmySection}>
        <TouchableOpacity
          onPress={() => setShowShadowModal(true)}
        >
          <LinearGradient
            colors={['#1a1a1a', '#2a2a2a']}
            style={styles.shadowArmyCard}
          >
            <View style={styles.shadowArmyHeader}>
              <MaterialCommunityIcons name="account-group" size={24} color="#45B6FE" />
              <Text style={styles.shadowArmyTitle}>Shadow Army</Text>
            </View>
            <Text style={styles.shadowArmyCount}>{shadowArmy} Shadows Arise</Text>
            <TouchableOpacity 
              style={styles.summonButton}
              onPress={() => {
                // Add summon animation and logic
                setShadowArmy(prev => prev + 1);
              }}
            >
              <Text style={styles.summonButtonText}>Summon Shadows</Text>
            </TouchableOpacity>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <View style={styles.inventorySection}>
        <TouchableOpacity
          style={styles.inventoryButton}
          onPress={() => setShowInventoryModal(true)}
        >
          <LinearGradient
            colors={['#1a1a1a', '#2a2a2a']}
            style={styles.inventoryGradient}
          >
            <MaterialCommunityIcons name="bag-personal" size={24} color="#45B6FE" />
            <Text style={styles.inventoryButtonText}>Equipment</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Workout Modal */}
      <Modal
        visible={showWorkoutModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <BlurView intensity={100} style={styles.modalBlur}>
            <View style={styles.workoutModal}>
              <Text style={styles.workoutTitle}>
                {currentWorkout?.charAt(0).toUpperCase() + currentWorkout?.slice(1)} Training
              </Text>
              <Animated.View
                style={[
                  styles.workoutProgress,
                  {
                    transform: [
                      {
                        scale: workoutAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0.9, 1],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Slider
                  style={styles.workoutSlider}
                  minimumValue={0}
                  maximumValue={100}
                  value={workoutProgress}
                  onValueChange={updateWorkoutProgress}
                  minimumTrackTintColor="#45B6FE"
                  maximumTrackTintColor="#2a2a2a"
                />
                <Text style={styles.workoutProgressText}>{Math.round(workoutProgress)}%</Text>
              </Animated.View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowWorkoutModal(false)}
              >
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </Modal>

      {/* Shadow Army Modal */}
      <Modal
        visible={showShadowModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <BlurView intensity={100} style={styles.modalBlur}>
            <View style={styles.shadowModal}>
              <Text style={styles.modalTitle}>Shadow Army</Text>
              <FlatList
                data={SHADOW_SOLDIERS}
                renderItem={renderShadowSoldier}
                keyExtractor={(item) => item.id}
                style={styles.shadowList}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowShadowModal(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </Modal>

      {/* Equipment Modal */}
      <Modal
        visible={showInventoryModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <BlurView intensity={100} style={styles.modalBlur}>
            <View style={styles.inventoryModal}>
              <Text style={styles.modalTitle}>Equipment</Text>
              <FlatList
                data={EQUIPMENT}
                renderItem={renderEquipmentItem}
                keyExtractor={(item) => item.id}
                style={styles.equipmentList}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowInventoryModal(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </Modal>
    </ScrollView>
  );
}  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#111111',
    },    questCard: {
      marginBottom: 10,
      width: 280,
      alignSelf: 'center',
      borderRadius: 15,
      overflow: 'hidden',
      shadowColor: '#45B6FE',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 10,
    },    questSystemMessage: {
      color: '#45B6FE',
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 5,
      textShadowColor: '#45B6FE',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 10,
    },
  questCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#45B6FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  questCheckboxCompleted: {
    backgroundColor: '#45B6FE',
  },
  questGradientCompleted: {
    borderColor: '#45B6FE44',
  },
  systemTitle: {
    color: '#45B6FE',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: '#45B6FE',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    marginBottom: 20,
  },
  systemMessage: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  systemButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  systemModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  systemMessageContainer: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#45B6FE',
    alignItems: 'center',
  },
  systemTitle: {
    color: '#45B6FE',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textShadowColor: '#45B6FE',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  systemMessage: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  systemButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  acceptButton: {
    backgroundColor: '#45B6FE22',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#45B6FE',
  },
  declineButton: {
    backgroundColor: '#FF000022',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FF0000',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  questTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#45B6FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  questCheckboxCompleted: {
    backgroundColor: '#45B6FE',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  systemModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  systemMessageContainer: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#45B6FE',
    alignItems: 'center',
  },
  systemTitle: {
    color: '#45B6FE',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textShadowColor: '#45B6FE',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  systemMessage: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  systemButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  acceptButton: {
    backgroundColor: '#45B6FE22',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#45B6FE',
  },
  declineButton: {
    backgroundColor: '#FF000022',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FF0000',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  questCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#45B6FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  questCheckboxCompleted: {
    backgroundColor: '#45B6FE',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  globalRankContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#45B6FE22',
  },
  globalRankTitle: {
    color: '#45B6FE',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  globalRankText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  powerLevelText: {
    color: '#45B6FE',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  systemNotification: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 1000,
  },  systemGradient: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#45B6FE',
    backgroundColor: 'rgba(0,0,0,0.7)',
    shadowColor: '#45B6FE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },  systemText: {
    color: '#45B6FE',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    textShadowColor: '#45B6FE',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  container: {
    flex: 1,
    backgroundColor: '#111111',
  },
  headerGradient: {
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  rankBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#45B6FE',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
  },
  rankText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  rankTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  expBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#2a2a2a',
    borderRadius: 4,
    overflow: 'hidden',
  },
  expFill: {
    height: '100%',
    borderRadius: 4,
  },
  expText: {
    color: '#ffffff',
    marginTop: 8,
    fontSize: 14,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 15,
  },
  questList: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  questCard: {
    width: 300,
    marginRight: 15,
  },  questGradient: {
    padding: 15,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#45B6FE',
    backgroundColor: 'rgba(0,0,0,0.5)',
    shadowColor: '#45B6FE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  questTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  questProgress: {
    backgroundColor: '#45B6FE22',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  questProgressText: {
    color: '#45B6FE',
    fontWeight: 'bold',
  },
  questDescription: {
    color: '#888888',
    fontSize: 14,
    marginBottom: 10,
  },
  questReward: {
    color: '#45B6FE',
    fontSize: 14,
    marginBottom: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#2a2a2a',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingHorizontal: 10,
  },    statBox: {
      width: '30%',
      marginHorizontal: 5,
    },    statGradient: {
      padding: 15,
      borderRadius: 15,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(69, 182, 254, 0.5)',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      shadowColor: '#45B6FE',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 10,
    },
  statValue: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  statTitle: {
    color: '#888888',
    fontSize: 12,
    marginTop: 5,
  },
  shadowArmySection: {
    padding: 15,
  },
  shadowArmyCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#45B6FE22',
  },
  shadowArmyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  shadowArmyTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  shadowArmyCount: {
    color: '#45B6FE',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  summonButton: {
    backgroundColor: '#45B6FE22',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  summonButtonText: {
    color: '#45B6FE',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBlur: {
    width: '90%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  workoutModal: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  workoutTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  workoutProgress: {
    width: '100%',
    alignItems: 'center',
  },
  workoutSlider: {
    width: '100%',
    height: 40,
  },
  workoutProgressText: {
    color: '#ffffff',
    fontSize: 18,
    marginTop: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#45B6FE22',
    padding: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#45B6FE',
    fontWeight: 'bold',
  },
  shadowModal: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 20,
    width: '100%',
    maxHeight: '80%',
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  shadowList: {
    maxHeight: 400,
  },
  shadowCard: {
    marginBottom: 15,
  },
  shadowGradient: {
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#45B6FE22',
  },
  shadowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  shadowName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  shadowLevel: {
    color: '#45B6FE',
    fontSize: 16,
  },
  shadowType: {
    color: '#888888',
    fontSize: 14,
    marginBottom: 10,
  },
  shadowStats: {
    marginTop: 10,
  },
  shadowPower: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 10,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillBadge: {
    backgroundColor: '#45B6FE22',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 5,
  },
  skillText: {
    color: '#45B6FE',
    fontSize: 12,
  },
  inventorySection: {
    padding: 15,
  },
  inventoryButton: {
    marginBottom: 20,
  },
  inventoryGradient: {
    padding: 15,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#45B6FE22',
  },
  inventoryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  inventoryModal: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 20,
    width: '100%',
    maxHeight: '80%',
  },
  equipmentList: {
    maxHeight: 400,
  },
  equipmentCard: {
    marginBottom: 15,
  },
  equipmentGradient: {
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#45B6FE22',
  },
  equipmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  equipmentName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  equipmentType: {
    color: '#888888',
    fontSize: 14,
    marginBottom: 10,
  },
  equippedBadge: {
    backgroundColor: '#45B6FE22',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  equippedText: {
    color: '#45B6FE',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    marginTop: 10,
  },  statText: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 5,
  },
  questContent: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  questTick: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
});