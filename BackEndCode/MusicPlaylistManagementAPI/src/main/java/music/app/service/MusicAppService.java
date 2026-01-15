package music.app.service;

import java.util.HashSet;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import music.app.controller.error.DuplicateSongException;
import music.app.controller.error.DuplicateUserException;
import music.app.controller.model.PlaylistDto;
import music.app.controller.model.UserDto;
import music.app.dao.PlaylistDao;
import music.app.dao.SongDao;
import music.app.dao.UserDao;
import music.app.entity.Playlist;
import music.app.entity.Song;
import music.app.entity.User;

@Service
public class MusicAppService {

	@Autowired
	private UserDao userDao;
	@Autowired
	private PlaylistDao playlistDao;
	@Autowired
	private SongDao songDao;

	@Transactional(readOnly = true)
	public List<User> findAllUsers(){
		return userDao.findAllUsersWithPlaylistsAndSongs();
	}

	@Transactional(readOnly = true)
	public Optional<User> findUserById(Long userId) {
		return userDao.findUserByUserId(userId);
	}

	@Transactional
	public User saveUser(User user) {
		Optional<User> existingUser = userDao.findByUserName(user.getUserName());
		if(existingUser.isPresent()) {
			throw new DuplicateUserException(
					"Username is taken. Choose another.");
		}
		return userDao.save(user);
	}
	
	@Transactional
	public User updateUser(Long userId, User user) {
		User existingUser = userDao.findUserByUserId(userId)
				.orElseThrow(() -> new NoSuchElementException(
						"User with ID=" + userId + " does not exist."));
		Optional<User> userWithSameName = userDao.findByUserName(user.getUserName());
		if(userWithSameName.isPresent() && !userWithSameName.get().getUserId().equals(userId)) {
			throw new DuplicateUserException("Username is taken. Choose another.");
		}
		existingUser.setUserName(user.getUserName());
		existingUser.setUserEmail(user.getUserEmail());
		return userDao.save(existingUser);
	}

	@Transactional
	public void deleteUserById (Long userId) {
		if(!userDao.existsById(userId)) {
			throw new NoSuchElementException(
					"User with ID=" + userId + " does not exist.");
		}
		userDao.deleteById(userId);
	}

	@Transactional(readOnly = true)
	public List<Playlist> findAllPlaylists() {
		return playlistDao.findAllPlaylistsWithSongs();
	}

	@Transactional(readOnly = true)
	public Optional<Playlist> findPlaylistById(Long playlistId) {
		return playlistDao.findPlaylistByPlaylistId(playlistId);
	}

	@Transactional
	public Playlist savePlaylist(Playlist playlist) {
		return playlistDao.save(playlist);
	}
	
	@Transactional
	public Song updateSong(Long songId, Song song) {
		Song existingSong = songDao.findSongBySongId(songId)
				.orElseThrow(() -> new NoSuchElementException(
						"Song with ID=" + songId + " does not exist."));
		Optional<Song> songWithSameDetails = songDao.findBySongTitleAndSongAlbumAndSongArtist(
				song.getSongTitle(), song.getSongAlbum(), song.getSongArtist());
		if(songWithSameDetails.isPresent() && !songWithSameDetails.get().getSongId().equals(songId)) {
			throw new DuplicateSongException(
					"Song already exists. Use the addExistingSongToPlaylistOfUser endpoint instead (/users/{userId}/playlists/{playlistId}/songs?songId={songId})");
		}
		existingSong.setSongTitle(song.getSongTitle());
		existingSong.setSongAlbum(song.getSongAlbum());
		existingSong.setSongArtist(song.getSongArtist());
		existingSong.setSongDuration(song.getSongDuration());
		return songDao.save(existingSong);
	}

	@Transactional
	public void deletePlaylistById(Long playlistId) {
		Playlist playlist = playlistDao.findById(playlistId)
				.orElseThrow(() -> new NoSuchElementException(
						"Playlist with ID=" + playlistId + " does not exist."));
		for(Song song : new HashSet<>(playlist.getSongs())) {
			song.getPlaylists().remove(playlist);
		}
		playlist.getSongs().clear();
		User user = playlist.getUser();
		if(user != null) {
			user.getPlaylists().remove(playlist);
			playlist.setUser(null);
		}
		playlistDao.delete(playlist);
		
	}

