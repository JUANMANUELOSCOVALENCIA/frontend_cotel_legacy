import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Navbar as MTNavbar,
    Collapse,
    Typography,
    Button,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
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
} from 'react-icons/io5';
import { useAuth, useUser, useLogout } from '../auth/hooks/useAuth';
import Permission from '../permissions/components/Permission';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const { isAuthenticated, requiresPasswordChange } = useAuth();
    const { user, fullName } = useUser();
    const { logout } = useLogout();

    const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    // Elementos de navegación
    const navItems = [
        {
            label: 'Dashboard',
            href: '/dashboard',
            icon: IoHome,
            permissions: []
        },
        {
            label: 'Usuarios',
            href: '/usuarios/usuarios',
            icon: IoPeople,
            permissions: [{ recurso: 'usuarios', accion: 'leer' }]
        },
        {
            label: 'Roles',
            href: '/usuarios/roles',
            icon: IoShieldCheckmark,
            permissions: [{ recurso: 'roles', accion: 'leer' }]
        },
        {
            label: 'Permisos',
            href: '/usuarios/permisos',
            icon: IoKey,
            permissions: [{ recurso: 'permisos', accion: 'leer' }]
        },
        {
            label: 'Auditoría',
            href: '/audit',
            icon: IoDocument,
            permissions: [{ recurso: 'logs', accion: 'leer' }]
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

    const NavList = () => (
        <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
            {navItems.map((item) => (
                <Permission key={item.href} permissions={item.permissions}>
                    <Typography
                        as="li"
                        variant="small"
                        color="blue-gray"
                        className="p-1 font-normal"
                    >
                        <Link
                            to={item.href}
                            className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                                location.pathname === item.href
                                    ? 'bg-orange-500 text-white'
                                    : 'text-blue-gray-700 hover:bg-orange-50 hover:text-orange-500'
                            }`}
                            onClick={() => setIsNavOpen(false)}
                        >
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.label}
                        </Link>
                    </Typography>
                </Permission>
            ))}
        </ul>
    );

    const ProfileMenu = () => (
        <Menu open={isProfileMenuOpen} handler={setIsProfileMenuOpen} placement="bottom-end">
            <MenuHandler>
                <Button
                    variant="text"
                    color="blue-gray"
                    className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
                >
                    <Avatar
                        variant="circular"
                        size="sm"
                        alt={fullName}
                        className="border border-orange-500 p-0.5"
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=f97316&color=fff`}
                    />
                    <span className="hidden lg:inline-block ml-1 font-medium text-sm">
            {user?.nombres}
          </span>
                    {requiresPasswordChange && (
                        <Chip
                            variant="ghost"
                            color="orange"
                            size="sm"
                            value="!"
                            className="rounded-full"
                        />
                    )}
                </Button>
            </MenuHandler>
            <MenuList className="p-1">
                <div className="px-3 py-2 border-b border-gray-200 mb-1">
                    <Typography variant="small" color="gray" className="font-normal">
                        {fullName}
                    </Typography>
                    <Typography variant="small" color="blue-gray" className="font-medium">
                        Código COTEL: {user?.codigocotel}
                    </Typography>
                    {user?.rol && (
                        <Typography variant="small" color="gray" className="font-normal">
                            {user.rol}
                        </Typography>
                    )}
                </div>

                {profileMenuItems.map((item, index) => (
                    <MenuItem
                        key={index}
                        onClick={() => {
                            setIsProfileMenuOpen(false);
                            navigate(item.href);
                        }}
                        className="flex items-center gap-2 rounded hover:bg-orange-50"
                    >
                        <item.icon className="h-4 w-4 text-orange-500" />
                        <Typography as="span" variant="small" className="font-normal">
                            {item.label}
                        </Typography>
                    </MenuItem>
                ))}

                <hr className="my-2 border-gray-200" />
                <MenuItem
                    onClick={() => {
                        setIsProfileMenuOpen(false);
                        handleLogout();
                    }}
                    className="flex items-center gap-2 rounded text-red-500 hover:bg-red-50"
                >
                    <IoPower className="h-4 w-4" />
                    <Typography as="span" variant="small" className="font-normal">
                        Cerrar Sesión
                    </Typography>
                </MenuItem>
            </MenuList>
        </Menu>
    );

    if (!isAuthenticated) {
        return null;
    }

    return (
        <MTNavbar className="sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4 border-b border-orange-100">
            <div className="flex items-center justify-between text-blue-gray-900">
                <Link to="/dashboard" className="flex items-center">
                    <Typography className="mr-4 ml-2 cursor-pointer py-1.5 font-bold text-xl text-orange-600">
                        Sistema COTEL
                    </Typography>
                </Link>

                <div className="flex items-center gap-4">
                    <div className="hidden lg:block">
                        <NavList />
                    </div>

                    <div className="flex items-center gap-2">
                        {requiresPasswordChange && (
                            <Chip
                                variant="gradient"
                                color="orange"
                                size="sm"
                                value="Cambio de contraseña requerido"
                                className="hidden lg:inline-flex"
                            />
                        )}
                        <ProfileMenu />
                    </div>

                    <IconButton
                        variant="text"
                        className="ml-auto h-6 w-6 text-inherit hover:bg-orange-50 focus:bg-orange-50 active:bg-orange-50 lg:hidden"
                        ripple={false}
                        onClick={toggleIsNavOpen}
                    >
                        {isNavOpen ? (
                            <IoClose className="h-6 w-6 text-orange-500" />
                        ) : (
                            <IoMenu className="h-6 w-6 text-orange-500" />
                        )}
                    </IconButton>
                </div>
            </div>

            <Collapse open={isNavOpen}>
                <NavList />
                {requiresPasswordChange && (
                    <div className="px-3 py-2">
                        <Chip
                            variant="gradient"
                            color="orange"
                            size="sm"
                            value="Cambio de contraseña requerido"
                            className="w-full"
                        />
                    </div>
                )}
            </Collapse>
        </MTNavbar>
    );
};

export default Navbar;