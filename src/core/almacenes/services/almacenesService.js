// ======================================================
// src/core/almacenes/services/almacenesService.js
// ======================================================

import api from '../../../services/api';
import { ENDPOINTS, buildQuery } from '../../../services/endpoints';

class AlmacenesService {
    // ========== ALMACENES ==========

    async getAlmacenes(params = {}) {
        try {
            const queryString = buildQuery(params);
            const response = await api.get(`${ENDPOINTS.ALMACENES}${queryString}`);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error obteniendo almacenes:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener almacenes'
            };
        }
    }

    async createAlmacen(almacenData) {
        try {
            const response = await api.post(ENDPOINTS.ALMACENES, almacenData);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error creando almacén:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al crear almacén'
            };
        }
    }

    async updateAlmacen(id, almacenData) {
        try {
            const response = await api.put(ENDPOINTS.ALMACEN_DETAIL(id), almacenData);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error actualizando almacén:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al actualizar almacén'
            };
        }
    }

    async deleteAlmacen(id) {
        try {
            const response = await api.delete(ENDPOINTS.ALMACEN_DETAIL(id));
            return { success: true, message: 'Almacén eliminado correctamente' };
        } catch (error) {
            console.error('Error eliminando almacén:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al eliminar almacén'
            };
        }
    }

    async getAlmacenDetail(id) {
        try {
            const response = await api.get(ENDPOINTS.ALMACEN_DETAIL(id));
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error obteniendo detalle del almacén:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener detalle'
            };
        }
    }

    async getAlmacenEstadisticas(id) {
        try {
            const response = await api.get(ENDPOINTS.ALMACEN_ESTADISTICAS(id));
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error obteniendo estadísticas del almacén:', error);
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
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error obteniendo proveedores:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener proveedores'
            };
        }
    }

    async createProveedor(proveedorData) {
        try {
            const response = await api.post(ENDPOINTS.PROVEEDORES, proveedorData);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error creando proveedor:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al crear proveedor'
            };
        }
    }

    async updateProveedor(id, proveedorData) {
        try {
            const response = await api.put(ENDPOINTS.PROVEEDOR_DETAIL(id), proveedorData);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error actualizando proveedor:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al actualizar proveedor'
            };
        }
    }

    async deleteProveedor(id) {
        try {
            await api.delete(ENDPOINTS.PROVEEDOR_DETAIL(id));
            return { success: true, message: 'Proveedor eliminado correctamente' };
        } catch (error) {
            console.error('Error eliminando proveedor:', error);
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
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error obteniendo marcas:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener marcas'
            };
        }
    }

    async createMarca(marcaData) {
        try {
            const response = await api.post(ENDPOINTS.MARCAS, marcaData);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error creando marca:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al crear marca'
            };
        }
    }

    async updateMarca(id, marcaData) {
        try {
            const response = await api.put(ENDPOINTS.MARCA_DETAIL(id), marcaData);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error actualizando marca:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al actualizar marca'
            };
        }
    }

    async deleteMarca(id) {
        try {
            await api.delete(ENDPOINTS.MARCA_DETAIL(id));
            return { success: true, message: 'Marca eliminada correctamente' };
        } catch (error) {
            console.error('Error eliminando marca:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al eliminar marca'
            };
        }
    }

    async toggleActivoMarca(id) {
        try {
            const response = await api.post(ENDPOINTS.MARCA_TOGGLE_ACTIVO(id));
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error cambiando estado de marca:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al cambiar estado'
            };
        }
    }

    // ========== TIPOS DE EQUIPO ==========

    async getTiposEquipo(params = {}) {
        try {
            const queryString = buildQuery(params);
            const response = await api.get(`${ENDPOINTS.TIPOS_EQUIPO}${queryString}`);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error obteniendo tipos de equipo:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener tipos de equipo'
            };
        }
    }

    async createTipoEquipo(tipoData) {
        try {
            const response = await api.post(ENDPOINTS.TIPOS_EQUIPO, tipoData);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error creando tipo de equipo:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al crear tipo de equipo'
            };
        }
    }

    async updateTipoEquipo(id, tipoData) {
        try {
            const response = await api.put(ENDPOINTS.TIPO_EQUIPO_DETAIL(id), tipoData);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error actualizando tipo de equipo:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al actualizar tipo de equipo'
            };
        }
    }

    async deleteTipoEquipo(id) {
        try {
            await api.delete(ENDPOINTS.TIPO_EQUIPO_DETAIL(id));
            return { success: true, message: 'Tipo de equipo eliminado correctamente' };
        } catch (error) {
            console.error('Error eliminando tipo de equipo:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al eliminar tipo de equipo'
            };
        }
    }

    // ========== MODELOS ==========

    async getModelos(params = {}) {
        try {
            const queryString = buildQuery(params);
            const response = await api.get(`${ENDPOINTS.MODELOS}${queryString}`);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error obteniendo modelos:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener modelos'
            };
        }
    }

    async createModelo(modeloData) {
        try {
            const response = await api.post(ENDPOINTS.MODELOS, modeloData);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error creando modelo:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al crear modelo'
            };
        }
    }

    async updateModelo(id, modeloData) {
        try {
            const response = await api.put(ENDPOINTS.MODELO_DETAIL(id), modeloData);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error actualizando modelo:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al actualizar modelo'
            };
        }
    }

    async deleteModelo(id) {
        try {
            await api.delete(ENDPOINTS.MODELO_DETAIL(id));
            return { success: true, message: 'Modelo eliminado correctamente' };
        } catch (error) {
            console.error('Error eliminando modelo:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al eliminar modelo'
            };
        }
    }

    // ========== TIPOS DE MATERIAL ==========

    async getTiposMaterial(params = {}) {
        try {
            const queryString = buildQuery(params);
            const response = await api.get(`${ENDPOINTS.TIPOS_MATERIAL}${queryString}`);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error obteniendo tipos de material:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener tipos de material'
            };
        }
    }

    async createTipoMaterial(tipoData) {
        try {
            const response = await api.post(ENDPOINTS.TIPOS_MATERIAL, tipoData);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error creando tipo de material:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al crear tipo de material'
            };
        }
    }

    async updateTipoMaterial(id, tipoData) {
        try {
            const response = await api.put(ENDPOINTS.TIPO_MATERIAL_DETAIL(id), tipoData);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error actualizando tipo de material:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al actualizar tipo de material'
            };
        }
    }

    async deleteTipoMaterial(id) {
        try {
            await api.delete(ENDPOINTS.TIPO_MATERIAL_DETAIL(id));
            return { success: true, message: 'Tipo de material eliminado correctamente' };
        } catch (error) {
            console.error('Error eliminando tipo de material:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al eliminar tipo de material'
            };
        }
    }

    // ========== OPCIONES PARA FORMULARIOS ==========

    async getOpcionesCompletas() {
        try {
            // Como el endpoint opciones-completas no existe aún en el backend,
            // vamos a obtener las opciones básicas que necesitamos por separado
            const [
                tiposAlmacenResult,
                marcasResult,
                tiposEquipoResult,
                proveedoresResult,
                almacenesResult
            ] = await Promise.all([
                this.getTiposAlmacen(),
                this.getMarcas(),
                this.getTiposEquipo(),
                this.getProveedores(),
                this.getAlmacenes()
            ]);

            // Construir objeto de opciones
            const opciones = {
                tipos_almacen: tiposAlmacenResult.success ? tiposAlmacenResult.data : [],
                marcas: marcasResult.success ? marcasResult.data : [],
                tipos_equipo: tiposEquipoResult.success ? tiposEquipoResult.data : [],
                proveedores: proveedoresResult.success ? proveedoresResult.data : [],
                almacenes: almacenesResult.success ? almacenesResult.data : [],
                // Opciones por defecto mientras implementamos los endpoints
                tipos_material: [
                    { id: 1, codigo: 'ONU', nombre: 'Equipo ONU', es_unico: true },
                    { id: 2, codigo: 'CABLE_DROP', nombre: 'Cable Drop', es_unico: false },
                    { id: 3, codigo: 'CONECTOR', nombre: 'Conector', es_unico: false }
                ],
                unidades_medida: [
                    { id: 1, codigo: 'PIEZA', nombre: 'Pieza', simbolo: 'pza' },
                    { id: 2, codigo: 'METROS', nombre: 'Metros', simbolo: 'm' },
                    { id: 3, codigo: 'CAJA', nombre: 'Caja', simbolo: 'cja' }
                ]
            };

            return { success: true, data: { data: opciones } };
        } catch (error) {
            console.error('Error obteniendo opciones completas:', error);
            return {
                success: false,
                error: 'Error al obtener opciones para formularios'
            };
        }
    }

    async inicializarDatos() {
        try {
            // Por ahora retornamos un éxito simulado
            // Este endpoint se implementará cuando el backend lo tenga
            return {
                success: true,
                message: 'Endpoint de inicialización pendiente de implementar en backend'
            };
        } catch (error) {
            console.error('Error inicializando datos:', error);
            return {
                success: false,
                error: 'Error al inicializar datos'
            };
        }
    }

    // ========== TIPOS DE ALMACÉN ==========

    async getTiposAlmacen() {
        try {
            const response = await api.get(ENDPOINTS.TIPOS_ALMACEN);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error obteniendo tipos de almacén:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener tipos de almacén'
            };
        }
    }

    // ========== OPCIONES PARA FORMULARIOS ==========

    async getOpcionesCompletas() {
        try {
            // Obtener opciones reales del backend
            const [
                tiposAlmacenResult,
                marcasResult,
                tiposEquipoResult,
                proveedoresResult,
                almacenesResult,
                tiposMaterialResult,
                unidadesMedidaResult
            ] = await Promise.all([
                this.getTiposAlmacen(),
                this.getMarcas(),
                this.getTiposEquipo(),
                this.getProveedores(),
                this.getAlmacenes(),
                this.getTiposMaterial(),
                this.getUnidadesMedida()
            ]);

            // Construir objeto de opciones con datos reales
            const opciones = {
                tipos_almacen: tiposAlmacenResult.success ? (tiposAlmacenResult.data.results || tiposAlmacenResult.data) : [],
                marcas: marcasResult.success ? (marcasResult.data.results || marcasResult.data) : [],
                tipos_equipo: tiposEquipoResult.success ? (tiposEquipoResult.data.results || tiposEquipoResult.data) : [],
                proveedores: proveedoresResult.success ? (proveedoresResult.data.results || proveedoresResult.data) : [],
                almacenes: almacenesResult.success ? (almacenesResult.data.results || almacenesResult.data) : [],
                tipos_material: tiposMaterialResult.success ? (tiposMaterialResult.data.results || tiposMaterialResult.data) : [],
                unidades_medida: unidadesMedidaResult.success ? (unidadesMedidaResult.data.results || unidadesMedidaResult.data) : []
            };

            return { success: true, data: { data: opciones } };
        } catch (error) {
            console.error('Error obteniendo opciones completas:', error);
            return {
                success: false,
                error: 'Error al obtener opciones para formularios'
            };
        }
    }

    // ========== UNIDADES DE MEDIDA ==========

    async getUnidadesMedida() {
        try {
            const response = await api.get(ENDPOINTS.UNIDADES_MEDIDA);
            return { success: true, data: response.data };
        } catch (error) {
            console.error('Error obteniendo unidades de medida:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Error al obtener unidades de medida'
            };
        }
    }
}

export default new AlmacenesService();