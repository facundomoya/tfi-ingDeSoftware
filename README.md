# Patient Management System for Clinic

## Project Description
- **Objective:** Web application to manage clinic care flow: urgent admission registry, waiting list, patient claims by doctors, care registry, and discharges for patients, doctors and nurses.
- **Academic Context:** Final Integrating Project of Ingeniería de Software – UTN FRT.
- **Architecture:** Backend in Spring Boot (Java 21) + Frontend in React (Vite + TypeScript + Tailwind).

## Main Features
- **Urgent Admissions:**
  - Admission registry with `emergency level` and vital signs.
  - Waiting list sorted by priority (critical → emergency → urgent → minor urgent → non-urgent) and order of arrival for ties.
  - Endpoints to view pending admissions and all admissions.
- **Patient Claims (by doctors):**
  - Claim the next prioritized patient.
  - Check the patient currently under care.
- **Care Registry:**
  - Doctor registers the care report on an admission in process.
- **Discharges and Catalogs:**
  - Discharge and listing of `Patients`, `Doctors`, `Nurses`.
  - Listing of `Health Insurance Plans`.
- **Simplified Authentication:**
  - Frontend sends `X-User-Email` in each request (injected by interceptor).
  - Backend validates profile (`nurse` for urgent admissions, `doctor` for claims/care).
- **Active CORS:**
  - Configured for open development from the frontend.
- **BDD Tests:**
  - Cucumber describes scenarios of the urgent module (validations and priorities).

## Technologies Used
- **Backend:** Spring Boot 3.2, Java 21, Maven, Cucumber 7 (JUnit Platform), BCrypt.
- **Frontend:** React 19, Vite 7, TypeScript 5.9, Tailwind CSS v4, Axios, React Router, Lucide Icons, React Hot Toast.

## Project Structure
- **Backend:**
  - Main App: [backend/src/main/java/org/example/ClinicaApplication.java](backend/src/main/java/org/example/ClinicaApplication.java)
  - Configuration: [backend/src/main/resources/application.properties](backend/src/main/resources/application.properties), [backend/src/main/java/org/example/web/config/CorsConfig.java](backend/src/main/java/org/example/web/config/CorsConfig.java)
  - Controllers:
    - Patients: [backend/src/main/java/org/example/web/controller/PacienteController.java](backend/src/main/java/org/example/web/controller/PacienteController.java)
    - Doctors: [backend/src/main/java/org/example/web/controller/MedicoController.java](backend/src/main/java/org/example/web/controller/MedicoController.java)
    - Nurses: [backend/src/main/java/org/example/web/controller/EnfermeraController.java](backend/src/main/java/org/example/web/controller/EnfermeraController.java)
    - Health Insurance Plans: [backend/src/main/java/org/example/web/controller/ObraSocialController.java](backend/src/main/java/org/example/web/controller/ObraSocialController.java)
    - Urgent Admissions: [backend/src/main/java/org/example/web/controller/UrgenciasController.java](backend/src/main/java/org/example/web/controller/UrgenciasController.java)
    - Claims: [backend/src/main/java/org/example/web/controller/ReclamoController.java](backend/src/main/java/org/example/web/controller/ReclamoController.java)
    - Care Registry: [backend/src/main/java/org/example/web/controller/AtencionController.java](backend/src/main/java/org/example/web/controller/AtencionController.java), [backend/src/main/java/org/example/web/controller/AtencionesController.java](backend/src/main/java/org/example/web/controller/AtencionesController.java)
  - BDD Tests: [backend/src/test/resources/features/moduloUrgencias.feature](backend/src/test/resources/features/moduloUrgencias.feature)
  - Dependencies: [backend/pom.xml](backend/pom.xml)
- **Frontend:**
  - Vite Configuration: [front/vite.config.ts](front/vite.config.ts)
  - HTTP Client and APIs: [front/src/api/http.ts](front/src/api/http.ts), [front/src/api/pacientes.ts](front/src/api/pacientes.ts), [front/src/api/medicos.ts](front/src/api/medicos.ts), [front/src/api/enfermeras.ts](front/src/api/enfermeras.ts), [front/src/api/urgencia.ts](front/src/api/urgencia.ts), [front/src/api/reclamo.ts](front/src/api/reclamo.ts), [front/src/api/atenciones.ts](front/src/api/atenciones.ts)
  - Pages: [front/src/pages](front/src/pages)
  - Main Components: [front/src/components](front/src/components), [front/src/modal](front/src/modal)
  - Styles and Utilities: [front/src/index.css](front/src/index.css), [front/src/utils](front/src/utils)
