// ======================================================
// src/core/almacenes/hooks/useLotes.js
// Hook para gestión de lotes y entregas parciales (Adaptado)
// ======================================================

import { useState, useCallback, useEffect } from 'react';
import almacenService from '../../../features/almacenes/services/almacenService';

export const useLotes = () => {
    const [lotes, setLotes] = useState([]);
    const [loteActual, setLoteActual] = useState(null);
    const [resumenLote, setResumenLote] = useState(null);
    const [materialesLote, setMaterialesLote] = useState([]);
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
        lotes: false,
        lote: false,
        create: false,
        cerrar: false,
        reabrir: false,
        laboratorio: false,
        entrega: false,
        resumen: false,
        materiales: false,
        masivo: false,
        export: false
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

    // ========== GESTIÓN DE LOTES ==========

    const cargarLotes = useCallback(async (params = {}) => {
        setLoading('lotes', true);
        try {
            const parametros = { ...filtros, ...params };
            const response = await almacenService.getLotes(parametros);

            if (response.success) {
                setLotes(response.data.results || response.data);
                setPaginacion(prev => ({
                    ...prev,
                    total: response.data.count || 0,
                    pages: Math.ceil((response.data.count || 0) / (parametros.page_size || 20))
                }));
            } else {
                showError('Error al cargar lotes', response.error);
                setLotes([]);
            }
        } catch (error) {
            showError('Error inesperado', 'Error al cargar lotes');
            setLotes([]);
        } finally {
            setLoading('lotes', false);
        }
    }, [filtros, showError, setLoading]);

    const obtenerLote = useCallback(async (id) => {
        setLoading('lote', true);
        try {
            const response = await almacenService.getLoteById(id);
            if (response.success) {
                setLoteActual(response.data);
                return response.data;
            } else {
                showError('Error al obtener lote', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al obtener lote');
            return null;
        } finally {
            setLoading('lote', false);
        }
    }, [showError, setLoading]);

    const crearLote = useCallback(async (loteData) => {
        setLoading('create', true);
        try {
            const response = await almacenService.createLote(loteData);
            if (response.success) {
                showSuccess('Éxito', 'Lote creado correctamente');
                await cargarLotes({ page: 1 });
                return response.data;
            } else {
                showError('Error al crear lote', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al crear lote');
            return null;
        } finally {
            setLoading('create', false);
        }
    }, [showError, showSuccess, setLoading, cargarLotes]);

    // ========== OPERACIONES DE LOTE ==========

    const cerrarLote = useCallback(async (id) => {
        setLoading('cerrar', true);
        try {
            const response = await almacenService.cerrarLote(id);
            if (response.success) {
                showSuccess('Éxito', response.message);

                // Actualizar en la lista local
                setLotes(prev => prev.map(lote =>
                    lote.id === id ? { ...lote, estado: 'CERRADO' } : lote
                ));

                // Actualizar lote actual si coincide
                if (loteActual?.id === id) {
                    setLoteActual(prev => ({ ...prev, estado: 'CERRADO' }));
                }

                return true;
            } else {
                showError('Error al cerrar lote', response.error);
                return false;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al cerrar lote');
            return false;
        } finally {
            setLoading('cerrar', false);
        }
    }, [showError, showSuccess, setLoading, loteActual]);

    const reabrirLote = useCallback(async (id) => {
        setLoading('reabrir', true);
        try {
            const response = await almacenService.reabrirLote(id);
            if (response.success) {
                showSuccess('Éxito', response.message);

                // Actualizar en la lista local
                setLotes(prev => prev.map(lote =>
                    lote.id === id ? { ...lote, estado: 'ACTIVO' } : lote
                ));

                // Actualizar lote actual si coincide
                if (loteActual?.id === id) {
                    setLoteActual(prev => ({ ...prev, estado: 'ACTIVO' }));
                }

                return true;
            } else {
                showError('Error al reabrir lote', response.error);
                return false;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al reabrir lote');
            return false;
        } finally {
            setLoading('reabrir', false);
        }
    }, [showError, showSuccess, setLoading, loteActual]);

    const enviarLoteALaboratorio = useCallback(async (id) => {
        setLoading('laboratorio', true);
        try {
            const response = await almacenService.enviarLoteALaboratorio(id);
            if (response.success) {
                showSuccess('Éxito', 'Lote enviado a laboratorio correctamente');

                // Refrescar datos del lote
                await obtenerLote(id);
                return response.data;
            } else {
                showError('Error al enviar lote a laboratorio', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al enviar lote a laboratorio');
            return null;
        } finally {
            setLoading('laboratorio', false);
        }
    }, [showError, showSuccess, setLoading, obtenerLote]);

    // ========== ENTREGAS PARCIALES ==========

    const agregarEntregaParcial = useCallback(async (loteId, entregaData) => {
        setLoading('entrega', true);
        try {
            const response = await almacenService.agregarEntregaParcial(loteId, entregaData);
            if (response.success) {
                showSuccess('Éxito', 'Entrega parcial registrada correctamente');

                // Refrescar datos del lote
                await obtenerLote(loteId);
                await obtenerResumenLote(loteId);

                return response.data;
            } else {
                showError('Error al agregar entrega parcial', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al agregar entrega parcial');
            return null;
        } finally {
            setLoading('entrega', false);
        }
    }, [showError, showSuccess, setLoading, obtenerLote]);

    // ========== RESUMEN Y ESTADÍSTICAS ==========

    const obtenerResumenLote = useCallback(async (id) => {
        setLoading('resumen', true);
        try {
            const response = await almacenService.getLoteResumen(id);
            if (response.success) {
                setResumenLote(response.data);
                return response.data;
            } else {
                showError('Error al obtener resumen', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al obtener resumen del lote');
            return null;
        } finally {
            setLoading('resumen', false);
        }
    }, [showError, setLoading]);

    const cargarMaterialesLote = useCallback(async (id, params = {}) => {
        setLoading('materiales', true);
        try {
            // Usar endpoint específico si existe o usar materiales con filtro de lote
            const response = await almacenService.getMateriales({
                lote_id: id,
                ...params
            });

            if (response.success) {
                setMaterialesLote(response.data.results || response.data);
                return response.data;
            } else {
                showError('Error al cargar materiales', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al cargar materiales del lote');
            return null;
        } finally {
            setLoading('materiales', false);
        }
    }, [showError, setLoading]);

    // ========== VALIDACIONES Y UTILIDADES ==========

    const validarLoteParaCerrar = useCallback((lote) => {
        const errores = [];

        if (!lote) {
            errores.push('Lote no encontrado');
            return { valido: false, errores };
        }

        if (lote.estado === 'CERRADO') {
            errores.push('El lote ya está cerrado');
        }

        if (lote.materiales_pendientes > 0) {
            errores.push('Existen materiales pendientes de recepción');
        }

        if (lote.materiales_en_laboratorio > 0) {
            errores.push('Existen materiales en laboratorio');
        }

        return {
            valido: errores.length === 0,
            errores
        };
    }, []);

    const validarLoteParaReabrir = useCallback((lote) => {
        const errores = [];

        if (!lote) {
            errores.push('Lote no encontrado');
            return { valido: false, errores };
        }

        if (lote.estado !== 'CERRADO') {
            errores.push('Solo se pueden reabrir lotes cerrados');
        }

        if (lote.materiales_asignados > 0) {
            errores.push('No se puede reabrir un lote con materiales asignados');
        }

        return {
            valido: errores.length === 0,
            errores
        };
    }, []);

    const calcularProgresoRecepcion = useCallback((lote) => {
        if (!lote || !lote.cantidad_total) return 0;

        const cantidadRecibida = lote.cantidad_recibida || 0;
        const cantidadTotal = lote.cantidad_total;

        return Math.round((cantidadRecibida / cantidadTotal) * 100);
    }, []);

    const obtenerEstadoLote = useCallback((lote) => {
        if (!lote) return null;

        const progreso = calcularProgresoRecepcion(lote);

        if (lote.estado === 'CERRADO') return 'CERRADO';
        if (progreso === 0) return 'PENDIENTE_RECEPCION';
        if (progreso === 100) return 'RECEPCION_COMPLETA';
        return 'RECEPCION_PARCIAL';
    }, [calcularProgresoRecepcion]);

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

    const filtrarPorProveedor = useCallback((proveedorId) => {
        aplicarFiltros({ proveedor: proveedorId });
    }, [aplicarFiltros]);

    const filtrarPorAlmacen = useCallback((almacenId) => {
        aplicarFiltros({ almacen_destino: almacenId });
    }, [aplicarFiltros]);

    const filtrarPorFecha = useCallback((fechaInicio, fechaFin) => {
        const filtrosFecha = {};
        if (fechaInicio) filtrosFecha.fecha_desde = fechaInicio;
        if (fechaFin) filtrosFecha.fecha_hasta = fechaFin;
        aplicarFiltros(filtrosFecha);
    }, [aplicarFiltros]);

    // ========== OPERACIONES MASIVAS ==========

    const procesarLotesSeleccionados = useCallback(async (lotesIds, operacion, parametros = {}) => {
        setLoading('masivo', true);
        try {
            const resultados = [];

            for (const loteId of lotesIds) {
                let resultado;

                switch (operacion) {
                    case 'cerrar':
                        resultado = await cerrarLote(loteId);
                        break;
                    case 'reabrir':
                        resultado = await reabrirLote(loteId);
                        break;
                    case 'enviar_laboratorio':
                        resultado = await enviarLoteALaboratorio(loteId);
                        break;
                    default:
                        resultado = { success: false, error: 'Operación no válida' };
                }

                resultados.push({
                    loteId,
                    success: resultado?.success || resultado,
                    error: resultado?.error || null
                });
            }

            const exitosos = resultados.filter(r => r.success).length;
            const fallidos = resultados.filter(r => !r.success).length;

            if (exitosos > 0) {
                showSuccess('Operación completada',
                    `${exitosos} lote(s) procesado(s) correctamente${fallidos > 0 ? `, ${fallidos} fallaron` : ''}`
                );
            }

            if (fallidos > 0 && exitosos === 0) {
                showError('Operación fallida',
                    `No se pudieron procesar ${fallidos} lote(s)`
                );
            }

            // Refrescar lista
            await cargarLotes({ page: paginacion.page });

            return resultados;
        } catch (error) {
            showError('Error en operación masiva', error.message);
            return [];
        } finally {
            setLoading('masivo', false);
        }
    }, [showError, showSuccess, setLoading, cerrarLote, reabrirLote, enviarLoteALaboratorio, cargarLotes, paginacion.page]);

    // ========== EXPORTACIÓN ==========

    const exportarLotes = useCallback(async (params = {}) => {
        setLoading('export', true);
        try {
            const parametrosExport = {
                ...filtros,
                ...params,
                formato: 'csv',
                todos: true // Para exportar todos los resultados
            };

            const response = await almacenService.exportarDatos('lotes', parametrosExport);

            if (response.success) {
                // Crear y descargar archivo
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `lotes_${new Date().toISOString().split('T')[0]}.csv`);
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
            showError('Error inesperado', 'Error al exportar lotes');
            return false;
        } finally {
            setLoading('export', false);
        }
    }, [filtros, showError, showSuccess, setLoading]);

    // ========== EFECTOS ==========

    useEffect(() => {
        cargarLotes({ page: paginacion.page });
    }, [paginacion.page, filtros]);

    // ========== UTILIDADES ==========

    const limpiarDatos = useCallback(() => {
        setLotes([]);
        setLoteActual(null);
        setResumenLote(null);
        setMaterialesLote([]);
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
        await cargarLotes({ page: paginacion.page });
        if (loteActual) {
            await obtenerLote(loteActual.id);
            await obtenerResumenLote(loteActual.id);
        }
    }, [cargarLotes, paginacion.page, loteActual, obtenerLote, obtenerResumenLote]);

    const generarCodigoLote = useCallback((proveedor) => {
        return almacenService.generarCodigoLote(proveedor);
    }, []);

    // Helper function para verificar si algo está cargando
    const isLoading = useCallback((key) => {
        return key ? loadingStates[key] : Object.values(loadingStates).some(state => state);
    }, [loadingStates]);

    // ========== ESTADO Y CONSTANTES ==========

    const estadosLote = almacenService.getEstadosLote();
    const coloresEstado = almacenService.getColoresEstado();

    return {
        // Estado
        lotes,
        loteActual,
        resumenLote,
        materialesLote,
        estadisticas,
        filtros,
        paginacion,
        loading: loadingStates, // Estados específicos de loading
        isLoading, // Helper function

        // Constantes
        estadosLote,
        coloresEstado,

        // Acciones CRUD
        cargarLotes,
        obtenerLote,
        crearLote,

        // Operaciones de lote
        cerrarLote,
        reabrirLote,
        enviarLoteALaboratorio,
        agregarEntregaParcial,

        // Datos relacionados
        obtenerResumenLote,
        cargarMaterialesLote,

        // Validaciones
        validarLoteParaCerrar,
        validarLoteParaReabrir,
        calcularProgresoRecepcion,
        obtenerEstadoLote,

        // Filtros y navegación
        aplicarFiltros,
        limpiarFiltros,
        cambiarPagina,
        buscar,
        filtrarPorEstado,
        filtrarPorProveedor,
        filtrarPorAlmacen,
        filtrarPorFecha,

        // Operaciones masivas
        procesarLotesSeleccionados,
        exportarLotes,

        // Utilidades
        limpiarDatos,
        refrescar,
        generarCodigoLote,

        // Setters para casos específicos
        setLoteActual,
        setMaterialesLote
    };
};

export default useLotes;