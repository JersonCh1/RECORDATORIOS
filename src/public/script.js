// Clase principal para manejar los recordatorios
class RecordatoriosApp {
    constructor() {
        this.apiUrl = '/api/recordatorios';
        this.editandoId = null;
        this.init();
    }

    // Inicializar la aplicación
    init() {
        this.cargarElementos();
        this.configurarEventos();
        this.cargarRecordatorios();
    }

    // Cargar referencias a elementos del DOM
    cargarElementos() {
        // Formulario
        this.form = document.getElementById('recordatorio-form');
        this.formTitle = document.getElementById('form-title');
        this.recordatorioIdInput = document.getElementById('recordatorio-id');
        this.tituloInput = document.getElementById('titulo');
        this.contenidoInput = document.getElementById('contenido');
        this.submitBtn = document.getElementById('submit-btn');
        this.cancelBtn = document.getElementById('cancel-btn');

        // Lista
        this.recordatoriosLista = document.getElementById('recordatorios-lista');
        this.totalRecordatorios = document.getElementById('total-recordatorios');
        this.noRecordatorios = document.getElementById('no-recordatorios');
        this.loading = document.getElementById('loading');
        this.messageContainer = document.getElementById('message-container');

        // Modal
        this.deleteModal = document.getElementById('delete-modal');
        this.confirmDeleteBtn = document.getElementById('confirm-delete');
        this.cancelDeleteBtn = document.getElementById('cancel-delete');
    }

