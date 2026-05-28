# StackOps App

Ky projekt ka backend dhe frontend brenda te njejtit folder `StackOps-app`, duke perdorur App Router ne Next.js.

## Struktura

- `app/api/*/route.ts`: Backend API endpoints (Node.js runtime), p.sh. `app/api/tasks/route.ts`
- `lib/mongodb.ts`: Lidhja me MongoDB
- `app/page.tsx`: Frontend UI me Tailwind CSS

## Environment Variables

Krijo nje file `.env.local` ne root me keto vlera:

```bash
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.example.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=stackops
```

Pa `.env.local` me vlera te sakta, API do ktheje error sepse aplikacioni perdor vetem MongoDB.

## Nisja e projektit

```bash
npm install
npm run dev
```

Pastaj hape `http://localhost:3000`.

## API e gatshme

- `GET /api/tasks`: kthen listat e task-eve
- `POST /api/tasks`: krijon nje task te ri (`{ "title": "..." }`)
