import { useEffect, useState } from 'react';

const ThankYouScreen = () => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto p-6">
        {/* Animación de agradecimiento */}
        <div className={`mb-8 transition-all duration-1000 ${
          showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        }`}>
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
            <div className="text-white text-4xl">✓</div>
          </div>
        </div>

        {/* Mensaje principal */}
        <h1 className={`text-4xl md:text-5xl font-bold text-white mb-6 transition-all duration-1000 delay-300 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div>Thank you for your votes!</div>
          <div className="text-3xl md:text-4xl text-yellow-200">¡Gracias por tus votos!</div>
        </h1>

        {/* Mensaje secundario */}
        <div className={`text-xl md:text-2xl text-white mb-8 transition-all duration-1000 delay-500 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div>Your participation is very important to us</div>
          <div className="text-lg md:text-xl text-yellow-200">Tu participación es muy importante para nosotros</div>
        </div>

        {/* Detalles adicionales */}
        <div className={`space-y-4 transition-all duration-1000 delay-700 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="text-white text-lg">
            <div>Results will be announced at the end of the event</div>
            <div className="text-base text-yellow-200">Los resultados se anunciarán al final del evento</div>
          </div>
          <p className="text-gray-400">
            Instituto San José - Proyecto de Inglés Egresados 2025
          </p>
        </div>

        {/* Animación de partículas */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThankYouScreen;
