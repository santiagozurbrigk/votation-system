# 🗄️ Configuración de MongoDB Local

## Opción 1: MongoDB Community Server

### Windows:
1. Descargar MongoDB Community Server desde [mongodb.com](https://www.mongodb.com/try/download/community)
2. Instalar con configuración por defecto
3. Iniciar el servicio MongoDB

### macOS:
```bash
# Con Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

### Linux (Ubuntu):
```bash
# Importar clave pública
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Agregar repositorio
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Instalar MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Iniciar servicio
sudo systemctl start mongod
sudo systemctl enable mongod
```

## Opción 2: Docker (Recomendado)

```bash
# Ejecutar MongoDB en Docker
docker run -d --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo:latest
```

## Configuración para el Proyecto

### 1. Crear base de datos
```bash
# Conectar a MongoDB
mongosh

# Crear base de datos
use votacion-instituto

# Crear usuario
db.createUser({
  user: "votacion_user",
  pwd: "votacion_password",
  roles: ["readWrite"]
})
```

### 2. Configurar variables de entorno
```bash
# Para desarrollo local
MONGODB_URI=mongodb://localhost:27017/votacion-instituto
```

### 3. Probar conexión
```bash
# En el directorio Backend
npm run dev
```

## Ventajas de MongoDB Local:
- ✅ Completamente gratuito
- ✅ Control total sobre los datos
- ✅ Ideal para desarrollo y testing
- ✅ Sin límites de tiempo

## Desventajas:
- ❌ Requiere instalación local
- ❌ No disponible en producción (Render)
- ❌ No hay backup automático
