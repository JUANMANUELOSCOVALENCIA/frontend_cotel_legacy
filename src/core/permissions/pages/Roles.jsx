import React, { useState, useEffect, useCallback } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Typography,
    Button,
    Input,
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
    Accordion,
    AccordionHeader,
    AccordionBody,
} from '@material-tailwind/react';
import {
    IoAdd,
    IoSearch,
    IoRefresh,
    IoEllipsisVertical,
    IoEye,
    IoCreate,
    IoTrash,
    IoCopy,
    IoShieldCheckmark,
    IoPeople,
    IoWarning,
    IoCheckmark,
    IoChevronDown,
    IoLockClosed,
} from 'react-icons/io5';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useRolesCRUD, usePermissionsCRUD } from '../hooks/usePermissions';
import Permission from '../components/Permission';
import Loader from '../../layout/Loader';

const Roles = () => {
    // States
    const [selectedRole, setSelectedRole] = useState(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showCloneDialog, setShowCloneDialog] = useState(false);
    const [showViewDialog, setShowViewDialog] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        activo: '',
        es_sistema: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [permissionAccordions, setPermissionAccordions] = useState({});

    // Hooks
    const {
        roles,
        loading: rolesLoading,
        error: rolesError,
        pagination,
        loadRoles,
        createRole,
        updateRole,
        deleteRole,
        cloneRole,
        clearError: clearRolesError,
    } = useRolesCRUD();

    const {
        permissions,
        loading: permissionsLoading,
        loadPermissions,
    } = usePermissionsCRUD();

    // Form
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
        setValue,
        watch,
    } = useForm();

    // Load data on mount
    useEffect(() => {
        loadRoles({ page: currentPage, ...filters });
        loadPermissions({ page_size: 1000 }); // Cargar todos los permisos
    }, [currentPage, filters, loadRoles, loadPermissions]);

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

    const handleCreateRole = async (data) => {
        const roleData = {
            ...data,
            permisos_ids: selectedPermissions
        };

        const result = await createRole(roleData);
        if (result.success) {
            toast.success('Rol creado correctamente');
            setShowCreateDialog(false);
            setSelectedPermissions([]);
            reset();
            // Recargar la lista para ver el nuevo rol
            loadRoles({ page: currentPage, ...filters });
        } else {
            // Verificar si el error es 500 pero el rol se creó
            if (result.error?.includes('500') || result.error?.includes('Internal Server Error')) {
                toast.warning('El rol se creó pero hubo un problema en la respuesta. Recargando lista...');
                setShowCreateDialog(false);
                setSelectedPermissions([]);
                reset();
                // Recargar después de un delay para que el backend termine
                setTimeout(() => {
                    loadRoles({ page: currentPage, ...filters });
                }, 1000);
            } else {
                toast.error(result.error);
            }
        }
    };

    const handleEditRole = async (data) => {
        const roleData = {
            ...data,
            permisos_ids: selectedPermissions
        };

        const result = await updateRole(selectedRole.id, roleData);
        if (result.success) {
            toast.success('Rol actualizado correctamente');
            setShowEditDialog(false);
            setSelectedRole(null);
            setSelectedPermissions([]);
            reset();
        } else {
            toast.error(result.error);
        }
    };

    const handleCloneRole = async (data) => {
        const result = await cloneRole(selectedRole.id, {
            nombre: data.nombre,
            descripcion: data.descripcion || ''
        });

        if (result.success) {
            toast.success('Rol clonado correctamente');
            setShowCloneDialog(false);
            setSelectedRole(null);
            reset();
        } else {
            toast.error(result.error);
        }
    };

    const handleDeleteRole = async (role) => {
        const result = await deleteRole(role.id);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.error);
        }
        setConfirmAction(null);
        setShowConfirmDialog(false);
    };

    const openConfirmDialog = (action, role) => {
        setConfirmAction({ action, role });
        setShowConfirmDialog(true);
    };

    const handlePermissionToggle = (permissionId, checked) => {
        if (checked) {
            setSelectedPermissions(prev => [...prev, permissionId]);
        } else {
            setSelectedPermissions(prev => prev.filter(id => id !== permissionId));
        }
    };

    const handleResourceToggle = (resourcePermissions, checked) => {
        const permissionIds = resourcePermissions.map(p => p.id);
        if (checked) {
            setSelectedPermissions(prev => {
                const newPermissions = [...prev];
                permissionIds.forEach(id => {
                    if (!newPermissions.includes(id)) {
                        newPermissions.push(id);
                    }
                });
                return newPermissions;
            });
        } else {
            setSelectedPermissions(prev =>
                prev.filter(id => !permissionIds.includes(id))
            );
        }
    };

    const toggleAccordion = (resource) => {
        setPermissionAccordions(prev => ({
            ...prev,
            [resource]: !prev[resource]
        }));
    };

    const openEditDialog = (role) => {
        setSelectedRole(role);
        setSelectedPermissions(role.permisos.map(p => p.id));
        reset({
            nombre: role.nombre,
            descripcion: role.descripcion,
            activo: role.activo
        });
        setShowEditDialog(true);
    };

    const openViewDialog = (role) => {
        setSelectedRole(role);
        setShowViewDialog(true);
    };

    const openCloneDialog = (role) => {
        setSelectedRole(role);
        reset({
            nombre: `${role.nombre} (Copia)`,
            descripcion: role.descripcion
        });
        setShowCloneDialog(true);
    };

    if (rolesLoading && roles.length === 0) {
        return <Loader message="Cargando roles..." />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <Typography variant="h3" color="blue-gray">
                        Gestión de Roles
                    </Typography>
                    <Typography color="gray" className="mt-1">
                        Administra roles y permisos del sistema
                    </Typography>
                </div>

                <Permission recurso="roles" accion="crear">
                    <Button
                        className="flex items-center gap-2"
                        color="orange"
                        onClick={() => {
                            setSelectedPermissions([]);
                            reset();
                            setShowCreateDialog(true);
                        }}
                    >
                        <IoAdd className="h-5 w-5" />
                        Crear Rol
                    </Button>
                </Permission>
            </div>

            {/* Error Alert */}
            {rolesError && (
                <Alert color="red" dismissible onClose={clearRolesError}>
                    {rolesError}
                </Alert>
            )}

            {/* Filters */}
            <Card>
                <CardBody className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            label="Buscar roles"
                            icon={<IoSearch />}
                            value={filters.search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Nombre o descripción"
                        />

                        <div className="flex items-center gap-4">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="filter-activo"
                                    checked={filters.activo === 'true'}
                                    onChange={(e) => handleFilterChange('activo', e.target.checked ? 'true' : '')}
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                />
                                <label htmlFor="filter-activo" className="ml-2 text-sm text-gray-700">
                                    Solo activos
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="filter-sistema"
                                    checked={filters.es_sistema === 'true'}
                                    onChange={(e) => handleFilterChange('es_sistema', e.target.checked ? 'true' : '')}
                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                />
                                <label htmlFor="filter-sistema" className="ml-2 text-sm text-gray-700">
                                    Roles del sistema
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <IconButton
                                variant="text"
                                onClick={() => loadRoles({ page: currentPage, ...filters })}
                            >
                                <IoRefresh className="h-4 w-4" />
                            </IconButton>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Roles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rolesLoading ? (
                    <div className="col-span-full flex justify-center py-8">
                        <Progress size="sm" value={70} color="orange" className="w-32" />
                    </div>
                ) : roles.length === 0 ? (
                    <div className="col-span-full text-center py-8">
                        <Typography color="gray">No se encontraron roles</Typography>
                    </div>
                ) : (
                    roles.map((role) => (
                        <Card key={role.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader floated={false} className="h-16 bg-gradient-to-r from-orange-500 to-red-500">
                                <div className="flex items-center justify-between h-full px-4">
                                    <div className="flex items-center gap-2">
                                        <IoShieldCheckmark className="h-5 w-5 text-white" />
                                        <Typography variant="h6" color="white" className="font-bold">
                                            {role.nombre}
                                        </Typography>
                                        {role.es_sistema && (
                                            <IoLockClosed className="h-4 w-4 text-orange-200" />
                                        )}
                                    </div>

                                    <Menu>
                                        <MenuHandler>
                                            <IconButton variant="text" className="text-white">
                                                <IoEllipsisVertical className="h-4 w-4" />
                                            </IconButton>
                                        </MenuHandler>
                                        <MenuList>
                                            <Permission recurso="roles" accion="leer">
                                                <MenuItem
                                                    className="flex items-center gap-2"
                                                    onClick={() => openViewDialog(role)}
                                                >
                                                    <IoEye className="h-4 w-4" />
                                                    Ver Detalles
                                                </MenuItem>
                                            </Permission>

                                            <Permission recurso="roles" accion="actualizar">
                                                <MenuItem
                                                    className="flex items-center gap-2"
                                                    onClick={() => openEditDialog(role)}
                                                    disabled={role.es_sistema}
                                                >
                                                    <IoCreate className="h-4 w-4" />
                                                    Editar
                                                </MenuItem>
                                            </Permission>

                                            <Permission recurso="roles" accion="crear">
                                                <MenuItem
                                                    className="flex items-center gap-2"
                                                    onClick={() => openCloneDialog(role)}
                                                >
                                                    <IoCopy className="h-4 w-4" />
                                                    Clonar
                                                </MenuItem>
                                            </Permission>

                                            <Permission recurso="roles" accion="eliminar">
                                                <MenuItem
                                                    className="flex items-center gap-2 text-red-500"
                                                    onClick={() => openConfirmDialog('delete', role)}
                                                    disabled={role.es_sistema || role.cantidad_usuarios > 0}
                                                >
                                                    <IoTrash className="h-4 w-4" />
                                                    Eliminar
                                                </MenuItem>
                                            </Permission>
                                        </MenuList>
                                    </Menu>
                                </div>
                            </CardHeader>

                            <CardBody className="space-y-4">
                                <div>
                                    <Typography color="gray" className="text-sm">
                                        {role.descripcion || 'Sin descripción'}
                                    </Typography>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <IoPeople className="h-4 w-4 text-gray-500" />
                                        <Typography variant="small" color="gray">
                                            {role.cantidad_usuarios} usuarios
                                        </Typography>
                                    </div>

                                    <Chip
                                        variant="ghost"
                                        size="sm"
                                        value={role.activo ? 'Activo' : 'Inactivo'}
                                        color={role.activo ? 'green' : 'red'}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <Typography variant="small" color="gray">
                                        {role.cantidad_permisos} permisos
                                    </Typography>

                                    {role.es_sistema && (
                                        <Chip
                                            variant="ghost"
                                            size="sm"
                                            value="Sistema"
                                            color="blue"
                                        />
                                    )}
                                </div>

                                <div className="text-xs text-gray-500">
                                    Creado: {new Date(role.fecha_creacion).toLocaleDateString('es-ES')}
                                </div>
                            </CardBody>
                        </Card>
                    ))
                )}
            </div>

            {/* Pagination */}
            {pagination.count > 15 && (
                <div className="flex items-center justify-between">
                    <Typography variant="small" color="gray">
                        Mostrando {roles.length} de {pagination.count} roles
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

            {/* Create Role Dialog */}
            <Dialog open={showCreateDialog} handler={() => setShowCreateDialog(false)} size="lg">
                <DialogHeader>Crear Rol</DialogHeader>
                <form onSubmit={handleSubmit(handleCreateRole)}>
                    <DialogBody divider className="space-y-6 max-h-96 overflow-y-auto">
                        <div className="space-y-4">
                            <Input
                                label="Nombre del Rol *"
                                {...register('nombre', {
                                    required: 'El nombre es obligatorio',
                                    minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                                })}
                                error={!!errors.nombre}
                            />

                            <Textarea
                                label="Descripción"
                                {...register('descripcion')}
                                rows={3}
                            />
                        </div>

                        <div>
                            <Typography variant="h6" color="blue-gray" className="mb-4">
                                Permisos ({selectedPermissions.length} seleccionados)
                            </Typography>

                            {permissionsLoading ? (
                                <Progress size="sm" value={50} color="orange" />
                            ) : (
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {Object.entries(groupedPermissions).map(([resource, resourcePermissions]) => {
                                        const allSelected = resourcePermissions.every(p => selectedPermissions.includes(p.id));
                                        const someSelected = resourcePermissions.some(p => selectedPermissions.includes(p.id));

                                        return (
                                            <Accordion
                                                key={resource}
                                                open={permissionAccordions[resource] || false}
                                            >
                                                <AccordionHeader
                                                    onClick={() => toggleAccordion(resource)}
                                                    className="border-b-0 p-3"
                                                >
                                                    <div className="flex items-center gap-3 w-full">
                                                        <input
                                                            type="checkbox"
                                                            id={`resource-${resource}`}
                                                            checked={allSelected}
                                                            ref={(el) => {
                                                                if (el) el.indeterminate = someSelected && !allSelected;
                                                            }}
                                                            onChange={(e) => handleResourceToggle(resourcePermissions, e.target.checked)}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                                        />
                                                        <Typography variant="h6" className="capitalize">
                                                            {resource}
                                                        </Typography>
                                                        <Chip size="sm" variant="ghost" value={resourcePermissions.length} />
                                                        <IoChevronDown
                                                            className={`h-4 w-4 transition-transform ml-auto ${
                                                                permissionAccordions[resource] ? 'rotate-180' : ''
                                                            }`}
                                                        />
                                                    </div>
                                                </AccordionHeader>
                                                <AccordionBody className="pt-0 pb-2">
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 ml-8">
                                                        {resourcePermissions.map((permission) => (
                                                            <div key={permission.id} className="flex items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`permission-create-${permission.id}`}
                                                                    checked={selectedPermissions.includes(permission.id)}
                                                                    onChange={(e) => handlePermissionToggle(permission.id, e.target.checked)}
                                                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                                                />
                                                                <label
                                                                    htmlFor={`permission-create-${permission.id}`}
                                                                    className="ml-2 text-sm capitalize text-gray-700"
                                                                >
                                                                    {permission.accion}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </AccordionBody>
                                            </Accordion>
                                        );
                                    })}
                                </div>
                            )}
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
                                setSelectedPermissions([]);
                                reset();
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" color="orange" loading={rolesLoading}>
                            Crear Rol
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>

            {/* Edit Role Dialog */}
            <Dialog open={showEditDialog} handler={() => setShowEditDialog(false)} size="lg">
                <DialogHeader>Editar Rol</DialogHeader>
                <form onSubmit={handleSubmit(handleEditRole)}>
                    <DialogBody divider className="space-y-6 max-h-96 overflow-y-auto">
                        <div className="space-y-4">
                            <Input
                                label="Nombre del Rol *"
                                {...register('nombre', {
                                    required: 'El nombre es obligatorio',
                                    minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                                })}
                                error={!!errors.nombre}
                            />

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
                                            id="activo-edit"
                                            checked={field.value}
                                            onChange={field.onChange}
                                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="activo-edit" className="ml-2 text-sm text-gray-700">
                                            Rol activo
                                        </label>
                                    </div>
                                )}
                            />
                        </div>

                        <div>
                            <Typography variant="h6" color="blue-gray" className="mb-4">
                                Permisos ({selectedPermissions.length} seleccionados)
                            </Typography>

                            {permissionsLoading ? (
                                <Progress size="sm" value={50} color="orange" />
                            ) : (
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {Object.entries(groupedPermissions).map(([resource, resourcePermissions]) => {
                                        const allSelected = resourcePermissions.every(p => selectedPermissions.includes(p.id));
                                        const someSelected = resourcePermissions.some(p => selectedPermissions.includes(p.id));

                                        return (
                                            <Accordion
                                                key={resource}
                                                open={permissionAccordions[resource] || false}
                                            >
                                                <AccordionHeader
                                                    onClick={() => toggleAccordion(resource)}
                                                    className="border-b-0 p-3"
                                                >
                                                    <div className="flex items-center gap-3 w-full">
                                                        <input
                                                            type="checkbox"
                                                            id={`resource-edit-${resource}`}
                                                            checked={allSelected}
                                                            ref={(el) => {
                                                                if (el) el.indeterminate = someSelected && !allSelected;
                                                            }}
                                                            onChange={(e) => handleResourceToggle(resourcePermissions, e.target.checked)}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                                        />
                                                        <Typography variant="h6" className="capitalize">
                                                            {resource}
                                                        </Typography>
                                                        <Chip size="sm" variant="ghost" value={resourcePermissions.length} />
                                                        <IoChevronDown
                                                            className={`h-4 w-4 transition-transform ml-auto ${
                                                                permissionAccordions[resource] ? 'rotate-180' : ''
                                                            }`}
                                                        />
                                                    </div>
                                                </AccordionHeader>
                                                <AccordionBody className="pt-0 pb-2">
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 ml-8">
                                                        {resourcePermissions.map((permission) => (
                                                            <div key={permission.id} className="flex items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`permission-edit-${permission.id}`}
                                                                    checked={selectedPermissions.includes(permission.id)}
                                                                    onChange={(e) => handlePermissionToggle(permission.id, e.target.checked)}
                                                                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                                                />
                                                                <label
                                                                    htmlFor={`permission-edit-${permission.id}`}
                                                                    className="ml-2 text-sm capitalize text-gray-700"
                                                                >
                                                                    {permission.accion}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </AccordionBody>
                                            </Accordion>
                                        );
                                    })}
                                </div>
                            )}
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
                                setShowEditDialog(false);
                                setSelectedRole(null);
                                setSelectedPermissions([]);
                                reset();
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" color="orange" loading={rolesLoading}>
                            Actualizar Rol
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>

            {/* Clone Role Dialog */}
            <Dialog open={showCloneDialog} handler={() => setShowCloneDialog(false)} size="md">
                <DialogHeader>Clonar Rol</DialogHeader>
                <form onSubmit={handleSubmit(handleCloneRole)}>
                    <DialogBody divider className="space-y-4">
                        <Alert color="blue">
                            <Typography variant="small">
                                Se creará una copia del rol "{selectedRole?.nombre}" con todos sus permisos.
                            </Typography>
                        </Alert>

                        <Input
                            label="Nombre del Nuevo Rol *"
                            {...register('nombre', {
                                required: 'El nombre es obligatorio',
                                minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                            })}
                            error={!!errors.nombre}
                        />

                        <Textarea
                            label="Descripción"
                            {...register('descripcion')}
                            rows={3}
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
                                setShowCloneDialog(false);
                                setSelectedRole(null);
                                reset();
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" color="orange" loading={rolesLoading}>
                            Clonar Rol
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>

            {/* View Role Dialog */}
            <Dialog open={showViewDialog} handler={() => setShowViewDialog(false)} size="lg">
                <DialogHeader>Detalles del Rol</DialogHeader>
                <DialogBody divider className="space-y-6">
                    {selectedRole ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Typography variant="h6" color="blue-gray">
                                        {selectedRole.nombre}
                                    </Typography>
                                    <Typography color="gray" className="mt-1">
                                        {selectedRole.descripcion || 'Sin descripción'}
                                    </Typography>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <Chip
                                            variant="ghost"
                                            size="sm"
                                            value={selectedRole.activo ? 'Activo' : 'Inactivo'}
                                            color={selectedRole.activo ? 'green' : 'red'}
                                        />
                                        {selectedRole.es_sistema && (
                                            <Chip
                                                variant="ghost"
                                                size="sm"
                                                value="Sistema"
                                                color="blue"
                                            />
                                        )}
                                    </div>

                                    <Typography variant="small" color="gray">
                                        {selectedRole.cantidad_usuarios} usuarios asignados
                                    </Typography>

                                    <Typography variant="small" color="gray">
                                        Creado: {new Date(selectedRole.fecha_creacion).toLocaleDateString('es-ES')}
                                    </Typography>
                                </div>
                            </div>

                            <div>
                                <Typography variant="h6" color="blue-gray" className="mb-4">
                                    Permisos ({selectedRole.permisos?.length || 0})
                                </Typography>

                                {selectedRole.permisos && selectedRole.permisos.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(
                                            selectedRole.permisos.reduce((acc, permission) => {
                                                if (!acc[permission.recurso]) {
                                                    acc[permission.recurso] = [];
                                                }
                                                acc[permission.recurso].push(permission);
                                                return acc;
                                            }, {})
                                        ).map(([resource, resourcePermissions]) => (
                                            <Card key={resource} className="p-4">
                                                <Typography variant="h6" className="capitalize mb-2">
                                                    {resource}
                                                </Typography>
                                                <div className="flex flex-wrap gap-1">
                                                    {resourcePermissions.map((permission) => (
                                                        <Chip
                                                            key={permission.id}
                                                            variant="ghost"
                                                            size="sm"
                                                            value={permission.accion}
                                                            color="blue"
                                                            className="capitalize"
                                                        />
                                                    ))}
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <Typography color="gray">
                                        Este rol no tiene permisos asignados
                                    </Typography>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <Typography color="gray">Cargando información del rol...</Typography>
                        </div>
                    )}
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="gray"
                        onClick={() => {
                            setShowViewDialog(false);
                            setSelectedRole(null);
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
                                ¿Estás seguro de que deseas eliminar el rol{' '}
                                <strong>{confirmAction.role?.nombre}</strong>?
                            </Typography>

                            <Typography variant="small" color="gray" className="mt-2">
                                Esta acción no se puede deshacer.
                            </Typography>
                        </div>
                    ) : (
                        <Typography>
                            Cargando información del rol...
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
                        loading={rolesLoading}
                        onClick={() => confirmAction && handleDeleteRole(confirmAction.role)}
                    >
                        Eliminar
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default Roles;