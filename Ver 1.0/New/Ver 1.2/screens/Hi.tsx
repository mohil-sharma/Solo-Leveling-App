// Add these new state variables at the beginning of your component
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

// Add these components after your existing modal components
const GuildModal = ({ visible, onClose, data }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <LinearGradient
          colors={['rgba(11, 22, 34, 0.98)', 'rgba(26, 26, 46, 0.98)']}
          style={styles.guildModalContent}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.guildTitle}>{data.name}</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#4d9fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.guildScrollContent}>
            {/* Guild Level */}
            <View style={styles.guildInfoSection}>
              <Text style={styles.guildLevel}>Guild Level {data.level}</Text>
              <View style={styles.guildXPBar}>
                <View style={[styles.guildXPFill, { width: '75%' }]} />
              </View>
            </View>

            {/* Current Quest */}
            <View style={styles.questSection}>
              <LinearGradient
                colors={['rgba(77, 159, 255, 0.2)', 'rgba(0, 102, 204, 0.2)']}
                style={styles.currentQuest}
              >
                <Text style={styles.questTitle}>{data.currentQuest.name}</Text>
                <Text style={styles.questDifficulty}>Rank {data.currentQuest.difficulty}</Text>
                <Text style={styles.questReward}>{data.currentQuest.reward}</Text>
                <Text style={styles.questTime}>{data.currentQuest.timeRemaining}</Text>
              </LinearGradient>
            </View>

            {/* Members List */}
            <View style={styles.membersSection}>
              <Text style={styles.sectionTitle}>Members</Text>
              {data.members.map((member) => (
                <View key={member.id} style={styles.memberRow}>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberRole}>{member.role}</Text>
                  </View>
                  <View style={styles.memberStats}>
                    <Text style={styles.memberRank}>Rank {member.rank}</Text>
                    <Text style={styles.memberPower}>{member.power.toLocaleString()}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Achievements */}
            <View style={styles.achievementsSection}>
              <Text style={styles.sectionTitle}>Achievements</Text>
              {data.achievements.map((achievement) => (
                <View key={achievement.id} style={styles.achievementRow}>
                  <MaterialCommunityIcons
                    name={achievement.completed ? "check-circle" : "circle-outline"}
                    size={24}
                    color={achievement.completed ? "#4dff4d" : "#666"}
                  />
                  <Text style={[
                    styles.achievementText,
                    achievement.completed && styles.achievementCompleted
                  ]}>
                    {achievement.name}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const LeaderboardModal = ({ visible, onClose, data }) => {
  const [activeTab, setActiveTab] = useState('global');

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <LinearGradient
          colors={['rgba(11, 22, 34, 0.98)', 'rgba(26, 26, 46, 0.98)']}
          style={styles.leaderboardModalContent}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.leaderboardTitle}>Hunter Rankings</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#4d9fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'global' && styles.activeTab]}
              onPress={() => setActiveTab('global')}
            >
              <Text style={[styles.tabText, activeTab === 'global' && styles.activeTabText]}>
                Global
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'local' && styles.activeTab]}
              onPress={() => setActiveTab('local')}
            >
              <Text style={[styles.tabText, activeTab === 'local' && styles.activeTabText]}>
                Local
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.leaderboardScrollContent}>
            {/* Player's Rank */}
            <View style={styles.playerRankSection}>
              <Text style={styles.playerRankTitle}>Your Ranking</Text>
              <View style={styles.playerRankInfo}>
                <Text style={styles.playerRankText}>
                  #{data.playerRank[activeTab]} {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </Text>
                <Text style={styles.playerPowerText}>
                  Power: {data.playerRank.powerRating.toLocaleString()}
                </Text>
              </View>
            </View>

            {/* Rankings List */}
            <View style={styles.rankingsSection}>
              {data[activeTab].map((hunter, index) => (
                <View key={index} style={styles.rankRow}>
                  <View style={styles.rankInfo}>
                    <Text style={styles.rankNumber}>#{hunter.rank}</Text>
                    <Text style={styles.rankedName}>{hunter.name}</Text>
                  </View>
                  <View style={styles.rankStats}>
                    <Text style={styles.guildName}>{hunter.guild}</Text>
                    <Text style={styles.powerRating}>{hunter.power.toLocaleString()}</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </LinearGradient>
      </View>
    </Modal>
  );
};

// Add these new styles
const styles = StyleSheet.create({
  // ... existing styles ...
  
  // Guild Modal Styles
  guildModalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 25,
    overflow: 'hidden',
  },
  guildScrollContent: {
    padding: 20,
  },
  guildTitle: {
    color: '#4d9fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  guildInfoSection: {
    marginBottom: 20,
  },
  guildLevel: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  guildXPBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  guildXPFill: {
    height: '100%',
    backgroundColor: '#4d9fff',
    borderRadius: 3,
  },
  questSection: {
    marginBottom: 20,
  },
  currentQuest: {
    padding: 15,
    borderRadius: 10,
  },
  questTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  questDifficulty: {
    color: '#4d9fff',
    fontSize: 14,
  },
  questReward: {
    color: '#ffd700',
    fontSize: 14,
  },
  questTime: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.7,
  },
  membersSection: {
    marginBottom: 20,
  },
  memberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    color: '#fff',
    fontSize: 16,
  },
  memberRole: {
    color: '#4d9fff',
    fontSize: 12,
  },
  memberStats: {
    alignItems: 'flex-end',
  },
  memberRank: {
    color: '#ffd700',
    fontSize: 14,
  },
  memberPower: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.7,
  },
  
  // Leaderboard Modal Styles
  leaderboardModalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 25,
    overflow: 'hidden',
  },
  leaderboardTitle: {
    color: '#4d9fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4d9fff',
  },
  tabText: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.7,
  },
  activeTabText: {
    opacity: 1,
    fontWeight: 'bold',
  },
  playerRankSection: {
    padding: 20,
    backgroundColor: 'rgba(77, 159, 255, 0.1)',
    marginBottom: 20,
  },
  playerRankTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  playerRankInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  playerRankText: {
    color: '#4d9fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  playerPowerText: {
    color: '#ffd700',
    fontSize: 16,
  },
  rankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  rankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankNumber: {
    color: '#4d9fff',
    fontSize: 16,
    width: 50,
  },
  rankedName: {
    color: '#fff',
    fontSize: 16,
  },
  rankStats: {
    alignItems: 'flex-end',
  },
  guildName: {
    color: '#4d9fff',
    fontSize: 12,
  },
  powerRating: {
    color: '#ffd700',
    fontSize: 14,
  },
});

// Add these buttons to your ScrollView, before the closing tag
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

// Add these modal components to your render method, before the closing View tag
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

