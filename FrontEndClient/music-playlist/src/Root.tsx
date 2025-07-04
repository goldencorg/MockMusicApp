import Sidebar from './Sidebar'
import Lyrics from './Lyrics'
import PlaylistDetails from './PlaylistDetails'
import { useEffect, useState } from 'react';
import { PlaylistType } from './types';
import { useNavigate } from 'react-router';

export default function Root(){
  const navigate = useNavigate();
  const [Playlists, setPlaylistList] = useState<PlaylistType[]>([]);
  useEffect(() => {
    const asyncFunction = async () => {
        const response = await fetch("/app/users/1/playlists")
        const data = await response.json()
        setPlaylistList(data)
    }
    asyncFunction()
}, []);
const addPlaylist = async (titleName: string, imageUrl: string) => {
  event?.preventDefault()
  const newPlaylist: any  = {
      playlistTitle: titleName,
  };

  if(imageUrl.trim() !== ""){
    newPlaylist.imageUrl = imageUrl;
  }

  const response = await fetch("app/users/1/playlists", {
      method: "POST",
      body: JSON.stringify(newPlaylist),
      headers: { "Content-Type": "application/json" }
  }).then(response => response.json());
  setPlaylistList([...Playlists, response]);
  console.log(response)
  navigate("/" + response.playlistId)
}

const deletePlaylist = async ( idToDelete: number) => {
  await fetch(`/app/users/1/playlists/${idToDelete}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
  })

  setPlaylistList((prev) => {
    const updatedList = prev.filter(p => p.playlistId !== idToDelete);
    if(updatedList.length > 0){
      const newActive = updatedList[0];
      navigate(`/${newActive.playlistId}`)
    } else {
      navigate("/");
    }
    return updatedList;
  });

}

const updatedSpecificPlaylist = (updatedPlaylist: PlaylistType) => {
  setPlaylistList((prevPlaylistArray) => prevPlaylistArray.map(p => p.playlistId === updatedPlaylist.playlistId ? updatedPlaylist : p))
}
  return (
  <div className='d-flex flex-column vh-100'>
    <div className='d-flex flex-grow-1'>
      <Sidebar Playlists={Playlists} addPlaylist={addPlaylist} deletePlaylist={deletePlaylist}/>
      <PlaylistDetails updatedSpecificPlaylist={updatedSpecificPlaylist} Playlists={Playlists}/>
      <Lyrics />
    </div>
  </div>
)
}