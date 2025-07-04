package music.app.controller.model.mapper;

import java.util.List;
import java.util.stream.Collectors;

import music.app.controller.model.PlaylistDto;
import music.app.entity.Playlist;

public class PlaylistMapper {

	public static PlaylistDto convertToDto(Playlist playlist) {
		return new PlaylistDto(playlist);
	}

	public static PlaylistDto convertToDto(Playlist playlist, boolean includeSongs) {
		return new PlaylistDto(playlist, includeSongs);
	}

	public static Playlist convertToEntity(PlaylistDto playlistDto) {
		return playlistDto.convertToEntity();
	}

	public static List<PlaylistDto> dtoList(List<Playlist> playlists) {
		return playlists
				.stream()
				.map(PlaylistDto::new)
				.collect(Collectors.toList());
	}
}
