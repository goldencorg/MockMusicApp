package music.app.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import music.app.entity.User;

public interface UserDao extends JpaRepository<User, Long> {

	@EntityGraph(attributePaths = {"playlists", "playlists.songs"})
	Optional<User> findUserByUserId(Long userId);

	@EntityGraph(attributePaths = {"playlists", "playlists.songs"})
	@Query("SELECT DISTINCT u FROM User u ")
	List<User> findAllUsersWithPlaylistsAndSongs();

	@EntityGraph(attributePaths = {"playlists", "playlists.songs"})
	@Query("SELECT DISTINCT u FROM User u WHERE u.userId = :userId")
	Optional<User> findUserWithPlaylistsAndSongsByUserId(@Param("userId") Long userId);

	Optional<User> findByUserName(String userName);
}
