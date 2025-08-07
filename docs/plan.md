# TuneTON Microservices Restructuring Plan

## Notes
- The project must be refactored to follow the microservices architecture and environment requirements described in .windsurf/README.md and .windsurf/telegram-mini-app-tuneton-concept.md.
- User requires strict adherence to modular, containerized, and event-driven microservice best practices (see user global rules).
- Initial analysis of the codebase and directory structure has been completed.
- CHANGELOG.md and docker-compose.yml created for microservices orchestration.
- Began creation of base directory structure for microservices.
- Base directory structure for all microservices created using PowerShell script.
- Next steps: implement and scaffold API Gateway, then Auth Service, User Service, Track Service, Audio Processing Service, Playlist Service, Streaming Service in order of system operability.
- API Gateway scaffolding in progress: initializing config, package.json, and tsconfig.json.
- Express.js entrypoint, logger utility, .env.example, and core middleware (auth, validation, rate limiting) created for API Gateway.
- Basic tests (Jest + Supertest) and README scaffolding initiated for API Gateway.

## Task List
- [x] Review .windsurf/README.md for architecture requirements
- [x] Create memory for restructuring task
- [x] List and analyze current project root and src structure
- [x] Document current architecture and identify gaps with target architecture
- [x] Plan and document the new microservices structure (services, APIs, storage, orchestration)
- [x] Create docker-compose.yml for orchestrating services
- [x] Write and update change.log for all major steps
- [x] Create base directory structure for all microservices
- [ ] Refactor codebase to match modular microservices layout
  - [ ] Scaffold and implement API Gateway (Express.js, TypeScript, routing, validation)
    - [x] Create and configure package.json
    - [x] Create and configure tsconfig.json
    - [x] Set up Express.js entrypoint (src/index.ts)
    - [x] Implement basic routing and middleware
    - [x] Create basic tests (tests/app.test.ts)
    - [ ] Write and update README.md for API Gateway
  - [ ] Scaffold and implement Auth Service (Telegram OAuth, JWT, session management)
  - [ ] Scaffold and implement User Service (data model, profile management, DB integration)
  - [ ] Scaffold and implement Track Service (metadata schema, search, DB integration)
  - [ ] Scaffold and implement Audio Processing Service (pipeline, pitch/time, MQ integration)
  - [ ] Scaffold and implement Playlist Service (CRUD, integration)
  - [ ] Scaffold and implement Streaming Service (audio streaming, switching)
- [ ] Set up Docker and Kubernetes configs for each service
- [ ] Implement CI/CD pipeline skeletons
- [ ] Integrate Telegram OAuth authentication
- [ ] Implement asynchronous audio processing and messaging
- [ ] Set up monitoring, logging, and observability

## Current Goal
Finalize, test, and document API Gateway; prepare Auth Service scaffolding