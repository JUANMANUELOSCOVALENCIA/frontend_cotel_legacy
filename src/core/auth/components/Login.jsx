import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate, Link } from 'react-router-dom';
import {
    Card,
    CardBody,
    CardHeader,
    Typography,
    Input,
    Button,
    Alert,
} from '@material-tailwind/react';
import { IoEye, IoEyeOff, IoPersonCircle } from 'react-icons/io5';
import { useLogin } from '../hooks/useAuth';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading, error, clearError } = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            codigocotel: '',
            password: '',
        },
    });

    const onSubmit = async (data) => {
        clearError();

        console.log('Intentando login con:', data.codigocotel);

        const result = await login({
            codigocotel: parseInt(data.codigocotel),
            password: data.password,
        });

        if (result.success) {
            console.log('Login exitoso, requiresPasswordChange:', result.requiresPasswordChange);
            // La redirección se maneja automáticamente por los guards de rutas
        } else {
            console.error('Login falló:', result.error);
            reset({ password: '' }); // Solo limpiar contraseña
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
                            <IoPersonCircle className="w-full h-full" />
                        </div>
                        <Typography variant="h4" color="white" className="font-bold">
                            Sistema COTEL
                        </Typography>
                        <Typography color="orange" className="mt-1 text-orange-100">
                            Inicia sesión con tu código COTEL
                        </Typography>
                    </CardHeader>

                    <CardBody className="p-6">
                        {error && (
                            <Alert
                                color="red"
                                className="mb-4"
                                dismissible={{
                                    onClose: clearError,
                                }}
                            >
                                {error}
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
                                    placeholder="Ingresa tu código COTEL"
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

                            <div>
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="mb-2 font-medium"
                                >
                                    Contraseña
                                </Typography>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        size="lg"
                                        placeholder="Ingresa tu contraseña"
                                        className="!border-t-blue-gray-200 focus:!border-t-orange-500 pr-10"
                                        labelProps={{
                                            className: "before:content-none after:content-none",
                                        }}
                                        {...register('password', {
                                            required: 'La contraseña es obligatoria',
                                            minLength: {
                                                value: 1,
                                                message: 'La contraseña es obligatoria',
                                            },
                                        })}
                                        error={!!errors.password}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-gray-400 hover:text-blue-gray-600"
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? (
                                            <IoEyeOff className="h-5 w-5" />
                                        ) : (
                                            <IoEye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <Typography variant="small" color="red" className="mt-1">
                                        {errors.password.message}
                                    </Typography>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="mt-6 bg-gradient-to-r from-orange-600 to-gray-600"
                                fullWidth
                                loading={isLoading}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <Typography variant="small" color="blue-gray">
                                ¿No tienes una cuenta?{' '}
                                <Link
                                    to="/migration"
                                    className="text-orange-600 hover:text-orange-800 font-medium"
                                >
                                    Migrar desde empleados
                                </Link>
                            </Typography>
                        </div>

                        <div className="mt-4 text-center">
                            <Typography variant="small" color="blue-gray" className="text-xs">
                                Si es tu primer ingreso, usa tu código COTEL como contraseña
                            </Typography>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default Login;