const fs = require('fs').promises;
const path = require('path');

class FileManager {
    constructor() {
        this.recordatoriosDir = path.join(__dirname, '../../recordatorios');
        this.ensureDirectoryExists();
    }

    async ensureDirectoryExists() {
        try {
            await fs.access(this.recordatoriosDir);
        } catch {
            await fs.mkdir(this.recordatoriosDir, { recursive: true });
            console.log('📁 Directorio de recordatorios creado');
        }
    }

    // Generar ID único basado en timestamp
    generateId() {
        return Date.now().toString();
    }

    // Obtener ruta del archivo
    getFilePath(id) {
        return path.join(this.recordatoriosDir, `${id}.txt`);
    }

    // Crear recordatorio
    async crearRecordatorio(titulo, contenido) {
        const id = this.generateId();
        const data = {
            id,
            titulo,
            contenido,
            fechaCreacion: new Date().toISOString(),
            fechaModificacion: new Date().toISOString()
        };
        
        const filePath = this.getFilePath(id);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
        
        console.log(`✅ Recordatorio creado: ${id}`);
        return data;
    }

    // Leer todos los recordatorios
    async leerRecordatorios() {
        try {
            const files = await fs.readdir(this.recordatoriosDir);
            const txtFiles = files.filter(file => file.endsWith('.txt'));
            
            const recordatorios = [];
            for (const file of txtFiles) {
                try {
                    const filePath = path.join(this.recordatoriosDir, file);
                    const content = await fs.readFile(filePath, 'utf8');
                    const data = JSON.parse(content);
                    recordatorios.push(data);
                } catch (error) {
                    console.warn(`⚠️ Error leyendo archivo ${file}:`, error.message);
                }
            }
            
            // Ordenar por fecha de creación (más recientes primero)
            return recordatorios.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
        } catch (error) {
            console.error('❌ Error leyendo recordatorios:', error);
            return [];
        }
    }

    // Leer un recordatorio específico
    async leerRecordatorio(id) {
        try {
            const filePath = this.getFilePath(id);
            const content = await fs.readFile(filePath, 'utf8');
            return JSON.parse(content);
        } catch (error) {
            console.error(`❌ Error leyendo recordatorio ${id}:`, error);
            return null;
        }
    }

    // Actualizar recordatorio
    async actualizarRecordatorio(id, titulo, contenido) {
        try {
            const recordatorioExistente = await this.leerRecordatorio(id);
            if (!recordatorioExistente) {
                throw new Error('Recordatorio no encontrado');
            }

            const data = {
                ...recordatorioExistente,
                titulo,
                contenido,
                fechaModificacion: new Date().toISOString()
            };

            const filePath = this.getFilePath(id);
            await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
            
            console.log(`📝 Recordatorio actualizado: ${id}`);
            return data;
        } catch (error) {
            console.error(`❌ Error actualizando recordatorio ${id}:`, error);
            throw error;
        }
    }

    // Eliminar recordatorio
    async eliminarRecordatorio(id) {
        try {
            const filePath = this.getFilePath(id);
            await fs.unlink(filePath);
            console.log(`🗑️ Recordatorio eliminado: ${id}`);
            return true;
        } catch (error) {
            console.error(`❌ Error eliminando recordatorio ${id}:`, error);
            throw error;
        }
    }
}

module.exports = new FileManager();