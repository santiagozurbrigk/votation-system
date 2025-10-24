// Optimizaciones para mejorar el rendimiento del sistema de votación

// 1. Pool de conexiones optimizado
const mongoose = require('mongoose');

const optimizedConnection = {
  maxPoolSize: 10, // Máximo 10 conexiones simultáneas
  serverSelectionTimeoutMS: 5000, // Timeout de 5 segundos
  socketTimeoutMS: 45000, // Timeout de socket de 45 segundos
  bufferMaxEntries: 0, // Deshabilitar buffering
  bufferCommands: false, // Deshabilitar comandos en buffer
};

// 2. Índices optimizados para la base de datos
const createOptimizedIndexes = async () => {
  const Vote = require('./models/Vote');
  
  // Índice compuesto para consultas de resultados
  await Vote.collection.createIndex({ categoryId: 1, candidateId: 1 });
  
  // Índice para consultas por sesión
  await Vote.collection.createIndex({ sessionId: 1 });
  
  // Índice para consultas por IP
  await Vote.collection.createIndex({ clientIP: 1 });
  
  // Índice para consultas por timestamp
  await Vote.collection.createIndex({ timestamp: 1 });
  
  console.log('✅ Índices optimizados creados');
};

// 3. Cache de resultados
const resultsCache = new Map();
const CACHE_DURATION = 5000; // 5 segundos

const getCachedResults = (key) => {
  const cached = resultsCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedResults = (key, data) => {
  resultsCache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// 4. Rate limiting para prevenir spam
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minuto
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests por minuto por IP

const checkRateLimit = (ip) => {
  const now = Date.now();
  const userRequests = rateLimitMap.get(ip) || [];
  
  // Filtrar requests antiguos
  const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false; // Rate limit excedido
  }
  
  // Agregar nuevo request
  recentRequests.push(now);
  rateLimitMap.set(ip, recentRequests);
  
  return true; // Rate limit OK
};

// 5. Middleware de optimización
const optimizationMiddleware = (req, res, next) => {
  // Headers de optimización
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Compresión
  res.setHeader('Content-Encoding', 'gzip');
  
  // Cache headers
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  next();
};

// 6. Función para limpiar cache periódicamente
const cleanupCache = () => {
  const now = Date.now();
  for (const [key, value] of resultsCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      resultsCache.delete(key);
    }
  }
  
  // Limpiar rate limit map
  for (const [ip, requests] of rateLimitMap.entries()) {
    const recentRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW);
    if (recentRequests.length === 0) {
      rateLimitMap.delete(ip);
    } else {
      rateLimitMap.set(ip, recentRequests);
    }
  }
};

// Ejecutar limpieza cada 5 minutos
setInterval(cleanupCache, 300000);

module.exports = {
  optimizedConnection,
  createOptimizedIndexes,
  getCachedResults,
  setCachedResults,
  checkRateLimit,
  optimizationMiddleware
};
