
# 📝 Sistema de Recordatorios Personalizados

Sistema CRUD completo para gestión de recordatorios personalizados sin actualización de página, desarrollado con Node.js, Express y Docker.

## 🚀 Características

- ✅ **CRUD completo** sin actualización de página
- ✅ **Almacenamiento en archivos .txt** (sin bases de datos)
- ✅ **Dockerizado** con Nginx como proxy reverso
- ✅ **API REST** con Node.js y Express
- ✅ **Frontend responsive** con JavaScript vanilla
- ✅ **Validaciones** del lado cliente y servidor
- ✅ **Puerto personalizado 8088**

## 🛠️ Tecnologías utilizadas

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Servidor Web**: Nginx
- **Containerización**: Docker
- **Almacenamiento**: Sistema de archivos (.txt)

## 📦 Instalación y uso

### Opción 1: Con Docker (Recomendado)

```bash
# Clonar repositorio
git clone https://github.com/JersonCh1/RECORDATORIOS.git
cd RECORDATORIOS

# Construir imagen Docker
docker build -t caguilarc_ilab03 .

# Ejecutar contenedor
docker run -d --name caguilarc_clab03 -p 8088:80 caguilarc_ilab03

# Abrir en navegador
# http://localhost:8088
```

### Opción 2: Desarrollo local

```bash
# Clonar repositorio
git clone https://github.com/JersonCh1/RECORDATORIOS.git
cd RECORDATORIOS

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# Abrir en navegador
# http://localhost:3000
```

## 📁 Estructura del proyecto

```
caguilarc_ilab03/
├── src/
│   ├── public/
│   │   ├── index.html      # Frontend principal
│   │   ├── style.css       # Estilos CSS
│   │   └── script.js       # Lógica JavaScript
│   ├── routes/
│   │   └── recordatorios.js # Rutas de la API
│   ├── utils/
│   │   └── fileManager.js   # Gestión de archivos
│   └── app.js              # Servidor Express
├── recordatorios/          # Almacenamiento de .txt
├── Dockerfile              # Configuración Docker
├── nginx.conf              # Configuración Nginx
├── package.json            # Dependencias Node.js
└── README.md               # Documentación
```

## 🔧 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/recordatorios` | Obtener todos los recordatorios |
| GET | `/api/recordatorios/:id` | Obtener recordatorio específico |
| POST | `/api/recordatorios` | Crear nuevo recordatorio |
| PUT | `/api/recordatorios/:id` | Actualizar recordatorio |
| DELETE | `/api/recordatorios/:id` | Eliminar recordatorio |

## 📝 Funcionalidades

- **Crear recordatorios** con título y contenido
- **Visualizar lista** de todos los recordatorios
- **Editar recordatorios** existentes
- **Eliminar recordatorios** con confirmación
- **Interfaz responsiva** adaptable a dispositivos móviles
- **Mensajes de feedback** para todas las operaciones
- **Validaciones** en tiempo real

## 🐳 Docker

El proyecto incluye configuración completa de Docker con:
- **Imagen base**: Node.js 18 Alpine
- **Servidor web**: Nginx como proxy reverso
- **Puerto expuesto**: 80 (mapeado a 8088 en host)
- **Volumen**: Persistencia de recordatorios

### Comandos Docker útiles

```bash
# Ver contenedores corriendo
docker ps

# Ver logs del contenedor
docker logs caguilarc_clab03

# Detener contenedor
docker stop caguilarc_clab03

# Eliminar contenedor
docker rm caguilarc_clab03

# Eliminar imagen
docker rmi caguilarc_ilab03

# Acceso al contenedor
docker exec -it caguilarc_clab03 sh
```

## 🔧 Script de automatización

El proyecto incluye un script de despliegue automático:

```bash
# En Windows (PowerShell)
.\deploy.sh

# En Linux/Mac
chmod +x deploy.sh
./deploy.sh
```

Este script automatiza:
1. Construcción de la imagen Docker
2. Detención del contenedor anterior
3. Ejecución del nuevo contenedor
4. Verificación del estado

## 📊 Almacenamiento de datos

Los recordatorios se guardan como archivos JSON individuales en formato .txt:

