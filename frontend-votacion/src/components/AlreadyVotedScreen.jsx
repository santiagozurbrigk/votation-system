import { useEffect, useState } from 'react';

const AlreadyVotedScreen = () => {
  const [votedAt, setVotedAt] = useState(null);

  useEffect(() => {
    const votedTime = localStorage.getItem('votedAt');
    if (votedTime) {
      setVotedAt(new Date(votedTime));
    }
  }, []);

  const formatDate = (date) => {
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto p-6">
        {/* Icono de información */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
            <div className="text-white text-4xl">ℹ️</div>
          </div>
        </div>

        {/* Mensaje principal */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          <div>You have already voted</div>
          <div className="text-3xl md:text-4xl text-yellow-200">Ya has votado</div>
        </h1>

        {/* Mensaje secundario */}
        <div className="text-xl md:text-2xl text-white mb-8">
          <div>Only one vote per device is allowed</div>
          <div className="text-lg md:text-xl text-yellow-200">Solo se permite un voto por dispositivo</div>
        </div>

        {/* Información del voto */}
        {votedAt && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-2">
              <div>Your vote was registered on:</div>
              <div className="text-base text-yellow-200">Tu voto fue registrado el:</div>
            </h3>
            <p className="text-white text-lg">
              {formatDate(votedAt)}
            </p>
          </div>
        )}

        {/* Instrucciones */}
        <div className="space-y-4">
          <div className="text-white text-lg">
            <div>Results will be announced at the end of the event</div>
            <div className="text-base text-yellow-200">Los resultados se anunciarán al final del evento</div>
          </div>
          <p className="text-gray-400">
            Instituto San José -  Proyecto de Inglés Egresados 2025
          </p>
        </div>

        {/* Botón para limpiar (solo para desarrollo) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8">
            <button
              onClick={() => {
                localStorage.removeItem('hasVoted');
                localStorage.removeItem('votedAt');
                window.location.reload();
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              Limpiar voto (Solo desarrollo)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlreadyVotedScreen;
