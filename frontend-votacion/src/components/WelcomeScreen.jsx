import { useEffect, useState } from 'react';

const WelcomeScreen = ({ onStart }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Animación de entrada
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1000);

    // Redirigir automáticamente después de 3 segundos
    const redirectTimer = setTimeout(() => {
      onStart();
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(redirectTimer);
    };
  }, [onStart]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {/* Escudo del Instituto San José */}
        <div className={`mb-8 transition-all duration-1000 ${
          showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}>
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl animate-glow">
            <div className="text-white text-4xl font-bold">ISJ</div>
          </div>
        </div>

        {/* Título principal */}
        <h1 className={`text-4xl md:text-6xl font-bold text-white mb-4 transition-all duration-1000 delay-500 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div>Voting System</div>
          <div className="text-3xl md:text-5xl text-yellow-200">Sistema de Votación</div>
        </h1>

        {/* Subtítulo */}
        <div className={`text-xl md:text-2xl text-white mb-8 transition-all duration-1000 delay-700 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div>Vote for your favorite short film and cast!</div>
          <div className="text-lg md:text-xl text-yellow-200">¡Vota tu cortometraje y elenco favorito!</div>
        </div>

        {/* Indicador de carga */}
        <div className={`transition-all duration-1000 delay-1000 ${
          showContent ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <div className="text-white mt-4 text-lg">
            <div>Preparing the vote...</div>
            <div className="text-base text-yellow-200">Preparando la votación...</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
