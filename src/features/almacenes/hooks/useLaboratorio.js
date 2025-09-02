// ======================================================
// src/core/almacenes/hooks/useLaboratorio.js
// Hook para gestión de operaciones de laboratorio
// ======================================================

import { useState, useCallback, useEffect } from 'react';
import almacenService from '../../../features/almacenes/services/almacenService';

export const useLaboratorio = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [consultasLaboratorio, setConsultasLaboratorio] = useState([]);
    const [materialesEnLaboratorio, setMaterialesEnLaboratorio] = useState([]);
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
        dashboard: false,
        consultas: false,
        enviar_individual: false,
        retornar_individual: false,
        actualizar_estado: false,
        enviar_lote: false,
        procesar_seleccionados: false,
        procesar_criterios: false,
        tiempo_excesivo: false,
        por_tecnico: false,
        por_resultado: false
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

    const showWarning = useCallback((title, message) => {
        console.warn(`${title}: ${message}`);
        // TODO: Aquí puedes agregar tu sistema de notificaciones cuando esté listo
    }, []);

    // ========== DASHBOARD Y ESTADÍSTICAS ==========

    const cargarDashboardLaboratorio = useCallback(async () => {
        setLoading('dashboard', true);
        try {
            const response = await almacenService.getDashboardLaboratorio();
            if (response.success) {
                setDashboardData(response.data);
                return response.data;
            } else {
                showError('Error al cargar dashboard', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al cargar dashboard de laboratorio');
            return null;
        } finally {
            setLoading('dashboard', false);
        }
    }, [showError, setLoading]);

    const cargarConsultasLaboratorio = useCallback(async (params = {}) => {
        setLoading('consultas', true);
        try {
            const parametros = { ...filtros, ...params };
            const response = await almacenService.getConsultasLaboratorio(parametros);

            if (response.success) {
                setConsultasLaboratorio(response.data.results || response.data);
                setPaginacion(prev => ({
                    ...prev,
                    total: response.data.count || 0,
                    pages: Math.ceil((response.data.count || 0) / (parametros.page_size || 20))
                }));
                return response.data;
            } else {
                showError('Error al cargar consultas', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al cargar consultas de laboratorio');
            return null;
        } finally {
            setLoading('consultas', false);
        }
    }, [filtros, showError, setLoading]);

    // ========== OPERACIONES INDIVIDUALES ==========

    const enviarMaterialALaboratorio = useCallback(async (materialId, observaciones = '', tipoAnalisis = 'DIAGNOSTICO') => {
        setLoading('enviar_individual', true);
        try {
            const operacionData = {
                accion: 'enviar_material',
                material_id: materialId,
                observaciones,
                tipo_analisis: tipoAnalisis,
                fecha_ingreso: new Date().toISOString()
            };

            const response = await almacenService.operacionLaboratorio(operacionData);

            if (response.success) {
                showSuccess('Éxito', 'Material enviado a laboratorio correctamente');

                // Refrescar datos
                await cargarDashboardLaboratorio();
                await cargarConsultasLaboratorio({ page: paginacion.page });

                return response.data;
            } else {
                showError('Error al enviar material', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al enviar material a laboratorio');
            return null;
        } finally {
            setLoading('enviar_individual', false);
        }
    }, [showError, showSuccess, setLoading, cargarDashboardLaboratorio, cargarConsultasLaboratorio, paginacion.page]);

    const retornarMaterialDeLaboratorio = useCallback(async (materialId, resultadoData) => {
        setLoading('retornar_individual', true);
        try {
            const operacionData = {
                accion: 'retornar_material',
                material_id: materialId,
                resultado: resultadoData.resultado, // 'FUNCIONAL', 'DEFECTUOSO', 'REPARADO'
                observaciones_laboratorio: resultadoData.observaciones,
                tecnico_responsable: resultadoData.tecnico_responsable,
                fecha_salida: new Date().toISOString(),
                tiempo_laboratorio: resultadoData.tiempo_laboratorio
            };

            const response = await almacenService.operacionLaboratorio(operacionData);

            if (response.success) {
                const mensaje = resultadoData.resultado === 'FUNCIONAL' ?
                    'Material retornado como funcional' :
                    `Material marcado como ${resultadoData.resultado.toLowerCase()}`;

                showSuccess('Éxito', mensaje);

                // Refrescar datos
                await cargarDashboardLaboratorio();
                await cargarConsultasLaboratorio({ page: paginacion.page });

                return response.data;
            } else {
                showError('Error al retornar material', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al retornar material de laboratorio');
            return null;
        } finally {
            setLoading('retornar_individual', false);
        }
    }, [showError, showSuccess, setLoading, cargarDashboardLaboratorio, cargarConsultasLaboratorio, paginacion.page]);

    const actualizarEstadoMaterial = useCallback(async (materialId, nuevoEstado, observaciones = '') => {
        setLoading('actualizar_estado', true);
        try {
            const operacionData = {
                accion: 'actualizar_estado',
                material_id: materialId,
                nuevo_estado: nuevoEstado,
                observaciones,
                fecha_actualizacion: new Date().toISOString()
            };

            const response = await almacenService.operacionLaboratorio(operacionData);

            if (response.success) {
                showSuccess('Éxito', 'Estado actualizado correctamente');

                // Refrescar datos
                await cargarConsultasLaboratorio({ page: paginacion.page });

                return response.data;
            } else {
                showError('Error al actualizar estado', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al actualizar estado');
            return null;
        } finally {
            setLoading('actualizar_estado', false);
        }
    }, [showError, showSuccess, setLoading, cargarConsultasLaboratorio, paginacion.page]);

    // ========== OPERACIONES MASIVAS ==========

    const enviarLoteCompletoALaboratorio = useCallback(async (loteId, observaciones = '', tipoAnalisis = 'DIAGNOSTICO') => {
        setLoading('enviar_lote', true);
        try {
            const operacionData = {
                accion: 'enviar_lote_completo',
                criterios: {
                    lote_id: loteId
                },
                parametros: {
                    observaciones,
                    tipo_analisis: tipoAnalisis,
                    fecha_ingreso: new Date().toISOString()
                }
            };

            const response = await almacenService.operacionMasivaLaboratorio(operacionData);

            if (response.success) {
                const totalProcesados = response.data.total_procesados || 0;
                showSuccess('Éxito',
                    `Lote enviado a laboratorio: ${totalProcesados} materiales procesados`
                );

                // Refrescar datos
                await cargarDashboardLaboratorio();

                return response.data;
            } else {
                showError('Error al enviar lote', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al enviar lote a laboratorio');
            return null;
        } finally {
            setLoading('enviar_lote', false);
        }
    }, [showError, showSuccess, setLoading, cargarDashboardLaboratorio]);

    const procesarMaterialesSeleccionados = useCallback(async (materialesIds, operacion, parametros = {}) => {
        setLoading('procesar_seleccionados', true);
        try {
            const operacionData = {
                accion: operacion, // 'enviar_multiple', 'retornar_multiple', 'cambiar_estado_multiple'
                criterios: {
                    materiales_ids: materialesIds
                },
                parametros: {
                    ...parametros,
                    fecha_operacion: new Date().toISOString()
                }
            };

            const response = await almacenService.operacionMasivaLaboratorio(operacionData);

            if (response.success) {
                const totalProcesados = response.data.total_procesados || 0;
                const totalErrores = response.data.total_errores || 0;

                if (totalErrores > 0) {
                    showWarning('Operación completada con errores',
                        `${totalProcesados} procesados correctamente, ${totalErrores} con errores`
                    );
                } else {
                    showSuccess('Éxito',
                        `Operación completada: ${totalProcesados} materiales procesados`
                    );
                }

                // Refrescar datos
                await cargarDashboardLaboratorio();
                await cargarConsultasLaboratorio({ page: paginacion.page });

                return response.data;
            } else {
                showError('Error en operación masiva', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error en operación masiva');
            return null;
        } finally {
            setLoading('procesar_seleccionados', false);
        }
    }, [showError, showSuccess, showWarning, setLoading, cargarDashboardLaboratorio, cargarConsultasLaboratorio, paginacion.page]);

    const procesarPorCriterios = useCallback(async (criterios, operacion, parametros = {}) => {
        setLoading('procesar_criterios', true);
        try {
            const operacionData = {
                accion: operacion,
                criterios,
                parametros: {
                    ...parametros,
                    fecha_operacion: new Date().toISOString()
                }
            };

            const response = await almacenService.operacionMasivaLaboratorio(operacionData);

            if (response.success) {
                const totalProcesados = response.data.total_procesados || 0;
                showSuccess('Éxito',
                    `Operación completada: ${totalProcesados} materiales procesados`
                );

                // Refrescar datos
                await cargarDashboardLaboratorio();

                return response.data;
            } else {
                showError('Error en operación por criterios', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error en operación por criterios');
            return null;
        } finally {
            setLoading('procesar_criterios', false);
        }
    }, [showError, showSuccess, setLoading, cargarDashboardLaboratorio]);

    // ========== CONSULTAS ESPECIALIZADAS ==========

    const obtenerMaterialesPorTiempoExcesivo = useCallback(async (diasLimite = 15) => {
        setLoading('tiempo_excesivo', true);
        try {
            const params = {
                tipo: 'tiempo_excesivo',
                dias_limite: diasLimite
            };

            const response = await cargarConsultasLaboratorio(params);
            return response;
        } finally {
            setLoading('tiempo_excesivo', false);
        }
    }, [cargarConsultasLaboratorio, setLoading]);

    const obtenerMaterialesPorTecnico = useCallback(async (tecnicoId, fechaInicio = null, fechaFin = null) => {
        setLoading('por_tecnico', true);
        try {
            const params = {
                tipo: 'por_tecnico',
                tecnico_id: tecnicoId
            };

            if (fechaInicio) params.fecha_desde = fechaInicio;
            if (fechaFin) params.fecha_hasta = fechaFin;

            const response = await cargarConsultasLaboratorio(params);
            return response;
        } finally {
            setLoading('por_tecnico', false);
        }
    }, [cargarConsultasLaboratorio, setLoading]);

    const obtenerMaterialesPorResultado = useCallback(async (resultado, fechaInicio = null, fechaFin = null) => {
        setLoading('por_resultado', true);
        try {
            const params = {
                tipo: 'por_resultado',
                resultado
            };

            if (fechaInicio) params.fecha_desde = fechaInicio;
            if (fechaFin) params.fecha_hasta = fechaFin;

            const response = await cargarConsultasLaboratorio(params);
            return response;
        } finally {
            setLoading('por_resultado', false);
        }
    }, [cargarConsultasLaboratorio, setLoading]);

    // ========== ANÁLISIS Y MÉTRICAS ==========

    const calcularTiempoPromedioLaboratorio = useCallback((materiales) => {
        if (!materiales || materiales.length === 0) return 0;

        const tiemposValidos = materiales
            .filter(m => m.fecha_ingreso_laboratorio && m.fecha_salida_laboratorio)
            .map(m => {
                const ingreso = new Date(m.fecha_ingreso_laboratorio);
                const salida = new Date(m.fecha_salida_laboratorio);
                return (salida - ingreso) / (1000 * 60 * 60 * 24); // días
            });

        if (tiemposValidos.length === 0) return 0;

        return tiemposValidos.reduce((sum, tiempo) => sum + tiempo, 0) / tiemposValidos.length;
    }, []);

    const calcularEficienciaLaboratorio = useCallback((materiales) => {
        if (!materiales || materiales.length === 0) return { total: 0, funcionales: 0, defectuosos: 0, porcentaje_funcionales: 0 };

        const total = materiales.length;
        const funcionales = materiales.filter(m => m.resultado_laboratorio === 'FUNCIONAL').length;
        const defectuosos = materiales.filter(m => m.resultado_laboratorio === 'DEFECTUOSO').length;
        const reparados = materiales.filter(m => m.resultado_laboratorio === 'REPARADO').length;

        return {
            total,
            funcionales,
            defectuosos,
            reparados,
            porcentaje_funcionales: total > 0 ? Math.round((funcionales / total) * 100) : 0,
            porcentaje_recuperados: total > 0 ? Math.round(((funcionales + reparados) / total) * 100) : 0
        };
    }, []);

    const obtenerAlertasLaboratorio = useCallback(() => {
        if (!dashboardData) return [];

        const alertas = [];

        // Alerta por tiempo excesivo
        if (dashboardData.materiales_tiempo_excesivo > 0) {
            alertas.push({
                tipo: 'tiempo_excesivo',
                nivel: 'warning',
                mensaje: `${dashboardData.materiales_tiempo_excesivo} materiales con más de 15 días en laboratorio`,
                cantidad: dashboardData.materiales_tiempo_excesivo
            });
        }

        // Alerta por capacidad
        const capacidadActual = dashboardData.total_en_laboratorio || 0;
        const capacidadMaxima = dashboardData.capacidad_maxima || 100;
        const porcentajeCapacidad = (capacidadActual / capacidadMaxima) * 100;

        if (porcentajeCapacidad > 90) {
            alertas.push({
                tipo: 'capacidad',
                nivel: 'error',
                mensaje: `Laboratorio al ${Math.round(porcentajeCapacidad)}% de capacidad`,
                cantidad: capacidadActual
            });
        } else if (porcentajeCapacidad > 75) {
            alertas.push({
                tipo: 'capacidad',
                nivel: 'warning',
                mensaje: `Laboratorio al ${Math.round(porcentajeCapacidad)}% de capacidad`,
                cantidad: capacidadActual
            });
        }

        // Alerta por materiales pendientes de retorno
        if (dashboardData.materiales_pendientes_retorno > 0) {
            alertas.push({
                tipo: 'pendientes_retorno',
                nivel: 'info',
                mensaje: `${dashboardData.materiales_pendientes_retorno} materiales analizados pendientes de retorno`,
                cantidad: dashboardData.materiales_pendientes_retorno
            });
        }

        return alertas;
    }, [dashboardData]);

    // ========== VALIDACIONES ==========

    const validarMaterialParaLaboratorio = useCallback((material) => {
        const errores = [];

        if (!material) {
            errores.push('Material no encontrado');
            return { valido: false, errores };
        }

        if (material.estado === 'EN_LABORATORIO') {
            errores.push('El material ya está en laboratorio');
        }

        if (material.estado === 'ASIGNADO') {
            errores.push('No se puede enviar un material asignado a laboratorio');
        }

        if (material.estado === 'DADO_DE_BAJA') {
            errores.push('No se puede enviar un material dado de baja a laboratorio');
        }

        // Validaciones específicas para equipos ONU
        if (material.tipo_material === 'ONU') {
            if (!material.mac_address || !material.gpon_serial) {
                errores.push('Equipo ONU debe tener MAC Address y GPON Serial para análisis');
            }
        }

        return {
            valido: errores.length === 0,
            errores
        };
    }, []);

    const validarRetornoDeLaboratorio = useCallback((material, resultadoData) => {
        const errores = [];

        if (!material) {
            errores.push('Material no encontrado');
            return { valido: false, errores };
        }

        if (material.estado !== 'EN_LABORATORIO') {
            errores.push('Solo se pueden retornar materiales que estén en laboratorio');
        }

        if (!resultadoData.resultado) {
            errores.push('Debe especificar el resultado del análisis');
        }

        if (!['FUNCIONAL', 'DEFECTUOSO', 'REPARADO'].includes(resultadoData.resultado)) {
            errores.push('Resultado debe ser FUNCIONAL, DEFECTUOSO o REPARADO');
        }

        if (!resultadoData.tecnico_responsable) {
            errores.push('Debe especificar el técnico responsable');
        }

        return {
            valido: errores.length === 0,
            errores
        };
    }, []);

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

    const filtrarPorTecnico = useCallback((tecnicoId) => {
        aplicarFiltros({ tecnico_responsable: tecnicoId });
    }, [aplicarFiltros]);

    const filtrarPorResultado = useCallback((resultado) => {
        aplicarFiltros({ resultado_laboratorio: resultado });
    }, [aplicarFiltros]);

    const filtrarPorTiempo = useCallback((diasMinimos) => {
        aplicarFiltros({ dias_minimos: diasMinimos });
    }, [aplicarFiltros]);

    // ========== EFECTOS ==========

    useEffect(() => {
        cargarConsultasLaboratorio({ page: paginacion.page });
    }, [paginacion.page, filtros]);

    useEffect(() => {
        cargarDashboardLaboratorio();
    }, []);

    // ========== UTILIDADES ==========

    const limpiarDatos = useCallback(() => {
        setDashboardData(null);
        setConsultasLaboratorio([]);
        setMaterialesEnLaboratorio([]);
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
        await Promise.all([
            cargarDashboardLaboratorio(),
            cargarConsultasLaboratorio({ page: paginacion.page })
        ]);
    }, [cargarDashboardLaboratorio, cargarConsultasLaboratorio, paginacion.page]);

    // Helper function para verificar si algo está cargando
    const isLoading = useCallback((key) => {
        return key ? loadingStates[key] : Object.values(loadingStates).some(state => state);
    }, [loadingStates]);

    // ========== CONSTANTES ==========

    const tiposAnalisis = [
        { codigo: 'DIAGNOSTICO', nombre: 'Diagnóstico General' },
        { codigo: 'FUNCIONALIDAD', nombre: 'Prueba de Funcionalidad' },
        { codigo: 'REPARACION', nombre: 'Reparación' },
        { codigo: 'CALIBRACION', nombre: 'Calibración' },
        { codigo: 'ACTUALIZACION', nombre: 'Actualización de Firmware' }
    ];

    const resultadosLaboratorio = [
        { codigo: 'FUNCIONAL', nombre: 'Funcional', color: 'green' },
        { codigo: 'DEFECTUOSO', nombre: 'Defectuoso', color: 'red' },
        { codigo: 'REPARADO', nombre: 'Reparado', color: 'blue' },
        { codigo: 'PENDIENTE', nombre: 'Análisis Pendiente', color: 'orange' }
    ];

    return {
        // Estado
        dashboardData,
        consultasLaboratorio,
        materialesEnLaboratorio,
        estadisticas,
        filtros,
        paginacion,
        loading: loadingStates, // Estados específicos de loading
        isLoading, // Helper function

        // Constantes
        tiposAnalisis,
        resultadosLaboratorio,

        // Dashboard y estadísticas
        cargarDashboardLaboratorio,
        cargarConsultasLaboratorio,

        // Operaciones individuales
        enviarMaterialALaboratorio,
        retornarMaterialDeLaboratorio,
        actualizarEstadoMaterial,

        // Operaciones masivas
        enviarLoteCompletoALaboratorio,
        procesarMaterialesSeleccionados,
        procesarPorCriterios,

        // Consultas especializadas
        obtenerMaterialesPorTiempoExcesivo,
        obtenerMaterialesPorTecnico,
        obtenerMaterialesPorResultado,

        // Análisis y métricas
        calcularTiempoPromedioLaboratorio,
        calcularEficienciaLaboratorio,
        obtenerAlertasLaboratorio,

        // Validaciones
        validarMaterialParaLaboratorio,
        validarRetornoDeLaboratorio,

        // Filtros y navegación
        aplicarFiltros,
        limpiarFiltros,
        cambiarPagina,
        buscar,
        filtrarPorEstado,
        filtrarPorTecnico,
        filtrarPorResultado,
        filtrarPorTiempo,

        // Utilidades
        limpiarDatos,
        refrescar,

        // Setters para casos específicos
        setDashboardData,
        setConsultasLaboratorio,
        setMaterialesEnLaboratorio
    };
};

export default useLaboratorio;