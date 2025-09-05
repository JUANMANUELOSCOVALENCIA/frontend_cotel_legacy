// ======================================================
// src/features/almacenes/hooks/useAlmacenActions.js
// Hook especializado para acciones y operaciones de almacenes
// ======================================================

import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

export const useAlmacenActions = ({
                                      crearAlmacen,
                                      actualizarAlmacen,
                                      eliminarAlmacen,
                                      obtenerAlmacen,
                                      cargarEstadisticasAlmacen,
                                      refrescar
                                  }) => {
    const [operacionEnProceso, setOperacionEnProceso] = useState(null);
    const [historialOperaciones, setHistorialOperaciones] = useState([]);

    // Ejecutar operación con manejo de errores y feedback
    const ejecutarOperacion = useCallback(async (tipoOperacion, funcionOperacion, mensajes = {}) => {
        setOperacionEnProceso(tipoOperacion);

        try {
            const resultado = await funcionOperacion();

            if (resultado) {
                const mensaje = mensajes.exito || 'Operación completada exitosamente';
                toast.success(mensaje);

                // Guardar en historial
                guardarOperacionEnHistorial({
                    tipo: tipoOperacion,
                    exito: true,
                    mensaje,
                    timestamp: new Date().toISOString()
                });

                return resultado;
            } else {
                const mensaje = mensajes.error || 'Error en la operación';
                toast.error(mensaje);
                return null;
            }
        } catch (error) {
            const mensaje = mensajes.error || 'Error inesperado en la operación';
            toast.error(mensaje);
            console.error(`Error en ${tipoOperacion}:`, error);

            guardarOperacionEnHistorial({
                tipo: tipoOperacion,
                exito: false,
                mensaje,
                error: error.message,
                timestamp: new Date().toISOString()
            });

            return null;
        } finally {
            setOperacionEnProceso(null);
        }
    }, []);

    // Crear almacén con validaciones
    const handleCrearAlmacen = useCallback(async (datosAlmacen) => {
        return await ejecutarOperacion(
            'crear_almacen',
            () => crearAlmacen(datosAlmacen),
            {
                exito: `Almacén "${datosAlmacen.nombre}" creado exitosamente`,
                error: 'Error al crear el almacén'
            }
        );
    }, [ejecutarOperacion, crearAlmacen]);

    // Actualizar almacén
    const handleActualizarAlmacen = useCallback(async (almacenId, datosActualizacion) => {
        return await ejecutarOperacion(
            'actualizar_almacen',
            () => actualizarAlmacen(almacenId, datosActualizacion),
            {
                exito: `Almacén "${datosActualizacion.nombre || ''}" actualizado exitosamente`,
                error: 'Error al actualizar el almacén'
            }
        );
    }, [ejecutarOperacion, actualizarAlmacen]);

    // Eliminar almacén con confirmaciones
    const handleEliminarAlmacen = useCallback(async (almacenId, datosEliminacion = {}) => {
        return await ejecutarOperacion(
            'eliminar_almacen',
            () => eliminarAlmacen(almacenId, datosEliminacion),
            {
                exito: 'Almacén eliminado exitosamente',
                error: 'Error al eliminar el almacén'
            }
        );
    }, [ejecutarOperacion, eliminarAlmacen]);

    // Obtener almacén con detalles
    const handleObtenerAlmacen = useCallback(async (almacenId) => {
        return await ejecutarOperacion(
            'obtener_almacen',
            () => obtenerAlmacen(almacenId),
            {
                error: 'Error al cargar los detalles del almacén'
            }
        );
    }, [ejecutarOperacion, obtenerAlmacen]);

    // Cargar estadísticas del almacén
    const handleCargarEstadisticas = useCallback(async (almacenId) => {
        return await ejecutarOperacion(
            'cargar_estadisticas',
            () => cargarEstadisticasAlmacen(almacenId),
            {
                error: 'Error al cargar las estadísticas del almacén'
            }
        );
    }, [ejecutarOperacion, cargarEstadisticasAlmacen]);

    // Activar/Desactivar almacén
    const handleCambiarEstadoAlmacen = useCallback(async (almacenId, nuevoEstado, datosAlmacen) => {
        const accion = nuevoEstado ? 'activar' : 'desactivar';

        return await ejecutarOperacion(
            `${accion}_almacen`,
            () => actualizarAlmacen(almacenId, { activo: nuevoEstado }),
            {
                exito: `Almacén ${accion === 'activar' ? 'activado' : 'desactivado'} exitosamente`,
                error: `Error al ${accion} el almacén`
            }
        );
    }, [ejecutarOperacion, actualizarAlmacen]);

    // Cambiar tipo de almacén
    const handleCambiarTipoAlmacen = useCallback(async (almacenId, nuevoTipo, datosAlmacen) => {
        return await ejecutarOperacion(
            'cambiar_tipo_almacen',
            () => actualizarAlmacen(almacenId, { tipo: nuevoTipo }),
            {
                exito: `Tipo de almacén cambiado a ${nuevoTipo} exitosamente`,
                error: 'Error al cambiar el tipo de almacén'
            }
        );
    }, [ejecutarOperacion, actualizarAlmacen]);

    // Designar como almacén principal
    const handleDesignarPrincipal = useCallback(async (almacenId, datosAlmacen) => {
        return await ejecutarOperacion(
            'designar_principal',
            () => actualizarAlmacen(almacenId, { es_principal: true }),
            {
                exito: `Almacén "${datosAlmacen.nombre}" designado como principal`,
                error: 'Error al designar almacén principal'
            }
        );
    }, [ejecutarOperacion, actualizarAlmacen]);

    // Operaciones masivas
    const handleOperacionMasiva = useCallback(async (operacion, almacenesIds, parametros = {}) => {
        const nombreOperacion = `operacion_masiva_${operacion}`;

        return await ejecutarOperacion(
            nombreOperacion,
            async () => {
                const resultados = [];
                let exitosos = 0;
                let fallidos = 0;

                for (const almacenId of almacenesIds) {
                    try {
                        let resultado = false;

                        switch (operacion) {
                            case 'activar':
                                resultado = await actualizarAlmacen(almacenId, { activo: true });
                                break;

                            case 'desactivar':
                                resultado = await actualizarAlmacen(almacenId, { activo: false });
                                break;

                            case 'cambiar_tipo':
                                resultado = await actualizarAlmacen(almacenId, { tipo: parametros.nuevoTipo });
                                break;

                            case 'eliminar':
                                resultado = await eliminarAlmacen(almacenId, parametros);
                                break;

                            default:
                                throw new Error(`Operación ${operacion} no soportada`);
                        }

                        if (resultado) {
                            exitosos++;
                        } else {
                            fallidos++;
                        }

                        resultados.push({
                            almacenId,
                            exito: !!resultado,
                            error: resultado ? null : 'Error en la operación'
                        });

                    } catch (error) {
                        fallidos++;
                        resultados.push({
                            almacenId,
                            exito: false,
                            error: error.message
                        });
                    }
                }

                // Refrescar datos después de operación masiva
                await refrescar();

                return {
                    exitosos,
                    fallidos,
                    total: almacenesIds.length,
                    resultados
                };
            },
            {
                exito: `Operación masiva completada: ${almacenesIds.length} almacenes procesados`,
                error: 'Error en la operación masiva'
            }
        );
    }, [ejecutarOperacion, actualizarAlmacen, eliminarAlmacen, refrescar]);

    // Duplicar almacén
    const handleDuplicarAlmacen = useCallback(async (almacenOriginal, modificaciones = {}) => {
        const datosNuevoAlmacen = {
            ...almacenOriginal,
            codigo: modificaciones.codigo || `${almacenOriginal.codigo}-COPY`,
            nombre: modificaciones.nombre || `${almacenOriginal.nombre} (Copia)`,
            es_principal: false, // Una copia nunca puede ser principal
            ...modificaciones
        };

        // Eliminar campos que no deben duplicarse
        delete datosNuevoAlmacen.id;
        delete datosNuevoAlmacen.created_at;
        delete datosNuevoAlmacen.updated_at;
        delete datosNuevoAlmacen.total_materiales;

        return await handleCrearAlmacen(datosNuevoAlmacen);
    }, [handleCrearAlmacen]);

    // Refrescar datos con feedback
    const handleRefrescar = useCallback(async () => {
        return await ejecutarOperacion(
            'refrescar_datos',
            refrescar,
            {
                exito: 'Datos actualizados exitosamente',
                error: 'Error al actualizar los datos'
            }
        );
    }, [ejecutarOperacion, refrescar]);

    // Guardar operación en historial
    const guardarOperacionEnHistorial = useCallback((operacion) => {
        const nuevaOperacion = {
            id: Date.now(),
            ...operacion
        };

        setHistorialOperaciones(prev => {
            const nuevoHistorial = [nuevaOperacion, ...prev.slice(0, 49)]; // Mantener últimas 50

            try {
                localStorage.setItem('historial_operaciones_almacenes', JSON.stringify(nuevoHistorial));
            } catch (error) {
                console.warn('No se pudo guardar el historial de operaciones:', error);
            }

            return nuevoHistorial;
        });
    }, []);

    // Cargar historial de operaciones
    const cargarHistorialOperaciones = useCallback(() => {
        try {
            const historial = JSON.parse(localStorage.getItem('historial_operaciones_almacenes') || '[]');
            setHistorialOperaciones(historial);
        } catch (error) {
            console.error('Error cargando historial de operaciones:', error);
            setHistorialOperaciones([]);
        }
    }, []);

    // Limpiar historial
    const limpiarHistorialOperaciones = useCallback(() => {
        setHistorialOperaciones([]);
        try {
            localStorage.removeItem('historial_operaciones_almacenes');
            toast.success('Historial de operaciones limpiado');
        } catch (error) {
            console.warn('No se pudo limpiar el historial:', error);
        }
    }, []);

    // Obtener estadísticas de operaciones
    const getEstadisticasOperaciones = useCallback(() => {
        const totalOperaciones = historialOperaciones.length;
        const operacionesExitosas = historialOperaciones.filter(op => op.exito).length;
        const operacionesFallidas = totalOperaciones - operacionesExitosas;

        const porcentajeExito = totalOperaciones > 0
            ? Math.round((operacionesExitosas / totalOperaciones) * 100)
            : 0;

        // Operaciones por tipo
        const operacionesPorTipo = historialOperaciones.reduce((acc, op) => {
            acc[op.tipo] = (acc[op.tipo] || 0) + 1;
            return acc;
        }, {});

        // Operaciones recientes (últimas 24 horas)
        const hace24Horas = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const operacionesRecientes = historialOperaciones.filter(op =>
            new Date(op.timestamp) > hace24Horas
        ).length;

        return {
            total: totalOperaciones,
            exitosas: operacionesExitosas,
            fallidas: operacionesFallidas,
            porcentajeExito,
            operacionesPorTipo,
            recientes24h: operacionesRecientes
        };
    }, [historialOperaciones]);

    // Verificar si una operación está en proceso
    const estaEnProceso = useCallback((tipoOperacion = null) => {
        if (tipoOperacion) {
            return operacionEnProceso === tipoOperacion;
        }
        return operacionEnProceso !== null;
    }, [operacionEnProceso]);

    // Cancelar operación (si es posible)
    const cancelarOperacion = useCallback(() => {
        if (operacionEnProceso) {
            setOperacionEnProceso(null);
            toast.info('Operación cancelada');
        }
    }, [operacionEnProceso]);

    return {
        // Estado de operaciones
        operacionEnProceso,
        estaEnProceso,
        cancelarOperacion,

        // Operaciones principales
        handleCrearAlmacen,
        handleActualizarAlmacen,
        handleEliminarAlmacen,
        handleObtenerAlmacen,
        handleCargarEstadisticas,

        // Operaciones de estado
        handleCambiarEstadoAlmacen,
        handleCambiarTipoAlmacen,
        handleDesignarPrincipal,

        // Operaciones masivas
        handleOperacionMasiva,

        // Operaciones especiales
        handleDuplicarAlmacen,
        handleRefrescar,

        // Historial
        historialOperaciones,
        cargarHistorialOperaciones,
        limpiarHistorialOperaciones,
        getEstadisticasOperaciones,

        // Utilidades
        ejecutarOperacion
    };
};

export default useAlmacenActions;