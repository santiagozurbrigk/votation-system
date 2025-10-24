# 🚀 Guía de Despliegue - Sistema de Votación

Esta guía te ayudará a desplegar el sistema de votación en Vercel (frontend) y Render (backend).

## 📋 Prerrequisitos

- Cuenta en [Vercel](https://vercel.com)
- Cuenta en [Render](https://render.com)
- Cuenta en [MongoDB Atlas](https://cloud.mongodb.com)
- Git configurado

## 🎯 Paso 1: Preparar MongoDB Atlas

### 1.1 Crear Cluster
1. Ve a [MongoDB Atlas](https://cloud.mongodb.com)
2. Crea un nuevo cluster (gratis)
3. Configura la región más cercana
4. Crea un usuario de base de datos
5. Obtén la connection string

### 1.2 Configurar Acceso
```bash
# Ejemplo de connection string
mongodb+srv://usuario:password@cluster.mongodb.net/votacion-instituto?retryWrites=true&w=majority
```

## 🎯 Paso 2: Desplegar Backend en Render

### 2.1 Preparar Repositorio
```bash
# Asegúrate de que todos los archivos estén en Git
git add .
git commit -m "Preparar para despliegue"
git push origin main
```

### 2.2 Crear Servicio en Render
1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Conecta tu repositorio de GitHub
4. Configura:
   - **Name**: `votacion-backend`
   - **Root Directory**: `Backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 2.3 Variables de Entorno en Render
Agregar estas variables de entorno:
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/votacion-instituto?retryWrites=true&w=majority
```

### 2.4 Desplegar
1. Click "Create Web Service"
2. Espera a que termine el build
3. Copia la URL del servicio (ej: `https://votacion-backend.onrender.com`)

## 🎯 Paso 3: Desplegar Frontend en Vercel

### 3.1 Preparar Frontend
```bash
cd frontend-votacion
# Crear archivo .env.local
echo "VITE_API_URL=https://tu-backend-url.onrender.com" > .env.local
```

### 3.2 Desplegar en Vercel
1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Importa tu repositorio de GitHub
4. Configura:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend-votacion`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.3 Variables de Entorno en Vercel
Agregar esta variable:
```
VITE_API_URL=https://tu-backend-url.onrender.com
```

### 3.4 Desplegar
1. Click "Deploy"
2. Espera a que termine el build
3. Copia la URL del frontend (ej: `https://tu-proyecto.vercel.app`)

## 🎯 Paso 4: Configurar Dominios

### 4.1 Frontend (Vercel)
- La URL de Vercel ya está lista
- Ejemplo: `https://sistema-votacion.vercel.app`

### 4.2 Backend (Render)
- La URL de Render ya está lista
- Ejemplo: `https://votacion-backend.onrender.com`

## 🎯 Paso 5: Verificar Despliegue

### 5.1 Verificar Backend
```bash
# Probar API
curl https://tu-backend-url.onrender.com/api/results/all
```

### 5.2 Verificar Frontend
1. Ve a la URL de Vercel
2. Prueba la votación
3. Ve a `/admin` para ver el panel

## 🧪 Paso 6: Ejecutar Tests de Carga

### 6.1 Preparar Tests
```bash
cd Backend/test
npm install
```

### 6.2 Actualizar URLs en Tests
Editar `loadTest.js` y `stressTest.js`:
```javascript
const BASE_URL = 'https://tu-backend-url.onrender.com';
```

### 6.3 Ejecutar Tests
```bash
# Test básico
npm run load-test

# Test de stress
npm run stress-test

# Monitor en tiempo real
npm run monitor
```

## 🔧 Configuración Adicional

### Variables de Entorno Completas

#### Frontend (Vercel):
```
VITE_API_URL=https://tu-backend-url.onrender.com
```

#### Backend (Render):
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/votacion-instituto?retryWrites=true&w=majority
```

## 📊 Monitoreo en Producción

### 1. Render Dashboard
- Monitorea logs del backend
- Verifica métricas de CPU y memoria
- Revisa uptime del servicio

### 2. Vercel Dashboard
- Monitorea builds del frontend
- Verifica métricas de tráfico
- Revisa performance

### 3. MongoDB Atlas
- Monitorea conexiones
- Verifica uso de storage
- Revisa métricas de queries

## 🚨 Troubleshooting

### Error: "Cannot connect to database"
- Verificar MONGODB_URI en Render
- Verificar que el cluster esté activo
- Verificar IP whitelist en MongoDB Atlas

### Error: "CORS policy"
- Verificar configuración de CORS en el backend
- Verificar que las URLs sean correctas

### Error: "Build failed"
- Verificar que todas las dependencias estén en package.json
- Verificar que no haya errores de sintaxis
- Revisar logs de build

## 📝 URLs Finales

Después del despliegue tendrás:

- **Frontend**: `https://tu-proyecto.vercel.app`
- **Backend**: `https://tu-backend.onrender.com`
- **Panel Admin**: `https://tu-proyecto.vercel.app/admin`

## 🎉 ¡Listo para Producción!

Una vez desplegado, tu sistema estará listo para manejar 100 usuarios simultáneos votando en el Festival de Cortometrajes del Instituto San José.

### Próximos Pasos:
1. ✅ Desplegar backend en Render
2. ✅ Desplegar frontend en Vercel
3. ✅ Configurar variables de entorno
4. ✅ Ejecutar tests de carga
5. ✅ Verificar funcionamiento completo
6. ✅ ¡Listo para el evento!

---

**¡El sistema está listo para el gran día!** 🚀✨
