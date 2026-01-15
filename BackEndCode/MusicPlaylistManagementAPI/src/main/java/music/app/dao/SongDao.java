package music.app.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import music.app.entity.Song;

public interface SongDao extends JpaRepository<Song, Long> {

	@EntityGraph(attributePaths = {"playlists"})
	@Query("SELECT DISTINCT s FROM Song s WHERE s.songId = :songId")
	Optional<Song> findSongBySongId(@Param("songId") Long songId);

	@EntityGraph(attributePaths = {"playlists"})
	@Query("SELECT DISTINCT s FROM Song s ")
	List<Song> findAllSongsWithPlaylists();

	Optional<Song> findBySongTitleAndSongAlbumAndSongArtist(String songTitle, String songAlbum, String songArtist);

}
