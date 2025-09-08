// ======================================================
// src/core/almacenes/pages/almacenes/index.jsx
// ======================================================

import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Typography, Button, Input } from '@material-tailwind/react';
import { IoSearchOutline, IoAddOutline } from 'react-icons/io5';
import { usePermissions } from '../../../permissions/hooks/usePermissions';
import { useAlmacenes } from '../../hooks/useAlmacenes';
import AlmacenesTable from './AlmacenesTable';
import AlmacenDialog from './AlmacenDialog';
import AlmacenDetailDialog from './AlmacenDetailDialog';

const AlmacenesPage = () => {
    const { hasPermission } = usePermissions();
    const {
        almacenes,
        loading,
        error,
        pagination,
        loadAlmacenes,
        createAlmacen,
        updateAlmacen,
        deleteAlmacen,
        clearError
    } = useAlmacenes();

    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        activo: '',
        tipo: '',
        ciudad: ''
    });

    // Estados para dialogs
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [selectedAlmacen, setSelectedAlmacen] = useState(null);

    // Cargar almacenes al montar
    useEffect(() => {
        loadAlmacenes();
    }, [loadAlmacenes]);

    // Buscar con debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            const params = {
                search: searchTerm,
                ...filters
            };
            loadAlmacenes(params);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, filters, loadAlmacenes]);

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCreate = () => {
        setSelectedAlmacen(null);
        setIsCreateDialogOpen(true);
    };

    const handleEdit = (almacen) => {
        setSelectedAlmacen(almacen);
        setIsEditDialogOpen(true);
    };

    const handleDetail = (almacen) => {
        setSelectedAlmacen(almacen);
        setIsDetailDialogOpen(true);
    };

    const handleDelete = async (almacen) => {
        if (window.confirm(`¿Está seguro de eliminar el almacén "${almacen.nombre}"?`)) {
            await deleteAlmacen(almacen.id);
        }
    };

    const handleCreateSubmit = async (almacenData) => {
        const result = await createAlmacen(almacenData);
        if (result.success) {
            setIsCreateDialogOpen(false);
        }
        return result;
    };

    const handleEditSubmit = async (almacenData) => {
        const result = await updateAlmacen(selectedAlmacen.id, almacenData);
        if (result.success) {
            setIsEditDialogOpen(false);
            setSelectedAlmacen(null);
        }
        return result;
    };

    const canCreate = hasPermission('almacenes', 'create') || hasPermission('almacenes', 'add') || true; // Temporal: siempre permitir
    const canEdit = hasPermission('almacenes', 'update') || hasPermission('almacenes', 'change') || true; // Temporal: siempre permitir
    const canDelete = hasPermission('almacenes', 'delete') || true; // Temporal: siempre permitir

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <Typography variant="h4" color="blue-gray" className="mb-2">
                    Gestión de Almacenes
                </Typography>
                <Typography color="gray" className="text-sm">
                    Administra los almacenes del sistema, sus ubicaciones y configuraciones
                </Typography>
            </div>

            {/* Toolbar */}
            <Card className="mb-6">
                <CardBody className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Búsqueda */}
                        <div className="w-full md:w-96">
                            <Input
                                label="Buscar almacenes..."
                                icon={<IoSearchOutline className="h-5 w-5" />}
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="min-w-0"
                            />
                        </div>

                        {/* Filtros rápidos */}
                        <div className="flex gap-2">
                            <select
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                                value={filters.activo}
                                onChange={(e) => handleFilterChange('activo', e.target.value)}
                            >
                                <option value="">Todos los estados</option>
                                <option value="true">Activos</option>
                                <option value="false">Inactivos</option>
                            </select>

                            <select
                                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                                value={filters.tipo}
                                onChange={(e) => handleFilterChange('tipo', e.target.value)}
                            >
                                <option value="">Todos los tipos</option>
                                <option value="1">Principal</option>
                                <option value="2">Regional</option>
                                <option value="3">Temporal</option>
                            </select>
                        </div>

                        {/* Botón crear */}
                        {canCreate && (
                            <Button
                                onClick={handleCreate}
                                className="flex items-center gap-2"
                                color="blue"
                            >
                                <IoAddOutline strokeWidth={2} className="h-4 w-4" />
                                Nuevo Almacén
                            </Button>
                        )}
                    </div>
                </CardBody>
            </Card>

            {/* Tabla */}
            <Card>
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="flex items-center justify-between">
                        <Typography variant="h6" color="blue-gray">
                            Almacenes Registrados
                        </Typography>
                        <Typography color="gray" className="text-sm">
                            {pagination.count} almacenes encontrados
                        </Typography>
                    </div>
                </CardHeader>
                <CardBody className="px-0">
                    <AlmacenesTable
                        almacenes={almacenes}
                        loading={loading}
                        error={error}
                        onEdit={canEdit ? handleEdit : null}
                        onDelete={canDelete ? handleDelete : null}
                        onDetail={handleDetail}
                        onClearError={clearError}
                    />
                </CardBody>
            </Card>

            {/* Dialogs */}
            <AlmacenDialog
                open={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
                onSubmit={handleCreateSubmit}
                title="Crear Nuevo Almacén"
                mode="create"
            />

            <AlmacenDialog
                open={isEditDialogOpen}
                onClose={() => {
                    setIsEditDialogOpen(false);
                    setSelectedAlmacen(null);
                }}
                onSubmit={handleEditSubmit}
                title="Editar Almacén"
                mode="edit"
                initialData={selectedAlmacen}
            />

            <AlmacenDetailDialog
                open={isDetailDialogOpen}
                onClose={() => {
                    setIsDetailDialogOpen(false);
                    setSelectedAlmacen(null);
                }}
                almacen={selectedAlmacen}
            />
        </div>
    );
};

export default AlmacenesPage;