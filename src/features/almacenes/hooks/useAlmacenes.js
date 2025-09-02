// ======================================================
// src/core/almacenes/hooks/useAlmacenes.js
// Hook para gestión de almacenes y proveedores (Adaptado)
// ======================================================

import { useState, useCallback, useEffect } from 'react';
import almacenService from '../../../features/almacenes/services/almacenService';

export const useAlmacenes = () => {
    const [almacenes, setAlmacenes] = useState([]);
    const [almacenActual, setAlmacenActual] = useState(null);
    const [estadisticas, setEstadisticas] = useState(null);
    const [resumen, setResumen] = useState(null);
    const [filtros, setFiltros] = useState({});
    const [paginacion, setPaginacion] = useState({
        page: 1,
        page_size: 20,
        total: 0,
        pages: 0
    });

    // Estados de loading específicos
    const [loadingStates, setLoadingStates] = useState({
        almacenes: false,
        almacen: false,
        create: false,
        update: false,
        delete: false,
        estadisticas: false,
        resumen: false,
        principal: false,
        materiales: false
    });

    // Función para gestionar loading states
    const setLoading = useCallback((key, value) => {
        setLoadingStates(prev => ({
            ...prev,
            [key]: value
        }));
    }, []);

    // Función simple para mostrar errores en consola (temporal)
    const showError = useCallback((title, message) => {
        console.error(`${title}: ${message}`);
        // TODO: Aquí puedes agregar tu sistema de notificaciones cuando esté listo
        // Por ejemplo: toast.error(`${title}: ${message}`);
    }, []);

    const showSuccess = useCallback((title, message) => {
        console.log(`${title}: ${message}`);
        // TODO: Aquí puedes agregar tu sistema de notificaciones cuando esté listo
        // Por ejemplo: toast.success(`${title}: ${message}`);
    }, []);

    // ========== GESTIÓN DE ALMACENES ==========

    const cargarAlmacenes = useCallback(async (params = {}) => {
        setLoading('almacenes', true);
        try {
            const parametros = { ...filtros, ...params };
            const response = await almacenService.getAlmacenes(parametros);

            if (response.success) {
                setAlmacenes(response.data.results || response.data);
                setPaginacion(prev => ({
                    ...prev,
                    total: response.data.count || 0,
                    pages: Math.ceil((response.data.count || 0) / (parametros.page_size || 20))
                }));
            } else {
                showError('Error al cargar almacenes', response.error);
                setAlmacenes([]);
            }
        } catch (error) {
            showError('Error inesperado', 'Error al cargar almacenes');
            setAlmacenes([]);
        } finally {
            setLoading('almacenes', false);
        }
    }, [filtros, showError, setLoading]);

    const obtenerAlmacen = useCallback(async (id) => {
        setLoading('almacen', true);
        try {
            const response = await almacenService.getAlmacenById(id);
            if (response.success) {
                setAlmacenActual(response.data);
                return response.data;
            } else {
                showError('Error al obtener almacén', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al obtener almacén');
            return null;
        } finally {
            setLoading('almacen', false);
        }
    }, [showError, setLoading]);

    const crearAlmacen = useCallback(async (almacenData) => {
        setLoading('create', true);
        try {
            const response = await almacenService.createAlmacen(almacenData);
            if (response.success) {
                showSuccess('Éxito', 'Almacén creado correctamente');
                await cargarAlmacenes({ page: 1 });
                return response.data;
            } else {
                showError('Error al crear almacén', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al crear almacén');
            return null;
        } finally {
            setLoading('create', false);
        }
    }, [showError, showSuccess, setLoading, cargarAlmacenes]);

    const actualizarAlmacen = useCallback(async (id, almacenData) => {
        setLoading('update', true);
        try {
            const response = await almacenService.updateAlmacen(id, almacenData);
            if (response.success) {
                showSuccess('Éxito', 'Almacén actualizado correctamente');

                // Actualizar en la lista local
                setAlmacenes(prev => prev.map(almacen =>
                    almacen.id === id ? { ...almacen, ...response.data } : almacen
                ));

                // Actualizar almacén actual si coincide
                if (almacenActual?.id === id) {
                    setAlmacenActual({ ...almacenActual, ...response.data });
                }

                return response.data;
            } else {
                showError('Error al actualizar almacén', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al actualizar almacén');
            return null;
        } finally {
            setLoading('update', false);
        }
    }, [showError, showSuccess, setLoading, almacenActual]);

    const eliminarAlmacen = useCallback(async (id) => {
        setLoading('delete', true);
        try {
            const response = await almacenService.deleteAlmacen(id);
            if (response.success) {
                showSuccess('Éxito', response.message);

                // Remover de la lista local
                setAlmacenes(prev => prev.filter(almacen => almacen.id !== id));

                // Limpiar almacén actual si coincide
                if (almacenActual?.id === id) {
                    setAlmacenActual(null);
                }

                return true;
            } else {
                showError('Error al eliminar almacén', response.error);
                return false;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al eliminar almacén');
            return false;
        } finally {
            setLoading('delete', false);
        }
    }, [showError, showSuccess, setLoading, almacenActual]);

    // ========== ESTADÍSTICAS Y RESÚMENES ==========

    const cargarEstadisticasAlmacen = useCallback(async (id) => {
        setLoading('estadisticas', true);
        try {
            const response = await almacenService.getAlmacenEstadisticas(id);
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

    const cargarResumenAlmacenes = useCallback(async () => {
        setLoading('resumen', true);
        try {
            const response = await almacenService.getResumenAlmacenes();
            if (response.success) {
                setResumen(response.data);
                return response.data;
            } else {
                showError('Error al cargar resumen', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al cargar resumen');
            return null;
        } finally {
            setLoading('resumen', false);
        }
    }, [showError, setLoading]);

    const obtenerAlmacenPrincipal = useCallback(async () => {
        setLoading('principal', true);
        try {
            const response = await almacenService.getAlmacenPrincipal();
            if (response.success) {
                return response.data;
            } else {
                showError('Error al obtener almacén principal', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al obtener almacén principal');
            return null;
        } finally {
            setLoading('principal', false);
        }
    }, [showError, setLoading]);

    // ========== MATERIALES DEL ALMACÉN ==========

    const cargarMaterialesAlmacen = useCallback(async (id, params = {}) => {
        setLoading('materiales', true);
        try {
            const response = await almacenService.getAlmacenMateriales(id, params);
            if (response.success) {
                return response.data;
            } else {
                showError('Error al cargar materiales', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al cargar materiales del almacén');
            return null;
        } finally {
            setLoading('materiales', false);
        }
    }, [showError, setLoading]);

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

    // ========== EFECTOS ==========

    useEffect(() => {
        cargarAlmacenes({ page: paginacion.page });
    }, [paginacion.page, filtros]);

    // ========== UTILIDADES ==========

    const limpiarDatos = useCallback(() => {
        setAlmacenes([]);
        setAlmacenActual(null);
        setEstadisticas(null);
        setResumen(null);
        setFiltros({});
        setPaginacion({
            page: 1,
            page_size: 20,
            total: 0,
            pages: 0
        });
    }, []);

    const refrescar = useCallback(async () => {
        await cargarAlmacenes({ page: paginacion.page });
    }, [cargarAlmacenes, paginacion.page]);

    // Función helper para verificar si algo está cargando
    const isLoading = useCallback((key) => {
        return key ? loadingStates[key] : Object.values(loadingStates).some(state => state);
    }, [loadingStates]);

    return {
        // Estado
        almacenes,
        almacenActual,
        estadisticas,
        resumen,
        filtros,
        paginacion,
        loading: loadingStates, // Estados específicos de loading
        isLoading, // Helper function

        // Acciones CRUD
        cargarAlmacenes,
        obtenerAlmacen,
        crearAlmacen,
        actualizarAlmacen,
        eliminarAlmacen,

        // Estadísticas
        cargarEstadisticasAlmacen,
        cargarResumenAlmacenes,
        obtenerAlmacenPrincipal,

        // Materiales
        cargarMaterialesAlmacen,

        // Filtros y navegación
        aplicarFiltros,
        limpiarFiltros,
        cambiarPagina,
        buscar,

        // Utilidades
        limpiarDatos,
        refrescar
    };
};

// ========== HOOK PARA PROVEEDORES ==========

export const useProveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    const [proveedorActual, setProveedorActual] = useState(null);
    const [proveedoresActivos, setProveedoresActivos] = useState([]);
    const [filtros, setFiltros] = useState({});
    const [paginacion, setPaginacion] = useState({
        page: 1,
        page_size: 20,
        total: 0,
        pages: 0
    });

    // Estados de loading específicos
    const [loadingStates, setLoadingStates] = useState({
        proveedores: false,
        activos: false,
        create: false,
        update: false,
        lotes: false
    });

    const setLoading = useCallback((key, value) => {
        setLoadingStates(prev => ({
            ...prev,
            [key]: value
        }));
    }, []);

    const showError = useCallback((title, message) => {
        console.error(`${title}: ${message}`);
    }, []);

    const showSuccess = useCallback((title, message) => {
        console.log(`${title}: ${message}`);
    }, []);

    const cargarProveedores = useCallback(async (params = {}) => {
        setLoading('proveedores', true);
        try {
            const parametros = { ...filtros, ...params };
            const response = await almacenService.getProveedores(parametros);

            if (response.success) {
                setProveedores(response.data.results || response.data);
                setPaginacion(prev => ({
                    ...prev,
                    total: response.data.count || 0,
                    pages: Math.ceil((response.data.count || 0) / (parametros.page_size || 20))
                }));
            } else {
                showError('Error al cargar proveedores', response.error);
                setProveedores([]);
            }
        } catch (error) {
            showError('Error inesperado', 'Error al cargar proveedores');
            setProveedores([]);
        } finally {
            setLoading('proveedores', false);
        }
    }, [filtros, showError, setLoading]);

    const cargarProveedoresActivos = useCallback(async () => {
        setLoading('activos', true);
        try {
            const response = await almacenService.getProveedoresActivos();
            if (response.success) {
                setProveedoresActivos(response.data);
                return response.data;
            } else {
                showError('Error al cargar proveedores activos', response.error);
                return [];
            }
        } catch (error) {
            showError('Error inesperado', 'Error al cargar proveedores activos');
            return [];
        } finally {
            setLoading('activos', false);
        }
    }, [showError, setLoading]);

    const crearProveedor = useCallback(async (proveedorData) => {
        setLoading('create', true);
        try {
            const response = await almacenService.createProveedor(proveedorData);
            if (response.success) {
                showSuccess('Éxito', 'Proveedor creado correctamente');
                await cargarProveedores({ page: 1 });
                return response.data;
            } else {
                showError('Error al crear proveedor', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al crear proveedor');
            return null;
        } finally {
            setLoading('create', false);
        }
    }, [showError, showSuccess, setLoading, cargarProveedores]);

    const actualizarProveedor = useCallback(async (id, proveedorData) => {
        setLoading('update', true);
        try {
            const response = await almacenService.updateProveedor(id, proveedorData);
            if (response.success) {
                showSuccess('Éxito', 'Proveedor actualizado correctamente');

                setProveedores(prev => prev.map(proveedor =>
                    proveedor.id === id ? { ...proveedor, ...response.data } : proveedor
                ));

                if (proveedorActual?.id === id) {
                    setProveedorActual({ ...proveedorActual, ...response.data });
                }

                return response.data;
            } else {
                showError('Error al actualizar proveedor', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al actualizar proveedor');
            return null;
        } finally {
            setLoading('update', false);
        }
    }, [showError, showSuccess, setLoading, proveedorActual]);

    const cargarLotesProveedor = useCallback(async (id, params = {}) => {
        setLoading('lotes', true);
        try {
            const response = await almacenService.getProveedorLotes(id, params);
            if (response.success) {
                return response.data;
            } else {
                showError('Error al cargar lotes', response.error);
                return null;
            }
        } catch (error) {
            showError('Error inesperado', 'Error al cargar lotes del proveedor');
            return null;
        } finally {
            setLoading('lotes', false);
        }
    }, [showError, setLoading]);

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

    useEffect(() => {
        cargarProveedores({ page: paginacion.page });
    }, [paginacion.page, filtros]);

    const limpiarDatos = useCallback(() => {
        setProveedores([]);
        setProveedorActual(null);
        setProveedoresActivos([]);
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
            cargarProveedores({ page: paginacion.page }),
            cargarProveedoresActivos()
        ]);
    }, [cargarProveedores, cargarProveedoresActivos, paginacion.page]);

    const isLoading = useCallback((key) => {
        return key ? loadingStates[key] : Object.values(loadingStates).some(state => state);
    }, [loadingStates]);

    return {
        // Estado
        proveedores,
        proveedorActual,
        proveedoresActivos,
        filtros,
        paginacion,
        loading: loadingStates,
        isLoading,

        // Acciones
        cargarProveedores,
        cargarProveedoresActivos,
        crearProveedor,
        actualizarProveedor,
        cargarLotesProveedor,

        // Filtros y navegación
        aplicarFiltros,
        limpiarFiltros,
        cambiarPagina,
        buscar,

        // Utilidades
        limpiarDatos,
        refrescar,

        // Setters para casos específicos
        setProveedorActual
    };
};

export default useAlmacenes;