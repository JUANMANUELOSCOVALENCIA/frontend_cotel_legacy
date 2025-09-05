// ======================================================
// src/features/almacenes/hooks/useAlmacenUI.js
// Hook especializado para estado de UI y dialogs
// ======================================================

import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

export const useAlmacenUI = () => {
    const [dialogos, setDialogos] = useState({
        crear: false,
        editar: false,
        eliminar: false,
        estadisticas: false,
        detalles: false,
        configuracion: false
    });

    const [almacenSeleccionado, setAlmacenSeleccionado] = useState(null);
    const [vistaActual, setVistaActual] = useState('tabla'); // 'tabla', 'grid', 'resumen'
    const [filtrosAvanzados, setFiltrosAvanzados] = useState(false);

    // Gestión de dialogs
    const abrirDialogo = useCallback((tipo, almacen = null) => {
        setDialogos(prev => ({ ...prev, [tipo]: true }));
        if (almacen) {
            setAlmacenSeleccionado(almacen);
        }
    }, []);

    const cerrarDialogo = useCallback((tipo) => {
        setDialogos(prev => ({ ...prev, [tipo]: false }));
        if (tipo !== 'crear') {
            setTimeout(() => setAlmacenSeleccionado(null), 300); // Delay para animación
        }
    }, []);

    const cerrarTodosDialogos = useCallback(() => {
        setDialogos({
            crear: false,
            editar: false,
            eliminar: false,
            estadisticas: false,
            detalles: false,
            configuracion: false
        });
        setAlmacenSeleccionado(null);
    }, []);

    // Gestión de vistas
    const cambiarVista = useCallback((nuevaVista) => {
        setVistaActual(nuevaVista);
        localStorage.setItem('almacenes_vista_preferida', nuevaVista);
    }, []);

    const toggleFiltrosAvanzados = useCallback(() => {
        setFiltrosAvanzados(prev => !prev);
    }, []);

    // Acciones con feedback
    const ejecutarAccionConFeedback = useCallback(async (accion, mensaje, funcionEjecutar) => {
        try {
            const resultado = await funcionEjecutar();
            if (resultado) {
                toast.success(mensaje.exito || 'Operación exitosa');
                return resultado;
            } else {
                toast.error(mensaje.error || 'Error en la operación');
                return null;
            }
        } catch (error) {
            toast.error(mensaje.error || 'Error inesperado');
            console.error(`Error en ${accion}:`, error);
            return null;
        }
    }, []);

    // Cargar preferencias guardadas
    const cargarPreferencias = useCallback(() => {
        try {
            const vistaGuardada = localStorage.getItem('almacenes_vista_preferida');
            if (vistaGuardada && ['tabla', 'grid', 'resumen'].includes(vistaGuardada)) {
                setVistaActual(vistaGuardada);
            }

            const filtrosGuardados = localStorage.getItem('almacenes_filtros_avanzados');
            if (filtrosGuardados === 'true') {
                setFiltrosAvanzados(true);
            }
        } catch (error) {
            console.error('Error cargando preferencias:', error);
        }
    }, []);

    // Guardar preferencias
    const guardarPreferencias = useCallback(() => {
        try {
            localStorage.setItem('almacenes_vista_preferida', vistaActual);
            localStorage.setItem('almacenes_filtros_avanzados', filtrosAvanzados.toString());
        } catch (error) {
            console.error('Error guardando preferencias:', error);
        }
    }, [vistaActual, filtrosAvanzados]);

    return {
        // Estado de dialogs
        dialogos,
        almacenSeleccionado,
        abrirDialogo,
        cerrarDialogo,
        cerrarTodosDialogos,
        setAlmacenSeleccionado,

        // Estado de vistas
        vistaActual,
        filtrosAvanzados,
        cambiarVista,
        toggleFiltrosAvanzados,

        // Utilidades
        ejecutarAccionConFeedback,
        cargarPreferencias,
        guardarPreferencias
    };
};

export default useAlmacenUI;