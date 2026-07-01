# SIGRH+ Frontend

Frontend del Sistema Integral de Gestion de Recursos Humanos con IA (SIGRH+). Este repositorio implementa la experiencia web del producto, incluyendo el portal publico de oportunidades laborales y el backoffice interno para operacion de RRHH.

## Contexto del producto

SIGRH+ es una plataforma orientada a automatizar y optimizar procesos clave de recursos humanos, con apoyo de inteligencia artificial para tareas como matching de CVs y validacion biometrica.

- Nombre del producto: `SIGRH+`
- Objetivo: automatizar reclutamiento, evaluacion y administracion de personal con apoyo de IA
- Periodo de desarrollo informado en la presentacion: del `21 de abril de 2025` al `23 de junio de 2025`
- Metodologia de trabajo: `Scrum`, organizado en 5 sprints

### Resumen de hitos

- Sprint 0: relevamiento funcional, definicion de alcance y backlog
- Sprint 1: maquetado inicial y validacion temprana de flujos
- Sprint 2: login, gestion de empleados, postulaciones y procesamiento de CVs
- Sprint 3: asistencia con reconocimiento facial, sueldos y roles
- Sprint 4: licencias, validaciones y pruebas finales
- Sprint 5: reporteria

La presentacion tambien menciona indicadores de avance, calidad y eficiencia. En el frontend actual se ven implementados los principales modulos operativos; algunas vistas de reportes todavia estan marcadas como trabajo en progreso.

## Stack verificado

Tecnologias y dependencias principales verificadas en el repositorio:

- `Next.js 15`
- `React 19`
- `Tailwind CSS 4`
- `axios`
- `face-api.js`
- `js-cookie`
- `react-toastify`
- `react-select`
- `xlsx`

## Superficies funcionales del frontend

El sistema expone dos experiencias principales:

### Portal publico

Visible en rutas como:

- `/`
- `/jobs`

Permite publicar convocatorias y postular candidatos desde una interfaz externa al backoffice.

### Backoffice interno

Visible bajo el prefijo:

- `/sigrh`

Incluye la operacion diaria del sistema de RRHH: empleados, convocatorias, asistencia, nomina, licencias, configuracion y otras vistas internas.

### Login y proteccion de rutas

El flujo de autenticacion visible incluye:

- pagina de login en `/login`
- proteccion de rutas internas mediante `src/middleware.js`
- uso de cookie/token para habilitar el acceso al backoffice

## Funcionalidades principales

Del analisis de rutas, componentes y menu lateral se verifican estas capacidades de negocio en la interfaz:

### Inicio y dashboard

- pantalla principal para usuarios internos bajo `/sigrh`
- metricas rapidas de empleados activos y convocatorias abiertas
- accesos directos a empleados, convocatorias, asistencia, nomina y portal publico

### Gestion de empleados

- listado de empleados
- vista de detalle por empleado
- alta y edicion de datos personales y laborales
- validaciones de formularios para nombre, DNI, edad minima, email, telefono, direccion y fechas
- asignacion de cargo, sector, turno, pais y provincia
- cambio de estado activo/inactivo
- cambio de password
- carga de foto del empleado
- carga y mantenimiento de documentos asociados
- carga y mantenimiento de historial laboral

### Biometria y reconocimiento facial

- generacion de descriptor facial a partir de la foto del empleado
- verificacion previa para evitar duplicar rostros entre empleados
- registro inicial del rostro
- actualizacion del rostro registrado
- pantallas especificas para fichada de ingreso y egreso por reconocimiento facial

### Estructura organizacional

- administracion de puestos de trabajo
- administracion de sectores
- administracion de turnos
- administracion de roles
- control de acceso por permisos para mostrar u ocultar modulos del sistema

### Convocatorias y seleccion

- listado de oportunidades laborales
- alta y edicion de convocatorias
- asociacion de tags o habilidades a cada convocatoria
- portal publico para visualizar vacantes
- flujo de postulacion guiado en varios pasos
- carga de datos personales del postulante
- seleccion de pais y provincia
- carga de CV en PDF
- validaciones de formato, tamano y duplicidad por email
- consulta de si una vacante aun admite nuevas postulaciones
- seguimiento de postulaciones y cambio de estado desde el backoffice
- consulta de resultados de matching para una convocatoria

### Asistencia

- resumen diario de asistencia por empleado
- busqueda por nombre, apellido y empleado
- filtro por fecha
- visualizacion de primera entrada, ultima salida y total de fichadas
- apertura de detalle de fichadas por empleado
- soporte para alta, edicion y eliminacion de eventos de asistencia desde el modal de detalle

