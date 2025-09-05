// ======================================================
// src/core/almacenes/pages/almacenes/almacenComponents.jsx
// Componentes para la gestión de almacenes
// ======================================================

import React from 'react';
import {
    Card,
    CardBody,
    Typography,
    IconButton,
    Chip,
    Progress,
    Button,
    Tooltip,
} from '@material-tailwind/react';
import {
    IoEye,
    IoCreate,
    IoTrash,
    IoStatsChart,
    IoLocation,
    IoWarehouse,
    IoCheckmarkCircle,
    IoCloseCircle,
    IoNavigate,
    IoArrowForward,
    IoArrowBack,
} from 'react-icons/io5';

// ========== TABLA DE ALMACENES ==========
export const AlmacenesTable = ({
                                   almacenes,
                                   paginacion,
                                   onChangePage,
                                   onEdit,
                                   onDelete,
                                   onViewStats,
                                   loading = false
                               }) => {
    const TABLE_HEAD = ["Código", "Nombre", "Tipo", "Ciudad", "Estado", "Materiales", "Acciones"];

    const getChipColor = (tipo) => {
        const colores = {
            'CENTRAL': 'blue',
            'REGIONAL': 'green',
            'LOCAL': 'orange',
            'TEMPORAL': 'purple',
        };
        return colores[tipo] || 'gray';
    };

    const formatearNumero = (numero) => {
        return new Intl.NumberFormat('es-BO').format(numero || 0);
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-max table-auto text-left">
                <thead>
                <tr>
                    {TABLE_HEAD.map((head) => (
                        <th
                            key={head}
                            className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                        >
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-medium leading-none opacity-70 uppercase"
                            >
                                {head}
                            </Typography>
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {almacenes.map((almacen, index) => {
                    const isLast = index === almacenes.length - 1;
                    const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                    return (
                        <tr key={almacen.id} className="hover:bg-blue-gray-50/50">
                            <td className={classes}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${almacen.es_principal ? 'bg-yellow-500' : 'bg-gray-300'}`} />
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-medium"
                                    >
                                        {almacen.codigo}
                                    </Typography>
                                </div>
                            </td>

                            <td className={classes}>
                                <div>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-medium"
                                    >
                                        {almacen.nombre}
                                    </Typography>
                                    {almacen.direccion && (
                                        <Typography
                                            variant="small"
                                            color="gray"
                                            className="opacity-70"
                                        >
                                            {almacen.direccion}
                                        </Typography>
                                    )}
                                </div>
                            </td>

                            <td className={classes}>
                                <Chip
                                    size="sm"
                                    value={almacen.tipo}
                                    color={getChipColor(almacen.tipo)}
                                    className="rounded-full"
                                />
                            </td>

                            <td className={classes}>
                                <div className="flex items-center gap-2">
                                    <IoLocation className="h-4 w-4 text-gray-400" />
                                    <Typography variant="small" color="blue-gray">
                                        {almacen.ciudad}
                                    </Typography>
                                </div>
                            </td>

                            <td className={classes}>
                                <div className="flex items-center gap-2">
                                    {almacen.activo ? (
                                        <IoCheckmarkCircle className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <IoCloseCircle className="h-4 w-4 text-red-500" />
                                    )}
                                    <Typography
                                        variant="small"
                                        color={almacen.activo ? "green" : "red"}
                                        className="font-medium"
                                    >
                                        {almacen.activo ? 'Activo' : 'Inactivo'}
                                    </Typography>
                                </div>
                            </td>

                            <td className={classes}>
                                <div>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-medium"
                                    >
                                        {formatearNumero(almacen.total_materiales)}
                                    </Typography>
                                    {almacen.capacidad && (
                                        <div className="mt-1">
                                            <Progress
                                                value={Math.min((almacen.total_materiales / almacen.capacidad) * 100, 100)}
                                                size="sm"
                                                color={almacen.total_materiales > almacen.capacidad * 0.8 ? "red" : "blue"}
                                            />
                                        </div>
                                    )}
                                </div>
                            </td>

                            <td className={classes}>
                                <div className="flex items-center gap-1">
                                    <Tooltip content="Ver estadísticas">
                                        <IconButton
                                            variant="text"
                                            size="sm"
                                            color="blue"
                                            onClick={() => onViewStats(almacen)}
                                        >
                                            <IoStatsChart className="h-4 w-4" />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip content="Editar">
                                        <IconButton
                                            variant="text"
                                            size="sm"
                                            color="blue-gray"
                                            onClick={() => onEdit(almacen)}
                                        >
                                            <IoCreate className="h-4 w-4" />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip content="Eliminar">
                                        <IconButton
                                            variant="text"
                                            size="sm"
                                            color="red"
                                            onClick={() => onDelete(almacen)}
                                        >
                                            <IoTrash className="h-4 w-4" />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>

            {/* Paginación */}
            {paginacion.pages > 1 && (
                <div className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                        Página {paginacion.page} de {paginacion.pages}
                    </Typography>
                    <div className="flex gap-2">
                        <Button
                            variant="outlined"
                            size="sm"
                            disabled={paginacion.page <= 1}
                            onClick={() => onChangePage(paginacion.page - 1)}
                            className="flex items-center gap-2"
                        >
                            <IoArrowBack className="h-4 w-4" />
                            Anterior
                        </Button>
                        <Button
                            variant="outlined"
                            size="sm"
                            disabled={paginacion.page >= paginacion.pages}
                            onClick={() => onChangePage(paginacion.page + 1)}
                            className="flex items-center gap-2"
                        >
                            Siguiente
                            <IoArrowForward className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

// ========== VISTA GRID DE ALMACENES ==========
export const AlmacenesGrid = ({
                                  almacenes,
                                  paginacion,
                                  onChangePage,
                                  onEdit,
                                  onDelete,
                                  onViewStats,
                                  loading = false
                              }) => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {almacenes.map((almacen) => (
                    <AlmacenCard
                        key={almacen.id}
                        almacen={almacen}
                        onEdit={() => onEdit(almacen)}
                        onDelete={() => onDelete(almacen)}
                        onViewStats={() => onViewStats(almacen)}
                        variant="full"
                    />
                ))}
            </div>

            {/* Paginación */}
            {paginacion.pages > 1 && (
                <div className="flex items-center justify-between pt-4">
                    <Typography variant="small" color="blue-gray" className="font-normal">
                        Página {paginacion.page} de {paginacion.pages}
                    </Typography>
                    <div className="flex gap-2">
                        <Button
                            variant="outlined"
                            size="sm"
                            disabled={paginacion.page <= 1}
                            onClick={() => onChangePage(paginacion.page - 1)}
                            className="flex items-center gap-2"
                        >
                            <IoArrowBack className="h-4 w-4" />
                            Anterior
                        </Button>
                        <Button
                            variant="outlined"
                            size="sm"
                            disabled={paginacion.page >= paginacion.pages}
                            onClick={() => onChangePage(paginacion.page + 1)}
                            className="flex items-center gap-2"
                        >
                            Siguiente
                            <IoArrowForward className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

// ========== CARD DE ALMACÉN ==========
export const AlmacenCard = ({
                                almacen,
                                onEdit,
                                onDelete,
                                onViewStats,
                                variant = "compact" // "compact" | "full"
                            }) => {
    const getChipColor = (tipo) => {
        const colores = {
            'CENTRAL': 'blue',
            'REGIONAL': 'green',
            'LOCAL': 'orange',
            'TEMPORAL': 'purple',
        };
        return colores[tipo] || 'gray';
    };

    const formatearNumero = (numero) => {
        return new Intl.NumberFormat('es-BO').format(numero || 0);
    };

    const calcularPorcentajeUtilizacion = () => {
        if (!almacen.capacidad || almacen.capacidad === 0) return 0;
        return Math.min((almacen.total_materiales / almacen.capacidad) * 100, 100);
    };

    const getColorUtilizacion = (porcentaje) => {
        if (porcentaje >= 90) return 'red';
        if (porcentaje >= 75) return 'orange';
        if (porcentaje >= 50) return 'yellow';
        return 'green';
    };

    const porcentajeUtilizacion = calcularPorcentajeUtilizacion();

    return (
        <Card className={`hover:shadow-lg transition-shadow duration-200 ${
            almacen.es_principal ? 'ring-2 ring-yellow-200 bg-yellow-50/30' : ''
        }`}>
            <CardBody className="p-4">
                {/* Header del card */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                            almacen.es_principal
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-blue-100 text-blue-700'
                        }`}>
                            <IoWarehouse className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <Typography variant="h6" color="blue-gray" className="font-bold">
                                    {almacen.codigo}
                                </Typography>
                                {almacen.es_principal && (
                                    <Chip
                                        size="sm"
                                        value="Principal"
                                        color="yellow"
                                        className="rounded-full"
                                    />
                                )}
                            </div>
                            <Typography color="gray" className="text-sm">
                                {almacen.nombre}
                            </Typography>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <Chip
                            size="sm"
                            value={almacen.tipo}
                            color={getChipColor(almacen.tipo)}
                            className="rounded-full"
                        />
                    </div>
                </div>

                {/* Información detallada */}
                <div className="space-y-3">
                    {/* Ubicación */}
                    <div className="flex items-center gap-2">
                        <IoLocation className="h-4 w-4 text-gray-400" />
                        <Typography variant="small" color="gray">
                            {almacen.ciudad}
                            {almacen.direccion && ` - ${almacen.direccion}`}
                        </Typography>
                    </div>

                    {/* Estado y materiales */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Typography variant="small" color="gray" className="mb-1">
                                Estado
                            </Typography>
                            <div className="flex items-center gap-2">
                                {almacen.activo ? (
                                    <IoCheckmarkCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                    <IoCloseCircle className="h-4 w-4 text-red-500" />
                                )}
                                <Typography
                                    variant="small"
                                    color={almacen.activo ? "green" : "red"}
                                    className="font-medium"
                                >
                                    {almacen.activo ? 'Activo' : 'Inactivo'}
                                </Typography>
                            </div>
                        </div>

                        <div>
                            <Typography variant="small" color="gray" className="mb-1">
                                Materiales
                            </Typography>
                            <Typography variant="small" color="blue-gray" className="font-bold">
                                {formatearNumero(almacen.total_materiales)}
                            </Typography>
                        </div>
                    </div>

                    {/* Utilización de capacidad */}
                    {almacen.capacidad && (
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <Typography variant="small" color="gray">
                                    Utilización
                                </Typography>
                                <Typography variant="small" color="blue-gray" className="font-medium">
                                    {Math.round(porcentajeUtilizacion)}%
                                </Typography>
                            </div>
                            <Progress
                                value={porcentajeUtilizacion}
                                color={getColorUtilizacion(porcentajeUtilizacion)}
                                size="sm"
                            />
                            <Typography variant="small" color="gray" className="text-xs mt-1">
                                {formatearNumero(almacen.total_materiales)} / {formatearNumero(almacen.capacidad)} unidades
                            </Typography>
                        </div>
                    )}

                    {/* Información adicional en vista completa */}
                    {variant === "full" && (
                        <>
                            {/* Estadísticas rápidas */}
                            {almacen.estadisticas && (
                                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                                    <div className="text-center">
                                        <Typography variant="small" color="green" className="font-bold">
                                            {almacen.estadisticas.disponibles || 0}
                                        </Typography>
                                        <Typography variant="small" color="gray" className="text-xs">
                                            Disponibles
                                        </Typography>
                                    </div>
                                    <div className="text-center">
                                        <Typography variant="small" color="orange" className="font-bold">
                                            {almacen.estadisticas.asignados || 0}
                                        </Typography>
                                        <Typography variant="small" color="gray" className="text-xs">
                                            Asignados
                                        </Typography>
                                    </div>
                                    <div className="text-center">
                                        <Typography variant="small" color="blue" className="font-bold">
                                            {almacen.estadisticas.en_laboratorio || 0}
                                        </Typography>
                                        <Typography variant="small" color="gray" className="text-xs">
                                            En Lab.
                                        </Typography>
                                    </div>
                                </div>
                            )}

                            {/* Última actividad */}
                            {almacen.ultima_actividad && (
                                <div className="pt-2 border-t border-gray-100">
                                    <Typography variant="small" color="gray">
                                        Última actividad: {new Date(almacen.ultima_actividad).toLocaleDateString('es-BO')}
                                    </Typography>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Acciones */}
                <div className="flex items-center justify-end gap-1 mt-4 pt-3 border-t border-gray-100">
                    <Tooltip content="Ver estadísticas">
                        <IconButton
                            variant="text"
                            size="sm"
                            color="blue"
                            onClick={() => onViewStats(almacen)}
                        >
                            <IoStatsChart className="h-4 w-4" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip content="Editar">
                        <IconButton
                            variant="text"
                            size="sm"
                            color="blue-gray"
                            onClick={() => onEdit(almacen)}
                        >
                            <IoCreate className="h-4 w-4" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip content="Eliminar">
                        <IconButton
                            variant="text"
                            size="sm"
                            color="red"
                            onClick={() => onDelete(almacen)}
                        >
                            <IoTrash className="h-4 w-4" />
                        </IconButton>
                    </Tooltip>
                </div>
            </CardBody>
        </Card>
    );
};

// ========== ESTADÍSTICAS DASHBOARD ==========
export const EstadisticasDashboard = ({ estadisticas, loading = false }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="animate-pulse">
                        <CardBody className="p-4">
                            <div className="h-16 bg-gray-200 rounded"></div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        );
    }

    if (!estadisticas) {
        return null;
    }

    const metricas = [
        {
            label: 'Materiales Totales',
            valor: estadisticas.total_materiales,
            icon: IoWarehouse,
            color: 'blue',
            formato: 'numero'
        },
        {
            label: 'Disponibles',
            valor: estadisticas.materiales_disponibles,
            icon: IoCheckmarkCircle,
            color: 'green',
            formato: 'numero'
        },
        {
            label: 'En Laboratorio',
            valor: estadisticas.materiales_laboratorio,
            icon: IoStatsChart,
            color: 'orange',
            formato: 'numero'
        },
        {
            label: 'Utilización',
            valor: estadisticas.porcentaje_utilizacion,
            icon: IoStatsChart,
            color: 'purple',
            formato: 'porcentaje'
        }
    ];

    const formatearValor = (valor, formato) => {
        switch (formato) {
            case 'numero':
                return new Intl.NumberFormat('es-BO').format(valor || 0);
            case 'porcentaje':
                return `${Math.round(valor || 0)}%`;
            case 'moneda':
                return new Intl.NumberFormat('es-BO', {
                    style: 'currency',
                    currency: 'BOB'
                }).format(valor || 0);
            default:
                return valor || 0;
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metricas.map((metrica, index) => {
                const Icon = metrica.icon;
                return (
                    <Card key={index} className={`border border-${metrica.color}-100`}>
                        <CardBody className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Typography color="gray" className="text-sm font-medium">
                                        {metrica.label}
                                    </Typography>
                                    <Typography
                                        variant="h4"
                                        color={metrica.color}
                                        className="font-bold"
                                    >
                                        {formatearValor(metrica.valor, metrica.formato)}
                                    </Typography>
                                </div>
                                <div className={`p-2 bg-${metrica.color}-50 rounded-lg`}>
                                    <Icon className={`h-6 w-6 text-${metrica.color}-600`} />
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                );
            })}
        </div>
    );
};

// ========== SELECTOR DE ALMACÉN ==========
export const AlmacenSelector = ({
                                    almacenes,
                                    selectedId,
                                    onSelect,
                                    label = "Seleccionar Almacén",
                                    placeholder = "Elige un almacén",
                                    disabled = false,
                                    error = false,
                                    required = false,
                                    filterFn = null
                                }) => {
    const almacenesFiltrados = filterFn ? almacenes.filter(filterFn) : almacenes;

    return (
        <Select
            label={label}
            value={selectedId?.toString() || ''}
            onChange={(val) => onSelect(parseInt(val))}
            disabled={disabled}
            error={error}
        >
            {!required && (
                <Option value="">
                    {placeholder}
                </Option>
            )}
            {almacenesFiltrados.map((almacen) => (
                <Option key={almacen.id} value={almacen.id.toString()}>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                            {almacen.es_principal && (
                                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                            )}
                            <span>{almacen.codigo} - {almacen.nombre}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Chip
                                size="sm"
                                value={almacen.tipo}
                                color={getChipColor(almacen.tipo)}
                                className="rounded-full"
                            />
                            <Typography variant="small" color="gray">
                                {almacen.ciudad}
                            </Typography>
                        </div>
                    </div>
                </Option>
            ))}
        </Select>
    );
};

// ========== FILTROS RÁPIDOS ==========
export const FiltrosRapidos = ({ onFiltrar, filtrosActivos = {} }) => {
    const filtrosRapidos = [
        { key: 'activo', label: 'Solo Activos', value: true },
        { key: 'es_principal', label: 'Principal', value: true },
        { key: 'tipo', label: 'Central', value: 'CENTRAL' },
        { key: 'tipo', label: 'Regional', value: 'REGIONAL' },
        { key: 'tipo', label: 'Local', value: 'LOCAL' },
    ];

    return (
        <div className="flex flex-wrap gap-2">
            {filtrosRapidos.map((filtro, index) => {
                const isActive = filtrosActivos[filtro.key] === filtro.value;

                return (
                    <Button
                        key={index}
                        size="sm"
                        variant={isActive ? "filled" : "outlined"}
                        color={isActive ? "blue" : "blue-gray"}
                        className="rounded-full"
                        onClick={() => onFiltrar(filtro.key, isActive ? null : filtro.value)}
                    >
                        {filtro.label}
                    </Button>
                );
            })}
        </div>
    );
};

// ========== RESUMEN ESTADÍSTICO ==========
export const ResumenEstadistico = ({ resumen, onRefresh, loading = false }) => {
    if (loading) {
        return (
            <Card className="animate-pulse">
                <CardBody className="p-6">
                    <div className="h-32 bg-gray-200 rounded"></div>
                </CardBody>
            </Card>
        );
    }

    if (!resumen) {
        return (
            <Card>
                <CardBody className="p-6 text-center">
                    <Typography color="gray">
                        No hay datos de resumen disponibles
                    </Typography>
                    <Button
                        size="sm"
                        variant="outlined"
                        onClick={onRefresh}
                        className="mt-2"
                    >
                        Cargar Resumen
                    </Button>
                </CardBody>
            </Card>
        );
    }

    const metricas = [
        {
            label: 'Almacenes por Tipo',
            datos: resumen.por_tipo || {},
            color: 'blue'
        },
        {
            label: 'Distribución por Ciudad',
            datos: resumen.por_ciudad || {},
            color: 'green'
        },
        {
            label: 'Estado de Almacenes',
            datos: {
                'Activos': resumen.almacenes_activos || 0,
                'Inactivos': (resumen.total_almacenes || 0) - (resumen.almacenes_activos || 0)
            },
            color: 'orange'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {metricas.map((metrica, index) => (
                <Card key={index} className={`border border-${metrica.color}-100`}>
                    <CardBody className="p-4">
                        <Typography variant="h6" color="blue-gray" className="mb-3 font-bold">
                            {metrica.label}
                        </Typography>
                        <div className="space-y-2">
                            {Object.entries(metrica.datos).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-center">
                                    <Typography variant="small" color="gray">
                                        {key}:
                                    </Typography>
                                    <Typography
                                        variant="small"
                                        color={metrica.color}
                                        className="font-bold"
                                    >
                                        {new Intl.NumberFormat('es-BO').format(value)}
                                    </Typography>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
};

// ========== ALERTAS DE ALMACÉN ==========
export const AlertasAlmacen = ({ almacen }) => {
    const alertas = [];

    // Alerta de capacidad
    if (almacen.capacidad && almacen.total_materiales) {
        const porcentaje = (almacen.total_materiales / almacen.capacidad) * 100;

        if (porcentaje >= 90) {
            alertas.push({
                tipo: 'error',
                mensaje: `Almacén al ${Math.round(porcentaje)}% de capacidad`
            });
        } else if (porcentaje >= 75) {
            alertas.push({
                tipo: 'warning',
                mensaje: `Almacén al ${Math.round(porcentaje)}% de capacidad`
            });
        }
    }

    // Alerta de inactividad
    if (!almacen.activo) {
        alertas.push({
            tipo: 'info',
            mensaje: 'Almacén inactivo'
        });
    }

    if (alertas.length === 0) return null;

    return (
        <div className="space-y-2">
            {alertas.map((alerta, index) => (
                <Alert key={index} color={alerta.tipo} className="py-2 px-3">
                    <Typography variant="small">
                        {alerta.mensaje}
                    </Typography>
                </Alert>
            ))}
        </div>
    );
};

// ========== NAVEGACIÓN DE PÁGINAS ==========
export const PaginacionAlmacenes = ({ paginacion, onChangePage, loading = false }) => {
    const generarPaginas = () => {
        const paginas = [];
        const totalPaginas = paginacion.pages;
        const paginaActual = paginacion.page;

        // Siempre mostrar primera página
        if (totalPaginas > 0) {
            paginas.push(1);
        }

        // Páginas alrededor de la actual
        for (let i = Math.max(2, paginaActual - 1); i <= Math.min(totalPaginas - 1, paginaActual + 1); i++) {
            if (!paginas.includes(i)) {
                paginas.push(i);
            }
        }

        // Siempre mostrar última página
        if (totalPaginas > 1 && !paginas.includes(totalPaginas)) {
            paginas.push(totalPaginas);
        }

        return paginas.sort((a, b) => a - b);
    };

    if (paginacion.pages <= 1) return null;

    const paginas = generarPaginas();

    return (
        <div className="flex items-center justify-between border-t border-blue-gray-50 px-4 py-3">
            <div>
                <Typography variant="small" color="blue-gray" className="font-normal">
                    Mostrando{' '}
                    <strong className="text-blue-gray-900">
                        {((paginacion.page - 1) * paginacion.page_size) + 1}
                    </strong>{' '}
                    a{' '}
                    <strong className="text-blue-gray-900">
                        {Math.min(paginacion.page * paginacion.page_size, paginacion.total)}
                    </strong>{' '}
                    de{' '}
                    <strong className="text-blue-gray-900">{paginacion.total}</strong> resultados
                </Typography>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    variant="outlined"
                    size="sm"
                    disabled={paginacion.page <= 1 || loading}
                    onClick={() => onChangePage(paginacion.page - 1)}
                    className="flex items-center gap-1"
                >
                    <IoArrowBack className="h-4 w-4" />
                    <span className="hidden sm:inline">Anterior</span>
                </Button>

                <div className="flex items-center gap-1">
                    {paginas.map((numeroPagina, index) => {
                        const prevPage = paginas[index - 1];
                        const showEllipsis = prevPage && numeroPagina - prevPage > 1;

                        return (
                            <React.Fragment key={numeroPagina}>
                                {showEllipsis && (
                                    <Typography variant="small" color="gray" className="px-1">
                                        ...
                                    </Typography>
                                )}
                                <IconButton
                                    variant={paginacion.page === numeroPagina ? "filled" : "outlined"}
                                    size="sm"
                                    color="blue-gray"
                                    onClick={() => onChangePage(numeroPagina)}
                                    disabled={loading}
                                >
                                    {numeroPagina}
                                </IconButton>
                            </React.Fragment>
                        );
                    })}
                </div>

                <Button
                    variant="outlined"
                    size="sm"
                    disabled={paginacion.page >= paginacion.pages || loading}
                    onClick={() => onChangePage(paginacion.page + 1)}
                    className="flex items-center gap-1"
                >
                    <span className="hidden sm:inline">Siguiente</span>
                    <IoArrowForward className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

// ========== BARRA DE HERRAMIENTAS ==========
export const BarraHerramientas = ({
                                      onNuevoAlmacen,
                                      onRefresh,
                                      onExportar,
                                      onImportar,
                                      loading = false,
                                      totalItems = 0
                                  }) => {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <Typography variant="h5" color="blue-gray" className="font-bold">
                    Almacenes
                </Typography>
                <Typography color="gray" className="text-sm">
                    {totalItems} almacén{totalItems !== 1 ? 'es' : ''} registrado{totalItems !== 1 ? 's' : ''}
                </Typography>
            </div>

            <div className="flex items-center gap-2">
                <Tooltip content="Actualizar datos">
                    <IconButton
                        variant="outlined"
                        size="sm"
                        color="blue-gray"
                        onClick={onRefresh}
                        disabled={loading}
                    >
                        <IoRefresh className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </IconButton>
                </Tooltip>

                {onExportar && (
                    <Button
                        size="sm"
                        variant="outlined"
                        color="green"
                        onClick={onExportar}
                        disabled={loading || totalItems === 0}
                        className="flex items-center gap-2"
                    >
                        <IoDownload className="h-4 w-4" />
                        Exportar
                    </Button>
                )}

                <Button
                    size="sm"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                    onClick={onNuevoAlmacen}
                    disabled={loading}
                >
                    <IoAdd className="h-4 w-4" />
                    Nuevo Almacén
                </Button>
            </div>
        </div>
    );
};

// ========== LISTA COMPACTA ==========
export const ListaCompacta = ({ almacenes, onSelect, selectedId = null }) => {
    return (
        <div className="space-y-2">
            {almacenes.map((almacen) => (
                <Card
                    key={almacen.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedId === almacen.id
                            ? 'ring-2 ring-blue-500 bg-blue-50'
                            : 'hover:bg-gray-50'
                    }`}
                    onClick={() => onSelect(almacen)}
                >
                    <CardBody className="p-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${
                                    almacen.es_principal ? 'bg-yellow-500' : 'bg-gray-300'
                                }`} />
                                <div>
                                    <Typography variant="small" color="blue-gray" className="font-bold">
                                        {almacen.codigo}
                                    </Typography>
                                    <Typography variant="small" color="gray">
                                        {almacen.nombre}
                                    </Typography>
                                </div>
                            </div>

                            <div className="text-right">
                                <Chip
                                    size="sm"
                                    value={almacen.tipo}
                                    color={getChipColor(almacen.tipo)}
                                    className="rounded-full mb-1"
                                />
                                <Typography variant="small" color="gray" className="block">
                                    {almacen.ciudad}
                                </Typography>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
};

// ========== ESTADO DEL ALMACÉN ==========
export const EstadoAlmacen = ({ almacen, size = "sm" }) => {
    const getEstadoConfig = () => {
        if (!almacen.activo) {
            return {
                color: 'red',
                icon: IoCloseCircle,
                label: 'Inactivo',
                descripcion: 'Almacén no operativo'
            };
        }

        if (almacen.capacidad && almacen.total_materiales) {
            const utilizacion = (almacen.total_materiales / almacen.capacidad) * 100;

            if (utilizacion >= 95) {
                return {
                    color: 'red',
                    icon: IoWarning,
                    label: 'Lleno',
                    descripcion: 'Capacidad máxima alcanzada'
                };
            } else if (utilizacion >= 80) {
                return {
                    color: 'orange',
                    icon: IoWarning,
                    label: 'Casi Lleno',
                    descripcion: 'Capacidad limitada'
                };
            }
        }

        return {
            color: 'green',
            icon: IoCheckmarkCircle,
            label: 'Operativo',
            descripcion: 'Funcionando normalmente'
        };
    };

    const estado = getEstadoConfig();
    const Icon = estado.icon;

    if (size === "sm") {
        return (
            <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 text-${estado.color}-500`} />
                <Typography
                    variant="small"
                    color={estado.color}
                    className="font-medium"
                >
                    {estado.label}
                </Typography>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <div className={`p-2 bg-${estado.color}-50 rounded-lg`}>
                <Icon className={`h-5 w-5 text-${estado.color}-600`} />
            </div>
            <div>
                <Typography
                    variant="small"
                    color={estado.color}
                    className="font-bold"
                >
                    {estado.label}
                </Typography>
                <Typography variant="small" color="gray">
                    {estado.descripcion}
                </Typography>
            </div>
        </div>
    );
};

// ========== HELPER FUNCTION ==========
const getChipColor = (tipo) => {
    const colores = {
        'CENTRAL': 'blue',
        'REGIONAL': 'green',
        'LOCAL': 'orange',
        'TEMPORAL': 'purple',
    };
    return colores[tipo] || 'gray';
};