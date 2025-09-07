// ======================================================
// src/features/almacenes/pages/almacenes/almacenDialogs.jsx
// Diálogos completos para la gestión de almacenes
// ======================================================

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Card,
    CardBody,
    Typography,
    Input,
    Textarea,
    Select,
    Option,
    Button,
    IconButton,
    Alert,
    Progress,
    Chip,
    Switch,
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
    Checkbox,
} from '@material-tailwind/react';
import {
    IoClose,
    IoStorefront ,
    IoSave,
    IoTrash,
    IoWarning,
    IoStatsChart,
    IoLocation,
    IoMail,
    IoCall,
    IoPerson,
    IoCheckmarkCircle,
    IoCloseCircle,
    IoInformationCircle,
    IoSettings,
    IoCloudUpload,
    IoDownload,
} from 'react-icons/io5';

// ========== CREAR ALMACÉN DIALOG ==========
export const CrearAlmacenDialog = ({
                                       open,
                                       onClose,
                                       onSubmit,
                                       loading = false
                                   }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm({
        defaultValues: {
            codigo: '',
            nombre: '',
            tipo: 'LOCAL',
            ciudad: '',
            direccion: '',
            telefono: '',
            email: '',
            responsable: '',
            capacidad: '',
            es_principal: false,
            activo: true,
            observaciones: '',
        },
    });

    const tipoSeleccionado = watch('tipo');
    const esPrincipal = watch('es_principal');

    // Generar código automático basado en el tipo
    useEffect(() => {
        if (tipoSeleccionado) {
            const prefijo = {
                'CENTRAL': 'CEN',
                'REGIONAL': 'REG',
                'LOCAL': 'LOC',
                'TEMPORAL': 'TMP'
            }[tipoSeleccionado];

            const timestamp = Date.now().toString().slice(-4);
            setValue('codigo', `${prefijo}-${timestamp}`);
        }
    }, [tipoSeleccionado, setValue]);

    const handleFormSubmit = async (data) => {
        const resultado = await onSubmit({
            ...data,
            capacidad: data.capacidad ? parseInt(data.capacidad) : null,
        });

        if (resultado) {
            reset();
            onClose();
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Dialog open={open} handler={handleClose} size="lg" className="bg-transparent shadow-none">
            <Card className="mx-auto w-full max-w-[600px]">
                <DialogHeader className="flex items-center justify-between bg-blue-50 m-0 p-6 rounded-t-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <IoStorefront  className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <Typography variant="h5" color="blue-gray">
                                Nuevo Almacén
                            </Typography>
                            <Typography color="gray" className="text-sm">
                                Registra un nuevo almacén en el sistema
                            </Typography>
                        </div>
                    </div>
                    <IconButton variant="text" color="blue-gray" onClick={handleClose}>
                        <IoClose className="h-5 w-5" />
                    </IconButton>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <DialogBody className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                        <Tabs value="basico">
                            <TabsHeader className="grid w-full grid-cols-2">
                                <Tab value="basico">Información Básica</Tab>
                                <Tab value="contacto">Contacto y Configuración</Tab>
                            </TabsHeader>
                            <TabsBody>
                                <TabPanel value="basico" className="p-0 pt-4">
                                    <div className="space-y-4">
                                        {/* Código y Nombre */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Input
                                                    label="Código del Almacén"
                                                    {...register('codigo', {
                                                        required: 'El código es obligatorio',
                                                        pattern: {
                                                            value: /^[A-Z0-9-]+$/,
                                                            message: 'Solo letras mayúsculas, números y guiones'
                                                        }
                                                    })}
                                                    error={!!errors.codigo}
                                                />
                                                {errors.codigo && (
                                                    <Typography color="red" className="text-xs mt-1">
                                                        {errors.codigo.message}
                                                    </Typography>
                                                )}
                                            </div>

                                            <div>
                                                <Select
                                                    label="Tipo de Almacén"
                                                    value={tipoSeleccionado}
                                                    onChange={(val) => setValue('tipo', val)}
                                                    error={!!errors.tipo}
                                                >
                                                    <Option value="CENTRAL">Central</Option>
                                                    <Option value="REGIONAL">Regional</Option>
                                                    <Option value="LOCAL">Local</Option>
                                                    <Option value="TEMPORAL">Temporal</Option>
                                                </Select>
                                            </div>
                                        </div>

                                        {/* Nombre */}
                                        <div>
                                            <Input
                                                label="Nombre del Almacén"
                                                {...register('nombre', {
                                                    required: 'El nombre es obligatorio',
                                                    minLength: {
                                                        value: 3,
                                                        message: 'Mínimo 3 caracteres'
                                                    }
                                                })}
                                                error={!!errors.nombre}
                                            />
                                            {errors.nombre && (
                                                <Typography color="red" className="text-xs mt-1">
                                                    {errors.nombre.message}
                                                </Typography>
                                            )}
                                        </div>

                                        {/* Ciudad y Dirección */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Input
                                                    label="Ciudad"
                                                    icon={<IoLocation />}
                                                    {...register('ciudad', {
                                                        required: 'La ciudad es obligatoria'
                                                    })}
                                                    error={!!errors.ciudad}
                                                />
                                                {errors.ciudad && (
                                                    <Typography color="red" className="text-xs mt-1">
                                                        {errors.ciudad.message}
                                                    </Typography>
                                                )}
                                            </div>

                                            <div>
                                                <Input
                                                    label="Capacidad (opcional)"
                                                    type="number"
                                                    min="1"
                                                    {...register('capacidad', {
                                                        min: {
                                                            value: 1,
                                                            message: 'La capacidad debe ser mayor a 0'
                                                        }
                                                    })}
                                                    error={!!errors.capacidad}
                                                />
                                                {errors.capacidad && (
                                                    <Typography color="red" className="text-xs mt-1">
                                                        {errors.capacidad.message}
                                                    </Typography>
                                                )}
                                            </div>
                                        </div>

                                        {/* Dirección */}
                                        <div>
                                            <Textarea
                                                label="Dirección"
                                                {...register('direccion')}
                                                rows={2}
                                            />
                                        </div>

                                        {/* Switches */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                                        Almacén Principal
                                                    </Typography>
                                                    <Typography variant="small" color="gray">
                                                        Solo puede haber un almacén principal
                                                    </Typography>
                                                </div>
                                                <Switch
                                                    {...register('es_principal')}
                                                    disabled={tipoSeleccionado === 'TEMPORAL'}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                                        Activo
                                                    </Typography>
                                                    <Typography variant="small" color="gray">
                                                        El almacén estará operativo
                                                    </Typography>
                                                </div>
                                                <Switch {...register('activo')} defaultChecked />
                                            </div>
                                        </div>

                                        {esPrincipal && tipoSeleccionado === 'TEMPORAL' && (
                                            <Alert color="orange" icon={<IoWarning />}>
                                                Los almacenes temporales no pueden ser principales
                                            </Alert>
                                        )}
                                    </div>
                                </TabPanel>

                                <TabPanel value="contacto" className="p-0 pt-4">
                                    <div className="space-y-4">
                                        {/* Información de contacto */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Input
                                                    label="Teléfono"
                                                    icon={<IoCall />}
                                                    {...register('telefono', {
                                                        pattern: {
                                                            value: /^[\+]?[0-9\s\-\(\)]+$/,
                                                            message: 'Formato de teléfono inválido'
                                                        }
                                                    })}
                                                    error={!!errors.telefono}
                                                />
                                                {errors.telefono && (
                                                    <Typography color="red" className="text-xs mt-1">
                                                        {errors.telefono.message}
                                                    </Typography>
                                                )}
                                            </div>

                                            <div>
                                                <Input
                                                    label="Email"
                                                    icon={<IoMail />}
                                                    {...register('email', {
                                                        pattern: {
                                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                            message: 'Email inválido'
                                                        }
                                                    })}
                                                    error={!!errors.email}
                                                />
                                                {errors.email && (
                                                    <Typography color="red" className="text-xs mt-1">
                                                        {errors.email.message}
                                                    </Typography>
                                                )}
                                            </div>
                                        </div>

                                        {/* Responsable */}
                                        <div>
                                            <Input
                                                label="Responsable"
                                                icon={<IoPerson />}
                                                {...register('responsable')}
                                            />
                                        </div>

                                        {/* Observaciones */}
                                        <div>
                                            <Textarea
                                                label="Observaciones"
                                                {...register('observaciones')}
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                </TabPanel>
                            </TabsBody>
                        </Tabs>
                    </DialogBody>

                    <DialogFooter className="space-x-2 bg-gray-50 m-0 p-6 rounded-b-lg">
                        <Button variant="text" color="red" onClick={handleClose} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            color="blue"
                            className="flex items-center gap-2"
                            loading={loading}
                        >
                            <IoSave className="h-4 w-4" />
                            Crear Almacén
                        </Button>
                    </DialogFooter>
                </form>
            </Card>
        </Dialog>
    );
};

// ========== EDITAR ALMACÉN DIALOG ==========
export const EditarAlmacenDialog = ({
                                        open,
                                        almacen,
                                        onClose,
                                        onSubmit,
                                        loading = false
                                    }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm();

    const tipoSeleccionado = watch('tipo');
    const esPrincipal = watch('es_principal');

    // Cargar datos del almacén cuando se abre el diálogo
    useEffect(() => {
        if (almacen && open) {
            reset({
                codigo: almacen.codigo || '',
                nombre: almacen.nombre || '',
                tipo: almacen.tipo || 'LOCAL',
                ciudad: almacen.ciudad || '',
                direccion: almacen.direccion || '',
                telefono: almacen.telefono || '',
                email: almacen.email || '',
                responsable: almacen.responsable || '',
                capacidad: almacen.capacidad?.toString() || '',
                es_principal: almacen.es_principal || false,
                activo: almacen.activo || false,
                observaciones: almacen.observaciones || '',
            });
        }
    }, [almacen, open, reset]);

    const handleFormSubmit = async (data) => {
        const resultado = await onSubmit(almacen.id, {
            ...data,
            capacidad: data.capacidad ? parseInt(data.capacidad) : null,
        });

        if (resultado) {
            onClose();
        }
    };

    if (!almacen) return null;

    return (
        <Dialog open={open} handler={onClose} size="lg" className="bg-transparent shadow-none">
            <Card className="mx-auto w-full max-w-[600px]">
                <DialogHeader className="flex items-center justify-between bg-orange-50 m-0 p-6 rounded-t-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <IoStorefront  className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                            <Typography variant="h5" color="blue-gray">
                                Editar Almacén
                            </Typography>
                            <Typography color="gray" className="text-sm">
                                {almacen.codigo} - {almacen.nombre}
                            </Typography>
                        </div>
                    </div>
                    <IconButton variant="text" color="blue-gray" onClick={onClose}>
                        <IoClose className="h-5 w-5" />
                    </IconButton>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <DialogBody className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                        <Tabs value="basico">
                            <TabsHeader className="grid w-full grid-cols-3">
                                <Tab value="basico">Información Básica</Tab>
                                <Tab value="contacto">Contacto</Tab>
                                <Tab value="estadisticas">Estadísticas</Tab>
                            </TabsHeader>
                            <TabsBody>
                                <TabPanel value="basico" className="p-0 pt-4">
                                    <div className="space-y-4">
                                        {/* Código y Tipo */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Input
                                                    label="Código del Almacén"
                                                    {...register('codigo', {
                                                        required: 'El código es obligatorio'
                                                    })}
                                                    error={!!errors.codigo}
                                                />
                                                {errors.codigo && (
                                                    <Typography color="red" className="text-xs mt-1">
                                                        {errors.codigo.message}
                                                    </Typography>
                                                )}
                                            </div>

                                            <div>
                                                <Select
                                                    label="Tipo de Almacén"
                                                    value={tipoSeleccionado}
                                                    onChange={(val) => setValue('tipo', val)}
                                                >
                                                    <Option value="CENTRAL">Central</Option>
                                                    <Option value="REGIONAL">Regional</Option>
                                                    <Option value="LOCAL">Local</Option>
                                                    <Option value="TEMPORAL">Temporal</Option>
                                                </Select>
                                            </div>
                                        </div>

                                        {/* Nombre */}
                                        <div>
                                            <Input
                                                label="Nombre del Almacén"
                                                {...register('nombre', {
                                                    required: 'El nombre es obligatorio'
                                                })}
                                                error={!!errors.nombre}
                                            />
                                            {errors.nombre && (
                                                <Typography color="red" className="text-xs mt-1">
                                                    {errors.nombre.message}
                                                </Typography>
                                            )}
                                        </div>

                                        {/* Ciudad, Dirección y Capacidad */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Input
                                                    label="Ciudad"
                                                    icon={<IoLocation />}
                                                    {...register('ciudad', {
                                                        required: 'La ciudad es obligatoria'
                                                    })}
                                                    error={!!errors.ciudad}
                                                />
                                            </div>

                                            <div>
                                                <Input
                                                    label="Capacidad"
                                                    type="number"
                                                    min="1"
                                                    {...register('capacidad')}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Textarea
                                                label="Dirección"
                                                {...register('direccion')}
                                                rows={2}
                                            />
                                        </div>

                                        {/* Switches */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                                        Almacén Principal
                                                    </Typography>
                                                    <Typography variant="small" color="gray">
                                                        Solo puede haber un almacén principal
                                                    </Typography>
                                                </div>
                                                <Switch
                                                    {...register('es_principal')}
                                                    disabled={tipoSeleccionado === 'TEMPORAL'}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                                        Activo
                                                    </Typography>
                                                    <Typography variant="small" color="gray">
                                                        Estado operativo del almacén
                                                    </Typography>
                                                </div>
                                                <Switch {...register('activo')} />
                                            </div>
                                        </div>
                                    </div>
                                </TabPanel>

                                <TabPanel value="contacto" className="p-0 pt-4">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Input
                                                    label="Teléfono"
                                                    icon={<IoCall />}
                                                    {...register('telefono')}
                                                />
                                            </div>
                                            <div>
                                                <Input
                                                    label="Email"
                                                    icon={<IoMail />}
                                                    {...register('email')}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <Input
                                                label="Responsable"
                                                icon={<IoPerson />}
                                                {...register('responsable')}
                                            />
                                        </div>

                                        <div>
                                            <Textarea
                                                label="Observaciones"
                                                {...register('observaciones')}
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                </TabPanel>

                                <TabPanel value="estadisticas" className="p-0 pt-4">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <Card className="border border-blue-100">
                                                <CardBody className="p-4 text-center">
                                                    <Typography variant="h4" color="blue">
                                                        {almacen.total_materiales || 0}
                                                    </Typography>
                                                    <Typography variant="small" color="gray">
                                                        Total Materiales
                                                    </Typography>
                                                </CardBody>
                                            </Card>

                                            <Card className="border border-green-100">
                                                <CardBody className="p-4 text-center">
                                                    <Typography variant="h4" color="green">
                                                        {almacen.materiales_disponibles || 0}
                                                    </Typography>
                                                    <Typography variant="small" color="gray">
                                                        Disponibles
                                                    </Typography>
                                                </CardBody>
                                            </Card>
                                        </div>

                                        {almacen.capacidad && (
                                            <div>
                                                <div className="flex justify-between mb-2">
                                                    <Typography variant="small" color="gray">
                                                        Utilización
                                                    </Typography>
                                                    <Typography variant="small" color="blue-gray">
                                                        {Math.round(((almacen.total_materiales || 0) / almacen.capacidad) * 100)}%
                                                    </Typography>
                                                </div>
                                                <Progress
                                                    value={((almacen.total_materiales || 0) / almacen.capacidad) * 100}
                                                    color="blue"
                                                />
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-4 text-center">
                                            <div>
                                                <Typography variant="small" color="gray">
                                                    Fecha Creación
                                                </Typography>
                                                <Typography variant="small" color="blue-gray" className="font-medium">
                                                    {almacen.created_at ? new Date(almacen.created_at).toLocaleDateString('es-BO') : '-'}
                                                </Typography>
                                            </div>
                                            <div>
                                                <Typography variant="small" color="gray">
                                                    Última Actualización
                                                </Typography>
                                                <Typography variant="small" color="blue-gray" className="font-medium">
                                                    {almacen.updated_at ? new Date(almacen.updated_at).toLocaleDateString('es-BO') : '-'}
                                                </Typography>
                                            </div>
                                        </div>
                                    </div>
                                </TabPanel>
                            </TabsBody>
                        </Tabs>
                    </DialogBody>

                    <DialogFooter className="space-x-2 bg-gray-50 m-0 p-6 rounded-b-lg">
                        <Button variant="text" color="red" onClick={onClose} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            color="orange"
                            className="flex items-center gap-2"
                            loading={loading}
                        >
                            <IoSave className="h-4 w-4" />
                            Guardar Cambios
                        </Button>
                    </DialogFooter>
                </form>
            </Card>
        </Dialog>
    );
};

// ========== ELIMINAR ALMACÉN DIALOG ==========
export const EliminarAlmacenDialog = ({
                                          open,
                                          almacen,
                                          onClose,
                                          onConfirm,
                                          loading = false
                                      }) => {
    const [confirmacionTexto, setConfirmacionTexto] = useState('');
    const [forzarEliminacion, setForzarEliminacion] = useState(false);

    const puedeEliminar = almacen && !almacen.es_principal && (almacen.total_materiales || 0) === 0;
    const textoConfirmacion = almacen ? `ELIMINAR ${almacen.codigo}` : '';
    const confirmacionCorrecta = confirmacionTexto === textoConfirmacion;

    const handleConfirm = async () => {
        if (almacen && (puedeEliminar || forzarEliminacion)) {
            const resultado = await onConfirm(almacen.id, { forzar: forzarEliminacion });
            if (resultado) {
                setConfirmacionTexto('');
                setForzarEliminacion(false);
                onClose();
            }
        }
    };

    const handleClose = () => {
        setConfirmacionTexto('');
        setForzarEliminacion(false);
        onClose();
    };

    if (!almacen) return null;

    return (
        <Dialog open={open} handler={handleClose} size="md">
            <DialogHeader className="flex items-center gap-3 bg-red-50 m-0 p-6 rounded-t-lg">
                <div className="p-2 bg-red-100 rounded-lg">
                    <IoTrash className="h-6 w-6 text-red-600" />
                </div>
                <div>
                    <Typography variant="h5" color="red">
                        Eliminar Almacén
                    </Typography>
                    <Typography color="gray" className="text-sm">
                        Esta acción no se puede deshacer
                    </Typography>
                </div>
            </DialogHeader>

            <DialogBody className="p-6 space-y-4">
                {/* Información del almacén */}
                <Card className="border border-red-100 bg-red-50">
                    <CardBody className="p-4">
                        <div className="flex items-start gap-4">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <IoStorefront  className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="flex-1">
                                <Typography variant="h6" color="blue-gray">
                                    {almacen.codigo} - {almacen.nombre}
                                </Typography>
                                <Typography color="gray" className="text-sm">
                                    {almacen.tipo} en {almacen.ciudad}
                                </Typography>
                                <div className="grid grid-cols-2 gap-4 mt-3">
                                    <div>
                                        <Typography variant="small" color="gray">
                                            Total Materiales:
                                        </Typography>
                                        <Typography variant="small" color="blue-gray" className="font-medium">
                                            {almacen.total_materiales || 0}
                                        </Typography>
                                    </div>
                                    <div>
                                        <Typography variant="small" color="gray">
                                            Es Principal:
                                        </Typography>
                                        <Chip
                                            size="sm"
                                            value={almacen.es_principal ? "Sí" : "No"}
                                            color={almacen.es_principal ? "orange" : "gray"}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Validaciones */}
                <div className="space-y-3">
                    {almacen.es_principal && (
                        <Alert color="red" icon={<IoWarning />}>
                            <strong>No se puede eliminar:</strong> Este es el almacén principal del sistema
                        </Alert>
                    )}

                    {(almacen.total_materiales || 0) > 0 && (
                        <Alert color="orange" icon={<IoWarning />}>
                            <strong>Almacén con materiales:</strong> Tiene {almacen.total_materiales} materiales.
                            Debe estar vacío para eliminarlo normalmente.
                        </Alert>
                    )}

                    {almacen.traspasos_pendientes > 0 && (
                        <Alert color="orange" icon={<IoWarning />}>
                            <strong>Traspasos pendientes:</strong> Tiene {almacen.traspasos_pendientes} traspasos pendientes
                        </Alert>
                    )}
                </div>

                {/* Confirmación de eliminación */}
                {!puedeEliminar && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                checked={forzarEliminacion}
                                onChange={(e) => setForzarEliminacion(e.target.checked)}
                                color="red"
                            />
                            <Typography variant="small" color="red" className="font-medium">
                                Forzar eliminación (eliminar materiales y relaciones)
                            </Typography>
                        </div>
                        {forzarEliminacion && (
                            <Alert color="red" icon={<IoWarning />}>
                                <strong>¡PELIGRO!</strong> Esta opción eliminará permanentemente todos los materiales
                                y relaciones del almacén. Use con extrema precaución.
                            </Alert>
                        )}
                    </div>
                )}

                {(puedeEliminar || forzarEliminacion) && (
                    <div className="space-y-3">
                        <Typography color="blue-gray" className="font-medium">
                            Para confirmar, escriba exactamente: <code className="bg-gray-100 px-2 py-1 rounded">{textoConfirmacion}</code>
                        </Typography>
                        <Input
                            label="Confirmación"
                            value={confirmacionTexto}
                            onChange={(e) => setConfirmacionTexto(e.target.value)}
                            error={confirmacionTexto.length > 0 && !confirmacionCorrecta}
                        />
                    </div>
                )}
            </DialogBody>

            <DialogFooter className="space-x-2 bg-gray-50 m-0 p-6 rounded-b-lg">
                <Button variant="text" color="blue-gray" onClick={handleClose} disabled={loading}>
                    Cancelar
                </Button>
                <Button
                    color="red"
                    onClick={handleConfirm}
                    disabled={loading || (!puedeEliminar && !forzarEliminacion) || !confirmacionCorrecta}
                    loading={loading}
                    className="flex items-center gap-2"
                >
                    <IoTrash className="h-4 w-4" />
                    {forzarEliminacion ? 'Forzar Eliminación' : 'Eliminar Almacén'}
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

// ========== ESTADÍSTICAS ALMACÉN DIALOG ==========
export const EstadisticasAlmacenDialog = ({
                                              open,
                                              almacen,
                                              estadisticas,
                                              onClose,
                                              loading = false
                                          }) => {
    const [tabActivo, setTabActivo] = useState('general');

    if (!almacen) return null;

    return (
        <Dialog open={open} handler={onClose} size="xl">
            <DialogHeader className="flex items-center justify-between bg-blue-50 m-0 p-6 rounded-t-lg">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <IoStatsChart className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <Typography variant="h5" color="blue-gray">
                            Estadísticas del Almacén
                        </Typography>
                        <Typography color="gray" className="text-sm">
                            {almacen.codigo} - {almacen.nombre}
                        </Typography>
                    </div>
                </div>
                <IconButton variant="text" color="blue-gray" onClick={onClose}>
                    <IoClose className="h-5 w-5" />
                </IconButton>
            </DialogHeader>

            <DialogBody className="p-0 max-h-[70vh] overflow-y-auto">
                <Tabs value={tabActivo} className="w-full">
                    <TabsHeader className="grid w-full grid-cols-4 bg-gray-50">
                        <Tab value="general" onClick={() => setTabActivo('general')}>
                            General
                        </Tab>
                        <Tab value="inventario" onClick={() => setTabActivo('inventario')}>
                            Inventario
                        </Tab>
                        <Tab value="movimientos" onClick={() => setTabActivo('movimientos')}>
                            Movimientos
                        </Tab>
                        <Tab value="eficiencia" onClick={() => setTabActivo('eficiencia')}>
                            Eficiencia
                        </Tab>
                    </TabsHeader>

                    <TabsBody>
                        <TabPanel value="general" className="p-6">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                        <Typography color="gray">Cargando estadísticas...</Typography>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Métricas principales */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <Card className="border border-blue-100">
                                            <CardBody className="p-4 text-center">
                                                <Typography variant="h4" color="blue">
                                                    {estadisticas?.total_materiales || almacen.total_materiales || 0}
                                                </Typography>
                                                <Typography variant="small" color="gray">
                                                    Total Materiales
                                                </Typography>
                                            </CardBody>
                                        </Card>

                                        <Card className="border border-green-100">
                                            <CardBody className="p-4 text-center">
                                                <Typography variant="h4" color="green">
                                                    {estadisticas?.disponibles || 0}
                                                </Typography>
                                                <Typography variant="small" color="gray">
                                                    Disponibles
                                                </Typography>
                                            </CardBody>
                                        </Card>

                                        <Card className="border border-orange-100">
                                            <CardBody className="p-4 text-center">
                                                <Typography variant="h4" color="orange">
                                                    {estadisticas?.asignados || 0}
                                                </Typography>
                                                <Typography variant="small" color="gray">
                                                    Asignados
                                                </Typography>
                                            </CardBody>
                                        </Card>

                                        <Card className="border border-purple-100">
                                            <CardBody className="p-4 text-center">
                                                <Typography variant="h4" color="purple">
                                                    {estadisticas?.en_laboratorio || 0}
                                                </Typography>
                                                <Typography variant="small" color="gray">
                                                    En Laboratorio
                                                </Typography>
                                            </CardBody>
                                        </Card>
                                    </div>

                                    {/* Información del almacén */}
                                    <Card>
                                        <CardBody className="p-4">
                                            <Typography variant="h6" color="blue-gray" className="mb-4">
                                                Información General
                                            </Typography>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <Typography variant="small" color="gray">Tipo:</Typography>
                                                        <Chip size="sm" value={almacen.tipo} color="blue" />
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <Typography variant="small" color="gray">Ciudad:</Typography>
                                                        <Typography variant="small" color="blue-gray">{almacen.ciudad}</Typography>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <Typography variant="small" color="gray">Estado:</Typography>
                                                        <Chip
                                                            size="sm"
                                                            value={almacen.activo ? "Activo" : "Inactivo"}
                                                            color={almacen.activo ? "green" : "red"}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <Typography variant="small" color="gray">Es Principal:</Typography>
                                                        <Chip
                                                            size="sm"
                                                            value={almacen.es_principal ? "Sí" : "No"}
                                                            color={almacen.es_principal ? "yellow" : "gray"}
                                                        />
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <Typography variant="small" color="gray">Capacidad:</Typography>
                                                        <Typography variant="small" color="blue-gray">
                                                            {almacen.capacidad ? almacen.capacidad.toLocaleString() : 'No definida'}
                                                        </Typography>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <Typography variant="small" color="gray">Responsable:</Typography>
                                                        <Typography variant="small" color="blue-gray">
                                                            {almacen.responsable || 'No asignado'}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>

                                    {/* Utilización de capacidad */}
                                    {almacen.capacidad && (
                                        <Card>
                                            <CardBody className="p-4">
                                                <Typography variant="h6" color="blue-gray" className="mb-4">
                                                    Utilización de Capacidad
                                                </Typography>
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center">
                                                        <Typography variant="small" color="gray">
                                                            Utilización actual
                                                        </Typography>
                                                        <Typography variant="small" color="blue-gray" className="font-medium">
                                                            {Math.round(((almacen.total_materiales || 0) / almacen.capacidad) * 100)}%
                                                        </Typography>
                                                    </div>
                                                    <Progress
                                                        value={((almacen.total_materiales || 0) / almacen.capacidad) * 100}
                                                        color={
                                                            ((almacen.total_materiales || 0) / almacen.capacidad) * 100 > 80
                                                                ? "red"
                                                                : ((almacen.total_materiales || 0) / almacen.capacidad) * 100 > 60
                                                                    ? "orange"
                                                                    : "green"
                                                        }
                                                    />
                                                    <div className="flex justify-between text-xs text-gray-600">
                                                        <span>{almacen.total_materiales || 0} materiales</span>
                                                        <span>{almacen.capacidad} capacidad máxima</span>
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    )}
                                </div>
                            )}
                        </TabPanel>

                        <TabPanel value="inventario" className="p-6">
                            <div className="space-y-6">
                                <Typography variant="h6" color="blue-gray">
                                    Distribución de Inventario
                                </Typography>

                                {estadisticas?.por_estado && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {Object.entries(estadisticas.por_estado).map(([estado, cantidad]) => (
                                            <Card key={estado} className="border">
                                                <CardBody className="p-4 text-center">
                                                    <Typography variant="h5" color="blue-gray">
                                                        {cantidad}
                                                    </Typography>
                                                    <Typography variant="small" color="gray">
                                                        {estado.replace('_', ' ').toUpperCase()}
                                                    </Typography>
                                                </CardBody>
                                            </Card>
                                        ))}
                                    </div>
                                )}

                                {estadisticas?.por_tipo && (
                                    <Card>
                                        <CardBody className="p-4">
                                            <Typography variant="h6" color="blue-gray" className="mb-4">
                                                Por Tipo de Material
                                            </Typography>
                                            <div className="space-y-2">
                                                {Object.entries(estadisticas.por_tipo).map(([tipo, cantidad]) => (
                                                    <div key={tipo} className="flex justify-between items-center">
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
                                )}
                            </div>
                        </TabPanel>

                        <TabPanel value="movimientos" className="p-6">
                            <div className="space-y-6">
                                <Typography variant="h6" color="blue-gray">
                                    Movimientos Recientes
                                </Typography>

                                {estadisticas?.movimientos_recientes && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <Card className="border border-green-100">
                                            <CardBody className="p-4 text-center">
                                                <Typography variant="h4" color="green">
                                                    {estadisticas.movimientos_recientes.ingresos || 0}
                                                </Typography>
                                                <Typography variant="small" color="gray">
                                                    Ingresos (30 días)
                                                </Typography>
                                            </CardBody>
                                        </Card>

                                        <Card className="border border-orange-100">
                                            <CardBody className="p-4 text-center">
                                                <Typography variant="h4" color="orange">
                                                    {estadisticas.movimientos_recientes.egresos || 0}
                                                </Typography>
                                                <Typography variant="small" color="gray">
                                                    Egresos (30 días)
                                                </Typography>
                                            </CardBody>
                                        </Card>

                                        <Card className="border border-blue-100">
                                            <CardBody className="p-4 text-center">
                                                <Typography variant="h4" color="blue">
                                                    {estadisticas.movimientos_recientes.traspasos || 0}
                                                </Typography>
                                                <Typography variant="small" color="gray">
                                                    Traspasos (30 días)
                                                </Typography>
                                            </CardBody>
                                        </Card>
                                    </div>
                                )}

                                <Card>
                                    <CardBody className="p-4">
                                        <Typography variant="h6" color="blue-gray" className="mb-4">
                                            Historial de Actividad
                                        </Typography>
                                        <div className="space-y-3">
                                            {estadisticas?.historial_actividad?.map((actividad, index) => (
                                                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                                                    <div>
                                                        <Typography variant="small" color="blue-gray">
                                                            {actividad.descripcion}
                                                        </Typography>
                                                        <Typography variant="small" color="gray">
                                                            {new Date(actividad.fecha).toLocaleDateString('es-BO')}
                                                        </Typography>
                                                    </div>
                                                    <Chip
                                                        size="sm"
                                                        value={actividad.tipo}
                                                        color={
                                                            actividad.tipo === 'ingreso' ? 'green' :
                                                                actividad.tipo === 'egreso' ? 'red' : 'blue'
                                                        }
                                                    />
                                                </div>
                                            )) || (
                                                <Typography color="gray" className="text-center py-4">
                                                    No hay actividad reciente registrada
                                                </Typography>
                                            )}
                                        </div>
                                    </CardBody>
                                </Card>
                            </div>
                        </TabPanel>

                        <TabPanel value="eficiencia" className="p-6">
                            <div className="space-y-6">
                                <Typography variant="h6" color="blue-gray">
                                    Métricas de Eficiencia
                                </Typography>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card>
                                        <CardBody className="p-4">
                                            <Typography variant="h6" color="blue-gray" className="mb-4">
                                                Rotación de Inventario
                                            </Typography>
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <Typography variant="small" color="gray">
                                                        Rotación mensual:
                                                    </Typography>
                                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                                        {estadisticas?.eficiencia?.rotacion_mensual || 0}%
                                                    </Typography>
                                                </div>
                                                <div className="flex justify-between">
                                                    <Typography variant="small" color="gray">
                                                        Tiempo promedio de permanencia:
                                                    </Typography>
                                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                                        {estadisticas?.eficiencia?.tiempo_promedio_permanencia || 0} días
                                                    </Typography>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>

                                    <Card>
                                        <CardBody className="p-4">
                                            <Typography variant="h6" color="blue-gray" className="mb-4">
                                                Calidad del Servicio
                                            </Typography>
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <Typography variant="small" color="gray">
                                                        Tiempo promedio de despacho:
                                                    </Typography>
                                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                                        {estadisticas?.eficiencia?.tiempo_despacho || 0} horas
                                                    </Typography>
                                                </div>
                                                <div className="flex justify-between">
                                                    <Typography variant="small" color="gray">
                                                        Precisión de inventario:
                                                    </Typography>
                                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                                        {estadisticas?.eficiencia?.precision_inventario || 0}%
                                                    </Typography>
                                                </div>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </div>

                                {/* Alertas y recomendaciones */}
                                {estadisticas?.alertas && estadisticas.alertas.length > 0 && (
                                    <Card>
                                        <CardBody className="p-4">
                                            <Typography variant="h6" color="blue-gray" className="mb-4">
                                                Alertas y Recomendaciones
                                            </Typography>
                                            <div className="space-y-2">
                                                {estadisticas.alertas.map((alerta, index) => (
                                                    <Alert
                                                        key={index}
                                                        color={alerta.tipo === 'warning' ? 'orange' : alerta.tipo === 'error' ? 'red' : 'blue'}
                                                        className="py-2"
                                                    >
                                                        <Typography variant="small">
                                                            {alerta.mensaje}
                                                        </Typography>
                                                    </Alert>
                                                ))}
                                            </div>
                                        </CardBody>
                                    </Card>
                                )}
                            </div>
                        </TabPanel>
                    </TabsBody>
                </Tabs>
            </DialogBody>

            <DialogFooter className="bg-gray-50 m-0 p-6 rounded-b-lg">
                <Button color="blue-gray" onClick={onClose}>
                    Cerrar
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

// ========== CONFIGURACIÓN ALMACÉN DIALOG ==========
export const ConfiguracionAlmacenDialog = ({
                                               open,
                                               almacen,
                                               onClose,
                                               onSave,
                                               loading = false
                                           }) => {
    const [configuracion, setConfiguracion] = useState({
        alertas_capacidad: 80,
        alertas_email: true,
        backup_automatico: true,
        sincronizacion_activa: true,
        notificaciones_movimientos: false,
        nivel_reorden: 10,
        dias_retencion_logs: 90,
    });

    useEffect(() => {
        if (almacen?.configuracion && open) {
            setConfiguracion({
                alertas_capacidad: almacen.configuracion.alertas_capacidad || 80,
                alertas_email: almacen.configuracion.alertas_email || false,
                backup_automatico: almacen.configuracion.backup_automatico || false,
                sincronizacion_activa: almacen.configuracion.sincronizacion_activa || false,
                notificaciones_movimientos: almacen.configuracion.notificaciones_movimientos || false,
                nivel_reorden: almacen.configuracion.nivel_reorden || 10,
                dias_retencion_logs: almacen.configuracion.dias_retencion_logs || 90,
            });
        }
    }, [almacen, open]);

    const handleSave = async () => {
        const resultado = await onSave(almacen.id, { configuracion });
        if (resultado) {
            onClose();
        }
    };

    if (!almacen) return null;

    return (
        <Dialog open={open} handler={onClose} size="md">
            <DialogHeader className="flex items-center gap-3 bg-purple-50 m-0 p-6 rounded-t-lg">
                <div className="p-2 bg-purple-100 rounded-lg">
                    <IoSettings className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                    <Typography variant="h5" color="blue-gray">
                        Configuración del Almacén
                    </Typography>
                    <Typography color="gray" className="text-sm">
                        {almacen.codigo} - {almacen.nombre}
                    </Typography>
                </div>
            </DialogHeader>

            <DialogBody className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Alertas y Notificaciones */}
                <Card>
                    <CardBody className="p-4">
                        <Typography variant="h6" color="blue-gray" className="mb-4">
                            Alertas y Notificaciones
                        </Typography>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <Typography variant="small" color="blue-gray">
                                        Umbral de alerta de capacidad: {configuracion.alertas_capacidad}%
                                    </Typography>
                                </div>
                                <input
                                    type="range"
                                    min="50"
                                    max="95"
                                    step="5"
                                    value={configuracion.alertas_capacidad}
                                    onChange={(e) => setConfiguracion(prev => ({
                                        ...prev,
                                        alertas_capacidad: parseInt(e.target.value)
                                    }))}
                                    className="w-full"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                        Alertas por Email
                                    </Typography>
                                    <Typography variant="small" color="gray">
                                        Enviar notificaciones por correo
                                    </Typography>
                                </div>
                                <Switch
                                    checked={configuracion.alertas_email}
                                    onChange={(e) => setConfiguracion(prev => ({
                                        ...prev,
                                        alertas_email: e.target.checked
                                    }))}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                        Notificaciones de Movimientos
                                    </Typography>
                                    <Typography variant="small" color="gray">
                                        Notificar cada movimiento de material
                                    </Typography>
                                </div>
                                <Switch
                                    checked={configuracion.notificaciones_movimientos}
                                    onChange={(e) => setConfiguracion(prev => ({
                                        ...prev,
                                        notificaciones_movimientos: e.target.checked
                                    }))}
                                />
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Configuración de Sistema */}
                <Card>
                    <CardBody className="p-4">
                        <Typography variant="h6" color="blue-gray" className="mb-4">
                            Configuración de Sistema
                        </Typography>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                        Backup Automático
                                    </Typography>
                                    <Typography variant="small" color="gray">
                                        Respaldar datos automáticamente
                                    </Typography>
                                </div>
                                <Switch
                                    checked={configuracion.backup_automatico}
                                    onChange={(e) => setConfiguracion(prev => ({
                                        ...prev,
                                        backup_automatico: e.target.checked
                                    }))}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                        Sincronización Activa
                                    </Typography>
                                    <Typography variant="small" color="gray">
                                        Sincronizar con sistema central
                                    </Typography>
                                </div>
                                <Switch
                                    checked={configuracion.sincronizacion_activa}
                                    onChange={(e) => setConfiguracion(prev => ({
                                        ...prev,
                                        sincronizacion_activa: e.target.checked
                                    }))}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Input
                                        label="Nivel de Reorden"
                                        type="number"
                                        min="0"
                                        value={configuracion.nivel_reorden}
                                        onChange={(e) => setConfiguracion(prev => ({
                                            ...prev,
                                            nivel_reorden: parseInt(e.target.value) || 0
                                        }))}
                                    />
                                    <Typography variant="small" color="gray" className="mt-1">
                                        Cantidad mínima antes de alertar
                                    </Typography>
                                </div>

                                <div>
                                    <Input
                                        label="Retención de Logs (días)"
                                        type="number"
                                        min="30"
                                        max="365"
                                        value={configuracion.dias_retencion_logs}
                                        onChange={(e) => setConfiguracion(prev => ({
                                            ...prev,
                                            dias_retencion_logs: parseInt(e.target.value) || 90
                                        }))}
                                    />
                                    <Typography variant="small" color="gray" className="mt-1">
                                        Días para mantener logs
                                    </Typography>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </DialogBody>

            <DialogFooter className="space-x-2 bg-gray-50 m-0 p-6 rounded-b-lg">
                <Button variant="text" color="blue-gray" onClick={onClose} disabled={loading}>
                    Cancelar
                </Button>
                <Button
                    color="purple"
                    onClick={handleSave}
                    loading={loading}
                    className="flex items-center gap-2"
                >
                    <IoSave className="h-4 w-4" />
                    Guardar Configuración
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

// ========== IMPORTACIÓN MASIVA DIALOG ==========
export const ImportacionMasivaDialog = ({
                                            open,
                                            onClose,
                                            onImportar,
                                            onDescargarPlantilla,
                                            loading = false
                                        }) => {
    const [archivo, setArchivo] = useState(null);
    const [previsualizacion, setPrevisualizacion] = useState(null);
    const [configuracion, setConfiguracion] = useState({
        sobrescribir_existentes: false,
        validar_antes_importar: true,
        enviar_notificaciones: false,
        crear_respaldos: true
    });
    const [erroresValidacion, setErroresValidacion] = useState([]);
    const [paso, setPaso] = useState(1); // 1: Selección, 2: Configuración, 3: Previsualización, 4: Importación

    const handleArchivoSeleccionado = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setArchivo(file);

        // Leer y previsualizar archivo
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                const lines = content.split('\n').slice(0, 6); // Primeras 5 filas + header
                const headers = lines[0]?.split(',').map(h => h.trim().replace(/"/g, ''));
                const data = lines.slice(1).map(line =>
                    line.split(',').map(cell => cell.trim().replace(/"/g, ''))
                );

                setPrevisualizacion({
                    headers,
                    data: data.filter(row => row.some(cell => cell)), // Filtrar filas vacías
                    totalFilas: content.split('\n').length - 1
                });
                setPaso(2);
            } catch (error) {
                console.error('Error leyendo archivo:', error);
                Alert.error('Error al leer el archivo CSV');
            }
        };
        reader.readAsText(file);
    };

    const validarDatos = () => {
        const errores = [];

        if (!previsualizacion) {
            errores.push('No hay datos para validar');
            return errores;
        }

        // Validar headers requeridos
        const headersRequeridos = ['Código', 'Nombre', 'Tipo', 'Ciudad'];
        const headersFaltantes = headersRequeridos.filter(h =>
            !previsualizacion.headers.some(header =>
                header.toLowerCase().includes(h.toLowerCase())
            )
        );

        if (headersFaltantes.length > 0) {
            errores.push(`Headers faltantes: ${headersFaltantes.join(', ')}`);
        }

        // Validar datos de ejemplo
        previsualizacion.data.forEach((fila, index) => {
            if (fila.length < headersRequeridos.length) {
                errores.push(`Fila ${index + 2}: Datos incompletos`);
            }

            // Validar código (primer campo)
            if (fila[0] && !/^[A-Z0-9-]+$/.test(fila[0])) {
                errores.push(`Fila ${index + 2}: Código inválido "${fila[0]}"`);
            }
        });

        setErroresValidacion(errores);
        return errores;
    };

    const handleSiguiente = () => {
        if (paso === 2) {
            const errores = validarDatos();
            if (errores.length === 0 || !configuracion.validar_antes_importar) {
                setPaso(3);
            }
        } else if (paso === 3) {
            handleImportar();
        }
    };

    const handleImportar = async () => {
        if (!archivo) return;

        const formData = new FormData();
        formData.append('archivo', archivo);
        formData.append('configuracion', JSON.stringify(configuracion));

        const resultado = await onImportar(formData);
        if (resultado) {
            handleClose();
        }
    };

    const handleClose = () => {
        setArchivo(null);
        setPrevisualizacion(null);
        setErroresValidacion([]);
        setPaso(1);
        onClose();
    };

    return (
        <Dialog open={open} handler={handleClose} size="lg">
            <DialogHeader className="flex items-center gap-3 bg-green-50 m-0 p-6 rounded-t-lg">
                <div className="p-2 bg-green-100 rounded-lg">
                    <IoCloudUpload className="h-6 w-6 text-green-600" />
                </div>
                <div>
                    <Typography variant="h5" color="blue-gray">
                        Importación Masiva de Almacenes
                    </Typography>
                    <Typography color="gray" className="text-sm">
                        Paso {paso} de 3
                    </Typography>
                </div>
            </DialogHeader>

            <DialogBody className="p-6 max-h-[70vh] overflow-y-auto">
                {/* Paso 1: Selección de archivo */}
                {paso === 1 && (
                    <div className="space-y-6">
                        <Alert color="blue" icon={<IoInformationCircle />}>
                            Selecciona un archivo CSV con los datos de los almacenes a importar.
                            Asegúrate de que incluya las columnas: Código, Nombre, Tipo, Ciudad.
                        </Alert>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <IoCloudUpload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <Typography variant="h6" color="gray" className="mb-2">
                                Arrastra tu archivo CSV aquí
                            </Typography>
                            <Typography color="gray" className="mb-4">
                                o haz clic para seleccionar
                            </Typography>
                            <input
                                type="file"
                                accept=".csv"
                                onChange={handleArchivoSeleccionado}
                                className="hidden"
                                id="archivo-csv"
                            />
                            <label htmlFor="archivo-csv">
                                <Button size="sm" color="blue" className="cursor-pointer">
                                    Seleccionar Archivo
                                </Button>
                            </label>
                        </div>

                        <div className="text-center">
                            <Button
                                variant="outlined"
                                color="green"
                                size="sm"
                                onClick={onDescargarPlantilla}
                                className="flex items-center gap-2 mx-auto"
                            >
                                <IoDownload className="h-4 w-4" />
                                Descargar Plantilla CSV
                            </Button>
                        </div>
                    </div>
                )}

                {/* Paso 2: Configuración */}
                {paso === 2 && (
                    <div className="space-y-6">
                        <div>
                            <Typography variant="h6" color="blue-gray" className="mb-4">
                                Configuración de Importación
                            </Typography>
                            <Typography color="gray" className="mb-4">
                                Archivo seleccionado: <strong>{archivo?.name}</strong>
                            </Typography>
                        </div>

                        <Card>
                            <CardBody className="p-4">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Typography variant="small" color="blue-gray" className="font-medium">
                                                Sobrescribir Existentes
                                            </Typography>
                                            <Typography variant="small" color="gray">
                                                Actualizar almacenes que ya existen
                                            </Typography>
                                        </div>
                                        <Switch
                                            checked={configuracion.sobrescribir_existentes}
                                            onChange={(e) => setConfiguracion(prev => ({
                                                ...prev,
                                                sobrescribir_existentes: e.target.checked
                                            }))}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Typography variant="small" color="blue-gray" className="font-medium">
                                                Validar Antes de Importar
                                            </Typography>
                                            <Typography variant="small" color="gray">
                                                Verificar datos antes de guardar
                                            </Typography>
                                        </div>
                                        <Switch
                                            checked={configuracion.validar_antes_importar}
                                            onChange={(e) => setConfiguracion(prev => ({
                                                ...prev,
                                                validar_antes_importar: e.target.checked
                                            }))}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Typography variant="small" color="blue-gray" className="font-medium">
                                                Enviar Notificaciones
                                            </Typography>
                                            <Typography variant="small" color="gray">
                                                Notificar a usuarios sobre la importación
                                            </Typography>
                                        </div>
                                        <Switch
                                            checked={configuracion.enviar_notificaciones}
                                            onChange={(e) => setConfiguracion(prev => ({
                                                ...prev,
                                                enviar_notificaciones: e.target.checked
                                            }))}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Typography variant="small" color="blue-gray" className="font-medium">
                                                Crear Respaldos
                                            </Typography>
                                            <Typography variant="small" color="gray">
                                                Respaldar datos antes de importar
                                            </Typography>
                                        </div>
                                        <Switch
                                            checked={configuracion.crear_respaldos}
                                            onChange={(e) => setConfiguracion(prev => ({
                                                ...prev,
                                                crear_respaldos: e.target.checked
                                            }))}
                                        />
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Errores de validación */}
                        {configuracion.validar_antes_importar && erroresValidacion.length > 0 && (
                            <Alert color="red" icon={<IoWarning />}>
                                <Typography variant="small" className="font-medium mb-2">
                                    Errores de Validación:
                                </Typography>
                                <ul className="list-disc list-inside space-y-1">
                                    {erroresValidacion.slice(0, 5).map((error, index) => (
                                        <li key={index} className="text-xs">{error}</li>
                                    ))}
                                    {erroresValidacion.length > 5 && (
                                        <li className="text-xs">... y {erroresValidacion.length - 5} errores más</li>
                                    )}
                                </ul>
                            </Alert>
                        )}
                    </div>
                )}

                {/* Paso 3: Previsualización */}
                {paso === 3 && previsualizacion && (
                    <div className="space-y-6">
                        <div>
                            <Typography variant="h6" color="blue-gray" className="mb-2">
                                Previsualización de Datos
                            </Typography>
                            <Typography color="gray">
                                Se importarán {previsualizacion.totalFilas} almacenes aproximadamente
                            </Typography>
                        </div>

                        <Card>
                            <CardBody className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-max table-auto text-left">
                                        <thead>
                                        <tr className="bg-gray-50">
                                            {previsualizacion.headers.map((header, index) => (
                                                <th key={index} className="p-3 border-b border-gray-200">
                                                    <Typography variant="small" color="blue-gray" className="font-medium">
                                                        {header}
                                                    </Typography>
                                                </th>
                                            ))}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {previsualizacion.data.map((fila, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                {fila.map((celda, cellIndex) => (
                                                    <td key={cellIndex} className="p-3 border-b border-gray-100">
                                                        <Typography variant="small" color="blue-gray">
                                                            {celda || '-'}
                                                        </Typography>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                                {previsualizacion.totalFilas > 5 && (
                                    <div className="p-3 bg-gray-50 text-center border-t">
                                        <Typography variant="small" color="gray">
                                            ... y {previsualizacion.totalFilas - previsualizacion.data.length} filas más
                                        </Typography>
                                    </div>
                                )}
                            </CardBody>
                        </Card>

                        <Alert color="green" icon={<IoCheckmarkCircle />}>
                            Los datos están listos para importar. Haz clic en "Importar" para proceder.
                        </Alert>
                    </div>
                )}
            </DialogBody>

            <DialogFooter className="space-x-2 bg-gray-50 m-0 p-6 rounded-b-lg">
                <Button variant="text" color="red" onClick={handleClose} disabled={loading}>
                    Cancelar
                </Button>

                {paso > 1 && (
                    <Button
                        variant="outlined"
                        color="blue-gray"
                        onClick={() => setPaso(paso - 1)}
                        disabled={loading}
                    >
                        Anterior
                    </Button>
                )}

                {paso < 3 ? (
                    <Button
                        color="blue"
                        onClick={handleSiguiente}
                        disabled={loading || (paso === 1 && !archivo) || (paso === 2 && configuracion.validar_antes_importar && erroresValidacion.length > 0)}
                        className="flex items-center gap-2"
                    >
                        Siguiente
                    </Button>
                ) : (
                    <Button
                        color="green"
                        onClick={handleImportar}
                        loading={loading}
                        className="flex items-center gap-2"
                    >
                        <IoCloudUpload className="h-4 w-4" />
                        Importar Almacenes
                    </Button>
                )}
            </DialogFooter>
        </Dialog>
    );
};

// ========== EXPORTACIÓN DIALOG ==========
export const ExportacionDialog = ({
                                      open,
                                      onClose,
                                      onExportar,
                                      almacenes = [],
                                      loading = false
                                  }) => {
    const [configuracion, setConfiguracion] = useState({
        formato: 'csv',
        incluir_estadisticas: false,
        incluir_configuracion: false,
        columnas: ['codigo', 'nombre', 'tipo', 'ciudad', 'estado', 'materiales'],
        filtrar_por: 'todos',
        nombre_archivo: 'almacenes'
    });

    const columnasDisponibles = [
        { key: 'codigo', label: 'Código' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'tipo', label: 'Tipo' },
        { key: 'ciudad', label: 'Ciudad' },
        { key: 'estado', label: 'Estado' },
        { key: 'es_principal', label: 'Es Principal' },
        { key: 'materiales', label: 'Total Materiales' },
        { key: 'capacidad', label: 'Capacidad' },
        { key: 'direccion', label: 'Dirección' },
        { key: 'telefono', label: 'Teléfono' },
        { key: 'email', label: 'Email' },
        { key: 'responsable', label: 'Responsable' },
        { key: 'created_at', label: 'Fecha Creación' },
        { key: 'updated_at', label: 'Última Modificación' },
    ];

    const toggleColumna = (columna) => {
        setConfiguracion(prev => ({
            ...prev,
            columnas: prev.columnas.includes(columna)
                ? prev.columnas.filter(c => c !== columna)
                : [...prev.columnas, columna]
        }));
    };

    const handleExportar = async () => {
        const resultado = await onExportar(configuracion);
        if (resultado) {
            onClose();
        }
    };

    return (
        <Dialog open={open} handler={onClose} size="md">
            <DialogHeader className="flex items-center gap-3 bg-blue-50 m-0 p-6 rounded-t-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <IoDownload className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                    <Typography variant="h5" color="blue-gray">
                        Exportar Almacenes
                    </Typography>
                    <Typography color="gray" className="text-sm">
                        Configurar exportación de datos
                    </Typography>
                </div>
            </DialogHeader>

            <DialogBody className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Formato */}
                <div>
                    <Typography variant="h6" color="blue-gray" className="mb-3">
                        Formato de Exportación
                    </Typography>
                    <div className="grid grid-cols-3 gap-2">
                        {['csv', 'excel', 'pdf'].map((formato) => (
                            <Button
                                key={formato}
                                variant={configuracion.formato === formato ? 'filled' : 'outlined'}
                                size="sm"
                                color="blue"
                                onClick={() => setConfiguracion(prev => ({ ...prev, formato }))}
                            >
                                {formato.toUpperCase()}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Filtrado */}
                <div>
                    <Typography variant="h6" color="blue-gray" className="mb-3">
                        Datos a Exportar
                    </Typography>
                    <Select
                        label="Filtrar por"
                        value={configuracion.filtrar_por}
                        onChange={(val) => setConfiguracion(prev => ({ ...prev, filtrar_por: val }))}
                    >
                        <Option value="todos">Todos los almacenes ({almacenes.length})</Option>
                        <Option value="activos">Solo activos ({almacenes.filter(a => a.activo).length})</Option>
                        <Option value="principales">Solo principales ({almacenes.filter(a => a.es_principal).length})</Option>
                    </Select>
                </div>

                {/* Columnas */}
                <div>
                    <Typography variant="h6" color="blue-gray" className="mb-3">
                        Columnas a Incluir
                    </Typography>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                        {columnasDisponibles.map((columna) => (
                            <div key={columna.key} className="flex items-center gap-2">
                                <Checkbox
                                    checked={configuracion.columnas.includes(columna.key)}
                                    onChange={() => toggleColumna(columna.key)}
                                    color="blue"
                                />
                                <Typography variant="small" color="blue-gray">
                                    {columna.label}
                                </Typography>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Opciones adicionales */}
                <div>
                    <Typography variant="h6" color="blue-gray" className="mb-3">
                        Opciones Adicionales
                    </Typography>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Typography variant="small" color="blue-gray">
                                Incluir estadísticas
                            </Typography>
                            <Switch
                                checked={configuracion.incluir_estadisticas}
                                onChange={(e) => setConfiguracion(prev => ({
                                    ...prev,
                                    incluir_estadisticas: e.target.checked
                                }))}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Typography variant="small" color="blue-gray">
                                Incluir configuración
                            </Typography>
                            <Switch
                                checked={configuracion.incluir_configuracion}
                                onChange={(e) => setConfiguracion(prev => ({
                                    ...prev,
                                    incluir_configuracion: e.target.checked
                                }))}
                            />
                        </div>
                    </div>
                </div>

                {/* Nombre del archivo */}
                <div>
                    <Input
                        label="Nombre del archivo"
                        value={configuracion.nombre_archivo}
                        onChange={(e) => setConfiguracion(prev => ({
                            ...prev,
                            nombre_archivo: e.target.value
                        }))}
                    />
                    <Typography variant="small" color="gray" className="mt-1">
                        Se agregará automáticamente la fecha y extensión
                    </Typography>
                </div>
            </DialogBody>

            <DialogFooter className="space-x-2 bg-gray-50 m-0 p-6 rounded-b-lg">
                <Button variant="text" color="red" onClick={onClose} disabled={loading}>
                    Cancelar
                </Button>
                <Button
                    color="blue"
                    onClick={handleExportar}
                    loading={loading}
                    disabled={configuracion.columnas.length === 0}
                    className="flex items-center gap-2"
                >
                    <IoDownload className="h-4 w-4" />
                    Exportar
                </Button>
            </DialogFooter>
        </Dialog>
    );
};
