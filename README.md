# esveo Agar.io clone

- Contains 3 packages:
  - apps/backend: Starts a WebSocketServer on port 3001 and broadcasts all incoming messages to ALL clients.
  - apps/frontend: Starts a webserver on port [http://localhost:3000](http://localhost:3000) that serves a simple html page with a script that connects to the WebSocketServer and sends a new message whenever someone clicks on the button in the UI.
  - libs/shared: Stuff that you want to share between frontend and backend.

## Commands

- in project root:
  - `npm run test`: Runs all tests of all projects and checks formatting and typescript
  - `npm run watch-tests`: Starts watch mode of unit tests over all projects
  - `npm run format`: Format all files of the project
- in backend:
  - `npm run dev`: Starts node in watch mode (with types stripped so that node can work with ts files)
  - `npm run test`: Runs TypeScript once
- in frontend:
  - `npm run dev`: Starts vite on port 3000
  - `npm run test`: Runs TypeScript once
