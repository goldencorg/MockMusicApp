'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { PlaylistType } from '../types';

export default function SelectedPlaylist({ playlist, updatedSpecificPlaylist }: {
    playlist?: { playlistId: number, playlistTitle: string, imageUrl: string }
    updatedSpecificPlaylist: (updatedPlaylist: PlaylistType) => void;
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updatedPlaylistInput, setUpdatedPlaylistInput] = useState('');
    const [updatedImageInput, setUpdatedImageInput] = useState('');

    useEffect(() => {
        if (playlist) {
            setUpdatedPlaylistInput(playlist.playlistTitle);
            setUpdatedImageInput(playlist.imageUrl);
        }
    }, [playlist]);

    if (!playlist) {
        return (
            <div className='flex flex-col items-center justify-center h-64 text-gray-500'>
                <h5 className='text-xl font-bold mb-2'>Playlist loading...</h5>
                <p>If no results are presented, please choose another playlist.</p>
            </div>
        );
    }

    const updatePlaylist = async (event: React.FormEvent) => {
        event.preventDefault();
        const updatedData = {
            playlistId: playlist.playlistId,
            playlistTitle: updatedPlaylistInput,
            imageUrl: updatedImageInput
        };

        const response = await fetch(`/app/users/1/playlists/${playlist.playlistId}`, {
            method: "PUT",
            body: JSON.stringify(updatedData),
            headers: { "Content-Type": "application/json" }
        });
        
        const data = await response.json();
        updatedSpecificPlaylist(data);
        setIsModalOpen(false);
    }

    return (
        <div>
            <div className="flex flex-row gap-8 mb-8">
                <div className="flex-shrink-0">
                    {/* Using standard img tag for user-provided URLs to avoid Next.js config complexity */}
                    <img 
                        className='w-[300px] h-[300px] object-cover rounded-xl shadow-lg' 
                        src={updatedImageInput || "https://placehold.co/300x300?text=No+Image"} 
                        alt="Playlist Cover"
                    />
                </div>
                
                <div className='flex flex-col justify-end overflow-hidden w-full'>
                    <div className="flex items-center gap-2 mb-6">
                        <h1 className="text-5xl font-bold truncate">{updatedPlaylistInput}</h1>
                        <button onClick={() => setIsModalOpen(true)} className="hover:opacity-70 transition">
                            <Image 
                                src="/icons/pencil.svg" 
                                alt='Edit' 
                                width={24} 
                                height={24} 
                            />
                        </button>
                    </div>
                    
                    <div className='flex gap-4'>
                        <button className='w-32 py-3 bg-black text-white rounded-full font-bold hover:scale-105 transition'>
                            Play
                        </button>
                        <button className='w-32 py-3 bg-gray-200 text-black rounded-full font-bold hover:bg-gray-300 transition'>
                            Shuffle
                        </button>
                    </div>
                </div>
            </div>

            {}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                        <div className="flex justify-between mb-4">
                            <h3 className="text-lg font-bold">Update Playlist</h3>
                            <button onClick={() => setIsModalOpen(false)}>✕</button>
                        </div>
                        <form onSubmit={updatePlaylist}>
                            <div className='mb-3'>
                                <label className="block text-sm font-bold mb-1">Playlist Title</label>
                                <input 
                                    className='w-full border p-2 rounded' 
                                    type='text' 
                                    value={updatedPlaylistInput} 
                                    onChange={(e) => setUpdatedPlaylistInput(e.target.value)} 
                                />
                            </div>
                            <div className='mb-4'>
                                <label className="block text-sm font-bold mb-1">Playlist Image URL</label>
                                <input 
                                    className='w-full border p-2 rounded' 
                                    type='text' 
                                    value={updatedImageInput} 
                                    onChange={(e) => setUpdatedImageInput(e.target.value)} 
                                />
                            </div>
                            <button className='w-full bg-black text-white p-2 rounded hover:bg-gray-800'>
                                Update
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}