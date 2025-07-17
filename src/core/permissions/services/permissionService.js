import api from '../../../services/api';
import ENDPOINTS, { buildQuery } from '../../../services/endpoints';

class PermissionService {

    // ========== PERMISOS ==========

    async getPermissions(params = {}) {
        try {
            const queryString = buildQuery(params);
            const response = await api.get(`${ENDPOINTS.PERMISOS}${queryString}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Get permissions error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Error al obtener permisos'
            };
        }
    }

    async createPermission(permissionData) {
        try {
            const response = await api.post(ENDPOINTS.PERMISOS, permissionData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Create permission error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Error al crear permiso'
            };
        }
    }

    async updatePermission(id, permissionData) {
        try {
            const response = await api.patch(ENDPOINTS.PERMISO_DETAIL(id), permissionData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Update permission error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Error al actualizar permiso'
            };
        }
    }

    async deletePermission(id) {
        try {
            const response = await api.delete(ENDPOINTS.PERMISO_DETAIL(id));
            return {
                success: true,
                message: response.data.message
            };
        } catch (error) {
            console.error('Delete permission error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Error al eliminar permiso'
            };
        }
    }

    async restorePermission(id) {
        try {
            const response = await api.post(ENDPOINTS.RESTAURAR_PERMISO(id));
            return {
                success: true,
                message: response.data.message
            };
        } catch (error) {
            console.error('Restore permission error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Error al restaurar permiso'
            };
        }
    }

    async getAvailableResources() {
        try {
            const response = await api.get(ENDPOINTS.RECURSOS_DISPONIBLES);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Get resources error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Error al obtener recursos'
            };
        }
    }

    async getAvailableActions() {
        try {
            const response = await api.get(ENDPOINTS.ACCIONES_DISPONIBLES);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Get actions error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Error al obtener acciones'
            };
        }
    }

    // ========== ROLES ==========

    async getRoles(params = {}) {
        try {
            const queryString = buildQuery(params);
            const response = await api.get(`${ENDPOINTS.ROLES}${queryString}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Get roles error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Error al obtener roles'
            };
        }
    }

    async createRole(roleData) {
        try {
            const response = await api.post(ENDPOINTS.ROLES, roleData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Create role error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Error al crear rol'
            };
        }
    }

    async updateRole(id, roleData) {
        try {
            const response = await api.patch(ENDPOINTS.ROLE_DETAIL(id), roleData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Update role error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Error al actualizar rol'
            };
        }
    }

    async deleteRole(id) {
        try {
            const response = await api.delete(ENDPOINTS.ROLE_DETAIL(id));
            return {
                success: true,
                message: response.data.message
            };
        } catch (error) {
            console.error('Delete role error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Error al eliminar rol'
            };
        }
    }

    async restoreRole(id) {
        try {
            const response = await api.post(ENDPOINTS.RESTAURAR_ROL(id));
            return {
                success: true,
                message: response.data.message
            };
        } catch (error) {
            console.error('Restore role error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Error al restaurar rol'
            };
        }
    }

    async cloneRole(id, newRoleData) {
        try {
            const response = await api.post(ENDPOINTS.CLONAR_ROL(id), newRoleData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Clone role error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Error al clonar rol'
            };
        }
    }

    async getRoleUsers(id) {
        try {
            const response = await api.get(ENDPOINTS.USUARIOS_ROL(id));
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Get role users error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Error al obtener usuarios del rol'
            };
        }
    }

    // ========== USUARIOS ==========

    async getUsers(params = {}) {
        try {
            const queryString = buildQuery(params);
            const response = await api.get(`${ENDPOINTS.USUARIOS}${queryString}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Get users error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Error al obtener usuarios'
            };
        }
    }

    async createUser(userData) {
        try {
            const response = await api.post(ENDPOINTS.USUARIOS, userData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Create user error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Error al crear usuario'
            };
        }
    }

    async updateUser(id, userData) {
        try {
            const response = await api.patch(ENDPOINTS.USUARIO_DETAIL(id), userData);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Update user error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Error al actualizar usuario'
            };
        }
    }

    async deleteUser(id) {
        try {
            const response = await api.delete(ENDPOINTS.USUARIO_DETAIL(id));
            return {
                success: true,
                message: response.data.message
            };
        } catch (error) {
            console.error('Delete user error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Error al eliminar usuario'
            };
        }
    }

    async activateUser(id) {
        try {
            const response = await api.post(ENDPOINTS.ACTIVAR_USUARIO(id));
            return {
                success: true,
                message: response.data.message
            };
        } catch (error) {
            console.error('Activate user error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Error al activar usuario'
            };
        }
    }

    async deactivateUser(id) {
        try {
            const response = await api.post(ENDPOINTS.DESACTIVAR_USUARIO(id));
            return {
                success: true,
                message: response.data.message
            };
        } catch (error) {
            console.error('Deactivate user error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Error al desactivar usuario'
            };
        }
    }

    async resetUserPassword(id, data = {}) {
        try {
            const response = await api.post(ENDPOINTS.RESETEAR_PASSWORD_USUARIO(id), data);
            return {
                success: true,
                message: response.data.message
            };
        } catch (error) {
            console.error('Reset password error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Error al resetear contraseña'
            };
        }
    }

    async changeUserRole(id, roleData) {
        try {
            const response = await api.post(ENDPOINTS.CAMBIAR_ROL_USUARIO(id), roleData);
            return {
                success: true,
                message: response.data.message
            };
        } catch (error) {
            console.error('Change role error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Error al cambiar rol'
            };
        }
    }

    async unlockUser(id) {
        try {
            const response = await api.post(ENDPOINTS.DESBLOQUEAR_USUARIO(id));
            return {
                success: true,
                message: response.data.message
            };
        } catch (error) {
            console.error('Unlock user error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Error al desbloquear usuario'
            };
        }
    }

    async validateCotel(codigocotel) {
        try {
            const response = await api.post(ENDPOINTS.VALIDAR_COTEL, { codigocotel });
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Validate cotel error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Error al validar código COTEL'
            };
        }
    }

    async generateCotel() {
        try {
            const response = await api.post(ENDPOINTS.GENERAR_COTEL);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Generate cotel error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Error al generar código COTEL'
            };
        }
    }

    // ========== ESTADÍSTICAS ==========

    async getStatistics() {
        try {
            const response = await api.get(ENDPOINTS.ESTADISTICAS);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Get statistics error:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Error al obtener estadísticas'
            };
        }
    }
}

const permissionService = new PermissionService();
export default permissionService;