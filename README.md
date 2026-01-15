# Mock Music App 🎵

A modern, responsive music playlist manager built with **Next.js 16**, **TypeScript**, and **Tailwind CSS**.

This project demonstrates a "Serverless Frontend" architecture. Instead of relying on a real backend API during development, it uses **MSW (Mock Service Worker)** to intercept network requests right in the browser. This allows for full CRUD functionality (Create, Read, Update, Delete) without spinning up a database.

## ✨ Features

* **Playlist Management**: Create, view, update, and delete custom playlists.
* **Song Library**: Add songs to specific playlists and remove them individually.
* **Dynamic Routing**: fast, client-side navigation between playlist details using Next.js App Router.
* **Mock Backend**: A complete REST API simulation running entirely in the browser via MSW.
* **Responsive UI**: Clean, modern interface styled with Tailwind CSS.

## 🛠️ Tech Stack

* **Framework**: [Next.js 16](https://nextjs.org/) (App Router + Turbopack)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Mocking**: [MSW (Mock Service Worker)](https://mswjs.io/)
* **Icons**: SVG Icons

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Clone the repository

```bash
git clone https://github.com/goldencorg/MockMusicApp.git
cd mock-music-app

```

### 2. Install Dependencies

```bash
npm install

```

### 3. Initialize MSW (Crucial Step)

If this is your first time running the project, generate the service worker file:

```bash
npx msw init public/ --save

```

### 4. Run the Development Server

```bash
npm run dev

```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser. You should see a green badge in the console confirming `[MSW] Mocking enabled`.

## 📂 Project Structure

```bash
src/
├── app/                  # Next.js App Router pages
│   ├── layout.tsx        # Main layout + MSW Provider
│   └── [playlistId]/     # Dynamic route for playlist details
├── components/           # React UI components (Sidebar, Playlist, Song)
├── mocks/                # MSW definitions
│   ├── browser.ts        # Worker setup
│   └── handlers.ts       # API Route definitions & Mock Data
├── types.ts              # TypeScript interfaces (SongType, PlaylistType)
└── lib/                  # Utilities

```

## 🔮 Future Roadmap

* [ ] **Persistence**: Save playlists to `localStorage` so data survives page reloads.
* [ ] **Lyrics Integration**: Connect the Lyrics component to a real lyrics API.
* [ ] **Drag & Drop**: Allow reordering of songs within a playlist.
* [ ] **Player Controls**: Add a functional audio player to preview 30s clips (via iTunes API).
* [ ] **Search**: Global search bar to filter songs and playlists.

## 🤝 Contributing

Contributions are welcome! If you have a suggestion that would make this better, please fork the repo and create a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
