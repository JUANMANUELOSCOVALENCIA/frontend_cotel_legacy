// src/core/permissions/pages/EmployeeMigration/MigrationComponents.jsx
import React from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    Typography,
    Button,
    Input,
    Select,
    Option,
    Progress,
    IconButton,
    Chip,
    Checkbox
} from '@material-tailwind/react';
import {
    IoSearch,
    IoRefresh,
    IoPersonAdd,
    IoPeople,
    IoCheckmarkCircle,
    IoStatsChart
} from 'react-icons/io5';

const MigrationComponents = ({
                                 employees,
                                 statistics,
                                 loading,
                                 pagination,
                                 currentPage,
                                 filters,
                                 selectedEmployees,
                                 roles,
                                 onPageChange,
                                 onFilterChange,
                                 onSearch,
                                 onSelectEmployee,
                                 onSelectAll,
                                 onMigrateSingle,
                                 onMigrateBulk,
                                 onRefresh
                             }) => {

    // ========== COMPONENTE ESTADÍSTICAS ==========

    const StatisticsCards = () => {
        if (!statistics) return null;

        return (
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
        );
    };

    // ========== COMPONENTE FILTROS Y ACCIONES MASIVAS ==========

    const SearchAndActions = () => (
        <Card>
            <CardBody className="p-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="flex-1 max-w-md">
                        <Input
                            label="Buscar empleados"
                            icon={<IoSearch />}
                            value={filters.search}
                            onChange={(e) => onSearch(e.target.value)}
                            placeholder="Nombre, apellido o código COTEL"
                        />
                    </div>

                    {selectedEmployees.length > 0 && (
                        <div className="flex items-center gap-2">
                            <Chip
                                variant="ghost"
                                color="blue"
                                size="sm"
                                value={`${selectedEmployees.length} seleccionados`}
                            />
                            <Select
                                label="Migrar con rol"
                                onChange={(value) => onMigrateBulk(value)}
                                disabled={loading}
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
    );

    // ========== COMPONENTE TABLA DE EMPLEADOS ==========

    const EmployeesTable = () => (
        <Card>
            <CardHeader floated={false} shadow={false} className="rounded-none">
                <div className="flex items-center justify-between">
                    <Typography variant="h6" color="blue-gray">
                        Empleados Disponibles ({pagination.count || 0})
                    </Typography>

                    <div className="flex items-center gap-2">
                        <IconButton variant="text" onClick={onRefresh} disabled={loading}>
                            <IoRefresh className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
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
                                    onChange={(e) => onSelectAll(e.target.checked)}
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
                            <EmployeeRow key={employee.persona} employee={employee} />
                        ))}
                        </tbody>
                    </table>
                )}
            </CardBody>
        </Card>
    );

    // ========== COMPONENTE FILA DE EMPLEADO ==========

    const EmployeeRow = ({ employee }) => (
        <tr className="hover:bg-gray-50">
            <td className="p-4">
                <Checkbox
                    checked={selectedEmployees.includes(employee.persona)}
                    onChange={(e) => onSelectEmployee(employee.persona, e.target.checked)}
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
                    onClick={() => onMigrateSingle(employee)}
                    disabled={!employee.puede_migrar}
                >
                    <IoPersonAdd className="h-4 w-4" />
                    Migrar
                </Button>
            </td>
        </tr>
    );

    // ========== COMPONENTE PAGINACIÓN ==========

    const PaginationControls = () => {
        if (pagination.count <= 20) return null;

        return (
            <div className="flex items-center justify-between">
                <Typography variant="small" color="gray">
                    Mostrando {employees.length} de {pagination.count} empleados
                </Typography>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outlined"
                        size="sm"
                        disabled={!pagination.previous}
                        onClick={() => onPageChange(currentPage - 1)}
                    >
                        Anterior
                    </Button>
                    <Button
                        variant="outlined"
                        size="sm"
                        disabled={!pagination.next}
                        onClick={() => onPageChange(currentPage + 1)}
                    >
                        Siguiente
                    </Button>
                </div>
            </div>
        );
    };

    // ========== RENDER PRINCIPAL ==========

    return (
        <>
            <StatisticsCards />
            <SearchAndActions />
            <EmployeesTable />
            <PaginationControls />
        </>
    );
};

export default MigrationComponents;