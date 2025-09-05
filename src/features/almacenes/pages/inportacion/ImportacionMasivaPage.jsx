import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const ImportacionMasivaPage = () => {
    // Estados principales
    const [archivo, setArchivo] = useState(null);
    const [progreso, setProgreso] = useState(0);
    const [estado, setEstado] = useState('inicial'); // inicial, procesando, completado, error
    const [datosPreview, setDatosPreview] = useState(null);
    const [loteSeleccionado, setLoteSeleccionado] = useState('');
    const [almacenDestino, setAlmacenDestino] = useState('');
    const [datosCompletos, setDatosCompletos] = useState(null);

    // Estados adicionales para drag & drop
    const [arrastrando, setArrastrando] = useState(false);
    const [procesandoArchivo, setProcesandoArchivo] = useState(false);

    // Estados para paginación
    const [paginaActual, setPaginaActual] = useState(1);
    const [registrosPorPagina, setRegistrosPorPagina] = useState(10);
    const [mostrarTodosLosRegistros, setMostrarTodosLosRegistros] = useState(false);

    // Datos de ejemplo para la demo
    const lotesDisponibles = [
        { id: 1, numero: 'LOTE-2024-001', proveedor: 'HUAWEI', estado: 'ACTIVO' },
        { id: 2, numero: 'LOTE-2024-002', proveedor: 'ZTE', estado: 'ACTIVO' },
        { id: 3, numero: 'LOTE-2024-003', proveedor: 'NOKIA', estado: 'ACTIVO' },
        { id: 4, numero: 'LOTE-2024-004', proveedor: 'LANLY', estado: 'ACTIVO' }
    ];

    const almacenes = [
        { id: 1, nombre: 'Almacén Central Oruro', codigo: 'ALO-001' },
        { id: 2, nombre: 'Almacén El Alto', codigo: 'AEA-001' },
        { id: 3, nombre: 'Almacén Miraflores', codigo: 'AMR-001' }
    ];

    // Función para leer archivo Excel/CSV
    const leerArchivo = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = e.target.result;
                    let workbook;

                    if (file.name.endsWith('.csv')) {
                        // Para archivos CSV
                        workbook = XLSX.read(data, { type: 'string' });
                    } else {
                        // Para archivos Excel
                        workbook = XLSX.read(data, { type: 'binary' });
                    }

                    // Obtener la primera hoja
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];

                    // Convertir a JSON
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                    resolve(jsonData);
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => reject(new Error('Error al leer el archivo'));

            if (file.name.endsWith('.csv')) {
                reader.readAsText(file);
            } else {
                reader.readAsBinaryString(file);
            }
        });
    };

    // Procesar datos del archivo
    const procesarDatosArchivo = (jsonData) => {
        if (jsonData.length === 0) {
            throw new Error('El archivo está vacío');
        }

        // Obtener headers (primera fila)
        const headers = jsonData[0];
        const filas = jsonData.slice(1);

        // Filtrar filas vacías
        const filasValidas = filas.filter(fila =>
            fila && fila.length > 0 && fila.some(celda => celda && celda.toString().trim() !== '')
        );

        // Convertir filas a objetos
        const datos = filasValidas.map((fila, index) => {
            const objeto = {};
            headers.forEach((header, headerIndex) => {
                if (header) {
                    objeto[header] = fila[headerIndex] || '';
                }
            });
            objeto.fila = index + 2; // +2 porque empezamos desde la fila 2 (después del header)
            return objeto;
        });

        return {
            headers,
            datos,
            totalFilas: datos.length
        };
    };

    // Manejo de archivos
    const manejarArchivo = async (file) => {
        // Validar archivo
        const extensionesValidas = ['.xlsx', '.xls', '.csv'];
        const extension = '.' + file.name.split('.').pop().toLowerCase();

        if (!extensionesValidas.includes(extension)) {
            alert('Formato de archivo no válido. Use: .xlsx, .xls, .csv');
            return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB
            alert('El archivo es demasiado grande. Máximo 10MB');
            return;
        }

        setArchivo(file);
        setProcesandoArchivo(true);
        setDatosPreview(null);
        setDatosCompletos(null);

        try {
            // Leer archivo
            const datosArchivo = await leerArchivo(file);

            // Procesar datos
            const datosProcesados = procesarDatosArchivo(datosArchivo);

            // Guardar datos completos
            setDatosCompletos(datosProcesados);

            // Crear preview con los primeros registros
            const muestra = datosProcesados.datos.slice(0, 5);

            setDatosPreview({
                totalFilas: datosProcesados.totalFilas,
                validas: datosProcesados.totalFilas, // Por ahora todas son válidas
                errores: 0, // Sin validación por ahora
                muestra: muestra,
                headers: datosProcesados.headers
            });

        } catch (error) {
            console.error('Error al procesar archivo:', error);
            alert('Error al procesar el archivo: ' + error.message);
        } finally {
            setProcesandoArchivo(false);
        }
    };

    // Manejo del input de archivo
    const manejarInputArchivo = (event) => {
        const file = event.target.files[0];
        if (file) {
            manejarArchivo(file);
        }
    };

    // Drag & Drop handlers
    const manejarDragOver = (e) => {
        e.preventDefault();
        setArrastrando(true);
    };

    const manejarDragLeave = (e) => {
        e.preventDefault();
        setArrastrando(false);
    };

    const manejarDrop = (e) => {
        e.preventDefault();
        setArrastrando(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            manejarArchivo(files[0]);
        }
    };

    // Procesar importación
    const procesarImportacion = () => {
        setEstado('procesando');
        setProgreso(0);

        // Simular progreso
        const intervalo = setInterval(() => {
            setProgreso(prev => {
                if (prev >= 100) {
                    clearInterval(intervalo);
                    setEstado('completado');
                    return 100;
                }
                return prev + Math.random() * 15;
            });
        }, 300);
    };

    // Descargar plantilla
    const descargarPlantilla = () => {
        const csvContent = "MAC,GPON_SN,D_SN\n00:11:22:33:44:55,HWTC12345678,SN123456789\n00:11:22:33:44:56,HWTC12345679,SN123456790\n00:11:22:33:44:57,HWTC12345680,SN123456791";
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'plantilla_importacion_onus.csv';
        link.click();
        window.URL.revokeObjectURL(url);
    };

    const reiniciar = () => {
        setArchivo(null);
        setProgreso(0);
        setEstado('inicial');
        setDatosPreview(null);
        setDatosCompletos(null);
        setLoteSeleccionado('');
        setAlmacenDestino('');
        setArrastrando(false);
        setProcesandoArchivo(false);
        setPaginaActual(1);
        setMostrarTodosLosRegistros(false);
    };

    // Funciones para paginación
    const obtenerDatosPaginados = () => {
        if (!datosCompletos) return { datos: [], totalPaginas: 0 };

        const datos = datosCompletos.datos;
        const totalPaginas = Math.ceil(datos.length / registrosPorPagina);
        const inicio = (paginaActual - 1) * registrosPorPagina;
        const fin = inicio + registrosPorPagina;
        const datosPaginados = datos.slice(inicio, fin);

        return { datos: datosPaginados, totalPaginas };
    };

    const cambiarPagina = (nuevaPagina) => {
        setPaginaActual(nuevaPagina);
    };

    // Funciones para separar datos por tipo
    const cambiarRegistrosPorPagina = (nuevoTamano) => {
        setRegistrosPorPagina(nuevoTamano);
        setPaginaActual(1);
    };

    // Vista por tipos de datos
    const [vistaActiva, setVistaActiva] = useState('tabla'); // 'tabla', 'tipos'

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Importación Masiva de ONUs
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Carga masiva de equipos ONU desde archivo Excel o CSV
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                        onClick={descargarPlantilla}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Plantilla
                    </button>
                    {estado !== 'inicial' && (
                        <button
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                            onClick={reiniciar}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Nuevo
                        </button>
                    )}
                </div>
            </div>

            {/* Configuración del Lote */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Configuración de Importación</h3>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Lote de Destino *
                            </label>
                            <select
                                value={loteSeleccionado}
                                onChange={(e) => setLoteSeleccionado(e.target.value)}
                                disabled={estado === 'procesando'}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="">Seleccionar lote...</option>
                                {lotesDisponibles.map((lote) => (
                                    <option key={lote.id} value={lote.id.toString()}>
                                        {lote.numero} - {lote.proveedor} ({lote.estado})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Almacén de Destino *
                            </label>
                            <select
                                value={almacenDestino}
                                onChange={(e) => setAlmacenDestino(e.target.value)}
                                disabled={estado === 'procesando'}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="">Seleccionar almacén...</option>
                                {almacenes.map((almacen) => (
                                    <option key={almacen.id} value={almacen.id.toString()}>
                                        {almacen.nombre} ({almacen.codigo})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Zona de Carga de Archivo */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Archivo de Importación</h3>
                </div>
                <div className="p-6">
                    {!archivo ? (
                        <div
                            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                                arrastrando
                                    ? 'border-orange-500 bg-orange-50'
                                    : 'border-gray-300 hover:border-orange-400 hover:bg-gray-50'
                            }`}
                            onDragOver={manejarDragOver}
                            onDragLeave={manejarDragLeave}
                            onDrop={manejarDrop}
                        >
                            <svg className={`mx-auto h-12 w-12 mb-4 ${
                                arrastrando ? 'text-orange-500' : 'text-gray-400'
                            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <h4 className={`text-lg font-medium mb-2 ${arrastrando ? 'text-orange-600' : 'text-gray-700'}`}>
                                {arrastrando ? "¡Suelta el archivo aquí!" : "Arrastra tu archivo aquí o haz clic para seleccionar"}
                            </h4>
                            <p className="text-gray-500 mb-4">
                                Formatos soportados: .xlsx, .xls, .csv (máx. 10MB)
                            </p>
                            <input
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={manejarInputArchivo}
                                className="hidden"
                                id="archivo-input"
                                disabled={estado === 'procesando' || procesandoArchivo}
                            />
                            <button
                                className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 mx-auto ${
                                    procesandoArchivo
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : arrastrando
                                            ? 'bg-orange-600 hover:bg-orange-700 text-white'
                                            : 'bg-orange-500 hover:bg-orange-600 text-white'
                                }`}
                                disabled={procesandoArchivo}
                                onClick={() => document.getElementById('archivo-input').click()}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                {procesandoArchivo ? "Procesando..." : "Seleccionar Archivo"}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-blue-800 text-sm">
                                    <strong>Archivo seleccionado:</strong> {archivo.name} ({(archivo.size / 1024).toFixed(1)} KB)
                                </p>
                            </div>

                            {/* Indicador de procesamiento */}
                            {procesandoArchivo && (
                                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center gap-3">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                                    <p className="text-orange-800 text-sm">
                                        Procesando archivo... Por favor espera.
                                    </p>
                                </div>
                            )}

                            {/* Preview de datos */}
                            {datosPreview && !procesandoArchivo && (
                                <div className="space-y-4">
                                    <div className="flex gap-4 flex-wrap">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                            {datosPreview.totalFilas} registros
                                        </span>
                                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                            {datosPreview.validas} válidos
                                        </span>
                                        {datosPreview.errores > 0 && (
                                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                                                {datosPreview.errores} errores
                                            </span>
                                        )}
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-medium text-gray-700">
                                                {mostrarTodosLosRegistros
                                                    ? `Todos los registros (${datosCompletos?.datos.length || 0} total):`
                                                    : `Vista Previa (primeros ${Math.min(5, datosPreview.totalFilas)} registros):`
                                                }
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                {mostrarTodosLosRegistros && (
                                                    <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                                                        <button
                                                            onClick={() => setVistaActiva('tabla')}
                                                            className={`px-3 py-1 text-sm transition-colors ${
                                                                vistaActiva === 'tabla'
                                                                    ? 'bg-orange-500 text-white'
                                                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            Tabla
                                                        </button>
                                                        <button
                                                            onClick={() => setVistaActiva('tipos')}
                                                            className={`px-3 py-1 text-sm transition-colors ${
                                                                vistaActiva === 'tipos'
                                                                    ? 'bg-orange-500 text-white'
                                                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                                            }`}
                                                        >
                                                            Por Tipos
                                                        </button>
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        setMostrarTodosLosRegistros(!mostrarTodosLosRegistros);
                                                        setPaginaActual(1);
                                                        setVistaActiva('tabla');
                                                    }}
                                                    className="px-3 py-1 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
                                                >
                                                    {mostrarTodosLosRegistros ? 'Ver Preview' : 'Ver Todos'}
                                                </button>
                                            </div>
                                        </div>

                                        {mostrarTodosLosRegistros ? (
                                            // Vista completa con paginación
                                            <div className="space-y-4">
                                                {vistaActiva === 'tabla' ? (
                                                    // Vista de tabla normal
                                                    <>
                                                        {/* Controles de paginación superior */}
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <label className="text-sm text-gray-600">Mostrar:</label>
                                                                <select
                                                                    value={registrosPorPagina}
                                                                    onChange={(e) => cambiarRegistrosPorPagina(Number(e.target.value))}
                                                                    className="px-2 py-1 border border-gray-300 rounded text-sm"
                                                                >
                                                                    <option value={10}>10</option>
                                                                    <option value={25}>25</option>
                                                                    <option value={50}>50</option>
                                                                    <option value={100}>100</option>
                                                                </select>
                                                                <span className="text-sm text-gray-600">registros por página</span>
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                Mostrando {((paginaActual - 1) * registrosPorPagina) + 1} - {Math.min(paginaActual * registrosPorPagina, datosCompletos?.datos.length || 0)} de {datosCompletos?.datos.length || 0} registros
                                                            </div>
                                                        </div>

                                                        {/* Tabla con datos paginados */}
                                                        <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                                            <table className="w-full text-sm border-collapse">
                                                                <thead className="bg-gray-100">
                                                                <tr>
                                                                    <th className="text-left p-2 border-r border-gray-200 font-medium w-16">
                                                                        #
                                                                    </th>
                                                                    {datosPreview.headers.map((header, index) => (
                                                                        <th key={index} className="text-left p-2 border-r border-gray-200 font-medium">
                                                                            {header || `Columna ${index + 1}`}
                                                                        </th>
                                                                    ))}
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                {obtenerDatosPaginados().datos.map((fila, index) => {
                                                                    const numeroFila = (paginaActual - 1) * registrosPorPagina + index + 1;
                                                                    return (
                                                                        <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}>
                                                                            <td className="p-2 border-r border-gray-200 font-medium text-gray-500">
                                                                                {numeroFila}
                                                                            </td>
                                                                            {datosPreview.headers.map((header, headerIndex) => (
                                                                                <td key={headerIndex} className="p-2 border-r border-gray-200 font-mono text-xs">
                                                                                    {fila[header] || ''}
                                                                                </td>
                                                                            ))}
                                                                        </tr>
                                                                    );
                                                                })}
                                                                </tbody>
                                                            </table>
                                                        </div>

                                                        {/* Paginación */}
                                                        {obtenerDatosPaginados().totalPaginas > 1 && (
                                                            <div className="flex items-center justify-center gap-2">
                                                                <button
                                                                    onClick={() => cambiarPagina(paginaActual - 1)}
                                                                    disabled={paginaActual === 1}
                                                                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                    Anterior
                                                                </button>

                                                                {/* Números de página */}
                                                                {Array.from({ length: Math.min(5, obtenerDatosPaginados().totalPaginas) }, (_, i) => {
                                                                    let pagina;
                                                                    const totalPaginas = obtenerDatosPaginados().totalPaginas;

                                                                    if (totalPaginas <= 5) {
                                                                        pagina = i + 1;
                                                                    } else if (paginaActual <= 3) {
                                                                        pagina = i + 1;
                                                                    } else if (paginaActual >= totalPaginas - 2) {
                                                                        pagina = totalPaginas - 4 + i;
                                                                    } else {
                                                                        pagina = paginaActual - 2 + i;
                                                                    }

                                                                    return (
                                                                        <button
                                                                            key={pagina}
                                                                            onClick={() => cambiarPagina(pagina)}
                                                                            className={`px-3 py-1 border rounded ${
                                                                                paginaActual === pagina
                                                                                    ? 'bg-orange-500 text-white border-orange-500'
                                                                                    : 'border-gray-300 hover:bg-gray-50'
                                                                            }`}
                                                                        >
                                                                            {pagina}
                                                                        </button>
                                                                    );
                                                                })}

                                                                <button
                                                                    onClick={() => cambiarPagina(paginaActual + 1)}
                                                                    disabled={paginaActual === obtenerDatosPaginados().totalPaginas}
                                                                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                    Siguiente
                                                                </button>
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    // Vista por tipos de datos
                                                    (() => {
                                                        const { macs, gponSns, dSns } = separarDatosPorTipo(datosCompletos.datos);

                                                        return (
                                                            <div className="space-y-6">
                                                                {/* MAC Addresses */}
                                                                <div className="border border-blue-200 rounded-lg">
                                                                    <div className="bg-blue-50 px-4 py-3 border-b border-blue-200">
                                                                        <h5 className="font-medium text-blue-900 flex items-center gap-2">
                                                                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                                            MAC Addresses ({macs.length} encontradas)
                                                                        </h5>
                                                                    </div>
                                                                    <div className="p-4">
                                                                        {macs.length > 0 ? (
                                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                                                                {macs.slice(0, 12).map((item, index) => (
                                                                                    <div key={index} className="bg-white border border-gray-200 rounded px-3 py-2">
                                                                                        <div className="font-mono text-sm text-blue-700">{item.valor}</div>
                                                                                        <div className="text-xs text-gray-500">Fila {item.fila} - {item.columna}</div>
                                                                                    </div>
                                                                                ))}
                                                                                {macs.length > 12 && (
                                                                                    <div className="bg-gray-100 border border-gray-200 rounded px-3 py-2 flex items-center justify-center">
                                                                                        <span className="text-sm text-gray-600">+{macs.length - 12} más...</span>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        ) : (
                                                                            <p className="text-gray-500 text-sm">No se encontraron MAC addresses</p>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* GPON Serial Numbers */}
                                                                <div className="border border-green-200 rounded-lg">
                                                                    <div className="bg-green-50 px-4 py-3 border-b border-green-200">
                                                                        <h5 className="font-medium text-green-900 flex items-center gap-2">
                                                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                                            GPON Serial Numbers ({gponSns.length} encontrados)
                                                                        </h5>
                                                                    </div>
                                                                    <div className="p-4">
                                                                        {gponSns.length > 0 ? (
                                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                                                                {gponSns.slice(0, 12).map((item, index) => (
                                                                                    <div key={index} className="bg-white border border-gray-200 rounded px-3 py-2">
                                                                                        <div className="font-mono text-sm text-green-700">{item.valor}</div>
                                                                                        <div className="text-xs text-gray-500">Fila {item.fila} - {item.columna}</div>
                                                                                    </div>
                                                                                ))}
                                                                                {gponSns.length > 12 && (
                                                                                    <div className="bg-gray-100 border border-gray-200 rounded px-3 py-2 flex items-center justify-center">
                                                                                        <span className="text-sm text-gray-600">+{gponSns.length - 12} más...</span>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        ) : (
                                                                            <p className="text-gray-500 text-sm">No se encontraron GPON Serial Numbers</p>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {/* D-SN */}
                                                                <div className="border border-purple-200 rounded-lg">
                                                                    <div className="bg-purple-50 px-4 py-3 border-b border-purple-200">
                                                                        <h5 className="font-medium text-purple-900 flex items-center gap-2">
                                                                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                                                            D-SN ({dSns.length} encontrados)
                                                                        </h5>
                                                                    </div>
                                                                    <div className="p-4">
                                                                        {dSns.length > 0 ? (
                                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                                                                {dSns.slice(0, 12).map((item, index) => (
                                                                                    <div key={index} className="bg-white border border-gray-200 rounded px-3 py-2">
                                                                                        <div className="font-mono text-sm text-purple-700">{item.valor}</div>
                                                                                        <div className="text-xs text-gray-500">Fila {item.fila} - {item.columna}</div>
                                                                                    </div>
                                                                                ))}
                                                                                {dSns.length > 12 && (
                                                                                    <div className="bg-gray-100 border border-gray-200 rounded px-3 py-2 flex items-center justify-center">
                                                                                        <span className="text-sm text-gray-600">+{dSns.length - 12} más...</span>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        ) : (
                                                                            <p className="text-gray-500 text-sm">No se encontraron D-SN</p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })()
                                                )}
                                            </div>
                                        ) : (
                                            // Vista preview (original)
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-sm border-collapse">
                                                    <thead className="bg-gray-100">
                                                    <tr>
                                                        {datosPreview.headers.map((header, index) => (
                                                            <th key={index} className="text-left p-2 border border-gray-200 font-medium">
                                                                {header || `Columna ${index + 1}`}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {datosPreview.muestra.map((fila, index) => (
                                                        <tr key={index} className="border-b">
                                                            {datosPreview.headers.map((header, headerIndex) => (
                                                                <td key={headerIndex} className="p-2 border border-gray-200 font-mono text-xs">
                                                                    {fila[header] || ''}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Progreso de Importación */}
            {estado === 'procesando' && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">
                                Procesando Importación...
                            </h3>
                            <span className="text-sm text-gray-500">
                                {Math.round(progreso)}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progreso}%` }}
                            ></div>
                        </div>
                        <p className="text-center text-gray-600 text-sm">
                            Validando y registrando ONUs en el sistema...
                        </p>
                    </div>
                </div>
            )}

            {/* Resultado de Importación */}
            {estado === 'completado' && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-2 text-green-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-lg font-medium">¡Importación Completada!</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                    {datosPreview?.validas || 0}
                                </div>
                                <div className="text-sm text-gray-600">ONUs Importadas</div>
                            </div>
                            <div className="text-center p-4 bg-red-50 rounded-lg">
                                <div className="text-2xl font-bold text-red-600">
                                    {datosPreview?.errores || 0}
                                </div>
                                <div className="text-sm text-gray-600">Errores</div>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">2.3s</div>
                                <div className="text-sm text-gray-600">Tiempo Total</div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-600">
                                    {datosPreview ? Math.round((datosPreview.validas / datosPreview.totalFilas) * 100) : 0}%
                                </div>
                                <div className="text-sm text-gray-600">Éxito</div>
                            </div>
                        </div>
                        <div className="flex gap-2 justify-center">
                            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                                Ver Errores
                            </button>
                            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm">
                                Ver ONUs Importadas
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Botón de Importación */}
            {archivo && datosPreview && estado === 'inicial' && loteSeleccionado && almacenDestino && (
                <div className="flex justify-center">
                    <button
                        className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium flex items-center gap-2"
                        onClick={procesarImportacion}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Importar {datosPreview.validas} ONUs
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImportacionMasivaPage;