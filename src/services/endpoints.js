// ======================================================
// src/services/endpoints.js
// ACTUALIZADO: Endpoints completos incluyendo módulo de Almacenes
// ======================================================

// ========== HELPER FUNCTIONS ==========
export const buildUrl = (endpoint, params = {}) => {
    let url = endpoint;
    // Reemplazar parámetros en la URL
    Object.keys(params).forEach(key => {
        url = url.replace(`:${key}`, params[key]);
    });
    return url;
};

export const buildQuery = (params = {}) => {
    const cleanParams = Object.entries(params)
        .filter(([_, value]) => value !== null && value !== undefined && value !== '')
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    const queryString = new URLSearchParams(cleanParams).toString();
    return queryString ? `?${queryString}` : '';
};

// ========== ENDPOINTS PRINCIPALES ==========
export const ENDPOINTS = {
    // === AUTENTICACIÓN ===
    LOGIN: '/usuarios/login/',
    LOGOUT: '/usuarios/logout/',
    CHANGE_PASSWORD: '/usuarios/change-password/',
    REFRESH_TOKEN: '/token/refresh/',

    // === USUARIOS ===
    USUARIOS: '/usuarios/usuarios/',
    USUARIO_DETAIL: (id) => `/usuarios/usuarios/${id}/`,
    MIGRAR_USUARIO: '/usuarios/migrar/',
    RESET_PASSWORD: '/usuarios/reset-password/',
    PERFIL: '/usuarios/perfil/',
    ESTADISTICAS: '/usuarios/estadisticas/',
    VALIDAR_COTEL: '/usuarios/validar-cotel/',
    GENERAR_COTEL: '/usuarios/generar-cotel/',

    // Acciones específicas de usuarios
    ACTIVAR_USUARIO: (id) => `/usuarios/usuarios/${id}/activar/`,
    DESACTIVAR_USUARIO: (id) => `/usuarios/usuarios/${id}/desactivar/`,
    RESETEAR_PASSWORD_USUARIO: (id) => `/usuarios/usuarios/${id}/resetear_password/`,
    CAMBIAR_ROL_USUARIO: (id) => `/usuarios/usuarios/${id}/cambiar_rol/`,
    DESBLOQUEAR_USUARIO: (id) => `/usuarios/usuarios/${id}/desbloquear/`,
    RESTAURAR_USUARIO: (id) => `/usuarios/usuarios/${id}/restaurar/`,

    // === ROLES ===
    ROLES: '/usuarios/roles/',
    ROLE_DETAIL: (id) => `/usuarios/roles/${id}/`,
    CLONAR_ROL: (id) => `/usuarios/roles/${id}/clonar/`,
    USUARIOS_ROL: (id) => `/usuarios/roles/${id}/usuarios/`,
    RESTAURAR_ROL: (id) => `/usuarios/roles/${id}/restaurar/`,

    // === PERMISOS ===
    PERMISOS: '/usuarios/permisos/',
    PERMISO_DETAIL: (id) => `/usuarios/permisos/${id}/`,
    RECURSOS_DISPONIBLES: '/usuarios/permisos/recursos_disponibles/',
    ACCIONES_DISPONIBLES: '/usuarios/permisos/acciones_disponibles/',
    RESTAURAR_PERMISO: (id) => `/usuarios/permisos/${id}/restaurar/`,

    // === EMPLEADOS FDW ===
    EMPLEADOS_DISPONIBLES: '/usuarios/empleados-disponibles/',
    ESTADISTICAS_MIGRACION: '/usuarios/empleados-disponibles/estadisticas/',

    // === AUDITORÍA ===
    LOGS: '/usuarios/logs/',
    ESTADISTICAS_LOGS: '/usuarios/logs/estadisticas/',

    // ========== NUEVOS ENDPOINTS DE ALMACENES ==========

    // === ALMACENES ===
    ALMACENES: '/almacenes/almacenes/',
    ALMACEN_DETAIL: (id) => `/almacenes/almacenes/${id}/`,
    ALMACEN_MATERIALES: (id) => `/almacenes/almacenes/${id}/materiales/`,
    ALMACEN_MATERIALES_DISPONIBLES: (id) => `/almacenes/almacenes/${id}/materiales_disponibles/`,
    ALMACEN_ESTADISTICAS: (id) => `/almacenes/almacenes/${id}/estadisticas/`,
    ALMACEN_MOVIMIENTOS: (id) => `/almacenes/almacenes/${id}/movimientos/`,
    ALMACEN_PRINCIPAL: '/almacenes/almacenes/principal/',
    ALMACENES_REGIONALES: '/almacenes/almacenes/regionales/',
    RESUMEN_ALMACENES: '/almacenes/almacenes/resumen_general/',

    // === PROVEEDORES ===
    PROVEEDORES: '/almacenes/proveedores/',
    PROVEEDOR_DETAIL: (id) => `/almacenes/proveedores/${id}/`,
    PROVEEDOR_LOTES: (id) => `/almacenes/proveedores/${id}/lotes/`,
    PROVEEDOR_ESTADISTICAS: (id) => `/almacenes/proveedores/${id}/estadisticas/`,
    PROVEEDORES_ACTIVOS: '/almacenes/proveedores/activos/',
    TOP_PROVEEDORES: '/almacenes/proveedores/top_proveedores/',

    // === LOTES ===
    LOTES: '/almacenes/lotes/',
    LOTE_DETAIL: (id) => `/almacenes/lotes/${id}/`,
    LOTE_RESUMEN: (id) => `/almacenes/lotes/${id}/resumen/`,
    LOTE_MATERIALES: (id) => `/almacenes/lotes/${id}/materiales/`,
    LOTE_AGREGAR_ENTREGA: (id) => `/almacenes/lotes/${id}/agregar_entrega_parcial/`,
    LOTE_CERRAR: (id) => `/almacenes/lotes/${id}/cerrar_lote/`,
    LOTE_REABRIR: (id) => `/almacenes/lotes/${id}/reabrir_lote/`,
    LOTE_ENVIAR_LABORATORIO: (id) => `/almacenes/lotes/${id}/enviar_laboratorio_masivo/`,
    LOTES_ESTADISTICAS: '/almacenes/lotes/estadisticas/',

    // Detalles de lotes
    LOTE_DETALLES: '/almacenes/lote-detalles/',

    // === MATERIALES ===
    MATERIALES: '/almacenes/materiales/',
    MATERIAL_DETAIL: (id) => `/almacenes/materiales/${id}/`,
    MATERIAL_HISTORIAL: (id) => `/almacenes/materiales/${id}/historial/`,
    MATERIAL_CAMBIAR_ESTADO: (id) => `/almacenes/materiales/${id}/cambiar_estado/`,
    MATERIAL_ENVIAR_LABORATORIO: (id) => `/almacenes/materiales/${id}/enviar_laboratorio/`,
    MATERIAL_RETORNAR_LABORATORIO: (id) => `/almacenes/materiales/${id}/retornar_laboratorio/`,

    // Búsquedas y validaciones
    MATERIAL_BUSQUEDA_AVANZADA: '/almacenes/materiales/busqueda_avanzada/',
    MATERIAL_VALIDAR_UNICIDAD: '/almacenes/materiales/validar_unicidad/',
    MATERIALES_DISPONIBLES_ASIGNACION: '/almacenes/materiales/disponibles_para_asignacion/',

    // Operaciones masivas
    MATERIAL_OPERACION_MASIVA: '/almacenes/materiales/operacion_masiva/',
    MATERIALES_ESTADISTICAS: '/almacenes/materiales/estadisticas/',

    // === TRASPASOS ===
    TRASPASOS: '/almacenes/traspasos/',
    TRASPASO_DETAIL: (id) => `/almacenes/traspasos/${id}/`,
    TRASPASO_ENVIAR: (id) => `/almacenes/traspasos/${id}/enviar/`,
    TRASPASO_RECIBIR: (id) => `/almacenes/traspasos/${id}/recibir/`,
    TRASPASO_CANCELAR: (id) => `/almacenes/traspasos/${id}/cancelar/`,
    TRASPASO_MATERIALES: (id) => `/almacenes/traspasos/${id}/materiales_detalle/`,
    TRASPASOS_ESTADISTICAS: '/almacenes/traspasos/estadisticas/',

    // === DEVOLUCIONES ===
    DEVOLUCIONES: '/almacenes/devoluciones/',
    DEVOLUCION_DETAIL: (id) => `/almacenes/devoluciones/${id}/`,
    DEVOLUCION_ENVIAR: (id) => `/almacenes/devoluciones/${id}/enviar_proveedor/`,
    DEVOLUCION_CONFIRMAR: (id) => `/almacenes/devoluciones/${id}/confirmar_respuesta/`,
    DEVOLUCION_MATERIALES: (id) => `/almacenes/devoluciones/${id}/materiales_detalle/`,
    DEVOLUCIONES_ESTADISTICAS: '/almacenes/devoluciones/estadisticas/',

    // === LABORATORIO ===
    LABORATORIO: '/almacenes/laboratorio/',
    LABORATORIO_MASIVO: '/almacenes/laboratorio/masivo/',
    LABORATORIO_CONSULTAS: '/almacenes/laboratorio/consultas/',

    // === IMPORTACIÓN ===
    IMPORTACION_MASIVA: '/almacenes/importacion/masiva/',

    // === REPORTES Y ESTADÍSTICAS ===
    ESTADISTICAS_GENERALES: '/almacenes/estadisticas/',
    DASHBOARD: '/almacenes/dashboard/',
    REPORTE_INVENTARIO: '/almacenes/reportes/inventario/',
    REPORTE_MOVIMIENTOS: '/almacenes/reportes/movimientos/',
    REPORTE_GARANTIAS: '/almacenes/reportes/garantias/',
    REPORTE_EFICIENCIA: '/almacenes/reportes/eficiencia/',

    // === MODELOS BÁSICOS ===
    // Marcas
    MARCAS: '/almacenes/marcas/',
    MARCA_DETAIL: (id) => `/almacenes/marcas/${id}/`,
    MARCA_TOGGLE_ACTIVO: (id) => `/almacenes/marcas/${id}/toggle_activo/`,
    MARCA_MODELOS_ACTIVOS: (id) => `/almacenes/marcas/${id}/modelos_activos/`,

    // Tipos de Equipo
    TIPOS_EQUIPO: '/almacenes/tipos-equipo/',
    TIPO_EQUIPO_DETAIL: (id) => `/almacenes/tipos-equipo/${id}/`,
    TIPO_EQUIPO_TOGGLE_ACTIVO: (id) => `/almacenes/tipos-equipo/${id}/toggle_activo/`,

    // Modelos
    MODELOS: '/almacenes/modelos/',
    MODELO_DETAIL: (id) => `/almacenes/modelos/${id}/`,
    MODELO_MATERIALES_NUEVOS: (id) => `/almacenes/modelos/${id}/materiales_nuevos/`,
    MODELO_EQUIPOS_LEGACY: (id) => `/almacenes/modelos/${id}/equipos_legacy/`,
    MODELO_TOGGLE_ACTIVO: (id) => `/almacenes/modelos/${id}/toggle_activo/`,

    // Componentes
    COMPONENTES: '/almacenes/componentes/',
    COMPONENTE_DETAIL: (id) => `/almacenes/componentes/${id}/`,
    COMPONENTE_TOGGLE_ACTIVO: (id) => `/almacenes/componentes/${id}/toggle_activo/`,
    COMPONENTE_MODELOS_USANDO: (id) => `/almacenes/componentes/${id}/modelos_usando/`,

    // Estados legacy
    ESTADOS_EQUIPO: '/almacenes/estados-equipo/',
    ESTADO_DISTRIBUCION_LEGACY: '/almacenes/estados-equipo/distribucion_legacy/',

    // === COMPATIBILIDAD LEGACY ===
    // Equipos ONU Legacy
    EQUIPOS_ONU: '/almacenes/equipos-onu/',
    EQUIPO_ONU_DETAIL: (id) => `/almacenes/equipos-onu/${id}/`,
    EQUIPO_ONU_HISTORIAL: (id) => `/almacenes/equipos-onu/${id}/historial_servicios/`,
    EQUIPO_ONU_CAMBIAR_ESTADO: (id) => `/almacenes/equipos-onu/${id}/cambiar_estado_legacy/`,
    EQUIPOS_ONU_DISPONIBLES: '/almacenes/equipos-onu/disponibles_legacy/',
    EQUIPOS_ONU_ESTADISTICAS: '/almacenes/equipos-onu/estadisticas_legacy/',

    // Equipo-Servicios
    EQUIPO_SERVICIOS: '/almacenes/equipo-servicios/',
    EQUIPO_SERVICIO_DETAIL: (id) => `/almacenes/equipo-servicios/${id}/`,
    EQUIPO_SERVICIO_DESASIGNAR: (id) => `/almacenes/equipo-servicios/${id}/desasignar/`,
    EQUIPOS_POR_CONTRATO: '/almacenes/equipo-servicios/por_contrato/',
};

