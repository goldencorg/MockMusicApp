package music.app.controller.error;

@SuppressWarnings("serial")
public class DuplicateSongException extends RuntimeException {
	
	public DuplicateSongException(String message) {
		super(message);
	}
	
}
