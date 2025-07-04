import { useParams } from "react-router";
import Playlist from "./Playlist";
import { PlaylistType } from "./types";

export default function PlaylistDetails({Playlists, updatedSpecificPlaylist}: {
        Playlists: PlaylistType[]; 
        updatedSpecificPlaylist: (updatedPlaylist: PlaylistType) => void;
    }) {
    const { playlistId } = useParams();
    const playlist = Playlists.find((p) => String(p.playlistId) === playlistId);
    return(
        <Playlist updatedSpecificPlaylist={updatedSpecificPlaylist} playlist={playlist}/>
    )
}