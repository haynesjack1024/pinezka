
# Board backend

Django backend for a classified advertising website.

## Run Locally

Clone the project

```bash
  git clone https://gitlab.com/ug_at/frontend-development-II/24-25/labs/haynes-jack
```

Go to the project directory

```bash
  cd haynes-jack/board-backend
```

Install dependencies

```bash
  pip install -r requirements/base.txt
```

Active venv

```bash
  source venv/bin/activate
```

Make and run migrations

```bash
  python manage.py makemigrations
  python manage.py migrate
```

Start the server

```bash
  python manage.py runserver
```
