# DSAtrail — DSA Visualizer (MERN)

A full MERN app for learning data structures & algorithms through synced,
step-by-step animations. Ships today with **Bubble Sort** fully implemented
and built so that adding the next algorithm (Selection Sort, Binary Search,
BFS, ...) is a small, contained change.

## What's inside

- **Home page** — hero + "Start your DSA journey" entry point
- **Topics page** — pick a category (Sorting, Searching, Trees, Graphs, DP),
  then an algorithm. Anything not yet built shows as a "Coming soon" card.
- **Bubble Sort page** — plain-English explanation → interactive array
  visualizer (play / pause / step / scrub / speed) → Java code panel that
  highlights the exact line executing for the current step → time & space
  complexity table.
- **Auth** — signup/login (JWT), so progress is tied to a real account.
- **Dashboard** — shows which algorithms you've run and completed.

## Tech stack

- **Frontend:** React 18 + Vite, React Router, Tailwind CSS, Framer Motion
- **Backend:** Node.js + Express, MongoDB + Mongoose, JWT auth, bcrypt

## Project structure

```
dsa-visualizer/
├── client/                      # React app
│   └── src/
│       ├── algorithms/
│       │   ├── registry.js      # <-- single source of truth for all algorithms
│       │   └── bubbleSort.js    # step-generator + Java code for Bubble Sort
│       ├── components/
│       │   └── visualizer/      # ArrayVisualizer, PlaybackControls, CodePanel
│       ├── context/AuthContext.jsx
│       ├── pages/                # Home, Topics, AlgorithmPage, Login, Signup, Dashboard
│       └── api/axios.js
└── server/                       # Express API
    ├── models/                   # User.js, Progress.js
    ├── routes/                   # auth.js, progress.js
    ├── middleware/auth.js
    └── server.js
```

## Getting started

### Prerequisites
- Node.js 18+
- A MongoDB instance — either local (`mongod`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Backend

```bash
cd server
cp .env.example .env     # then edit MONGO_URI / JWT_SECRET if needed
npm install
npm run dev               # nodemon on http://localhost:5000
```

### 2. Frontend

```bash
cd client
cp .env.example .env      # VITE_API_URL should point at your server
npm install
npm run dev                # http://localhost:5173
```

Open `http://localhost:5173`, click **Start your DSA journey → Sorting →
Bubble Sort**.

## How progress tracking works

- `POST /api/progress/run` — logged the first time a user presses Play or
  Next on an algorithm in a session.
- `POST /api/progress/complete` — logged automatically once the visualizer
  reaches its final "done" step.
- Both are upserts keyed on `(user, algorithmSlug)`, so no schema change is
  needed when new algorithms are added — they just start using a new slug.

## Adding a new algorithm (this is the scalable part)

1. Create `client/src/algorithms/<name>.js` exporting:
   - `generateSteps(inputArray)` → returns an array of step objects
     (`{ type, array, compareIndices, sortedIndices, line, description }`)
   - a Java code string for the algorithm
2. Register it in `client/src/algorithms/registry.js`:
   ```js
   {
     slug: "selection-sort",
     name: "Selection Sort",
     category: "sorting",
     implemented: true,
     summary: "...",
     explanation: ["...", "..."],
     complexity: { time: { best: "O(n\u00b2)", average: "O(n\u00b2)", worst: "O(n\u00b2)" }, space: "O(1)", stable: false, inPlace: true },
     complexityNotes: "...",
     javaCode: selectionSortJavaCode,
     generateSteps: generateSelectionSortSteps,
     defaultArray: [64, 25, 12, 22, 11],
   }
   ```
3. Done. The Topics grid, routing (`/topics/:category/:slug`), the
   visualizer, playback controls, code panel, and progress tracking all pick
   it up automatically — nothing else in the app needs to change.

The `ArrayVisualizer` component is generic (it just renders whatever
`array` / `compareIndices` / `sortedIndices` a step provides), so it works
for any algorithm that operates on an array, and can be extended later with
alternate visualizers (tree, graph) for other categories.
