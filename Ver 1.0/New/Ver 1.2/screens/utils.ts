export const getRarityStyle = (rarity: string) => {
  const styles = {
    common: {
      backgroundColor: 'rgba(169, 169, 169, 0.3)',
      borderColor: '#a9a9a9',
    },
    uncommon: {
      backgroundColor: 'rgba(0, 255, 0, 0.3)',
      borderColor: '#00ff00',
    },
    rare: {
      backgroundColor: 'rgba(0, 0, 255, 0.3)',
      borderColor: '#0000ff',
    },
    epic: {
      backgroundColor: 'rgba(138, 43, 226, 0.3)',
      borderColor: '#8a2be2',
    },
    legendary: {
      backgroundColor: 'rgba(255, 165, 0, 0.3)',
      borderColor: '#ffa500',
    },
    mythic: {
      backgroundColor: 'rgba(255, 0, 0, 0.3)',
      borderColor: '#ff0000',
    },
  };
  
  return styles[rarity as keyof typeof styles] || styles.common;
};

export const showRewardNotification = (reward: any) => {
  console.log('Reward received:', reward);
};

export const playRankUpSound = async (sound: any) => {
  if (sound) {
    await sound.playAsync();
  }
};
