# Client

Frontend for the appointment-booking app. Hosts create availability windows and generate booking links; public visitors pick a date, choose a slot, and book.

## Setup

**Node.js:** 18+ (LTS recommended)

1. Install dependencies:

```bash
npm install
```

2. Start the client:

```bash
npm run dev
```

## Notes

- Ensure the server is running before testing booking flows.

## Tech Stack

- React + Vite
- API: Axios + TanStack Query
- UI: shadcn/ui + Tailwind CSS
