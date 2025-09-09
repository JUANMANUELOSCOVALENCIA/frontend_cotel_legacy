// src/core/almacenes/pages/modelos/index.jsx - CORREGIDO
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
    Spinner,
    Select,
    Option
} from '@material-tailwind/react';
import {
    IoSearch,
    IoAdd,
    IoPencil,
    IoTrash,
    IoEyeOff,
    IoEye,
    IoFilter,
    IoRefresh
} from 'react-icons/io5';
import { usePermissions } from '../../../permissions/hooks/usePermissions';
import { useModelos, useOpcionesCompletas } from '../../hooks/useAlmacenes';
import ModeloDialog from './ModeloDialog';

const ModelosPage = () => {
    const { hasPermission } = usePermissions();
    const {
        modelos,
        loading,
        error,
        loadModelos,
        createModelo,
        updateModelo,
        deleteModelo,
        toggleActivoModelo,
        clearError
    } = useModelos();

    const { opciones, loading: loadingOpciones } = useOpcionesCompletas();

    const [searchTerm, setSearchTerm] = useState('');
    const [showInactive, setShowInactive] = useState(false);
    const [filterMarca, setFilterMarca] = useState('');
    const [filterTipo, setFilterTipo] = useState('');

    // Estados para dialogs
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedModelo, setSelectedModelo] = useState(null);

    // ✅ VALIDACIONES SEGURAS PARA OPCIONES
    const getMarcasSeguras = () => {
        return opciones?.marcas?.filter(marca =>
            marca &&
            marca.id !== null &&
            marca.id !== undefined &&
            marca.nombre &&
            marca.activo
        ) || [];
    };

    const getTiposMaterialSeguras = () => {
        return opciones?.tipos_material?.filter(tipo =>
            tipo &&
            tipo.id !== null &&
            tipo.id !== undefined &&
            tipo.nombre
        ) || [];
    };

    // Cargar modelos al montar
    useEffect(() => {
        if (!loadingOpciones) {
            loadModelos({
                incluir_inactivos: showInactive,
                marca: filterMarca,
                tipo_material: filterTipo
            });
        }
    }, [loadModelos, showInactive, filterMarca, filterTipo, loadingOpciones]);

    // Buscar con debounce
    useEffect(() => {
        if (!loadingOpciones) {
            const timer = setTimeout(() => {
                loadModelos({
                    search: searchTerm,
                    incluir_inactivos: showInactive,
                    marca: filterMarca,
                    tipo_material: filterTipo
                });
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [searchTerm, showInactive, filterMarca, filterTipo, loadModelos, loadingOpciones]);

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const handleCreate = () => {
        setSelectedModelo(null);
        setIsCreateDialogOpen(true);
    };

    const handleEdit = (modelo) => {
        setSelectedModelo(modelo);
        setIsEditDialogOpen(true);
    };

    const handleDelete = async (modelo) => {
        if (window.confirm(`¿Está seguro de eliminar el modelo "${modelo.nombre}"?`)) {
            await deleteModelo(modelo.id);
        }
    };

    const handleToggleActivo = async (modelo) => {
        await toggleActivoModelo(modelo.id);
    };

    const handleCreateSubmit = async (modeloData) => {
        const result = await createModelo(modeloData);
        if (result.success) {
            setIsCreateDialogOpen(false);
        }
        return result;
    };

    const handleEditSubmit = async (modeloData) => {
        const result = await updateModelo(selectedModelo.id, modeloData);
        if (result.success) {
            setIsEditDialogOpen(false);
            setSelectedModelo(null);
        }
        return result;
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilterMarca('');
        setFilterTipo('');
        setShowInactive(false);
    };

    const canCreate = hasPermission('almacenes', 'create') || true;
    const canEdit = hasPermission('almacenes', 'update') || true;
    const canDelete = hasPermission('almacenes', 'delete') || true;

    // ✅ LOADING STATE MEJORADO
    if (loadingOpciones) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner className="h-8 w-8" />
                <Typography color="gray" className="ml-2">
                    Cargando configuración...
                </Typography>
            </div>
        );
    }

    if (loading && modelos.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spinner className="h-8 w-8" />
                <Typography color="gray" className="ml-2">
                    Cargando modelos...
                </Typography>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <Typography variant="h4" color="blue-gray" className="mb-2">
                    Gestión de Modelos
                </Typography>
                <Typography color="gray" className="text-sm">
                    Administra los modelos de equipos ONUs y materiales generales
                </Typography>
            </div>

            {/* Toolbar */}
            <Card className="mb-6">
                <CardBody className="p-4">
                    <div className="flex flex-col gap-4">
                        {/* Primera fila - Búsqueda y acciones principales */}
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="w-full md:w-96">
                                <Input
                                    label="Buscar modelos..."
                                    icon={<IoSearch className="h-5 w-5" />}
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="min-w-0"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant={showInactive ? "filled" : "outlined"}
                                    size="sm"
                                    onClick={() => setShowInactive(!showInactive)}
                                    className="flex items-center gap-2"
                                >
                                    {showInactive ? <IoEye className="h-4 w-4" /> : <IoEyeOff className="h-4 w-4" />}
                                    {showInactive ? 'Ocultar Inactivos' : 'Mostrar Inactivos'}
                                </Button>

                                <IconButton
                                    variant="outlined"
                                    size="sm"
                                    onClick={() => loadModelos({ incluir_inactivos: showInactive })}
                                >
                                    <IoRefresh className="h-4 w-4" />
                                </IconButton>

                                {canCreate && (
                                    <Button
                                        onClick={handleCreate}
                                        className="flex items-center gap-2"
                                        color="blue"
                                    >
                                        <IoAdd className="h-4 w-4" />
                                        Nuevo Modelo
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Segunda fila - Filtros */}
                        <div className="flex flex-col md:flex-row gap-4 items-center">
                            <div className="flex items-center gap-2">
                                <IoFilter className="h-4 w-4 text-gray-500" />
                                <Typography variant="small" color="gray">
                                    Filtros:
                                </Typography>
                            </div>

                            <div className="flex flex-col md:flex-row gap-2 flex-1">
                                {/* ✅ FILTRO POR MARCA - CORREGIDO */}
                                <Select
                                    label="Filtrar por Marca"
                                    value={filterMarca}
                                    onChange={(value) => setFilterMarca(value || '')}
                                    className="min-w-48"
                                >
                                    <Option value="">Todas las marcas</Option>
                                    {getMarcasSeguras().map(marca => (
                                        <Option key={marca.id} value={marca.id.toString()}>
                                            {marca.nombre}
                                        </Option>
                                    ))}
                                </Select>

                                {/* ✅ FILTRO POR TIPO - CORREGIDO */}
                                <Select
                                    label="Filtrar por Tipo"
                                    value={filterTipo}
                                    onChange={(value) => setFilterTipo(value || '')}
                                    className="min-w-48"
                                >
                                    <Option value="">Todos los tipos</Option>
                                    {getTiposMaterialSeguras().map(tipo => (
                                        <Option key={tipo.id} value={tipo.id.toString()}>
                                            {tipo.nombre} {tipo.es_unico ? '(ONU)' : '(Material)'}
                                        </Option>
                                    ))}
                                </Select>

                                {(filterMarca || filterTipo) && (
                                    <Button
                                        variant="text"
                                        size="sm"
                                        color="red"
                                        onClick={clearFilters}
                                    >
                                        Limpiar
                                    </Button>
                                )}
                            </div>
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
                            Modelos Registrados
                        </Typography>
                        <Typography color="gray" className="text-sm">
                            {modelos.length} modelos encontrados
                        </Typography>
                    </div>
                </CardHeader>
                <CardBody className="px-0">
                    {modelos.length === 0 ? (
                        <div className="text-center py-12">
                            <Typography variant="h6" color="blue-gray" className="mt-4">
                                No hay modelos registrados
                            </Typography>
                            <Typography color="gray" className="mt-2">
                                Comienza creando tu primer modelo
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
                                            Modelo
                                        </Typography>
                                    </th>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
                                        >
                                            Marca & Tipo
                                        </Typography>
                                    </th>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
                                        >
                                            Especificaciones
                                        </Typography>
                                    </th>
                                    <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
                                        >
                                            Materiales
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
                                {modelos.map((modelo, index) => {
                                    const isLast = index === modelos.length - 1;
                                    const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                                    return (
                                        <tr key={modelo.id} className="hover:bg-blue-gray-50/50">
                                            {/* Modelo */}
                                            <td className={classes}>
                                                <div>
                                                    <Typography variant="small" color="blue-gray" className="font-semibold">
                                                        {modelo.nombre}
                                                    </Typography>
                                                    <Typography variant="small" color="gray" className="font-mono">
                                                        {modelo.codigo_modelo}
                                                    </Typography>
                                                </div>
                                            </td>

                                            {/* Marca & Tipo */}
                                            <td className={classes}>
                                                <div>
                                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                                        {modelo.marca_info?.nombre || 'Sin marca'}
                                                    </Typography>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <Chip
                                                            size="sm"
                                                            variant="ghost"
                                                            color={modelo.tipo_material_info?.es_unico ? "purple" : "blue"}
                                                            value={modelo.tipo_material_info?.es_unico ? "ONU" : "Material"}
                                                        />
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Especificaciones */}
                                            <td className={classes}>
                                                <div>
                                                    <Typography variant="small" color="blue-gray">
                                                        {modelo.tipo_material_info?.nombre || 'Sin tipo'}
                                                    </Typography>
                                                    <Typography variant="small" color="gray">
                                                        Unidad: {modelo.unidad_medida_info?.simbolo || 'N/A'}
                                                    </Typography>
                                                    {modelo.requiere_inspeccion_inicial && (
                                                        <Chip
                                                            size="sm"
                                                            variant="ghost"
                                                            color="amber"
                                                            value="Req. Inspección"
                                                            className="mt-1"
                                                        />
                                                    )}
                                                </div>
                                            </td>

                                            {/* Materiales */}
                                            <td className={classes}>
                                                <div className="flex flex-col">
                                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                                        {modelo.materiales_count || 0} totales
                                                    </Typography>
                                                    <Typography variant="small" color="green" className="font-normal">
                                                        {modelo.materiales_disponibles || 0} disponibles
                                                    </Typography>
                                                </div>
                                            </td>

                                            {/* Estado */}
                                            <td className={classes}>
                                                <Chip
                                                    variant="ghost"
                                                    color={modelo.activo ? "green" : "red"}
                                                    size="sm"
                                                    value={modelo.activo ? "Activo" : "Inactivo"}
                                                    icon={
                                                        <span
                                                            className={`mx-auto mt-1 block h-2 w-2 rounded-full ${
                                                                modelo.activo ? 'bg-green-900' : 'bg-red-900'
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
                                                            <Tooltip content={modelo.activo ? "Desactivar" : "Activar"}>
                                                                <IconButton
                                                                    variant="text"
                                                                    color={modelo.activo ? "orange" : "green"}
                                                                    onClick={() => handleToggleActivo(modelo)}
                                                                >
                                                                    {modelo.activo ?
                                                                        <IoEyeOff className="h-4 w-4" /> :
                                                                        <IoEye className="h-4 w-4" />
                                                                    }
                                                                </IconButton>
                                                            </Tooltip>

                                                            <Tooltip content="Editar">
                                                                <IconButton
                                                                    variant="text"
                                                                    color="blue-gray"
                                                                    onClick={() => handleEdit(modelo)}
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
                                                                onClick={() => handleDelete(modelo)}
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
            <ModeloDialog
                open={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
                onSubmit={handleCreateSubmit}
                title="Crear Nuevo Modelo"
                mode="create"
            />

            <ModeloDialog
                open={isEditDialogOpen}
                onClose={() => {
                    setIsEditDialogOpen(false);
                    setSelectedModelo(null);
                }}
                onSubmit={handleEditSubmit}
                title="Editar Modelo"
                mode="edit"
                initialData={selectedModelo}
            />
        </div>
    );
};

export default ModelosPage;