// ========== GRUPOS ORGANIZADOS (OPCIONAL) ==========

// Puedes exportar grupos para mejor organización
export const AUTH_ENDPOINTS = {
    LOGIN: ENDPOINTS.LOGIN,
    LOGOUT: ENDPOINTS.LOGOUT,
    CHANGE_PASSWORD: ENDPOINTS.CHANGE_PASSWORD,
    REFRESH_TOKEN: ENDPOINTS.REFRESH_TOKEN,
};

export const USER_ENDPOINTS = {
    USUARIOS: ENDPOINTS.USUARIOS,
    USUARIO_DETAIL: ENDPOINTS.USUARIO_DETAIL,
    ACTIVAR_USUARIO: ENDPOINTS.ACTIVAR_USUARIO,
    DESACTIVAR_USUARIO: ENDPOINTS.DESACTIVAR_USUARIO,
    RESETEAR_PASSWORD_USUARIO: ENDPOINTS.RESETEAR_PASSWORD_USUARIO,
    CAMBIAR_ROL_USUARIO: ENDPOINTS.CAMBIAR_ROL_USUARIO,
    DESBLOQUEAR_USUARIO: ENDPOINTS.DESBLOQUEAR_USUARIO,
    RESTAURAR_USUARIO: ENDPOINTS.RESTAURAR_USUARIO,
    // ... otros endpoints de usuarios
};

export const ALMACEN_ENDPOINTS = {
    ALMACENES: ENDPOINTS.ALMACENES,
    ALMACEN_DETAIL: ENDPOINTS.ALMACEN_DETAIL,
    ALMACEN_MATERIALES: ENDPOINTS.ALMACEN_MATERIALES,
    ALMACEN_ESTADISTICAS: ENDPOINTS.ALMACEN_ESTADISTICAS,
    // ... otros endpoints de almacenes
};

// Exportación por defecto
export default ENDPOINTS;