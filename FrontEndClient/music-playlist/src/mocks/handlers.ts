import { http, HttpResponse } from 'msw'

// --- 1. Setup Mock Data ---

// Playlists (starts with your Heavy Metal & Jazz examples)
let playlists = [
  { playlistId: 1, playlistTitle: 'Heavy Metal', imageUrl: 'https://placehold.co/300x300/black/white?text=Metal' },
  { playlistId: 2, playlistTitle: 'Jazz Vibes', imageUrl: 'https://placehold.co/300x300/orange/white?text=Jazz' },
]

// Songs (Linked to playlists via playlistId)
let songs = [
  { songId: 101, songTitle: 'Enter Sandman', songAlbum: 'Metallica', songArtist: 'Metallica', songDuration: '5:31', playlistId: 1 },
  { songId: 102, songTitle: 'Master of Puppets', songAlbum: 'Master of Puppets', songArtist: 'Metallica', songDuration: '8:35', playlistId: 1 },
  { songId: 201, songTitle: 'Take Five', songAlbum: 'Time Out', songArtist: 'Dave Brubeck', songDuration: '5:24', playlistId: 2 },
]

export const handlers = [
  // --- Debug Handler ---
  // Logs requests to console so you can see if MSW is catching them
  http.all('/app/*', ({ request }) => {
    console.log(`[MSW] ${request.method} ${request.url}`)
    return undefined
  }),

  // ==========================================
  // PLAYLIST HANDLERS
  // ==========================================

  // 1. GET Playlists
  http.get('/app/users/1/playlists', () => {
    return HttpResponse.json(playlists)
  }),

  // 2. CREATE Playlist
  http.post('/app/users/1/playlists', async ({ request }) => {
    const body = await request.json() as any
    const newPlaylist = {
      playlistId: Date.now(),
      playlistTitle: body.playlistTitle,
      imageUrl: body.imageUrl || ''
    }
    playlists.push(newPlaylist)
    return HttpResponse.json(newPlaylist)
  }),

  // 3. DELETE Playlist
  http.delete('/app/users/1/playlists/:id', ({ params }) => {
    const id = Number(params.id)
    playlists = playlists.filter(p => p.playlistId !== id)
    // Also cleanup songs belonging to this playlist (optional but good practice)
    songs = songs.filter(s => s.playlistId !== id)
    return HttpResponse.json({ success: true })
  }),

  // 4. UPDATE Playlist
  http.put('/app/users/1/playlists/:id', async ({ params, request }) => {
    const id = Number(params.id)
    const updates = await request.json() as any
    playlists = playlists.map(p => p.playlistId === id ? { ...p, ...updates } : p)
    return HttpResponse.json({ ...updates, playlistId: id })
  }),

  // ==========================================
  // SONG HANDLERS
  // ==========================================

  // 5. GET Songs for a Playlist
  http.get('/app/users/1/playlists/:id/songs', ({ params }) => {
    const id = Number(params.id)
    const playlistSongs = songs.filter(s => s.playlistId === id)
    return HttpResponse.json(playlistSongs)
  }),

  // 6. ADD Song to Playlist
  http.post('/app/users/1/playlists/:id/songs/create', async ({ params, request }) => {
    const id = Number(params.id) // The playlist ID
    const body = await request.json() as any
    
    const newSong = {
      songId: Date.now(), // Generate a random ID
      playlistId: id,
      songTitle: body.songTitle,
      songAlbum: body.songAlbum,
      songArtist: body.songArtist,
      songDuration: body.songDuration
    }
    
    songs.push(newSong)
    
    // Return the updated list of songs for this playlist so the UI updates
    const updatedList = songs.filter(s => s.playlistId === id)
    return HttpResponse.json({ songs: updatedList })
  }),

  // 7. DELETE Song from Playlist
  http.delete('/app/users/1/playlists/:pid/songs/:sid', ({ params }) => {
    const sid = Number(params.sid) // Song ID
    const pid = Number(params.pid) // Playlist ID
    
    songs = songs.filter(s => s.songId !== sid)
    
    // Return the updated list
    const updatedList = songs.filter(s => s.playlistId === pid)
    return HttpResponse.json({ songs: updatedList })
  })
]