- **Quick Execution Guide:** [EJECUTAR.md](EJECUTAR.md)

## File and Folder Description

### Backend
- **backend/pom.xml**: Maven dependency configuration and compilation of Spring Boot project.
- **backend/src/main/java/org/example/ClinicaApplication.java**: Main class that starts the Spring Boot application.
- **backend/src/main/java/org/example/web/controller/**: REST controllers for patients, doctors, nurses, urgent admissions, claims and care modules.
- **backend/src/main/java/org/example/web/config/**: CORS configuration, dependency injection and application settings.
- **backend/src/main/java/org/example/app/**: Application services (UrgentService, ClaimService, CareRegistryService, etc.).
- **backend/src/main/java/org/example/domain/**: Domain entities (Patient, Doctor, Nurse, Admission, Care, etc.).
- **backend/src/main/java/org/example/auth/**: Authentication module with BCrypt and user repository.
- **backend/src/main/java/org/example/infrastructure/**: In-memory repository implementations and infrastructure settings.
- **backend/src/main/resources/application.properties**: Configuration properties (port, application, etc.).
- **backend/src/test/java/**: Unit and integration tests with JUnit 5 and Mockito.
- **backend/src/test/java/mock/**: In-memory repository implementations for testing.
- **backend/src/test/java/org/example/steps/**: Cucumber steps for BDD tests.
- **backend/src/test/resources/features/**: Gherkin feature files for executable specifications (moduloUrgencias.feature).

### Frontend
- **front/vite.config.ts**: Vite configuration for development and build.
- **front/package.json**: npm dependencies and development scripts.
- **front/tsconfig.json**: TypeScript configuration.
- **front/tailwind.config.js**: Tailwind CSS configuration.
- **front/src/main.tsx**: React application entry point.
- **front/src/App.tsx**: Root component of the application.
- **front/src/api/http.ts**: Axios HTTP client configured with interceptors for authentication.
- **front/src/api/pacientes.ts, medicos.ts, enfermeras.ts, urgencia.ts, reclamo.ts, atenciones.ts**: Backend API calls.
- **front/src/pages/**: Main pages (Patient, Doctor, Nurse, Urgent, Claim, Care, Login).
- **front/src/components/**: Reusable components (Tables, Sidebar, Wait Timer).
- **front/src/modal/**: Discharge modals (PacienteModal, UrgenciaModal).
- **front/src/utils/**: Utilities for validation (CUIL) and date formatting.
- **front/src/hooks/**: Custom hooks for reusable logic.
- **front/src/routes/AppRouter.tsx**: React Router configuration.
- **front/src/index.css, App.css**: Global application styles.
- **front/public/**: Static files (favicon, etc.).

### Root
- **README.md**: This file with general project documentation.

## Backend API
- **Base:** `http://localhost:8080/api` (configurable in frontend via `VITE_API_URL`).
- **Main Routes:**
  - `GET /obras-sociales` → List health insurance plans.
  - `GET /pacientes` · `POST /pacientes` → Listing and discharge.
  - `GET /medicos` · `POST /medicos` → Listing and discharge.
  - `GET /enfermeras` · `POST /enfermeras` → Listing and discharge.
  - `POST /urgencias` → Register admission (requires `X-User-Email` from a `nurse`).
  - `GET /urgencias/lista-espera` → Sorted waiting list.
  - `GET /urgencias/ingresos` → All registered admissions.
  - `POST /reclamo` → Doctor claims next patient (requires `X-User-Email`).
  - `GET /reclamo/actual` → Patient currently under doctor care.
  - `POST /atencion` → Register care on admission in process (requires `X-User-Email`).

## Models and DTOs (functional summary)
- **Urgent Admission:** `patientCuil`, `report`, `emergencyLevel`, vital signs (temperature, heart/respiratory rate, systolic/diastolic pressure).
- **AdmissionDTO:** patient data + emergency level + admission date + (nursesCuil).
- **CareDTO:** patient + doctor + report + date + emergency level.
- **PatientDischargeRequest:** personal data, address and health insurance (optional).

## Functional Foundation (Urgent Admissions)
- **Priority:** Patients are sorted by `emergency level` (highest to lowest) and, in case of a tie, by `order of arrival`.
- **Validations:** Mandatory vital signs and valid ranges (e.g.: no negatives), documented in [moduloUrgencias.feature](backend/src/test/resources/features/moduloUrgencias.feature).
- **Flow:** Nurse admits → patient enters list → doctor claims → doctor cares → care registered.

## How to Run the Project
- **Backend (Spring Boot):**
  - From terminal on Windows:
    ```powershell
    cd backend
    mvn spring-boot:run
    ```
  - Verify: open `http://localhost:8080/api/obras-sociales`.
- **Frontend (React + Vite):**
  - From terminal on Windows:
    ```powershell
    cd front
    npm install
    npm run dev
    ```
  - Verify: open `http://localhost:5173`.
- **API Configuration on Frontend:**
  - By default uses `http://localhost:8080/api`.
  - To point to another URL, define `VITE_API_URL` (e.g.: `.env`):
    ```env
    VITE_API_URL=http://localhost:8080/api
    ```

## Testing

### Unit Tests
- **Framework:** JUnit 5 (Jupiter) integrated in Spring Boot.
- **Mocking:** Mockito for dependency simulation.
- **Mock Repositories:** In-memory implementations (`DBPacienteEnMemoria`, `DBMedicoEnMemoria`, `DBEnfermeraEnMemoria`, etc.) for tests without database.
- **Test Cases:**
  - Validation of entity creation (patients, doctors, nurses).
  - Correct prioritization in waiting list (by emergency level and order of arrival).
  - Validation of vital signs (ranges, mandatory).
  - Changes in admission status (pending → in process → completed).
- **Location:** [backend/src/test/java/org/example](backend/src/test/java/org/example)
- **Run unit tests:**
  ```powershell
  cd backend
  mvn test
  ```

### BDD Tests (Behavior-Driven Development)
- **Framework:** Cucumber 7 with JUnit Platform Engine.
- **Executable Specifications:** [backend/src/test/resources/features/moduloUrgencias.feature](backend/src/test/resources/features/moduloUrgencias.feature)
- **Steps (implementation):** [backend/src/test/java/org/example/steps](backend/src/test/java/org/example/steps)
- **Covered Scenarios:**
  - Admission of existing patient with valid data.
  - Validation of mandatory data (heart rate, respiratory rate, etc.).
  - Validation of ranges (rates and pressures non-negative).
  - Prioritization by emergency level (critical > emergency > urgent > minor urgent > non-urgent).
  - Order of arrival for patients with same emergency level.
- **Run BDD tests:**
  ```powershell
  cd backend
  mvn test -Dgroups=urgencias
  ```

### Testing Coverage
- **Mock Data:** Each test uses pre-loaded data in in-memory repositories to isolate logic from persistence.
- **CI/CD:** Tests run automatically with `mvn test` during build.
- **Reports:** Maven generates reports in `backend/target/surefire-reports/`.

## Project Status

Completed ✔️

## How to Clone the Repository
In a terminal, run:
  ```bash
  git clone https://github.com/facundomoya/patient-management.git
  ```
  Then:
  ```powershell
  cd patient-management
  ```

## Development Team

This project was developed by students of **Information Systems Engineering** from **Universidad Tecnológica Nacional - Facultad Regional Tucumán (UTN-FRT)** for the subject *"Ingeniería de Software"*. The developers of the project are:

- Facundo Moya - [Github](https://github.com/facundomoya)
- Juan Martín Bossi - [Github](https://github.com/JuanBossi)
- Santiago Joaquín Martín Peñaloza - [Github](https://github.com/santijj99)
- Ignacio David Sanchez Konicek - [Github](https://github.com/Ignacio159)
