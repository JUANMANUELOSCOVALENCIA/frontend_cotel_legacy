import React, { useState, useEffect, useCallback } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Typography,
    Button,
    Input,
    Select,
    Option,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Chip,
    IconButton,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Alert,
    Progress,
    Badge,
    Tooltip,
} from '@material-tailwind/react';
import {
    IoAdd,
    IoSearch,
    IoFilter,
    IoDownload,
    IoRefresh,
    IoEllipsisVertical,
    IoEye,
    IoCreate,
    IoTrash,
    IoCheckmarkCircle,
    IoCloseCircle,
    IoKey,
    IoShieldCheckmark,
    IoLockOpen,
    IoPersonAdd,
    IoWarning,
    IoCheckmark,
    IoClose,
} from 'react-icons/io5';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useUsersCRUD, useRolesCRUD } from '../hooks/usePermissions';
import Permission from '../components/Permission';
import Loader from '../../layout/Loader';

const Users = () => {
    // States
    const [selectedUser, setSelectedUser] = useState(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showMigrateDialog, setShowMigrateDialog] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        rol: '',
        tipo: '',
        is_active: '',
        password_status: '',
    });
    const [currentPage, setCurrentPage] = useState(1);

    // Hooks
    const {
        users,
        loading: usersLoading,
        error: usersError,
        pagination,
        loadUsers,
        createUser,
        updateUser,
        deleteUser,
        activateUser,
        deactivateUser,
        resetUserPassword,
        changeUserRole,
        unlockUser,
        restoreUser,
        clearError: clearUsersError,
    } = useUsersCRUD();

    const {
        roles,
        loading: rolesLoading,
        loadRoles,
    } = useRolesCRUD();

    // Form
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
        watch,
    } = useForm();

    // Load data on mount
    useEffect(() => {
        loadUsers({ page: currentPage, ...filters });
        loadRoles({ page_size: 100 });
    }, [currentPage, filters, loadUsers, loadRoles]);

    // Handlers
    const handleSearch = useCallback((value) => {
        setFilters(prev => ({ ...prev, search: value }));
        setCurrentPage(1);
    }, []);

    const handleFilterChange = useCallback((key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    }, []);

    const handleCreateUser = async (data) => {
        const result = await createUser(data);
        if (result.success) {
            toast.success('Usuario creado correctamente');
            setShowCreateDialog(false);
            reset();
        } else {
            toast.error(result.error);
        }
    };

    const handleEditUser = async (data) => {
        const result = await updateUser(selectedUser.id, data);
        if (result.success) {
            toast.success('Usuario actualizado correctamente');
            setShowEditDialog(false);
            setSelectedUser(null);
            reset();
        } else {
            toast.error(result.error);
        }
    };

    const handleUserAction = async (action, user) => {
        let result;

        switch (action) {
            case 'activate':
                result = await activateUser(user.id);
                break;
            case 'deactivate':
                result = await deactivateUser(user.id);
                break;
            case 'delete':
                result = await deleteUser(user.id);
                break;
            case 'resetPassword':
                result = await resetUserPassword(user.id, {
                    motivo: 'Reseteo solicitado por administrador'
                });
                break;
            case 'unlock':
                result = await unlockUser(user.id);
                break;
            case 'restore':
                result = await restoreUser(user.id);
                break;
            default:
                return;
        }

        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.error);
        }
        setConfirmAction(null);
        setShowConfirmDialog(false);
    };

    const handleChangeRole = async (userId, roleId) => {
        const result = await changeUserRole(userId, { rol_id: roleId });
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.error);
        }
    };

    const openConfirmDialog = (action, user) => {
        setConfirmAction({ action, user });
        setShowConfirmDialog(true);
    };

    const getUserStatusColor = (user) => {
        if (!user.is_active) return 'red';
        if (user.esta_bloqueado) return 'orange';
        if (user.estado_password === 'reset_requerido') return 'yellow';
        if (user.estado_password === 'cambio_requerido') return 'blue';
        return 'green';
    };

    const getUserStatusText = (user) => {
        if (!user.is_active) return 'Inactivo';
        if (user.esta_bloqueado) return 'Bloqueado';
        if (user.estado_password === 'reset_requerido') return 'Reset Requerido';
        if (user.estado_password === 'cambio_requerido') return 'Cambio Requerido';
        return 'Activo';
    };

    const getActionText = (action) => {
        switch (action) {
            case 'activate': return 'activar';
            case 'deactivate': return 'desactivar';
            case 'delete': return 'eliminar';
            case 'resetPassword': return 'resetear la contraseña de';
            case 'unlock': return 'desbloquear';
            case 'restore': return 'restaurar';
            default: return '';
        }
    };

    if (usersLoading && users.length === 0) {
        return <Loader message="Cargando usuarios..." />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <Typography variant="h3" color="blue-gray">
                        Gestión de Usuarios
                    </Typography>
                    <Typography color="gray" className="mt-1">
                        Administra usuarios del sistema COTEL
                    </Typography>
                </div>

                <div className="flex items-center gap-2">
                    <Permission recurso="usuarios" accion="crear">
                        <Button
                            className="flex items-center gap-2"
                            color="orange"
                            onClick={() => setShowCreateDialog(true)}
                        >
                            <IoAdd className="h-5 w-5" />
                            Crear Usuario
                        </Button>
                    </Permission>

                    <Permission recurso="empleados" accion="leer">
                        <Button
                            variant="outlined"
                            className="flex items-center gap-2"
                            onClick={() => setShowMigrateDialog(true)}
                        >
                            <IoPersonAdd className="h-5 w-5" />
                            Migrar Empleado
                        </Button>
                    </Permission>
                </div>
            </div>

            {/* Error Alert */}
            {usersError && (
                <Alert color="red" dismissible onClose={clearUsersError}>
                    {usersError}
                </Alert>
            )}

            {/* Filters */}
            <Card>
                <CardBody className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="md:col-span-2">
                            <Input
                                label="Buscar usuarios"
                                icon={<IoSearch />}
                                value={filters.search}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Nombre, apellido o código COTEL"
                            />
                        </div>

                        <Select
                            label="Rol"
                            value={filters.rol}
                            onChange={(value) => handleFilterChange('rol', value)}
                        >
                            <Option value="">Todos los roles</Option>
                            {roles.map((role) => (
                                <Option key={role.id} value={role.id.toString()}>
                                    {role.nombre}
                                </Option>
                            ))}
                        </Select>

                        <Select
                            label="Tipo"
                            value={filters.tipo}
                            onChange={(value) => handleFilterChange('tipo', value)}
                        >
                            <Option value="">Todos</Option>
                            <Option value="manual">Manual</Option>
                            <Option value="migrado">Migrado</Option>
                        </Select>

                        <Select
                            label="Estado"
                            value={filters.is_active}
                            onChange={(value) => handleFilterChange('is_active', value)}
                        >
                            <Option value="">Todos</Option>
                            <Option value="true">Activos</Option>
                            <Option value="false">Inactivos</Option>
                        </Select>
                    </div>
                </CardBody>
            </Card>

            {/* Users Table */}
            <Card>
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="flex items-center justify-between">
                        <Typography variant="h6" color="blue-gray">
                            Usuarios ({pagination.count})
                        </Typography>

                        <div className="flex items-center gap-2">
                            <IconButton variant="text" onClick={() => loadUsers({ page: currentPage, ...filters })}>
                                <IoRefresh className="h-4 w-4" />
                            </IconButton>

                            <Permission recurso="usuarios" accion="leer">
                                <IconButton variant="text">
                                    <IoDownload className="h-4 w-4" />
                                </IconButton>
                            </Permission>
                        </div>
                    </div>
                </CardHeader>

                <CardBody className="overflow-x-auto px-0">
                    {usersLoading ? (
                        <div className="flex justify-center py-8">
                            <Progress size="sm" value={70} color="orange" className="w-32" />
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-8">
                            <Typography color="gray">No se encontraron usuarios</Typography>
                        </div>
                    ) : (
                        <table className="w-full min-w-max table-auto text-left">
                            <thead>
                            <tr>
                                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                    <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                        Usuario
                                    </Typography>
                                </th>
                                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                    <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                        Rol
                                    </Typography>
                                </th>
                                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                    <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                        Tipo
                                    </Typography>
                                </th>
                                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                    <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                        Estado
                                    </Typography>
                                </th>
                                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                    <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                        Último Login
                                    </Typography>
                                </th>
                                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                    <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                        Acciones
                                    </Typography>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <Typography variant="small" color="blue-gray" className="font-medium">
                                                {user.nombre_completo}
                                            </Typography>
                                            <Typography variant="small" color="gray" className="font-normal">
                                                COTEL: {user.codigocotel}
                                            </Typography>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <Chip
                                                variant="ghost"
                                                size="sm"
                                                value={user.rol_nombre || 'Sin rol'}
                                                color={user.rol_nombre ? 'blue' : 'gray'}
                                            />
                                            {user.rol_nombre && (
                                                <Menu>
                                                    <MenuHandler>
                                                        <IconButton variant="text" size="sm">
                                                            <IoCreate className="h-3 w-3" />
                                                        </IconButton>
                                                    </MenuHandler>
                                                    <MenuList>
                                                        {roles.map((role) => (
                                                            <MenuItem
                                                                key={role.id}
                                                                onClick={() => handleChangeRole(user.id, role.id)}
                                                                className={user.rol_nombre === role.nombre ? 'bg-blue-50' : ''}
                                                            >
                                                                {role.nombre}
                                                            </MenuItem>
                                                        ))}
                                                    </MenuList>
                                                </Menu>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <Chip
                                            variant="ghost"
                                            size="sm"
                                            value={user.tipo_usuario === 'manual' ? 'Manual' : 'Migrado'}
                                            color={user.tipo_usuario === 'manual' ? 'green' : 'blue'}
                                        />
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1">
                                            <Chip
                                                variant="ghost"
                                                size="sm"
                                                value={getUserStatusText(user)}
                                                color={getUserStatusColor(user)}
                                            />
                                            {user.intentos_login_fallidos > 0 && (
                                                <Typography variant="small" color="red" className="text-xs">
                                                    {user.intentos_login_fallidos} intentos fallidos
                                                </Typography>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <Typography variant="small" color="gray">
                                            {user.last_login
                                                ? new Date(user.last_login).toLocaleDateString('es-ES')
                                                : 'Nunca'
                                            }
                                        </Typography>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <Permission recurso="usuarios" accion="leer">
                                                <Tooltip content="Ver detalles">
                                                    <IconButton variant="text" size="sm">
                                                        <IoEye className="h-4 w-4" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Permission>

                                            <Permission recurso="usuarios" accion="actualizar">
                                                <Tooltip content="Editar">
                                                    <IconButton
                                                        variant="text"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedUser(user);
                                                            setShowEditDialog(true);
                                                            reset(user);
                                                        }}
                                                    >
                                                        <IoCreate className="h-4 w-4" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Permission>

                                            <Menu>
                                                <MenuHandler>
                                                    <IconButton variant="text" size="sm">
                                                        <IoEllipsisVertical className="h-4 w-4" />
                                                    </IconButton>
                                                </MenuHandler>
                                                <MenuList>
                                                    <Permission recurso="usuarios" accion="actualizar">
                                                        {user.is_active ? (
                                                            <MenuItem
                                                                className="flex items-center gap-2 text-red-500"
                                                                onClick={() => openConfirmDialog('deactivate', user)}
                                                            >
                                                                <IoCloseCircle className="h-4 w-4" />
                                                                Desactivar
                                                            </MenuItem>
                                                        ) : (
                                                            <MenuItem
                                                                className="flex items-center gap-2 text-green-500"
                                                                onClick={() => openConfirmDialog('activate', user)}
                                                            >
                                                                <IoCheckmarkCircle className="h-4 w-4" />
                                                                Activar
                                                            </MenuItem>
                                                        )}

                                                        <MenuItem
                                                            className="flex items-center gap-2"
                                                            onClick={() => openConfirmDialog('resetPassword', user)}
                                                        >
                                                            <IoKey className="h-4 w-4" />
                                                            Resetear Contraseña
                                                        </MenuItem>

                                                        {user.esta_bloqueado && (
                                                            <MenuItem
                                                                className="flex items-center gap-2 text-blue-500"
                                                                onClick={() => openConfirmDialog('unlock', user)}
                                                            >
                                                                <IoLockOpen className="h-4 w-4" />
                                                                Desbloquear
                                                            </MenuItem>
                                                        )}
                                                    </Permission>

                                                    <Permission recurso="usuarios" accion="eliminar">
                                                        <MenuItem
                                                            className="flex items-center gap-2 text-red-500"
                                                            onClick={() => openConfirmDialog('delete', user)}
                                                        >
                                                            <IoTrash className="h-4 w-4" />
                                                            Eliminar
                                                        </MenuItem>
                                                    </Permission>
                                                </MenuList>
                                            </Menu>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </CardBody>
            </Card>

            {/* Pagination */}
            {pagination.count > 20 && (
                <div className="flex items-center justify-between">
                    <Typography variant="small" color="gray">
                        Mostrando {users.length} de {pagination.count} usuarios
                    </Typography>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outlined"
                            size="sm"
                            disabled={!pagination.previous}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                            Anterior
                        </Button>
                        <Button
                            variant="outlined"
                            size="sm"
                            disabled={!pagination.next}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                            Siguiente
                        </Button>
                    </div>
                </div>
            )}

            {/* Create User Dialog */}
            <Dialog open={showCreateDialog} handler={() => setShowCreateDialog(false)} size="md">
                <DialogHeader>Crear Usuario</DialogHeader>
                <form onSubmit={handleSubmit(handleCreateUser)}>
                    <DialogBody divider className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Nombres *"
                                {...register('nombres', {
                                    required: 'Los nombres son obligatorios',
                                    minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                                })}
                                error={!!errors.nombres}
                            />
                            <Input
                                label="Apellido Paterno *"
                                {...register('apellidopaterno', {
                                    required: 'El apellido paterno es obligatorio',
                                    minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                                })}
                                error={!!errors.apellidopaterno}
                            />
                            <Input
                                label="Apellido Materno *"
                                {...register('apellidomaterno', {
                                    required: 'El apellido materno es obligatorio',
                                    minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                                })}
                                error={!!errors.apellidomaterno}
                            />
                            <Controller
                                name="rol"
                                control={control}
                                rules={{ required: 'El rol es obligatorio' }}
                                render={({ field }) => (
                                    <Select
                                        label="Rol *"
                                        value={field.value}
                                        onChange={(value) => field.onChange(value)}
                                        error={!!errors.rol}
                                    >
                                        {roles.map((role) => (
                                            <Option key={role.id} value={role.id.toString()}>
                                                {role.nombre}
                                            </Option>
                                        ))}
                                    </Select>
                                )}
                            />
                        </div>

                        {Object.keys(errors).length > 0 && (
                            <Alert color="red">
                                {Object.values(errors).map((error, index) => (
                                    <div key={index}>{error.message}</div>
                                ))}
                            </Alert>
                        )}
                    </DialogBody>
                    <DialogFooter className="space-x-2">
                        <Button
                            variant="text"
                            color="gray"
                            onClick={() => {
                                setShowCreateDialog(false);
                                reset();
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" color="orange" loading={usersLoading}>
                            Crear Usuario
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={showEditDialog} handler={() => setShowEditDialog(false)} size="md">
                <DialogHeader>Editar Usuario</DialogHeader>
                <form onSubmit={handleSubmit(handleEditUser)}>
                    <DialogBody divider className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Nombres *"
                                {...register('nombres', {
                                    required: 'Los nombres son obligatorios',
                                    minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                                })}
                                error={!!errors.nombres}
                            />
                            <Input
                                label="Apellido Paterno *"
                                {...register('apellidopaterno', {
                                    required: 'El apellido paterno es obligatorio',
                                    minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                                })}
                                error={!!errors.apellidopaterno}
                            />
                            <Input
                                label="Apellido Materno *"
                                {...register('apellidomaterno', {
                                    required: 'El apellido materno es obligatorio',
                                    minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                                })}
                                error={!!errors.apellidomaterno}
                            />
                            <Controller
                                name="rol"
                                control={control}
                                rules={{ required: 'El rol es obligatorio' }}
                                render={({ field }) => (
                                    <Select
                                        label="Rol *"
                                        value={field.value?.toString()}
                                        onChange={(value) => field.onChange(parseInt(value))}
                                        error={!!errors.rol}
                                    >
                                        {roles.map((role) => (
                                            <Option key={role.id} value={role.id.toString()}>
                                                {role.nombre}
                                            </Option>
                                        ))}
                                    </Select>
                                )}
                            />
                        </div>

                        {selectedUser && (
                            <Alert color="blue" className="mt-4">
                                <Typography variant="small">
                                    Código COTEL: {selectedUser.codigocotel}
                                    {selectedUser.tipo_usuario === 'migrado' && (
                                        <span className="ml-2 text-xs">(Usuario migrado - datos limitados)</span>
                                    )}
                                </Typography>
                            </Alert>
                        )}

                        {Object.keys(errors).length > 0 && (
                            <Alert color="red">
                                {Object.values(errors).map((error, index) => (
                                    <div key={index}>{error.message}</div>
                                ))}
                            </Alert>
                        )}
                    </DialogBody>
                    <DialogFooter className="space-x-2">
                        <Button
                            variant="text"
                            color="gray"
                            onClick={() => {
                                setShowEditDialog(false);
                                setSelectedUser(null);
                                reset();
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" color="orange" loading={usersLoading}>
                            Actualizar Usuario
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>

            {/* Migrate Employee Dialog */}
            <Dialog open={showMigrateDialog} handler={() => setShowMigrateDialog(false)} size="md">
                <DialogHeader>Migrar Empleado</DialogHeader>
                <DialogBody divider>
                    <Typography color="gray" className="mb-4">
                        Funcionalidad para migrar empleados desde el sistema legacy.
                    </Typography>
                    <Alert color="amber">
                        <Typography variant="small">
                            Esta funcionalidad estará disponible próximamente.
                        </Typography>
                    </Alert>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="gray"
                        onClick={() => setShowMigrateDialog(false)}
                    >
                        Cerrar
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* Confirmation Dialog */}
            <Dialog open={showConfirmDialog} handler={() => setShowConfirmDialog(false)} size="sm">
                <DialogHeader className="flex items-center gap-2">
                    <IoWarning className="h-6 w-6 text-orange-500" />
                    Confirmar Acción
                </DialogHeader>
                <DialogBody>
                    {confirmAction ? (
                        <div>
                            <Typography>
                                ¿Estás seguro de que deseas {getActionText(confirmAction.action)} al usuario{' '}
                                <strong>{confirmAction.user?.nombre_completo}</strong>?
                            </Typography>

                            {confirmAction.action === 'resetPassword' && (
                                <Typography variant="small" color="gray" className="mt-2">
                                    La nueva contraseña será el código COTEL del usuario.
                                </Typography>
                            )}

                            {confirmAction.action === 'delete' && (
                                <Typography variant="small" color="red" className="mt-2">
                                    Esta acción no se puede deshacer.
                                </Typography>
                            )}
                        </div>
                    ) : (
                        <Typography>
                            Cargando información de la acción...
                        </Typography>
                    )}
                </DialogBody>
                <DialogFooter className="space-x-2">
                    <Button
                        variant="text"
                        color="gray"
                        onClick={() => setShowConfirmDialog(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        color="orange"
                        loading={usersLoading}
                        onClick={() => confirmAction && handleUserAction(confirmAction.action, confirmAction.user)}
                    >
                        Confirmar
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default Users;