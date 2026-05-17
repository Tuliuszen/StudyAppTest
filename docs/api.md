# StudyApp API (MVP)

## Materials

Bazowy prefix aplikacji: `/api`.

### `POST /api/materials/upload`

Upload materiału PDF (MVP: payload jako base64).

#### Request body

```json
{
  "fileName": "biology-notes.pdf",
  "mimeType": "application/pdf",
  "contentBase64": "JVBERi0xLjc..."
}
```

#### Response `200`

```json
{
  "data": {
    "id": "mat_xxx",
    "fileName": "biology-notes.pdf",
    "mimeType": "application/pdf",
    "uploadedAt": "2026-05-17T12:00:00.000Z",
    "status": "queued",
    "totalSections": 0
  }
}
```

### `GET /api/materials`

Lista materiałów.

#### Query params
- `status` (opcjonalnie): `queued | processing | ready | failed`

#### Response `200`

```json
{
  "data": [
    {
      "id": "mat_xxx",
      "fileName": "biology-notes.pdf",
      "mimeType": "application/pdf",
      "uploadedAt": "2026-05-17T12:00:00.000Z",
      "status": "ready",
      "totalSections": 12
    }
  ]
}
```

### `GET /api/materials/:materialId`

Pobranie pojedynczego materiału.

### `GET /api/materials/:materialId/sections`

Paginowana lista sekcji materiału.

#### Query params
- `page` (domyślnie `1`)
- `limit` (domyślnie `20`, max `100`)

#### Response `200`

```json
{
  "data": [
    {
      "id": "mat_xxx-section-1",
      "materialId": "mat_xxx",
      "order": 1,
      "title": "biology-notes.pdf — Section 1",
      "content": "...",
      "sourcePageStart": 1,
      "sourcePageEnd": 1,
      "estimatedDifficulty": "medium"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 12
  }
}
```
