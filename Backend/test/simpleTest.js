import fetch from 'node-fetch';

const BASE_URL = 'https://votation-system.onrender.com';

// Test simple para verificar que el sistema funciona
async function simpleTest() {
  console.log('🧪 Test Simple del Sistema de Votación');
  console.log('=====================================');
  
  try {
    // 1. Verificar que el backend esté funcionando
    console.log('1. Verificando conexión al backend...');
    const healthResponse = await fetch(`${BASE_URL}/`);
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Backend funcionando:', healthData.message);
    } else {
      console.log('❌ Backend no responde');
      return;
    }
    
    // 2. Verificar resultados actuales
    console.log('\n2. Verificando resultados actuales...');
    const resultsResponse = await fetch(`${BASE_URL}/api/results/all`);
    if (resultsResponse.ok) {
      const resultsData = await resultsResponse.json();
      console.log('✅ Resultados obtenidos:');
      console.log(`   - Total de votos: ${resultsData.stats.totalVotes}`);
      console.log(`   - Sesiones únicas: ${resultsData.stats.uniqueSessions}`);
    } else {
      console.log('❌ Error al obtener resultados');
    }
    
    // 3. Test de un solo voto
    console.log('\n3. Probando un voto individual...');
    const testVotes = {
      'mejor-director': 'director1',
      'mejor-actor': 'actor1',
      'mejor-actor-secundario': 'actor-sec1',
      'mejor-actriz': 'actriz1',
      'mejor-actriz-secundaria': 'actriz-sec1',
      'mejor-editor': 'editor1',
      'vestuario-escenografia': 'vestuario1',
      'revelacion': 'revelacion1',
      'mejor-pelicula': 'pelicula1'
    };
    
    const sessionId = `test_simple_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const userFingerprint = `test_simple_${Math.random().toString(36).substr(2, 9)}`;
    
    const voteResponse = await fetch(`${BASE_URL}/api/votes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        votes: testVotes,
        sessionId,
        userFingerprint
      })
    });
    
    if (voteResponse.ok) {
      console.log('✅ Voto enviado exitosamente');
    } else {
      const errorData = await voteResponse.text();
      console.log('❌ Error al enviar voto:', errorData);
    }
    
    // 4. Verificar resultados después del voto
    console.log('\n4. Verificando resultados después del voto...');
    const finalResultsResponse = await fetch(`${BASE_URL}/api/results/all`);
    if (finalResultsResponse.ok) {
      const finalResultsData = await finalResultsResponse.json();
      console.log('✅ Resultados actualizados:');
      console.log(`   - Total de votos: ${finalResultsData.stats.totalVotes}`);
      console.log(`   - Sesiones únicas: ${finalResultsData.stats.uniqueSessions}`);
    }
    
    console.log('\n🎉 Test completado exitosamente!');
    
  } catch (error) {
    console.log('❌ Error en el test:', error.message);
  }
}

// Ejecutar el test
simpleTest();
