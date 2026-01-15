'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import Lyrics from './Lyrics';
import PlaylistDetails from './PlaylistDetails';
import { PlaylistType } from '../types';

export default function Root() {
  const router = useRouter();
  const [playlists, setPlaylistList] = useState<PlaylistType[]>([]);

  useEffect(() => {
      const fetchPlaylists = async () => {
        try {
          const response = await fetch("/app/users/1/playlists");
          
          if (!response.ok) {
            console.error("Server returned status:", response.status);
            return; 
          }

          const data = await response.json();
          setPlaylistList(data);
          
        } catch (error) {
          console.error("Failed to fetch playlists:", error);
        }
      };
      fetchPlaylists();
  }, []);

  const addPlaylist = async (titleName: string, imageUrl: string) => {
    const newPlaylist: Partial<PlaylistType> = {
      playlistTitle: titleName,
      ...(imageUrl.trim() !== "" && { imageUrl }), 
    };

    try {
      const response = await fetch("/app/users/1/playlists", {
        method: "POST",
        body: JSON.stringify(newPlaylist),
        headers: { "Content-Type": "application/json" }
      });

      const savedPlaylist = await response.json();
      
      setPlaylistList([...playlists, savedPlaylist]);
      
      router.push("/" + savedPlaylist.playlistId); 
    } catch (error) {
      console.error("Failed to add playlist", error);
    }
  };

  const deletePlaylist = async (idToDelete: number) => {
    try {
      await fetch(`/app/users/1/playlists/${idToDelete}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });

      setPlaylistList((prev) => {
        const updatedList = prev.filter(p => p.playlistId !== idToDelete);
        
        if (updatedList.length > 0) {
          const newActive = updatedList[0];
          router.push(`/${newActive.playlistId}`);
        } else {
          router.push("/");
        }
        return updatedList;
      });
    } catch (error) {
      console.error("Failed to delete playlist", error);
    }
  };

  const updatedSpecificPlaylist = (updatedPlaylist: PlaylistType) => {
    setPlaylistList((prev) => 
      prev.map(p => p.playlistId === updatedPlaylist.playlistId ? updatedPlaylist : p)
    );
  };

  return (
    <div className='flex flex-col h-screen'> 
      <div className='flex flex-grow overflow-hidden'> 
        
        <Sidebar 
          Playlists={playlists} 
          addPlaylist={addPlaylist} 
          deletePlaylist={deletePlaylist}
        />
        
        <PlaylistDetails 
          updatedSpecificPlaylist={updatedSpecificPlaylist} 
          Playlists={playlists}
        />
        
        <Lyrics />
        
      </div>
    </div>
  );
}