// ======================================================
// src/core/almacenes/pages/almacenes/index.jsx
// Página principal de gestión de almacenes
// ======================================================

import React, { useState, useEffect } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Typography,
    Button,
    IconButton,
    Input,
    Select,
    Option,
    Chip,
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
    Alert,
} from '@material-tailwind/react';
import {
    IoAdd,
    IoSearch,
    IoRefresh,
    IoWarehouse,
    IoStatsChart,
    IoFilter,
    IoGrid,
    IoList,
} from 'react-icons/io5';

import { useAlmacenes } from '../../hooks/useAlmacenes';
import { useAuthStatus } from '../../../../core/auth/hooks/useAuth';
import { AlmacenesTable, AlmacenesGrid, AlmacenCard } from './almacenComponents';
import {
    CrearAlmacenDialog,
    EditarAlmacenDialog,
    EliminarAlmacenDialog,
    EstadisticasAlmacenDialog
} from './almacenDialogs';
import { useAlmacenActions, useAlmacenFilters } from '/hooks';
import Loader from '../../../../core/layout/Loader';

const AlmacenesPage = () => {
    const { isAuthenticated } = useAuthStatus();
    const [vistaActual, setVistaActual] = useState('tabla'); // 'tabla', 'grid', 'resumen'
    const [filtrosAvanzados, setFiltrosAvanzados] = useState(false);
    const [busquedaTermino, setBusquedaTermino] = useState('');

    // Hook principal de almacenes
    const {
        almacenes,
        almacenActual,
        estadisticas,
        resumen,
        filtros,
        paginacion,
        loading,
        isLoading,
        cargarAlmacenes,
        obtenerAlmacen,
        crearAlmacen,
        actualizarAlmacen,
        eliminarAlmacen,
        cargarEstadisticasAlmacen,
        cargarResumenAlmacenes,
        obtenerAlmacenPrincipal,
        aplicarFiltros,
        limpiarFiltros,
        cambiarPagina,
        buscar,
        refrescar,
    } = useAlmacenes();

    // Hooks personalizados
    const {
        dialogos,
        abrirDialogo,
        cerrarDialogo,
        handleCrear,
        handleEditar,
        handleEliminar,
        handleVerEstadisticas
    } = useAlmacenActions({
        crearAlmacen,
        actualizarAlmacen,
        eliminarAlmacen,
        obtenerAlmacen,
        cargarEstadisticasAlmacen,
        refrescar
    });

    const {
        filtrosDisponibles,
        aplicarFiltroRapido,
        limpiarTodosFiltros,
        getFiltrosActivos
    } = useAlmacenFilters({
        filtros,
        aplicarFiltros,
        limpiarFiltros
    });

    // Cargar resumen al montar
    useEffect(() => {
        cargarResumenAlmacenes();
    }, []);

    // Manejar búsqueda
    const handleBusqueda = (evento) => {
        const termino = evento.target.value;
        setBusquedaTermino(termino);

        // Debounce la búsqueda
        const timeoutId = setTimeout(() => {
            buscar(termino);
        }, 500);

        return () => clearTimeout(timeoutId);
    };

    // Tabs para diferentes vistas
    const tabs = [
        {
            key: 'tabla',
            label: 'Vista Tabla',
            icon: IoList,
            value: 'tabla'
        },
        {
            key: 'grid',
            label: 'Vista Grid',
            icon: IoGrid,
            value: 'grid'
        },
        {
            key: 'resumen',
            label: 'Resumen',
            icon: IoStatsChart,
            value: 'resumen'
        }
    ];

    if (!isAuthenticated) {
        return <Loader />;
    }

    return (
        <div className="space-y-6">
            {/* Header con título y acciones principales */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                        <IoWarehouse className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <Typography variant="h4" color="blue-gray" className="font-bold">
                            Gestión de Almacenes
                        </Typography>
                        <Typography color="gray" className="text-sm">
                            Administra almacenes, ubicaciones y estadísticas operativas
                        </Typography>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="outlined"
                        color="blue-gray"
                        className="flex items-center gap-2"
                        onClick={refrescar}
                        disabled={isLoading()}
                    >
                        <IoRefresh className={`h-4 w-4 ${isLoading() ? 'animate-spin' : ''}`} />
                        Actualizar
                    </Button>
                    <Button
                        size="sm"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                        onClick={() => abrirDialogo('crear')}
                    >
                        <IoAdd className="h-4 w-4" />
                        Nuevo Almacén
                    </Button>
                </div>
            </div>

            {/* Resumen rápido */}
            {resumen && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="border border-blue-100">
                        <CardBody className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Typography color="gray" className="text-sm font-medium">
                                        Total Almacenes
                                    </Typography>
                                    <Typography variant="h4" color="blue-gray" className="font-bold">
                                        {resumen.total_almacenes || 0}
                                    </Typography>
                                </div>
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <IoWarehouse className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="border border-green-100">
                        <CardBody className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Typography color="gray" className="text-sm font-medium">
                                        Almacenes Activos
                                    </Typography>
                                    <Typography variant="h4" color="green" className="font-bold">
                                        {resumen.almacenes_activos || 0}
                                    </Typography>
                                </div>
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <IoStatsChart className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="border border-orange-100">
                        <CardBody className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Typography color="gray" className="text-sm font-medium">
                                        Total Materiales
                                    </Typography>
                                    <Typography variant="h4" color="orange" className="font-bold">
                                        {resumen.total_materiales || 0}
                                    </Typography>
                                </div>
                                <div className="p-2 bg-orange-50 rounded-lg">
                                    <IoStatsChart className="h-6 w-6 text-orange-600" />
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="border border-purple-100">
                        <CardBody className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Typography color="gray" className="text-sm font-medium">
                                        Valor Total
                                    </Typography>
                                    <Typography variant="h4" color="purple" className="font-bold">
                                        {new Intl.NumberFormat('es-BO', {
                                            style: 'currency',
                                            currency: 'BOB'
                                        }).format(resumen.valor_total || 0)}
                                    </Typography>
                                </div>
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <IoStatsChart className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            )}

            {/* Barra de búsqueda y filtros */}
            <Card>
                <CardBody className="p-4">
                    <div className="space-y-4">
                        {/* Primera fila: búsqueda y vista */}
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Buscar almacenes por código, nombre, ciudad..."
                                        value={busquedaTermino}
                                        onChange={handleBusqueda}
                                        className="pl-10 !border-gray-300 focus:!border-blue-500"
                                        containerProps={{
                                            className: "min-w-0"
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant={filtrosAvanzados ? "filled" : "outlined"}
                                    color="blue-gray"
                                    className="flex items-center gap-2"
                                    onClick={() => setFiltrosAvanzados(!filtrosAvanzados)}
                                >
                                    <IoFilter className="h-4 w-4" />
                                    Filtros
                                </Button>

                                <Tabs value={vistaActual} className="w-auto">
                                    <TabsHeader className="grid w-full grid-cols-3 !bg-blue-gray-50">
                                        {tabs.map(({ key, label, icon: Icon, value }) => (
                                            <Tab
                                                key={key}
                                                value={value}
                                                onClick={() => setVistaActual(value)}
                                                className="!py-2 !px-3"
                                            >
                                                <div className="flex items-center gap-1">
                                                    <Icon className="h-4 w-4" />
                                                    <span className="hidden sm:inline">{label}</span>
                                                </div>
                                            </Tab>
                                        ))}
                                    </TabsHeader>
                                </Tabs>
                            </div>
                        </div>

                        {/* Filtros avanzados */}
                        {filtrosAvanzados && (
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
                                <Select
                                    label="Tipo"
                                    value={filtros.tipo || ''}
                                    onChange={(val) => aplicarFiltros({ tipo: val })}
                                >
                                    <Option value="">Todos los tipos</Option>
                                    <Option value="CENTRAL">Central</Option>
                                    <Option value="REGIONAL">Regional</Option>
                                    <Option value="LOCAL">Local</Option>
                                    <Option value="TEMPORAL">Temporal</Option>
                                </Select>

                                <Select
                                    label="Estado"
                                    value={filtros.activo?.toString() || ''}
                                    onChange={(val) => aplicarFiltros({ activo: val === 'true' })}
                                >
                                    <Option value="">Todos</Option>
                                    <Option value="true">Activos</Option>
                                    <Option value="false">Inactivos</Option>
                                </Select>

                                <Input
                                    label="Ciudad"
                                    value={filtros.ciudad || ''}
                                    onChange={(e) => aplicarFiltros({ ciudad: e.target.value })}
                                />

                                <Select
                                    label="Es Principal"
                                    value={filtros.es_principal?.toString() || ''}
                                    onChange={(val) => aplicarFiltros({ es_principal: val === 'true' })}
                                >
                                    <Option value="">Todos</Option>
                                    <Option value="true">Principal</Option>
                                    <Option value="false">Secundario</Option>
                                </Select>

                                <div className="flex items-end gap-2">
                                    <Button
                                        size="sm"
                                        color="gray"
                                        variant="outlined"
                                        onClick={limpiarTodosFiltros}
                                        className="flex-1"
                                    >
                                        Limpiar
                                    </Button>
                                    <IconButton
                                        size="sm"
                                        color="blue-gray"
                                        variant="outlined"
                                        onClick={() => setFiltrosAvanzados(false)}
                                    >
                                        ×
                                    </IconButton>
                                </div>
                            </div>
                        )}

                        {/* Filtros activos */}
                        {getFiltrosActivos().length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {getFiltrosActivos().map((filtro, index) => (
                                    <Chip
                                        key={index}
                                        value={`${filtro.label}: ${filtro.value}`}
                                        onClose={() => {
                                            const nuevosFiltros = { ...filtros };
                                            delete nuevosFiltros[filtro.key];
                                            aplicarFiltros(nuevosFiltros);
                                        }}
                                        className="bg-blue-50 text-blue-800"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </CardBody>
            </Card>

            {/* Contenido principal */}
            <Card>
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="flex items-center justify-between">
                        <Typography variant="h6" color="blue-gray">
                            Lista de Almacenes
                        </Typography>
                        <Typography variant="small" color="gray">
                            {paginacion.total > 0
                                ? `${((paginacion.page - 1) * paginacion.page_size) + 1}-${Math.min(paginacion.page * paginacion.page_size, paginacion.total)} de ${paginacion.total} almacenes`
                                : 'Sin resultados'
                            }
                        </Typography>
                    </div>
                </CardHeader>

                <CardBody className="px-0">
                    {/* Vista de carga */}
                    {isLoading('almacenes') && (
                        <div className="flex items-center justify-center py-12">
                            <Loader />
                        </div>
                    )}

                    {/* Sin datos */}
                    {!isLoading('almacenes') && almacenes.length === 0 && (
                        <div className="text-center py-12">
                            <IoWarehouse className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <Typography variant="h6" color="blue-gray" className="mb-2">
                                No hay almacenes
                            </Typography>
                            <Typography color="gray" className="mb-4">
                                {Object.keys(filtros).length > 0
                                    ? 'No se encontraron almacenes con los filtros aplicados'
                                    : 'Comienza creando tu primer almacén'
                                }
                            </Typography>
                            {Object.keys(filtros).length === 0 && (
                                <Button
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700"
                                    onClick={() => abrirDialogo('crear')}
                                >
                                    Crear Primer Almacén
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Contenido según la vista */}
                    {!isLoading('almacenes') && almacenes.length > 0 && (
                        <Tabs value={vistaActual}>
                            <TabsBody>
                                <TabPanel value="tabla" className="p-0">
                                    <AlmacenesTable
                                        almacenes={almacenes}
                                        paginacion={paginacion}
                                        onChangePage={cambiarPagina}
                                        onEdit={(almacen) => handleEditar(almacen)}
                                        onDelete={(almacen) => handleEliminar(almacen)}
                                        onViewStats={(almacen) => handleVerEstadisticas(almacen)}
                                        loading={isLoading('almacenes')}
                                    />
                                </TabPanel>

                                <TabPanel value="grid" className="p-4">
                                    <AlmacenesGrid
                                        almacenes={almacenes}
                                        paginacion={paginacion}
                                        onChangePage={cambiarPagina}
                                        onEdit={(almacen) => handleEditar(almacen)}
                                        onDelete={(almacen) => handleEliminar(almacen)}
                                        onViewStats={(almacen) => handleVerEstadisticas(almacen)}
                                        loading={isLoading('almacenes')}
                                    />
                                </TabPanel>

                                <TabPanel value="resumen" className="p-4">
                                    {/* Resumen estadístico */}
                                    <div className="space-y-6">
                                        {resumen && (
                                            <>
                                                {/* Estadísticas generales */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    <Card className="border border-blue-100">
                                                        <CardBody className="p-4">
                                                            <Typography variant="h6" color="blue-gray" className="mb-2">
                                                                Distribución por Tipo
                                                            </Typography>
                                                            <div className="space-y-2">
                                                                {Object.entries(resumen.por_tipo || {}).map(([tipo, cantidad]) => (
                                                                    <div key={tipo} className="flex justify-between">
                                                                        <Typography variant="small" color="gray">
                                                                            {tipo}:
                                                                        </Typography>
                                                                        <Typography variant="small" color="blue-gray" className="font-medium">
                                                                            {cantidad}
                                                                        </Typography>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </CardBody>
                                                    </Card>

                                                    <Card className="border border-green-100">
                                                        <CardBody className="p-4">
                                                            <Typography variant="h6" color="blue-gray" className="mb-2">
                                                                Distribución por Ciudad
                                                            </Typography>
                                                            <div className="space-y-2">
                                                                {Object.entries(resumen.por_ciudad || {}).slice(0, 5).map(([ciudad, cantidad]) => (
                                                                    <div key={ciudad} className="flex justify-between">
                                                                        <Typography variant="small" color="gray">
                                                                            {ciudad}:
                                                                        </Typography>
                                                                        <Typography variant="small" color="blue-gray" className="font-medium">
                                                                            {cantidad}
                                                                        </Typography>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </CardBody>
                                                    </Card>

                                                    <Card className="border border-purple-100">
                                                        <CardBody className="p-4">
                                                            <Typography variant="h6" color="blue-gray" className="mb-2">
                                                                Métricas Operativas
                                                            </Typography>
                                                            <div className="space-y-2">
                                                                <div className="flex justify-between">
                                                                    <Typography variant="small" color="gray">
                                                                        Capacidad Promedio:
                                                                    </Typography>
                                                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                                                        {Math.round(resumen.capacidad_promedio || 0)}%
                                                                    </Typography>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <Typography variant="small" color="gray">
                                                                        Utilización:
                                                                    </Typography>
                                                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                                                        {Math.round(resumen.utilizacion_promedio || 0)}%
                                                                    </Typography>
                                                                </div>
                                                                <div className="flex justify-between">
                                                                    <Typography variant="small" color="gray">
                                                                        Almacén Principal:
                                                                    </Typography>
                                                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                                                        {resumen.almacen_principal?.nombre || 'No definido'}
                                                                    </Typography>
                                                                </div>
                                                            </div>
                                                        </CardBody>
                                                    </Card>
                                                </div>

                                                {/* Lista de almacenes en formato resumen */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                                    {almacenes.map((almacen) => (
                                                        <AlmacenCard
                                                            key={almacen.id}
                                                            almacen={almacen}
                                                            onEdit={() => handleEditar(almacen)}
                                                            onDelete={() => handleEliminar(almacen)}
                                                            onViewStats={() => handleVerEstadisticas(almacen)}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </TabPanel>
                            </TabsBody>
                        </Tabs>
                    )}
                </CardBody>
            </Card>

            {/* Dialogs */}
            <CrearAlmacenDialog
                open={uiState.dialogos.crear}
                onClose={() => uiState.cerrarDialogo('crear')}
                onSubmit={actions.handleCrearAlmacen}
                loading={isLoading('create')}
            />

            <EditarAlmacenDialog
                open={uiState.dialogos.editar}
                almacen={uiState.almacenSeleccionado}
                onClose={() => uiState.cerrarDialogo('editar')}
                onSubmit={actions.handleActualizarAlmacen}
                loading={isLoading('update')}
            />

            <EliminarAlmacenDialog
                open={uiState.dialogos.eliminar}
                almacen={uiState.almacenSeleccionado}
                onClose={() => uiState.cerrarDialogo('eliminar')}
                onConfirm={actions.handleEliminarAlmacen}
                loading={isLoading('delete')}
            />

            <EstadisticasAlmacenDialog
                open={uiState.dialogos.estadisticas}
                almacen={uiState.almacenSeleccionado}
                estadisticas={estadisticas}
                onClose={() => uiState.cerrarDialogo('estadisticas')}
                loading={isLoading('estadisticas')}
            />
        </div>
    );
};

export default AlmacenesPage;