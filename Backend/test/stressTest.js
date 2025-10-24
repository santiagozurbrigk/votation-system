import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';

// Configuración del stress test
const TEST_SCENARIOS = [
  { name: 'Test Básico', users: 50, duration: 30 },
  { name: 'Test Medio', users: 100, duration: 60 },
  { name: 'Test Intenso', users: 200, duration: 90 },
  { name: 'Test Extremo', users: 500, duration: 120 }
];

const categories = [
  'mejor-director', 'mejor-actor', 'mejor-actor-secundario',
  'mejor-actriz', 'mejor-actriz-secundaria', 'mejor-editor',
  'vestuario-escenografia', 'revelacion', 'mejor-pelicula'
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

// Función para simular un usuario
async function simulateUser(userId, testDuration) {
  const startTime = Date.now();
  const endTime = startTime + (testDuration * 1000);
  const sessionId = `stress_test_${userId}_${Date.now()}`;
  const userFingerprint = `stress_fingerprint_${userId}`;
  
  let voteCount = 0;
  let successCount = 0;
  let errorCount = 0;
  const responseTimes = [];
  
  while (Date.now() < endTime) {
    try {
      const voteStartTime = Date.now();
      const votes = generateRandomVotes();
      
      const response = await fetch(`${BASE_URL}/api/votes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          votes,
          sessionId: `${sessionId}_${voteCount}`,
          userFingerprint
        })
      });
      
      const voteEndTime = Date.now();
      const responseTime = voteEndTime - voteStartTime;
      responseTimes.push(responseTime);
      
      voteCount++;
      
      if (response.ok) {
        successCount++;
      } else {
        errorCount++;
      }
      
      // Pequeña pausa entre votos
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
      
    } catch (error) {
      errorCount++;
      voteCount++;
    }
  }
  
  const avgResponseTime = responseTimes.length > 0 
    ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length 
    : 0;
  
  return {
    userId,
    voteCount,
    successCount,
    errorCount,
    avgResponseTime,
    successRate: voteCount > 0 ? (successCount / voteCount) * 100 : 0
  };
}

// Función para ejecutar un escenario de test
async function runScenario(scenario) {
  console.log(`\n🚀 Ejecutando: ${scenario.name}`);
  console.log(`👥 Usuarios: ${scenario.users}`);
  console.log(`⏱️  Duración: ${scenario.duration} segundos`);
  console.log('='.repeat(50));
  
  const startTime = Date.now();
  
  // Crear usuarios concurrentes
  const userPromises = [];
  for (let i = 1; i <= scenario.users; i++) {
    userPromises.push(simulateUser(i, scenario.duration));
  }
  
  // Ejecutar todos los usuarios
  const results = await Promise.all(userPromises);
  
  const endTime = Date.now();
  const totalDuration = endTime - startTime;
  
  // Analizar resultados
  const totalVotes = results.reduce((sum, r) => sum + r.voteCount, 0);
  const totalSuccess = results.reduce((sum, r) => sum + r.successCount, 0);
  const totalErrors = results.reduce((sum, r) => sum + r.errorCount, 0);
  const avgResponseTime = results.reduce((sum, r) => sum + r.avgResponseTime, 0) / results.length;
  const successRate = totalVotes > 0 ? (totalSuccess / totalVotes) * 100 : 0;
  
  console.log(`\n📊 RESULTADOS DE ${scenario.name.toUpperCase()}:`);
  console.log('='.repeat(50));
  console.log(`⏱️  Tiempo real: ${totalDuration}ms`);
  console.log(`🗳️  Total de votos: ${totalVotes}`);
  console.log(`✅ Votos exitosos: ${totalSuccess}`);
  console.log(`❌ Votos fallidos: ${totalErrors}`);
  console.log(`📈 Tasa de éxito: ${successRate.toFixed(2)}%`);
  console.log(`⚡ Tiempo promedio de respuesta: ${avgResponseTime.toFixed(2)}ms`);
  console.log(`🔥 Votos por segundo: ${(totalVotes / (totalDuration / 1000)).toFixed(2)}`);
  
  // Evaluación del rendimiento
  let performance = 'EXCELENTE';
  if (successRate < 95) performance = 'BUENO';
  if (successRate < 85) performance = 'REGULAR';
  if (successRate < 70) performance = 'MALO';
  
  console.log(`🎯 Rendimiento: ${performance}`);
  
  return {
    scenario: scenario.name,
    users: scenario.users,
    duration: scenario.duration,
    totalVotes,
    successRate,
    avgResponseTime,
    performance
  };
}

// Función principal
async function runStressTest() {
  console.log('🔥 INICIANDO STRESS TEST DEL SISTEMA DE VOTACIÓN');
  console.log('================================================');
  console.log('⚠️  Este test simulará carga extrema en el sistema');
  console.log('⚠️  Asegúrate de que el backend esté funcionando');
  console.log('');
  
  const allResults = [];
  
  for (const scenario of TEST_SCENARIOS) {
    try {
      const result = await runScenario(scenario);
      allResults.push(result);
      
      // Pausa entre tests
      console.log('\n⏸️  Pausa de 10 segundos antes del siguiente test...');
      await new Promise(resolve => setTimeout(resolve, 10000));
      
    } catch (error) {
      console.log(`❌ Error en ${scenario.name}:`, error.message);
    }
  }
  
  // Resumen final
  console.log('\n🏆 RESUMEN FINAL DE TODOS LOS TESTS');
  console.log('===================================');
  
  allResults.forEach(result => {
    console.log(`\n📊 ${result.scenario}:`);
    console.log(`   👥 Usuarios: ${result.users}`);
    console.log(`   📈 Tasa de éxito: ${result.successRate.toFixed(2)}%`);
    console.log(`   ⚡ Tiempo promedio: ${result.avgResponseTime.toFixed(2)}ms`);
    console.log(`   🎯 Rendimiento: ${result.performance}`);
  });
  
  // Recomendaciones finales
  console.log('\n💡 RECOMENDACIONES FINALES:');
  console.log('============================');
  
  const worstPerformance = allResults.find(r => r.performance === 'MALO');
  if (worstPerformance) {
    console.log('❌ El sistema falla bajo carga extrema');
    console.log('❌ Necesita optimización urgente');
  } else {
    console.log('✅ El sistema maneja bien la carga');
    console.log('✅ Listo para producción');
  }
  
  console.log('\n🎉 Stress test completado!');
}

// Ejecutar el stress test
runStressTest().catch(console.error);