```json
{
  "id": "1695321234567",
  "titulo": "Ejemplo de recordatorio",
  "contenido": "Contenido del recordatorio de prueba",
  "fechaCreacion": "2025-09-21T21:30:45.123Z",
  "fechaModificacion": "2025-09-21T21:30:45.123Z"
}
```

Ubicación: `./recordatorios/[timestamp].txt`

## 🔍 Comandos de verificación

```bash
# Verificar que Docker esté funcionando
docker --version

# Verificar que el contenedor esté corriendo
docker ps | grep caguilarc_clab03

# Verificar archivos de recordatorios
docker exec caguilarc_clab03 ls -la /app/recordatorios/

# Verificar logs del servidor
docker logs caguilarc_clab03 -f
```

## 🚨 Solución de problemas

### El contenedor no inicia
```bash
# Ver logs detallados
docker logs caguilarc_clab03

# Reconstruir la imagen
docker build --no-cache -t caguilarc_ilab03 .
```

### Puerto 8088 ocupado
```bash
# Ver qué proceso usa el puerto
netstat -ano | findstr :8088

# Usar otro puerto
docker run -d --name caguilarc_clab03 -p 8089:80 caguilarc_ilab03
```

### Problemas con Docker Desktop
```bash
# Reiniciar Docker Desktop
# Verificar que esté corriendo
docker info
```

## 📱 Características del Frontend

- **Diseño responsive** con CSS Grid y Flexbox
- **Interfaz moderna** con animaciones y transiciones
- **Operaciones CRUD dinámicas** sin refresh de página
- **Validación en tiempo real** de formularios
- **Mensajes de feedback** con auto-eliminación
- **Modal de confirmación** para eliminación
- **Loading indicators** durante operaciones asíncronas

## 🏗️ Arquitectura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   FRONTEND      │    │    BACKEND      │    │  ALMACENAMIENTO │
│                 │    │                 │    │                 │
│  HTML/CSS/JS    ├────┤  Node.js +      ├────┤  Archivos .txt  │
│  (Puerto 8088)  │    │  Express API    │    │  (File System)  │
│                 │    │  (Puerto 3000)  │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         └───────────────────────┘
              Nginx Proxy
              (Puerto 80)
```

## ⚡ Optimizaciones incluidas

- **Nginx** como proxy reverso para mejor rendimiento
- **Compresión Gzip** para recursos estáticos
- **Cache headers** para archivos CSS/JS
- **Logs estructurados** para debugging
- **Error handling** robusto en todas las capas
- **Validaciones duplicadas** cliente/servidor

## 📚 Dependencias

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

## 👨‍💻 Desarrollo

### Levantar en modo desarrollo
```bash
npm run dev
# o
nodemon src/app.js
```

### Estructura de desarrollo recomendada
1. Desarrollar funcionalidades en local (puerto 3000)
2. Probar en Docker (puerto 8088)
3. Commit y push a GitHub
4. Deploy final

## 🧪 Testing manual

1. **Crear recordatorio**: Llenar formulario y verificar aparición en lista
2. **Editar recordatorio**: Hacer clic en "Editar" y modificar contenido
3. **Eliminar recordatorio**: Usar botón "Eliminar" y confirmar
4. **Persistencia**: Reiniciar contenedor y verificar datos
5. **Responsividad**: Probar en diferentes tamaños de pantalla

## 📝 Notas importantes

- ⚠️ **NO utilizar bases de datos** (requisito del laboratorio)
- ⚠️ Los recordatorios se almacenan en archivos .txt individuales
- ⚠️ El puerto 8088 es específico del proyecto
- ⚠️ Nginx funciona como proxy reverso hacia Node.js
- ⚠️ Todas las operaciones CRUD son sin actualización de página

## 👨‍💻 Autor

**Jerson Ernesto Chura Pacci** - Estudiante de Ingeniería de Software  
Universidad La Salle - 2025

## 📄 Licencia

Este proyecto fue desarrollado como parte del Laboratorio 03 de Ingeniería de Software.

## 🔗 Enlaces útiles

- [Repositorio GitHub](https://github.com/JersonCh1/RECORDATORIOS)
- [Docker Hub - Node.js](https://hub.docker.com/_/node)
- [Express.js Documentation](https://expressjs.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)

---

**🚀 ¡Aplicación lista para usar en http://localhost:8088!**
