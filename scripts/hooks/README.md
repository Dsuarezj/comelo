# Git Hooks

## Pre-push Hook

Este repositorio incluye un git hook pre-push que ejecuta automáticamente todos los tests antes de permitir push a la rama `main`.

### Instalación

Para instalar el hook, ejecuta:

```bash
npm run install-hooks
```

Este comando copiará el hook a `.git/hooks/pre-push` y le dará permisos de ejecución.

### Funcionamiento

Cuando intentes hacer push a la rama `main`, el hook:

1. Detecta que estás en `main`
2. Ejecuta `npm run test:all` (que incluye tests unitarios y e2e)
3. Si los tests fallan, aborta el push
4. Si los tests pasan, permite el push

### Bypass (solo en casos de emergencia)

Si necesitas hacer push sin ejecutar los tests, puedes usar:

```bash
git push --no-verify
```

**Nota:** Solo usa esto en casos excepcionales, los tests están ahí por una razón.

### Desinstalación

Para desinstalar el hook, simplemente elimina el archivo:

```bash
rm .git/hooks/pre-push
```
