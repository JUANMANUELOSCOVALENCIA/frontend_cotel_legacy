import React from 'react';
import { Typography, Card, CardBody } from '@material-tailwind/react';

const Users = () => {
    return (
        <div className="space-y-6">
            <Typography variant="h3" color="blue-gray">
                Gestión de Usuarios
            </Typography>
            <Card>
                <CardBody>
                    <Typography>
                        Módulo de gestión de usuarios en desarrollo...
                    </Typography>
                </CardBody>
            </Card>
        </div>
    );
};

export default Users;