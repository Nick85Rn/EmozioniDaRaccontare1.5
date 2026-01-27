// Definizione delle regole Freemium
export const FREE_TIER_LIMITS = {
  // ID delle storie accessibili gratuitamente
  freeStoryIds: [1, 2], 
  
  // Rotte dei giochi accessibili gratuitamente
  freeGameRoutes: ['/puzzle', '/memory', '/connect4'],
  
  // Messaggi di marketing per l'upsell
  marketingCopy: {
    title: "Sblocca la Magia ✨",
    subtitle: "Diventa Premium per accedere a tutte le storie, i giochi educativi e l'audio narrato.",
    cta: "Passa a Premium"
  }
};

export const checkAccess = (userProfile, type, idOrRoute) => {
  // Se è premium, ha accesso a tutto
  if (userProfile?.is_premium) return true;

  // Logica per le storie
  if (type === 'story') {
    return FREE_TIER_LIMITS.freeStoryIds.includes(parseInt(idOrRoute));
  }

  // Logica per i giochi
  if (type === 'game') {
    return FREE_TIER_LIMITS.freeGameRoutes.includes(idOrRoute);
  }

  return false;
};