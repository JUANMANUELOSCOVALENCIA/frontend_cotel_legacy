// src/core/almacenes/pages/modelos/ModeloDialog.jsx - VERSIÓN FINAL CORREGIDA
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    Input,
    Textarea,
    Switch,
    Typography,
    Alert,
    Spinner,
    Select,
    Option
} from '@material-tailwind/react';
import { useForm, Controller } from 'react-hook-form';
import { useOpcionesCompletas } from '../../hooks/useAlmacenes';

const ModeloDialog = ({
                          open,
                          onClose,
                          onSubmit,
                          title,
                          mode = 'create',
                          initialData = null
                      }) => {
    const { opciones, loading: loadingOpciones } = useOpcionesCompletas();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
        watch
    } = useForm({
        defaultValues: {
            nombre: '',
            codigo_modelo: '',
            marca: '',
            tipo_material: '',
            unidad_medida: '',
            requiere_inspeccion_inicial: false,
            descripcion: ''
        }
    });

    const watchTipoMaterial = watch('tipo_material');

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

    const getUnidadesMedidaSeguras = () => {
        return opciones?.unidades_medida?.filter(unidad =>
            unidad &&
            unidad.id !== null &&
            unidad.id !== undefined &&
            unidad.nombre &&
            unidad.activo
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

    // Filtrar tipos de material para ONUs
    const tiposMaterialONU = getTiposMaterialSeguras().filter(tipo => tipo.es_unico === true);

    // Filtrar tipos de material para materiales generales
    const tiposMaterialGeneral = getTiposMaterialSeguras().filter(tipo => tipo.es_unico === false);

    // Resetear form cuando se abre/cierra o cambian los datos iniciales
    useEffect(() => {
        if (open) {
            if (mode === 'edit' && initialData) {
                reset({
                    nombre: initialData.nombre || '',
                    codigo_modelo: initialData.codigo_modelo || '',
                    marca: initialData.marca?.toString() || '',
                    tipo_material: initialData.tipo_material?.toString() || '',
                    unidad_medida: initialData.unidad_medida?.toString() || '',
                    requiere_inspeccion_inicial: initialData.requiere_inspeccion_inicial || false,
                    descripcion: initialData.descripcion || ''
                });
            } else {
                reset({
                    nombre: '',
                    codigo_modelo: '',
                    marca: '',
                    tipo_material: '',
                    unidad_medida: '',
                    requiere_inspeccion_inicial: false,
                    descripcion: ''
                });
            }
            setError(null);
        }
    }, [open, mode, initialData, reset]);

    const handleFormSubmit = async (data) => {
        setSubmitting(true);
        setError(null);

        try {
            console.log('🔍 Datos RAW del formulario:', data);

            // ✅ CAMBIO CRÍTICO: El backend espera 'tipo_equipo', no 'tipo_material'
            const cleanModeloData = {
                nombre: String(data.nombre || '').trim(),
                codigo_modelo: String(data.codigo_modelo || '').trim(),
                marca: Number(data.marca),
                tipo_equipo: Number(data.tipo_material), // ✅ CAMBIO AQUÍ: usar tipo_equipo
                unidad_medida: Number(data.unidad_medida),
                requiere_inspeccion_inicial: Boolean(data.requiere_inspeccion_inicial),
                descripcion: String(data.descripcion || '').trim()
            };

            // ✅ VALIDACIONES ROBUSTAS
            if (!cleanModeloData.nombre) {
                throw new Error('El nombre es obligatorio');
            }
            if (!cleanModeloData.codigo_modelo) {
                throw new Error('El código del modelo es obligatorio');
            }
            if (isNaN(cleanModeloData.marca) || cleanModeloData.marca <= 0) {
                throw new Error('Selecciona una marca válida');
            }
            if (isNaN(cleanModeloData.tipo_equipo) || cleanModeloData.tipo_equipo <= 0) {
                throw new Error('Selecciona un tipo de material válido');
            }
            if (isNaN(cleanModeloData.unidad_medida) || cleanModeloData.unidad_medida <= 0) {
                throw new Error('Selecciona una unidad de medida válida');
            }

            console.log('📤 Datos LIMPIOS a enviar al backend:', cleanModeloData);
            console.log('🔍 Tipos de datos:');
            Object.entries(cleanModeloData).forEach(([key, value]) => {
                console.log(`  ${key}: ${typeof value} = ${value}`);
            });

            const result = await onSubmit(cleanModeloData);

            console.log('📡 Respuesta del backend:', result);

            if (!result.success) {
                setError(result.error);
            }
        } catch (err) {
            console.error('❌ Error en handleFormSubmit:', err);
            setError(err.message || 'Error inesperado al guardar');
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!submitting) {
            reset();
            setError(null);
            onClose();
        }
    };

    return (
        <Dialog open={open} handler={handleClose} size="lg">
            <DialogHeader>
                <Typography variant="h5" color="blue-gray">
                    {title}
                </Typography>
            </DialogHeader>

            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <DialogBody divider className="space-y-4 max-h-[70vh] overflow-y-auto">
                    {error && (
                        <Alert color="red" className="mb-4">
                            {error}
                        </Alert>
                    )}

                    {loadingOpciones && (
                        <Alert color="blue" className="mb-4">
                            <div className="flex items-center gap-2">
                                <Spinner className="h-4 w-4" />
                                <Typography variant="small">
                                    Cargando opciones del sistema...
                                </Typography>
                            </div>
                        </Alert>
                    )}

                    {/* Información Básica */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nombre */}
                        <div>
                            <Input
                                label="Nombre del Modelo *"
                                {...register('nombre', {
                                    required: 'El nombre es obligatorio',
                                    minLength: {
                                        value: 2,
                                        message: 'Mínimo 2 caracteres'
                                    },
                                    maxLength: {
                                        value: 100,
                                        message: 'Máximo 100 caracteres'
                                    }
                                })}
                                error={!!errors.nombre}
                                disabled={submitting}
                            />
                            {errors.nombre && (
                                <Typography variant="small" color="red" className="mt-1">
                                    {errors.nombre.message}
                                </Typography>
                            )}
                        </div>

                        {/* Código */}
                        <div>
                            <Input
                                label="Código del Modelo *"
                                {...register('codigo_modelo', {
                                    required: 'El código es obligatorio',
                                    minLength: {
                                        value: 2,
                                        message: 'Mínimo 2 caracteres'
                                    },
                                    maxLength: {
                                        value: 20,
                                        message: 'Máximo 20 caracteres'
                                    }
                                })}
                                error={!!errors.codigo_modelo}
                                disabled={submitting}
                            />
                            {errors.codigo_modelo && (
                                <Typography variant="small" color="red" className="mt-1">
                                    {errors.codigo_modelo.message}
                                </Typography>
                            )}
                        </div>
                    </div>

                    {/* Relaciones */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* ✅ MARCA - CON DESIGN ORIGINAL PERO CORREGIDO */}
                        <div>
                            <Controller
                                name="marca"
                                control={control}
                                rules={{ required: 'La marca es obligatoria' }}
                                render={({ field }) => (
                                    <Select
                                        label="Marca *"
                                        value={field.value}
                                        onChange={(value) => {
                                            console.log('Marca seleccionada:', value);
                                            field.onChange(value);
                                        }}
                                        error={!!errors.marca}
                                        disabled={submitting || loadingOpciones}
                                    >
                                        {getMarcasSeguras().map(marca => (
                                            <Option key={marca.id} value={marca.id.toString()}>
                                                {marca.nombre}
                                            </Option>
                                        ))}
                                    </Select>
                                )}
                            />
                            {errors.marca && (
                                <Typography variant="small" color="red" className="mt-1">
                                    {errors.marca.message}
                                </Typography>
                            )}
                        </div>

                        {/* ✅ TIPO DE MATERIAL - CON DESIGN ORIGINAL PERO CORREGIDO */}
                        <div>
                            <Controller
                                name="tipo_material"
                                control={control}
                                rules={{ required: 'El tipo de material es obligatorio' }}
                                render={({ field }) => (
                                    <Select
                                        label="Tipo de Material *"
                                        value={field.value}
                                        onChange={(value) => {
                                            console.log('Tipo material seleccionado:', value);
                                            field.onChange(value);
                                        }}
                                        error={!!errors.tipo_material}
                                        disabled={submitting || loadingOpciones}
                                    >
                                        {/* Tipos para ONUs */}
                                        {tiposMaterialONU.length > 0 && (
                                            <>
                                                <Option value="" disabled className="font-semibold text-blue-600">
                                                    === EQUIPOS ONUs ===
                                                </Option>
                                                {tiposMaterialONU.map(tipo => (
                                                    <Option key={`onu-${tipo.id}`} value={tipo.id.toString()}>
                                                        {tipo.nombre} (Equipo único)
                                                    </Option>
                                                ))}
                                            </>
                                        )}

                                        {/* Tipos para materiales generales */}
                                        {tiposMaterialGeneral.length > 0 && (
                                            <>
                                                <Option value="" disabled className="font-semibold text-green-600">
                                                    === MATERIALES GENERALES ===
                                                </Option>
                                                {tiposMaterialGeneral.map(tipo => (
                                                    <Option key={`general-${tipo.id}`} value={tipo.id.toString()}>
                                                        {tipo.nombre} (Por cantidad)
                                                    </Option>
                                                ))}
                                            </>
                                        )}
                                    </Select>
                                )}
                            />
                            {errors.tipo_material && (
                                <Typography variant="small" color="red" className="mt-1">
                                    {errors.tipo_material.message}
                                </Typography>
                            )}
                        </div>
                    </div>

                    {/* ✅ UNIDAD DE MEDIDA - CON DESIGN ORIGINAL PERO CORREGIDO */}
                    <div>
                        <Controller
                            name="unidad_medida"
                            control={control}
                            rules={{ required: 'La unidad de medida es obligatoria' }}
                            render={({ field }) => (
                                <Select
                                    label="Unidad de Medida *"
                                    value={field.value}
                                    onChange={(value) => {
                                        console.log('Unidad medida seleccionada:', value);
                                        field.onChange(value);
                                    }}
                                    error={!!errors.unidad_medida}
                                    disabled={submitting || loadingOpciones}
                                >
                                    {getUnidadesMedidaSeguras().map(unidad => (
                                        <Option key={unidad.id} value={unidad.id.toString()}>
                                            {unidad.nombre} ({unidad.simbolo})
                                        </Option>
                                    ))}
                                </Select>
                            )}
                        />
                        {errors.unidad_medida && (
                            <Typography variant="small" color="red" className="mt-1">
                                {errors.unidad_medida.message}
                            </Typography>
                        )}
                    </div>

                    {/* Descripción */}
                    <div>
                        <Textarea
                            label="Descripción"
                            {...register('descripcion', {
                                maxLength: {
                                    value: 255,
                                    message: 'Máximo 255 caracteres'
                                }
                            })}
                            error={!!errors.descripcion}
                            disabled={submitting}
                            rows={3}
                        />
                        {errors.descripcion && (
                            <Typography variant="small" color="red" className="mt-1">
                                {errors.descripcion.message}
                            </Typography>
                        )}
                    </div>

                    {/* Configuración */}
                    <div className="p-4 bg-blue-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <Typography variant="small" color="blue-gray" className="font-medium">
                                    Requiere Inspección Inicial
                                </Typography>
                                <Typography variant="small" color="gray">
                                    Los materiales nuevos de este modelo necesitarán inspección antes de estar disponibles
                                </Typography>
                            </div>
                            <Controller
                                name="requiere_inspeccion_inicial"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        checked={field.value}
                                        onChange={field.onChange}
                                        color="blue"
                                        disabled={submitting}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    {/* Alertas informativas */}
                    {watchTipoMaterial && !loadingOpciones && (
                        <Alert color="blue">
                            <Typography variant="small">
                                {tiposMaterialONU.find(tipo => tipo.id.toString() === watchTipoMaterial) ? (
                                    <>
                                        <strong>Equipo ONU:</strong> Cada material tendrá identificadores únicos (MAC, Serial, etc.)
                                    </>
                                ) : (
                                    <>
                                        <strong>Material General:</strong> Se manejará por cantidades y no requiere identificadores únicos
                                    </>
                                )}
                            </Typography>
                        </Alert>
                    )}
                </DialogBody>

                <DialogFooter className="space-x-2">
                    <Button
                        variant="text"
                        color="gray"
                        onClick={handleClose}
                        disabled={submitting}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        color="blue"
                        disabled={submitting || loadingOpciones}
                        className="flex items-center gap-2"
                    >
                        {submitting && <Spinner className="h-4 w-4" />}
                        {mode === 'create' ? 'Crear' : 'Actualizar'}
                    </Button>
                </DialogFooter>
            </form>
        </Dialog>
    );
};

export default ModeloDialog;