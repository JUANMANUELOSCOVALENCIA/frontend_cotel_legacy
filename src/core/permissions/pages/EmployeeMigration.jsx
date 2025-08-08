import React, { useState, useEffect, useCallback } from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Typography,
    Button,
    Input,
    Select,
    Option,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Chip,
    IconButton,
    Alert,
    Progress,
    Checkbox,
} from '@material-tailwind/react';
import {
    IoPersonAdd,
    IoSearch,
    IoRefresh,
    IoCheckmarkCircle,
    IoWarning,
    IoStatsChart,
    IoPeople,
} from 'react-icons/io5';
import { useForm, Controller } from 'react-hook-form';
import toast from 'react-hot-toast';
import permissionService from '../services/permissionService';
import { useRolesCRUD } from '../hooks/usePermissions';
import Loader from '../../layout/Loader';

const EmployeeMigration = () => {
    // States
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [statistics, setStatistics] = useState(null);
    const [showMigrateDialog, setShowMigrateDialog] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({});

    // Hooks
    const {
        roles,
        loading: rolesLoading,
        loadRoles,
    } = useRolesCRUD();

    // Form
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm();

    // Load data on mount
    useEffect(() => {
        loadEmployees();
        loadRoles({ page_size: 100 });
        loadStatistics();
    }, [currentPage, filters]);

    const loadEmployees = async () => {
        setLoading(true);
        setError('');

        try {
            const params = {
                page: currentPage,
                search: filters.search,
                page_size: 20
            };

            const result = await permissionService.getAvailableEmployees(params);

            if (result.success) {
                setEmployees(result.data.results || result.data);
                setPagination({
                    count: result.data.count || 0,
                    next: result.data.next || null,
                    previous: result.data.previous || null,
                });
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError('Error al cargar empleados disponibles');
        } finally {
            setLoading(false);
        }
    };

    const loadStatistics = async () => {
        try {
            const result = await permissionService.getMigrationStatistics();
            if (result.success) {
                setStatistics(result.data);
            }
        } catch (err) {
            console.error('Error loading statistics:', err);
        }
    };

    const handleSearch = useCallback((value) => {
        setFilters(prev => ({ ...prev, search: value }));
        setCurrentPage(1);
    }, []);

    const handleMigrateSingle = (employee) => {
        setSelectedEmployee(employee);
        reset({
            empleado_persona: employee.persona,
            rol_id: ''
        });
        setShowMigrateDialog(true);
    };

    const handleMigrateEmployee = async (data) => {
        setLoading(true);
        try {
            const result = await permissionService.migrateEmployee({
                empleado_persona: data.empleado_persona,
                rol_id: parseInt(data.rol_id)
            });

            if (result.success) {
                toast.success(`Empleado ${selectedEmployee.nombre_completo} migrado correctamente`);
                setShowMigrateDialog(false);
                setSelectedEmployee(null);
                reset();
                loadEmployees();
                loadStatistics();
            } else {
                toast.error(result.error);
            }
        } catch (err) {
            toast.error('Error al migrar empleado');
        } finally {
            setLoading(false);
        }
    };

    const handleBulkMigration = async (roleId) => {
        if (selectedEmployees.length === 0) {
            toast.error('Selecciona al menos un empleado');
            return;
        }

        setLoading(true);
        let successCount = 0;
        let errorCount = 0;

        try {
            for (const employeePersona of selectedEmployees) {
                try {
                    const result = await permissionService.migrateEmployee({
                        empleado_persona: employeePersona,
                        rol_id: parseInt(roleId)
                    });

                    if (result.success) {
                        successCount++;
                    } else {
                        errorCount++;
                    }
                } catch (err) {
                    errorCount++;
                }
            }

            if (successCount > 0) {
                toast.success(`${successCount} empleados migrados correctamente`);
            }
            if (errorCount > 0) {
                toast.error(`${errorCount} empleados no pudieron ser migrados`);
            }

            setSelectedEmployees([]);
            loadEmployees();
            loadStatistics();
        } catch (err) {
            toast.error('Error en migración masiva');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectEmployee = (employeePersona, checked) => {
        if (checked) {
            setSelectedEmployees(prev => [...prev, employeePersona]);
        } else {
            setSelectedEmployees(prev => prev.filter(id => id !== employeePersona));
        }
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedEmployees(employees.map(emp => emp.persona));
        } else {
            setSelectedEmployees([]);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <Typography variant="h3" color="blue-gray">
                        Migración de Empleados
                    </Typography>
                    <Typography color="gray" className="mt-1">
                        Migra empleados del sistema FDW al nuevo sistema de usuarios
                    </Typography>
                </div>

                <Button
                    variant="outlined"
                    className="flex items-center gap-2"
                    onClick={loadStatistics}
                >
                    <IoRefresh className="h-5 w-5" />
                    Actualizar
                </Button>
            </div>

            {/* Statistics */}
            {statistics && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="border-l-4 border-blue-500">
                        <CardBody className="p-4">
                            <div className="flex items-center gap-3">
                                <IoPeople className="h-8 w-8 text-blue-500" />
                                <div>
                                    <Typography variant="h4" color="blue-gray">
                                        {statistics.total_empleados_fdw}
                                    </Typography>
                                    <Typography variant="small" color="gray">
                                        Total Empleados
                                    </Typography>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="border-l-4 border-green-500">
                        <CardBody className="p-4">
                            <div className="flex items-center gap-3">
                                <IoCheckmarkCircle className="h-8 w-8 text-green-500" />
                                <div>
                                    <Typography variant="h4" color="blue-gray">
                                        {statistics.total_migrados}
                                    </Typography>
                                    <Typography variant="small" color="gray">
                                        Ya Migrados
                                    </Typography>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="border-l-4 border-orange-500">
                        <CardBody className="p-4">
                            <div className="flex items-center gap-3">
                                <IoPersonAdd className="h-8 w-8 text-orange-500" />
                                <div>
                                    <Typography variant="h4" color="blue-gray">
                                        {statistics.total_disponibles}
                                    </Typography>
                                    <Typography variant="small" color="gray">
                                        Disponibles
                                    </Typography>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="border-l-4 border-purple-500">
                        <CardBody className="p-4">
                            <div className="flex items-center gap-3">
                                <IoStatsChart className="h-8 w-8 text-purple-500" />
                                <div>
                                    <Typography variant="h4" color="blue-gray">
                                        {statistics.porcentaje_migrado}%
                                    </Typography>
                                    <Typography variant="small" color="gray">
                                        Progreso
                                    </Typography>
                                </div>
                            </div>
                            <Progress
                                value={statistics.porcentaje_migrado}
                                color="purple"
                                className="mt-2"
                            />
                        </CardBody>
                    </Card>
                </div>
            )}

            {/* Error Alert */}
            {error && (
                <Alert color="red" dismissible onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {/* Search and Bulk Actions */}
            <Card>
                <CardBody className="p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        <div className="flex-1 max-w-md">
                            <Input
                                label="Buscar empleados"
                                icon={<IoSearch />}
                                value={filters.search}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Nombre, apellido o código COTEL"
                            />
                        </div>

                        {selectedEmployees.length > 0 && (
                            <div className="flex items-center gap-2">
                                <Chip
                                    variant="ghost"
                                    color="blue"
                                    value={`${selectedEmployees.length} seleccionados`}
                                />
                                <Select
                                    label="Migrar con rol"
                                    onChange={(value) => handleBulkMigration(value)}
                                    disabled={rolesLoading}
                                >
                                    {roles.map((role) => (
                                        <Option key={role.id} value={role.id.toString()}>
                                            {role.nombre}
                                        </Option>
                                    ))}
                                </Select>
                            </div>
                        )}
                    </div>
                </CardBody>
            </Card>

            {/* Employees Table */}
            <Card>
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="flex items-center justify-between">
                        <Typography variant="h6" color="blue-gray">
                            Empleados Disponibles ({pagination.count || 0})
                        </Typography>

                        <div className="flex items-center gap-2">
                            <IconButton variant="text" onClick={loadEmployees}>
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
                    ) : employees.length === 0 ? (
                        <div className="text-center py-8">
                            <Typography color="gray">
                                {filters.search
                                    ? 'No se encontraron empleados con ese criterio'
                                    : 'No hay empleados disponibles para migrar'
                                }
                            </Typography>
                        </div>
                    ) : (
                        <table className="w-full min-w-max table-auto text-left">
                            <thead>
                            <tr>
                                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                    <Checkbox
                                        checked={selectedEmployees.length === employees.length}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                        ref={(el) => {
                                            if (el) {
                                                el.indeterminate = selectedEmployees.length > 0 &&
                                                    selectedEmployees.length < employees.length;
                                            }
                                        }}
                                    />
                                </th>
                                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                    <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                        Empleado
                                    </Typography>
                                </th>
                                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                    <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                        Código COTEL
                                    </Typography>
                                </th>
                                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                    <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                        Estado
                                    </Typography>
                                </th>
                                <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                    <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70">
                                        Fecha Ingreso
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
                            {employees.map((employee) => (
                                <tr key={employee.persona} className="hover:bg-gray-50">
                                    <td className="p-4">
                                        <Checkbox
                                            checked={selectedEmployees.includes(employee.persona)}
                                            onChange={(e) => handleSelectEmployee(employee.persona, e.target.checked)}
                                        />
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <Typography variant="small" color="blue-gray" className="font-medium">
                                                {employee.nombre_completo}
                                            </Typography>
                                            <Typography variant="small" color="gray" className="font-normal">
                                                ID: {employee.persona}
                                            </Typography>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <Typography variant="small" color="blue-gray" className="font-medium">
                                            {employee.codigocotel}
                                        </Typography>
                                    </td>
                                    <td className="p-4">
                                        <Chip
                                            variant="ghost"
                                            size="sm"
                                            value={employee.estado_texto}
                                            color={employee.esta_activo ? 'green' : 'red'}
                                        />
                                    </td>
                                    <td className="p-4">
                                        <Typography variant="small" color="gray">
                                            {employee.fechaingreso
                                                ? new Date(employee.fechaingreso).toLocaleDateString('es-ES')
                                                : 'No especificada'
                                            }
                                        </Typography>
                                    </td>
                                    <td className="p-4">
                                        <Button
                                            size="sm"
                                            color="orange"
                                            className="flex items-center gap-2"
                                            onClick={() => handleMigrateSingle(employee)}
                                            disabled={!employee.puede_migrar}
                                        >
                                            <IoPersonAdd className="h-4 w-4" />
                                            Migrar
                                        </Button>
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
                        Mostrando {employees.length} de {pagination.count} empleados
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

            {/* Migrate Employee Dialog */}
            <Dialog open={showMigrateDialog} handler={() => setShowMigrateDialog(false)} size="md">
                <DialogHeader>Migrar Empleado</DialogHeader>
                <form onSubmit={handleSubmit(handleMigrateEmployee)}>
                    <DialogBody divider className="space-y-4">
                        {selectedEmployee && (
                            <Alert color="blue">
                                <Typography variant="small">
                                    <strong>Empleado a migrar:</strong><br />
                                    {selectedEmployee.nombre_completo}<br />
                                    Código COTEL: {selectedEmployee.codigocotel}
                                </Typography>
                            </Alert>
                        )}

                        <Alert color="orange">
                            <Typography variant="small">
                                <strong>Información importante:</strong><br />
                                • La contraseña inicial será el código COTEL del empleado<br />
                                • El empleado deberá cambiar su contraseña en el primer login<br />
                                • Se creará un usuario con los datos del empleado
                            </Typography>
                        </Alert>

                        <input type="hidden" {...register('empleado_persona')} />

                        <Controller
                            name="rol_id"
                            control={control}
                            rules={{ required: 'El rol es obligatorio' }}
                            render={({ field }) => (
                                <Select
                                    label="Rol a asignar *"
                                    value={field.value}
                                    onChange={(value) => field.onChange(value)}
                                    error={!!errors.rol_id}
                                >
                                    {roles.map((role) => (
                                        <Option key={role.id} value={role.id.toString()}>
                                            <div className="flex items-center justify-between w-full">
                                                <span>{role.nombre}</span>
                                                <Chip size="sm" variant="ghost" value={`${role.cantidad_permisos} permisos`} />
                                            </div>
                                        </Option>
                                    ))}
                                </Select>
                            )}
                        />

                        {errors.rol_id && (
                            <Alert color="red">
                                {errors.rol_id.message}
                            </Alert>
                        )}
                    </DialogBody>
                    <DialogFooter className="space-x-2">
                        <Button
                            variant="text"
                            color="gray"
                            onClick={() => {
                                setShowMigrateDialog(false);
                                setSelectedEmployee(null);
                                reset();
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            color="orange"
                            loading={loading}
                            className="flex items-center gap-2"
                        >
                            <IoPersonAdd className="h-4 w-4" />
                            Migrar Empleado
                        </Button>
                    </DialogFooter>
                </form>
            </Dialog>
        </div>
    );
};

export default EmployeeMigration;