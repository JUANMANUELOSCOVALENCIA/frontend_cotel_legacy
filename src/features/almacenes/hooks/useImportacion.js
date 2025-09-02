// ======================================================
// src/core/almacenes/hooks/useImportacion.js
// Hook completo para importación masiva de materiales
// Adaptado para estructura actual del proyecto
// ======================================================

import { useState, useCallback, useEffect } from 'react';
import almacenService from '../../../features/almacenes/services/almacenService';

export const useImportacion = () => {
    const [plantillaData, setPlantillaData] = useState(null);
    const [resultadoImportacion, setResultadoImportacion] = useState(null);
    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);
    const [datosPreview, setDatosPreview] = useState(null);
    const [erroresValidacion, setErroresValidacion] = useState([]);
    const [configuracionImportacion, setConfiguracionImportacion] = useState(null);
    const [historialImportaciones, setHistorialImportaciones] = useState([]);
    const [estadosProcesamiento, setEstadosProcesamiento] = useState({});

    // Estados de carga específicos
    const [loading, setLoading] = useState({
        plantilla: false,
        plantilla_data: false,
        preview: false,
        importar: false,
        simular: false
    });

    // Estado para notificaciones (temporal hasta implementar sistema completo)
    const [notificaciones, setNotificaciones] = useState([]);

    // Función temporal para manejar notificaciones
    const showNotification = useCallback((type, title, message) => {
        const id = Date.now();
        const notification = { id, type, title, message, timestamp: new Date() };

        setNotificaciones(prev => [...prev, notification]);

        // Log para desarrollo
        console.log(`[${type.toUpperCase()}] ${title}: ${message}`);

        // Auto-remove después de 5 segundos
        setTimeout(() => {
            setNotificaciones(prev => prev.filter(n => n.id !== id));
        }, 5000);
    }, []);

    // Función para manejar estados de carga específicos
    const setLoadingState = useCallback((key, value) => {
        setLoading(prev => ({ ...prev, [key]: value }));
    }, []);

    // ========== CONFIGURACIÓN ==========

    const obtenerConfiguracionImportacion = useCallback(() => {
        const config = almacenService.getConfiguracionImportacion();
        setConfiguracionImportacion(config);
        return config;
    }, []);

    // ========== PLANTILLA ==========

    const descargarPlantilla = useCallback(async (tipoPlantilla = 'importacion_masiva') => {
        setLoadingState('plantilla', true);
        try {
            const response = await almacenService.descargarPlantilla(tipoPlantilla);

            if (response.success) {
                // Crear y descargar archivo
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;

                // Obtener nombre del archivo de los headers
                const contentDisposition = response.headers['content-disposition'];
                let filename = `plantilla_${tipoPlantilla}.xlsx`;

                if (contentDisposition) {
                    const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                    if (filenameMatch) {
                        filename = filenameMatch[1];
                    }
                }

                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);

                showNotification('success', 'Éxito', 'Plantilla descargada correctamente');
                return true;
            } else {
                showNotification('error', 'Error al descargar plantilla', response.error);
                return false;
            }
        } catch (error) {
            showNotification('error', 'Error inesperado', 'Error al descargar plantilla');
            return false;
        } finally {
            setLoadingState('plantilla', false);
        }
    }, [showNotification, setLoadingState]);

    const obtenerPlantillaData = useCallback(async () => {
        setLoadingState('plantilla_data', true);
        try {
            const response = await almacenService.getPlantillaImportacion();

            if (response.success) {
                setPlantillaData(response.data);
                return response.data;
            } else {
                showNotification('error', 'Error al obtener datos de plantilla', response.error);
                return null;
            }
        } catch (error) {
            showNotification('error', 'Error inesperado', 'Error al obtener datos de plantilla');
            return null;
        } finally {
            setLoadingState('plantilla_data', false);
        }
    }, [showNotification, setLoadingState]);

    // ========== VALIDACIÓN DE ARCHIVO ==========

    const validarArchivo = useCallback((archivo) => {
        const errores = [];
        const config = configuracionImportacion || obtenerConfiguracionImportacion();

        // Validar extensión
        const extension = archivo.name.toLowerCase().split('.').pop();
        const extensionesPermitidas = config.formatosPermitidos.map(f => f.replace('.', ''));

        if (!extensionesPermitidas.includes(extension)) {
            errores.push(`Formato de archivo no permitido. Use: ${config.formatosPermitidos.join(', ')}`);
        }

        // Validar tamaño
        if (archivo.size > config.tamañoMaximo) {
            const tamañoMB = Math.round(archivo.size / (1024 * 1024));
            const limiteMB = Math.round(config.tamañoMaximo / (1024 * 1024));
            errores.push(`Archivo demasiado grande (${tamañoMB}MB). Máximo permitido: ${limiteMB}MB`);
        }

        // Validar que no esté vacío
        if (archivo.size === 0) {
            errores.push('El archivo está vacío');
        }

        return {
            valido: errores.length === 0,
            errores
        };
    }, [configuracionImportacion, obtenerConfiguracionImportacion]);

    const seleccionarArchivo = useCallback((archivo) => {
        const validacion = validarArchivo(archivo);

        if (validacion.valido) {
            setArchivoSeleccionado(archivo);
            setErroresValidacion([]);
            setDatosPreview(null); // Limpiar preview anterior
            showNotification('success', 'Archivo seleccionado', 'Archivo válido para importación');
            return true;
        } else {
            setErroresValidacion(validacion.errores);
            setArchivoSeleccionado(null);
            setDatosPreview(null);
            showNotification('error', 'Archivo inválido', validacion.errores.join('; '));
            return false;
        }
    }, [validarArchivo, showNotification]);

    // ========== PREVIEW DE DATOS ==========

    const previsualizarDatos = useCallback(async (archivo) => {
        setLoadingState('preview', true);
        try {
            const reader = new FileReader();

            return new Promise((resolve, reject) => {
                reader.onload = async (e) => {
                    try {
                        const data = e.target.result;

                        // Si es CSV, parsear localmente
                        if (archivo.name.toLowerCase().endsWith('.csv')) {
                            // Parsear CSV básico
                            const lines = data.split('\n');
                            const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
                            const datos = [];

                            for (let i = 1; i < Math.min(11, lines.length); i++) {
                                if (lines[i].trim()) {
                                    const valores = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
                                    const fila = {};
                                    headers.forEach((header, index) => {
                                        fila[header] = valores[index] || '';
                                    });
                                    datos.push(fila);
                                }
                            }

                            const preview = {
                                headers,
                                datos,
                                totalFilas: lines.length - 1,
                                errores: []
                            };

                            setDatosPreview(preview);
                            resolve(preview);
                        } else {
                            // Para Excel, enviar al servidor para procesamiento
                            const formData = new FormData();
                            formData.append('archivo', archivo);
                            formData.append('solo_preview', 'true');

                            const response = await almacenService.procesarImportacionMasiva(formData);

                            if (response.success && response.data.preview) {
                                setDatosPreview(response.data.preview);
                                resolve(response.data.preview);
                            } else {
                                reject(new Error(response.error || 'Error en preview'));
                            }
                        }
                    } catch (error) {
                        reject(error);
                    }
                };

                reader.onerror = () => reject(new Error('Error al leer archivo'));

                if (archivo.name.toLowerCase().endsWith('.csv')) {
                    reader.readAsText(archivo, 'UTF-8');
                } else {
                    reader.readAsArrayBuffer(archivo);
                }
            });

        } catch (error) {
            showNotification('error', 'Error en preview', 'No se pudo previsualizar el archivo');
            return null;
        } finally {
            setLoadingState('preview', false);
        }
    }, [showNotification, setLoadingState]);

    // ========== VALIDACIÓN DE DATOS ==========

    const validarDatosPreview = useCallback((preview) => {
        const errores = [];
        const advertencias = [];
        const config = configuracionImportacion || obtenerConfiguracionImportacion();

        if (!preview || !preview.datos) {
            errores.push('No hay datos para validar');
            return { valido: false, errores, advertencias };
        }

        // Validar headers requeridos
        const headersRequeridos = config.columnasRequeridas;
        const headersFaltantes = headersRequeridos.filter(h =>
            !preview.headers.some(header =>
                header.toLowerCase().includes(h.toLowerCase()) ||
                h.toLowerCase().includes(header.toLowerCase())
            )
        );

        if (headersFaltantes.length > 0) {
            errores.push(`Columnas faltantes: ${headersFaltantes.join(', ')}`);
        }

        // Validar cantidad de registros
        if (preview.totalFilas > config.maxRegistros) {
            errores.push(`Demasiados registros (${preview.totalFilas}). Máximo permitido: ${config.maxRegistros}`);
        }

        if (preview.totalFilas === 0) {
            errores.push('El archivo no contiene datos');
        }

        // Validar datos de muestra
        const datosInvalidos = [];
        preview.datos.forEach((fila, index) => {
            const erroresFila = [];

            // Validar MAC Address si existe
            if (fila.MAC && !almacenService.validarFormatoMAC(fila.MAC)) {
                erroresFila.push('MAC Address inválida');
            }

            // Validar códigos requeridos
            headersRequeridos.forEach(campo => {
                const valor = fila[campo] || fila[campo.toLowerCase()] || fila[campo.toUpperCase()];
                if (!valor || valor.toString().trim() === '') {
                    erroresFila.push(`${campo} es requerido`);
                }
            });

            if (erroresFila.length > 0) {
                datosInvalidos.push(`Fila ${index + 2}: ${erroresFila.join(', ')}`);
            }
        });

        if (datosInvalidos.length > 0) {
            if (datosInvalidos.length <= 5) {
                errores.push(...datosInvalidos);
            } else {
                errores.push(`${datosInvalidos.length} filas con errores (mostrando primeras 5)`);
                errores.push(...datosInvalidos.slice(0, 5));
            }
        }

        // Advertencias
        if (preview.totalFilas > 500) {
            advertencias.push('Archivo grande: La importación puede tomar varios minutos');
        }

        if (preview.totalFilas > 100 && datosInvalidos.length > preview.totalFilas * 0.1) {
            advertencias.push('Alto porcentaje de errores detectado');
        }

        return {
            valido: errores.length === 0,
            errores,
            advertencias
        };
    }, [configuracionImportacion, obtenerConfiguracionImportacion]);

    // ========== PROCESAMIENTO ==========

    const procesarImportacion = useCallback(async (archivo, opciones = {}) => {
        setLoadingState('importar', true);

        // Configurar estado de procesamiento
        const procesamientoId = Date.now();
        setEstadosProcesamiento(prev => ({
            ...prev,
            [procesamientoId]: {
                estado: 'iniciando',
                progreso: 0,
                mensaje: 'Iniciando importación...'
            }
        }));

        try {
            const formData = new FormData();
            formData.append('archivo', archivo);

            // Opciones adicionales
            Object.keys(opciones).forEach(key => {
                if (opciones[key] !== null && opciones[key] !== undefined) {
                    formData.append(key, opciones[key]);
                }
            });

            // Actualizar progreso
            setEstadosProcesamiento(prev => ({
                ...prev,
                [procesamientoId]: {
                    estado: 'procesando',
                    progreso: 10,
                    mensaje: 'Procesando archivo...'
                }
            }));

            const response = await almacenService.procesarImportacionMasiva(formData);

            if (response.success) {
                setResultadoImportacion(response.data);

                const { procesados = 0, errores = [], advertencias = [] } = response.data;

                // Actualizar progreso completo
                setEstadosProcesamiento(prev => ({
                    ...prev,
                    [procesamientoId]: {
                        estado: 'completado',
                        progreso: 100,
                        mensaje: 'Importación completada'
                    }
                }));

                if (errores.length > 0) {
                    showNotification('warning', 'Importación completada con errores',
                        `${procesados} registros procesados, ${errores.length} errores`
                    );
                } else {
                    showNotification('success', 'Importación exitosa',
                        `${procesados} registros procesados correctamente`
                    );
                }

                return response.data;
            } else {
                // Actualizar estado de error
                setEstadosProcesamiento(prev => ({
                    ...prev,
                    [procesamientoId]: {
                        estado: 'error',
                        progreso: 0,
                        mensaje: response.error
                    }
                }));

                showNotification('error', 'Error en importación', response.error);
                return null;
            }
        } catch (error) {
            setEstadosProcesamiento(prev => ({
                ...prev,
                [procesamientoId]: {
                    estado: 'error',
                    progreso: 0,
                    mensaje: error.message
                }
            }));

            showNotification('error', 'Error inesperado', 'Error durante la importación');
            return null;
        } finally {
            setLoadingState('importar', false);

            // Limpiar estado de procesamiento después de un tiempo
            setTimeout(() => {
                setEstadosProcesamiento(prev => {
                    const { [procesamientoId]: removed, ...rest } = prev;
                    return rest;
                });
            }, 30000);
        }
    }, [showNotification, setLoadingState]);

    const procesarConValidacion = useCallback(async (archivo, opciones = {}) => {
        // Primero previsualizar y validar
        const preview = await previsualizarDatos(archivo);
        if (!preview) {
            return { success: false, error: 'Error en preview' };
        }

        const validacion = validarDatosPreview(preview);

        if (!validacion.valido && !opciones.forzar) {
            setErroresValidacion(validacion.errores);
            showNotification('error', 'Datos inválidos',
                'Corrija los errores antes de continuar o use la opción forzar'
            );
            return {
                success: false,
                errores: validacion.errores,
                advertencias: validacion.advertencias,
                preview
            };
        }

        // Si hay solo advertencias, mostrarlas pero continuar
        if (validacion.advertencias.length > 0) {
            validacion.advertencias.forEach(advertencia => {
                showNotification('info', 'Advertencia', advertencia);
            });
        }

        // Procesar importación
        const resultado = await procesarImportacion(archivo, opciones);
        return { success: !!resultado, data: resultado };
    }, [previsualizarDatos, validarDatosPreview, procesarImportacion, showNotification]);

    // ========== GESTIÓN DE RESULTADOS ==========

    const exportarResultados = useCallback(async (formato = 'csv') => {
        if (!resultadoImportacion) {
            showNotification('warning', 'Sin resultados', 'No hay resultados de importación para exportar');
            return false;
        }

        try {
            let contenido;
            let filename;
            let mimeType;

            if (formato === 'csv') {
                const headers = ['Fila', 'Estado', 'Mensaje', 'Datos'];
                const filas = (resultadoImportacion.detalles || []).map(detalle => [
                    detalle.fila || 'N/A',
                    detalle.estado || 'N/A',
                    detalle.mensaje || '',
                    JSON.stringify(detalle.datos || {})
                ]);

                contenido = [headers, ...filas]
                    .map(fila => fila.map(campo => `"${String(campo).replace(/"/g, '""')}"`).join(','))
                    .join('\n');
                filename = `resultado_importacion_${new Date().toISOString().split('T')[0]}.csv`;
                mimeType = 'text/csv;charset=utf-8';
            } else if (formato === 'json') {
                contenido = JSON.stringify(resultadoImportacion, null, 2);
                filename = `resultado_importacion_${new Date().toISOString().split('T')[0]}.json`;
                mimeType = 'application/json';
            } else {
                throw new Error('Formato no soportado');
            }

            // Descargar archivo
            const blob = new Blob([contenido], { type: mimeType });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            showNotification('success', 'Éxito', 'Resultados exportados correctamente');
            return true;
        } catch (error) {
            showNotification('error', 'Error al exportar', 'No se pudieron exportar los resultados');
            return false;
        }
    }, [resultadoImportacion, showNotification]);

    const limpiarResultados = useCallback(() => {
        setResultadoImportacion(null);
        setArchivoSeleccionado(null);
        setDatosPreview(null);
        setErroresValidacion([]);
        setEstadosProcesamiento({});
    }, []);

    // ========== ANÁLISIS DE RESULTADOS ==========

    const analizarResultados = useCallback((resultado) => {
        if (!resultado) return null;

        const analisis = {
            resumen: {
                total: resultado.total_procesados || 0,
                exitosos: resultado.exitosos || 0,
                errores: resultado.errores_count || (resultado.errores ? resultado.errores.length : 0),
                advertencias: resultado.advertencias_count || (resultado.advertencias ? resultado.advertencias.length : 0)
            },
            porcentajes: {
                exito: 0,
                error: 0
            },
            tiempos: {
                procesamiento: resultado.tiempo_procesamiento || 0,
                promedio_por_registro: 0
            },
            categorias_errores: {},
            tipos_materiales: {},
            almacenes_destino: {}
        };

        // Calcular porcentajes
        if (analisis.resumen.total > 0) {
            analisis.porcentajes.exito = Math.round((analisis.resumen.exitosos / analisis.resumen.total) * 100);
            analisis.porcentajes.error = Math.round((analisis.resumen.errores / analisis.resumen.total) * 100);
            analisis.tiempos.promedio_por_registro = analisis.tiempos.procesamiento / analisis.resumen.total;
        }

        // Analizar categorías de errores
        if (resultado.detalles) {
            resultado.detalles
                .filter(d => d.estado === 'error')
                .forEach(detalle => {
                    const categoria = detalle.categoria_error || 'General';
                    analisis.categorias_errores[categoria] = (analisis.categorias_errores[categoria] || 0) + 1;
                });

            // Analizar tipos de materiales procesados
            resultado.detalles
                .filter(d => d.estado === 'success' && d.datos)
                .forEach(detalle => {
                    const tipoMaterial = detalle.datos.tipo_material || 'No especificado';
                    analisis.tipos_materiales[tipoMaterial] = (analisis.tipos_materiales[tipoMaterial] || 0) + 1;
                });

            // Analizar distribución por almacén
            resultado.detalles
                .filter(d => d.estado === 'success' && d.datos)
                .forEach(detalle => {
                    const almacen = detalle.datos.almacen_destino || 'No especificado';
                    analisis.almacenes_destino[almacen] = (analisis.almacenes_destino[almacen] || 0) + 1;
                });
        }

        return analisis;
    }, []);

    // ========== UTILIDADES ==========

    const formatearMAC = useCallback((mac) => {
        return almacenService.formatMACAddress(mac);
    }, []);

    const obtenerEjemplos = useCallback(() => {
        const config = configuracionImportacion || obtenerConfiguracionImportacion();
        return config.ejemplos;
    }, [configuracionImportacion, obtenerConfiguracionImportacion]);

    // ========== HISTORIAL DE IMPORTACIONES ==========

    const guardarHistorial = useCallback((resultado) => {
        if (!resultado) return;

        try {
            const historial = JSON.parse(localStorage.getItem('historial_importaciones') || '[]');

            const entrada = {
                id: Date.now(),
                fecha: new Date().toISOString(),
                archivo: archivoSeleccionado?.name || 'Desconocido',
                tamaño: archivoSeleccionado?.size || 0,
                resultado: {
                    total: resultado.total_procesados || 0,
                    exitosos: resultado.exitosos || 0,
                    errores: resultado.errores_count || (resultado.errores ? resultado.errores.length : 0),
                    advertencias: resultado.advertencias_count || (resultado.advertencias ? resultado.advertencias.length : 0)
                },
                duracion: resultado.tiempo_procesamiento || 0,
                usuario: resultado.usuario || 'Sistema'
            };

            historial.unshift(entrada);

            // Mantener solo las últimas 50 importaciones
            const historialLimitado = historial.slice(0, 50);
            localStorage.setItem('historial_importaciones', JSON.stringify(historialLimitado));

            setHistorialImportaciones(historialLimitado);
        } catch (error) {
            console.error('Error al guardar historial:', error);
        }
    }, [archivoSeleccionado]);

    const obtenerHistorial = useCallback(() => {
        try {
            const historial = JSON.parse(localStorage.getItem('historial_importaciones') || '[]');
            setHistorialImportaciones(historial);
            return historial;
        } catch (error) {
            console.error('Error al obtener historial:', error);
            return [];
        }
    }, []);

    // ========== EFECTOS ==========

    useEffect(() => {
        // Inicializar configuración al montar el componente
        obtenerConfiguracionImportacion();
        obtenerHistorial();
    }, [obtenerConfiguracionImportacion, obtenerHistorial]);

    useEffect(() => {
        // Guardar resultado en historial cuando se complete una importación
        if (resultadoImportacion) {
            guardarHistorial(resultadoImportacion);
        }
    }, [resultadoImportacion, guardarHistorial]);

    // ========== RETURN ==========

    return {
        // Estado
        plantillaData,
        resultadoImportacion,
        archivoSeleccionado,
        datosPreview,
        erroresValidacion,
        configuracionImportacion,
        historialImportaciones,
        estadosProcesamiento,
        loading,
        notificaciones, // Temporal hasta implementar sistema completo

        // Configuración
        obtenerConfiguracionImportacion,

        // Plantilla
        descargarPlantilla,
        obtenerPlantillaData,

        // Validación de archivos
        validarArchivo,
        seleccionarArchivo,

        // Preview
        previsualizarDatos,
        validarDatosPreview,

        // Procesamiento
        procesarImportacion,
        procesarConValidacion,

        // Gestión de resultados
        exportarResultados,
        limpiarResultados,
        analizarResultados,

        // Utilidades
        formatearMAC,
        obtenerEjemplos,

        // Historial
        obtenerHistorial,

        // Funciones auxiliares para componentes
        showNotification,
        setLoadingState,

        // Setters para casos específicos
        setArchivoSeleccionado,
        setDatosPreview,
        setResultadoImportacion,
        setErroresValidacion,
        setHistorialImportaciones
    };
};

export default useImportacion;