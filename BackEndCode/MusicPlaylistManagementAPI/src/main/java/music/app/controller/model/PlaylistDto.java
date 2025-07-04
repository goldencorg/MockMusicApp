package music.app.controller.model;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import lombok.Data;
import lombok.NoArgsConstructor;
import music.app.entity.Playlist;
import music.app.entity.Song;

@Data
@NoArgsConstructor
public class PlaylistDto {

	private Long playlistId;
	private String playlistTitle;
	private String imageUrl;
	private Long userId;
	private List<SongDto> songs = new ArrayList<>();

	public PlaylistDto(Playlist playlist) {
		this(playlist, true);
	}

	public PlaylistDto(Playlist playlist, boolean includeSongs) {
		this.playlistId = playlist.getPlaylistId();
		this.playlistTitle = playlist.getPlaylistTitle();
		this.userId = playlist.getUser().getUserId();
		this.imageUrl = playlist.getImageUrl() != null ? playlist.getImageUrl():
				"https://tinyurl.com/defaultplaylistimage";

		if(includeSongs && playlist.getSongs() != null) {
			Set<Long> seenSongIds = new HashSet<>();
			this.songs = playlist.getSongs()
			.stream()
			.filter(song -> song.getSongId() != null && seenSongIds.add(song.getSongId()))
			.sorted(Comparator.comparing(Song::getSongId))
			.map(song -> new SongDto(song, false))
			.collect(Collectors.toList());
		}
	}

	public Playlist convertToEntity() {
		Playlist playlist = new Playlist();
		playlist.setPlaylistId(this.playlistId);
		playlist.setPlaylistTitle(this.playlistTitle);
		playlist.setImageUrl(this.imageUrl);
		for(SongDto songDto : this.songs) {
			Song song = songDto.convertToEntity();
			playlist.getSongs().add(song);
			song.getPlaylists().add(playlist);
		}
		return playlist;
	}
}
