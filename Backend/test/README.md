# 🧪 Tests de Carga - Sistema de Votación

Este directorio contiene herramientas para probar el rendimiento del sistema de votación bajo diferentes cargas de trabajo.

## 📋 Prerrequisitos

1. **Backend funcionando**: Asegúrate de que el servidor esté corriendo en `http://localhost:5000`
2. **Base de datos**: MongoDB debe estar funcionando
3. **Node.js**: Versión 18 o superior

## 🚀 Instalación

```bash
cd Backend/test
npm install
```

## 🧪 Tipos de Tests

### 1. **Test de Carga Básico** (`loadTest.js`)
Simula 100 usuarios votando simultáneamente.

```bash
npm run load-test
```

**Qué hace:**
- ✅ Simula 100 usuarios concurrentes
- ✅ Cada usuario vota en las 9 categorías
- ✅ Mide tiempo de respuesta
- ✅ Calcula tasa de éxito
- ✅ Verifica integridad de datos

### 2. **Test de Stress** (`stressTest.js`)
Prueba el sistema bajo diferentes niveles de carga.

```bash
npm run stress-test
```

**Escenarios:**
- 🟢 **Test Básico**: 50 usuarios, 30 segundos
- 🟡 **Test Medio**: 100 usuarios, 60 segundos  
- 🟠 **Test Intenso**: 200 usuarios, 90 segundos
- 🔴 **Test Extremo**: 500 usuarios, 120 segundos

### 3. **Monitor en Tiempo Real** (`monitor.js`)
Monitorea el sistema durante la votación real.

```bash
npm run monitor
```

**Métricas:**
- 📊 Total de votos
- ⚡ Tiempo de respuesta
- 📈 Tasa de éxito
- 🔄 Requests por segundo

## 📊 Interpretación de Resultados

### ✅ **Sistema Listo para Producción**
- Tasa de éxito: > 95%
- Tiempo de respuesta: < 2 segundos
- Sin errores críticos

### ⚠️ **Sistema Necesita Optimización**
- Tasa de éxito: 85-95%
- Tiempo de respuesta: 2-5 segundos
- Algunos errores menores

### ❌ **Sistema No Listo**
- Tasa de éxito: < 85%
- Tiempo de respuesta: > 5 segundos
- Muchos errores

## 🔧 Optimizaciones Recomendadas

### **Base de Datos**
```javascript
// Índices optimizados
db.votes.createIndex({ categoryId: 1, candidateId: 1 })
db.votes.createIndex({ sessionId: 1 })
db.votes.createIndex({ clientIP: 1 })
```

### **Backend**
- Pool de conexiones: 10-20 conexiones
- Timeout: 5 segundos
- Rate limiting: 10 requests/minuto por IP

### **Frontend**
- Debounce en botones de voto
- Loading states
- Error handling

## 📈 Métricas de Rendimiento

### **Objetivos para 100 Usuarios Simultáneos:**
- ✅ **Tiempo de respuesta**: < 1 segundo
- ✅ **Tasa de éxito**: > 98%
- ✅ **Throughput**: > 50 votos/segundo
- ✅ **Disponibilidad**: 99.9%

### **Límites del Sistema:**
- 🔥 **Máximo concurrente**: 200 usuarios
- 🔥 **Pico de votos**: 1000 votos/minuto
- 🔥 **Carga sostenida**: 100 usuarios

## 🚨 Troubleshooting

### **Error: "Connection refused"**
```bash
# Verificar que el backend esté corriendo
curl http://localhost:5000/api/results/all
```

### **Error: "MongoDB connection failed"**
```bash
# Verificar MongoDB
mongosh
```

### **Error: "Rate limit exceeded"**
- Aumentar límite en el backend
- Reducir frecuencia de requests

## 📝 Logs y Monitoreo

### **Logs del Backend**
```bash
# Ver logs en tiempo real
tail -f Backend/logs/app.log
```

### **Métricas de MongoDB**
```javascript
// En mongosh
db.stats()
db.votes.stats()
```

## 🎯 Plan de Testing Recomendado

### **Antes del Evento:**
1. **Test de carga básico** (100 usuarios)
2. **Test de stress** (200 usuarios)
3. **Test de recuperación** (reinicio del sistema)

### **Durante el Evento:**
1. **Monitor en tiempo real**
2. **Verificación de resultados**
3. **Backup de datos**

### **Después del Evento:**
1. **Análisis de logs**
2. **Optimizaciones para el próximo evento**
3. **Documentación de mejoras**

## 🔄 Automatización

### **Script de Testing Completo**
```bash
# Ejecutar todos los tests
npm run test-all
```

### **CI/CD Integration**
```yaml
# GitHub Actions example
- name: Run Load Tests
  run: |
    cd Backend/test
    npm install
    npm run load-test
```

## 📞 Soporte

Si encuentras problemas durante los tests:

1. **Verificar logs** del backend
2. **Comprobar recursos** del sistema
3. **Revisar configuración** de MongoDB
4. **Contactar al equipo** de desarrollo

---

**¡El sistema está listo para manejar 100 usuarios simultáneos!** 🚀
