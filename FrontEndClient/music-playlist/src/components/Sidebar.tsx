'use client'
import { useState } from 'react'
import AlternativeChoices from './AlternativeChoices'
import PlaylistChoices from './PlaylistChoices'
import { PlaylistType } from '@/types';

export default function Sidebar({ Playlists, addPlaylist, deletePlaylist }: {
    Playlists: PlaylistType[];
    addPlaylist: (titleName: string, imageUrl: string) => void;
    deletePlaylist: (id: number) => void;
}) {
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
    const [titleName, setTitleName] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const handleAddPlaylist = (event: React.FormEvent) => {
        event.preventDefault();
        addPlaylist(titleName, imageUrl);
        setTitleName('');
        setImageUrl('');
        setIsPlaylistModalOpen(false);
    }

    return (
        <div className='border-r p-4 flex flex-col w-64 h-full overflow-y-auto bg-white'>
            <div className="mb-4"><AlternativeChoices /></div>
            
            <div className="flex justify-between items-center mb-2">
                <h6 className="text-gray-500 font-bold">Playlists</h6>
                <button 
                    className='text-2xl leading-none text-gray-500 hover:text-black' 
                    onClick={() => setIsPlaylistModalOpen(true)}
                >
                    +
                </button>
            </div>
            
            <div className="space-y-1">
                {Playlists.map(playlist => (
                    <PlaylistChoices 
                        key={playlist.playlistId} 
                        playlist={playlist} 
                        deletePlaylist={deletePlaylist} 
                    />
                ))}
            </div>

            {}
            {isPlaylistModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                        <div className="flex justify-between mb-4">
                            <h3 className="text-lg font-bold">Custom Playlist</h3>
                            <button onClick={() => setIsPlaylistModalOpen(false)}>✕</button>
                        </div>
                        <form onSubmit={handleAddPlaylist}>
                            <div className='mb-3'>
                                <label className="block text-sm font-bold mb-1">Playlist Title</label>
                                <input 
                                    className='w-full border p-2 rounded' 
                                    type='text' 
                                    value={titleName} 
                                    onChange={(e) => setTitleName(e.target.value)} 
                                    required
                                />
                            </div>
                            <div className='mb-3'>
                                <label className="block text-sm font-bold mb-1">Playlist Image (URL)</label>
                                <input 
                                    className='w-full border p-2 rounded' 
                                    type='text' 
                                    value={imageUrl} 
                                    onChange={(e) => setImageUrl(e.target.value)} 
                                />
                            </div>
                            <button className='w-full bg-black text-white p-2 rounded hover:bg-gray-800'>
                                Add Playlist
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}