import { useState, useEffect } from 'react';

const VotingScreen = ({ category, categoryIndex, totalCategories, onVote }) => {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isVoting, setIsVoting] = useState(false);

  // Resetear estado cuando cambia la categoría
  useEffect(() => {
    setSelectedCandidate(null);
    setIsVoting(false);
  }, [categoryIndex]);

  const handleVote = (candidateId) => {
    if (isVoting) return;
    
    setSelectedCandidate(candidateId);
    setIsVoting(true);
    
    // Pequeña animación antes de proceder
    setTimeout(() => {
      onVote(category.id, candidateId);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progreso */}
        <div className="mb-8">
          <div className="flex justify-between text-white mb-2">
            <span className="text-lg font-semibold text-yellow-500">
              <div>Category {categoryIndex + 1} of {totalCategories}</div>
              <div className="text-base text-yellow-200">Categoría {categoryIndex + 1} de {totalCategories}</div>
            </span>
            <span className="text-white">
              {Math.round(((categoryIndex + 1) / totalCategories) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((categoryIndex + 1) / totalCategories) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Título de la categoría */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            <div>{category.name}</div>
            <div className="text-2xl md:text-3xl text-yellow-200">{category.nameEs}</div>
          </h2>
          <div className="text-white text-lg">
            <div>Select your favorite candidate</div>
            <div className="text-base text-yellow-200">Selecciona tu candidato favorito</div>
          </div>
        </div>

        {/* Lista de candidatos */}
        <div className="space-y-4">
          {category.candidates.map((candidate, index) => (
            <button
              key={candidate.id}
              onClick={() => handleVote(candidate.id)}
              disabled={isVoting}
              className={`w-full p-6 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                selectedCandidate === candidate.id
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg'
                  : 'bg-white/10 backdrop-blur-sm text-white hover:bg-yellow-500/20'
              } ${isVoting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="text-xl font-semibold">
                    {candidate.name}
                  </div>
                  <div className="text-sm opacity-80">
                    Candidato {index + 1}
                  </div>
                </div>
                {selectedCandidate === candidate.id && (
                  <div className="text-2xl">✓</div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Instrucciones */}
        <div className="mt-8 text-center">
          <div className="text-white text-sm">
            {isVoting ? (
              <>
                <div>Processing vote...</div>
                <div className="text-xs text-yellow-200">Procesando voto...</div>
              </>
            ) : (
              <>
                <div>Tap your chosen candidate</div>
                <div className="text-xs text-yellow-200">Toca el candidato de tu elección</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingScreen;
