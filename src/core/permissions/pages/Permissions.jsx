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
    Textarea,
    Tooltip,
} from '@material-tailwind/react';
import {
    IoAdd,
    IoSearch,
    IoFilter,
    IoRefresh,
    IoEllipsisVertical,
    IoEye,
    IoCreate,
    IoTrash,
    IoShieldCheckmark,
    IoWarning,
    IoCheckmark,
    IoClose,
    IoKey,
    IoLockClosed,
} from 'react-icons/io5';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { usePermissionsCRUD, useResourcesAndActions } from '../hooks/usePermissions';
import Permission from '../components/Permission';
import Loader from '../../layout/Loader';

const Permissions = () => {
    // States
    const [selectedPermission, setSelectedPermission] = useState(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showViewDialog, setShowViewDialog] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        recurso: '',
        accion: '',
        activo: '',
    });
    const [currentPage, setCurrentPage] = useState(1);

    // Hooks
    const {
        permissions,
        loading: permissionsLoading,
        error: permissionsError,
        pagination,
        loadPermissions,
        createPermission,
        updatePermission,
        deletePermission,
        restorePermission,
        clearError: clearPermissionsError,
    } = usePermissionsCRUD();

    const {
        resources,
        actions,
        loading: resourcesLoading,
    } = useResourcesAndActions();

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
        loadPermissions({ page: currentPage, ...filters });
    }, [currentPage, filters, loadPermissions]);

    // Group permissions by resource
    const groupedPermissions = permissions.reduce((acc, permission) => {
        if (!acc[permission.recurso]) {
            acc[permission.recurso] = [];
        }
        acc[permission.recurso].push(permission);
        return acc;
    }, {});

    // Handlers
    const handleSearch = useCallback((value) => {
        setFilters(prev => ({ ...prev, search: value }));
        setCurrentPage(1);
    }, []);

    const handleFilterChange = useCallback((key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    }, []);

    const handleCreatePermission = async (data) => {
        const result = await createPermission(data);
        if (result.success) {
            toast.success('Permiso creado correctamente');
            setShowCreateDialog(false);
            reset();
        } else {
            toast.error(result.error);
        }
    };

    const handleEditPermission = async (data) => {
        const result = await updatePermission(selectedPermission.id, data);
        if (result.success) {
            toast.success('Permiso actualizado correctamente');
            setShowEditDialog(false);
            setSelectedPermission(null);
            reset();
        } else {
            toast.error(result.error);
        }
    };

    const handleDeletePermission = async (permission) => {
        const result = await deletePermission(permission.id);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.error);
        }
        setConfirmAction(null);
        setShowConfirmDialog(false);
    };

    const handleRestorePermission = async (permission) => {
        const result = await restorePermission(permission.id);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.error);
        }
    };

    const openConfirmDialog = (action, permission) => {
        setConfirmAction({ action, permission });
        setShowConfirmDialog(true);
    };

    const openEditDialog = (permission) => {
        setSelectedPermission(permission);
        reset({
            recurso: permission.recurso,
            accion: permission.accion,
            descripcion: permission.descripcion,
            activo: permission.activo,
        });
        setShowEditDialog(true);
    };

    const openViewDialog = (permission) => {
        setSelectedPermission(permission);
        setShowViewDialog(true);
    };

    const getPermissionColor = (permission) => {
        if (!permission.activo) return 'red';
        if (permission.esta_en_uso) return 'green';
        return 'gray';
    };

    const getActionColor = (action) => {
        const colors = {
            'crear': 'green',
            'leer': 'blue',
            'actualizar': 'orange',
            'eliminar': 'red',
        };
        return colors[action] || 'gray';
    };

    if (permissionsLoading && permissions.length === 0) {
        return <Loader message="Cargando permisos..." />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <Typography variant="h3" color="blue-gray">
                        Gestión de Permisos
                    </Typography>
                    <Typography color="gray" className="mt-1">
                        Administra permisos granulares del sistema
                    </Typography>
                </div>

                <Permission recurso="permisos" accion="crear">
                    <Button
                        className="flex items-center gap-2"
                        color="orange"
                        onClick={() => {
                            reset();
                            setShowCreateDialog(true);
                        }}
                    >
                        <IoAdd className="h-5 w-5" />
                        Crear Permiso
                    </Button>
                </Permission>
            </div>

            {/* Error Alert */}
            {permissionsError && (
                <Alert color="red" dismissible onClose={clearPermissionsError}>
                    {permissionsError}
                </Alert>
            )}

            {/* Filters */}
            <Card>
                <CardBody className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Input
                            label="Buscar permisos"
                            icon={<IoSearch />}
                            value={filters.search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Recurso o descripción"
                        />

                        <Select
                            label="Recurso"
                            value={filters.recurso}
                            onChange={(value) => handleFilterChange('recurso', value)}
                        >
                            <Option value="">Todos los recursos</Option>
                            {resources.map((resource) => (
                                <Option key={resource} value={resource}>
                                    {resource}
                                </Option>
                            ))}
                        </Select>

                        <Select
                            label="Acción"
                            value={filters.accion}
                            onChange={(value) => handleFilterChange('accion', value)}
                        >
                            <Option value="">Todas las acciones</Option>
                            {actions.map((action) => (
                                <Option key={action} value={action}>
                                    {action}
                                </Option>
                            ))}
                        </Select>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="filter-activo-permisos"
                                    checked={filters.activo === 'true'}
                                    onChange={(e) => handleFilterChange('activo', e.target.checked ? 'true' : '')}
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                />
                                <label htmlFor="filter-activo-permisos" className="ml-2 text-sm text-gray-700">
                                    Solo activos
                                </label>
                            </div>
                            <IconButton
                                variant="text"
                                onClick={() => loadPermissions({ page: currentPage, ...filters })}
                            >
                                <IoRefresh className="h-4 w-4" />
                            </IconButton>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Permissions by Resource */}
            <div className="space-y-6">
                {permissionsLoading ? (
                    <div className="flex justify-center py-8">
                        <Progress size="sm" value={70} color="orange" className="w-32" />
                    </div>
                ) : Object.keys(groupedPermissions).length === 0 ? (
                    <Card>
                        <CardBody className="text-center py-8">
                            <Typography color="gray">No se encontraron permisos</Typography>
                        </CardBody>
                    </Card>
                ) : (
                    Object.entries(groupedPermissions).map(([resource, resourcePermissions]) => (
                        <Card key={resource}>
                            <CardHeader floated={false} shadow={false} className="rounded-none">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <IoKey className="h-6 w-6 text-orange-500" />
                                        <Typography variant="h5" color="blue-gray" className="capitalize">
                                            {resource}
                                        </Typography>
                                        <Chip
                                            variant="ghost"
                                            size="sm"
                                            value={`${resourcePermissions.length} permisos`}
                                            color="blue"
                                        />
                                    </div>
                                </div>
                            </CardHeader>

                            <CardBody className="pt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {resourcePermissions.map((permission) => (
                                        <Card key={permission.id} className="border hover:shadow-md transition-shadow">
                                            <CardBody className="p-4">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <Chip
                                                            variant="ghost"
                                                            size="sm"
                                                            value={permission.accion}
                                                            color={getActionColor(permission.accion)}
                                                            className="capitalize"
                                                        />
                                                        <Chip
                                                            variant="ghost"
                                                            size="sm"
                                                            value={permission.activo ? 'Activo' : 'Inactivo'}
                                                            color={permission.activo ? 'green' : 'red'}
                                                        />
                                                    </div>

                                                    <Menu>
                                                        <MenuHandler>
                                                            <IconButton variant="text" size="sm">
                                                                <IoEllipsisVertical className="h-4 w-4" />
                                                            </IconButton>
                                                        </MenuHandler>
                                                        <MenuList>
                                                            <Permission recurso="permisos" accion="leer">
                                                                <MenuItem
                                                                    className="flex items-center gap-2"
                                                                    onClick={() => openViewDialog(permission)}
                                                                >
                                                                    <IoEye className="h-4 w-4" />
                                                                    Ver Detalles
                                                                </MenuItem>
                                                            </Permission>

                                                            <Permission recurso="permisos" accion="actualizar">
                                                                <MenuItem
                                                                    className="flex items-center gap-2"
                                                                    onClick={() => openEditDialog(permission)}
                                                                >
                                                                    <IoCreate className="h-4 w-4" />
                                                                    Editar
                                                                </MenuItem>
                                                            </Permission>

                                                            <Permission recurso="permisos" accion="eliminar">
                                                                <MenuItem
                                                                    className="flex items-center gap-2 text-red-500"
                                                                    onClick={() => openConfirmDialog('delete', permission)}
                                                                    disabled={permission.esta_en_uso}
                                                                >
                                                                    <IoTrash className="h-4 w-4" />
                                                                    Eliminar
                                                                </MenuItem>
                                                            </Permission>
                                                        </MenuList>
                                                    </Menu>
                                                </div>

                                                <Typography variant="small" color="gray" className="mb-2">
                                                    {permission.descripcion || 'Sin descripción'}
                                                </Typography>

                                                <div className="flex items-center justify-between text-xs text-gray-500">
                                                    <span>
                                                        {permission.esta_en_uso ? 'En uso' : 'No usado'}
                                                    </span>
                                                    <span>
                                                        ID: {permission.id}
                                                    </span>
                                                </div>

                                                {permission.esta_en_uso && (
                                                    <div className="mt-2">
                                                        <Chip
                                                            variant="ghost"
                                                            size="sm"
                                                            value="Asignado a roles"
                                                            color="blue"
                                                            className="text-xs"
                                                        />
                                                    </div>
                                                )}
                                            </CardBody>
                                        </Card>
                                    ))}
                                </div>
                            </CardBody>
                        </Card>
                    ))
                )}
            </div>

            {/* Pagination */}
            {pagination.count > 20 && (
                <div className="flex items-center justify-between">
                    <Typography variant="small" color="gray">
                        Mostrando {permissions.length} de {pagination.count} permisos
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

            {/* Create Permission Dialog */}
            <Dialog open={showCreateDialog} handler={() => setShowCreateDialog(false)} size="md">
                <DialogHeader>Crear Permiso</DialogHeader>
                <form onSubmit={handleSubmit(handleCreatePermission)}>
                    <DialogBody divider className="space-y-4">
                        <Alert color="blue">
                            <Typography variant="small">
                                Los permisos controlan el acceso a recursos específicos del sistema.
                                Define claramente el recurso y la acción que este permiso controlará.
                            </Typography>
                        </Alert>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Input
                                    label="Recurso *"
                                    {...register('recurso', {
                                        required: 'El recurso es obligatorio',
                                        minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                                        pattern: {
                                            value: /^[a-z0-9\-_]+$/,
                                            message: 'Solo letras minúsculas, números, guiones y guiones bajos'
                                        }
                                    })}
                                    error={!!errors.recurso}
                                    placeholder="ej: usuarios, productos, reportes"
                                />
                                <Typography variant="small" color="gray" className="mt-1">
                                    Nombre del recurso que se va a proteger
                                </Typography>
                            </div>

                            <Controller
                                name="accion"
                                control={control}
                                rules={{ required: 'La acción es obligatoria' }}
                                render={({ field }) => (
                                    <div>
                                        <Select
                                            label="Acción *"
                                            value={field.value}
                                            onChange={(value) => field.onChange(value)}
                                            error={!!errors.accion}
                                        >
                                            {actions.map((action) => (
                                                <Option key={action} value={action}>
                                                    {action}
                                                </Option>
                                            ))}
                                        </Select>
                                        <Typography variant="small" color="gray" className="mt-1">
                                            Acción específica sobre el recurso
                                        </Typography>
                                    </div>
                                )}
                            />
                        </div>

                        <Textarea
                            label="Descripción"
                            {...register('descripcion')}
                            rows={3}
                            placeholder="Describe qué permite hacer este permiso..."
                        />

                        <Controller
                            name="activo"
                            control={control}
                            defaultValue={true}
                            render={({ field }) => (
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="permiso-activo-create"
                                        checked={field.value}
                                        onChange={field.onChange}
                                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="permiso-activo-create" className="ml-2 text-sm text-gray-700">
                                        Permiso activo
                                    </label>
                                </div>
                            )}
                        />

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
                        <Button type="submit" color="orange" loading={permissionsLoading}>
                            Crear Permiso
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>

            {/* Edit Permission Dialog */}
            <Dialog open={showEditDialog} handler={() => setShowEditDialog(false)} size="md">
                <DialogHeader>Editar Permiso</DialogHeader>
                <form onSubmit={handleSubmit(handleEditPermission)}>
                    <DialogBody divider className="space-y-4">
                        {selectedPermission?.esta_en_uso && (
                            <Alert color="orange">
                                <Typography variant="small">
                                    Este permiso está actualmente asignado a uno o más roles.
                                    Los cambios afectarán a todos los usuarios con esos roles.
                                </Typography>
                            </Alert>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Recurso *"
                                {...register('recurso', {
                                    required: 'El recurso es obligatorio',
                                    minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                                    pattern: {
                                        value: /^[a-z0-9\-_]+$/,
                                        message: 'Solo letras minúsculas, números, guiones y guiones bajos'
                                    }
                                })}
                                error={!!errors.recurso}
                                disabled={selectedPermission?.esta_en_uso}
                            />

                            <Controller
                                name="accion"
                                control={control}
                                rules={{ required: 'La acción es obligatoria' }}
                                render={({ field }) => (
                                    <Select
                                        label="Acción *"
                                        value={field.value}
                                        onChange={(value) => field.onChange(value)}
                                        error={!!errors.accion}
                                        disabled={selectedPermission?.esta_en_uso}
                                    >
                                        {actions.map((action) => (
                                            <Option key={action} value={action}>
                                                {action}
                                            </Option>
                                        ))}
                                    </Select>
                                )}
                            />
                        </div>

                        <Textarea
                            label="Descripción"
                            {...register('descripcion')}
                            rows={3}
                        />

                        <Controller
                            name="activo"
                            control={control}
                            render={({ field }) => (
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="permiso-activo-edit"
                                        checked={field.value}
                                        onChange={field.onChange}
                                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="permiso-activo-edit" className="ml-2 text-sm text-gray-700">
                                        Permiso activo
                                    </label>
                                </div>
                            )}
                        />

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
                                setSelectedPermission(null);
                                reset();
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" color="orange" loading={permissionsLoading}>
                            Actualizar Permiso
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>

            {/* View Permission Dialog */}
            <Dialog open={showViewDialog} handler={() => setShowViewDialog(false)} size="md">
                <DialogHeader>Detalles del Permiso</DialogHeader>
                <DialogBody divider className="space-y-6">
                    {selectedPermission ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Typography variant="h6" color="blue-gray">
                                        {selectedPermission.recurso}:{selectedPermission.accion}
                                    </Typography>
                                    <Typography color="gray" className="mt-1">
                                        {selectedPermission.descripcion || 'Sin descripción'}
                                    </Typography>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <Chip
                                            variant="ghost"
                                            size="sm"
                                            value={selectedPermission.activo ? 'Activo' : 'Inactivo'}
                                            color={selectedPermission.activo ? 'green' : 'red'}
                                        />
                                        <Chip
                                            variant="ghost"
                                            size="sm"
                                            value={selectedPermission.accion}
                                            color={getActionColor(selectedPermission.accion)}
                                            className="capitalize"
                                        />
                                    </div>

                                    <Typography variant="small" color="gray">
                                        Estado: {selectedPermission.esta_en_uso ? 'En uso' : 'No asignado'}
                                    </Typography>

                                    <Typography variant="small" color="gray">
                                        ID: {selectedPermission.id}
                                    </Typography>

                                    <Typography variant="small" color="gray">
                                        Creado: {new Date(selectedPermission.fecha_creacion).toLocaleDateString('es-ES')}
                                    </Typography>

                                    {selectedPermission.fecha_modificacion && (
                                        <Typography variant="small" color="gray">
                                            Modificado: {new Date(selectedPermission.fecha_modificacion).toLocaleDateString('es-ES')}
                                        </Typography>
                                    )}
                                </div>
                            </div>

                            {selectedPermission.creado_por_nombre && (
                                <div>
                                    <Typography variant="h6" color="blue-gray" className="mb-2">
                                        Información de Auditoría
                                    </Typography>
                                    <Typography variant="small" color="gray">
                                        Creado por: {selectedPermission.creado_por_nombre}
                                    </Typography>
                                </div>
                            )}

                            {selectedPermission.esta_en_uso && (
                                <Alert color="blue">
                                    <Typography variant="small">
                                        <strong>Este permiso está en uso:</strong><br />
                                        Está asignado a uno o más roles activos del sistema.
                                        Para eliminarlo, primero debe ser removido de todos los roles.
                                    </Typography>
                                </Alert>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <Typography color="gray">Cargando información del permiso...</Typography>
                        </div>
                    )}
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="gray"
                        onClick={() => {
                            setShowViewDialog(false);
                            setSelectedPermission(null);
                        }}
                    >
                        Cerrar
                    </Button>
                </DialogFooter>
            </Dialog>

            {/* Confirmation Dialog */}
            <Dialog open={showConfirmDialog} handler={() => setShowConfirmDialog(false)} size="sm">
                <DialogHeader className="flex items-center gap-2">
                    <IoWarning className="h-6 w-6 text-orange-500" />
                    Confirmar Eliminación
                </DialogHeader>
                <DialogBody>
                    {confirmAction ? (
                        <div>
                            <Typography>
                                ¿Estás seguro de que deseas eliminar el permiso{' '}
                                <strong>
                                    {confirmAction.permission?.recurso}:{confirmAction.permission?.accion}
                                </strong>?
                            </Typography>

                            <Alert color="red" className="mt-4">
                                <Typography variant="small">
                                    <strong>Advertencia:</strong> Esta acción no se puede deshacer.
                                    El permiso se eliminará permanentemente del sistema.
                                </Typography>
                            </Alert>

                            {confirmAction.permission?.esta_en_uso && (
                                <Alert color="orange" className="mt-2">
                                    <Typography variant="small">
                                        Este permiso está actualmente en uso y no puede ser eliminado.
                                    </Typography>
                                </Alert>
                            )}
                        </div>
                    ) : (
                        <Typography>
                            Cargando información del permiso...
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
                        color="red"
                        loading={permissionsLoading}
                        disabled={confirmAction?.permission?.esta_en_uso}
                        onClick={() => confirmAction && handleDeletePermission(confirmAction.permission)}
                    >
                        Eliminar
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default Permissions;