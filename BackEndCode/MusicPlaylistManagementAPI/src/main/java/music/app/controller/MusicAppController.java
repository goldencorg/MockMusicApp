package music.app.controller;

import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import music.app.controller.model.PlaylistDto;
import music.app.controller.model.SongDto;
import music.app.controller.model.UserDto;
import music.app.controller.model.mapper.UserMapper;
import music.app.entity.Playlist;
import music.app.entity.Song;
import music.app.entity.User;
import music.app.service.MusicAppService;

@RestController
@RequestMapping("/app")
@Slf4j
public class MusicAppController {

	@Autowired
	private MusicAppService musicAppService;

	@GetMapping("/users")
	@ResponseStatus(code = HttpStatus.OK)
	public List<UserDto> listAllUsers() {
		log.info("Getting all users.");
		return musicAppService.findAllUsersWithPlaylistsAndSongs();
	}

	@GetMapping("/users/{userId}")
	@ResponseStatus(code = HttpStatus.OK)
	public UserDto getUser(@PathVariable Long userId) {
		log.info("Getting user with ID={}", userId);
		return musicAppService.findUserWithPlaylistsAndSongsByUserId(userId);
	}

	@PostMapping("/users")
	@ResponseStatus(code = HttpStatus.CREATED)
	public UserDto createUser(@RequestBody UserDto userDto) {
		log.info("Creating user {}", userDto);
		User savedUser = musicAppService.saveUser(UserMapper.convertToEntity(userDto));
		return UserMapper.convertToDto(savedUser);
	}

	@PutMapping("/users/{userId}")
	@ResponseStatus(code = HttpStatus.OK)
	public UserDto updateUser(@PathVariable Long userId, @RequestBody UserDto userDto) {
		User userEnetityToUpdate = UserMapper.convertToEntity(userDto);
		log.info("Updating user with ID={}", userId);
		User updatedUser = musicAppService.updateUser(userId, userEnetityToUpdate);
		return UserMapper.convertToDto(updatedUser);
	}

	@DeleteMapping("/users/{userId}")
	@ResponseStatus(code = HttpStatus.NO_CONTENT)
	public void deleteUser(@PathVariable Long userId) {
		log.info("Deleting user with ID={}", userId);
		musicAppService.deleteUserById(userId);
	}

	@GetMapping("/users/{userId}/playlists")
	@ResponseStatus(code = HttpStatus.OK)
	public List<PlaylistDto> listAllPlaylistsOfUser(@PathVariable Long userId) {
		User user = musicAppService.findUserEntityWithPlaylists(userId);
		log.info("Getting playlists of user with ID=" + userId + ".");
		Set<Long> seenPlaylists = new HashSet<>();
		return user
				.getPlaylists()
				.stream()
				.filter(p -> p.getPlaylistId() != null && seenPlaylists.add(p.getPlaylistId()))
				.sorted(Comparator.comparing(Playlist::getPlaylistId))
				.map(playlist -> new PlaylistDto(playlist, true))
				.collect(Collectors.toList());
	}

	@PostMapping("/users/{userId}/playlists")
	@ResponseStatus(code = HttpStatus.CREATED)
	public PlaylistDto createPlaylistForUser(
			@PathVariable Long userId, @RequestBody PlaylistDto playlistDto) {
		User user = musicAppService.findUserEntityWithPlaylists(userId);
		Playlist playlist = playlistDto.getPlaylistId() != null ?
				musicAppService.findPlaylistById(playlistDto.getPlaylistId())
				.orElseThrow(() -> new NoSuchElementException(
						"Playlist with ID=" + playlistDto.getPlaylistId() + " does not exist.")) :new Playlist();
		playlist.setPlaylistTitle(playlistDto.getPlaylistTitle());
		playlist.setImageUrl(playlistDto.getImageUrl() 
				!= null && playlistDto.getImageUrl().isBlank() ? playlistDto.getImageUrl()
				:"https://tinyurl.com/defaultplaylistimage");
		playlist.setUser(user);
		for(SongDto songDto : playlistDto.getSongs()) {
			if(songDto.getSongId() != null) {
				Song song = musicAppService.findSongById(songDto.getSongId())
						.orElseThrow(() -> new NoSuchElementException(
								"Song with ID=" + songDto.getSongId() + " does not exist."));
				playlist.getSongs().add(song);
				song.getPlaylists().add(playlist);
			}
		}
		Playlist savedPlaylist = musicAppService.savePlaylist(playlist);
		log.info("Creating playlist {}", playlist);
		return new PlaylistDto(savedPlaylist, true);
	}

	@PutMapping("/users/{userId}/playlists/{playlistId}")
	@ResponseStatus(code = HttpStatus.OK)
	public PlaylistDto updatePlaylistOfUser(
			@PathVariable Long userId,
			@PathVariable Long playlistId,
			@RequestBody PlaylistDto playlistDto) {
		Playlist existingPlaylist = verifyUserPlaylist(userId, playlistId);
		existingPlaylist.setPlaylistTitle(playlistDto.getPlaylistTitle());
		existingPlaylist.setImageUrl(playlistDto.getImageUrl() 
				!= null && playlistDto.getImageUrl().isBlank() ? playlistDto.getImageUrl()
				:"https://tinyurl.com/defaultplaylistimage");
		Playlist updatedPlaylist = musicAppService.savePlaylist(existingPlaylist);
		log.info("Updating playlist with ID=" + playlistId + " of user with ID=" + userId + ".");
		return new PlaylistDto(updatedPlaylist, true);
	}

