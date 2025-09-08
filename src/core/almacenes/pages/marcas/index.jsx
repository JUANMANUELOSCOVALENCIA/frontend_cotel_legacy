// ======================================================
// src/core/almacenes/pages/marcas/index.jsx
// ======================================================

import React, { useState, useEffect } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Typography,
    Button,
    Input,
    IconButton,
    Tooltip,
    Chip,
    Alert,
    Spinner
} from '@material-tailwind/react';
import {
    IoSearch,
    IoAdd,
    IoPencil,
    IoTrash,
    IoEyeOff,
    IoEye
} from 'react-icons/io5';
import { usePermissions } from '../../../permissions/hooks/usePermissions';
import { useMarcas } from '../../hooks/useAlmacenes';
import MarcaDialog from './MarcaDialog';

const MarcasPage = () => {
    const { hasPermission } = usePermissions();
    const {
        marcas,
        loading,
        error,
        loadMarcas,
        createMarca,
        updateMarca,
        deleteMarca,
        toggleActivoMarca,
        clearError
    } = useMarcas();

    const [searchTerm, setSearchTerm] = useState('');
    const [showInactive, setShowInactive] = useState(false);

    // Estados para dialogs
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedMarca, setSelectedMarca] = useState(null);

    // Cargar marcas al montar
    useEffect(() => {
        loadMarcas({ incluir_inactivas: showInactive });
    }, [loadMarcas, showInactive]);

    // Buscar con debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            loadMarcas({
                search: searchTerm,
                incluir_inactivas: showInactive
            });
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, showInactive, loadMarcas]);

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const handleCreate = () => {
        setSelectedMarca(null);
        setIsCreateDialogOpen(true);
    };

    const handleEdit = (marca) => {
        setSelectedMarca(marca);
        setIsEditDialogOpen(true);
    };

    const handleDelete = async (marca) => {
        if (window.confirm(`¿Está seguro de eliminar la marca "${marca.nombre}"?`)) {
            await deleteMarca(marca.id);
        }
    };

    const handleToggleActivo = async (marca) => {
        await toggleActivoMarca(marca.id);
    };

    const handleCreateSubmit = async (marcaData) => {
        const result = await createMarca(marcaData);
        if (result.success) {
            setIsCreateDialogOpen(false);
        }
        return result;
    };

    const handleEditSubmit = async (marcaData) => {
        const result = await updateMarca(selectedMarca.id, marcaData);
        if (result.success) {
            setIsEditDialogOpen(false);
            setSelectedMarca(null);
        }
        return result;
    };

    const canCreate = hasPermission('almacenes', 'create') || hasPermission('marcas', 'add') || true; // Temporal: siempre permitir
    const canEdit = hasPermission('almacenes', 'update') || hasPermission('marcas', 'change') || true; // Temporal: siempre permitir
    const canDelete = hasPermission('almacenes', 'delete') || hasPermission('marcas', 'delete') || true; // Temporal: siempre permitir

    if (loading && marcas.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner className="h-8 w-8" />
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <Typography variant="h4" color="blue-gray" className="mb-2">
                    Gestión de Marcas
                </Typography>
                <Typography color="gray" className="text-sm">
                    Administra las marcas de equipos y materiales
                </Typography>
            </div>

            {/* Toolbar */}
            <Card className="mb-6">
                <CardBody className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Búsqueda */}
                        <div className="w-full md:w-96">
                            <Input
                                label="Buscar marcas..."
                                icon={<IoSearch className="h-5 w-5" />}
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="min-w-0"
                            />
                        </div>

                        {/* Filtros y acciones */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant={showInactive ? "filled" : "outlined"}
                                size="sm"
                                onClick={() => setShowInactive(!showInactive)}
                                className="flex items-center gap-2"
                            >
                                {showInactive ? <IoEye className="h-4 w-4" /> : <IoEyeOff className="h-4 w-4" />}
                                {showInactive ? 'Ocultar Inactivas' : 'Mostrar Inactivas'}
                            </Button>

                            {canCreate && (
                                <Button
                                    onClick={handleCreate}
                                    className="flex items-center gap-2"
                                    color="blue"
                                >
                                    <IoAdd className="h-4 w-4" />
                                    Nueva Marca
                                </Button>
                            )}
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Error Alert */}
            {error && (
                <Alert color="red" className="mb-4" dismissible onClose={clearError}>
                    {error}
                </Alert>
            )}

            {/* Tabla */}
            <Card>
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="flex items-center justify-between">
                        <Typography variant="h6" color="blue-gray">
                            Marcas Registradas
                        </Typography>
                        <Typography color="gray" className="text-sm">
                            {marcas.length} marcas encontradas
                        </Typography>
                    </div>
                </CardHeader>
                <CardBody className="px-0">
                    {marcas.length === 0 ? (
                        <div className="text-center py-12">
                            <Typography variant="h6" color="blue-gray" className="mt-4">
                                No hay marcas registradas
                            </Typography>
                            <Typography color="gray" className="mt-2">
                                Comienza creando tu primera marca
                            </Typography>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-max table-auto text-left">
                                <thead>
                                <tr>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
                                        >
                                            Nombre
                                        </Typography>
                                    </th>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
                                        >
                                            Descripción
                                        </Typography>
                                    </th>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
                                        >
                                            Modelos
                                        </Typography>
                                    </th>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
                                        >
                                            Estado
                                        </Typography>
                                    </th>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
                                        >
                                            Acciones
                                        </Typography>
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {marcas.map((marca, index) => {
                                    const isLast = index === marcas.length - 1;
                                    const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                                    return (
                                        <tr key={marca.id} className="hover:bg-blue-gray-50/50">
                                            {/* Nombre */}
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-semibold">
                                                    {marca.nombre}
                                                </Typography>
                                            </td>

                                            {/* Descripción */}
                                            <td className={classes}>
                                                <Typography variant="small" color="gray" className="font-normal">
                                                    {marca.descripcion || 'Sin descripción'}
                                                </Typography>
                                            </td>

                                            {/* Modelos */}
                                            <td className={classes}>
                                                <div className="flex flex-col">
                                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                                        {marca.modelos_count || 0} modelos
                                                    </Typography>
                                                    <Typography variant="small" color="green" className="font-normal">
                                                        {marca.materiales_count || 0} materiales
                                                    </Typography>
                                                </div>
                                            </td>

                                            {/* Estado */}
                                            <td className={classes}>
                                                <Chip
                                                    variant="ghost"
                                                    color={marca.activo ? "green" : "red"}
                                                    size="sm"
                                                    value={marca.activo ? "Activo" : "Inactivo"}
                                                    icon={
                                                        <span
                                                            className={`mx-auto mt-1 block h-2 w-2 rounded-full ${
                                                                marca.activo ? 'bg-green-900' : 'bg-red-900'
                                                            } content-['']`}
                                                        />
                                                    }
                                                />
                                            </td>

                                            {/* Acciones */}
                                            <td className={classes}>
                                                <div className="flex items-center gap-2">
                                                    {canEdit && (
                                                        <>
                                                            <Tooltip content={marca.activo ? "Desactivar" : "Activar"}>
                                                                <IconButton
                                                                    variant="text"
                                                                    color={marca.activo ? "orange" : "green"}
                                                                    onClick={() => handleToggleActivo(marca)}
                                                                >
                                                                    {marca.activo ?
                                                                        <IoEyeOff className="h-4 w-4" /> :
                                                                        <IoEye className="h-4 w-4" />
                                                                    }
                                                                </IconButton>
                                                            </Tooltip>

                                                            <Tooltip content="Editar">
                                                                <IconButton
                                                                    variant="text"
                                                                    color="blue-gray"
                                                                    onClick={() => handleEdit(marca)}
                                                                >
                                                                    <IoPencil className="h-4 w-4" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </>
                                                    )}

                                                    {canDelete && (
                                                        <Tooltip content="Eliminar">
                                                            <IconButton
                                                                variant="text"
                                                                color="red"
                                                                onClick={() => handleDelete(marca)}
                                                            >
                                                                <IoTrash className="h-4 w-4" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Dialogs */}
            <MarcaDialog
                open={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
                onSubmit={handleCreateSubmit}
                title="Crear Nueva Marca"
                mode="create"
            />

            <MarcaDialog
                open={isEditDialogOpen}
                onClose={() => {
                    setIsEditDialogOpen(false);
                    setSelectedMarca(null);
                }}
                onSubmit={handleEditSubmit}
                title="Editar Marca"
                mode="edit"
                initialData={selectedMarca}
            />
        </div>
    );
};

export default MarcasPage;