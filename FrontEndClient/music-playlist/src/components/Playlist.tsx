'use client'
import { useEffect, useState } from 'react'
import SelectedPlaylist from './SelectedPlaylist'
import ListArea from './ListArea'
import { PlaylistType, SongType } from '@/types'

export default function Playlist({ playlist, updatedSpecificPlaylist }: {
    playlist?: PlaylistType
    updatedSpecificPlaylist: (updatedPlaylist: PlaylistType) => void;
}) {
    const [songs, setSongList] = useState<SongType[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [form, setForm] = useState({ title: '', album: '', artist: '', duration: '' });

    useEffect(() => {
        if (!playlist) return;
        const fetchSongs = async () => {
            const res = await fetch(`/app/users/1/playlists/${playlist.playlistId}/songs`);
            if (res.ok) {
                const data = await res.json();
                setSongList(data);
            }
        }
        fetchSongs();
    }, [playlist]);

    if (!playlist) {
        return (
            <div className='flex flex-col items-center justify-center h-full text-gray-500'>
                <h5 className="text-xl font-bold">No playlist selected</h5>
                <p>Choose or create a playlist to view its details.</p>
            </div>
        );
    }

    const addSong = async (e: React.FormEvent) => {
        e.preventDefault();
        const newSong = {
            songTitle: form.title,
            songAlbum: form.album,
            songArtist: form.artist,
            songDuration: form.duration
        };
        
        const res = await fetch(`/app/users/1/playlists/${playlist.playlistId}/songs/create`, {
            method: "POST",
            body: JSON.stringify(newSong),
            headers: { "Content-Type": "application/json" }
        });
        
        const data = await res.json();
        setSongList(data.songs || []);
        setForm({ title: '', album: '', artist: '', duration: '' });
        setIsModalOpen(false);
    }

    const deleteSong = async (idToDelete: number) => {
        const res = await fetch(`/app/users/1/playlists/${playlist.playlistId}/songs/${idToDelete}`, {
            method: "DELETE"
        });
        const data = await res.json();
        setSongList(data.songs || []);
    }

    return (
        <div className='flex flex-col h-full p-8 overflow-y-auto'>
            <SelectedPlaylist updatedSpecificPlaylist={updatedSpecificPlaylist} playlist={playlist} />
            
            <button 
                type='button' 
                className='w-full py-2 mt-4 mb-4 border-2 border-dashed border-gray-300 text-gray-500 rounded hover:border-black hover:text-black transition' 
                onClick={() => setIsModalOpen(true)}
            >
                + Add Song
            </button>

            <ListArea songs={songs} deleteSong={deleteSong} />

            {}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                        <h3 className="text-lg font-bold mb-4">Add Song</h3>
                        <form onSubmit={addSong}>
                            <input className="w-full border p-2 mb-2 rounded" placeholder="Song Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
                            <input className="w-full border p-2 mb-2 rounded" placeholder="Album" value={form.album} onChange={e => setForm({...form, album: e.target.value})} />
                            <input className="w-full border p-2 mb-2 rounded" placeholder="Artist" value={form.artist} onChange={e => setForm({...form, artist: e.target.value})} />
                            <input className="w-full border p-2 mb-4 rounded" placeholder="Duration (e.g. 3:45)" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-500">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-black text-white rounded">Add</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}