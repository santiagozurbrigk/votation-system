import { useState, useEffect } from 'react';
import { categories } from './data/categories';
import WelcomeScreen from './components/WelcomeScreen';
import VotingScreen from './components/VotingScreen';
import ThankYouScreen from './components/ThankYouScreen';
import AdminPanel from './components/AdminPanel';
import AlreadyVotedScreen from './components/AlreadyVotedScreen';
import { generateFingerprint, hasVotedBefore, markAsVoted } from './utils/fingerprint';
import { API_ENDPOINTS } from './config/api';

function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [votes, setVotes] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  // Verificar si es panel administrativo
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') {
      setIsAdmin(true);
      setCurrentScreen('admin');
    }
  }, []);

  // Verificar si ya se votó
  useEffect(() => {
    if (hasVotedBefore()) {
      setCurrentScreen('alreadyVoted');
    }
  }, []);

  const handleVote = (categoryId, candidateId) => {
    const newVotes = {
      ...votes,
      [categoryId]: candidateId
    };
    
    setVotes(newVotes);
    
    // Avanzar a la siguiente categoría
    if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex(prev => prev + 1);
    } else {
      // Enviar votos al backend (incluyendo el voto actual)
      submitVotes(newVotes);
      setCurrentScreen('thankyou');
    }
  };

  const submitVotes = async (votesToSubmit = votes) => {
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const userFingerprint = generateFingerprint();
      
      const response = await fetch(API_ENDPOINTS.VOTES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          votes: votesToSubmit,
          sessionId,
          userFingerprint
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al enviar votos');
      }

      // Marcar como votado en el dispositivo
      markAsVoted();
      console.log('Votos enviados exitosamente');
    } catch (error) {
      console.error('Error al enviar votos:', error);
      alert('Error al enviar votos: ' + error.message);
    }
  };

  const resetVoting = () => {
    setCurrentCategoryIndex(0);
    setVotes({});
    setCurrentScreen('welcome');
  };

  if (isAdmin) {
    return <AdminPanel onReset={resetVoting} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-950 via-black to-yellow-950">
      {currentScreen === 'welcome' && (
        <WelcomeScreen onStart={() => setCurrentScreen('voting')} />
      )}
      
      {currentScreen === 'voting' && (
        <VotingScreen
          category={categories[currentCategoryIndex]}
          categoryIndex={currentCategoryIndex}
          totalCategories={categories.length}
          onVote={handleVote}
        />
      )}
      
      {currentScreen === 'thankyou' && (
        <ThankYouScreen />
      )}
      
      {currentScreen === 'alreadyVoted' && (
        <AlreadyVotedScreen />
      )}
    </div>
  );
}

export default App;
