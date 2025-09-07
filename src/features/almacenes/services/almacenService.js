// ======================================================
// src/features/almacenes/services/almacenService.js
// Servicio completo para módulo de Almacenes
// ======================================================

import api from '../../../services/api';
import ENDPOINTS, { buildQuery } from '../../../services/endpoints';

class AlmacenService {

    // ========== GESTIÓN DE ALMACENES ==========

    async getAlmacenes(params = {}) {
        try {
            const queryString = buildQuery(params);
            const response = await api.get(`${ENDPOINTS.ALMACENES}${queryString}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener almacenes')
            };
        }
    }

    async getAlmacenById(id) {
        try {
            const response = await api.get(ENDPOINTS.ALMACEN_DETAIL(id));
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener almacén')
            };
        }
    }

    async createAlmacen(almacenData) {
        try {
            const response = await api.post(ENDPOINTS.ALMACENES, almacenData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al crear almacén')
            };
        }
    }

    async updateAlmacen(id, almacenData) {
        try {
            const response = await api.patch(ENDPOINTS.ALMACEN_DETAIL(id), almacenData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al actualizar almacén')
            };
        }
    }

    async deleteAlmacen(id) {
        try {
            const response = await api.delete(ENDPOINTS.ALMACEN_DETAIL(id));
            return {
                success: true,
                message: response.data.message || 'Almacén eliminado correctamente'
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al eliminar almacén')
            };
        }
    }

    async getAlmacenMateriales(id, params = {}) {
        try {
            const queryString = buildQuery(params);
            const response = await api.get(`${ENDPOINTS.ALMACEN_MATERIALES(id)}${queryString}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener materiales del almacén')
            };
        }
    }

