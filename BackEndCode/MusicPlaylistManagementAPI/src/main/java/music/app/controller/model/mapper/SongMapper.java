package music.app.controller.model.mapper;

import java.util.List;
import java.util.stream.Collectors;

import music.app.controller.model.SongDto;
import music.app.entity.Song;

public class SongMapper {

	public static SongDto convertToDto(Song song) {
		return new SongDto(song);
	}

	public static SongDto convertToDto(Song song, boolean includePlaylistIds) {
		return new SongDto(song, includePlaylistIds);
	}

	public static Song convertToEntity(SongDto songDto) {
		return songDto.convertToEntity();
	}

	public static List<SongDto> dtoList(List<Song> songs) {
		return songs
				.stream()
				.map(SongDto::new)
				.collect(Collectors.toList());
	}
}
