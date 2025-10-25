import fetch from 'node-fetch';

// Configuración del test intensivo
const BASE_URL = 'https://votation-system.onrender.com';
const CONCURRENT_USERS = 360; // 360 usuarios simultáneos
const BATCH_SIZE = 30; // Procesar en lotes de 30
const DELAY_BETWEEN_BATCHES = 1000; // 1 segundo entre lotes

// Datos de prueba
const categories = [
  'mejor-director',
  'mejor-actor', 
  'mejor-actor-secundario',
  'mejor-actriz',
  'mejor-actriz-secundaria',
  'mejor-editor',
  'vestuario-escenografia',
  'revelacion',
  'mejor-pelicula'
];

const candidates = {
  'mejor-director': ['director1', 'director2', 'director3'],
  'mejor-actor': ['actor1', 'actor2', 'actor3'],
  'mejor-actor-secundario': ['actor-sec1', 'actor-sec2', 'actor-sec3'],
  'mejor-actriz': ['actriz1', 'actriz2', 'actriz3'],
  'mejor-actriz-secundaria': ['actriz-sec1', 'actriz-sec2', 'actriz-sec3'],
  'mejor-editor': ['editor1', 'editor2', 'editor3'],
  'vestuario-escenografia': ['vestuario1', 'vestuario2', 'vestuario3'],
  'revelacion': ['revelacion1', 'revelacion2', 'revelacion3'],
  'mejor-pelicula': ['pelicula1', 'pelicula2', 'pelicula3']
};

// Función para generar votos aleatorios
function generateRandomVotes() {
  const votes = {};
  categories.forEach(category => {
    const categoryCandidates = candidates[category];
    const randomIndex = Math.floor(Math.random() * categoryCandidates.length);
    votes[category] = categoryCandidates[randomIndex];
  });
  return votes;
}

// Función para simular un usuario votando
async function simulateUser(userId) {
  const startTime = Date.now();
  const sessionId = `intensive_test_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const userFingerprint = `intensive_fingerprint_${userId}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    // Generar votos aleatorios
    const votes = generateRandomVotes();
    
    // Enviar votos al backend
    const response = await fetch(`${BASE_URL}/api/votes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        votes,
        sessionId,
        userFingerprint
      })
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    if (response.ok) {
      return {
        userId,
        success: true,
        duration,
        status: response.status
      };
    } else {
      const errorData = await response.text();
      return {
        userId,
        success: false,
        duration,
        status: response.status,
        error: errorData
      };
    }
  } catch (error) {
    const endTime = Date.now();
    return {
      userId,
      success: false,
      duration: endTime - startTime,
      error: error.message
    };
  }
}

// Función para procesar en lotes
async function processBatch(batchNumber, startUser, endUser) {
  console.log(`🔄 Procesando lote ${batchNumber}: usuarios ${startUser}-${endUser}`);
  
  const userPromises = [];
  for (let i = startUser; i <= endUser; i++) {
    userPromises.push(simulateUser(i));
  }
  
  const results = await Promise.all(userPromises);
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Lote ${batchNumber}: ${successful.length} exitosos, ${failed.length} fallidos`);
  
  return results;
}

// Función principal de testing
async function runIntensiveLoadTest() {
  console.log(`🚀 Iniciando test de carga intensivo con ${CONCURRENT_USERS} usuarios`);
  console.log(`📊 Procesando en lotes de ${BATCH_SIZE} usuarios con ${DELAY_BETWEEN_BATCHES}ms de delay`);
  console.log(`⏱️  Tiempo estimado: ${Math.ceil(CONCURRENT_USERS / BATCH_SIZE) * (DELAY_BETWEEN_BATCHES / 1000)} segundos`);
  
  const startTime = Date.now();
  const allResults = [];
  
  // Procesar en lotes
  for (let i = 1; i <= CONCURRENT_USERS; i += BATCH_SIZE) {
    const endUser = Math.min(i + BATCH_SIZE - 1, CONCURRENT_USERS);
    const batchNumber = Math.floor((i - 1) / BATCH_SIZE) + 1;
    
    const batchResults = await processBatch(batchNumber, i, endUser);
    allResults.push(...batchResults);
    
    // Delay entre lotes (excepto el último)
    if (endUser < CONCURRENT_USERS) {
      console.log(`⏳ Esperando ${DELAY_BETWEEN_BATCHES}ms antes del siguiente lote...`);
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
    }
  }
  
  const endTime = Date.now();
  const totalDuration = endTime - startTime;
  
  // Analizar resultados
  const successful = allResults.filter(r => r.success);
  const failed = allResults.filter(r => !r.success);
  const avgResponseTime = allResults.reduce((sum, r) => sum + r.duration, 0) / allResults.length;
  
  console.log('\n📈 RESULTADOS DEL TEST DE CARGA INTENSIVO:');
  console.log('==========================================');
  console.log(`👥 Usuarios totales: ${CONCURRENT_USERS}`);
  console.log(`✅ Votos exitosos: ${successful.length}`);
  console.log(`❌ Votos fallidos: ${failed.length}`);
  console.log(`📊 Tasa de éxito: ${((successful.length / CONCURRENT_USERS) * 100).toFixed(2)}%`);
  console.log(`⏱️  Tiempo total: ${(totalDuration / 1000).toFixed(2)} segundos`);
  console.log(`⚡ Tiempo promedio por voto: ${avgResponseTime.toFixed(2)}ms`);
  console.log(`🔥 Votos por segundo: ${(CONCURRENT_USERS / (totalDuration / 1000)).toFixed(2)}`);
  
  // Análisis de rendimiento
  console.log('\n📊 ANÁLISIS DE RENDIMIENTO:');
  console.log('============================');
  if (successful.length >= CONCURRENT_USERS * 0.9) {
    console.log('🟢 EXCELENTE: Sistema maneja carga alta perfectamente');
  } else if (successful.length >= CONCURRENT_USERS * 0.7) {
    console.log('🟡 BUENO: Sistema maneja carga alta con algunos errores');
  } else if (successful.length >= CONCURRENT_USERS * 0.5) {
    console.log('🟠 REGULAR: Sistema necesita optimización');
  } else {
    console.log('🔴 CRÍTICO: Sistema necesita optimización urgente');
  }
  
  // Mostrar errores si los hay
  if (failed.length > 0) {
    console.log('\n❌ ERRORES ENCONTRADOS:');
    console.log('======================');
    const errorTypes = {};
    failed.forEach(failure => {
      const error = failure.error || `Status ${failure.status}`;
      errorTypes[error] = (errorTypes[error] || 0) + 1;
    });
    
    Object.entries(errorTypes).forEach(([error, count]) => {
      console.log(`${error}: ${count} veces`);
    });
  }
  
  // Verificar resultados en la base de datos
  try {
    console.log('\n📊 Verificando estado de la base de datos...');
    const resultsResponse = await fetch(`${BASE_URL}/api/results/all`);
    if (resultsResponse.ok) {
      const data = await resultsResponse.json();
      console.log('\n📊 ESTADO DE LA BASE DE DATOS:');
      console.log('==============================');
      console.log(`🗳️  Total de votos registrados: ${data.stats.totalVotes}`);
      console.log(`👤 Sesiones únicas: ${data.stats.uniqueSessions}`);
      
      // Mostrar resultados por categoría
      console.log('\n📋 RESULTADOS POR CATEGORÍA:');
      Object.entries(data.results).forEach(([category, categoryResults]) => {
        const totalVotes = Object.values(categoryResults).reduce((sum, votes) => sum + votes, 0);
        console.log(`${category}: ${totalVotes} votos`);
      });
    }
  } catch (error) {
    console.log('❌ Error al verificar resultados:', error.message);
  }
  
  // Recomendaciones finales
  console.log('\n💡 RECOMENDACIONES FINALES:');
  console.log('============================');
  
  if (successful.length >= CONCURRENT_USERS * 0.8) {
    console.log('✅ El sistema está listo para eventos grandes');
    console.log('✅ Puede manejar 360+ usuarios simultáneos');
    console.log('✅ Rendimiento excelente para producción');
  } else if (successful.length >= CONCURRENT_USERS * 0.6) {
    console.log('⚠️  El sistema funciona bien para eventos medianos');
    console.log('⚠️  Considera optimizar para eventos más grandes');
  } else {
    console.log('❌ El sistema necesita optimización urgente');
    console.log('❌ No recomendado para eventos grandes');
  }
  
  if (avgResponseTime > 3000) {
    console.log('⚠️  Tiempo de respuesta alto - considera optimizar el backend');
  }
  
  if (totalDuration > 60000) {
    console.log('⚠️  Test muy lento - considera optimizar la base de datos');
  }
  
  console.log('\n🎯 CONCLUSIÓN:');
  console.log('==============');
  console.log(`Sistema probado con ${CONCURRENT_USERS} usuarios simultáneos`);
  console.log(`Tasa de éxito: ${((successful.length / CONCURRENT_USERS) * 100).toFixed(2)}%`);
  console.log(`Tiempo total: ${(totalDuration / 1000).toFixed(2)} segundos`);
}

// Ejecutar el test
runIntensiveLoadTest().catch(console.error);
