package music.app.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import music.app.entity.Playlist;

public interface PlaylistDao extends JpaRepository<Playlist, Long> {

	@EntityGraph(attributePaths = {"songs"})
	@Query("SELECT DISTINCT p FROM Playlist p WHERE p.playlistId = :playlistId")
	Optional<Playlist> findPlaylistByPlaylistId(@Param("playlistId")Long playlistId);

	@EntityGraph(attributePaths = {"songs"})
	@Query("SELECT DISTINCT p FROM Playlist p ")
	List<Playlist> findAllPlaylistsWithSongs();
}
