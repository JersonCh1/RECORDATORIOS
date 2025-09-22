const express = require('express');
const fileManager = require('../utils/fileManager');

const router = express.Router();

// GET - Obtener todos los recordatorios
router.get('/', async (req, res) => {
    try {
        const recordatorios = await fileManager.leerRecordatorios();
        res.json({
            success: true,
            data: recordatorios,
            total: recordatorios.length
        });
    } catch (error) {
        console.error('❌ Error obteniendo recordatorios:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// GET - Obtener un recordatorio específico
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const recordatorio = await fileManager.leerRecordatorio(id);
        
        if (!recordatorio) {
            return res.status(404).json({
                success: false,
                message: 'Recordatorio no encontrado'
            });
        }

        res.json({
            success: true,
            data: recordatorio
        });
    } catch (error) {
        console.error('❌ Error obteniendo recordatorio:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// POST - Crear nuevo recordatorio
router.post('/', async (req, res) => {
    try {
        const { titulo, contenido } = req.body;

        // Validaciones
        if (!titulo || titulo.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El título es requerido'
            });
        }

        if (!contenido || contenido.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El contenido es requerido'
            });
        }

        const nuevoRecordatorio = await fileManager.crearRecordatorio(
            titulo.trim(),
            contenido.trim()
        );

        res.status(201).json({
            success: true,
            message: 'Recordatorio creado exitosamente',
            data: nuevoRecordatorio
        });
    } catch (error) {
        console.error('❌ Error creando recordatorio:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// PUT - Actualizar recordatorio
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, contenido } = req.body;

        // Validaciones
        if (!titulo || titulo.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El título es requerido'
            });
        }

        if (!contenido || contenido.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El contenido es requerido'
            });
        }

        const recordatorioActualizado = await fileManager.actualizarRecordatorio(
            id,
            titulo.trim(),
            contenido.trim()
        );

        res.json({
            success: true,
            message: 'Recordatorio actualizado exitosamente',
            data: recordatorioActualizado
        });
    } catch (error) {
        if (error.message === 'Recordatorio no encontrado') {
            return res.status(404).json({
                success: false,
                message: 'Recordatorio no encontrado'
            });
        }

        console.error('❌ Error actualizando recordatorio:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

// DELETE - Eliminar recordatorio
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar si existe el recordatorio antes de eliminarlo
        const recordatorioExistente = await fileManager.leerRecordatorio(id);
        if (!recordatorioExistente) {
            return res.status(404).json({
                success: false,
                message: 'Recordatorio no encontrado'
            });
        }

        await fileManager.eliminarRecordatorio(id);

        res.json({
            success: true,
            message: 'Recordatorio eliminado exitosamente'
        });
    } catch (error) {
        console.error('❌ Error eliminando recordatorio:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });
    }
});

module.exports = router;