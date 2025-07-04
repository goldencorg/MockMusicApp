import { useState } from 'react'
import AlternativeChoices from './AlternativeChoices'
import PlaylistChoices from './PlaylistChoices'
import { Modal, ModalBody, ModalHeader, ModalTitle } from 'react-bootstrap';
import { PlaylistType } from './types';

export default function Sidebar({Playlists, addPlaylist, deletePlaylist} : {
        Playlists: PlaylistType[]; 
        addPlaylist: (titleName: string, imageUrl: string) => void;
        deletePlaylist: (id: number) => void;
    }) {
    const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
    const [titleName, setTitleName] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const handlePlaylistModalClose = () => setIsPlaylistModalOpen(false);

    const openPlaylistModal = () => setIsPlaylistModalOpen(true);

    const handleTitleChange = (newName:string) => {
        setTitleName(newName);
    };

    const handleImageChange = (newUrl: string) => {
        setImageUrl(newUrl);
    }
    
    const handleAddPlaylist = (event: React.FormEvent) => {
        event.preventDefault();
        addPlaylist(titleName, imageUrl);
        setTitleName('');
        setImageUrl('');
        handlePlaylistModalClose();
    }

    return (
        <div className='border-end p-4 d-flex flex-column col-xl-2' style={{height: '100vh', overflowY: 'auto'}}>
            <div><AlternativeChoices /></div>
                <h6 className="text-muted">Playlists</h6>
                <button className='btn btn-sm' type='button' onClick={openPlaylistModal}>+</button>
            <div>{ Playlists.map( playlist => <PlaylistChoices key={playlist.playlistId} playlist={playlist} deletePlaylist={deletePlaylist}/>)}</div>
            <Modal show={isPlaylistModalOpen} onHide={handlePlaylistModalClose}>
                <ModalHeader closeButton>
                    <ModalTitle>Custom Playlist</ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <form onSubmit= {handleAddPlaylist}>
                        <div className='form-group'>
                            <label>Playlist Title</label>
                            <input style={{width:'100%'}} className='form-control' type='text' value={titleName} onChange={(e) => handleTitleChange(e.target.value)} ></input>
                        </div>
                        <div className='form-group'>
                            <label>Playlist Image</label>
                            <input style={{width:'100%'}} className='form-control' type='text' value={imageUrl} onChange={(e) => handleImageChange(e.target.value)} ></input>
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