	@Transactional(readOnly = true)
	public Set<Song> getSongs(Long playlistId) {
		Playlist playlist = playlistDao.findPlaylistByPlaylistId(playlistId)
				.orElseThrow(() -> new NoSuchElementException(
						"Playlist with ID=" + playlistId + " does not exist."));
		return playlist.getSongs();
	}

	@Transactional
	public Playlist addSong(Long playlistId, Long songId) {
		Playlist playlist = playlistDao.findPlaylistByPlaylistId(playlistId)
				.orElseThrow(() -> new NoSuchElementException(
						"Playlist with ID=" + playlistId + " does not exist."));
		Song song = songDao.findSongBySongId(songId)
				.orElseThrow(() -> new NoSuchElementException(
						"Song with ID=" + songId + " does not exist."));
		if(!playlist.getSongs().contains(song)) {
			playlist.getSongs().add(song);
			song.getPlaylists().add(playlist);
		}
		playlistDao.save(playlist);
		songDao.save(song);
		return playlist;
	}

	@Transactional
	public PlaylistDto removeSong(Long playlistId, Long songId) {
		Playlist playlist = playlistDao.findPlaylistByPlaylistId(playlistId)
				.orElseThrow(() -> new NoSuchElementException(
						"Playlist with ID=" + playlistId + " does not exist."));
		Song song = songDao.findSongBySongId(songId)
				.orElseThrow(() -> new NoSuchElementException(
						"Song with ID=" + songId + " does not exist."));
		if(playlist.getSongs().contains(song)) {
			playlist.getSongs().remove(song);
			song.getPlaylists().remove(playlist);
			playlistDao.save(playlist);
			songDao.save(song);
		}
		return new PlaylistDto(playlist);
	}

	@Transactional
	public UserDto getUser(Long userId) {
		User user = userDao.findUserByUserId(userId)
				.orElseThrow(() -> new RuntimeException("User was not found."));
		return new UserDto(user);
	}

	@Transactional
	public PlaylistDto getPlaylist(Long playlistId) {
		Playlist playlist = playlistDao.findPlaylistByPlaylistId(playlistId)
				.orElseThrow(() -> new RuntimeException("Playlist was not found."));
		return new PlaylistDto(playlist);
	}

	@Transactional(readOnly = true)
	public List<UserDto> findAllUsersWithPlaylistsAndSongs() {
		List<User> users = userDao.findAllUsersWithPlaylistsAndSongs();
		return users.stream().map(UserDto::new).collect(Collectors.toList());
	}

	@Transactional(readOnly = true)
	public UserDto findUserWithPlaylistsAndSongsByUserId(Long userId) {
		User user = userDao.findUserWithPlaylistsAndSongsByUserId(userId)
				.orElseThrow(() -> new NoSuchElementException(
						"User with ID=" + userId + " does not exist."));
		return new UserDto(user);
	}

	@Transactional(readOnly = true)
	public User findUserEntityWithPlaylists(Long userId) {
		return userDao.findUserWithPlaylistsAndSongsByUserId(userId)
				.orElseThrow(() -> new NoSuchElementException(
						"User with ID=" + userId + " does not exist."));
	}

	@Transactional(readOnly = true)
	public List<Song> findAllSongs() {
		return songDao.findAllSongsWithPlaylists();
	}

	@Transactional(readOnly = true)
	public Optional<Song> findSongById(Long songId) {
		return songDao.findSongBySongId(songId);
	}

	@Transactional
	public Song saveSong(Song song) {
		Optional<Song> existingSong = songDao.findBySongTitleAndSongAlbumAndSongArtist(
				song.getSongTitle(), song.getSongAlbum(), song.getSongArtist());
		if(existingSong.isPresent()) {
			throw new DuplicateSongException(
					"Song already exists. Use the addExistingSongToPlaylistOfUser endpoint instead (/users/{userId}/playlists/{playlistId}/songs?songId={songId})");
		}
		return songDao.save(song);
	}

	@Transactional
	public void deleteSongById(Long songId) {
		if(!songDao.existsById(songId)) {
			throw new NoSuchElementException(
					"Song with ID=" +songId + " does not exist.");
		}
		songDao.deleteById(songId);
	}

}