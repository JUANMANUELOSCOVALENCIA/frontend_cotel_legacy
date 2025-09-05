// ======================================================
// src/features/almacenes/hooks/useAlmacenExport.js
// Hook especializado para exportación de almacenes
// ======================================================

import { useState, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';

export const useAlmacenExport = ({ almacenes = [], filtros = {} }) => {
    const [configuracionExport, setConfiguracionExport] = useState({
        formato: 'csv', // 'csv', 'excel', 'pdf'
        incluirEstadisticas: false,
        incluirHistorial: false,
        incluirConfiguracion: false,
        columnas: ['codigo', 'nombre', 'tipo', 'ciudad', 'estado', 'materiales', 'capacidad'],
        filtrarPor: 'todos', // 'todos', 'seleccionados', 'filtrados'
        nombreArchivo: '',
        incluirFecha: true
    });

    const [historialExportaciones, setHistorialExportaciones] = useState([]);

    // Columnas disponibles para exportación
    const columnasDisponibles = useMemo(() => [
        { key: 'codigo', label: 'Código', tipo: 'texto', requerido: true },
        { key: 'nombre', label: 'Nombre', tipo: 'texto', requerido: true },
        { key: 'tipo', label: 'Tipo', tipo: 'texto' },
        { key: 'ciudad', label: 'Ciudad', tipo: 'texto' },
        { key: 'estado', label: 'Estado', tipo: 'booleano' },
        { key: 'es_principal', label: 'Es Principal', tipo: 'booleano' },
        { key: 'materiales', label: 'Total Materiales', tipo: 'numero' },
        { key: 'capacidad', label: 'Capacidad', tipo: 'numero' },
        { key: 'utilizacion', label: 'Utilización (%)', tipo: 'porcentaje' },
        { key: 'direccion', label: 'Dirección', tipo: 'texto' },
        { key: 'telefono', label: 'Teléfono', tipo: 'texto' },
        { key: 'email', label: 'Email', tipo: 'texto' },
        { key: 'responsable', label: 'Responsable', tipo: 'texto' },
        { key: 'created_at', label: 'Fecha Creación', tipo: 'fecha' },
        { key: 'updated_at', label: 'Última Modificación', tipo: 'fecha' },
        { key: 'observaciones', label: 'Observaciones', tipo: 'texto' }
    ], []);

    // Actualizar configuración
    const actualizarConfiguracion = useCallback((nuevaConfig) => {
        setConfiguracionExport(prev => ({ ...prev, ...nuevaConfig }));
    }, []);

    // Toggle columna
    const toggleColumna = useCallback((columna) => {
        setConfiguracionExport(prev => ({
            ...prev,
            columnas: prev.columnas.includes(columna)
                ? prev.columnas.filter(c => c !== columna)
                : [...prev.columnas, columna]
        }));
    }, []);

    // Procesar datos para exportación
    const procesarDatosParaExporte = useCallback((almacenesParaExportar) => {
        return almacenesParaExportar.map(almacen => {
            const fila = {};

            configuracionExport.columnas.forEach(columna => {
                const config = columnasDisponibles.find(c => c.key === columna);
                if (!config) return;

                const etiqueta = config.label;
                let valor = almacen[columna];

                // Formatear según el tipo de dato
                switch (config.tipo) {
                    case 'booleano':
                        if (columna === 'estado') {
                            valor = almacen.activo ? 'Activo' : 'Inactivo';
                        } else {
                            valor = valor ? 'Sí' : 'No';
                        }
                        break;

                    case 'numero':
                        valor = valor || 0;
                        if (columna === 'materiales') {
                            valor = almacen.total_materiales || 0;
                        }
                        break;

                    case 'porcentaje':
                        if (columna === 'utilizacion' && almacen.capacidad && almacen.total_materiales) {
                            valor = Math.round((almacen.total_materiales / almacen.capacidad) * 100);
                        } else {
                            valor = 0;
                        }
                        break;

                    case 'fecha':
                        valor = valor ? new Date(valor).toLocaleDateString('es-BO') : '';
                        break;

                    default:
                        valor = valor || '';
                }

                fila[etiqueta] = valor;
            });

            // Agregar estadísticas si está habilitado
            if (configuracionExport.incluirEstadisticas && almacen.estadisticas) {
                fila['Disponibles'] = almacen.estadisticas.disponibles || 0;
                fila['Asignados'] = almacen.estadisticas.asignados || 0;
                fila['En Laboratorio'] = almacen.estadisticas.en_laboratorio || 0;
                fila['Defectuosos'] = almacen.estadisticas.defectuosos || 0;
                fila['Valor Total'] = almacen.estadisticas.valor_total || 0;
            }

            return fila;
        });
    }, [configuracionExport, columnasDisponibles]);

    // Exportar a CSV
    const exportarCSV = useCallback((datos, nombreArchivo) => {
        if (!datos || datos.length === 0) {
            toast.error('No hay datos para exportar');
            return false;
        }

        try {
            const headers = Object.keys(datos[0]);
            const csv = [
                headers.join(','),
                ...datos.map(fila =>
                    headers.map(header => {
                        const valor = fila[header] || '';
                        return `"${valor.toString().replace(/"/g, '""')}"`;
                    }).join(',')
                )
            ].join('\n');

            // Agregar BOM para UTF-8
            const csvConBOM = '\ufeff' + csv;
            const blob = new Blob([csvConBOM], { type: 'text/csv;charset=utf-8;' });

            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', nombreArchivo);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            return true;
        } catch (error) {
            console.error('Error exportando CSV:', error);
            toast.error('Error al generar archivo CSV');
            return false;
        }
    }, []);

    // Generar nombre de archivo
    const generarNombreArchivo = useCallback(() => {
        const fecha = new Date().toISOString().split('T')[0];
        const hora = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');

        let nombre = configuracionExport.nombreArchivo || 'almacenes';

        // Agregar información de filtros si los hay
        if (Object.keys(filtros).length > 0) {
            nombre += '_filtrado';
        }

        if (configuracionExport.incluirFecha) {
            nombre += `_${fecha}`;
        }

        return `${nombre}.${configuracionExport.formato}`;
    }, [configuracionExport, filtros]);

    // Exportar almacenes principales
    const exportarAlmacenes = useCallback(async (almacenesSeleccionados = null) => {
        try {
            let datosParaExportar = almacenesSeleccionados || almacenes;

            // Aplicar filtro de configuración
            switch (configuracionExport.filtrarPor) {
                case 'seleccionados':
                    if (!almacenesSeleccionados || almacenesSeleccionados.length === 0) {
                        toast.error('No hay almacenes seleccionados para exportar');
                        return false;
                    }
                    datosParaExportar = almacenesSeleccionados;
                    break;

                case 'filtrados':
                    // Los datos ya vienen filtrados
                    break;

                case 'todos':
                default:
                    datosParaExportar = almacenes;
                    break;
            }

            if (!datosParaExportar || datosParaExportar.length === 0) {
                toast.error('No hay datos para exportar');
                return false;
            }

            const datosFormateados = procesarDatosParaExporte(datosParaExportar);
            const nombreArchivo = generarNombreArchivo();

            let exitoso = false;

            switch (configuracionExport.formato) {
                case 'csv':
                    exitoso = exportarCSV(datosFormateados, nombreArchivo);
                    break;

                case 'excel':
                    // Por ahora usar CSV como fallback
                    exitoso = exportarCSV(datosFormateados, nombreArchivo.replace('.excel', '.csv'));
                    toast.info('Exportado como CSV. Función Excel en desarrollo');
                    break;

                case 'pdf':
                    // Por ahora usar CSV como fallback
                    exitoso = exportarCSV(datosFormateados, nombreArchivo.replace('.pdf', '.csv'));
                    toast.info('Exportado como CSV. Función PDF en desarrollo');
                    break;

                default:
                    exitoso = exportarCSV(datosFormateados, nombreArchivo);
            }

            if (exitoso) {
                // Guardar en historial
                guardarExportacionEnHistorial({
                    fecha: new Date().toISOString(),
                    formato: configuracionExport.formato,
                    archivo: nombreArchivo,
                    registros: datosParaExportar.length,
                    filtros: Object.keys(filtros).length > 0 ? filtros : null
                });

                toast.success(`${datosParaExportar.length} almacenes exportados exitosamente`);
            }

            return exitoso;

        } catch (error) {
            console.error('Error en exportación:', error);
            toast.error('Error al exportar almacenes');
            return false;
        }
    }, [almacenes, configuracionExport, filtros, procesarDatosParaExporte, generarNombreArchivo, exportarCSV]);

    // Descargar plantilla de importación
    const descargarPlantillaImportacion = useCallback(() => {
        const plantillaEjemplo = [
            {
                'Código': 'ALM-001',
                'Nombre': 'Almacén Central La Paz',
                'Tipo': 'CENTRAL',
                'Ciudad': 'La Paz',
                'Dirección': 'Av. Ejemplo 123, Zona Central',
                'Teléfono': '+591 2 1234567',
                'Email': 'almacen.central@cotel.com.bo',
                'Responsable': 'Juan Pérez López',
                'Capacidad': '1000',
                'Es Principal': 'Sí',
                'Activo': 'Sí',
                'Observaciones': 'Almacén principal de la región La Paz'
            },
            {
                'Código': 'ALM-002',
                'Nombre': 'Almacén Regional Santa Cruz',
                'Tipo': 'REGIONAL',
                'Ciudad': 'Santa Cruz de la Sierra',
                'Dirección': 'Av. Segundo Anillo 456',
                'Teléfono': '+591 3 7654321',
                'Email': 'almacen.scz@cotel.com.bo',
                'Responsable': 'María García',
                'Capacidad': '500',
                'Es Principal': 'No',
                'Activo': 'Sí',
                'Observaciones': 'Almacén regional para el oriente'
            }
        ];

        const exito = exportarCSV(plantillaEjemplo, 'plantilla_importacion_almacenes.csv');

        if (exito) {
            toast.success('Plantilla de importación descargada');
        }

        return exito;
    }, [exportarCSV]);

    // Exportar reporte detallado
    const exportarReporteDetallado = useCallback(async (almacenesParaReporte = null) => {
        try {
            const datosAlmacenes = almacenesParaReporte || almacenes;

            if (!datosAlmacenes || datosAlmacenes.length === 0) {
                toast.error('No hay datos para el reporte');
                return false;
            }

            // Preparar datos del reporte
            const datosReporte = [];

            // Resumen ejecutivo
            const resumenEjecutivo = {
                'RESUMEN EJECUTIVO': '',
                'Total de Almacenes': datosAlmacenes.length,
                'Almacenes Activos': datosAlmacenes.filter(a => a.activo).length,
                'Almacenes Inactivos': datosAlmacenes.filter(a => !a.activo).length,
                'Almacén Principal': datosAlmacenes.find(a => a.es_principal)?.codigo || 'No definido',
                'Total Materiales': datosAlmacenes.reduce((sum, a) => sum + (a.total_materiales || 0), 0),
                'Capacidad Total': datosAlmacenes.reduce((sum, a) => sum + (a.capacidad || 0), 0),
                'Fecha del Reporte': new Date().toLocaleDateString('es-BO'),
                '': ''
            };

            datosReporte.push(resumenEjecutivo);

            // Distribución por tipo
            const distribucionTipo = datosAlmacenes.reduce((acc, almacen) => {
                acc[almacen.tipo] = (acc[almacen.tipo] || 0) + 1;
                return acc;
            }, {});

            Object.entries(distribucionTipo).forEach(([tipo, cantidad]) => {
                datosReporte.push({
                    'DISTRIBUCIÓN POR TIPO': '',
                    'Tipo': tipo,
                    'Cantidad': cantidad,
                    'Porcentaje': `${Math.round((cantidad / datosAlmacenes.length) * 100)}%`,
                    '': '',
                    ' ': '',
                    '  ': '',
                    '   ': ''
                });
            });

            // Agregar línea vacía
            datosReporte.push({});

            // Detalles de cada almacén
            datosReporte.push({
                'DETALLE DE ALMACENES': '',
                '': '',
                ' ': '',
                '  ': '',
                '   ': '',
                '    ': '',
                '     ': '',
                '      ': ''
            });

            const almacenesDetallados = procesarDatosParaExporte(datosAlmacenes);
            datosReporte.push(...almacenesDetallados);

            const nombreArchivo = `reporte_detallado_almacenes_${new Date().toISOString().split('T')[0]}.csv`;
            const exito = exportarCSV(datosReporte, nombreArchivo);

            if (exito) {
                toast.success('Reporte detallado generado exitosamente');
            }

            return exito;

        } catch (error) {
            console.error('Error generando reporte:', error);
            toast.error('Error al generar reporte detallado');
            return false;
        }
    }, [almacenes, procesarDatosParaExporte, exportarCSV]);

    // Exportar configuración de almacenes
    const exportarConfiguracion = useCallback(() => {
        try {
            const configuracion = almacenes.map(almacen => ({
                'Código': almacen.codigo,
                'Configuración Principal': almacen.es_principal ? 'Sí' : 'No',
                'Estado': almacen.activo ? 'Activo' : 'Inactivo',
                'Tipo': almacen.tipo,
                'Capacidad Configurada': almacen.capacidad || 'No definida',
                'Alertas de Capacidad': almacen.configuracion?.alertas_capacidad || '80%',
                'Notificaciones Email': almacen.configuracion?.alertas_email ? 'Habilitadas' : 'Deshabilitadas',
                'Backup Automático': almacen.configuracion?.backup_automatico ? 'Sí' : 'No',
                'Sincronización': almacen.configuracion?.sincronizacion_activa ? 'Activa' : 'Inactiva'
            }));

            const nombreArchivo = `configuracion_almacenes_${new Date().toISOString().split('T')[0]}.csv`;
            const exito = exportarCSV(configuracion, nombreArchivo);

            if (exito) {
                toast.success('Configuración exportada exitosamente');
            }

            return exito;
        } catch (error) {
            console.error('Error exportando configuración:', error);
            toast.error('Error al exportar configuración');
            return false;
        }
    }, [almacenes, exportarCSV]);

    // Guardar exportación en historial
    const guardarExportacionEnHistorial = useCallback((exportacion) => {
        const nuevaExportacion = {
            id: Date.now(),
            ...exportacion
        };

        setHistorialExportaciones(prev => {
            const nuevoHistorial = [nuevaExportacion, ...prev.slice(0, 19)]; // Mantener últimas 20

            try {
                localStorage.setItem('historial_exportaciones_almacenes', JSON.stringify(nuevoHistorial));
            } catch (error) {
                console.warn('No se pudo guardar el historial de exportaciones:', error);
            }

            return nuevoHistorial;
        });
    }, []);

    // Cargar historial de exportaciones
    const cargarHistorialExportaciones = useCallback(() => {
        try {
            const historial = JSON.parse(localStorage.getItem('historial_exportaciones_almacenes') || '[]');
            setHistorialExportaciones(historial);
        } catch (error) {
            console.error('Error cargando historial de exportaciones:', error);
            setHistorialExportaciones([]);
        }
    }, []);

    // Repetir exportación del historial
    const repetirExportacion = useCallback(async (exportacionHistorial) => {
        const configAnterior = configuracionExport;

        // Aplicar configuración de la exportación anterior
        setConfiguracionExport(prev => ({
            ...prev,
            formato: exportacionHistorial.formato,
            columnas: exportacionHistorial.columnas || prev.columnas
        }));

        // Aplicar filtros si los había
        if (exportacionHistorial.filtros) {
            aplicarFiltros(exportacionHistorial.filtros);

            // Esperar un momento para que se apliquen los filtros
            setTimeout(async () => {
                await exportarAlmacenes();
                // Restaurar configuración anterior
                setConfiguracionExport(configAnterior);
            }, 100);
        } else {
            await exportarAlmacenes();
            setConfiguracionExport(configAnterior);
        }
    }, [configuracionExport, exportarAlmacenes]);

    // Presets de exportación comunes
    const aplicarPresetExportacion = useCallback((preset) => {
        const presets = {
            'resumen_ejecutivo': {
                columnas: ['codigo', 'nombre', 'tipo', 'ciudad', 'estado', 'materiales'],
                incluirEstadisticas: false,
                nombreArchivo: 'resumen_almacenes'
            },
            'inventario_completo': {
                columnas: ['codigo', 'nombre', 'tipo', 'ciudad', 'capacidad', 'materiales', 'utilizacion', 'estado'],
                incluirEstadisticas: true,
                nombreArchivo: 'inventario_almacenes'
            },
            'configuracion_sistema': {
                columnas: ['codigo', 'nombre', 'tipo', 'es_principal', 'estado', 'capacidad'],
                incluirConfiguracion: true,
                nombreArchivo: 'configuracion_almacenes'
            },
            'auditoria': {
                columnas: ['codigo', 'nombre', 'tipo', 'ciudad', 'responsable', 'created_at', 'updated_at'],
                incluirHistorial: true,
                nombreArchivo: 'auditoria_almacenes'
            }
        };

        const presetConfig = presets[preset];
        if (presetConfig) {
            setConfiguracionExport(prev => ({ ...prev, ...presetConfig }));
            toast.success(`Preset "${preset}" aplicado`);
        }
    }, []);

    // Estadísticas de exportación
    const estadisticasExportacion = useMemo(() => {
        if (!almacenes || almacenes.length === 0) {
            return {
                totalRegistros: 0,
                registrosFiltrados: 0,
                tamañoEstimado: '0 KB',
                tiempoEstimado: '< 1 seg'
            };
        }

        const registrosFiltrados = almacenes.length;
        const columnasSeleccionadas = configuracionExport.columnas.length;

        // Estimación de tamaño (muy aproximada)
        const bytesPromedioPorCelda = 20;
        const tamañoEstimadoBytes = registrosFiltrados * columnasSeleccionadas * bytesPromedioPorCelda;

        let tamañoFormateado;
        if (tamañoEstimadoBytes < 1024) {
            tamañoFormateado = `${tamañoEstimadoBytes} B`;
        } else if (tamañoEstimadoBytes < 1024 * 1024) {
            tamañoFormateado = `${Math.round(tamañoEstimadoBytes / 1024)} KB`;
        } else {
            tamañoFormateado = `${Math.round(tamañoEstimadoBytes / (1024 * 1024))} MB`;
        }

        // Estimación de tiempo (muy aproximada)
        const tiempoEstimadoSegundos = Math.max(1, Math.ceil(registrosFiltrados / 1000));
        const tiempoFormateado = tiempoEstimadoSegundos < 60
            ? `${tiempoEstimadoSegundos} seg`
            : `${Math.ceil(tiempoEstimadoSegundos / 60)} min`;

        return {
            totalRegistros: almacenes.length,
            registrosFiltrados,
            tamañoEstimado: tamañoFormateado,
            tiempoEstimado: tiempoFormateado,
            columnasSeleccionadas: columnasSeleccionadas
        };
    }, [almacenes, configuracionExport.columnas]);

    // Validar configuración de exportación
    const validarConfiguracionExport = useCallback(() => {
        const errores = [];

        if (configuracionExport.columnas.length === 0) {
            errores.push('Debe seleccionar al menos una columna');
        }

        const columnasRequeridas = columnasDisponibles.filter(c => c.requerido).map(c => c.key);
        const faltanRequeridas = columnasRequeridas.filter(col => !configuracionExport.columnas.includes(col));

        if (faltanRequeridas.length > 0) {
            errores.push(`Faltan columnas requeridas: ${faltanRequeridas.join(', ')}`);
        }

        if (!['csv', 'excel', 'pdf'].includes(configuracionExport.formato)) {
            errores.push('Formato de exportación no válido');
        }

        return {
            valido: errores.length === 0,
            errores
        };
    }, [configuracionExport, columnasDisponibles]);

    // Previsualizar exportación
    const previsualizarExportacion = useCallback((almacenesParaPreview = null) => {
        try {
            const datosAlmacenes = almacenesParaPreview || almacenes.slice(0, 5); // Solo primeros 5 para preview
            const datosFormateados = procesarDatosParaExporte(datosAlmacenes);

            return {
                exito: true,
                datos: datosFormateados,
                cantidad: datosAlmacenes.length,
                columnas: Object.keys(datosFormateados[0] || {}),
                esLimitado: datosAlmacenes.length < almacenes.length
            };
        } catch (error) {
            console.error('Error en preview:', error);
            return {
                exito: false,
                error: 'Error al generar preview'
            };
        }
    }, [almacenes, procesarDatosParaExporte]);

    // Cargar historial al inicializar
    useEffect(() => {
        cargarHistorialExportaciones();
    }, [cargarHistorialExportaciones]);

    return {
        // Configuración
        configuracionExport,
        columnasDisponibles,
        actualizarConfiguracion,
        toggleColumna,

        // Exportación principal
        exportarAlmacenes,
        exportarReporteDetallado,
        exportarConfiguracion,
        descargarPlantillaImportacion,

        // Validación y preview
        validarConfiguracionExport,
        previsualizarExportacion,
        estadisticasExportacion,

        // Historial
        historialExportaciones,
        repetirExportacion,
        cargarHistorialExportaciones,

        // Presets
        aplicarPresetExportacion,

        // Utilidades
        generarNombreArchivo,
        procesarDatosParaExporte,
        exportarCSV
    };
};

export default useAlmacenExport;