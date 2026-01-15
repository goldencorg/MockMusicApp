package music.app.entity;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Data
public class Playlist {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private Long playlistId;
	private String playlistTitle;
	private String imageUrl;
	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;
	@EqualsAndHashCode.Exclude
	@ToString.Exclude
	@ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
	@JoinTable(name = "playlist_song",
			joinColumns = @JoinColumn(name = "playlist_id"),
			inverseJoinColumns = @JoinColumn(name = "song_id"))
	private Set<Song> songs = new HashSet<>();

}
