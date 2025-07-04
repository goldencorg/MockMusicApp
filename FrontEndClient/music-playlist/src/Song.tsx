import { SongType } from "./types"

type SongProps = {
    song: SongType
    deleteSong: (id: number) => void
}
export default function Song({deleteSong, song}: SongProps) {
    return (
        <div className="border-bottom d-flex justify-content-between">
            <div style={{maxWidth:'50%'}}>
                <div className="fs-4">{song.songTitle}</div>
                <div className="fs-6">{song.songAlbum} - {song.songArtist}</div>
            </div>
            <div className="align-self-center">
                <span style={{paddingRight:10}}>{song.songDuration}</span><button className="btn btn-dark" type="button" onClick={() => deleteSong(song.songId)}>Remove</button>
            </div>
        </div>
    )
}