    // Configurar event listeners
    configurarEventos() {
        // Formulario
        this.form.addEventListener('submit', (e) => this.manejarSubmit(e));
        this.cancelBtn.addEventListener('click', () => this.cancelarEdicion());

        // Modal de eliminación
        this.cancelDeleteBtn.addEventListener('click', () => this.cerrarModalEliminar());
        this.deleteModal.addEventListener('click', (e) => {
            if (e.target === this.deleteModal) {
                this.cerrarModalEliminar();
            }
        });

        // Teclas de escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.cerrarModalEliminar();
                this.cancelarEdicion();
            }
        });
    }

    // Mostrar loading
    mostrarLoading() {
        this.loading.style.display = 'block';
        this.recordatoriosLista.style.display = 'none';
        this.noRecordatorios.style.display = 'none';
    }

    // Ocultar loading
    ocultarLoading() {
        this.loading.style.display = 'none';
    }

    // Mostrar mensaje
    mostrarMensaje(texto, tipo = 'success') {
        const mensaje = document.createElement('div');
        mensaje.className = `message ${tipo}`;
        mensaje.textContent = texto;
        
        this.messageContainer.appendChild(mensaje);

        // Auto-eliminar después de 5 segundos
        setTimeout(() => {
            if (mensaje.parentNode) {
                mensaje.remove();
            }
        }, 5000);

        // Scroll hacia el mensaje
        mensaje.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Limpiar mensajes
    limpiarMensajes() {
        this.messageContainer.innerHTML = '';
    }

    // Cargar todos los recordatorios
    async cargarRecordatorios() {
        this.mostrarLoading();
        this.limpiarMensajes();

        try {
            const response = await fetch(this.apiUrl);
            const data = await response.json();

            if (data.success) {
                this.renderizarRecordatorios(data.data);
                this.actualizarContador(data.total);
            } else {
                throw new Error(data.message || 'Error al cargar recordatorios');
            }
        } catch (error) {
            console.error('Error cargando recordatorios:', error);
            this.mostrarMensaje('Error al cargar los recordatorios', 'error');
            this.renderizarRecordatorios([]);
        } finally {
            this.ocultarLoading();
        }
    }

    // Renderizar lista de recordatorios
    renderizarRecordatorios(recordatorios) {
        if (recordatorios.length === 0) {
            this.recordatoriosLista.style.display = 'none';
            this.noRecordatorios.style.display = 'block';
            return;
        }

        this.recordatoriosLista.style.display = 'grid';
        this.noRecordatorios.style.display = 'none';

        this.recordatoriosLista.innerHTML = recordatorios.map(recordatorio => 
            this.crearCardRecordatorio(recordatorio)
        ).join('');

        // Agregar event listeners a los botones
        this.configurarBotonesAccion();
    }

    // Crear HTML de una card de recordatorio
    crearCardRecordatorio(recordatorio) {
        const fechaCreacion = new Date(recordatorio.fechaCreacion).toLocaleString('es-ES');
        const fechaModificacion = recordatorio.fechaModificacion 
            ? new Date(recordatorio.fechaModificacion).toLocaleString('es-ES')
            : null;

        return `
            <div class="recordatorio-card" data-id="${recordatorio.id}">
                <h3>${this.escaparHtml(recordatorio.titulo)}</h3>
                <div class="contenido">${this.escaparHtml(recordatorio.contenido)}</div>
                <div class="recordatorio-meta">
                    <div><strong>Creado:</strong> ${fechaCreacion}</div>
                    ${fechaModificacion ? `<div><strong>Modificado:</strong> ${fechaModificacion}</div>` : ''}
                </div>
                <div class="recordatorio-actions">
                    <button class="action-btn edit-btn" data-id="${recordatorio.id}">
                        ✏️ Editar
                    </button>
                    <button class="action-btn delete-btn" data-id="${recordatorio.id}">
                        🗑️ Eliminar
                    </button>
                </div>
            </div>
        `;
    }

    // Escapar HTML para prevenir XSS
    escaparHtml(texto) {
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }

    // Configurar event listeners para botones de acción
    configurarBotonesAccion() {
        // Botones de editar
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                this.editarRecordatorio(id);
            });
        });

        // Botones de eliminar
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                this.mostrarModalEliminar(id);
            });
        });
    }

    // Actualizar contador
    actualizarContador(total) {
        this.totalRecordatorios.textContent = `Total: ${total}`;
    }

    // Manejar submit del formulario
    async manejarSubmit(e) {
        e.preventDefault();
        
        const titulo = this.tituloInput.value.trim();
        const contenido = this.contenidoInput.value.trim();

        if (!titulo || !contenido) {
            this.mostrarMensaje('Por favor, completa todos los campos', 'error');
            return;
        }

        // Deshabilitar botón mientras se procesa
        this.submitBtn.disabled = true;
        this.submitBtn.textContent = '⏳ Guardando...';

        try {
            if (this.editandoId) {
                await this.actualizarRecordatorio(this.editandoId, titulo, contenido);
            } else {
                await this.crearRecordatorio(titulo, contenido);
            }
        } finally {
            // Restaurar botón
            this.submitBtn.disabled = false;
            this.submitBtn.textContent = this.editandoId ? '💾 Actualizar Recordatorio' : '💾 Guardar Recordatorio';
        }
    }

    // Crear nuevo recordatorio
    async crearRecordatorio(titulo, contenido) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ titulo, contenido })
            });

            const data = await response.json();

            if (data.success) {
                this.mostrarMensaje('✅ Recordatorio creado exitosamente');
                this.limpiarFormulario();
                this.cargarRecordatorios(); // Recargar lista
            } else {
                throw new Error(data.message || 'Error al crear recordatorio');
            }
        } catch (error) {
            console.error('Error creando recordatorio:', error);
            this.mostrarMensaje('Error al crear el recordatorio', 'error');
        }
    }

    // Actualizar recordatorio existente
    async actualizarRecordatorio(id, titulo, contenido) {
        try {
            const response = await fetch(`${this.apiUrl}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ titulo, contenido })
            });

            const data = await response.json();

            if (data.success) {
                this.mostrarMensaje('✅ Recordatorio actualizado exitosamente');
                this.cancelarEdicion();
                this.cargarRecordatorios(); // Recargar lista
            } else {
                throw new Error(data.message || 'Error al actualizar recordatorio');
            }
        } catch (error) {
            console.error('Error actualizando recordatorio:', error);
            this.mostrarMensaje('Error al actualizar el recordatorio', 'error');
        }
    }

    // Preparar formulario para editar
    async editarRecordatorio(id) {
        try {
            const response = await fetch(`${this.apiUrl}/${id}`);
            const data = await response.json();

            if (data.success) {
                const recordatorio = data.data;
                
                // Llenar formulario
                this.recordatorioIdInput.value = recordatorio.id;
                this.tituloInput.value = recordatorio.titulo;
                this.contenidoInput.value = recordatorio.contenido;
                
                // Cambiar estado de edición
                this.editandoId = recordatorio.id;
                this.formTitle.textContent = '✏️ Editar Recordatorio';
                this.submitBtn.textContent = '💾 Actualizar Recordatorio';
                this.cancelBtn.style.display = 'inline-block';

                // Scroll al formulario
                this.form.scrollIntoView({ behavior: 'smooth' });
                this.tituloInput.focus();

            } else {
                throw new Error(data.message || 'Error al cargar recordatorio');
            }
        } catch (error) {
            console.error('Error cargando recordatorio para editar:', error);
            this.mostrarMensaje('Error al cargar el recordatorio', 'error');
        }
    }

    // Cancelar edición
    cancelarEdicion() {
        this.editandoId = null;
        this.limpiarFormulario();
        this.formTitle.textContent = '✨ Crear Nuevo Recordatorio';
        this.submitBtn.textContent = '💾 Guardar Recordatorio';
        this.cancelBtn.style.display = 'none';
    }

    // Limpiar formulario
    limpiarFormulario() {
        this.form.reset();
        this.recordatorioIdInput.value = '';
    }

    // Mostrar modal de confirmación para eliminar
    mostrarModalEliminar(id) {
        this.deleteModal.style.display = 'flex';
        
        // Configurar botón de confirmación
        this.confirmDeleteBtn.onclick = () => this.eliminarRecordatorio(id);
    }

    // Cerrar modal de eliminación
    cerrarModalEliminar() {
        this.deleteModal.style.display = 'none';
        this.confirmDeleteBtn.onclick = null;
    }

    // Eliminar recordatorio
    async eliminarRecordatorio(id) {
        this.confirmDeleteBtn.disabled = true;
        this.confirmDeleteBtn.textContent = '⏳ Eliminando...';

        try {
            const response = await fetch(`${this.apiUrl}/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                this.mostrarMensaje('🗑️ Recordatorio eliminado exitosamente');
                this.cerrarModalEliminar();
                
                // Si estamos editando este recordatorio, cancelar edición
                if (this.editandoId === id) {
                    this.cancelarEdicion();
                }
                
                this.cargarRecordatorios(); // Recargar lista
            } else {
                throw new Error(data.message || 'Error al eliminar recordatorio');
            }
        } catch (error) {
            console.error('Error eliminando recordatorio:', error);
            this.mostrarMensaje('Error al eliminar el recordatorio', 'error');
        } finally {
            this.confirmDeleteBtn.disabled = false;
            this.confirmDeleteBtn.textContent = '🗑️ Sí, eliminar';
        }
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new RecordatoriosApp();
    console.log('📝 Aplicación de Recordatorios iniciada correctamente');
});