import SelectedPlaylist from './SelectedPlaylist'
import ListArea from './ListArea'
import { PlaylistType, SongType } from './types'
import { useEffect, useState } from 'react'
import { Modal, ModalBody, ModalHeader, ModalTitle } from 'react-bootstrap'

export default function Playlist({playlist, updatedSpecificPlaylist} : {

    playlist ?: {playlistId:number, playlistTitle:string, imageUrl: string}
    updatedSpecificPlaylist: (updatedPlaylist: PlaylistType) => void;
}){
    if (!playlist) {
        return (
            <div className='d-flex flex-column p-5 container-fluid col-xl-8' style={{height: '100vh', overflowY: 'auto'}}>
                <div className='text-center'>
                    <h5>No playlist selected</h5>
                    <p>Choose or create a playlist to view its details.</p>
                </div>
            </div>
        );
    }
    useEffect(() => {
        const asyncFunction = async () => {
            const response = await fetch(`/app/users/1/playlists/${playlist.playlistId}/songs`)
            const data = await response.json()
            setSongList(data)
        }
        asyncFunction()
    }, [playlist.playlistId]);
    const [Songs, setSongList] = useState<SongType[]>([])
    const [isSonglistModalOpen, setIsSonglistModalOpen] = useState(false);
    const [songTitle, setSongTitle] = useState('');
    const [albumTitle, setAlbumTitle] = useState('');
    const [artistName, setArtistName] = useState('');
    const [songLength, setSongLength] = useState('');

    const handleSonglistModalClose = () => setIsSonglistModalOpen(false);

    const openSonglistModal = () => setIsSonglistModalOpen(true);

    const handleSongInput = (newSong:string) => {
        setSongTitle(newSong);
    };
    const handleAlbumInput = (newAlbum:string) => {
        setAlbumTitle(newAlbum);
    };
    const handleArtistInput = (newArtist:string) => {
        setArtistName(newArtist);
    };
    const handleLengthInput = (newLength:string) => {
        setSongLength(newLength);
    };

    const addSong = async (event: React.FormEvent) => {
    event.preventDefault();
    const newSong = {
        songTitle: songTitle,
        songAlbum: albumTitle,
        songArtist: artistName,
        songDuration: songLength
    };
    const response = await fetch(`/app/users/1/playlists/${playlist.playlistId}/songs/create`, {
        method: "POST",
        body: JSON.stringify(newSong),
        headers: { "Content-Type": "application/json" }
    }).then(response => response.json());
    setSongList(response.songs);
    setSongTitle('');
    setAlbumTitle('');
    setArtistName('');
    setSongLength('');
}   
    const deleteSong = async ( idToDelete: number) => {
        const response = await fetch(`/app/users/1/playlists/${playlist.playlistId}/songs/${idToDelete}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        }).then(response => response.json());
            setSongList(response.songs)
    }

    return (
        <div className='d-flex flex-column p-5 container-fluid col-xl-8' style={{height: '100vh', overflowY: 'auto'}}>
            <div style={{paddingBottom: 10}}><SelectedPlaylist updatedSpecificPlaylist={updatedSpecificPlaylist} playlist={playlist}/></div>
            <button type='button' className='btn' style={{width: '100%'}} onClick={openSonglistModal}>+</button>
            <div><ListArea songs={Songs} deleteSong={deleteSong}/></div>
            <Modal show={isSonglistModalOpen} onHide={handleSonglistModalClose}>
                <ModalHeader closeButton>
                    <ModalTitle>Song Information</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <form onSubmit= {addSong}>
                        <div className='form-group'>
                            <label>Song Title</label>
                            <input style={{width:'100%'}} className='form-control' type='text' value={songTitle} onChange={(e) => handleSongInput(e.target.value)} ></input>
                        </div>
                        <div className='form-group'>
                            <label>Album Title</label>
                            <input style={{width:'100%'}} className='form-control' type='text' value={albumTitle} onChange={(e) => handleAlbumInput(e.target.value)} ></input>
                        </div>
                        <div className='form-group'>
                            <label>Artist</label>
                            <input style={{width:'100%'}} className='form-control' type='text' value={artistName} onChange={(e) => handleArtistInput(e.target.value)} ></input>
                        </div>
                        <div className='form-group'>
                            <label>Song Length</label>
                            <input style={{width:'100%'}} className='form-control' type='text' value={songLength} onChange={(e) => handleLengthInput(e.target.value)} ></input>
                        </div>
                        <div style={{paddingTop:5}} className='form-group'>
                            <button style={{float:'right'}} className='btn btn-lg btn-dark'>Add</button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </div>
    )
}
