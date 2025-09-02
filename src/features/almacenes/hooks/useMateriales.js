// ======================================================
// src/core/almacenes/hooks/useMateriales.js
// Hook para gestión de materiales y equipos ONU (Adaptado)
// ======================================================

import { useState, useCallback, useEffect } from 'react';
import almacenService from '../../../features/almacenes/services/almacenService';

export const useMateriales = () => {
    const [materiales, setMateriales] = useState([]);
    const [materialActual, setMaterialActual] = useState(null);
    const [historialMaterial, setHistorialMaterial] = useState([]);
    const [materialesDisponibles, setMaterialesDisponibles] = useState([]);
    const [estadisticas, setEstadisticas] = useState(null);
    const [filtros, setFiltros] = useState({});
    const [paginacion, setPaginacion] = useState({
        page: 1,
        page_size: 20,
        total: 0,
        pages: 0
    });

    // Estados de loading específicos
    const [loadingStates, setLoadingStates] = useState({
        materiales: false,
        material: false,
        create: false,
        update: false,
        cambiar_estado: false,
        laboratorio: false,
        retornar_laboratorio: false,
        historial: false,
        busqueda_avanzada: false,
        disponibles: false,
        masivo: false,
        export: false,
        buscar_codigo: false
    });

    // Función para gestionar loading states
    const setLoading = useCallback((key, value) => {
        setLoadingStates(prev => ({
            ...prev,
            [key]: value
        }));
    }, []);

    // Funciones simples para mostrar mensajes (temporal)
    const showError = useCallback((title, message) => {
        console.error(`${title}: ${message}`);
        // TODO: Aquí puedes agregar tu sistema de notificaciones cuando esté listo
    }, []);

    const showSuccess = useCallback((title, message) => {
        console.log(`${title}: ${message}`);
        // TODO: Aquí puedes agregar tu sistema de notificaciones cuando esté listo
    }, []);

    // ========== GESTIÓN DE MATERIALES ==========

    const cargarMateriales = useCallback(async (params = {}) => {
        setLoading('materiales', true);
        try {
            const parametros = { ...filtros, ...params };
            const response = await almacenService.getMateriales(parametros);

            if (response.success) {
                setMateriales(response.data.results || response.data);
                setPaginacion(prev => ({
                    ...prev,
                    total: response.data.count || 0,
                    pages: Math.ceil((response.data.count || 0) / (parametros.page_size || 20))
                }));
            } else {
                showError('Error al cargar materiales', response.error);
                setMateriales([]);
            }
        } catch (error) {
            showError('Error inesperado', 'Error al cargar materiales');
            setMateriales([]);
        } finally {
            setLoading('materiales', false);
        }
    }, [filtros, showError, setLoading]);

    const obtenerMaterial = useCallback(async (id) => {
        setLoading('material', true);
        try {
            const response = await almacenService.getMaterialById(id);
            if (response.success) {
                setMaterialActual(response.data);
                return response.data;
            } else {
                showError('Error al obtener material', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al obtener material');
            return null;
        } finally {
            setLoading('material', false);
        }
    }, [showError, setLoading]);

    const crearMaterial = useCallback(async (materialData) => {
        setLoading('create', true);
        try {
            const response = await almacenService.createMaterial(materialData);
            if (response.success) {
                showSuccess('Éxito', 'Material creado correctamente');
                await cargarMateriales({ page: 1 });
                return response.data;
            } else {
                showError('Error al crear material', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al crear material');
            return null;
        } finally {
            setLoading('create', false);
        }
    }, [showError, showSuccess, setLoading, cargarMateriales]);

    const actualizarMaterial = useCallback(async (id, materialData) => {
        setLoading('update', true);
        try {
            const response = await almacenService.updateMaterial(id, materialData);
            if (response.success) {
                showSuccess('Éxito', 'Material actualizado correctamente');

                // Actualizar en la lista local
                setMateriales(prev => prev.map(material =>
                    material.id === id ? { ...material, ...response.data } : material
                ));

                // Actualizar material actual si coincide
                if (materialActual?.id === id) {
                    setMaterialActual({ ...materialActual, ...response.data });
                }

                return response.data;
            } else {
                showError('Error al actualizar material', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al actualizar material');
            return null;
        } finally {
            setLoading('update', false);
        }
    }, [showError, showSuccess, setLoading, materialActual]);

    // ========== CAMBIOS DE ESTADO ==========

    const cambiarEstadoMaterial = useCallback(async (id, estadoData) => {
        setLoading('cambiar_estado', true);
        try {
            const response = await almacenService.cambiarEstadoMaterial(id, estadoData);
            if (response.success) {
                showSuccess('Éxito', 'Estado cambiado correctamente');

                // Actualizar en la lista local
                setMateriales(prev => prev.map(material =>
                    material.id === id ? { ...material, estado: estadoData.nuevo_estado } : material
                ));

                // Actualizar material actual si coincide
                if (materialActual?.id === id) {
                    setMaterialActual(prev => ({ ...prev, estado: estadoData.nuevo_estado }));
                }

                return response.data;
            } else {
                showError('Error al cambiar estado', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al cambiar estado');
            return null;
        } finally {
            setLoading('cambiar_estado', false);
        }
    }, [showError, showSuccess, setLoading, materialActual]);

    // ========== OPERACIONES DE LABORATORIO ==========

    const enviarMaterialALaboratorio = useCallback(async (id, observaciones = '') => {
        setLoading('laboratorio', true);
        try {
            const response = await almacenService.enviarMaterialALaboratorio(id, observaciones);
            if (response.success) {
                showSuccess('Éxito', 'Material enviado a laboratorio');

                // Actualizar estado en la lista
                setMateriales(prev => prev.map(material =>
                    material.id === id ? { ...material, estado: 'EN_LABORATORIO' } : material
                ));

                if (materialActual?.id === id) {
                    setMaterialActual(prev => ({ ...prev, estado: 'EN_LABORATORIO' }));
                }

                return response.data;
            } else {
                showError('Error al enviar a laboratorio', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al enviar a laboratorio');
            return null;
        } finally {
            setLoading('laboratorio', false);
        }
    }, [showError, showSuccess, setLoading, materialActual]);

    const retornarMaterialDeLaboratorio = useCallback(async (id, laboratorioData) => {
        setLoading('retornar_laboratorio', true);
        try {
            const response = await almacenService.retornarMaterialDeLaboratorio(id, laboratorioData);
            if (response.success) {
                showSuccess('Éxito', 'Material retornado de laboratorio');

                // Actualizar estado según el resultado
                const nuevoEstado = laboratorioData.resultado === 'DEFECTUOSO' ? 'DEFECTUOSO' : 'DISPONIBLE';
                setMateriales(prev => prev.map(material =>
                    material.id === id ? { ...material, estado: nuevoEstado } : material
                ));

                if (materialActual?.id === id) {
                    setMaterialActual(prev => ({ ...prev, estado: nuevoEstado }));
                }

                return response.data;
            } else {
                showError('Error al retornar de laboratorio', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al retornar de laboratorio');
            return null;
        } finally {
            setLoading('retornar_laboratorio', false);
        }
    }, [showError, showSuccess, setLoading, materialActual]);

    // ========== HISTORIAL ==========

    const cargarHistorialMaterial = useCallback(async (id) => {
        setLoading('historial', true);
        try {
            const response = await almacenService.getMaterialHistorial(id);
            if (response.success) {
                setHistorialMaterial(response.data);
                return response.data;
            } else {
                showError('Error al cargar historial', response.error);
                return [];
            }
        } catch (error) {
            showError('Error inesperado', 'Error al cargar historial');
            return [];
        } finally {
            setLoading('historial', false);
        }
    }, [showError, setLoading]);

    // ========== BÚSQUEDAS Y VALIDACIONES ==========

    const busquedaAvanzada = useCallback(async (criterios) => {
        setLoading('busqueda_avanzada', true);
        try {
            const response = await almacenService.busquedaAvanzadaMateriales(criterios);
            if (response.success) {
                setMateriales(response.data.results || response.data);
                return response.data;
            } else {
                showError('Error en búsqueda avanzada', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error en búsqueda avanzada');
            return null;
        } finally {
            setLoading('busqueda_avanzada', false);
        }
    }, [showError, setLoading]);

    const validarMACAddress = useCallback(async (mac, materialId = null) => {
        try {
            const response = await almacenService.validarMACAddress(mac, materialId);
            return response;
        } catch (error) {
            return { success: false, error: 'Error al validar MAC' };
        }
    }, []);

    const validarGPONSerial = useCallback(async (gponSerial, materialId = null) => {
        try {
            const response = await almacenService.validarGPONSerial(gponSerial, materialId);
            return response;
        } catch (error) {
            return { success: false, error: 'Error al validar GPON Serial' };
        }
    }, []);

    const validarDSN = useCallback(async (dsn, materialId = null) => {
        try {
            const response = await almacenService.validarDSN(dsn, materialId);
            return response;
        } catch (error) {
            return { success: false, error: 'Error al validar D-SN' };
        }
    }, []);

    const verificarDisponibilidadCodigo = useCallback(async (codigo) => {
        try {
            const response = await almacenService.verificarDisponibilidadCodigo(codigo);
            return response;
        } catch (error) {
            return { success: false, error: 'Error al verificar código' };
        }
    }, []);

    // ========== MATERIALES DISPONIBLES ==========

    const cargarMaterialesDisponibles = useCallback(async (params = {}) => {
        setLoading('disponibles', true);
        try {
            const response = await almacenService.getMaterialesDisponibles(params);
            if (response.success) {
                setMaterialesDisponibles(response.data.results || response.data);
                return response.data;
            } else {
                showError('Error al cargar materiales disponibles', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al cargar materiales disponibles');
            return null;
        } finally {
            setLoading('disponibles', false);
        }
    }, [showError, setLoading]);

    // ========== OPERACIONES MASIVAS ==========

    const operacionMasivaMateriales = useCallback(async (operacionData) => {
        setLoading('masivo', true);
        try {
            const response = await almacenService.operacionMasivaMateriales(operacionData);
            if (response.success) {
                showSuccess('Éxito', 'Operación masiva completada');

                // Refrescar lista de materiales
                await cargarMateriales({ page: paginacion.page });

                return response.data;
            } else {
                showError('Error en operación masiva', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error en operación masiva');
            return null;
        } finally {
            setLoading('masivo', false);
        }
    }, [showError, showSuccess, setLoading, cargarMateriales, paginacion.page]);

    const procesarMaterialesSeleccionados = useCallback(async (materialesIds, operacion, parametros = {}) => {
        const operacionData = {
            materiales_ids: materialesIds,
            operacion,
            parametros
        };

        return await operacionMasivaMateriales(operacionData);
    }, [operacionMasivaMateriales]);

    // ========== FILTROS Y BÚSQUEDA ==========

    const aplicarFiltros = useCallback((nuevosFiltros) => {
        setFiltros(prev => ({ ...prev, ...nuevosFiltros }));
        setPaginacion(prev => ({ ...prev, page: 1 }));
    }, []);

    const limpiarFiltros = useCallback(() => {
        setFiltros({});
        setPaginacion(prev => ({ ...prev, page: 1 }));
    }, []);

    const cambiarPagina = useCallback((nuevaPagina) => {
        setPaginacion(prev => ({ ...prev, page: nuevaPagina }));
    }, []);

    const buscar = useCallback(async (termino) => {
        const nuevosFiltros = termino ? { search: termino } : {};
        aplicarFiltros(nuevosFiltros);
    }, [aplicarFiltros]);

    const filtrarPorEstado = useCallback((estado) => {
        aplicarFiltros({ estado });
    }, [aplicarFiltros]);

    const filtrarPorTipo = useCallback((tipoMaterial) => {
        aplicarFiltros({ tipo_material: tipoMaterial });
    }, [aplicarFiltros]);

    const filtrarPorAlmacen = useCallback((almacenId) => {
        aplicarFiltros({ almacen_actual: almacenId });
    }, [aplicarFiltros]);

    const filtrarPorLote = useCallback((loteId) => {
        aplicarFiltros({ lote: loteId });
    }, [aplicarFiltros]);

    const filtrarPorModelo = useCallback((modeloId) => {
        aplicarFiltros({ modelo: modeloId });
    }, [aplicarFiltros]);

    // ========== UTILIDADES DE FORMATO ==========

    const formatearMACAddress = useCallback((mac) => {
        return almacenService.formatMACAddress(mac);
    }, []);

    const validarFormatoMAC = useCallback((mac) => {
        return almacenService.validarFormatoMAC(mac);
    }, []);

    const obtenerSugerenciasCodigo = useCallback(async (tipoMaterial, marca, modelo) => {
        try {
            const response = await almacenService.obtenerSugerenciasCodigo(tipoMaterial, marca, modelo);
            return response;
        } catch (error) {
            return { success: false, error: 'Error al obtener sugerencias' };
        }
    }, []);

    // ========== VALIDACIONES DE NEGOCIO ==========

    const validarMaterialParaOperacion = useCallback((material, operacion) => {
        const errores = [];

        if (!material) {
            errores.push('Material no encontrado');
            return { valido: false, errores };
        }

        switch (operacion) {
            case 'enviar_laboratorio':
                if (material.estado === 'EN_LABORATORIO') {
                    errores.push('El material ya está en laboratorio');
                }
                if (material.estado === 'ASIGNADO') {
                    errores.push('No se puede enviar un material asignado');
                }
                break;

            case 'asignar':
                if (material.estado !== 'DISPONIBLE') {
                    errores.push('Solo se pueden asignar materiales disponibles');
                }
                break;

            case 'dar_de_baja':
                if (material.estado === 'ASIGNADO') {
                    errores.push('No se puede dar de baja un material asignado');
                }
                break;

            default:
                break;
        }

        return {
            valido: errores.length === 0,
            errores
        };
    }, []);

    // ========== EXPORTACIÓN ==========

    const exportarMateriales = useCallback(async (params = {}) => {
        setLoading('export', true);
        try {
            const parametrosExport = {
                ...filtros,
                ...params,
                formato: 'csv',
                todos: true
            };

            const response = await almacenService.exportarDatos('inventario', parametrosExport);

            if (response.success) {
                // Crear y descargar archivo
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `materiales_${new Date().toISOString().split('T')[0]}.csv`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);

                showSuccess('Éxito', 'Archivo exportado correctamente');
                return true;
            } else {
                showError('Error al exportar', response.error);
                return false;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al exportar materiales');
            return false;
        } finally {
            setLoading('export', false);
        }
    }, [filtros, showError, showSuccess, setLoading]);

    // ========== EFECTOS ==========

    useEffect(() => {
        cargarMateriales({ page: paginacion.page });
    }, [paginacion.page, filtros]);

    // ========== UTILIDADES ==========

    const limpiarDatos = useCallback(() => {
        setMateriales([]);
        setMaterialActual(null);
        setHistorialMaterial([]);
        setMaterialesDisponibles([]);
        setEstadisticas(null);
        setFiltros({});
        setPaginacion({
            page: 1,
            page_size: 20,
            total: 0,
            pages: 0
        });
    }, []);

    const refrescar = useCallback(async () => {
        await cargarMateriales({ page: paginacion.page });
        if (materialActual) {
            await obtenerMaterial(materialActual.id);
        }
    }, [cargarMateriales, paginacion.page, materialActual, obtenerMaterial]);

    // ========== BÚSQUEDA POR CÓDIGO ==========

    const buscarPorCodigo = useCallback(async (codigo, tipo = 'material') => {
        setLoading('buscar_codigo', true);
        try {
            const response = await almacenService.buscarPorCodigo(codigo, tipo);
            if (response.success) {
                return response.data;
            } else {
                showError('Error en búsqueda', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al buscar por código');
            return null;
        } finally {
            setLoading('buscar_codigo', false);
        }
    }, [showError, setLoading]);

    // Helper function para verificar si algo está cargando
    const isLoading = useCallback((key) => {
        return key ? loadingStates[key] : Object.values(loadingStates).some(state => state);
    }, [loadingStates]);

    // ========== ESTADO Y CONSTANTES ==========

    const tiposMaterial = almacenService.getTiposMaterial();
    const estadosONU = almacenService.getEstadosONU();
    const estadosGenerales = almacenService.getEstadosGenerales();
    const unidadesMedida = almacenService.getUnidadesMedida();
    const coloresEstado = almacenService.getColoresEstado();

    return {
        // Estado
        materiales,
        materialActual,
        historialMaterial,
        materialesDisponibles,
        estadisticas,
        filtros,
        paginacion,
        loading: loadingStates, // Estados específicos de loading
        isLoading, // Helper function

        // Constantes
        tiposMaterial,
        estadosONU,
        estadosGenerales,
        unidadesMedida,
        coloresEstado,

        // Acciones CRUD
        cargarMateriales,
        obtenerMaterial,
        crearMaterial,
        actualizarMaterial,

        // Cambios de estado
        cambiarEstadoMaterial,

        // Operaciones de laboratorio
        enviarMaterialALaboratorio,
        retornarMaterialDeLaboratorio,

        // Historial
        cargarHistorialMaterial,

        // Búsquedas y validaciones
        busquedaAvanzada,
        validarMACAddress,
        validarGPONSerial,
        validarDSN,
        verificarDisponibilidadCodigo,
        buscarPorCodigo,

        // Materiales disponibles
        cargarMaterialesDisponibles,

        // Operaciones masivas
        operacionMasivaMateriales,
        procesarMaterialesSeleccionados,

        // Filtros y navegación
        aplicarFiltros,
        limpiarFiltros,
        cambiarPagina,
        buscar,
        filtrarPorEstado,
        filtrarPorTipo,
        filtrarPorAlmacen,
        filtrarPorLote,
        filtrarPorModelo,

        // Utilidades de formato
        formatearMACAddress,
        validarFormatoMAC,
        obtenerSugerenciasCodigo,

        // Validaciones de negocio
        validarMaterialParaOperacion,

        // Exportación
        exportarMateriales,

        // Utilidades
        limpiarDatos,
        refrescar,

        // Setters para casos específicos
        setMaterialActual,
        setMateriales,
        setMaterialesDisponibles
    };
};

export default useMateriales;