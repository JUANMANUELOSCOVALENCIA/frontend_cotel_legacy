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
    Alert,
    Progress,
    Tooltip,
} from '@material-tailwind/react';
import {
    IoSearch,
    IoRefresh,
    IoReload,
    IoTrash,
    IoWarning,
    IoCheckmarkCircle,
    IoArrowBack,
} from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import permissionService from '../services/permissionService';
import Permission from '../components/Permission';
import Loader from '../../layout/Loader';

const DeletedUsers = () => {
    // States
    const [deletedUsers, setDeletedUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showRestoreDialog, setShowRestoreDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({});

    const navigate = useNavigate();

    // Load data on mount
    useEffect(() => {
        loadDeletedUsers();
    }, [currentPage, filters]);

    const loadDeletedUsers = async () => {
        setLoading(true);
        setError('');

        try {
            const params = {
                page: currentPage,
                search: filters.search,
                page_size: 20
            };

            const result = await permissionService.getDeletedUsers(params);

            if (result.success) {
                setDeletedUsers(result.data.results || result.data);
                setPagination({
                    count: result.data.count || 0,
                    next: result.data.next || null,
                    previous: result.data.previous || null,
                });
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Error al cargar usuarios eliminados');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = useCallback((value) => {
        setFilters(prev => ({ ...prev, search: value }));
        setCurrentPage(1);
    }, []);

    const handleRestoreUser = async () => {
        if (!selectedUser) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/usuarios/usuarios/${selectedUser.id}/restaurar/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                toast.success(`Usuario ${selectedUser.nombre_completo} restaurado correctamente`);
                setShowRestoreDialog(false);
                setSelectedUser(null);
                loadDeletedUsers();
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || 'Error al restaurar usuario');
            }
        } catch (err) {
            toast.error('Error al restaurar usuario');
        } finally {
            setLoading(false);
        }
    };

    const openRestoreDialog = (user) => {
        setSelectedUser(user);
        setShowRestoreDialog(true);
    };

    if (loading && deletedUsers.length === 0) {
        return <Loader message="Cargando usuarios eliminados..." />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="text"
                            className="flex items-center gap-2"
                            onClick={() => navigate('/usuarios/usuarios')}
                        >
                            <IoArrowBack className="h-5 w-5" />
                            Volver a Usuarios
                        </Button>
                    </div>
                    <Typography variant="h3" color="blue-gray">
                        Usuarios Eliminados
                    </Typography>
                    <Typography color="gray" className="mt-1">
                        Gestiona usuarios eliminados del sistema
                    </Typography>
                </div>

                <Button
                    variant="outlined"
                    className="flex items-center gap-2"
                    onClick={loadDeletedUsers}
                >
                    <IoRefresh className="h-5 w-5" />
                    Actualizar
                </Button>
            </div>

            {/* Error Alert */}
            {error && (
                <Alert color="red" dismissible onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {/* Search */}
            <Card>
                <CardBody className="p-4">
                    <div className="max-w-md">
                        <Input
                            label="Buscar usuarios eliminados"
                            icon={<IoSearch />}
                            value={filters.search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Nombre, apellido o código COTEL"
                        />
                    </div>
                </CardBody>
            </Card>

            {/* Deleted Users Table */}
            <Card>
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="flex items-center justify-between">
                        <Typography variant="h6" color="blue-gray">
                            Usuarios Eliminados ({pagination.count || 0})
                        </Typography>

                        <div className="flex items-center gap-2">
                            <IconButton variant="text" onClick={loadDeletedUsers}>
                                <IoRefresh className="h-4 w-4" />
                            </IconButton>
                        </div>
                    </div>
                </CardHeader>

                <CardBody className="overflow-x-auto px-0">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Progress size="sm" value={70} color="orange" className="w-32" />
                        </div>
                    ) : deletedUsers.length === 0 ? (
                        <div className="text-center py-8">
                            <Typography color="gray">
                                {filters.search
                                    ? 'No se encontraron usuarios eliminados con ese criterio'
                                    : 'No hay usuarios eliminados'
                                }
                            </Typography>
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
                                        Eliminado
                                    </Typography>
                                </th>
                                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                    <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                        Eliminado Por
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
                            {deletedUsers.map((user) => (
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
                                        <Chip
                                            variant="ghost"
                                            size="sm"
                                            value={user.rol_nombre || 'Sin rol'}
                                            color={user.rol_nombre ? 'blue' : 'gray'}
                                        />
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
                                        <Typography variant="small" color="gray">
                                            {user.fecha_eliminacion
                                                ? new Date(user.fecha_eliminacion).toLocaleDateString('es-ES')
                                                : 'No especificada'
                                            }
                                        </Typography>
                                    </td>
                                    <td className="p-4">
                                        <Typography variant="small" color="gray">
                                            {user.eliminado_por || 'Sistema'}
                                        </Typography>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <Permission recurso="usuarios" accion="actualizar">
                                                <Tooltip content="Restaurar usuario">
                                                    <IconButton
                                                        variant="text"
                                                        size="sm"
                                                        color="green"
                                                        onClick={() => openRestoreDialog(user)}
                                                    >
                                                        <IoReload className="h-4 w-4" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Permission>
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
                        Mostrando {deletedUsers.length} de {pagination.count} usuarios eliminados
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

            {/* Restore Confirmation Dialog */}
            <Dialog open={showRestoreDialog} handler={() => setShowRestoreDialog(false)} size="sm">
                <DialogHeader className="flex items-center gap-2">
                    <IoCheckmarkCircle className="h-6 w-6 text-green-500" />
                    Confirmar Restauración
                </DialogHeader>
                <DialogBody>
                    {selectedUser && (
                        <>
                            <Typography>
                                ¿Estás seguro de que deseas restaurar al usuario{' '}
                                <strong>{selectedUser.nombre_completo}</strong>?
                            </Typography>

                            <Alert color="green" className="mt-4">
                                <Typography variant="small">
                                    <strong>Al restaurar:</strong><br />
                                    • El usuario volverá a estar activo en el sistema<br />
                                    • Recuperará su acceso y permisos<br />
                                    • Aparecerá nuevamente en la lista de usuarios
                                </Typography>
                            </Alert>
                        </>
                    )}
                </DialogBody>
                <DialogFooter className="space-x-2">
                    <Button
                        variant="text"
                        color="gray"
                        onClick={() => setShowRestoreDialog(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        color="green"
                        loading={loading}
                        onClick={handleRestoreUser}
                        className="flex items-center gap-2"
                    >
                        <IoReload className="h-4 w-4" />
                        Restaurar Usuario
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default DeletedUsers;