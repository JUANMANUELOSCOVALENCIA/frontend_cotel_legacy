import React from 'react';
import { usePermissions } from '../hooks/usePermissions';

/**
 * Componente para controlar la visibilidad basada en permisos
 *
 * @param {Object} props
 * @param {string|Object} props.recurso - Recurso requerido (ej: 'usuarios') o objeto {recurso, accion}
 * @param {string} props.accion - Acción requerida (ej: 'crear', 'leer', 'actualizar', 'eliminar')
 * @param {string} props.role - Rol específico requerido
 * @param {Array} props.permissions - Array de permisos específicos [{recurso, accion}]
 * @param {Array} props.roles - Array de roles permitidos
 * @param {boolean} props.requireAll - Si se requieren TODOS los permisos (default: false - solo uno)
 * @param {React.ReactNode} props.children - Contenido a renderizar si tiene permisos
 * @param {React.ReactNode} props.fallback - Contenido alternativo si no tiene permisos
 * @param {Function} props.onUnauthorized - Callback cuando no tiene permisos
 */
const Permission = ({
                        recurso,
                        accion = 'leer',
                        role,
                        permissions = [],
                        roles = [],
                        requireAll = false,
                        children,
                        fallback = null,
                        onUnauthorized,
                    }) => {
    const { hasPermission, hasRole, hasAnyPermission, isSuperuser } = usePermissions();

    // Superusuarios tienen acceso completo
    if (isSuperuser) {
        return children;
    }

    let hasAccess = false;

    // Verificar por recurso y acción individual
    if (recurso) {
        if (typeof recurso === 'object') {
            hasAccess = hasPermission(recurso.recurso, recurso.accion);
        } else {
            hasAccess = hasPermission(recurso, accion);
        }
    }

    // Verificar por rol específico
    if (role && !hasAccess) {
        hasAccess = hasRole(role);
    }

    // Verificar por array de roles
    if (roles.length > 0 && !hasAccess) {
        hasAccess = roles.some(r => hasRole(r));
    }

    // Verificar por array de permisos
    if (permissions.length > 0 && !hasAccess) {
        if (requireAll) {
            hasAccess = permissions.every(perm =>
                hasPermission(perm.recurso, perm.accion)
            );
        } else {
            hasAccess = hasAnyPermission(permissions);
        }
    }

    // Ejecutar callback si no tiene permisos
    if (!hasAccess && onUnauthorized) {
        onUnauthorized();
    }

    return hasAccess ? children : fallback;
};

/**
 * Hook para usar permisos de forma condicional
 */
export const useConditionalPermission = (recurso, accion = 'leer') => {
    const { hasPermission, isSuperuser } = usePermissions();

    return isSuperuser || hasPermission(recurso, accion);
};

/**
 * Componente HOC para proteger componentes con permisos
 */
export const withPermission = (WrappedComponent, permissionConfig) => {
    return function PermissionProtectedComponent(props) {
        return (
            <Permission {...permissionConfig}>
                <WrappedComponent {...props} />
            </Permission>
        );
    };
};

export default Permission;