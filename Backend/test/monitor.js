import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';
const MONITOR_INTERVAL = 2000; // 2 segundos

// Estadísticas del sistema
let stats = {
  startTime: Date.now(),
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  avgResponseTime: 0,
  peakVotes: 0,
  currentVotes: 0
};

// Función para obtener estadísticas del sistema
async function getSystemStats() {
  try {
    const startTime = Date.now();
    const response = await fetch(`${BASE_URL}/api/results/all`);
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    stats.totalRequests++;
    stats.avgResponseTime = (stats.avgResponseTime + responseTime) / 2;
    
    if (response.ok) {
      stats.successfulRequests++;
      const data = await response.json();
      stats.currentVotes = data.stats.totalVotes;
      
      if (stats.currentVotes > stats.peakVotes) {
        stats.peakVotes = stats.currentVotes;
      }
      
      return {
        success: true,
        data,
        responseTime
      };
    } else {
      stats.failedRequests++;
      return {
        success: false,
        error: `HTTP ${response.status}`
      };
    }
  } catch (error) {
    stats.failedRequests++;
    return {
      success: false,
      error: error.message
    };
  }
}

// Función para mostrar el dashboard
function displayDashboard() {
  const uptime = Math.floor((Date.now() - stats.startTime) / 1000);
  const successRate = stats.totalRequests > 0 ? (stats.successfulRequests / stats.totalRequests * 100).toFixed(2) : 0;
  
  console.clear();
  console.log('🔍 MONITOR DE SISTEMA - VOTACIÓN EN TIEMPO REAL');
  console.log('================================================');
  console.log(`⏰ Tiempo activo: ${uptime}s`);
  console.log(`📊 Total de votos: ${stats.currentVotes}`);
  console.log(`📈 Pico máximo: ${stats.peakVotes} votos`);
  console.log(`🔄 Requests totales: ${stats.totalRequests}`);
  console.log(`✅ Requests exitosos: ${stats.successfulRequests}`);
  console.log(`❌ Requests fallidos: ${stats.failedRequests}`);
  console.log(`📈 Tasa de éxito: ${successRate}%`);
  console.log(`⚡ Tiempo promedio de respuesta: ${stats.avgResponseTime.toFixed(2)}ms`);
  console.log('');
  
  // Indicador de estado del sistema
  if (successRate >= 95) {
    console.log('🟢 ESTADO: EXCELENTE - Sistema funcionando perfectamente');
  } else if (successRate >= 85) {
    console.log('🟡 ESTADO: BUENO - Sistema funcionando con algunos errores menores');
  } else {
    console.log('🔴 ESTADO: CRÍTICO - Sistema con problemas, requiere atención');
  }
  
  console.log('');
  console.log('Presiona Ctrl+C para detener el monitoreo');
}

// Función principal de monitoreo
async function startMonitoring() {
  console.log('🚀 Iniciando monitor del sistema...');
  console.log('📡 Monitoreando cada 2 segundos...');
  console.log('');
  
  const monitorInterval = setInterval(async () => {
    const result = await getSystemStats();
    displayDashboard();
    
    if (!result.success) {
      console.log(`❌ Error en la última consulta: ${result.error}`);
    }
  }, MONITOR_INTERVAL);
  
  // Manejar cierre del programa
  process.on('SIGINT', () => {
    clearInterval(monitorInterval);
    console.log('\n\n📊 RESUMEN FINAL:');
    console.log('==================');
    console.log(`⏰ Tiempo total de monitoreo: ${Math.floor((Date.now() - stats.startTime) / 1000)}s`);
    console.log(`📊 Total de votos al final: ${stats.currentVotes}`);
    console.log(`📈 Pico máximo alcanzado: ${stats.peakVotes} votos`);
    console.log(`🔄 Total de requests: ${stats.totalRequests}`);
    console.log(`✅ Requests exitosos: ${stats.successfulRequests}`);
    console.log(`❌ Requests fallidos: ${stats.failedRequests}`);
    console.log(`📈 Tasa de éxito final: ${(stats.successfulRequests / stats.totalRequests * 100).toFixed(2)}%`);
    console.log(`⚡ Tiempo promedio de respuesta: ${stats.avgResponseTime.toFixed(2)}ms`);
    console.log('\n👋 Monitor detenido. ¡Hasta luego!');
    process.exit(0);
  });
}

// Ejecutar el monitor
startMonitoring().catch(console.error);
