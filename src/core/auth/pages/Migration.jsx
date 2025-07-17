import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import {
    Card,
    CardBody,
    CardHeader,
    Typography,
    Input,
    Button,
    Alert,
} from '@material-tailwind/react';
import { IoPersonAdd } from 'react-icons/io5';
import authService from '../services/authService';

const Migration = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            codigocotel: '',
        },
    });

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const result = await authService.migrateUser(parseInt(data.codigocotel));

            if (result.success) {
                setSuccess(
                    `Usuario migrado exitosamente. 
          Usuario: ${data.codigocotel} 
          Contraseña: ${data.codigocotel} 
          Ahora puedes iniciar sesión.`
                );
                reset();

                // Redirigir al login después de 3 segundos
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setError(result.error);
            }
        } catch (err) {
            console.error('Migration error:', err);
            setError('Error inesperado durante la migración');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-gray-100 px-4">
            <div className="w-full max-w-md">
                <Card className="shadow-2xl">
                    <CardHeader
                        floated={false}
                        shadow={false}
                        className="m-0 grid place-items-center bg-gradient-to-r from-orange-600 to-gray-600 py-8 px-4 text-center"
                    >
                        <div className="mb-4 h-20 w-20 text-white">
                            <IoPersonAdd className="w-full h-full" />
                        </div>
                        <Typography variant="h4" color="white" className="font-bold">
                            Migración de Usuario
                        </Typography>
                        <Typography color="orange" className="mt-1 text-orange-100">
                            Migra tu usuario desde el sistema de empleados
                        </Typography>
                    </CardHeader>

                    <CardBody className="p-6">
                        {error && (
                            <Alert color="red" className="mb-4">
                                {error}
                            </Alert>
                        )}

                        {success && (
                            <Alert color="green" className="mb-4">
                                {success}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="mb-2 font-medium"
                                >
                                    Código COTEL
                                </Typography>
                                <Input
                                    type="number"
                                    size="lg"
                                    placeholder="Ingresa tu código COTEL de empleado"
                                    className="!border-t-blue-gray-200 focus:!border-t-orange-500"
                                    labelProps={{
                                        className: "before:content-none after:content-none",
                                    }}
                                    {...register('codigocotel', {
                                        required: 'El código COTEL es obligatorio',
                                        min: {
                                            value: 1,
                                            message: 'Código COTEL inválido',
                                        },
                                        max: {
                                            value: 999999,
                                            message: 'Código COTEL demasiado largo',
                                        },
                                    })}
                                    error={!!errors.codigocotel}
                                />
                                {errors.codigocotel && (
                                    <Typography variant="small" color="red" className="mt-1">
                                        {errors.codigocotel.message}
                                    </Typography>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="mt-6 bg-gradient-to-r from-orange-600 to-gray-600"
                                fullWidth
                                loading={loading}
                                disabled={loading}
                            >
                                {loading ? 'Migrando usuario...' : 'Migrar Usuario'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <Typography variant="small" color="blue-gray">
                                ¿Ya tienes una cuenta migrada?{' '}
                                <Link
                                    to="/login"
                                    className="text-orange-600 hover:text-orange-800 font-medium"
                                >
                                    Iniciar sesión
                                </Link>
                            </Typography>
                        </div>

                        <div className="mt-4 p-4 bg-blue-gray-50 rounded-lg">
                            <Typography variant="small" color="blue-gray" className="font-medium mb-2">
                                ¿Qué es la migración?
                            </Typography>
                            <Typography variant="small" color="gray" className="text-xs">
                                La migración crea tu usuario en el nuevo sistema usando tu código COTEL de empleado.
                                Tu contraseña inicial será tu mismo código COTEL.
                            </Typography>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default Migration;