### Nomina

- busqueda de empleado para liquidacion
- seleccion de rango de fechas
- consulta de horas liquidadas o a liquidar
- procesamiento de horas
- visualizacion de alertas sobre registros que requieren accion
- filtro para mostrar u ocultar registros archivados
- exportacion de planilla a Excel
- generacion de resumen por concepto y datos del empleado exportado
- modulo separado de aprobacion de nomina para registros pendientes de validacion

### Licencias

- solicitud de licencias personales
- seleccion del tipo de licencia
- ingreso de motivo
- seleccion de rango de fechas
- adjunto de justificativo en PDF cuando corresponde
- consulta de licencias propias
- filtros por estado
- administracion general de licencias para perfiles con permisos de aprobacion

### Ajustes y personalizacion

- formulario para nombre de empresa
- email y telefono de contacto
- carga de logo y favicon
- validaciones de tamano y dimensiones de imagen
- guardado de configuracion del sistema desde el frontend

### Reportes

- existen rutas para reportes de empleados, asistencia, licencias, convocatorias y reportes propios
- actualmente esas vistas renderizan una pantalla de trabajo en progreso

## Estructura de navegacion

La navegacion principal del backoffice se organiza desde el sidebar y contempla permisos por modulo. A nivel funcional, la estructura observada es:

- `Inicio`: dashboard con accesos rapidos y metricas
- `Empleados`: listado, puestos, sectores, turnos y roles
- `Convocatorias`: administracion de oportunidades y seguimiento de postulaciones
- `Asistencia`: fichadas y eventos relacionados
- `Nomina`: gestion de nomina y aprobaciones
- `Licencias`: carga de licencias propias y administracion general
- `Reportes`: varias rutas reservadas para reporteria
- `Ajustes`: personalizacion del sistema

No se listan componentes internos uno por uno para mantener el README enfocado en capacidades funcionales.

## Estado actual del frontend

El codigo visible refleja que el proyecto ya cubre una parte importante de la operacion diaria de RRHH, especialmente empleados, reclutamiento, asistencia, nomina, licencias y control de acceso. Tambien se observaron estos puntos parciales o a validar:

- las rutas de reportes existen, pero actualmente renderizan el componente `WorkInProgress`
- la seccion de ajustes tiene UI y llamadas a endpoints de configuracion
- la implementacion backend de esos endpoints no quedo verificada en el arbol inspeccionado del repositorio backend

## Instalacion y ejecucion local

### Requisitos

- `Node.js`
- `npm`

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd frontend-sigrh-g4
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

La variable operativa verificada es:

- `NEXT_PUBLIC_API_ROUTE`

Ejemplo observado en `.env.production`:

```env
NEXT_PUBLIC_API_ROUTE="http://localhost:8000"
```

Esta variable define la URL base contra la que el frontend consume la API.

### 4. Levantar el entorno de desarrollo

```bash
npm run dev
```

### 5. Build de produccion

```bash
npm run build
```

### 6. Ejecutar el build

```bash
npm run start
```

## Ejecucion con Docker

El repositorio incluye `docker-compose.yaml` con al menos estos servicios:

- `frontend`: publicado en `3000`
- `dev`: contenedor de desarrollo adicional, con puertos `3001` y `3002`

Flujo basico:

```bash
docker-compose build frontend
docker-compose up -d frontend
docker-compose logs frontend
docker-compose down
```

## Rutas y superficies documentadas

Principales rutas verificadas en el frontend:

- `/`
- `/jobs`
- `/login`
- `/face_recognition`
- `/face_recognition/in`
- `/face_recognition/out`
- `/sigrh`
- `/sigrh/employees`
- `/sigrh/jobs`
- `/sigrh/sectors`
- `/sigrh/shifts`
- `/sigrh/roles`
- `/sigrh/job_opportunities`
- `/sigrh/attendance`
- `/sigrh/payroll`
- `/sigrh/payroll_evaluation`
- `/sigrh/my_licenses`
- `/sigrh/licenses`
- `/sigrh/settings`
- `/sigrh/reports/*`

## Relacion con el backend

El frontend consume la API de SIGRH+ mediante `NEXT_PUBLIC_API_ROUTE`. Entre los grupos de integracion visibles en el codigo se encuentran:

- autenticacion
- empleados
- convocatorias y postulaciones
- matching de candidatos
- asistencia
- nomina
- licencias
- configuraciones del sistema
- reconocimiento facial
