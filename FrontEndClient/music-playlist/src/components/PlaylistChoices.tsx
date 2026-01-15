'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import type { PlaylistType } from '@/types'

type PlaylistChoicesProps = {
    playlist: PlaylistType
    deletePlaylist: (id: number) => void
}

export default function PlaylistChoices({ playlist, deletePlaylist }: PlaylistChoicesProps) {
    const pathname = usePathname();
    const isActive = pathname === `/${playlist.playlistId}`;

    return (
        <div className={`flex justify-between items-center py-1 px-2 rounded ${isActive ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
            <div className='flex flex-row overflow-hidden max-w-[80%] items-center'>
                <div className="pl-2 pr-2">
                    <Image src="/icons/playlist.svg" alt="Playlist" width={17} height={17} />
                </div>
                <div>
                    <Link 
                        href={'/' + playlist.playlistId} 
                        className="text-black no-underline whitespace-nowrap"
                    >
                        {playlist.playlistTitle}
                    </Link>
                </div>
            </div>
            <button 
                className="text-gray-400 hover:text-red-500 font-bold text-sm" 
                type="button" 
                onClick={(e) => {
                    e.preventDefault();
                    deletePlaylist(playlist.playlistId);
                }}
            >
                ✕
            </button>
        </div>
    )
}