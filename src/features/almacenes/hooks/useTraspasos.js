// ======================================================
// src/core/almacenes/hooks/useTraspasos.js
// Hook para gestión de traspasos entre almacenes
// ======================================================

import { useState, useCallback, useEffect } from 'react';
import almacenService from '../../../features/almacenes/services/almacenService';

export const useTraspasos = () => {
    const [traspasos, setTraspasos] = useState([]);
    const [traspasoActual, setTraspasoActual] = useState(null);
    const [materialesTraspaso, setMaterialesTraspaso] = useState([]);
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
        traspasos: false,
        traspaso: false,
        create: false,
        enviar: false,
        recibir: false,
        cancelar: false,
        materiales: false,
        masivo: false,
        crear_masivo: false,
        export: false,
        estadisticas: false
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

    // ========== GESTIÓN DE TRASPASOS ==========

    const cargarTraspasos = useCallback(async (params = {}) => {
        setLoading('traspasos', true);
        try {
            const parametros = { ...filtros, ...params };
            const response = await almacenService.getTraspasos(parametros);

            if (response.success) {
                setTraspasos(response.data.results || response.data);
                setPaginacion(prev => ({
                    ...prev,
                    total: response.data.count || 0,
                    pages: Math.ceil((response.data.count || 0) / (parametros.page_size || 20))
                }));
            } else {
                showError('Error al cargar traspasos', response.error);
                setTraspasos([]);
            }
        } catch (error) {
            showError('Error inesperado', 'Error al cargar traspasos');
            setTraspasos([]);
        } finally {
            setLoading('traspasos', false);
        }
    }, [filtros, showError, setLoading]);

    const obtenerTraspaso = useCallback(async (id) => {
        setLoading('traspaso', true);
        try {
            const response = await almacenService.getTraspasoById(id);
            if (response.success) {
                setTraspasoActual(response.data);
                return response.data;
            } else {
                showError('Error al obtener traspaso', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al obtener traspaso');
            return null;
        } finally {
            setLoading('traspaso', false);
        }
    }, [showError, setLoading]);

    const crearTraspaso = useCallback(async (traspasoData) => {
        setLoading('create', true);
        try {
            const response = await almacenService.createTraspaso(traspasoData);
            if (response.success) {
                showSuccess('Éxito', 'Traspaso creado correctamente');
                await cargarTraspasos({ page: 1 });
                return response.data;
            } else {
                showError('Error al crear traspaso', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al crear traspaso');
            return null;
        } finally {
            setLoading('create', false);
        }
    }, [showError, showSuccess, setLoading, cargarTraspasos]);

    // ========== OPERACIONES DE TRASPASO ==========

    const enviarTraspaso = useCallback(async (id, datosEnvio = {}) => {
        setLoading('enviar', true);
        try {
            const response = await almacenService.enviarTraspaso(id, datosEnvio);
            if (response.success) {
                showSuccess('Éxito', 'Traspaso enviado correctamente');

                // Actualizar estado en la lista local
                setTraspasos(prev => prev.map(traspaso =>
                    traspaso.id === id ? { ...traspaso, estado: 'EN_TRANSITO' } : traspaso
                ));

                // Actualizar traspaso actual si coincide
                if (traspasoActual?.id === id) {
                    setTraspasoActual(prev => ({
                        ...prev,
                        estado: 'EN_TRANSITO',
                        fecha_envio: new Date().toISOString()
                    }));
                }

                return response.data;
            } else {
                showError('Error al enviar traspaso', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al enviar traspaso');
            return null;
        } finally {
            setLoading('enviar', false);
        }
    }, [showError, showSuccess, setLoading, traspasoActual]);

    const recibirTraspaso = useCallback(async (id, datosRecepcion) => {
        setLoading('recibir', true);
        try {
            const response = await almacenService.recibirTraspaso(id, datosRecepcion);
            if (response.success) {
                showSuccess('Éxito', 'Traspaso recibido correctamente');

                // Actualizar estado en la lista local
                setTraspasos(prev => prev.map(traspaso =>
                    traspaso.id === id ? {
                        ...traspaso,
                        estado: 'RECIBIDO',
                        cantidad_recibida: datosRecepcion.cantidad_recibida
                    } : traspaso
                ));

                // Actualizar traspaso actual si coincide
                if (traspasoActual?.id === id) {
                    setTraspasoActual(prev => ({
                        ...prev,
                        estado: 'RECIBIDO',
                        cantidad_recibida: datosRecepcion.cantidad_recibida,
                        fecha_recepcion: new Date().toISOString()
                    }));
                }

                return response.data;
            } else {
                showError('Error al recibir traspaso', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al recibir traspaso');
            return null;
        } finally {
            setLoading('recibir', false);
        }
    }, [showError, showSuccess, setLoading, traspasoActual]);

    const cancelarTraspaso = useCallback(async (id, motivo = '') => {
        setLoading('cancelar', true);
        try {
            const response = await almacenService.cancelarTraspaso(id, motivo);
            if (response.success) {
                showSuccess('Éxito', response.message || 'Traspaso cancelado correctamente');

                // Actualizar estado en la lista local
                setTraspasos(prev => prev.map(traspaso =>
                    traspaso.id === id ? { ...traspaso, estado: 'CANCELADO' } : traspaso
                ));

                // Actualizar traspaso actual si coincide
                if (traspasoActual?.id === id) {
                    setTraspasoActual(prev => ({
                        ...prev,
                        estado: 'CANCELADO',
                        motivo_cancelacion: motivo
                    }));
                }

                return true;
            } else {
                showError('Error al cancelar traspaso', response.error);
                return false;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al cancelar traspaso');
            return false;
        } finally {
            setLoading('cancelar', false);
        }
    }, [showError, showSuccess, setLoading, traspasoActual]);

    // ========== MATERIALES DEL TRASPASO ==========

    const cargarMaterialesTraspaso = useCallback(async (id) => {
        setLoading('materiales', true);
        try {
            const response = await almacenService.getTraspasoMateriales(id);
            if (response.success) {
                setMaterialesTraspaso(response.data);
                return response.data;
            } else {
                showError('Error al cargar materiales', response.error);
                return [];
            }
        } catch (error) {
            showError('Error inesperado', 'Error al cargar materiales del traspaso');
            return [];
        } finally {
            setLoading('materiales', false);
        }
    }, [showError, setLoading]);

    // ========== VALIDACIONES ==========

    const validarTraspasoParaEnvio = useCallback((traspaso) => {
        const errores = [];

        if (!traspaso) {
            errores.push('Traspaso no encontrado');
            return { valido: false, errores };
        }

        if (traspaso.estado !== 'PENDIENTE') {
            errores.push('Solo se pueden enviar traspasos pendientes');
        }

        if (!traspaso.materiales || traspaso.materiales.length === 0) {
            errores.push('El traspaso debe tener al menos un material');
        }

        if (traspaso.cantidad_enviada <= 0) {
            errores.push('La cantidad a enviar debe ser mayor a 0');
        }

        return {
            valido: errores.length === 0,
            errores
        };
    }, []);

    const validarTraspasoParaRecepcion = useCallback((traspaso) => {
        const errores = [];

        if (!traspaso) {
            errores.push('Traspaso no encontrado');
            return { valido: false, errores };
        }

        if (traspaso.estado !== 'EN_TRANSITO') {
            errores.push('Solo se pueden recibir traspasos en tránsito');
        }

        if (!traspaso.fecha_envio) {
            errores.push('El traspaso debe haber sido enviado primero');
        }

        return {
            valido: errores.length === 0,
            errores
        };
    }, []);

    const validarTraspasoParaCancelacion = useCallback((traspaso) => {
        const errores = [];

        if (!traspaso) {
            errores.push('Traspaso no encontrado');
            return { valido: false, errores };
        }

        if (traspaso.estado === 'RECIBIDO') {
            errores.push('No se puede cancelar un traspaso ya recibido');
        }

        if (traspaso.estado === 'CANCELADO') {
            errores.push('El traspaso ya está cancelado');
        }

        return {
            valido: errores.length === 0,
            errores
        };
    }, []);

    // ========== UTILIDADES DE CÁLCULO ==========

    const calcularProgresoTraspaso = useCallback((traspaso) => {
        if (!traspaso || !traspaso.cantidad_enviada) return 0;

        const cantidadRecibida = traspaso.cantidad_recibida || 0;
        const cantidadEnviada = traspaso.cantidad_enviada;

        return Math.round((cantidadRecibida / cantidadEnviada) * 100);
    }, []);

    const calcularTiempoTransito = useCallback((traspaso) => {
        if (!traspaso || !traspaso.fecha_envio) return null;

        const fechaEnvio = new Date(traspaso.fecha_envio);
        const fechaActual = traspaso.fecha_recepcion ? new Date(traspaso.fecha_recepcion) : new Date();

        const diferenciaMilisegundos = fechaActual - fechaEnvio;
        const dias = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferenciaMilisegundos % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        return { dias, horas, total_horas: Math.floor(diferenciaMilisegundos / (1000 * 60 * 60)) };
    }, []);

    const obtenerEstadoTraspaso = useCallback((traspaso) => {
        if (!traspaso) return null;

        const progreso = calcularProgresoTraspaso(traspaso);

        if (traspaso.estado === 'CANCELADO') return 'CANCELADO';
        if (traspaso.estado === 'RECIBIDO') {
            if (progreso === 100) return 'RECIBIDO_COMPLETO';
            return 'RECIBIDO_PARCIAL';
        }
        if (traspaso.estado === 'EN_TRANSITO') return 'EN_TRANSITO';
        return 'PENDIENTE';
    }, [calcularProgresoTraspaso]);

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

    const filtrarPorAlmacenOrigen = useCallback((almacenId) => {
        aplicarFiltros({ almacen_origen: almacenId });
    }, [aplicarFiltros]);

    const filtrarPorAlmacenDestino = useCallback((almacenId) => {
        aplicarFiltros({ almacen_destino: almacenId });
    }, [aplicarFiltros]);

    const filtrarPorFecha = useCallback((fechaInicio, fechaFin) => {
        const filtrosFecha = {};
        if (fechaInicio) filtrosFecha.fecha_desde = fechaInicio;
        if (fechaFin) filtrosFecha.fecha_hasta = fechaFin;
        aplicarFiltros(filtrosFecha);
    }, [aplicarFiltros]);

    const filtrarPorUsuario = useCallback((usuarioId) => {
        aplicarFiltros({ usuario_solicitante: usuarioId });
    }, [aplicarFiltros]);

    // ========== OPERACIONES MASIVAS ==========

    const procesarTraspasosSeleccionados = useCallback(async (traspasosIds, operacion, parametros = {}) => {
        setLoading('masivo', true);
        try {
            const resultados = [];

            for (const traspasoId of traspasosIds) {
                let resultado;

                switch (operacion) {
                    case 'enviar':
                        resultado = await enviarTraspaso(traspasoId, parametros);
                        break;
                    case 'cancelar':
                        resultado = await cancelarTraspaso(traspasoId, parametros.motivo);
                        break;
                    default:
                        resultado = { success: false, error: 'Operación no válida' };
                }

                resultados.push({
                    traspasoId,
                    success: resultado?.success || resultado,
                    error: resultado?.error || null
                });
            }

            const exitosos = resultados.filter(r => r.success).length;
            const fallidos = resultados.filter(r => !r.success).length;

            if (exitosos > 0) {
                showSuccess('Operación completada',
                    `${exitosos} traspaso(s) procesado(s) correctamente${fallidos > 0 ? `, ${fallidos} fallaron` : ''}`
                );
            }

            if (fallidos > 0 && exitosos === 0) {
                showError('Operación fallida',
                    `No se pudieron procesar ${fallidos} traspaso(s)`
                );
            }

            // Refrescar lista
            await cargarTraspasos({ page: paginacion.page });

            return resultados;
        } catch (error) {
            showError('Error en operación masiva', error.message);
            return [];
        } finally {
            setLoading('masivo', false);
        }
    }, [showError, showSuccess, setLoading, enviarTraspaso, cancelarTraspaso, cargarTraspasos, paginacion.page]);

    // ========== CREACIÓN MASIVA ==========

    const crearTraspasoMasivo = useCallback(async (materialesIds, almacenDestino, datosAdicionales = {}) => {
        setLoading('crear_masivo', true);
        try {
            const traspasoData = {
                materiales_ids: materialesIds,
                almacen_destino: almacenDestino,
                ...datosAdicionales
            };

            const response = await almacenService.createTraspaso(traspasoData);

            if (response.success) {
                showSuccess('Éxito', 'Traspaso masivo creado correctamente');
                await cargarTraspasos({ page: 1 });
                return response.data;
            } else {
                showError('Error al crear traspaso masivo', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al crear traspaso masivo');
            return null;
        } finally {
            setLoading('crear_masivo', false);
        }
    }, [showError, showSuccess, setLoading, cargarTraspasos]);

    // ========== EXPORTACIÓN ==========

    const exportarTraspasos = useCallback(async (params = {}) => {
        setLoading('export', true);
        try {
            const parametrosExport = {
                ...filtros,
                ...params,
                formato: 'csv',
                todos: true
            };

            const response = await almacenService.exportarDatos('movimientos', parametrosExport);

            if (response.success) {
                // Crear y descargar archivo
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `traspasos_${new Date().toISOString().split('T')[0]}.csv`);
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
            showError('Error inesperado', 'Error al exportar traspasos');
            return false;
        } finally {
            setLoading('export', false);
        }
    }, [filtros, showError, showSuccess, setLoading]);

    // ========== ESTADÍSTICAS ==========

    const cargarEstadisticasTraspasos = useCallback(async () => {
        setLoading('estadisticas', true);
        try {
            // Implementar cuando esté disponible el endpoint
            const response = { success: true, data: {} }; // Placeholder

            if (response.success) {
                setEstadisticas(response.data);
                return response.data;
            } else {
                showError('Error al cargar estadísticas', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al cargar estadísticas');
            return null;
        } finally {
            setLoading('estadisticas', false);
        }
    }, [showError, setLoading]);

    // ========== EFECTOS ==========

    useEffect(() => {
        cargarTraspasos({ page: paginacion.page });
    }, [paginacion.page, filtros]);

    // ========== UTILIDADES ==========

    const limpiarDatos = useCallback(() => {
        setTraspasos([]);
        setTraspasoActual(null);
        setMaterialesTraspaso([]);
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
        await cargarTraspasos({ page: paginacion.page });
        if (traspasoActual) {
            await obtenerTraspaso(traspasoActual.id);
            await cargarMaterialesTraspaso(traspasoActual.id);
        }
    }, [cargarTraspasos, paginacion.page, traspasoActual, obtenerTraspaso, cargarMaterialesTraspaso]);

    // Helper function para verificar si algo está cargando
    const isLoading = useCallback((key) => {
        return key ? loadingStates[key] : Object.values(loadingStates).some(state => state);
    }, [loadingStates]);

    // ========== ESTADO Y CONSTANTES ==========

    const estadosTraspaso = almacenService.getEstadosTraspaso();
    const coloresEstado = almacenService.getColoresEstado();

    return {
        // Estado
        traspasos,
        traspasoActual,
        materialesTraspaso,
        estadisticas,
        filtros,
        paginacion,
        loading: loadingStates, // Estados específicos de loading
        isLoading, // Helper function

        // Constantes
        estadosTraspaso,
        coloresEstado,

        // Acciones CRUD
        cargarTraspasos,
        obtenerTraspaso,
        crearTraspaso,

        // Operaciones de traspaso
        enviarTraspaso,
        recibirTraspaso,
        cancelarTraspaso,

        // Materiales del traspaso
        cargarMaterialesTraspaso,

        // Validaciones
        validarTraspasoParaEnvio,
        validarTraspasoParaRecepcion,
        validarTraspasoParaCancelacion,

        // Utilidades de cálculo
        calcularProgresoTraspaso,
        calcularTiempoTransito,
        obtenerEstadoTraspaso,

        // Filtros y navegación
        aplicarFiltros,
        limpiarFiltros,
        cambiarPagina,
        buscar,
        filtrarPorEstado,
        filtrarPorAlmacenOrigen,
        filtrarPorAlmacenDestino,
        filtrarPorFecha,
        filtrarPorUsuario,

        // Operaciones masivas
        procesarTraspasosSeleccionados,
        crearTraspasoMasivo,

        // Exportación
        exportarTraspasos,

        // Estadísticas
        cargarEstadisticasTraspasos,

        // Utilidades
        limpiarDatos,
        refrescar,

        // Setters para casos específicos
        setTraspasoActual,
        setMaterialesTraspaso
    };
};

export default useTraspasos;