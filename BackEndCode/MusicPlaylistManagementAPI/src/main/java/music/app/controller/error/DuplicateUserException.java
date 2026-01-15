package music.app.controller.error;

@SuppressWarnings("serial")
public class DuplicateUserException extends RuntimeException {

	public DuplicateUserException(String message) {
		super(message);
	}
	
}
