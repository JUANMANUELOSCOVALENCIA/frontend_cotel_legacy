// ======================================================
// src/features/almacenes/hooks/useAlmacenFilters.js
// Hook especializado para filtros y búsquedas de almacenes
// ======================================================

import { useState, useCallback, useMemo, useEffect } from 'react';

export const useAlmacenFilters = ({
                                      filtros,
                                      aplicarFiltros,
                                      limpiarFiltros,
                                      almacenes = []
                                  }) => {
    const [busquedaAvanzada, setBusquedaAvanzada] = useState({
        termino: '',
        tipo: '',
        ciudad: '',
        estado: '',
        es_principal: '',
        capacidad_min: '',
        capacidad_max: '',
        fecha_desde: '',
        fecha_hasta: ''
    });

    const [historialBusquedas, setHistorialBusquedas] = useState([]);

    // Definir filtros disponibles
    const filtrosDisponibles = useMemo(() => ({
        tipo: {
            label: 'Tipo de Almacén',
            opciones: [
                { valor: 'CENTRAL', label: 'Central', descripcion: 'Almacén principal de distribución' },
                { valor: 'REGIONAL', label: 'Regional', descripcion: 'Almacén regional' },
                { valor: 'LOCAL', label: 'Local', descripcion: 'Almacén local o sucursal' },
                { valor: 'TEMPORAL', label: 'Temporal', descripcion: 'Almacén temporal' }
            ]
        },
        activo: {
            label: 'Estado',
            opciones: [
                { valor: true, label: 'Activos', descripcion: 'Almacenes operativos' },
                { valor: false, label: 'Inactivos', descripcion: 'Almacenes no operativos' }
            ]
        },
        es_principal: {
            label: 'Clasificación',
            opciones: [
                { valor: true, label: 'Principal', descripcion: 'Almacén principal del sistema' },
                { valor: false, label: 'Secundario', descripcion: 'Almacenes secundarios' }
            ]
        },
        ciudad: {
            label: 'Ciudad',
            tipo: 'select',
            opciones: [] // Se llena dinámicamente
        },
        capacidad: {
            label: 'Rango de Capacidad',
            tipo: 'rango',
            opciones: [
                { valor: '0-99', label: 'Muy Pequeño (< 100)' },
                { valor: '100-499', label: 'Pequeño (100-499)' },
                { valor: '500-999', label: 'Mediano (500-999)' },
                { valor: '1000-4999', label: 'Grande (1000-4999)' },
                { valor: '5000+', label: 'Muy Grande (5000+)' }
            ]
        }
    }), []);

    // Obtener opciones dinámicas de ciudades
    const opcionesCiudades = useMemo(() => {
        const ciudades = [...new Set(almacenes.map(a => a.ciudad).filter(Boolean))].sort();
        return ciudades.map(ciudad => ({ valor: ciudad, label: ciudad }));
    }, [almacenes]);

    // Aplicar filtro rápido
    const aplicarFiltroRapido = useCallback((key, value) => {
        const filtrosActuales = { ...filtros };

        if (filtrosActuales[key] === value) {
            // Si el filtro ya está aplicado, quitarlo
            delete filtrosActuales[key];
        } else {
            // Aplicar nuevo filtro
            filtrosActuales[key] = value;
        }

        aplicarFiltros(filtrosActuales);
    }, [filtros, aplicarFiltros]);

    // Aplicar múltiples filtros
    const aplicarMultiplesFiltros = useCallback((nuevosFiltros) => {
        const filtrosCombinados = { ...filtros, ...nuevosFiltros };
        aplicarFiltros(filtrosCombinados);
    }, [filtros, aplicarFiltros]);

    // Obtener filtros activos para mostrar
    const getFiltrosActivos = useCallback(() => {
        return Object.entries(filtros)
            .filter(([key, value]) => value !== null && value !== undefined && value !== '')
            .map(([key, value]) => {
                const filtroConfig = filtrosDisponibles[key];

                if (!filtroConfig) {
                    return {
                        key,
                        label: key.charAt(0).toUpperCase() + key.slice(1),
                        value: value.toString(),
                        original: value
                    };
                }

                let displayValue = value;

                if (filtroConfig.opciones) {
                    const opcion = filtroConfig.opciones.find(o => o.valor === value);
                    displayValue = opcion ? opcion.label : value;
                }

                return {
                    key,
                    label: filtroConfig.label,
                    value: displayValue,
                    original: value
                };
            });
    }, [filtros, filtrosDisponibles]);

    // Ejecutar búsqueda avanzada
    const ejecutarBusquedaAvanzada = useCallback(() => {
        const filtrosActivos = Object.entries(busquedaAvanzada)
            .filter(([key, value]) => value !== null && value !== undefined && value !== '')
            .reduce((acc, [key, value]) => {
                // Procesamiento especial por tipo de campo
                switch (key) {
                    case 'estado':
                        if (value === 'activo') acc.activo = true;
                        else if (value === 'inactivo') acc.activo = false;
                        break;
                    case 'es_principal':
                        acc.es_principal = value === 'true';
                        break;
                    case 'capacidad_min':
                        acc.capacidad__gte = parseInt(value);
                        break;
                    case 'capacidad_max':
                        acc.capacidad__lte = parseInt(value);
                        break;
                    case 'termino':
                        acc.search = value;
                        break;
                    default:
                        acc[key] = value;
                }
                return acc;
            }, {});

        aplicarFiltros(filtrosActivos);

        // Guardar en historial
        if (busquedaAvanzada.termino.trim()) {
            guardarBusquedaEnHistorial(busquedaAvanzada, filtrosActivos);
        }
    }, [busquedaAvanzada, aplicarFiltros]);

    // Limpiar búsqueda avanzada
    const limpiarBusquedaAvanzada = useCallback(() => {
        setBusquedaAvanzada({
            termino: '',
            tipo: '',
            ciudad: '',
            estado: '',
            es_principal: '',
            capacidad_min: '',
            capacidad_max: '',
            fecha_desde: '',
            fecha_hasta: ''
        });
        limpiarFiltros();
    }, [limpiarFiltros]);

    // Gestión de historial de búsquedas
    const guardarBusquedaEnHistorial = useCallback((busqueda, filtrosUsados) => {
        const nuevaBusqueda = {
            id: Date.now(),
            termino: busqueda.termino,
            filtros: filtrosUsados,
            fecha: new Date().toISOString(),
            resultados: almacenes.length
        };

        setHistorialBusquedas(prev => {
            const nuevoHistorial = [nuevaBusqueda, ...prev.slice(0, 9)]; // Mantener últimas 10

            try {
                localStorage.setItem('historial_busquedas_almacenes', JSON.stringify(nuevoHistorial));
            } catch (error) {
                console.warn('No se pudo guardar el historial:', error);
            }

            return nuevoHistorial;
        });
    }, [almacenes.length]);

    // Aplicar búsqueda del historial
    const aplicarBusquedaHistorial = useCallback((busquedaHistorial) => {
        setBusquedaAvanzada(prev => ({
            ...prev,
            termino: busquedaHistorial.termino
        }));
        aplicarFiltros(busquedaHistorial.filtros);
    }, [aplicarFiltros]);

    // Limpiar historial
    const limpiarHistorial = useCallback(() => {
        setHistorialBusquedas([]);
        try {
            localStorage.removeItem('historial_busquedas_almacenes');
        } catch (error) {
            console.warn('No se pudo limpiar el historial:', error);
        }
    }, []);

    // Cargar historial del localStorage
    const cargarHistorial = useCallback(() => {
        try {
            const historial = JSON.parse(localStorage.getItem('historial_busquedas_almacenes') || '[]');
            setHistorialBusquedas(historial);
        } catch (error) {
            console.error('Error cargando historial:', error);
            setHistorialBusquedas([]);
        }
    }, []);

    // Filtros rápidos predefinidos
    const filtrosRapidos = useMemo(() => [
        {
            key: 'activo',
            label: 'Solo Activos',
            value: true,
            color: 'green'
        },
        {
            key: 'es_principal',
            label: 'Principal',
            value: true,
            color: 'yellow'
        },
        {
            key: 'tipo',
            label: 'Central',
            value: 'CENTRAL',
            color: 'blue'
        },
        {
            key: 'tipo',
            label: 'Regional',
            value: 'REGIONAL',
            color: 'green'
        },
        {
            key: 'tipo',
            label: 'Local',
            value: 'LOCAL',
            color: 'orange'
        }
    ], []);

    // Verificar si hay filtros activos
    const hayFiltrosActivos = useMemo(() => {
        return Object.keys(filtros).length > 0;
    }, [filtros]);

    // Cargar historial al inicializar
    useEffect(() => {
        cargarHistorial();
    }, [cargarHistorial]);

    return {
        // Búsqueda avanzada
        busquedaAvanzada,
        setBusquedaAvanzada,
        ejecutarBusquedaAvanzada,
        limpiarBusquedaAvanzada,

        // Historial
        historialBusquedas,
        aplicarBusquedaHistorial,
        limpiarHistorial,

        // Filtros rápidos
        filtrosRapidos,
        aplicarFiltroRapido,
        aplicarMultiplesFiltros,
        getFiltrosActivos,
        hayFiltrosActivos,

        // Opciones dinámicas
        opcionesCiudades,
        filtrosDisponibles,

        // Utilidades
        cargarHistorial
    };
};

export default useAlmacenFilters;