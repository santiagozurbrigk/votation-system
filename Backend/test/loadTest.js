import fetch from 'node-fetch';

// Configuración del test
const BASE_URL = 'https://votation-system.onrender.com';
const CONCURRENT_USERS = 100;
const VOTE_DELAY = 100; // ms entre votos de cada usuario

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
  const sessionId = `test_session_${userId}_${Date.now()}`;
  const userFingerprint = `test_fingerprint_${userId}`;
  
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

// Función principal de testing
async function runLoadTest() {
  console.log(`🚀 Iniciando test de carga con ${CONCURRENT_USERS} usuarios simultáneos...`);
  console.log(`📊 Simulando votación completa de ${categories.length} categorías por usuario`);
  
  const startTime = Date.now();
  
  // Crear array de promesas para usuarios simultáneos
  const userPromises = [];
  for (let i = 1; i <= CONCURRENT_USERS; i++) {
    userPromises.push(simulateUser(i));
  }
  
  // Ejecutar todos los usuarios simultáneamente
  const results = await Promise.all(userPromises);
  
  const endTime = Date.now();
  const totalDuration = endTime - startTime;
  
  // Analizar resultados
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const avgResponseTime = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
  
  console.log('\n📈 RESULTADOS DEL TEST DE CARGA:');
  console.log('================================');
  console.log(`👥 Usuarios totales: ${CONCURRENT_USERS}`);
  console.log(`✅ Votos exitosos: ${successful.length}`);
  console.log(`❌ Votos fallidos: ${failed.length}`);
  console.log(`📊 Tasa de éxito: ${((successful.length / CONCURRENT_USERS) * 100).toFixed(2)}%`);
  console.log(`⏱️  Tiempo total: ${totalDuration}ms`);
  console.log(`⚡ Tiempo promedio por voto: ${avgResponseTime.toFixed(2)}ms`);
  console.log(`🔥 Votos por segundo: ${(CONCURRENT_USERS / (totalDuration / 1000)).toFixed(2)}`);
  
  // Mostrar errores si los hay
  if (failed.length > 0) {
    console.log('\n❌ ERRORES ENCONTRADOS:');
    console.log('======================');
    failed.forEach(failure => {
      console.log(`Usuario ${failure.userId}: ${failure.error || `Status ${failure.status}`}`);
    });
  }
  
  // Verificar resultados en la base de datos
  try {
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
  
  // Recomendaciones
  console.log('\n💡 RECOMENDACIONES:');
  console.log('===================');
  if (failed.length === 0) {
    console.log('✅ El sistema está listo para producción');
    console.log('✅ Puede manejar 100 usuarios simultáneos');
  } else if (failed.length < 5) {
    console.log('⚠️  El sistema funciona bien con algunos errores menores');
    console.log('⚠️  Considera optimizar la base de datos');
  } else {
    console.log('❌ El sistema necesita optimización');
    console.log('❌ Considera aumentar el timeout y optimizar consultas');
  }
  
  if (avgResponseTime > 2000) {
    console.log('⚠️  Tiempo de respuesta alto - considera optimizar el backend');
  }
  
  if (totalDuration > 10000) {
    console.log('⚠️  Test muy lento - considera optimizar la base de datos');
  }
}

// Ejecutar el test
runLoadTest().catch(console.error);
