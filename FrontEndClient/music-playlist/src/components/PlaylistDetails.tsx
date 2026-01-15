'use client'
import { useParams } from "next/navigation";
import Playlist from "./Playlist";
import { PlaylistType } from "@/types";

export default function PlaylistDetails({ Playlists, updatedSpecificPlaylist }: {
    Playlists: PlaylistType[];
    updatedSpecificPlaylist: (updatedPlaylist: PlaylistType) => void;
}) {
    const params = useParams();
    const playlistId = params.playlistId as string;

    const playlist = Playlists.find((p) => String(p.playlistId) === playlistId);

    return (
        <div className="flex-grow h-full overflow-hidden">
             <Playlist updatedSpecificPlaylist={updatedSpecificPlaylist} playlist={playlist} />
        </div>
    )
}