# 🗄️ Alternativas de Base de Datos Gratuitas

## Opción 1: Railway (Recomendado)
- **Costo**: Gratuito hasta 5GB
- **MongoDB**: Incluido
- **Despliegue**: Automático
- **URL**: [railway.app](https://railway.app)

### Configuración en Railway:
1. Crear cuenta en Railway
2. Crear nuevo proyecto
3. Agregar servicio MongoDB
4. Obtener connection string
5. Usar en Render

## Opción 2: PlanetScale (MySQL)
- **Costo**: Gratuito hasta 1GB
- **Base de datos**: MySQL
- **Ventaja**: Muy rápido
- **URL**: [planetscale.com](https://planetscale.com)

### Migración a MySQL:
```sql
-- Crear tabla de votos
CREATE TABLE votes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  categoryId VARCHAR(50) NOT NULL,
  candidateId VARCHAR(50) NOT NULL,
  sessionId VARCHAR(100) NOT NULL,
  clientIP VARCHAR(45),
  userFingerprint VARCHAR(100),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimización
CREATE INDEX idx_category_candidate ON votes(categoryId, candidateId);
CREATE INDEX idx_session ON votes(sessionId);
CREATE INDEX idx_client_ip ON votes(clientIP);
```

## Opción 3: Supabase (PostgreSQL)
- **Costo**: Gratuito hasta 500MB
- **Base de datos**: PostgreSQL
- **Ventaja**: Incluye autenticación
- **URL**: [supabase.com](https://supabase.com)

### Migración a PostgreSQL:
```sql
-- Crear tabla de votos
CREATE TABLE votes (
  id SERIAL PRIMARY KEY,
  category_id VARCHAR(50) NOT NULL,
  candidate_id VARCHAR(50) NOT NULL,
  session_id VARCHAR(100) NOT NULL,
  client_ip INET,
  user_fingerprint VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX idx_category_candidate ON votes(category_id, candidate_id);
CREATE INDEX idx_session ON votes(session_id);
CREATE INDEX idx_client_ip ON votes(client_ip);
```

## Opción 4: MongoDB Atlas con Créditos
- **Costo**: Usar créditos de $200 USD
- **Duración**: Aproximadamente 2-3 meses
- **Ventaja**: MongoDB nativo
- **Configuración**: M10 con créditos

## Recomendación Final:

### Para Desarrollo/Testing:
1. **MongoDB Local** (gratuito)
2. **Railway** (gratuito, 5GB)

### Para Producción:
1. **MongoDB Atlas M10** ($9/mes)
2. **Railway** (gratuito hasta 5GB)

## Configuración Rápida con Railway:

```bash
# 1. Ir a railway.app
# 2. Crear cuenta
# 3. Crear nuevo proyecto
# 4. Agregar servicio MongoDB
# 5. Copiar connection string
# 6. Usar en Render
```

## Ventajas de Railway:
- ✅ Completamente gratuito hasta 5GB
- ✅ MongoDB incluido
- ✅ Fácil configuración
- ✅ Backup automático
- ✅ Escalable