	@DeleteMapping("/users/{userId}/playlists/{playlistId}")
	@ResponseStatus(code = HttpStatus.NO_CONTENT)
	public void deletePlaylistOfUser(@PathVariable Long userId, @PathVariable Long playlistId) {
		verifyUserPlaylist(userId, playlistId);
		log.info("Deleting playlist with ID=" + playlistId + " of user with ID=" + userId + ".");
		musicAppService.deletePlaylistById(playlistId);
	}

	@GetMapping("/users/{userId}/playlists/{playlistId}/songs")
	@ResponseStatus(code = HttpStatus.OK)
	public List<SongDto> listAllSongsOfPlaylist(@PathVariable Long userId, @PathVariable Long playlistId) {
		Playlist selectedPlaylist = verifyUserPlaylist(userId, playlistId);
		log.info("Getting songs of playlist with ID={}", playlistId);
		return selectedPlaylist
				.getSongs()
				.stream()
				.sorted(Comparator.comparing(Song::getSongArtist))
				.map(song -> new SongDto(song, true))
				.collect(Collectors.toList());
	}

	@PostMapping("/users/{userId}/playlists/{playlistId}/songs/create")
	@ResponseStatus(code = HttpStatus.CREATED)
	public PlaylistDto createAndAddSongToPlaylistOfUser(
			@PathVariable Long userId, @PathVariable Long playlistId, @RequestBody SongDto songDto) {
		Playlist selectedPlaylist = verifyUserPlaylist(userId, playlistId);
		Song newSong = songDto.convertToEntity();
		Song savedSong = musicAppService.saveSong(newSong);
		selectedPlaylist.getSongs().add(savedSong);
		savedSong.getPlaylists().add(selectedPlaylist);
		Playlist savedPlaylist = musicAppService.savePlaylist(selectedPlaylist);
		log.info("Creating song {} in playlist with ID={}", savedSong.getSongTitle(), playlistId);
		return new PlaylistDto(savedPlaylist, true);
	}

	@PostMapping("/users/{userId}/playlists/{playlistId}/songs")
	@ResponseStatus(code = HttpStatus.CREATED)
	public PlaylistDto addExistingSongToPlaylistOfUser(
			@PathVariable Long userId, @PathVariable Long playlistId, @RequestParam Long songId) {
		verifyUserPlaylist(userId, playlistId);
		log.info("Adding song with ID={} into playlist with ID={}", songId, playlistId);
		Playlist updatedPlaylist = musicAppService.addSong(playlistId, songId);
		return new PlaylistDto(updatedPlaylist, true);
	}

	@PutMapping("/users/{userId}/playlists/{playlistId}/songs/{songId}")
	@ResponseStatus(code = HttpStatus.OK)
	public SongDto updateSongFromPlaylistOfUser(
			@PathVariable Long userId, @PathVariable Long playlistId,
			@PathVariable Long songId, @RequestBody SongDto songDto) {
		Playlist playlist = verifyUserPlaylist(userId, playlistId);
		Song songToUpdate = musicAppService.findSongById(songId)
				.orElseThrow(() -> new NoSuchElementException(
						"Song with ID=" + songId + " does not exist."));
		if(!playlist.getSongs().contains(songToUpdate)) {
			throw new NoSuchElementException(
					"Song with ID=" + songId + " is not in playlist with ID=" + playlistId + ".");
		}
		Song songUpdateToEntity = songDto.convertToEntity();
		Song updatedSong = musicAppService.updateSong(songId, songUpdateToEntity);
		log.info("Updating song from playlist with ID=" + playlistId + ".");
		return new SongDto(updatedSong, true);
	}

	@DeleteMapping("/users/{userId}/playlists/{playlistId}/songs/{songId}")
	@ResponseStatus(code = HttpStatus.OK)
	public PlaylistDto deleteSongFromPlaylistOfUser(
			@PathVariable Long userId, @PathVariable Long playlistId, @PathVariable Long songId) {
		verifyUserPlaylist(userId, playlistId);
		PlaylistDto updatedPlaylistDto = musicAppService.removeSong(playlistId, songId);
		log.info("Deleting song from playlist with ID={}", songId);
		return updatedPlaylistDto;
	}

	private Playlist verifyUserPlaylist(Long userId, Long playlistId) {
		User user = musicAppService.findUserEntityWithPlaylists(userId);
		Playlist playlist = musicAppService.findPlaylistById(playlistId)
				.orElseThrow(() -> new NoSuchElementException(
						"Playlist with ID=" + playlistId + " does not exist."));
		if(!playlist.getUser().getUserId().equals(user.getUserId())) {
			throw new NoSuchElementException(
					"Playlist with ID=" + playlistId + " does not belong to user with ID=" + userId + ".");
		}
		return playlist;
	}

}
