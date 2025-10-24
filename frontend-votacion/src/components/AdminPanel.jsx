import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

const AdminPanel = ({ onReset }) => {
  const [results, setResults] = useState({});
  const [totalVotes, setTotalVotes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Obtener resultados del backend
  useEffect(() => {
    const fetchResults = async (isInitial = false) => {
      if (isInitial) {
        setIsLoading(true);
      }
      try {
        const response = await fetch(API_ENDPOINTS.RESULTS);
        if (response.ok) {
          const data = await response.json();
          
          // Solo actualizar si hay cambios reales
          const currentData = JSON.stringify(data.results);
          const currentVotes = data.stats.totalVotes;
          
          if (isInitial || currentData !== JSON.stringify(results) || currentVotes !== totalVotes) {
            setResults(data.results);
            setTotalVotes(currentVotes);
            setLastUpdate(new Date().toLocaleTimeString());
          }
        } else {
          console.error('Error al obtener resultados');
        }
      } catch (error) {
        console.error('Error al conectar con el backend:', error);
      } finally {
        if (isInitial) {
          setIsLoading(false);
        }
      }
    };

    // Carga inicial con loading
    fetchResults(true);
    
    // Actualizar resultados cada 5 segundos sin loading
    const interval = setInterval(() => fetchResults(false), 5000);
    return () => clearInterval(interval);
  }, []);

  const handleReset = async () => {
    if (window.confirm('¿Estás seguro de que quieres reiniciar todos los resultados? Esta acción no se puede deshacer.')) {
      try {
        const response = await fetch(API_ENDPOINTS.RESET, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          onReset();
          setResults({});
          setTotalVotes(0);
          alert('Votación reiniciada exitosamente');
        } else {
          alert('Error al reiniciar la votación');
        }
      } catch (error) {
        console.error('Error al reiniciar:', error);
        alert('Error al conectar con el servidor');
      }
    }
  };

  const getWinner = (categoryResults) => {
    if (!categoryResults || Object.keys(categoryResults).length === 0) return null;
    return Object.entries(categoryResults).reduce((a, b) => 
      categoryResults[a[0]] > categoryResults[b[0]] ? a : b
    );
  };

  const categoryNames = {
    'mejor-director': 'Mejor Director',
    'mejor-actor': 'Mejor Actor',
    'mejor-actor-secundario': 'Mejor Actor Secundario',
    'mejor-actriz': 'Mejor Actriz',
    'mejor-actriz-secundaria': 'Mejor Actriz Secundaria',
    'mejor-editor': 'Mejor Editor',
    'vestuario-escenografia': 'Vestuario y Escenografía',
    'revelacion': 'Revelación',
    'mejor-pelicula': 'Mejor Película'
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Cargando resultados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-950 via-black to-yellow-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Panel Administrativo
          </h1>
          <p className="text-white text-lg">
            Resultados en tiempo real - Festival de Cortometrajes
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <span className="text-white font-semibold">Total de votos: {totalVotes}</span>
            </div>
            {lastUpdate && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-yellow-200 text-sm">Última actualización: {lastUpdate}</span>
              </div>
            )}
            <button
              onClick={handleReset}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Reiniciar Votación
            </button>
          </div>
        </div>

        {/* Resultados por categoría */}
        {Object.keys(results).length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-yellow-500 mb-2">No hay votos aún</h3>
            <p className="text-white">Los resultados aparecerán aquí cuando comience la votación</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(results).map(([categoryId, categoryResults]) => {
            const winner = getWinner(categoryResults);
            const totalCategoryVotes = Object.values(categoryResults || {}).reduce((a, b) => a + b, 0);
            
            return (
              <div key={categoryId} className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  {categoryNames[categoryId]}
                </h3>
                
                {winner && (
                  <div className="mb-4 p-3 bg-yellow-500/20 rounded-lg">
                    <p className="text-white font-semibold">Ganador:</p>
                    <p className="text-yellow-500 text-lg">{winner[0]}</p>
                    <p className="text-white">{winner[1]} votos</p>
                  </div>
                )}

                <div className="space-y-2">
                  {Object.entries(categoryResults).map(([candidateId, votes]) => {
                    const percentage = totalCategoryVotes > 0 ? (votes / totalCategoryVotes) * 100 : 0;
                    return (
                      <div key={candidateId} className="flex items-center justify-between">
                        <span className="text-white text-sm">{candidateId}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-white text-sm w-12 text-right">{votes}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Instituto San José - Sistema de Votación
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
