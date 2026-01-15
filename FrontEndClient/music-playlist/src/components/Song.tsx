import { SongType } from "../types"

type SongProps = {
    song: SongType
    deleteSong: (id: number) => void
}

export default function Song({ deleteSong, song }: SongProps) {
    return (
        <div className="border-b flex justify-between items-center py-3 hover:bg-gray-50">
            <div className="max-w-[50%]">
                <div className="text-lg font-medium">{song.songTitle}</div>
                <div className="text-sm text-gray-500">{song.songAlbum} - {song.songArtist}</div>
            </div>
            <div className="flex items-center">
                <span className="pr-4 text-gray-600 font-mono text-sm">{song.songDuration}</span>
                <button 
                    className="bg-black text-white px-3 py-1 rounded text-sm hover:bg-gray-800 transition" 
                    type="button" 
                    onClick={() => deleteSong(song.songId)}
                >
                    Remove
                </button>
            </div>
        </div>
    )
}