export const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export const handlePlayTrack = (
  track: string, 
  onTrackSelect?: (track: string) => void,
  onNavigate?: (tab: string, page?: string) => void
) => {
  if (onTrackSelect) {
    onTrackSelect(track);
  }
  if (onNavigate) {
    onNavigate("Player", "player");
  }
};

export const handleEffectPreview = (
  effectId: string,
  setSelectedEffect: (effect: string) => void
) => {
  setSelectedEffect(effectId);
  // In real app, this would apply the effect temporarily
};