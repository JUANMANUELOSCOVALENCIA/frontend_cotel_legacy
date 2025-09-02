// ======================================================
// src/core/almacenes/hooks/useReportes.js
// Hook para reportes y estadísticas del módulo de almacenes
// ======================================================

import { useState, useCallback, useEffect } from 'react';
import almacenService from '../../../features/almacenes/services/almacenService';

export const useReportes = () => {
    const [estadisticasGenerales, setEstadisticasGenerales] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [reporteInventario, setReporteInventario] = useState(null);
    const [reporteMovimientos, setReporteMovimientos] = useState(null);
    const [reporteGarantias, setReporteGarantias] = useState(null);
    const [reporteEficiencia, setReporteEficiencia] = useState(null);
    const [alertasOperativas, setAlertasOperativas] = useState([]);
    const [estadisticasRapidas, setEstadisticasRapidas] = useState(null);
    const [filtrosReporte, setFiltrosReporte] = useState({});

    // Estados de loading específicos
    const [loadingStates, setLoadingStates] = useState({
        estadisticas_generales: false,
        dashboard: false,
        estadisticas_rapidas: false,
        reporte_inventario: false,
        reporte_movimientos: false,
        reporte_garantias: false,
        reporte_eficiencia: false,
        rendimiento_almacen: false,
        alertas: false,
        exportar: false,
        exportar_personalizado: false,
        dashboard_personalizado: false,
        analisis_comparativo: false,
        tiempo_real: false,
        refresh_all: false
    });

    // Función para gestionar loading states
    const setLoading = useCallback((key, value) => {
        setLoadingStates(prev => ({
            ...prev,
            [key]: value
        }));
    }, []);

    // Funciones simples para mostrar mensajes (temporal)
    const showNotification = useCallback((type, title, message) => {
        switch (type) {
            case 'error':
                console.error(`${title}: ${message}`);
                break;
            case 'success':
                console.log(`${title}: ${message}`);
                break;
            case 'warning':
                console.warn(`${title}: ${message}`);
                break;
            case 'info':
                console.info(`${title}: ${message}`);
                break;
            default:
                console.log(`${title}: ${message}`);
        }
        // TODO: Aquí puedes agregar tu sistema de notificaciones cuando esté listo
    }, []);

    // ========== ESTADÍSTICAS GENERALES ==========

    const cargarEstadisticasGenerales = useCallback(async (params = {}) => {
        setLoading('estadisticas_generales', true);
        try {
            const response = await almacenService.getEstadisticasGenerales(params);
            if (response.success) {
                setEstadisticasGenerales(response.data);
                return response.data;
            } else {
                showNotification('error', 'Error al cargar estadísticas', response.error);
                return null;
            }
        } catch (error) {
            showNotification('error', 'Error inesperado', 'Error al cargar estadísticas generales');
            return null;
        } finally {
            setLoading('estadisticas_generales', false);
        }
    }, [showNotification, setLoading]);

    const cargarDashboardOperativo = useCallback(async () => {
        setLoading('dashboard', true);
        try {
            const response = await almacenService.getDashboardOperativo();
            if (response.success) {
                setDashboardData(response.data);
                return response.data;
            } else {
                showNotification('error', 'Error al cargar dashboard', response.error);
                return null;
            }
        } catch (error) {
            showNotification('error', 'Error inesperado', 'Error al cargar dashboard operativo');
            return null;
        } finally {
            setLoading('dashboard', false);
        }
    }, [showNotification, setLoading]);

    const cargarEstadisticasRapidas = useCallback(async () => {
        setLoading('estadisticas_rapidas', true);
        try {
            const response = await almacenService.getEstadisticasRapidas();
            if (response.success) {
                setEstadisticasRapidas(response.data);
                return response.data;
            } else {
                showNotification('error', 'Error al cargar estadísticas rápidas', response.error);
                return null;
            }
        } catch (error) {
            showNotification('error', 'Error inesperado', 'Error al cargar estadísticas rápidas');
            return null;
        } finally {
            setLoading('estadisticas_rapidas', false);
        }
    }, [showNotification, setLoading]);

    // ========== REPORTES ESPECÍFICOS ==========

    const generarReporteInventario = useCallback(async (params = {}) => {
        setLoading('reporte_inventario', true);
        try {
            const parametros = { ...filtrosReporte, ...params };
            const response = await almacenService.getReporteInventario(parametros);

            if (response.success) {
                setReporteInventario(response.data);
                return response.data;
            } else {
                showNotification('error', 'Error al generar reporte de inventario', response.error);
                return null;
            }
        } catch (error) {
            showNotification('error', 'Error inesperado', 'Error al generar reporte de inventario');
            return null;
        } finally {
            setLoading('reporte_inventario', false);
        }
    }, [filtrosReporte, showNotification, setLoading]);

    const generarReporteMovimientos = useCallback(async (params = {}) => {
        setLoading('reporte_movimientos', true);
        try {
            const parametros = { ...filtrosReporte, ...params };
            const response = await almacenService.getReporteMovimientos(parametros);

            if (response.success) {
                setReporteMovimientos(response.data);
                return response.data;
            } else {
                showNotification('error', 'Error al generar reporte de movimientos', response.error);
                return null;
            }
        } catch (error) {
            showNotification('error', 'Error inesperado', 'Error al generar reporte de movimientos');
            return null;
        } finally {
            setLoading('reporte_movimientos', false);
        }
    }, [filtrosReporte, showNotification, setLoading]);

    const generarReporteGarantias = useCallback(async (params = {}) => {
        setLoading('reporte_garantias', true);
        try {
            const parametros = { ...filtrosReporte, ...params };
            const response = await almacenService.getReporteGarantias(parametros);

            if (response.success) {
                setReporteGarantias(response.data);
                return response.data;
            } else {
                showNotification('error', 'Error al generar reporte de garantías', response.error);
                return null;
            }
        } catch (error) {
            showNotification('error', 'Error inesperado', 'Error al generar reporte de garantías');
            return null;
        } finally {
            setLoading('reporte_garantias', false);
        }
    }, [filtrosReporte, showNotification, setLoading]);

    const generarReporteEficiencia = useCallback(async (params = {}) => {
        setLoading('reporte_eficiencia', true);
        try {
            const parametros = { ...filtrosReporte, ...params };
            const response = await almacenService.getReporteEficiencia(parametros);

            if (response.success) {
                setReporteEficiencia(response.data);
                return response.data;
            } else {
                showNotification('error', 'Error al generar reporte de eficiencia', response.error);
                return null;
            }
        } catch (error) {
            showNotification('error', 'Error inesperado', 'Error al generar reporte de eficiencia');
            return null;
        } finally {
            setLoading('reporte_eficiencia', false);
        }
    }, [filtrosReporte, showNotification, setLoading]);

    // ========== ANÁLISIS DE RENDIMIENTO ==========

    const analizarRendimientoAlmacen = useCallback(async (almacenId, periodoInicio, periodoFin) => {
        setLoading('rendimiento_almacen', true);
        try {
            const response = await almacenService.analizarRendimientoAlmacen(almacenId, periodoInicio, periodoFin);
            if (response.success) {
                return response.data;
            } else {
                showNotification('error', 'Error al analizar rendimiento', response.error);
                return null;
            }
        } catch (error) {
            showNotification('error', 'Error inesperado', 'Error al analizar rendimiento del almacén');
            return null;
        } finally {
            setLoading('rendimiento_almacen', false);
        }
    }, [showNotification, setLoading]);

    const obtenerAlertasOperativas = useCallback(async () => {
        setLoading('alertas', true);
        try {
            const response = await almacenService.obtenerAlertasOperativas();
            if (response.success) {
                setAlertasOperativas(response.data);
                return response.data;
            } else {
                showNotification('error', 'Error al obtener alertas', response.error);
                return [];
            }
        } catch (error) {
            showNotification('error', 'Error inesperado', 'Error al obtener alertas operativas');
            return [];
        } finally {
            setLoading('alertas', false);
        }
    }, [showNotification, setLoading]);

    // ========== EXPORTACIÓN DE REPORTES ==========

    const exportarReporte = useCallback(async (tipoReporte, params = {}, formato = 'csv') => {
        setLoading('exportar', true);
        try {
            const parametros = {
                ...filtrosReporte,
                ...params,
                formato
            };

            const response = await almacenService.exportarDatos(tipoReporte, parametros);

            if (response.success) {
                // Crear y descargar archivo
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;

                const timestamp = new Date().toISOString().split('T')[0];
                const extension = formato === 'csv' ? 'csv' : 'xlsx';
                const filename = `${tipoReporte}_${timestamp}.${extension}`;

                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);

                showNotification('success', 'Éxito', 'Reporte exportado correctamente');
                return true;
            } else {
                showNotification('error', 'Error al exportar reporte', response.error);
                return false;
            }
        } catch (error) {
            showNotification('error', 'Error inesperado', 'Error al exportar reporte');
            return false;
        } finally {
            setLoading('exportar', false);
        }
    }, [filtrosReporte, showNotification, setLoading]);

    const exportarReportePersonalizado = useCallback(async (configuracion) => {
        setLoading('exportar_personalizado', true);
        try {
            const {
                tipo,
                columnas,
                filtros,
                formato = 'csv',
                incluir_graficos = false
            } = configuracion;

            const params = {
                ...filtros,
                columnas: columnas.join(','),
                formato,
                incluir_graficos
            };

            return await exportarReporte(tipo, params, formato);
        } catch (error) {
            showNotification('error', 'Error inesperado', 'Error al exportar reporte personalizado');
            return false;
        } finally {
            setLoading('exportar_personalizado', false);
        }
    }, [exportarReporte, showNotification, setLoading]);

    // ========== FILTROS Y CONFIGURACIÓN ==========

    const aplicarFiltrosReporte = useCallback((nuevosFiltros) => {
        setFiltrosReporte(prev => ({ ...prev, ...nuevosFiltros }));
    }, []);

    const limpiarFiltrosReporte = useCallback(() => {
        setFiltrosReporte({});
    }, []);

    const configurarPeriodo = useCallback((fechaInicio, fechaFin) => {
        aplicarFiltrosReporte({
            fecha_desde: fechaInicio,
            fecha_hasta: fechaFin
        });
    }, [aplicarFiltrosReporte]);

    const configurarAlmacenes = useCallback((almacenesIds) => {
        aplicarFiltrosReporte({
            almacenes: Array.isArray(almacenesIds) ? almacenesIds.join(',') : almacenesIds
        });
    }, [aplicarFiltrosReporte]);

    // ========== MÉTRICAS Y CÁLCULOS ==========

    const calcularKPIsInventario = useCallback((datosInventario) => {
        if (!datosInventario || !datosInventario.resumen) return null;

        const resumen = datosInventario.resumen;

        return {
            valorTotal: resumen.valor_total_inventario || 0,
            rotacionInventario: resumen.rotacion_promedio || 0,
            materialesActivos: resumen.total_materiales_activos || 0,
            materialesEnTransito: resumen.total_en_transito || 0,
            porcentajeDisponibilidad: resumen.total_materiales_activos > 0 ?
                Math.round((resumen.total_disponibles / resumen.total_materiales_activos) * 100) : 0,
            porcentajeUtilizacion: resumen.total_materiales_activos > 0 ?
                Math.round(((resumen.total_asignados + resumen.total_instalados) / resumen.total_materiales_activos) * 100) : 0
        };
    }, []);

    const calcularTendencias = useCallback((datosHistoricos, periodo = 30) => {
        if (!datosHistoricos || datosHistoricos.length < 2) return null;

        const ahora = new Date();
        const fechaInicio = new Date(ahora.getTime() - (periodo * 24 * 60 * 60 * 1000));

        const datosRecientes = datosHistoricos.filter(dato =>
            new Date(dato.fecha) >= fechaInicio
        );

        if (datosRecientes.length < 2) return null;

        // Calcular tendencia de inventario
        const inicial = datosRecientes[0].total_materiales || 0;
        const final = datosRecientes[datosRecientes.length - 1].total_materiales || 0;
        const cambioTotal = final - inicial;
        const porcentajeCambio = inicial > 0 ? ((cambioTotal / inicial) * 100) : 0;

        // Calcular promedio de movimientos diarios
        const totalMovimientos = datosRecientes.reduce((sum, dato) =>
            sum + (dato.movimientos_dia || 0), 0
        );
        const promedioMovimientos = totalMovimientos / datosRecientes.length;

        return {
            cambioTotal,
            porcentajeCambio,
            tendencia: cambioTotal > 0 ? 'ascendente' : cambioTotal < 0 ? 'descendente' : 'estable',
            promedioMovimientosDiarios: Math.round(promedioMovimientos),
            periodo
        };
    }, []);

    const compararPeriodos = useCallback((periodoActual, periodoAnterior) => {
        if (!periodoActual || !periodoAnterior) return null;

        const comparacion = {
            inventario: {
                actual: periodoActual.total_materiales || 0,
                anterior: periodoAnterior.total_materiales || 0,
                cambio: 0,
                porcentaje: 0
            },
            movimientos: {
                actual: periodoActual.total_movimientos || 0,
                anterior: periodoAnterior.total_movimientos || 0,
                cambio: 0,
                porcentaje: 0
            },
            eficiencia: {
                actual: periodoActual.porcentaje_eficiencia || 0,
                anterior: periodoAnterior.porcentaje_eficiencia || 0,
                cambio: 0,
                puntos: 0
            }
        };

        // Calcular cambios
        Object.keys(comparacion).forEach(key => {
            if (key === 'eficiencia') {
                comparacion[key].cambio = comparacion[key].actual - comparacion[key].anterior;
                comparacion[key].puntos = Math.abs(comparacion[key].cambio);
            } else {
                comparacion[key].cambio = comparacion[key].actual - comparacion[key].anterior;
                comparacion[key].porcentaje = comparacion[key].anterior > 0 ?
                    ((comparacion[key].cambio / comparacion[key].anterior) * 100) : 0;
            }
        });

        return comparacion;
    }, []);

    // ========== REPORTES PROGRAMADOS ==========

    const programarReporte = useCallback(async (configuracion) => {
        // Esta funcionalidad podría implementarse en el futuro
        showNotification('info', 'Función en desarrollo', 'Los reportes programados estarán disponibles próximamente');
        return false;
    }, [showNotification]);

    const obtenerReportesProgramados = useCallback(async () => {
        // Placeholder para futura implementación
        return [];
    }, []);

    // ========== DASHBOARDS PERSONALIZADOS ==========

    const crearDashboardPersonalizado = useCallback(async (configuracion) => {
        setLoading('dashboard_personalizado', true);
        try {
            const widgets = [];

            // Procesar cada widget configurado
            for (const widgetConfig of configuracion.widgets) {
                let datos = null;

                switch (widgetConfig.tipo) {
                    case 'kpi_inventario':
                        const inventario = await generarReporteInventario(widgetConfig.filtros);
                        datos = calcularKPIsInventario(inventario);
                        break;

                    case 'grafico_movimientos':
                        datos = await generarReporteMovimientos(widgetConfig.filtros);
                        break;

                    case 'alertas_operativas':
                        datos = await obtenerAlertasOperativas();
                        break;

                    case 'estadisticas_rapidas':
                        datos = await cargarEstadisticasRapidas();
                        break;

                    default:
                        break;
                }

                widgets.push({
                    ...widgetConfig,
                    datos,
                    ultimaActualizacion: new Date().toISOString()
                });
            }

            return {
                id: configuracion.id || `dashboard_${Date.now()}`,
                nombre: configuracion.nombre || 'Dashboard Personalizado',
                widgets,
                configuracion
            };
        } catch (error) {
            showNotification('error', 'Error', 'Error al crear dashboard personalizado');
            return null;
        } finally {
            setLoading('dashboard_personalizado', false);
        }
    }, [generarReporteInventario, calcularKPIsInventario, generarReporteMovimientos, obtenerAlertasOperativas, cargarEstadisticasRapidas, showNotification, setLoading]);

    // ========== ANÁLISIS AVANZADO ==========

    const generarAnalisisComparativo = useCallback(async (almacenesIds, periodo) => {
        setLoading('analisis_comparativo', true);
        try {
            const analisis = [];

            for (const almacenId of almacenesIds) {
                const rendimiento = await analizarRendimientoAlmacen(almacenId, periodo.inicio, periodo.fin);
                if (rendimiento) {
                    analisis.push({
                        almacenId,
                        ...rendimiento
                    });
                }
            }

            return {
                periodo,
                almacenes: analisis,
                comparativo: {
                    mejorRendimiento: analisis.reduce((mejor, actual) =>
                        (actual.eficiencia?.porcentaje_eficiencia || 0) > (mejor.eficiencia?.porcentaje_eficiencia || 0) ?
                            actual : mejor, analisis[0]
                    ),
                    mayorMovimiento: analisis.reduce((mayor, actual) =>
                        (actual.movimientos?.total || 0) > (mayor.movimientos?.total || 0) ?
                            actual : mayor, analisis[0]
                    ),
                    menorTiempoPromedio: analisis.reduce((menor, actual) =>
                        (actual.eficiencia?.tiempo_promedio_proceso || Infinity) < (menor.eficiencia?.tiempo_promedio_proceso || Infinity) ?
                            actual : menor, analisis[0]
                    )
                }
            };
        } catch (error) {
            showNotification('error', 'Error', 'Error al generar análisis comparativo');
            return null;
        } finally {
            setLoading('analisis_comparativo', false);
        }
    }, [analizarRendimientoAlmacen, showNotification, setLoading]);

    const predecirTendencias = useCallback((datosHistoricos, periodosAdelante = 3) => {
        if (!datosHistoricos || datosHistoricos.length < 3) return null;

        // Análisis de tendencia simple usando regresión lineal básica
        const n = datosHistoricos.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

        datosHistoricos.forEach((punto, index) => {
            const x = index;
            const y = punto.valor || 0;
            sumX += x;
            sumY += y;
            sumXY += x * y;
            sumXX += x * x;
        });

        const pendiente = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercepto = (sumY - pendiente * sumX) / n;

        const predicciones = [];
        for (let i = 1; i <= periodosAdelante; i++) {
            const x = n + i - 1;
            const valorPredicho = pendiente * x + intercepto;
            predicciones.push({
                periodo: i,
                valorPredicho: Math.max(0, Math.round(valorPredicho)),
                confianza: Math.max(0.5, 1 - (i * 0.1)) // Confianza decrece con la distancia
            });
        }

        return {
            tendencia: pendiente > 0 ? 'creciente' : pendiente < 0 ? 'decreciente' : 'estable',
            pendiente,
            predicciones,
            confiabilidad: n >= 10 ? 'alta' : n >= 5 ? 'media' : 'baja'
        };
    }, []);

    // ========== REPORTES EN TIEMPO REAL ==========

    const generarReporteTiempoReal = useCallback(async (tipoReporte) => {
        setLoading('tiempo_real', true);
        try {
            const timestamp = new Date().toISOString();

            // Obtener datos más recientes
            const [estadisticas, alertas] = await Promise.all([
                cargarEstadisticasRapidas(),
                obtenerAlertasOperativas()
            ]);

            let datosEspecificos = null;

            switch (tipoReporte) {
                case 'dashboard':
                    datosEspecificos = await cargarDashboardOperativo();
                    break;
                case 'inventario':
                    datosEspecificos = await generarReporteInventario({ tiempo_real: true });
                    break;
                case 'movimientos':
                    datosEspecificos = await generarReporteMovimientos({
                        fecha_desde: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                        tiempo_real: true
                    });
                    break;
                default:
                    break;
            }

            return {
                tipo: tipoReporte,
                timestamp,
                estadisticas,
                alertas,
                datos: datosEspecificos,
                actualizacionAutomatica: true
            };
        } catch (error) {
            showNotification('error', 'Error', 'Error al generar reporte en tiempo real');
            return null;
        } finally {
            setLoading('tiempo_real', false);
        }
    }, [cargarEstadisticasRapidas, obtenerAlertasOperativas, cargarDashboardOperativo, generarReporteInventario, generarReporteMovimientos, showNotification, setLoading]);

    // ========== EFECTOS Y AUTOMATIZACIÓN ==========

    useEffect(() => {
        // Cargar datos iniciales
        cargarEstadisticasRapidas();
        obtenerAlertasOperativas();
    }, []);

    // Auto-refresh cada 5 minutos para estadísticas rápidas
    useEffect(() => {
        const intervalo = setInterval(() => {
            cargarEstadisticasRapidas();
            obtenerAlertasOperativas();
        }, 5 * 60 * 1000);

        return () => clearInterval(intervalo);
    }, [cargarEstadisticasRapidas, obtenerAlertasOperativas]);

    // ========== UTILIDADES ==========

    const limpiarDatos = useCallback(() => {
        setEstadisticasGenerales(null);
        setDashboardData(null);
        setReporteInventario(null);
        setReporteMovimientos(null);
        setReporteGarantias(null);
        setReporteEficiencia(null);
        setAlertasOperativas([]);
        setEstadisticasRapidas(null);
        setFiltrosReporte({});
    }, []);

    const refrescarTodo = useCallback(async () => {
        setLoading('refresh_all', true);
        try {
            await Promise.all([
                cargarEstadisticasGenerales(),
                cargarDashboardOperativo(),
                cargarEstadisticasRapidas(),
                obtenerAlertasOperativas()
            ]);
        } finally {
            setLoading('refresh_all', false);
        }
    }, [cargarEstadisticasGenerales, cargarDashboardOperativo, cargarEstadisticasRapidas, obtenerAlertasOperativas, setLoading]);

    const formatearNumero = useCallback((numero, tipo = 'entero') => {
        if (numero === null || numero === undefined) return '0';

        switch (tipo) {
            case 'moneda':
                return new Intl.NumberFormat('es-BO', {
                    style: 'currency',
                    currency: 'BOB'
                }).format(numero);
            case 'porcentaje':
                return `${Math.round(numero * 100) / 100}%`;
            case 'decimal':
                return Math.round(numero * 100) / 100;
            default:
                return Math.round(numero).toLocaleString('es-BO');
        }
    }, []);

    const obtenerColorPorTendencia = useCallback((valor, valorAnterior) => {
        if (valor > valorAnterior) return 'green';
        if (valor < valorAnterior) return 'red';
        return 'gray';
    }, []);

    // Helper function para verificar si algo está cargando
    const isLoading = useCallback((key) => {
        return key ? loadingStates[key] : Object.values(loadingStates).some(state => state);
    }, [loadingStates]);

    return {
        // Estado
        estadisticasGenerales,
        dashboardData,
        reporteInventario,
        reporteMovimientos,
        reporteGarantias,
        reporteEficiencia,
        alertasOperativas,
        estadisticasRapidas,
        filtrosReporte,
        loading: loadingStates, // Estados específicos de loading
        isLoading, // Helper function

        // Estadísticas generales
        cargarEstadisticasGenerales,
        cargarDashboardOperativo,
        cargarEstadisticasRapidas,

        // Reportes específicos
        generarReporteInventario,
        generarReporteMovimientos,
        generarReporteGarantias,
        generarReporteEficiencia,

        // Análisis
        analizarRendimientoAlmacen,
        obtenerAlertasOperativas,

        // Exportación
        exportarReporte,
        exportarReportePersonalizado,

        // Filtros
        aplicarFiltrosReporte,
        limpiarFiltrosReporte,
        configurarPeriodo,
        configurarAlmacenes,

        // Métricas y cálculos
        calcularKPIsInventario,
        calcularTendencias,
        compararPeriodos,

        // Reportes programados
        programarReporte,
        obtenerReportesProgramados,

        // Dashboards personalizados
        crearDashboardPersonalizado,

        // Análisis avanzado
        generarAnalisisComparativo,
        predecirTendencias,

        // Tiempo real
        generarReporteTiempoReal,

        // Utilidades
        limpiarDatos,
        refrescarTodo,
        formatearNumero,
        obtenerColorPorTendencia,

        // Setters para casos específicos
        setEstadisticasGenerales,
        setDashboardData,
        setAlertasOperativas
    };
};

export default useReportes;