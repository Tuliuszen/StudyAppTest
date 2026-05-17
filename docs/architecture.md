# StudyApp Architecture (MVP)

## Aktualny zakres MVP: Materials

Wdrożono pierwszy działający pion backendowy dla modułu `materials`:

- `MaterialsController` — endpointy upload/list/details/sections,
- `MaterialsService` — in-memory lifecycle materiału,
- `PdfParserService` — MVP ekstrakcji i chunkingu treści,
- DTO z walidacją (`class-validator`, `class-transformer`),
- typy domenowe (`Material`, `MaterialSection`, `MaterialStatus`).

## Przepływ danych

1. Użytkownik wysyła `POST /api/materials/upload` z PDF jako `base64`.
2. System tworzy rekord materiału ze statusem `queued`.
3. Asynchroniczne przetwarzanie zmienia status na `processing`.
4. Parser tworzy sekcje i oznacza trudność (`easy/medium/hard`).
5. Po sukcesie status przechodzi na `ready`; przy błędzie na `failed`.

## Ograniczenia MVP

- Brak trwałej persystencji (in-memory zamiast PostgreSQL/Prisma).
- Brak realnej kolejki BullMQ/Redis (fire-and-forget w serwisie).
- Parser PDF ma charakter uproszczony i nie używa jeszcze `pdfjs-dist`.
- Upload wykorzystuje JSON/base64 zamiast multipart.

## Następne kroki (po MVP)

- Persistencja `materials` i `sections` w PostgreSQL przez Prisma,
- queue processing przez BullMQ,
- właściwa ekstrakcja PDF przez `pdfjs-dist` (+ opcjonalny OCR fallback),
- storage plików i checksumy,
- endpoint multipart upload z limitami i walidacją rozmiaru.
