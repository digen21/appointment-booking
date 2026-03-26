# Server

Backend for the appointment-booking app. It exposes REST APIs for auth, availability creation, booking link generation, available dates/slots, and booking creation with validation and error handling.

## Setup

**Node.js:** 18+ (LTS recommended)

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file (use your existing env variables).

3. Start the server:

```bash
npm run dev
```

## Notes

- API base path: `/api`

## Tech Stack

- Express.js
- MongoDB (Mongoose)
- REST API
- Validation: Joi
- Error handling: centralized middleware
