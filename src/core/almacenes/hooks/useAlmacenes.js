// ======================================================
// src/core/almacenes/hooks/useAlmacenes.js
// ======================================================

import { useState, useEffect, useCallback } from 'react';
import almacenesService from '../services/almacenesService';
import toast from 'react-hot-toast';

// ========== HOOK PRINCIPAL PARA ALMACENES ==========

export const useAlmacenes = () => {
    const [almacenes, setAlmacenes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        count: 0,
        next: null,
        previous: null,
    });

    const loadAlmacenes = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);

        try {
            const result = await almacenesService.getAlmacenes(params);

            if (result.success) {
                setAlmacenes(result.data.results || result.data);
                setPagination({
                    count: result.data.count || 0,
                    next: result.data.next || null,
                    previous: result.data.previous || null,
                });
            } else {
                setError(result.error);
                toast.error(result.error);
            }
        } catch (err) {
            const errorMsg = 'Error al cargar almacenes';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    const createAlmacen = useCallback(async (almacenData) => {
        setLoading(true);
        try {
            const result = await almacenesService.createAlmacen(almacenData);
            if (result.success) {
                toast.success('Almacén creado correctamente');
                await loadAlmacenes();
                return { success: true, data: result.data };
            } else {
                toast.error(result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            const error = 'Error al crear almacén';
            toast.error(error);
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    }, [loadAlmacenes]);

    const updateAlmacen = useCallback(async (id, almacenData) => {
        setLoading(true);
        try {
            const result = await almacenesService.updateAlmacen(id, almacenData);
            if (result.success) {
                toast.success('Almacén actualizado correctamente');
                await loadAlmacenes();
                return { success: true, data: result.data };
            } else {
                toast.error(result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            const error = 'Error al actualizar almacén';
            toast.error(error);
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    }, [loadAlmacenes]);

    const deleteAlmacen = useCallback(async (id) => {
        setLoading(true);
        try {
            const result = await almacenesService.deleteAlmacen(id);
            if (result.success) {
                toast.success('Almacén eliminado correctamente');
                await loadAlmacenes();
                return { success: true };
            } else {
                toast.error(result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            const error = 'Error al eliminar almacén';
            toast.error(error);
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    }, [loadAlmacenes]);

    return {
        almacenes,
        loading,
        error,
        pagination,
        loadAlmacenes,
        createAlmacen,
        updateAlmacen,
        deleteAlmacen,
        clearError: () => setError(null),
    };
};

// ========== HOOK PARA PROVEEDORES ==========

export const useProveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadProveedores = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);

        try {
            const result = await almacenesService.getProveedores(params);

            if (result.success) {
                setProveedores(result.data.results || result.data);
            } else {
                setError(result.error);
                toast.error(result.error);
            }
        } catch (err) {
            const errorMsg = 'Error al cargar proveedores';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    const createProveedor = useCallback(async (proveedorData) => {
        setLoading(true);
        try {
            const result = await almacenesService.createProveedor(proveedorData);
            if (result.success) {
                toast.success('Proveedor creado correctamente');
                await loadProveedores();
                return { success: true, data: result.data };
            } else {
                toast.error(result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            const error = 'Error al crear proveedor';
            toast.error(error);
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    }, [loadProveedores]);

    const updateProveedor = useCallback(async (id, proveedorData) => {
        setLoading(true);
        try {
            const result = await almacenesService.updateProveedor(id, proveedorData);
            if (result.success) {
                toast.success('Proveedor actualizado correctamente');
                await loadProveedores();
                return { success: true, data: result.data };
            } else {
                toast.error(result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            const error = 'Error al actualizar proveedor';
            toast.error(error);
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    }, [loadProveedores]);

    const deleteProveedor = useCallback(async (id) => {
        setLoading(true);
        try {
            const result = await almacenesService.deleteProveedor(id);
            if (result.success) {
                toast.success('Proveedor eliminado correctamente');
                await loadProveedores();
                return { success: true };
            } else {
                toast.error(result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            const error = 'Error al eliminar proveedor';
            toast.error(error);
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    }, [loadProveedores]);

    return {
        proveedores,
        loading,
        error,
        loadProveedores,
        createProveedor,
        updateProveedor,
        deleteProveedor,
        clearError: () => setError(null),
    };
};

// ========== HOOK PARA MARCAS ==========

export const useMarcas = () => {
    const [marcas, setMarcas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadMarcas = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);

        try {
            const result = await almacenesService.getMarcas(params);

            if (result.success) {
                setMarcas(result.data.results || result.data);
            } else {
                setError(result.error);
                toast.error(result.error);
            }
        } catch (err) {
            const errorMsg = 'Error al cargar marcas';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    const createMarca = useCallback(async (marcaData) => {
        setLoading(true);
        try {
            const result = await almacenesService.createMarca(marcaData);
            if (result.success) {
                toast.success('Marca creada correctamente');
                await loadMarcas();
                return { success: true, data: result.data };
            } else {
                toast.error(result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            const error = 'Error al crear marca';
            toast.error(error);
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    }, [loadMarcas]);

    const updateMarca = useCallback(async (id, marcaData) => {
        setLoading(true);
        try {
            const result = await almacenesService.updateMarca(id, marcaData);
            if (result.success) {
                toast.success('Marca actualizada correctamente');
                await loadMarcas();
                return { success: true, data: result.data };
            } else {
                toast.error(result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            const error = 'Error al actualizar marca';
            toast.error(error);
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    }, [loadMarcas]);

    const deleteMarca = useCallback(async (id) => {
        setLoading(true);
        try {
            const result = await almacenesService.deleteMarca(id);
            if (result.success) {
                toast.success('Marca eliminada correctamente');
                await loadMarcas();
                return { success: true };
            } else {
                toast.error(result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            const error = 'Error al eliminar marca';
            toast.error(error);
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    }, [loadMarcas]);

    const toggleActivoMarca = useCallback(async (id) => {
        setLoading(true);
        try {
            const result = await almacenesService.toggleActivoMarca(id);
            if (result.success) {
                toast.success(result.data.message || 'Estado actualizado');
                await loadMarcas();
                return { success: true, data: result.data };
            } else {
                toast.error(result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            const error = 'Error al cambiar estado';
            toast.error(error);
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    }, [loadMarcas]);

    return {
        marcas,
        loading,
        error,
        loadMarcas,
        createMarca,
        updateMarca,
        deleteMarca,
        toggleActivoMarca,
        clearError: () => setError(null),
    };
};

// ========== HOOK PARA MODELOS ==========

export const useModelos = () => {
    const [modelos, setModelos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadModelos = useCallback(async (params = {}) => {
        setLoading(true);
        setError(null);

        try {
            const result = await almacenesService.getModelos(params);

            if (result.success) {
                setModelos(result.data.results || result.data);
            } else {
                setError(result.error);
                toast.error(result.error);
            }
        } catch (err) {
            const errorMsg = 'Error al cargar modelos';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    const createModelo = useCallback(async (modeloData) => {
        setLoading(true);
        try {
            const result = await almacenesService.createModelo(modeloData);
            if (result.success) {
                toast.success('Modelo creado correctamente');
                await loadModelos();
                return { success: true, data: result.data };
            } else {
                toast.error(result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            const error = 'Error al crear modelo';
            toast.error(error);
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    }, [loadModelos]);

    const updateModelo = useCallback(async (id, modeloData) => {
        setLoading(true);
        try {
            const result = await almacenesService.updateModelo(id, modeloData);
            if (result.success) {
                toast.success('Modelo actualizado correctamente');
                await loadModelos();
                return { success: true, data: result.data };
            } else {
                toast.error(result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            const error = 'Error al actualizar modelo';
            toast.error(error);
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    }, [loadModelos]);

    const deleteModelo = useCallback(async (id) => {
        setLoading(true);
        try {
            const result = await almacenesService.deleteModelo(id);
            if (result.success) {
                toast.success('Modelo eliminado correctamente');
                await loadModelos();
                return { success: true };
            } else {
                toast.error(result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            const error = 'Error al eliminar modelo';
            toast.error(error);
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    }, [loadModelos]);

    return {
        modelos,
        loading,
        error,
        loadModelos,
        createModelo,
        updateModelo,
        deleteModelo,
        clearError: () => setError(null),
    };
};

// ========== HOOK PARA OPCIONES ==========

export const useOpcionesAlmacenes = () => {
    const [opciones, setOpciones] = useState({
        tipos_almacen: [],
        tipos_material: [],
        unidades_medida: [],
        marcas: [],
        tipos_equipo: [],
        proveedores: [],
        almacenes: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadOpciones = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await almacenesService.getOpcionesCompletas();

            if (result.success) {
                setOpciones(result.data.data || result.data);
            } else {
                setError(result.error);
                toast.error(result.error);
            }
        } catch (err) {
            const errorMsg = 'Error al cargar opciones';
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    // Cargar opciones al montar el componente
    useEffect(() => {
        loadOpciones();
    }, [loadOpciones]);

    return {
        opciones,
        loading,
        error,
        loadOpciones,
        clearError: () => setError(null),
    };
};