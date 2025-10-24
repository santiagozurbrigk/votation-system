# 🗳️ Sistema de Votación - Instituto San José

Sistema web de votación para el Festival de Cortometrajes en Inglés del Instituto San José.

## 🎯 Características

- ✅ **Votación Bilingüe**: Interfaz en inglés y español
- ✅ **Prevención de Votos Duplicados**: Sistema de fingerprinting y validación
- ✅ **Panel Administrativo**: Resultados en tiempo real
- ✅ **Diseño Responsivo**: Optimizado para móviles y desktop
- ✅ **Tema Elegante**: Paleta de colores negro y dorado

## 🏗️ Arquitectura

```
Sistema de Votacion/
├── frontend-votacion/     # React + Vite + Tailwind CSS
├── Backend/              # Node.js + Express + MongoDB
└── docs/                 # Documentación
```

## 🚀 Tecnologías

### Frontend
- **React 18** - Framework de UI
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **React Hooks** - Estado

### Backend
- **Node.js** - Runtime
- **Express.js** - Framework web
- **MongoDB** - Base de datos
- **Mongoose** - ODM

### Despliegue
- **Vercel** - Frontend
- **Render** - Backend
- **Railway** - Base de datos

## 📱 Categorías de Votación

1. **Best Director** / Mejor Director
2. **Best Actor** / Mejor Actor
3. **Best Supporting Actor** / Mejor Actor Secundario
4. **Best Actress** / Mejor Actriz
5. **Best Supporting Actress** / Mejor Actriz Secundaria
6. **Best Editor** / Mejor Editor
7. **Costume & Set Design** / Vestuario y Escenografía
8. **Revelation** / Revelación
9. **Best Film** / Mejor Película

## 🛠️ Instalación Local

### Prerrequisitos
- Node.js 18+
- MongoDB (local o Atlas)
- Git

### Backend
```bash
cd Backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend-votacion
npm install
npm run dev
```

## 🌐 URLs de Producción

- **Frontend**: https://tu-proyecto.vercel.app
- **Backend**: https://tu-backend.onrender.com
- **Panel Admin**: https://tu-proyecto.vercel.app/admin

## 🧪 Testing de Carga

```bash
cd Backend/test
npm install
npm run load-test      # 100 usuarios
npm run stress-test    # Test completo
npm run monitor        # Monitor en tiempo real
```

## 📊 Características Técnicas

- **Concurrencia**: Soporta 100+ usuarios simultáneos
- **Seguridad**: Prevención de votos duplicados
- **Performance**: Optimizado para móviles
- **Escalabilidad**: Arquitectura modular

## 🎨 Diseño

- **Colores**: Negro y dorado elegante
- **Tipografía**: Responsive y legible
- **Animaciones**: Transiciones suaves
- **UX**: Interfaz intuitiva

## 📝 Licencia

Proyecto educativo del Instituto San José - Festival de Cortometrajes en Inglés 2025

## 👥 Desarrollado por

Sistema de Votación - Instituto San José