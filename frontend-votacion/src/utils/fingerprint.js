// Generar un fingerprint único del navegador/dispositivo
export const generateFingerprint = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('Fingerprint', 2, 2);
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    canvas.toDataURL()
  ].join('|');
  
  // Crear hash simple del fingerprint
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertir a 32bit integer
  }
  
  return Math.abs(hash).toString(36);
};

// Verificar si ya se votó en este dispositivo
export const hasVotedBefore = () => {
  const voted = localStorage.getItem('hasVoted');
  return voted === 'true';
};

// Marcar que ya se votó
export const markAsVoted = () => {
  localStorage.setItem('hasVoted', 'true');
  localStorage.setItem('votedAt', new Date().toISOString());
};

// Obtener información del dispositivo
export const getDeviceInfo = () => {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: new Date().toISOString()
  };
};
