# 🏗️ Arquitectura del Sistema - Explicación Completa

## 📚 Índice
1. [Visión General](#visión-general)
2. [Capas de la Arquitectura](#capas-de-la-arquitectura)
3. [Repositorios](#repositorios)
4. [Servicios](#servicios)
5. [Controladores](#controladores)
6. [DTOs y Requests](#dtos-y-requests)
7. [Mappers](#mappers)
8. [Flujo Completo de una Petición](#flujo-completo-de-una-petición)
9. [Ejemplo Práctico: Crear un Paciente](#ejemplo-práctico-crear-un-paciente)

---

## 🎯 Visión General

Imagina que tu aplicación es como un **restaurante**:

- **Frontend (Cliente)**: El cliente que hace el pedido
- **Controller (Mesero)**: Recibe el pedido y lo lleva a la cocina
- **Service (Chef)**: Prepara el plato siguiendo las reglas
- **Repository (Almacén)**: Guarda y busca los ingredientes
- **Domain (Receta)**: Define cómo debe ser el plato

```
Cliente → Mesero → Chef → Almacén
(Frontend) → (Controller) → (Service) → (Repository)
```

---

## 📦 Capas de la Arquitectura

### 1. **Domain (Dominio)** - El Corazón del Negocio
**Ubicación**: `backend/src/main/java/org/example/domain/`

**¿Qué es?**: Contiene las **entidades del negocio** con sus reglas de validación.

**Ejemplo**: `Paciente.java`

```java
public class Paciente extends Persona {
    private Domicilio domicilio;  // OBLIGATORIO
    private Afiliacion afiliacion; // OPCIONAL
    
    // Constructor valida que el domicilio no sea null
    public Paciente(String cuil, String nombre, String apellido, Domicilio domicilio) {
        super(cuil, nombre, apellido);
        if (domicilio == null)
            throw DomainException.validation("El domicilio es obligatorio");
        this.domicilio = domicilio;
    }
}
```

**Características**:
- ✅ Contiene las **reglas de negocio** (validaciones)
- ✅ No sabe nada de bases de datos ni HTTP
- ✅ Es **puro Java**, sin dependencias de frameworks

---

### 2. **Repositorios (Interfaces)** - El Contrato
**Ubicación**: `backend/src/main/java/org/example/app/interfaces/`

**¿Qué es?**: Define **QUÉ** operaciones podemos hacer, pero NO **CÓMO**.

**Ejemplo**: `RepositorioPacientes.java`

```java
public interface RepositorioPacientes {
    void guardarPaciente(Paciente paciente);
    Optional<Paciente> buscarPacientePorCuil(String cuil);
    List<Paciente> listarTodos();
}
```

**¿Por qué una interfaz?**
- 🔄 Permite **cambiar la implementación** sin cambiar el código que la usa
- 🧪 Facilita hacer **tests** (puedes crear mocks)
- 📝 Es un **contrato**: "Quien implemente esto DEBE tener estos métodos"

---

### 3. **Repositorios en Memoria** - La Implementación
**Ubicación**: `backend/src/main/java/org/example/infrastructure/`

**¿Qué es?**: La **implementación concreta** del repositorio. Guarda datos en memoria (HashMap).

**Ejemplo**: `RepositorioPacientesEnMemoria.java`

```java
public class RepositorioPacientesEnMemoria implements RepositorioPacientes {
    // HashMap = diccionario en memoria (como un Map de JavaScript)
    private final Map<String, Paciente> pacientes = new HashMap<>();

    @Override
    public void guardarPaciente(Paciente paciente) {
        // Guarda en el HashMap usando el CUIL como clave
        pacientes.put(paciente.getCuil(), paciente);
    }

    @Override
    public Optional<Paciente> buscarPacientePorCuil(String cuil) {
        // Busca en el HashMap
        return Optional.ofNullable(pacientes.get(cuil));
    }

    @Override
    public List<Paciente> listarTodos() {
        // Convierte todos los valores del HashMap a una lista
        return new ArrayList<>(pacientes.values());
    }
}
```

**Diferencia con Repositorio "Común" (Base de Datos)**:

| Repositorio en Memoria | Repositorio con BD |
|------------------------|-------------------|
| Guarda en `HashMap` | Guarda en MySQL/PostgreSQL |
| Se pierde al reiniciar | Persiste permanentemente |
| Rápido para desarrollo | Más lento pero real |
| Para pruebas y prototipos | Para producción |

**En el futuro**, podrías crear:
```java
public class RepositorioPacientesBD implements RepositorioPacientes {
    // Usa JDBC o JPA para guardar en base de datos
    // El resto del código NO cambia porque usa la interfaz
}
```

---

### 4. **Servicios** - La Lógica de Negocio
**Ubicación**: `backend/src/main/java/org/example/app/`

**¿Qué es?**: Contiene la **lógica de negocio** y **orquesta** las operaciones.

**Ejemplo**: `AltaPacienteService.java`

```java
public class AltaPacienteService {
    private final RepositorioPacientes repoPacientes;
    private final RepositorioObrasSociales repoOS;

    // Inyección de dependencias: recibe los repositorios
    public AltaPacienteService(RepositorioPacientes repoPacientes, 
                               RepositorioObrasSociales repoOS) {
        this.repoPacientes = repoPacientes;
        this.repoOS = repoOS;
    }

    public Paciente registrarPaciente(...) {
        // 1. Crea el domicilio
        Domicilio domicilio = new Domicilio(calle, numero, localidad);
        
        // 2. Si NO tiene obra social, crea paciente simple
        if (isBlank(obraSocialCodigo)) {
            Paciente p = new Paciente(cuil, nombre, apellido, domicilio);
            repoPacientes.guardarPaciente(p);  // ← Guarda en repositorio
            return p;
        }
        
        // 3. Si TIENE obra social, valida que exista
        ObraSocial os = repoOS.buscarPorCodigo(obraSocialCodigo)
            .orElseThrow(() -> DomainException.validation("Obra social inexistente"));
        
        // 4. Crea paciente con afiliación
        Afiliacion afiliacion = new Afiliacion(os, numeroAfiliado);
        Paciente p = new Paciente(cuil, nombre, apellido, domicilio, afiliacion);
        repoPacientes.guardarPaciente(p);
        return p;
    }
}
```

**Responsabilidades del Servicio**:
- ✅ **Orquestar** operaciones (coordina varios repositorios)
- ✅ **Validar reglas de negocio** complejas
- ✅ **Transformar** datos si es necesario
- ❌ NO sabe de HTTP ni JSON

---

### 5. **Controladores** - La Puerta de Entrada
**Ubicación**: `backend/src/main/java/org/example/web/controller/`

**¿Qué es?**: Recibe peticiones HTTP y las convierte en llamadas a servicios.

**Ejemplo**: `PacienteController.java`

```java
@RestController  // ← Spring sabe que esto maneja HTTP
@RequestMapping("/api/pacientes")  // ← URL base
public class PacienteController {
    
    private final AltaPacienteService altaPacienteService;
    private final RepositorioPacientes repositorioPacientes;

    // POST /api/pacientes
    @PostMapping
    public ResponseEntity<?> crearPaciente(@RequestBody AltaPacienteRequest request) {
        try {
            // 1. Extrae datos del Request
            DomicilioDTO dom = request.getDomicilio();
            
            // 2. Llama al servicio (lógica de negocio)
            Paciente paciente = altaPacienteService.registrarPaciente(
                request.getCuil(),
                request.getNombre(),
                request.getApellido(),
                dom.getCalle(),
                dom.getNumero(),
                dom.getLocalidad(),
                request.getObraSocialCodigo(),
                request.getNumeroAfiliado()
            );
            
            // 3. Convierte Paciente (dominio) a PacienteDTO (para enviar)
            PacienteDTO dto = PacienteMapper.toDTO(paciente);
            
            // 4. Retorna respuesta HTTP
            return ResponseEntity.status(HttpStatus.CREATED).body(dto);
            
        } catch (DomainException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    
    // GET /api/pacientes
    @GetMapping
    public ResponseEntity<List<PacienteDTO>> listarPacientes() {
        // 1. Obtiene lista del servicio
        List<Paciente> pacientes = altaPacienteService.listarPacientes();
        
        // 2. Convierte cada Paciente a PacienteDTO
        List<PacienteDTO> dtos = pacientes.stream()
                .map(PacienteMapper::toDTO)
                .collect(Collectors.toList());
        
        // 3. Retorna lista
        return ResponseEntity.ok(dtos);
    }
}
```

**Responsabilidades del Controlador**:
- ✅ Recibir peticiones HTTP (GET, POST, PUT, DELETE)
- ✅ Convertir JSON a objetos Java (Request)
- ✅ Llamar al servicio apropiado
- ✅ Convertir objetos de dominio a DTOs
- ✅ Retornar respuestas HTTP (200, 400, 500, etc.)
- ❌ NO contiene lógica de negocio

---

### 6. **DTOs y Requests** - Los Mensajeros

#### **Request** - Lo que LLEGA del Cliente
**Ubicación**: `backend/src/main/java/org/example/web/dto/`

**¿Qué es?**: Representa los **datos que vienen del frontend** en una petición HTTP.

**Ejemplo**: `AltaPacienteRequest.java`

```java
public class AltaPacienteRequest {
    private String cuil;
    private String nombre;
    private String apellido;
    private DomicilioDTO domicilio;  // ← Objeto anidado
    private String obraSocialCodigo;
    private String numeroAfiliado;
    
    // Getters y Setters (Spring los usa automáticamente)
}
```

**JSON que llega del frontend**:
```json
{
  "cuil": "20-43336577-2",
  "nombre": "Santiago",
  "apellido": "Martín",
  "domicilio": {
    "calle": "Av. Libertador",
    "numero": 1234,
    "localidad": "San Miguel de Tucumán"
  },
  "obraSocialCodigo": "OSDE",
  "numeroAfiliado": "12345678"
}
```

#### **DTO (Data Transfer Object)** - Lo que SE ENVÍA al Cliente
**Ejemplo**: `PacienteDTO.java`

```java
public class PacienteDTO {
    private String cuil;
    private String nombre;
    private String apellido;
    private DomicilioDTO domicilio;
    private ObraSocialDTO obraSocial;  // ← Puede ser null
    
    // Getters y Setters
}
```

**JSON que se envía al frontend**:
```json
{
  "cuil": "20-43336577-2",
  "nombre": "Santiago",
  "apellido": "Martín",
  "domicilio": {
    "calle": "Av. Libertador",
    "numero": 1234,
    "localidad": "San Miguel de Tucumán"
  },
  "obraSocial": {
    "codigo": "OSDE",
    "nombre": "OSDE",
    "numeroAfiliado": "12345678"
  }
}
```

**¿Por qué DTOs y no usar directamente el objeto de dominio?**

| Usar Dominio Directo | Usar DTOs |
|---------------------|-----------|
| ❌ Expone toda la estructura interna | ✅ Solo expone lo necesario |
| ❌ Puede cambiar y romper el frontend | ✅ Controlas qué se expone |
| ❌ Puede tener referencias circulares | ✅ Estructura plana y simple |
| ❌ Acopla frontend y backend | ✅ Desacopla las capas |

**Ejemplo**: El `Paciente` del dominio tiene métodos internos que no queremos exponer:
```java
// En el dominio
public class Paciente {
    private Afiliacion afiliacion;  // ← Objeto complejo
    
    public Afiliacion getAfiliacion() { ... }  // ← No queremos exponer esto
}

// En el DTO
public class PacienteDTO {
    private ObraSocialDTO obraSocial;  // ← Solo lo que necesitamos
}
```

---

### 7. **Mappers** - Los Traductores
**Ubicación**: `backend/src/main/java/org/example/web/mapper/`

**¿Qué es?**: Convierte objetos de **Dominio** a **DTO** y viceversa.

**Ejemplo**: `PacienteMapper.java`

```java
public class PacienteMapper {
    // Convierte Paciente (dominio) → PacienteDTO (para enviar)
    public static PacienteDTO toDTO(Paciente paciente) {
        // 1. Convierte Domicilio → DomicilioDTO
        DomicilioDTO domicilioDTO = new DomicilioDTO(
            paciente.getDomicilio().getCalle(),
            paciente.getDomicilio().getNumero(),
            paciente.getDomicilio().getLocalidad()
        );

        // 2. Convierte Afiliacion → ObraSocialDTO (si existe)
        ObraSocialDTO obraSocialDTO = null;
        if (paciente.tieneAfiliacion()) {
            Afiliacion afil = paciente.getAfiliacion();
            obraSocialDTO = new ObraSocialDTO(
                afil.getObraSocial().getCodigo(),
                afil.getObraSocial().getNombre(),
                afil.getNumeroAfiliado()
            );
        }

        // 3. Crea y retorna el DTO
        return new PacienteDTO(
            paciente.getCuil(),
            paciente.getNombre(),
            paciente.getApellido(),
            domicilioDTO,
            obraSocialDTO
        );
    }
}
```

**¿Por qué Mappers?**
- 🔄 **Separación de responsabilidades**: El dominio no sabe de DTOs
- 🛡️ **Protección**: No expones la estructura interna del dominio
- 🔧 **Flexibilidad**: Puedes cambiar el DTO sin tocar el dominio

---

## 🔄 Flujo Completo de una Petición

### Ejemplo: Crear un Paciente

```
1. FRONTEND (React)
   ↓
   POST /api/pacientes
   Body: { "cuil": "20-12345678-9", "nombre": "Juan", ... }
   
2. CONTROLLER (PacienteController)
   ↓
   @PostMapping recibe AltaPacienteRequest
   Extrae: cuil, nombre, apellido, domicilio, etc.
   
3. SERVICE (AltaPacienteService)
   ↓
   registrarPaciente(...)
   - Valida reglas de negocio
   - Crea objetos de dominio (Domicilio, Paciente)
   - Llama a repositorios
   
4. REPOSITORY (RepositorioPacientesEnMemoria)
   ↓
   guardarPaciente(paciente)
   - Guarda en HashMap
   
5. VUELTA (Response)
   ↓
   Repository → Service → Controller
   Controller convierte Paciente → PacienteDTO (con Mapper)
   Retorna JSON al frontend
```

### Diagrama Visual:

```
┌─────────────┐
│  FRONTEND   │
│  (React)    │
└──────┬──────┘
       │ HTTP POST /api/pacientes
       │ JSON: { cuil, nombre, ... }
       ↓
┌──────────────────┐
│   CONTROLLER     │
│ PacienteController│
│                  │
│ 1. Recibe Request│
│ 2. Llama Service │
│ 3. Convierte DTO │
│ 4. Retorna HTTP  │
└──────┬───────────┘
       │
       ↓
┌──────────────────┐
│    SERVICE       │
│AltaPacienteService│
│                  │
│ 1. Valida reglas │
│ 2. Crea objetos  │
│ 3. Llama Repo    │
└──────┬───────────┘
       │
       ↓
┌──────────────────┐
│   REPOSITORY     │
│RepositorioPacientes│
│                  │
│ 1. Guarda en Map │
│ 2. Retorna objeto│
└──────────────────┘
```

---

## 📝 Ejemplo Práctico: Crear un Paciente

### Paso 1: Frontend envía petición
```typescript
// front/src/api/pacientes.ts
const payload = {
  cuil: "20-12345678-9",
  nombre: "Juan",
  apellido: "Pérez",
  domicilio: {
    calle: "Av. Libertador",
    numero: 1234,
    localidad: "San Miguel de Tucumán"
  },
  obraSocialCodigo: "OSDE",
  numeroAfiliado: "12345678"
};

await http.post("/pacientes", payload);
```

### Paso 2: Controller recibe y procesa
```java
// PacienteController.java
@PostMapping
public ResponseEntity<?> crearPaciente(@RequestBody AltaPacienteRequest request) {
    // request contiene los datos del JSON
    
    // Llama al servicio
    Paciente paciente = altaPacienteService.registrarPaciente(
        request.getCuil(),      // "20-12345678-9"
        request.getNombre(),    // "Juan"
        request.getApellido(),  // "Pérez"
        // ... más datos
    );
    
    // Convierte a DTO
    PacienteDTO dto = PacienteMapper.toDTO(paciente);
    
    // Retorna HTTP 201 (Created)
    return ResponseEntity.status(HttpStatus.CREATED).body(dto);
}
```

### Paso 3: Service ejecuta lógica de negocio
```java
// AltaPacienteService.java
public Paciente registrarPaciente(...) {
    // 1. Crea objeto de dominio
    Domicilio domicilio = new Domicilio(calle, numero, localidad);
    
    // 2. Valida obra social (si existe)
    ObraSocial os = repoOS.buscarPorCodigo(obraSocialCodigo)
        .orElseThrow(() -> DomainException.validation("Obra social inexistente"));
    
    // 3. Crea afiliación
    Afiliacion afiliacion = new Afiliacion(os, numeroAfiliado);
    
    // 4. Crea paciente (dominio valida que todo esté bien)
    Paciente p = new Paciente(cuil, nombre, apellido, domicilio, afiliacion);
    
    // 5. Guarda en repositorio
    repoPacientes.guardarPaciente(p);
    
    return p;
}
```

### Paso 4: Repository guarda
```java
// RepositorioPacientesEnMemoria.java
@Override
public void guardarPaciente(Paciente paciente) {
    // Guarda en HashMap: clave = CUIL, valor = Paciente
    pacientes.put(paciente.getCuil(), paciente);
    // Ahora está guardado en memoria
}
```

### Paso 5: Vuelta al frontend
```java
// Controller convierte y retorna
PacienteDTO dto = PacienteMapper.toDTO(paciente);
// Retorna JSON al frontend
```

---

## 🎓 Resumen para Alumnos

### Analogía del Restaurante:

1. **Cliente (Frontend)**: "Quiero una pizza"
2. **Mesero (Controller)**: Recibe el pedido, lo lleva a cocina
3. **Chef (Service)**: Prepara la pizza siguiendo la receta
4. **Almacén (Repository)**: Busca los ingredientes
5. **Receta (Domain)**: Define cómo debe ser la pizza

### Conceptos Clave:

| Concepto | ¿Qué es? | Ejemplo |
|----------|----------|---------|
| **Domain** | Reglas de negocio puras | `Paciente` con validaciones |
| **Repository Interface** | Contrato de operaciones | `RepositorioPacientes` |
| **Repository Implementación** | Cómo se guarda | `RepositorioPacientesEnMemoria` |
| **Service** | Lógica de negocio | `AltaPacienteService` |
| **Controller** | Puerta HTTP | `PacienteController` |
| **Request** | Datos que llegan | `AltaPacienteRequest` |
| **DTO** | Datos que se envían | `PacienteDTO` |
| **Mapper** | Convierte dominio ↔ DTO | `PacienteMapper` |

### Ventajas de esta Arquitectura:

✅ **Separación de responsabilidades**: Cada capa hace una cosa
✅ **Fácil de testear**: Puedes mockear repositorios
✅ **Fácil de cambiar**: Cambias BD sin tocar servicios
✅ **Reutilizable**: El mismo servicio puede usarse desde HTTP, consola, etc.
✅ **Mantenible**: Código organizado y claro

---

## 🔍 Comparación: Request vs DTO

### Request (Entrada)
```java
// Lo que RECIBES del cliente
AltaPacienteRequest {
    cuil, nombre, apellido,
    domicilio: { calle, numero, localidad },
    obraSocialCodigo,  // ← Solo el código
    numeroAfiliado
}
```

### DTO (Salida)
```java
// Lo que ENVÍAS al cliente
PacienteDTO {
    cuil, nombre, apellido,
    domicilio: { calle, numero, localidad },
    obraSocial: {  // ← Objeto completo
        codigo, nombre, numeroAfiliado
    }
}
```

**Diferencia clave**: El Request puede tener datos "planos" para crear, el DTO tiene objetos "completos" para mostrar.

---

## 🧪 Repositorio en Memoria vs Base de Datos

### En Memoria (Actual)
```java
Map<String, Paciente> pacientes = new HashMap<>();
pacientes.put(cuil, paciente);  // Guarda en RAM
// Se pierde al reiniciar
```

### Base de Datos (Futuro)
```java
// Usando JPA/Hibernate
@Repository
public class RepositorioPacientesBD implements RepositorioPacientes {
    @Autowired
    private EntityManager em;
    
    public void guardarPaciente(Paciente p) {
        em.persist(p);  // Guarda en MySQL/PostgreSQL
        // Persiste permanentemente
    }
}
```

**Lo importante**: El `Service` NO cambia porque usa la **interfaz**, no la implementación.

---

## 📚 Glosario Rápido

- **Domain**: Objetos del negocio con reglas
- **Repository**: Guarda y busca datos
- **Service**: Lógica de negocio
- **Controller**: Maneja HTTP
- **DTO**: Objeto para transferir datos
- **Request**: DTO de entrada
- **Mapper**: Convierte entre tipos
- **Interface**: Contrato sin implementación
- **Implementación**: Código real que hace el trabajo

---

¡Espero que esta explicación te ayude a enseñar a tus alumnos! 🎓


