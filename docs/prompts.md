# AI Prompt Contracts (MVP)

W MVP `materials` AI nie jest jeszcze używane do generowania planu ani quizów.

Kontrakt obowiązujący dla kolejnych etapów:

- model musi używać wyłącznie dostarczonego kontekstu z PDF,
- każda odpowiedź musi zawierać odwołania `source_section_id`,
- odpowiedź modelu musi być walidowalna przez JSON schema,
- przy brakującym kontekście model zwraca `insufficient_context`.
