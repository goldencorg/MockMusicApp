import pencil from './assets/pencil.svg'
import { useEffect, useState } from 'react'
import { Modal, ModalBody, ModalHeader, ModalTitle } from 'react-bootstrap'
import { PlaylistType } from './types';

export default function SelectedPlaylist({playlist, updatedSpecificPlaylist} : {
        playlist ?: {playlistId:number, playlistTitle:string, imageUrl: string}
        updatedSpecificPlaylist: (updatedPlaylist: PlaylistType) => void;
    }) {
    if (!playlist) {
        return <div className='self-align-center'>
            <h5 className='text-center'>Playlist loading... </h5><br></br>
            If not results are presented, please choose/create another playlist.
        </div>;
    }
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);

    const handlePlaylistModalClose = () => setIsPlaylistModalOpen(false);
    const openPlaylistModal = () => setIsPlaylistModalOpen(true);

    const [updatedPlaylistInput, setUpdatedPlaylistInput] = useState(playlist.playlistTitle);
    const [updatedPlaylist, setUpdatedPlaylist] = useState(playlist.playlistTitle);
    const [updatedImageInput, setUpdatedImageInput] = useState(playlist.imageUrl);

    useEffect(() => {
        setUpdatedPlaylist(playlist.playlistTitle);
        setUpdatedPlaylistInput(playlist.playlistTitle);
        setUpdatedImageInput(playlist.imageUrl);
    }, [playlist]);

    const handleTitleChange = (newName:string) => {
        setUpdatedPlaylistInput(newName);
    };
    const handleImageChange = (newUrl: string) => {
        setUpdatedImageInput(newUrl);
    }

    const updatePlaylist = async (event: React.FormEvent, id:number) => {
        event.preventDefault();
        const updatedPlaylist = {
            playlistId: id,
            playlistTitle: updatedPlaylistInput,
            imageUrl: updatedImageInput
        };

        const response = await fetch(`/app/users/1/playlists/${id}`, {
            method: "PUT",
            body: JSON.stringify(updatedPlaylist),
            headers: { "Content-Type": "application/json" }
        });
        const data = await response.json();
        updatedSpecificPlaylist(data);
        handlePlaylistModalClose();
    }
    return (
        <div>
            <div className="d-flex flex-row">
                <div>
                    <img className='ratio ratio-1x1' style={{height: 300, width: 300, borderRadius: 15}} src={updatedImageInput || "https://tinyurl.com/defaultplaylistimage"}></img>
                </div>
                <div className='align-self-center' style={{paddingLeft: '5vw', overflow: 'hidden'}}>
                    <div>
                        <div>
                            <h1>{updatedPlaylist}<img onClick={openPlaylistModal} style={{maxWidth: '10%', paddingLeft: 5, cursor: 'pointer'}} alt='Edit' className='align-self-center' src={pencil}></img></h1>
                        </div>
                    </div>
                    <div className='d-flex flex-wrap'>
                        <div style={{paddingBottom:5, paddingRight:5}}>
                            <button style={{width:100}} className='btn btn-lg btn-dark' type='button'>Play</button>
                        </div>
                        <div style={{paddingBottom:5, paddingRight:5}}>
                            <button style={{width:100}} className='btn btn-lg btn-dark' type='button'>Shuffle</button>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={isPlaylistModalOpen} onHide={handlePlaylistModalClose}>
                <ModalHeader closeButton>
                    <ModalTitle>Update Playlist</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <form onSubmit= {(e) => updatePlaylist(e, playlist.playlistId)}>
                        <div className='form-group'>
                            <label>Playlist Title</label>
                            <input style={{width:'100%'}} className='form-control' type='text' value={updatedPlaylistInput} onChange={(e) => handleTitleChange(e.target.value)} ></input>
                        </div>
                        <div className='form-group'>
                            <label>Playlist Image</label>
                            <input style={{width:'100%'}} className='form-control' type='text' value={updatedImageInput} onChange={(e) => handleImageChange(e.target.value)} ></input>
                        </div>
                        <div style={{paddingTop:5}} className='form-group'>
                            <button style={{float:'right'}} className='btn btn-lg btn-dark'>Update</button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </div>
    )
}