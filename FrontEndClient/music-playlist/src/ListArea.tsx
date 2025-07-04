import Song from './Song'
import { SongType } from './types'

type ListAreaProps = {
    songs: Array<SongType>
    deleteSong: (id:number) => void
}

export default function ListArea({songs, deleteSong}: ListAreaProps) {
    return (
        <div className='pt-3'>
            { songs.map( song => <Song key={song.songId} song={song} deleteSong= {deleteSong}/>)}
        </div>
    )
}