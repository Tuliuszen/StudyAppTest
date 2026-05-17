# Tworzy strukturę folderów + .gitkeep
$paths = @(
  "apps/web/src/app",
  "apps/web/src/components/ui",
  "apps/web/src/components/dashboard",
  "apps/web/src/components/modules",
  "apps/web/src/components/quiz",
  "apps/web/src/features/auth",
  "apps/web/src/features/materials",
  "apps/web/src/features/planner",
  "apps/web/src/features/quiz",
  "apps/web/src/features/progress",
  "apps/web/src/features/review",
  "apps/web/src/lib",
  "apps/web/src/pages",
  "apps/web/src/hooks",
  "apps/web/src/styles",

  "apps/api/src/common",
  "apps/api/src/config",
  "apps/api/src/modules/auth",
  "apps/api/src/modules/users",
  "apps/api/src/modules/materials",
  "apps/api/src/modules/topics",
  "apps/api/src/modules/planner",
  "apps/api/src/modules/quizzes",
  "apps/api/src/modules/progress",
  "apps/api/src/modules/ai",
  "apps/api/src/modules/jobs",
  "apps/api/src/prisma/migrations",

  "packages/shared-types",
  "packages/ui-tokens",

  "infra/docker",
  "infra/nginx",

  "docs"
)

foreach ($p in $paths) {
  New-Item -ItemType Directory -Path $p -Force | Out-Null
  New-Item -ItemType File -Path (Join-Path $p ".gitkeep") -Force | Out-Null
}

# Opcjonalnie: puste pliki główne backendu
$files = @(
  "apps/api/src/main.ts",
  "apps/api/src/app.module.ts",
  "apps/api/src/modules/materials/materials.controller.ts",
  "apps/api/src/modules/materials/materials.service.ts",
  "apps/api/src/modules/materials/pdf-parser.service.ts",
  "apps/api/src/modules/planner/planner.controller.ts",
  "apps/api/src/modules/planner/planner.service.ts",
  "apps/api/src/modules/planner/spaced-repetition.service.ts",
  "apps/api/src/modules/quizzes/quizzes.controller.ts",
  "apps/api/src/modules/quizzes/quizzes.service.ts",
  "apps/api/src/modules/quizzes/grading.service.ts",
  "apps/api/src/modules/ai/ai.service.ts",
  "apps/api/src/modules/ai/prompt-templates.ts",
  "apps/api/src/modules/jobs/jobs.processor.ts",
  "apps/api/src/modules/jobs/jobs.queue.ts",
  "apps/api/src/prisma/schema.prisma",
  "docs/architecture.md",
  "docs/api.md",
  "docs/prompts.md"
)

foreach ($f in $files) {
  $dir = Split-Path $f -Parent
  if ($dir) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  New-Item -ItemType File -Path $f -Force | Out-Null
}

Write-Host "✅ Struktura utworzona."