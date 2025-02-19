import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';

interface Styles {
  // Existing styles...
  statBarContainer: ViewStyle;
  statBar: ViewStyle;
  scrollView: ViewStyle;
  header: ViewStyle;
  rankBadge: ViewStyle;
  rankText: TextStyle;
  levelInfo: ViewStyle;
  levelText: TextStyle;
  dungeonButton: ViewStyle;
  dungeonGradient: ViewStyle;
  dungeonButtonText: TextStyle;
  statsButton: ViewStyle;
  statsButtonGradient: ViewStyle;
  statsButtonText: TextStyle;
  modalContainer: ViewStyle;
  modalContent: ViewStyle;
  modalHeader: ViewStyle;
  modalTitle: TextStyle;
  closeButton: ViewStyle;
  statsModalContent: ViewStyle;
  chartContainer: ViewStyle;
  chartTitle: TextStyle;
  progressBar: ViewStyle;
  chart: ViewStyle;
  progressFill: ViewStyle;
  progressText: TextStyle;
  container: ViewStyle;
  questCompletePopup: ViewStyle;
  questCompleteGradient: ViewStyle;
  questCompleteText: TextStyle;
  questRewardText: TextStyle;
  levelUpContainer: ViewStyle;
  levelUpEffect: ViewStyle;
  levelUpText: TextStyle;
  particle: ViewStyle;
  animatedBackground: ViewStyle;
  particleEffect: ViewStyle;
  confettiContainer: ViewStyle;
  confettiPiece: ViewStyle;
  keyContainer: ViewStyle;
  keyText: TextStyle;
  statsContainer: ViewStyle;
  statsGradient: ViewStyle;
  statRow: ViewStyle;
  statLabel: TextStyle;
  statValue: TextStyle;
  sectionTitle: TextStyle;
  questsContainer: ViewStyle;
  questCard: ViewStyle;
  questGradient: ViewStyle;
  questHeader: ViewStyle;
  questName: TextStyle;
  questDetails: ViewStyle;
  questXP: TextStyle;
  questTarget: TextStyle;
  questCardCompleted: ViewStyle;
  questNameCompleted: TextStyle;
  questXPCompleted: TextStyle;
  checkmark: ViewStyle;
  dungeonCard: ViewStyle;
  dungeonImage: ImageStyle;
  dungeonOverlay: ViewStyle;
  dungeonHeader: ViewStyle;
  dungeonName: TextStyle;
  dungeonBadge: ViewStyle;
  dungeonLevel: TextStyle;
  dungeonDescription: TextStyle;
  dungeonFooter: ViewStyle;
  dungeonStat: ViewStyle;
  dungeonStatText: TextStyle;
  shadowModalContainer: ViewStyle;
  shadowModalContent: ViewStyle;
  shadowGradient: ViewStyle;
  shadowTitle: TextStyle;
  shadowImage: ImageStyle;
  shadowName: TextStyle;
  shadowType: TextStyle;
  shadowAbility: TextStyle;
  summonButton: ViewStyle;
  summonButtonGradient: ViewStyle;
  summonButtonText: TextStyle;
  shadowArmyContainer: ViewStyle;
  shadowArmyTitle: TextStyle;
  shadowScroll: ViewStyle;
  shadowCard: ViewStyle;
  shadowCardLocked: ViewStyle;
  shadowCardImage: ImageStyle;
  shadowCardOverlay: ViewStyle;
  shadowCardName: TextStyle;
  shadowCardRank: TextStyle;
  lockContainer: ViewStyle;
  rewardModalContainer: ViewStyle;
  rewardBox: ViewStyle;
  rewardGlow: ViewStyle;
  rewardGradient: ViewStyle;
  rewardImageContainer: ViewStyle;
  rewardImage: ImageStyle;
  rewardTitle: TextStyle;
  rewardDescription: TextStyle;
  rarityBadge: ViewStyle;
  rarityText: TextStyle;
  particleContainer: ViewStyle;
  statsOverview: ViewStyle;
  statsOverviewTitle: TextStyle;
  statsOverviewContent: ViewStyle;
  overviewItem: ViewStyle;
  overviewLabel: TextStyle;
  overviewValue: TextStyle;
  rankValue: TextStyle;
}

export const styles = StyleSheet.create<Styles>({
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
  },
  rankBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 148, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#0094FF',
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
  dungeonButton: {
    margin: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  dungeonGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dungeonButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  modalContent: {
    flex: 1,
    marginTop: 80,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    backgroundColor: 'rgba(11, 22, 34, 0.95)',
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
  progressBar: {
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    overflow: 'hidden',
    marginVertical: 10,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  progressFill: {
    height: '100%',
    borderRadius: 15,
  },
  progressText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  questCompletePopup: {
    position: 'absolute',
    top: '20%',
    left: '50%',
    transform: [{ translateX: -100 }],
    width: 200,
    borderRadius: 15,
    overflow: 'hidden',
    zIndex: 1000,
  },
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  confettiPiece: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: '#4d9fff',
    borderRadius: 4,
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
  statsContainer: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(11, 22, 34, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(0, 148, 255, 0.3)',
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
  dungeonCard: {
    height: 220,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  dungeonImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
    resizeMode: 'cover',
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
    resizeMode: 'cover',
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
  },
  rewardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(77, 159, 255, 0.2)',
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
  },
  rewardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  rewardTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
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
  },
  rarityText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  particleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
});
