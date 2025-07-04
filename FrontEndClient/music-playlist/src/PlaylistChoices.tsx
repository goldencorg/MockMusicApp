import { NavLink } from 'react-router'
import playlistImage from './assets/playlist.svg'
import type { PlaylistType } from './types'

type PlaylistChoicesProps = {
    playlist: PlaylistType
    deletePlaylist: (id: number) => void
}

export default function PlaylistChoices({playlist, deletePlaylist} : PlaylistChoicesProps) {
    return (
        <div>
            <div className="fs-4 d-flex justify-content-between">
                <div className='d-flex flex-row' style={{maxWidth: '80%', overflow: 'hidden'}}>
                    <div><img className='align-self-center' src={playlistImage} style={{paddingLeft: 15, height: 17, paddingRight: 5}}></img></div>
                    <div><NavLink style={{color: 'black', textDecoration: 'none'}} to={'/' + playlist.playlistId} >{playlist.playlistTitle}</NavLink></div>
                </div>
                <div className=''>
                    <button className="btn btn-sm text-muted float-right" type="button" onClick={() => deletePlaylist(playlist.playlistId)}>x</button>
                </div>
            </div>
        </div>
    )
}