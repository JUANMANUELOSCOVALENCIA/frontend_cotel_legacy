import { api } from '../../../services/api';
import { ENDPOINTS, buildQuery } from '../../../services/endpoints';
import { getToken } from '../../../utils/storage';

class AlmacenesService {
    // ========== OPCIONES COMPLETAS ==========
    async getOpcionesCompletas() {
        try {
            const response = await api.get(ENDPOINTS.OPCIONES_COMPLETAS);
            return {
                success: true,
                data: response.data.data || response.data
            };
        } catch (error) {
            console.error('Error al obtener opciones completas:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener opciones'
            };
        }
    }

    async inicializarDatos() {
        try {
            const response = await api.post(ENDPOINTS.INICIALIZAR_DATOS);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al inicializar datos'
            };
        }
    }

    // ========== ALMACENES ==========
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
                error: error.response?.data?.message || 'Error al obtener almacenes'
            };
        }
    }

    async getAlmacen(id) {
        try {
            const response = await api.get(ENDPOINTS.ALMACEN_DETAIL(id));
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener almacén'
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
                error: error.response?.data?.message || 'Error al crear almacén'
            };
        }
    }

    async updateAlmacen(id, almacenData) {
        try {
            const response = await api.put(ENDPOINTS.ALMACEN_DETAIL(id), almacenData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al actualizar almacén'
            };
        }
    }

    async deleteAlmacen(id) {
        try {
            const response = await api.delete(ENDPOINTS.ALMACEN_DETAIL(id));
            return {
                success: true,
                message: 'Almacén eliminado correctamente'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al eliminar almacén'
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
                error: error.response?.data?.message || 'Error al obtener estadísticas'
            };
        }
    }

    // ========== PROVEEDORES ==========
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
                error: error.response?.data?.message || 'Error al obtener proveedores'
            };
        }
    }

    async getProveedor(id) {
        try {
            const response = await api.get(ENDPOINTS.PROVEEDOR_DETAIL(id));
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener proveedor'
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
                error: error.response?.data?.message || 'Error al crear proveedor'
            };
        }
    }

    async updateProveedor(id, proveedorData) {
        try {
            const response = await api.put(ENDPOINTS.PROVEEDOR_DETAIL(id), proveedorData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al actualizar proveedor'
            };
        }
    }

    async deleteProveedor(id) {
        try {
            const response = await api.delete(ENDPOINTS.PROVEEDOR_DETAIL(id));
            return {
                success: true,
                message: 'Proveedor eliminado correctamente'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al eliminar proveedor'
            };
        }
    }

    // ========== MARCAS ==========
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
                error: error.response?.data?.message || 'Error al obtener marcas'
            };
        }
    }

    async getMarca(id) {
        try {
            const response = await api.get(ENDPOINTS.MARCA_DETAIL(id));
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener marca'
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
                error: error.response?.data?.message || 'Error al crear marca'
            };
        }
    }

    async updateMarca(id, marcaData) {
        try {
            const response = await api.put(ENDPOINTS.MARCA_DETAIL(id), marcaData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al actualizar marca'
            };
        }
    }

    async deleteMarca(id) {
        try {
            const response = await api.delete(ENDPOINTS.MARCA_DETAIL(id));
            return {
                success: true,
                message: 'Marca eliminada correctamente'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al eliminar marca'
            };
        }
    }

    async toggleActivoMarca(id) {
        try {
            const response = await api.post(ENDPOINTS.MARCA_TOGGLE_ACTIVO(id));
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al cambiar estado de marca'
            };
        }
    }

    // ========== TIPOS DE EQUIPO ==========
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
                error: error.response?.data?.message || 'Error al obtener tipos de equipo'
            };
        }
    }

    async getTipoEquipo(id) {
        try {
            const response = await api.get(ENDPOINTS.TIPO_EQUIPO_DETAIL(id));
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener tipo de equipo'
            };
        }
    }

    async createTipoEquipo(tipoData) {
        try {
            const response = await api.post(ENDPOINTS.TIPOS_EQUIPO, tipoData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al crear tipo de equipo'
            };
        }
    }

    async updateTipoEquipo(id, tipoData) {
        try {
            const response = await api.put(ENDPOINTS.TIPO_EQUIPO_DETAIL(id), tipoData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al actualizar tipo de equipo'
            };
        }
    }

    async deleteTipoEquipo(id) {
        try {
            const response = await api.delete(ENDPOINTS.TIPO_EQUIPO_DETAIL(id));
            return {
                success: true,
                message: 'Tipo de equipo eliminado correctamente'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al eliminar tipo de equipo'
            };
        }
    }

    async toggleActivoTipoEquipo(id) {
        try {
            const response = await api.post(ENDPOINTS.TIPO_EQUIPO_TOGGLE_ACTIVO(id));
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al cambiar estado del tipo'
            };
        }
    }

    // ========== MODELOS ==========
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
                error: error.response?.data?.message || 'Error al obtener modelos'
            };
        }
    }

    async getModelo(id) {
        try {
            const response = await api.get(ENDPOINTS.MODELO_DETAIL(id));
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener modelo'
            };
        }
    }

    // src/core/almacenes/services/almacenesService.js - DEBUG COMPLETO
    // src/core/almacenes/services/almacenesService.js - CORRECCIÓN FINAL
    async createModelo(modeloData) {
        try {
            const baseURL = import.meta.env.VITE_API_URL;
            const token = getToken(); // Usa tu función para obtener el token

            // ✅ EL BACKEND ESPERA 'tipo_material', NO 'tipo_equipo'
            const payload = {
                nombre: modeloData.nombre,
                codigo_modelo: modeloData.codigo_modelo,
                marca: modeloData.marca,
                tipo_material: modeloData.tipo_material, // ✅ CORREGIR: usar tipo_material
                unidad_medida: modeloData.unidad_medida,
                requiere_inspeccion_inicial: modeloData.requiere_inspeccion_inicial,
                descripcion: modeloData.descripcion
            };

            console.log('📤 FETCH - Enviando payload correcto:', JSON.stringify(payload));

            const response = await fetch(`${baseURL}/almacenes/modelos/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            console.log('📡 FETCH - Status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ FETCH - Error response:', errorText);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            console.log('✅ FETCH - Success:', data);

            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('❌ FETCH - Error:', error);
            return {
                success: false,
                error: error.message || 'Error al crear modelo'
            };
        }
    }

    // src/core/almacenes/services/almacenesService.js - updateModelo CORREGIDO
    // src/core/almacenes/services/almacenesService.js - updateModelo corregido
    async updateModelo(id, modeloData) {
        try {
            const baseURL = import.meta.env.VITE_API_URL;
            const token = getToken();

            // ✅ EL BACKEND ESPERA 'tipo_material', NO 'tipo_equipo'
            const payload = {
                nombre: modeloData.nombre,
                codigo_modelo: modeloData.codigo_modelo,
                marca: modeloData.marca,
                tipo_material: modeloData.tipo_material, // ✅ CORREGIR: usar tipo_material
                unidad_medida: modeloData.unidad_medida,
                requiere_inspeccion_inicial: modeloData.requiere_inspeccion_inicial,
                descripcion: modeloData.descripcion
            };

            console.log('📤 UPDATE - Enviando payload:', JSON.stringify(payload));

            const response = await fetch(`${baseURL}/almacenes/modelos/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ UPDATE - Error response:', errorText);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('❌ UPDATE - Error:', error);
            return {
                success: false,
                error: error.message || 'Error al actualizar modelo'
            };
        }
    }

    async deleteModelo(id) {
        try {
            const response = await api.delete(ENDPOINTS.MODELO_DETAIL(id));
            return {
                success: true,
                message: 'Modelo eliminado correctamente'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al eliminar modelo'
            };
        }
    }

    async toggleActivoModelo(id) {
        try {
            const response = await api.post(ENDPOINTS.MODELO_TOGGLE_ACTIVO(id));
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al cambiar estado del modelo'
            };
        }
    }

    // ========== COMPONENTES ==========
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
                error: error.response?.data?.message || 'Error al obtener componentes'
            };
        }
    }

    async createComponente(componenteData) {
        try {
            const response = await api.post(ENDPOINTS.COMPONENTES, componenteData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al crear componente'
            };
        }
    }

    // ========== LOTES ==========
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
                error: error.response?.data?.message || 'Error al obtener lotes'
            };
        }
    }

    async getLote(id) {
        try {
            const response = await api.get(ENDPOINTS.LOTE_DETAIL(id));
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener lote'
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
                error: error.response?.data?.message || 'Error al crear lote'
            };
        }
    }

    async updateLote(id, loteData) {
        try {
            const response = await api.put(ENDPOINTS.LOTE_DETAIL(id), loteData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al actualizar lote'
            };
        }
    }

    async deleteLote(id) {
        try {
            const response = await api.delete(ENDPOINTS.LOTE_DETAIL(id));
            return {
                success: true,
                message: 'Lote eliminado correctamente'
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al eliminar lote'
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
                error: error.response?.data?.message || 'Error al obtener resumen del lote'
            };
        }
    }

    async getLoteMateriales(id, params = {}) {
        try {
            const queryString = buildQuery(params);
            const response = await api.get(`${ENDPOINTS.LOTE_MATERIALES(id)}${queryString}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener materiales del lote'
            };
        }
    }

    async cerrarLote(id) {
        try {
            const response = await api.post(ENDPOINTS.LOTE_CERRAR(id));
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al cerrar lote'
            };
        }
    }

    async reabrirLote(id) {
        try {
            const response = await api.post(ENDPOINTS.LOTE_REABRIR(id));
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al reabrir lote'
            };
        }
    }

    // ========== IMPORTACIÓN MASIVA (ACTUALIZADO) ==========
    async importarMaterialesMasivo(archivo, loteId, modeloId, itemEquipo, esValidacion = false) {
        try {
            console.log('🔍 SERVICE DEBUG - Parámetros recibidos:', {
                archivo: archivo?.name,
                loteId,
                modeloId,
                itemEquipo,
                esValidacion
            });

            const formData = new FormData();
            formData.append('archivo', archivo);
            formData.append('lote_id', loteId);
            formData.append('modelo_id', modeloId);
            formData.append('item_equipo', itemEquipo); // NUEVO PARÁMETRO
            formData.append('validacion', esValidacion);

            // DEBUGGING: Ver qué contiene exactamente el FormData
            console.log('📤 FormData siendo enviado:');
            for (let [key, value] of formData.entries()) {
                console.log(`   ${key}: ${value} (tipo: ${typeof value})`);
            }

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
                error: error.response?.data?.message || 'Error en la importación masiva'
            };
        }
    }
    async importacionMasiva(formData) {
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
                error: error.response?.data?.message || 'Error en la importación masiva'
            };
        }
    }

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
                error: error.response?.data?.message || 'Error al obtener plantilla'
            };
        }
    }

    // ========== MATERIALES ==========
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
                error: error.response?.data?.message || 'Error al obtener materiales'
            };
        }
    }

    async getMaterial(id) {
        try {
            const response = await api.get(ENDPOINTS.MATERIAL_DETAIL(id));
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener material'
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
                error: error.response?.data?.message || 'Error al obtener historial'
            };
        }
    }

    // ========== ESTADÍSTICAS Y REPORTES ==========
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
                error: error.response?.data?.message || 'Error al obtener estadísticas'
            };
        }
    }

    async getDashboard() {
        try {
            const response = await api.get(ENDPOINTS.DASHBOARD_ALMACENES);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener dashboard'
            };
        }
    }
    // ========== MATERIALES ==========
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
                error: error.response?.data?.message || 'Error al obtener materiales'
            };
        }
    }

    async getMaterial(id) {
        try {
            const response = await api.get(ENDPOINTS.MATERIAL_DETAIL(id));
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener material'
            };
        }
    }

    async getEstadisticasMateriales(filtros = {}) {
        try {
            const queryString = buildQuery(filtros);
            const response = await api.get(`${ENDPOINTS.MATERIALES}/estadisticas/${queryString}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener estadísticas'
            };
        }
    }

    async cambiarEstadoMaterial(id, estadoId) {
        try {
            const response = await api.post(`${ENDPOINTS.MATERIAL_DETAIL(id)}/cambiar_estado/`, {
                estado_id: estadoId
            });
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al cambiar estado'
            };
        }
    }

    async busquedaAvanzadaMateriales(criterios) {
        try {
            const response = await api.post(`${ENDPOINTS.MATERIALES}/busqueda_avanzada/`, criterios);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error en búsqueda avanzada'
            };
        }
    }
}

export default new AlmacenesService();