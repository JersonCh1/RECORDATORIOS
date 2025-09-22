# Usar imagen base de Node.js
FROM node:18-alpine

# Instalar nginx
RUN apk add --no-cache nginx

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar c?digo fuente
COPY src/ ./src/

# Crear directorio para recordatorios y darle permisos
RUN mkdir -p /app/recordatorios && \
    chmod 755 /app/recordatorios

# Crear directorio para logs de nginx
RUN mkdir -p /var/log/nginx

# Copiar configuraci?n de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Crear script de inicio
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'echo "?? Iniciando aplicaci?n..."' >> /app/start.sh && \
    echo '# Iniciar nginx en background' >> /app/start.sh && \
    echo 'nginx &' >> /app/start.sh && \
    echo 'echo "?? Nginx iniciado"' >> /app/start.sh && \
    echo '# Iniciar aplicaci?n Node.js' >> /app/start.sh && \
    echo 'echo "?? Iniciando servidor Node.js..."' >> /app/start.sh && \
    echo 'exec node src/app.js' >> /app/start.sh && \
    chmod +x /app/start.sh

# Exponer puertos
EXPOSE 80 3000

# Comando de inicio
CMD ["/app/start.sh"]
