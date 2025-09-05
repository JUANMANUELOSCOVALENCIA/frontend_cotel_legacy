import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Navbar as MTNavbar,
    Collapse,
    Typography,
    Button,
    Avatar,
    Chip,
    IconButton,
} from '@material-tailwind/react';
import {
    IoPersonCircle,
    IoSettings,
    IoPower,
    IoMenu,
    IoClose,
    IoShieldCheckmark,
    IoPeople,
    IoDocument,
    IoHome,
    IoKey,
    IoChevronDown,
    IoPersonAdd,
    IoStorefront,
    IoCloudUpload,
    IoArchive,
} from 'react-icons/io5';
import { useAuth, useUser, useLogout } from '../auth/hooks/useAuth';
import Permission from '../permissions/components/Permission';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isUsersMenuOpen, setIsUsersMenuOpen] = useState(false);
    const [isAlmacenesMenuOpen, setIsAlmacenesMenuOpen] = useState(false);

    const profileMenuRef = useRef(null);
    const usersMenuRef = useRef(null);
    const almacenesMenuRef = useRef(null);

    const { isAuthenticated, requiresPasswordChange } = useAuth();
    const { user, fullName } = useUser();
    const { logout } = useLogout();

    // Cerrar menús al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
            if (usersMenuRef.current && !usersMenuRef.current.contains(event.target)) {
                setIsUsersMenuOpen(false);
            }
            if (almacenesMenuRef.current && !almacenesMenuRef.current.contains(event.target)) {
                setIsAlmacenesMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    // Elementos de navegación principales
    const navItems = [
        {
            label: 'Dashboard',
            href: '/dashboard',
            icon: IoHome,
            permissions: [],
            type: 'link'
        },
        {
            label: 'Usuarios',
            icon: IoPeople,
            permissions: [{ recurso: 'usuarios', accion: 'leer' }],
            type: 'dropdown',
            submenu: [
                {
                    label: 'Gestión de Usuarios',
                    href: '/usuarios/usuarios',
                    icon: IoPeople,
                    permissions: [{ recurso: 'usuarios', accion: 'leer' }],
                    description: 'Administrar usuarios del sistema'
                },
                {
                    label: 'Roles',
                    href: '/usuarios/roles',
                    icon: IoShieldCheckmark,
                    permissions: [{ recurso: 'roles', accion: 'leer' }],
                    description: 'Gestionar roles y permisos'
                },
                {
                    label: 'Permisos',
                    href: '/usuarios/permisos',
                    icon: IoKey,
                    permissions: [{ recurso: 'permisos', accion: 'leer' }],
                    description: 'Configurar permisos granulares'
                },
                {
                    label: 'Migración',
                    href: '/usuarios/migracion',
                    icon: IoPersonAdd,
                    permissions: [{ recurso: 'empleados', accion: 'leer' }],
                    description: 'Migrar empleados desde FDW'
                }
            ]
        },
        {
            label: 'Almacenes',
            icon: IoStorefront,
            permissions: [{ recurso: 'almacenes', accion: 'leer' }],
            type: 'dropdown',
            submenu: [
                {
                    label: 'Gestión de Almacenes',
                    href: '/almacenes/gestion',
                    icon: IoArchive,
                    permissions: [{ recurso: 'almacenes', accion: 'leer' }],
                    description: 'Administrar inventario y almacenes'
                },
                {
                    label: 'Importar Equipos',
                    href: '/almacenes/importacion',
                    icon: IoCloudUpload,
                    permissions: [{ recurso: 'almacenes', accion: 'leer' }],
                    description: 'Importación masiva de equipos'
                }
            ]
        },
        {
            label: 'Auditoría',
            href: '/audit',
            icon: IoDocument,
            permissions: [{ recurso: 'logs', accion: 'leer' }],
            type: 'link'
        },
    ];

    // Elementos del menú de perfil
    const profileMenuItems = [
        {
            label: 'Mi Perfil',
            icon: IoPersonCircle,
            href: '/profile',
        },
        {
            label: 'Cambiar Contraseña',
            icon: IoKey,
            href: '/change-password',
        },
        {
            label: 'Configuración',
            icon: IoSettings,
            href: '/settings',
        },
    ];

    // Verificar si una ruta está activa (incluyendo subrutas)
    const isRouteActive = (href, submenu = null) => {
        if (href) {
            return location.pathname === href;
        }
        if (submenu) {
            return submenu.some(item => location.pathname === item.href);
        }
        return false;
    };

    // Función para manejar el dropdown de almacenes
    const handleAlmacenesDropdown = (itemLabel) => {
        if (itemLabel === 'Almacenes') {
            return {
                isOpen: isAlmacenesMenuOpen,
                setIsOpen: setIsAlmacenesMenuOpen,
                menuRef: almacenesMenuRef
            };
        } else if (itemLabel === 'Usuarios') {
            return {
                isOpen: isUsersMenuOpen,
                setIsOpen: setIsUsersMenuOpen,
                menuRef: usersMenuRef
            };
        }
        return null;
    };

    // Componente para elementos de navegación desktop
    const NavList = () => (
        <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
            {navItems.map((item) => {
                if (item.type === 'dropdown') {
                    const dropdownConfig = handleAlmacenesDropdown(item.label);

                    return (
                        <Permission key={item.label} permissions={item.permissions}>
                            <li className="p-1 relative" ref={dropdownConfig?.menuRef}>
                                <Button
                                    variant="text"
                                    onClick={() => dropdownConfig?.setIsOpen(!dropdownConfig?.isOpen)}
                                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 font-medium normal-case ${
                                        isRouteActive(null, item.submenu)
                                            ? 'bg-orange-500 text-white shadow-md border border-orange-600'
                                            : 'text-gray-700 bg-white border border-gray-200 hover:bg-orange-500 hover:text-white hover:border-orange-600 shadow-sm'
                                    }`}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.label}
                                    <IoChevronDown
                                        className={`h-4 w-4 transition-transform ${
                                            dropdownConfig?.isOpen ? 'rotate-180' : ''
                                        }`}
                                    />
                                </Button>

                                {dropdownConfig?.isOpen && (
                                    <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[280px] max-w-[320px] p-2">
                                        {item.submenu.map((subItem) => (
                                            <Permission key={subItem.href} permissions={subItem.permissions}>
                                                <button
                                                    onClick={() => {
                                                        dropdownConfig?.setIsOpen(false);
                                                        navigate(subItem.href);
                                                    }}
                                                    className={`w-full rounded-lg p-3 transition-all duration-200 text-left ${
                                                        location.pathname === subItem.href
                                                            ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-500'
                                                            : 'hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <subItem.icon className="h-5 w-5 text-orange-500 mt-0.5" />
                                                        <div>
                                                            <Typography variant="small" className="font-medium">
                                                                {subItem.label}
                                                            </Typography>
                                                            <Typography variant="small" color="gray" className="font-normal text-xs">
                                                                {subItem.description}
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </button>
                                            </Permission>
                                        ))}
                                    </div>
                                )}
                            </li>
                        </Permission>
                    );
                }

                return (
                    <Permission key={item.href} permissions={item.permissions}>
                        <Typography
                            as="li"
                            variant="small"
                            color="blue-gray"
                            className="p-1 font-normal"
                        >
                            <Link
                                to={item.href}
                                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                                    isRouteActive(item.href)
                                        ? 'bg-orange-500 text-white shadow-md border border-orange-600'
                                        : 'text-gray-700 bg-white border border-gray-200 hover:bg-orange-500 hover:text-white hover:border-orange-600 shadow-sm'
                                }`}
                                onClick={() => setIsNavOpen(false)}
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.label}
                            </Link>
                        </Typography>
                    </Permission>
                );
            })}
        </ul>
    );

    // Componente para navegación móvil
    const MobileNavList = () => (
        <div className="space-y-3">
            {navItems.map((item) => {
                if (item.type === 'dropdown') {
                    return (
                        <Permission key={item.label} permissions={item.permissions}>
                            <div>
                                <div className="flex items-center gap-2 px-3 py-2 text-gray-600 font-medium">
                                    <item.icon className="h-5 w-5 text-orange-500" />
                                    {item.label}
                                </div>
                                <div className="ml-4 space-y-1">
                                    {item.submenu.map((subItem) => (
                                        <Permission key={subItem.href} permissions={subItem.permissions}>
                                            <Link
                                                to={subItem.href}
                                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                                                    location.pathname === subItem.href
                                                        ? 'bg-orange-500 text-white'
                                                        : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                                                }`}
                                                onClick={() => setIsNavOpen(false)}
                                            >
                                                <subItem.icon className="h-4 w-4" />
                                                <div>
                                                    <Typography variant="small" className="font-medium">
                                                        {subItem.label}
                                                    </Typography>
                                                    <Typography variant="small" color="gray" className="text-xs">
                                                        {subItem.description}
                                                    </Typography>
                                                </div>
                                            </Link>
                                        </Permission>
                                    ))}
                                </div>
                            </div>
                        </Permission>
                    );
                }

                return (
                    <Permission key={item.href} permissions={item.permissions}>
                        <Link
                            to={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 font-medium ${
                                isRouteActive(item.href)
                                    ? 'bg-orange-500 text-white'
                                    : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                            }`}
                            onClick={() => setIsNavOpen(false)}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    </Permission>
                );
            })}
        </div>
    );

    const ProfileMenu = () => (
        <div className="relative" ref={profileMenuRef}>
            <Button
                variant="text"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 rounded-lg py-2 pr-3 pl-2 bg-white border border-gray-200 text-gray-700 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 shadow-sm"
            >
                <Avatar
                    variant="circular"
                    size="sm"
                    alt={fullName}
                    className="border-2 border-orange-500"
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=f97316&color=fff`}
                />
                <span className="hidden lg:inline-block font-medium text-sm">
                    {user?.nombres}
                </span>
                {requiresPasswordChange && (
                    <Chip
                        variant="filled"
                        color="orange"
                        size="sm"
                        value="!"
                        className="rounded-full bg-orange-600 text-white ml-1"
                    />
                )}
            </Button>

            {isProfileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[200px] max-w-[300px] p-2">
                    <div className="px-3 py-3 border-b border-gray-200 mb-2 bg-gray-50 rounded-lg">
                        <Typography variant="small" color="gray" className="font-normal text-gray-600">
                            {fullName}
                        </Typography>
                        <Typography variant="small" color="blue-gray" className="font-medium text-gray-800">
                            Código COTEL: {user?.codigocotel}
                        </Typography>
                        {user?.rol && (
                            <Typography variant="small" color="gray" className="font-normal text-gray-600">
                                {user.rol}
                            </Typography>
                        )}
                    </div>

                    {profileMenuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setIsProfileMenuOpen(false);
                                navigate(item.href);
                            }}
                            className="w-full flex items-center gap-3 rounded-lg hover:bg-orange-50 py-3 px-3 text-gray-700 hover:text-orange-600 transition-colors duration-200 text-left"
                        >
                            <item.icon className="h-5 w-5 text-orange-500" />
                            <Typography as="span" variant="small" className="font-medium">
                                {item.label}
                            </Typography>
                        </button>
                    ))}

                    <hr className="my-3 border-gray-200" />
                    <button
                        onClick={() => {
                            setIsProfileMenuOpen(false);
                            handleLogout();
                        }}
                        className="w-full flex items-center gap-3 rounded-lg text-red-600 hover:bg-red-50 py-3 px-3 transition-colors duration-200 text-left"
                    >
                        <IoPower className="h-5 w-5" />
                        <Typography as="span" variant="small" className="font-medium">
                            Cerrar Sesión
                        </Typography>
                    </button>
                </div>
            )}
        </div>
    );

    if (!isAuthenticated) {
        return null;
    }

    return (
        <MTNavbar className="sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-3 lg:px-8 lg:py-4 bg-white border-b-2 border-orange-200 shadow-md">
            <div className="flex items-center justify-between text-blue-gray-900">
                <Link to="/dashboard" className="flex items-center">
                    <Typography className="mr-4 ml-2 cursor-pointer py-1.5 font-bold text-xl text-orange-600 hover:text-orange-700 transition-colors duration-200">
                        COTEL R.L.
                    </Typography>
                </Link>

                <div className="flex items-center gap-4">
                    <div className="hidden lg:block">
                        <NavList />
                    </div>

                    <div className="flex items-center gap-3">
                        {requiresPasswordChange && (
                            <Chip
                                variant="filled"
                                color="orange"
                                size="sm"
                                value="Cambio de contraseña requerido"
                                className="hidden lg:inline-flex bg-orange-600 text-white font-medium"
                            />
                        )}
                        <ProfileMenu />
                    </div>

                    <IconButton
                        variant="outlined"
                        className="ml-auto h-10 w-10 border-2 border-orange-500 bg-white text-orange-500 hover:bg-orange-500 hover:text-white focus:bg-orange-500 focus:text-white active:bg-orange-600 lg:hidden transition-all duration-200"
                        ripple={false}
                        onClick={toggleIsNavOpen}
                    >
                        {isNavOpen ? (
                            <IoClose className="h-6 w-6" />
                        ) : (
                            <IoMenu className="h-6 w-6" />
                        )}
                    </IconButton>
                </div>
            </div>

            <Collapse open={isNavOpen}>
                <div className="bg-gray-50 rounded-lg p-4 mt-3">
                    <MobileNavList />
                    {requiresPasswordChange && (
                        <div className="px-3 py-2 mt-3">
                            <Chip
                                variant="filled"
                                color="orange"
                                size="sm"
                                value="Cambio de contraseña requerido"
                                className="w-full bg-orange-600 text-white font-medium"
                            />
                        </div>
                    )}
                </div>
            </Collapse>
        </MTNavbar>
    );
};

export default Navbar;