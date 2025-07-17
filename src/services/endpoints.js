export const ENDPOINTS = {
    // Autenticación
    LOGIN: '/usuarios/login/',
    LOGOUT: '/usuarios/logout/',
    CHANGE_PASSWORD: '/usuarios/change-password/',
    REFRESH_TOKEN: '/token/refresh/',

    // Usuarios
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

    // Roles
    ROLES: '/usuarios/roles/',
    ROLE_DETAIL: (id) => `/usuarios/roles/${id}/`,
    CLONAR_ROL: (id) => `/usuarios/roles/${id}/clonar/`,
    USUARIOS_ROL: (id) => `/usuarios/roles/${id}/usuarios/`,
    RESTAURAR_ROL: (id) => `/usuarios/roles/${id}/restaurar/`,

    // Permisos
    PERMISOS: '/usuarios/permisos/',
    PERMISO_DETAIL: (id) => `/usuarios/permisos/${id}/`,
    RECURSOS_DISPONIBLES: '/usuarios/permisos/recursos_disponibles/',
    ACCIONES_DISPONIBLES: '/usuarios/permisos/acciones_disponibles/',
    RESTAURAR_PERMISO: (id) => `/usuarios/permisos/${id}/restaurar/`,

    // Empleados FDW
    EMPLEADOS_DISPONIBLES: '/usuarios/empleados-disponibles/',
    ESTADISTICAS_MIGRACION: '/usuarios/empleados-disponibles/estadisticas/',

    // Auditoría
    LOGS: '/usuarios/logs/',
    ESTADISTICAS_LOGS: '/usuarios/logs/estadisticas/',
};

// Helper para construir URLs con parámetros
export const buildUrl = (endpoint, params = {}) => {
    let url = endpoint;

    // Reemplazar parámetros en la URL
    Object.keys(params).forEach(key => {
        url = url.replace(`:${key}`, params[key]);
    });

    return url;
};

// Helper para construir query strings
export const buildQuery = (params = {}) => {
    const cleanParams = Object.entries(params)
        .filter(([_, value]) => value !== null && value !== undefined && value !== '')
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

    const queryString = new URLSearchParams(cleanParams).toString();
    return queryString ? `?${queryString}` : '';
};

export default ENDPOINTS;