    async getAlmacenEstadisticas(id) {
        try {
            const response = await api.get(ENDPOINTS.ALMACEN_ESTADISTICAS(id));
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener estadísticas del almacén')
            };
        }
    }

    async getAlmacenPrincipal() {
        try {
            const response = await api.get(ENDPOINTS.ALMACEN_PRINCIPAL);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener almacén principal')
            };
        }
    }

    async getResumenAlmacenes() {
        try {
            const response = await api.get(ENDPOINTS.RESUMEN_ALMACENES);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener resumen de almacenes')
            };
        }
    }

    // ========== GESTIÓN DE PROVEEDORES ==========

    async getProveedores(params = {}) {
        try {
            const queryString = buildQuery(params);
            const response = await api.get(`${ENDPOINTS.PROVEEDORES}${queryString}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener proveedores')
            };
        }
    }

    async createProveedor(proveedorData) {
        try {
            const response = await api.post(ENDPOINTS.PROVEEDORES, proveedorData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al crear proveedor')
            };
        }
    }

    async updateProveedor(id, proveedorData) {
        try {
            const response = await api.patch(ENDPOINTS.PROVEEDOR_DETAIL(id), proveedorData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al actualizar proveedor')
            };
        }
    }

    async getProveedorLotes(id, params = {}) {
        try {
            const queryString = buildQuery(params);
            const response = await api.get(`${ENDPOINTS.PROVEEDOR_LOTES(id)}${queryString}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener lotes del proveedor')
            };
        }
    }

    async getProveedoresActivos() {
        try {
            const response = await api.get(ENDPOINTS.PROVEEDORES_ACTIVOS);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener proveedores activos')
            };
        }
    }

    // ========== GESTIÓN DE LOTES ==========

    async getLotes(params = {}) {
        try {
            const queryString = buildQuery(params);
            const response = await api.get(`${ENDPOINTS.LOTES}${queryString}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener lotes')
            };
        }
    }

    async createLote(loteData) {
        try {
            const response = await api.post(ENDPOINTS.LOTES, loteData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al crear lote')
            };
        }
    }

    async getLoteById(id) {
        try {
            const response = await api.get(ENDPOINTS.LOTE_DETAIL(id));
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener lote')
            };
        }
    }

    async getLoteResumen(id) {
        try {
            const response = await api.get(ENDPOINTS.LOTE_RESUMEN(id));
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener resumen del lote')
            };
        }
    }

    async cerrarLote(id) {
        try {
            const response = await api.post(ENDPOINTS.LOTE_CERRAR(id));
            return {
                success: true,
                message: response.data.message || 'Lote cerrado correctamente'
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al cerrar lote')
            };
        }
    }

    async reabrirLote(id) {
        try {
            const response = await api.post(ENDPOINTS.LOTE_REABRIR(id));
            return {
                success: true,
                message: response.data.message || 'Lote reabierto correctamente'
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al reabrir lote')
            };
        }
    }

    async enviarLoteALaboratorio(id) {
        try {
            const response = await api.post(ENDPOINTS.LOTE_ENVIAR_LABORATORIO(id));
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al enviar lote a laboratorio')
            };
        }
    }

    async agregarEntregaParcial(loteId, entregaData) {
        try {
            const response = await api.post(ENDPOINTS.LOTE_AGREGAR_ENTREGA(loteId), entregaData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al agregar entrega parcial')
            };
        }
    }

    // ========== GESTIÓN DE MATERIALES ==========

    async getMateriales(params = {}) {
        try {
            const queryString = buildQuery(params);
            const response = await api.get(`${ENDPOINTS.MATERIALES}${queryString}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener materiales')
            };
        }
    }

    async createMaterial(materialData) {
        try {
            const response = await api.post(ENDPOINTS.MATERIALES, materialData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al crear material')
            };
        }
    }

    async getMaterialById(id) {
        try {
            const response = await api.get(ENDPOINTS.MATERIAL_DETAIL(id));
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener material')
            };
        }
    }

    async updateMaterial(id, materialData) {
        try {
            const response = await api.patch(ENDPOINTS.MATERIAL_DETAIL(id), materialData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al actualizar material')
            };
        }
    }

    async getMaterialHistorial(id) {
        try {
            const response = await api.get(ENDPOINTS.MATERIAL_HISTORIAL(id));
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener historial del material')
            };
        }
    }

    async cambiarEstadoMaterial(id, estadoData) {
        try {
            const response = await api.post(ENDPOINTS.MATERIAL_CAMBIAR_ESTADO(id), estadoData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al cambiar estado del material')
            };
        }
    }

    async enviarMaterialALaboratorio(id, observaciones = '') {
        try {
            const response = await api.post(ENDPOINTS.MATERIAL_ENVIAR_LABORATORIO(id), {
                observaciones
            });
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al enviar material a laboratorio')
            };
        }
    }

    async retornarMaterialDeLaboratorio(id, laboratorioData) {
        try {
            const response = await api.post(ENDPOINTS.MATERIAL_RETORNAR_LABORATORIO(id), laboratorioData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al retornar material de laboratorio')
            };
        }
    }

    async busquedaAvanzadaMateriales(criterios) {
        try {
            const response = await api.post(ENDPOINTS.MATERIAL_BUSQUEDA_AVANZADA, criterios);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error en búsqueda avanzada')
            };
        }
    }

    async validarUnicidadMaterial(params) {
        try {
            const queryString = buildQuery(params);
            const response = await api.get(`${ENDPOINTS.MATERIAL_VALIDAR_UNICIDAD}${queryString}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al validar unicidad')
            };
        }
    }

    async getMaterialesDisponibles(params = {}) {
        try {
            const queryString = buildQuery(params);
            const response = await api.get(`${ENDPOINTS.MATERIALES_DISPONIBLES_ASIGNACION}${queryString}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener materiales disponibles')
            };
        }
    }

    async operacionMasivaMateriales(operacionData) {
        try {
            const response = await api.post(ENDPOINTS.MATERIAL_OPERACION_MASIVA, operacionData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error en operación masiva')
            };
        }
    }

    // ========== GESTIÓN DE TRASPASOS ==========

    async getTraspasos(params = {}) {
        try {
            const queryString = buildQuery(params);
            const response = await api.get(`${ENDPOINTS.TRASPASOS}${queryString}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener traspasos')
            };
        }
    }

    async createTraspaso(traspasoData) {
        try {
            const response = await api.post(ENDPOINTS.TRASPASOS, traspasoData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al crear traspaso')
            };
        }
    }

    async getTraspasoById(id) {
        try {
            const response = await api.get(ENDPOINTS.TRASPASO_DETAIL(id));
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener traspaso')
            };
        }
    }

    async enviarTraspaso(id, datosEnvio = {}) {
        try {
            const response = await api.post(ENDPOINTS.TRASPASO_ENVIAR(id), datosEnvio);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al enviar traspaso')
            };
        }
    }

    async recibirTraspaso(id, datosRecepcion) {
        try {
            const response = await api.post(ENDPOINTS.TRASPASO_RECIBIR(id), datosRecepcion);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al recibir traspaso')
            };
        }
    }

    async cancelarTraspaso(id, motivo = '') {
        try {
            const response = await api.post(ENDPOINTS.TRASPASO_CANCELAR(id), { motivo });
            return {
                success: true,
                message: response.data.message || 'Traspaso cancelado correctamente'
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al cancelar traspaso')
            };
        }
    }

    async getTraspasoMateriales(id) {
        try {
            const response = await api.get(ENDPOINTS.TRASPASO_MATERIALES(id));
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener materiales del traspaso')
            };
        }
    }

    // ========== GESTIÓN DE DEVOLUCIONES ==========

    async getDevoluciones(params = {}) {
        try {
            const queryString = buildQuery(params);
            const response = await api.get(`${ENDPOINTS.DEVOLUCIONES}${queryString}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener devoluciones')
            };
        }
    }

    async createDevolucion(devolucionData) {
        try {
            const response = await api.post(ENDPOINTS.DEVOLUCIONES, devolucionData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al crear devolución')
            };
        }
    }

    async enviarDevolucionAProveedor(id) {
        try {
            const response = await api.post(ENDPOINTS.DEVOLUCION_ENVIAR(id));
            return {
                success: true,
                message: response.data.message || 'Devolución enviada al proveedor'
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al enviar devolución')
            };
        }
    }

    async confirmarRespuestaProveedor(id, respuestaData) {
        try {
            const response = await api.post(ENDPOINTS.DEVOLUCION_CONFIRMAR(id), respuestaData);
            return {
                success: true,
                message: response.data.message || 'Respuesta del proveedor confirmada'
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al confirmar respuesta del proveedor')
            };
        }
    }

    // ========== OPERACIONES DE LABORATORIO ==========

    async getDashboardLaboratorio() {
        try {
            const response = await api.get(ENDPOINTS.LABORATORIO);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener dashboard de laboratorio')
            };
        }
    }

    async operacionLaboratorio(operacionData) {
        try {
            const response = await api.post(ENDPOINTS.LABORATORIO, operacionData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error en operación de laboratorio')
            };
        }
    }

    async operacionMasivaLaboratorio(operacionData) {
        try {
            const response = await api.post(ENDPOINTS.LABORATORIO_MASIVO, operacionData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error en operación masiva de laboratorio')
            };
        }
    }

    async getConsultasLaboratorio(params = {}) {
        try {
            const queryString = buildQuery(params);
            const response = await api.get(`${ENDPOINTS.LABORATORIO_CONSULTAS}${queryString}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener consultas de laboratorio')
            };
        }
    }

    // ========== IMPORTACIÓN MASIVA ==========

    async getPlantillaImportacion() {
        try {
            const response = await api.get(ENDPOINTS.IMPORTACION_MASIVA);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener plantilla de importación')
            };
        }
    }

    async procesarImportacionMasiva(formData) {
        try {
            const response = await api.post(ENDPOINTS.IMPORTACION_MASIVA, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al procesar importación masiva')
            };
        }
    }

    // ========== REPORTES Y ESTADÍSTICAS ==========

    async getEstadisticasGenerales() {
        try {
            const response = await api.get(ENDPOINTS.ESTADISTICAS_GENERALES);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener estadísticas generales')
            };
        }
    }

    async getDashboardOperativo() {
        try {
            const response = await api.get(ENDPOINTS.DASHBOARD);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener dashboard operativo')
            };
        }
    }

    async getReporteInventario(params = {}) {
        try {
            const queryString = buildQuery(params);
            const response = await api.get(`${ENDPOINTS.REPORTE_INVENTARIO}${queryString}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener reporte de inventario')
            };
        }
    }

    async getReporteMovimientos(params = {}) {
        try {
            const queryString = buildQuery(params);
            const response = await api.get(`${ENDPOINTS.REPORTE_MOVIMIENTOS}${queryString}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener reporte de movimientos')
            };
        }
    }

    async getReporteGarantias(params = {}) {
        try {
            const queryString = buildQuery(params);
            const response = await api.get(`${ENDPOINTS.REPORTE_GARANTIAS}${queryString}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener reporte de garantías')
            };
        }
    }

    async getReporteEficiencia(params = {}) {
        try {
            const queryString = buildQuery(params);
            const response = await api.get(`${ENDPOINTS.REPORTE_EFICIENCIA}${queryString}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener reporte de eficiencia')
            };
        }
    }

    // ========== MODELOS BÁSICOS ==========

    async getMarcas(params = {}) {
        try {
            const queryString = buildQuery(params);
            const response = await api.get(`${ENDPOINTS.MARCAS}${queryString}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener marcas')
            };
        }
    }

    async createMarca(marcaData) {
        try {
            const response = await api.post(ENDPOINTS.MARCAS, marcaData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al crear marca')
            };
        }
    }

    async getTiposEquipo(params = {}) {
        try {
            const queryString = buildQuery(params);
            const response = await api.get(`${ENDPOINTS.TIPOS_EQUIPO}${queryString}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener tipos de equipo')
            };
        }
    }

    async getModelos(params = {}) {
        try {
            const queryString = buildQuery(params);
            const response = await api.get(`${ENDPOINTS.MODELOS}${queryString}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener modelos')
            };
        }
    }

    async createModelo(modeloData) {
        try {
            const response = await api.post(ENDPOINTS.MODELOS, modeloData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al crear modelo')
            };
        }
    }

    async getComponentes(params = {}) {
        try {
            const queryString = buildQuery(params);
            const response = await api.get(`${ENDPOINTS.COMPONENTES}${queryString}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener componentes')
            };
        }
    }

    async toggleActivoModelo(tipo, id) {
        try {
            let endpoint;
            switch (tipo) {
                case 'marca':
                    endpoint = ENDPOINTS.MARCA_TOGGLE_ACTIVO(id);
                    break;
                case 'tipo_equipo':
                    endpoint = ENDPOINTS.TIPO_EQUIPO_TOGGLE_ACTIVO(id);
                    break;
                case 'modelo':
                    endpoint = ENDPOINTS.MODELO_TOGGLE_ACTIVO(id);
                    break;
                case 'componente':
                    endpoint = ENDPOINTS.COMPONENTE_TOGGLE_ACTIVO(id);
                    break;
                default:
                    throw new Error('Tipo de modelo no válido');
            }

            const response = await api.post(endpoint);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al cambiar estado')
            };
        }
    }

    // ========== COMPATIBILIDAD LEGACY ==========

    async getEquiposONU(params = {}) {
        try {
            const queryString = buildQuery(params);
            const response = await api.get(`${ENDPOINTS.EQUIPOS_ONU}${queryString}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener equipos ONU legacy')
            };
        }
    }

    async getEquipoONUHistorial(id) {
        try {
            const response = await api.get(ENDPOINTS.EQUIPO_ONU_HISTORIAL(id));
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al obtener historial del equipo')
            };
        }
    }

    async cambiarEstadoLegacy(id, estadoData) {
        try {
            const response = await api.post(ENDPOINTS.EQUIPO_ONU_CAMBIAR_ESTADO(id), estadoData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al cambiar estado legacy')
            };
        }
    }

    // ========== UTILIDADES Y HELPERS ==========

    async exportarDatos(tipo, params = {}) {
        try {
            const endpoints = {
                'inventario': ENDPOINTS.REPORTE_INVENTARIO,
                'movimientos': ENDPOINTS.REPORTE_MOVIMIENTOS,
                'garantias': ENDPOINTS.REPORTE_GARANTIAS,
                'eficiencia': ENDPOINTS.REPORTE_EFICIENCIA,
            };

            if (!endpoints[tipo]) {
                throw new Error('Tipo de exportación no válido');
            }

            const exportParams = { ...params, formato: 'csv' };
            const queryString = buildQuery(exportParams);

            const response = await api.get(`${endpoints[tipo]}${queryString}`, {
                responseType: 'blob'
            });

            return {
                success: true,
                data: response.data,
                headers: response.headers
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al exportar datos')
            };
        }
    }

    async validarCodigosSPRINT(codigos) {
        try {
            // Endpoint personalizado para validar códigos SPRINT si es necesario
            // Por ahora usar validación local
            const errores = [];

            Object.entries(codigos).forEach(([campo, valor]) => {
                if (!valor || typeof valor !== 'string') {
                    errores.push(`${campo} es requerido`);
                } else if (!/^\d{6,10}$/.test(valor)) {
                    errores.push(`${campo} debe tener entre 6-10 dígitos`);
                }
            });

            return {
                success: errores.length === 0,
                valido: errores.length === 0,
                errores
            };
        } catch (error) {
            return {
                success: false,
                error: 'Error en validación de códigos SPRINT'
            };
        }
    }

    async buscarPorCodigo(codigo, tipo = 'all') {
        try {
            const params = { search: codigo };

            switch (tipo) {
                case 'material':
                    return await this.getMateriales(params);
                case 'lote':
                    return await this.getLotes(params);
                case 'traspaso':
                    return await this.getTraspasos(params);
                default:
                    // Búsqueda global
                    const [materiales, lotes, traspasos] = await Promise.all([
                        this.getMateriales(params),
                        this.getLotes(params),
                        this.getTraspasos(params)
                    ]);

                    return {
                        success: true,
                        data: {
                            materiales: materiales.success ? materiales.data : [],
                            lotes: lotes.success ? lotes.data : [],
                            traspasos: traspasos.success ? traspasos.data : []
                        }
                    };
            }
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error en búsqueda por código')
            };
        }
    }

    // ========== GESTIÓN DE ARCHIVOS ==========

    async subirArchivo(archivo, tipo = 'importacion') {
        try {
            const formData = new FormData();
            formData.append('archivo', archivo);
            formData.append('tipo', tipo);

            const response = await api.post(`${BASE_API}/almacenes/upload/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al subir archivo')
            };
        }
    }

    async descargarPlantilla(tipo = 'importacion_masiva') {
        try {
            const response = await api.get(`${BASE_API}/almacenes/plantillas/${tipo}/`, {
                responseType: 'blob'
            });

            return {
                success: true,
                data: response.data,
                headers: response.headers
            };
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error al descargar plantilla')
            };
        }
    }

    // ========== OPERACIONES ESPECIALES ==========

    async obtenerSugerenciasCodigo(tipoMaterial, marca, modelo) {
        try {
            // Generar sugerencias de código interno
            const prefijo = tipoMaterial === 'ONU' ? 'EQ' : 'MAT';
            const timestamp = Date.now().toString().slice(-6);

            return {
                success: true,
                data: {
                    codigo_sugerido: `${prefijo}-${timestamp}`,
                    patron: `${prefijo}-XXXXXX`,
                    descripcion: `Código sugerido para ${tipoMaterial}`
                }
            };
        } catch (error) {
            return {
                success: false,
                error: 'Error al generar sugerencias de código'
            };
        }
    }

    async verificarDisponibilidadCodigo(codigo) {
        try {
            const response = await this.getMateriales({ search: codigo });
            const existe = response.success && response.data.results && response.data.results.length > 0;

            return {
                success: true,
                disponible: !existe,
                mensaje: existe ? 'Código ya en uso' : 'Código disponible'
            };
        } catch (error) {
            return {
                success: false,
                error: 'Error al verificar código'
            };
        }
    }

    async getEstadisticasRapidas() {
        try {
            // Obtener estadísticas básicas para dashboard rápido
            const [almacenes, materiales, lotes, traspasos] = await Promise.all([
                this.getAlmacenes({ page_size: 1 }),
                this.getMateriales({ page_size: 1 }),
                this.getLotes({ page_size: 1 }),
                this.getTraspasos({ page_size: 1, estado: 'PENDIENTE' })
            ]);

            return {
                success: true,
                data: {
                    total_almacenes: almacenes.success ? almacenes.data.count || 0 : 0,
                    total_materiales: materiales.success ? materiales.data.count || 0 : 0,
                    total_lotes: lotes.success ? lotes.data.count || 0 : 0,
                    traspasos_pendientes: traspasos.success ? traspasos.data.count || 0 : 0,
                    fecha_actualizacion: new Date().toISOString()
                }
            };
        } catch (error) {
            return {
                success: false,
                error: 'Error al obtener estadísticas rápidas'
            };
        }
    }

    // ========== VALIDACIONES ESPECÍFICAS ==========

    async validarMACAddress(mac, materialId = null) {
        try {
            const params = { mac };
            if (materialId) params.material_id = materialId;

            const response = await this.validarUnicidadMaterial(params);
            return response;
        } catch (error) {
            return {
                success: false,
                error: 'Error al validar MAC Address'
            };
        }
    }

    async validarGPONSerial(gpon_serial, materialId = null) {
        try {
            const params = { gpon_serial };
            if (materialId) params.material_id = materialId;

            const response = await this.validarUnicidadMaterial(params);
            return response;
        } catch (error) {
            return {
                success: false,
                error: 'Error al validar GPON Serial'
            };
        }
    }

    async validarDSN(d_sn, materialId = null) {
        try {
            const params = { d_sn };
            if (materialId) params.material_id = materialId;

            const response = await this.validarUnicidadMaterial(params);
            return response;
        } catch (error) {
            return {
                success: false,
                error: 'Error al validar D-SN'
            };
        }
    }

    // ========== OPERACIONES EN LOTE ==========

    async procesarOperacionLote(operacion, items, parametros = {}) {
        try {
            const operacionData = {
                operacion,
                items,
                parametros
            };

            switch (operacion) {
                case 'enviar_laboratorio_lote':
                    const response = await this.operacionMasivaLaboratorio({
                        accion: 'enviar_lote_completo',
                        criterios: { lote_id: parametros.lote_id }
                    });
                    return response;

                case 'crear_traspaso_masivo':
                    const traspasoData = {
                        ...parametros,
                        materiales_ids: items
                    };
                    return await this.createTraspaso(traspasoData);

                case 'cambiar_estado_masivo':
                    return await this.operacionMasivaMateriales({
                        materiales_ids: items,
                        operacion: 'cambiar_estado',
                        parametros
                    });

                default:
                    throw new Error(`Operación ${operacion} no soportada`);
            }
        } catch (error) {
            return {
                success: false,
                error: this.extractErrorMessage(error, 'Error en operación en lote')
            };
        }
    }

    // ========== ANÁLISIS Y MÉTRICAS ==========

    async analizarRendimientoAlmacen(almacenId, periodoInicio, periodoFin) {
        try {
            const params = {
                almacen_id: almacenId,
                fecha_desde: periodoInicio,
                fecha_hasta: periodoFin
            };

            const [movimientos, eficiencia] = await Promise.all([
                this.getReporteMovimientos(params),
                this.getReporteEficiencia(params)
            ]);

            return {
                success: true,
                data: {
                    movimientos: movimientos.success ? movimientos.data : null,
                    eficiencia: eficiencia.success ? eficiencia.data : null,
                    periodo: { inicio: periodoInicio, fin: periodoFin }
                }
            };
        } catch (error) {
            return {
                success: false,
                error: 'Error al analizar rendimiento del almacén'
            };
        }
    }

    async obtenerAlertasOperativas() {
        try {
            const [laboratorio, garantias, traspasos] = await Promise.all([
                this.getConsultasLaboratorio({ tipo: 'tiempo_excesivo', dias_limite: 15 }),
                this.getReporteGarantias({ dias: 30 }),
                this.getTraspasos({ estado: 'EN_TRANSITO' })
            ]);

            const alertas = [];

            // Alertas de laboratorio
            if (laboratorio.success && laboratorio.data.total > 0) {
                alertas.push({
                    tipo: 'laboratorio',
                    nivel: 'warning',
                    mensaje: `${laboratorio.data.total} materiales con tiempo excesivo en laboratorio`,
                    cantidad: laboratorio.data.total
                });
            }

            // Alertas de garantías
            if (garantias.success && garantias.data.resumen?.total_lotes_proximos_vencer > 0) {
                alertas.push({
                    tipo: 'garantias',
                    nivel: 'info',
                    mensaje: `${garantias.data.resumen.total_lotes_proximos_vencer} lotes próximos a vencer garantía`,
                    cantidad: garantias.data.resumen.total_lotes_proximos_vencer
                });
            }

            // Alertas de traspasos
            if (traspasos.success && traspasos.data.count > 0) {
                alertas.push({
                    tipo: 'traspasos',
                    nivel: 'info',
                    mensaje: `${traspasos.data.count} traspasos en tránsito`,
                    cantidad: traspasos.data.count
                });
            }

            return {
                success: true,
                data: alertas
            };
        } catch (error) {
            return {
                success: false,
                error: 'Error al obtener alertas operativas'
            };
        }
    }

    // ========== HELPER METHODS ==========

    extractErrorMessage(error, defaultMessage) {
        if (error.response?.data) {
            const data = error.response.data;

            // Si hay errores de validación
            if (data.errors) {
                return this.formatValidationErrors(data.errors);
            }

            // Si hay un mensaje de error específico
            if (data.error) {
                return data.error;
            }

            // Si hay un mensaje general
            if (data.message) {
                return data.message;
            }

            // Si hay errores de campo
            if (typeof data === 'object') {
                const fieldErrors = this.formatFieldErrors(data);
                if (fieldErrors) return fieldErrors;
            }
        }

        return defaultMessage;
    }

    formatValidationErrors(errors) {
        if (Array.isArray(errors)) {
            return errors.join(', ');
        }

        if (typeof errors === 'object') {
            return Object.entries(errors)
                .map(([field, messages]) => {
                    const fieldName = this.translateFieldName(field);
                    const errorMessages = Array.isArray(messages) ? messages.join(', ') : messages;
                    return `${fieldName}: ${errorMessages}`;
                })
                .join('; ');
        }

        return errors;
    }

    formatFieldErrors(data) {
        const excludeFields = ['error', 'message', 'success'];
        const errorEntries = Object.entries(data)
            .filter(([key]) => !excludeFields.includes(key))
            .filter(([_, value]) => value);

        if (errorEntries.length > 0) {
            return errorEntries
                .map(([field, messages]) => {
                    const fieldName = this.translateFieldName(field);
                    const errorMessages = Array.isArray(messages) ? messages.join(', ') : messages;
                    return `${fieldName}: ${errorMessages}`;
                })
                .join('; ');
        }

        return null;
    }

    translateFieldName(field) {
        const translations = {
            // Almacenes
            'codigo': 'Código',
            'nombre': 'Nombre',
            'ciudad': 'Ciudad',
            'direccion': 'Dirección',
            'tipo': 'Tipo',
            'es_principal': 'Es Principal',

            // Proveedores
            'nombre_comercial': 'Nombre Comercial',
            'razon_social': 'Razón Social',
            'contacto_principal': 'Contacto Principal',
            'telefono': 'Teléfono',
            'email': 'Email',

            // Lotes
            'numero_lote': 'Número de Lote',
            'tipo_ingreso': 'Tipo de Ingreso',
            'proveedor': 'Proveedor',
            'almacen_destino': 'Almacén Destino',
            'codigo_requerimiento_compra': 'Código Requerimiento',
            'codigo_nota_ingreso': 'Código Nota Ingreso',
            'fecha_recepcion': 'Fecha Recepción',
            'fecha_inicio_garantia': 'Inicio Garantía',
            'fecha_fin_garantia': 'Fin Garantía',

            // Materiales
            'codigo_interno': 'Código Interno',
            'tipo_material': 'Tipo Material',
            'modelo': 'Modelo',
            'mac_address': 'MAC Address',
            'gpon_serial': 'GPON Serial',
            'serial_manufacturer': 'D-SN',
            'codigo_barras': 'Código de Barras',
            'codigo_item_equipo': 'Código Item Equipo',
            'almacen_actual': 'Almacén Actual',
            'cantidad': 'Cantidad',

            // Traspasos
            'numero_traspaso': 'Número Traspaso',
            'numero_solicitud': 'Número Solicitud',
            'almacen_origen': 'Almacén Origen',
            'motivo': 'Motivo',
            'cantidad_enviada': 'Cantidad Enviada',
            'cantidad_recibida': 'Cantidad Recibida',

            // Genéricos
            'observaciones': 'Observaciones',
            'activo': 'Activo',
            'descripcion': 'Descripción',
            'created_at': 'Fecha Creación',
            'updated_at': 'Fecha Actualización',
            'non_field_errors': 'Error general'
        };

        return translations[field] || field.charAt(0).toUpperCase() + field.slice(1);
    }

    // ========== UTILIDADES DE FORMATO ==========

    formatMACAddress(mac) {
        if (!mac) return '';
        return mac.toUpperCase().replace(/[^0-9A-F]/g, '').replace(/(.{2})/g, '$1:').slice(0, -1);
    }

    validarFormatoMAC(mac) {
        const macRegex = /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/i;
        return macRegex.test(mac);
    }

    generarCodigoLote(proveedor, fecha = new Date()) {
        const year = fecha.getFullYear().toString().slice(-2);
        const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const proveedorCode = proveedor.codigo || proveedor.nombre_comercial.slice(0, 3).toUpperCase();
        const random = Math.floor(Math.random() * 999).toString().padStart(3, '0');

        return `${proveedorCode}-${year}${month}-${random}`;
    }

    calcularPorcentajeRecepcion(cantidadTotal, cantidadRecibida) {
        if (!cantidadTotal || cantidadTotal === 0) return 0;
        return Math.round((cantidadRecibida / cantidadTotal) * 100);
    }

    // ========== CONSTANTES Y CONFIGURACIÓN ==========

    getTiposMaterial() {
        return [
            { codigo: 'ONU', nombre: 'Equipo ONU' },
            { codigo: 'CABLE_DROP', nombre: 'Cable Drop' },
            { codigo: 'CONECTOR_APC', nombre: 'Conector APC' },
            { codigo: 'CONECTOR_UPC', nombre: 'Conector UPC' },
            { codigo: 'ROSETA_OPTICA', nombre: 'Roseta Óptica' },
            { codigo: 'PATCH_CORE', nombre: 'Patch Core' },
            { codigo: 'TRIPLEXOR', nombre: 'Triplexor' },
            { codigo: 'OTRO', nombre: 'Otro Material' }
        ];
    }

    getEstadosONU() {
        return [
            { codigo: 'NUEVO', nombre: 'Nuevo' },
            { codigo: 'DISPONIBLE', nombre: 'Disponible' },
            { codigo: 'RESERVADO', nombre: 'Reservado' },
            { codigo: 'ASIGNADO', nombre: 'Asignado' },
            { codigo: 'INSTALADO', nombre: 'Instalado' },
            { codigo: 'EN_LABORATORIO', nombre: 'En Laboratorio' },
            { codigo: 'DEFECTUOSO', nombre: 'Defectuoso' },
            { codigo: 'DEVUELTO_PROVEEDOR', nombre: 'Devuelto a Proveedor' },
            { codigo: 'REINGRESADO', nombre: 'Reingresado' },
            { codigo: 'DADO_DE_BAJA', nombre: 'Dado de Baja' }
        ];
    }

    getEstadosGenerales() {
        return [
            { codigo: 'DISPONIBLE', nombre: 'Disponible' },
            { codigo: 'RESERVADO', nombre: 'Reservado' },
            { codigo: 'ASIGNADO', nombre: 'Asignado' },
            { codigo: 'CONSUMIDO', nombre: 'Consumido' },
            { codigo: 'DEFECTUOSO', nombre: 'Defectuoso' },
            { codigo: 'DADO_DE_BAJA', nombre: 'Dado de Baja' }
        ];
    }

    getUnidadesMedida() {
        return [
            { codigo: 'PIEZA', nombre: 'Pieza' },
            { codigo: 'UNIDAD', nombre: 'Unidad' },
            { codigo: 'METROS', nombre: 'Metros' },
            { codigo: 'CAJA', nombre: 'Caja' },
            { codigo: 'ROLLO', nombre: 'Rollo' },
            { codigo: 'KIT', nombre: 'Kit' },
            { codigo: 'PAQUETE', nombre: 'Paquete' }
        ];
    }

    getEstadosLote() {
        return [
            { codigo: 'REGISTRADO', nombre: 'Registrado' },
            { codigo: 'PENDIENTE_RECEPCION', nombre: 'Pendiente Recepción' },
            { codigo: 'RECEPCION_PARCIAL', nombre: 'Recepción Parcial' },
            { codigo: 'RECEPCION_COMPLETA', nombre: 'Recepción Completa' },
            { codigo: 'ACTIVO', nombre: 'Activo' },
            { codigo: 'CERRADO', nombre: 'Cerrado' }
        ];
    }

    getEstadosTraspaso() {
        return [
            { codigo: 'PENDIENTE', nombre: 'Pendiente' },
            { codigo: 'EN_TRANSITO', nombre: 'En Tránsito' },
            { codigo: 'RECIBIDO', nombre: 'Recibido' },
            { codigo: 'CANCELADO', nombre: 'Cancelado' }
        ];
    }

    getTiposIngreso() {
        return [
            { codigo: 'NUEVO', nombre: 'Nuevo' },
            { codigo: 'REINGRESO', nombre: 'Reingreso' },
            { codigo: 'DEVOLUCION', nombre: 'Devolución' },
            { codigo: 'LABORATORIO', nombre: 'Laboratorio' }
        ];
    }

    // ========== UTILIDADES DE CONFIGURACIÓN ==========

    getConfiguracionImportacion() {
        return {
            columnasRequeridas: ['MAC', 'GPON_SN', 'D_SN', 'ITEM_EQUIPO'],
            formatosPermitidos: ['.xlsx', '.xls', '.csv'],
            tamañoMaximo: 5 * 1024 * 1024, // 5MB
            maxRegistros: 1000,
            ejemplos: {
                MAC: '00:11:22:33:44:55',
                GPON_SN: 'HWTC12345678',
                D_SN: 'SN123456789',
                ITEM_EQUIPO: '1234567890'
            }
        };
    }

    getColoresEstado() {
        return {
            // Estados ONU
            'NUEVO': 'orange',
            'DISPONIBLE': 'green',
            'RESERVADO': 'blue',
            'ASIGNADO': 'indigo',
            'INSTALADO': 'purple',
            'EN_LABORATORIO': 'yellow',
            'DEFECTUOSO': 'red',
            'DEVUELTO_PROVEEDOR': 'gray',
            'REINGRESADO': 'cyan',
            'DADO_DE_BAJA': 'red',

            // Estados generales
            'CONSUMIDO': 'gray',

            // Estados de lote
            'REGISTRADO': 'gray',
            'PENDIENTE_RECEPCION': 'orange',
            'RECEPCION_PARCIAL': 'yellow',
            'RECEPCION_COMPLETA': 'blue',
            'ACTIVO': 'green',
            'CERRADO': 'gray',

            // Estados de traspaso
            'PENDIENTE': 'orange',
            'EN_TRANSITO': 'blue',
            'RECIBIDO': 'green',
            'CANCELADO': 'red'
        };
    }
}

const almacenService = new AlmacenService();
export default almacenService;