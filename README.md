# eFootball Tournament Manager

A full-stack tournament management platform for eFootball communities.

## Features

- JWT authentication
- Custom user and player profiles
- Tournament creation and registration
- Group draw engine with random, seeded, and balanced modes
- Automatic fixture generation
- Match result submission and standings calculation
- Knockout bracket support
- REST API with versioning
- Django Channels-ready architecture for future real-time updates
- React + Vite frontend (to be added)

## Backend Setup

1. Create a local copy of `.env.example` named `.env`.
2. Install Python dependencies:

   ```bash
   cd backend
   .\.venv\Scripts\python.exe -m pip install -r requirements.txt
   ```

3. Run migrations:

   ```bash
   .\.venv\Scripts\python.exe manage.py migrate
   ```

4. Start the backend server:

   ```bash
   .\.venv\Scripts\python.exe manage.py runserver
   ```

## Development Commands

- `backend\.venv\Scripts\python.exe manage.py runserver`
- `backend\.venv\Scripts\python.exe manage.py migrate`
- `backend\.venv\Scripts\python.exe manage.py test`

## Notes

- PostgreSQL is the intended production database.
- Use `DATABASE_URL` to configure a PostgreSQL connection in production.
