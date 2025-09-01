# Temporal WEB UI, Temporal Workflow and CLI

## START TEMPORAL DOCKER COMPOSE

```bash
cd temporal-docker-compose
cp .env.example .env
docker-compose up -d
```

## TEMPORAL WORKFLOW

```bash
cp .env.example .env
cd temporal/
node worker.js
```

## WEB UI (http://localhost:8088)

_Make sure worker is running_

**WORKFLOW TYPE:**
`RunScriptWorkflow`

**INPUT:**

```json
{
  "task": "install",
  "pkg": "greet",
  "name": "Temporal"
}
```
