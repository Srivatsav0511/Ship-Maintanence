

## What it does

- Lets you log in as different users (admin, inspector, engineer)
- You can add ships, components, and maintenance jobs
- There's a calendar, but it starts empty—click any date to see jobs for that day (they show up below the calendar, not inside it)
- You can see KPIs and get some notifications

## Tech Stuff

- React (JavaScript)
- Material-UI
- Vite (for running the app)
- React Router
- FullCalendar (for the calendar view)

## How to run it

You'll need Node.js and npm. Then:

```bash
git clone <repository-url>
cd ship-maintenance
npm install
npm run dev
```

Open your browser to the link it gives you (usually http://localhost:5173).

## Test Users

You can log in with any of these:

- **Admin:** admin@gmail.com / admin123
- **Inspector:** inspector@gmail.com / inspector123
- **Engineer:** engineer@gmail.com / engineer123

## Project Folders

```
src/
  components/   # UI bits
  pages/        # Main pages
  services/     # Fake API stuff
  context/      # React context
  hooks/        # Custom hooks
  utils/        # Helpers
  assets/       # Images, icons, etc
  styles/       # CSS/theme
  main.jsx      # App entry
```

## About the Calendar

The Calendar component provides a visual interface to view scheduled maintenance jobs on a calendar. It uses FullCalendar with Monthly and Weekly view toggles and integrates with the app’s job management service.

## Why I made this

Honestly, just for fun and to try out some libraries. If you want to use it or mess with it, go ahead!

## License

MIT. Do whatever you want with it.