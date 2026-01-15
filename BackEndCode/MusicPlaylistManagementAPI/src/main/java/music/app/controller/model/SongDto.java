package music.app.controller.model;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import lombok.Data;
import lombok.NoArgsConstructor;
import music.app.entity.Song;

@Data
@NoArgsConstructor
public class SongDto {

	private Long songId;
	private String songTitle;
	private String songAlbum;
	private String songDuration;
	private String songArtist;
	private List<Long> playlistIds = new ArrayList<>();

	public SongDto(Song song) {
		this(song, true);
	}

	public SongDto(Song song, boolean includePlaylistIds) {
		this.songId = song.getSongId();
		this.songTitle = song.getSongTitle();
		this.songAlbum = song.getSongAlbum();
		this.songDuration = song.getSongDuration();
		this.songArtist = song.getSongArtist();
		if(includePlaylistIds && song.getPlaylists() != null) {
			this.playlistIds = song.getPlaylists()
			.stream()
			.filter(p -> p.getPlaylistId() != null)
			.map(p -> p.getPlaylistId())
			.distinct()
			.sorted()
			.collect(Collectors.toList());
		}
	}

	public Song convertToEntity() {
		Song song = new Song();
		song.setSongId(this.songId);
		song.setSongTitle(this.songTitle);
		song.setSongAlbum(this.songAlbum);
		song.setSongDuration(this.songDuration);
		song.setSongArtist(this.songArtist);
		return song;
	}
}
