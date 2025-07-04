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
import music.app.entity.User;

@Data
@NoArgsConstructor
public class UserDto {

	private Long userId;
	private String userName;
	private String userEmail;
	private List<PlaylistDto> playlists = new ArrayList<>();


	public UserDto(User user) {
		this(user, true);
	}

	public UserDto(User user, boolean includePlaylists) {
		this.userId = user.getUserId();
		this.userName = user.getUserName();
		this.userEmail = user.getUserEmail();
		if(includePlaylists && user.getPlaylists() != null) {
			Set<Long> seenPlaylistIds = new HashSet<>();
			this.playlists = user.getPlaylists()
					.stream()
					.filter(p -> p.getPlaylistId() != null && seenPlaylistIds.add(p.getPlaylistId()))
					.sorted(Comparator.comparing(Playlist::getPlaylistId))
					.map(p -> new PlaylistDto(p, true))
					.collect(Collectors.toList());
		}
	}

	public User convertToEntity() {
		User user = new User();
		user.setUserId(this.userId);
		user.setUserName(this.userName);
		user.setUserEmail(this.userEmail);
		Set<Playlist> userPlaylists = new HashSet<>();
		for(PlaylistDto playlistDto : this.playlists) {
			Playlist playlist = playlistDto.convertToEntity();
			playlist.setUser(user);
			userPlaylists.add(playlist);
		}
		user.setPlaylists(userPlaylists);
		return user;
	}
}
