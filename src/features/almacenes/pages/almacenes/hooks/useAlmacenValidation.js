// ======================================================
// src/features/almacenes/hooks/useAlmacenValidation.js
// Hook especializado para validaciones de almacenes
// ======================================================

import { useCallback, useMemo } from 'react';

export const useAlmacenValidation = ({ almacenes = [] }) => {

    // Reglas de validación
    const reglasValidacion = useMemo(() => ({
        codigo: {
            requerido: true,
            patron: /^[A-Z0-9-]+$/,
            longitudMin: 3,
            longitudMax: 20,
            unico: true
        },
        nombre: {
            requerido: true,
            longitudMin: 3,
            longitudMax: 100
        },
        tipo: {
            requerido: true,
            valoresPermitidos: ['CENTRAL', 'REGIONAL', 'LOCAL', 'TEMPORAL']
        },
        ciudad: {
            requerido: true,
            longitudMin: 2,
            longitudMax: 50
        },
        email: {
            patron: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
        },
        telefono: {
            patron: /^[\+]?[0-9\s\-\(\)]+$/
        },
        capacidad: {
            min: 1,
            max: 999999
        }
    }), []);

    // Validar campo individual
    const validarCampo = useCallback((campo, valor, almacenId = null) => {
        const reglas = reglasValidacion[campo];
        if (!reglas) return { valido: true };

        const errores = [];

        // Validación de requerido
        if (reglas.requerido && (!valor || valor.toString().trim() === '')) {
            errores.push(`${campo.charAt(0).toUpperCase() + campo.slice(1)} es obligatorio`);
            return { valido: false, errores };
        }

        // Si no hay valor y no es requerido, es válido
        if (!valor || valor.toString().trim() === '') {
            return { valido: true };
        }

        const valorStr = valor.toString().trim();

        // Validación de patrón
        if (reglas.patron && !reglas.patron.test(valorStr)) {
            switch (campo) {
                case 'codigo':
                    errores.push('El código solo puede contener letras mayúsculas, números y guiones');
                    break;
                case 'email':
                    errores.push('El formato del email es inválido');
                    break;
                case 'telefono':
                    errores.push('El formato del teléfono es inválido');
                    break;
                default:
                    errores.push(`Formato inválido para ${campo}`);
            }
        }

        // Validación de longitud
        if (reglas.longitudMin && valorStr.length < reglas.longitudMin) {
            errores.push(`${campo} debe tener al menos ${reglas.longitudMin} caracteres`);
        }

        if (reglas.longitudMax && valorStr.length > reglas.longitudMax) {
            errores.push(`${campo} no puede tener más de ${reglas.longitudMax} caracteres`);
        }

        // Validación de rango numérico
        const valorNumerico = parseFloat(valor);
        if (!isNaN(valorNumerico)) {
            if (reglas.min && valorNumerico < reglas.min) {
                errores.push(`${campo} debe ser mayor o igual a ${reglas.min}`);
            }
            if (reglas.max && valorNumerico > reglas.max) {
                errores.push(`${campo} no puede ser mayor a ${reglas.max}`);
            }
        }

        // Validación de valores permitidos
        if (reglas.valoresPermitidos && !reglas.valoresPermitidos.includes(valor)) {
            errores.push(`Valor no válido para ${campo}`);
        }

        // Validación de unicidad
        if (reglas.unico && campo === 'codigo') {
            const codigoExiste = almacenes.some(a =>
                a.codigo.toLowerCase() === valorStr.toLowerCase() && a.id !== almacenId
            );
            if (codigoExiste) {
                errores.push('Este código ya está en uso por otro almacén');
            }
        }

        return {
            valido: errores.length === 0,
            errores
        };
    }, [reglasValidacion, almacenes]);

    // Validar datos completos del almacén
    const validarDatosAlmacen = useCallback((datos, almacenId = null) => {
        const erroresValidacion = {};
        let formularioValido = true;

        // Validar cada campo
        Object.keys(reglasValidacion).forEach(campo => {
            const valor = datos[campo];
            const validacion = validarCampo(campo, valor, almacenId);

            if (!validacion.valido) {
                erroresValidacion[campo] = validacion.errores;
                formularioValido = false;
            }
        });

        // Validaciones de lógica de negocio
        const erroresNegocio = validarLogicaNegocio(datos, almacenId);
        if (erroresNegocio.length > 0) {
            erroresValidacion.negocio = erroresNegocio;
            formularioValido = false;
        }

        return {
            valido: formularioValido,
            errores: erroresValidacion,
            resumen: {
                totalErrores: Object.keys(erroresValidacion).length,
                camposConError: Object.keys(erroresValidacion)
            }
        };
    }, [reglasValidacion, validarCampo]);

    // Validaciones de lógica de negocio
    const validarLogicaNegocio = useCallback((datos, almacenId = null) => {
        const errores = [];

        // Un almacén temporal no puede ser principal
        if (datos.es_principal && datos.tipo === 'TEMPORAL') {
            errores.push('Un almacén temporal no puede ser marcado como principal');
        }

        // Solo puede haber un almacén principal por vez
        if (datos.es_principal) {
            const otroPrincipal = almacenes.find(a =>
                a.es_principal && a.id !== almacenId
            );
            if (otroPrincipal) {
                errores.push(`Ya existe un almacén principal: ${otroPrincipal.codigo} - ${otroPrincipal.nombre}`);
            }
        }

        // Validar capacidad vs materiales existentes
        if (datos.capacidad && almacenId) {
            const almacenExistente = almacenes.find(a => a.id === almacenId);
            if (almacenExistente && almacenExistente.total_materiales > datos.capacidad) {
                errores.push(`La capacidad no puede ser menor a los materiales actuales (${almacenExistente.total_materiales})`);
            }
        }

        return errores;
    }, [almacenes]);

    // Validar antes de eliminar
    const validarEliminacion = useCallback((almacen) => {
        const errores = [];
        const advertencias = [];

        if (!almacen) {
            errores.push('Almacén no encontrado');
            return { valido: false, errores, advertencias };
        }

        // No se puede eliminar el almacén principal
        if (almacen.es_principal) {
            errores.push('No se puede eliminar el almacén principal del sistema');
        }

        // No se puede eliminar si tiene materiales
        if (almacen.total_materiales > 0) {
            errores.push(`El almacén tiene ${almacen.total_materiales} materiales. Debe estar vacío para eliminarlo`);
        }

        // No se puede eliminar si tiene traspasos pendientes
        if (almacen.traspasos_pendientes > 0) {
            errores.push('El almacén tiene traspasos pendientes');
        }

        // No se puede eliminar si tiene movimientos recientes
        if (almacen.movimientos_recientes > 0) {
            advertencias.push('El almacén tiene movimientos recientes. Verifique el historial antes de eliminar');
        }

        // Advertencia si es el único de su tipo
        const almacenesMismoTipo = almacenes.filter(a => a.tipo === almacen.tipo && a.id !== almacen.id);
        if (almacenesMismoTipo.length === 0) {
            advertencias.push(`Este es el único almacén de tipo ${almacen.tipo} en el sistema`);
        }

        return {
            valido: errores.length === 0,
            errores,
            advertencias
        };
    }, [almacenes]);

    // Validar operación masiva
    const validarOperacionMasiva = useCallback((operacion, almacenesSeleccionados) => {
        const errores = [];
        const advertencias = [];

        if (!almacenesSeleccionados || almacenesSeleccionados.length === 0) {
            errores.push('No hay almacenes seleccionados');
            return { valido: false, errores, advertencias };
        }

        switch (operacion) {
            case 'activar':
                // No hay restricciones especiales para activar
                break;

            case 'desactivar':
                const principalesSeleccionados = almacenesSeleccionados.filter(a => a.es_principal);
                if (principalesSeleccionados.length > 0) {
                    errores.push('No se puede desactivar el almacén principal');
                }

                const conMateriales = almacenesSeleccionados.filter(a => a.total_materiales > 0);
                if (conMateriales.length > 0) {
                    errores.push(`${conMateriales.length} almacén(es) tienen materiales y no pueden desactivarse`);
                }
                break;

            case 'eliminar':
                almacenesSeleccionados.forEach(almacen => {
                    const validacion = validarEliminacion(almacen);
                    if (!validacion.valido) {
                        errores.push(`${almacen.codigo}: ${validacion.errores.join(', ')}`);
                    }
                    if (validacion.advertencias.length > 0) {
                        advertencias.push(`${almacen.codigo}: ${validacion.advertencias.join(', ')}`);
                    }
                });
                break;

            case 'cambiar_tipo':
                if (almacenesSeleccionados.some(a => a.es_principal)) {
                    advertencias.push('Cambiar el tipo del almacén principal puede afectar las operaciones del sistema');
                }
                break;

            default:
                errores.push(`Operación ${operacion} no válida`);
        }

        return {
            valido: errores.length === 0,
            errores,
            advertencias
        };
    }, [validarEliminacion]);

    // Generar sugerencias automáticas
    const generarSugerencias = useCallback((tipoCampo, valorActual = '', contexto = {}) => {
        switch (tipoCampo) {
            case 'codigo':
                return generarSugerenciasCodigo(valorActual, contexto.tipo);

            case 'nombre':
                return generarSugerenciasNombre(contexto.tipo, contexto.ciudad);

            case 'ciudad':
                return getCiudadesDisponibles();

            default:
                return [];
        }
    }, [almacenes]);

    // Generar sugerencias de código
    const generarSugerenciasCodigo = useCallback((prefijo = 'ALM', tipo = '') => {
        const prefijoCompleto = tipo ? `${prefijo}-${tipo.charAt(0)}` : prefijo;

        const codigosExistentes = almacenes
            .map(a => a.codigo)
            .filter(c => c.startsWith(prefijoCompleto + '-'))
            .map(c => {
                const numero = c.split('-').pop();
                return parseInt(numero) || 0;
            })
            .filter(n => !isNaN(n));

        const siguienteNumero = codigosExistentes.length > 0 ? Math.max(...codigosExistentes) + 1 : 1;

        return [
            `${prefijoCompleto}-${siguienteNumero.toString().padStart(3, '0')}`,
            `${prefijoCompleto}-${(siguienteNumero + 1).toString().padStart(3, '0')}`,
            `${prefijoCompleto}-${(siguienteNumero + 2).toString().padStart(3, '0')}`
        ];
    }, [almacenes]);

    // Generar sugerencias de nombre
    const generarSugerenciasNombre = useCallback((tipo, ciudad) => {
        const prefijos = {
            'CENTRAL': 'Almacén Central',
            'REGIONAL': 'Almacén Regional',
            'LOCAL': 'Almacén',
            'TEMPORAL': 'Almacén Temporal'
        };

        const prefijo = prefijos[tipo] || 'Almacén';

        if (!ciudad) {
            return [`${prefijo} Principal`, `${prefijo} Norte`, `${prefijo} Sur`];
        }

        return [
            `${prefijo} ${ciudad}`,
            `${prefijo} ${ciudad} Norte`,
            `${prefijo} ${ciudad} Sur`,
            `${prefijo} Principal ${ciudad}`,
            `${prefijo} ${ciudad} Centro`
        ];
    }, []);

    // Obtener ciudades disponibles
    const getCiudadesDisponibles = useCallback(() => {
        const ciudadesExistentes = [...new Set(almacenes.map(a => a.ciudad).filter(Boolean))];

        // Ciudades principales de Bolivia
        const ciudadesPrincipales = [
            'La Paz', 'Santa Cruz de la Sierra', 'Cochabamba', 'Oruro', 'Potosí',
            'Tarija', 'Sucre', 'Trinidad', 'Cobija', 'El Alto'
        ];

        // Combinar y eliminar duplicados
        const todasCiudades = [...new Set([...ciudadesExistentes, ...ciudadesPrincipales])];

        return todasCiudades.sort();
    }, [almacenes]);

    // Validar coherencia de datos
    const validarCoherenciaDatos = useCallback((datos) => {
        const advertencias = [];

        // Verificar coherencia tipo-capacidad
        if (datos.tipo === 'CENTRAL' && datos.capacidad && datos.capacidad < 1000) {
            advertencias.push('Los almacenes centrales suelen tener capacidad mayor a 1000 unidades');
        }

        if (datos.tipo === 'TEMPORAL' && datos.capacidad && datos.capacidad > 500) {
            advertencias.push('Los almacenes temporales suelen tener capacidad menor a 500 unidades');
        }

        // Verificar coherencia ubicación
        if (datos.tipo === 'CENTRAL' && datos.ciudad && !['La Paz', 'Santa Cruz de la Sierra', 'Cochabamba'].includes(datos.ciudad)) {
            advertencias.push('Los almacenes centrales suelen ubicarse en ciudades principales');
        }

        // Verificar si ya existe almacén del mismo tipo en la misma ciudad
        if (datos.tipo && datos.ciudad) {
            const almacenSimilar = almacenes.find(a =>
                a.tipo === datos.tipo &&
                a.ciudad === datos.ciudad &&
                a.id !== datos.id
            );

            if (almacenSimilar) {
                advertencias.push(`Ya existe un almacén ${datos.tipo.toLowerCase()} en ${datos.ciudad}: ${almacenSimilar.codigo}`);
            }
        }

        return advertencias;
    }, [almacenes]);

    // Validar antes de operaciones críticas
    const validarOperacionCritica = useCallback((operacion, almacen, parametros = {}) => {
        const errores = [];
        const advertencias = [];

        switch (operacion) {
            case 'cambiar_a_principal':
                if (almacen.tipo === 'TEMPORAL') {
                    errores.push('Un almacén temporal no puede ser principal');
                }

                const otroPrincipal = almacenes.find(a => a.es_principal && a.id !== almacen.id);
                if (otroPrincipal) {
                    advertencias.push(`Esto cambiará ${otroPrincipal.codigo} a almacén secundario`);
                }
                break;

            case 'cambiar_tipo':
                if (almacen.es_principal && parametros.nuevoTipo === 'TEMPORAL') {
                    errores.push('El almacén principal no puede cambiarse a tipo temporal');
                }

                if (parametros.nuevoTipo === 'CENTRAL' && almacen.total_materiales < 100) {
                    advertencias.push('Los almacenes centrales suelen tener mayor inventario');
                }
                break;

            case 'reducir_capacidad':
                if (parametros.nuevaCapacidad < almacen.total_materiales) {
                    errores.push('La nueva capacidad no puede ser menor a los materiales actuales');
                }
                break;

            case 'desactivar':
                if (almacen.es_principal) {
                    errores.push('No se puede desactivar el almacén principal');
                }

                if (almacen.total_materiales > 0) {
                    errores.push('No se puede desactivar un almacén que tiene materiales');
                }

                if (almacen.traspasos_pendientes > 0) {
                    errores.push('No se puede desactivar un almacén con traspasos pendientes');
                }
                break;

            default:
                break;
        }

        return {
            valido: errores.length === 0,
            errores,
            advertencias
        };
    }, [almacenes]);

    // Obtener reglas de validación para un campo específico
    const getReglasValidacion = useCallback((campo) => {
        return reglasValidacion[campo] || {};
    }, [reglasValidacion]);

    // Verificar si todos los campos requeridos están completos
    const verificarCamposCompletos = useCallback((datos) => {
        const camposRequeridos = Object.entries(reglasValidacion)
            .filter(([campo, reglas]) => reglas.requerido)
            .map(([campo]) => campo);

        const camposFaltantes = camposRequeridos.filter(campo =>
            !datos[campo] || datos[campo].toString().trim() === ''
        );

        return {
            completo: camposFaltantes.length === 0,
            camposFaltantes,
            porcentajeCompleto: Math.round(((camposRequeridos.length - camposFaltantes.length) / camposRequeridos.length) * 100)
        };
    }, [reglasValidacion]);

    // Validación en tiempo real
    const validarEnTiempoReal = useCallback((campo, valor, datosCompletos, almacenId = null) => {
        const validacionCampo = validarCampo(campo, valor, almacenId);
        const coherencia = validarCoherenciaDatos({ ...datosCompletos, [campo]: valor });

        return {
            ...validacionCampo,
            advertencias: coherencia
        };
    }, [validarCampo, validarCoherenciaDatos]);

    return {
        // Validaciones principales
        validarCampo,
        validarDatosAlmacen,
        validarLogicaNegocio,
        validarEliminacion,
        validarOperacionCritica,
        validarEnTiempoReal,

        // Validaciones de coherencia
        validarCoherenciaDatos,
        verificarCamposCompletos,

        // Sugerencias
        generarSugerencias,
        generarSugerenciasCodigo,
        generarSugerenciasNombre,
        getCiudadesDisponibles,

        // Utilidades
        getReglasValidacion,
        reglasValidacion
    };
};

export default useAlmacenValidation;