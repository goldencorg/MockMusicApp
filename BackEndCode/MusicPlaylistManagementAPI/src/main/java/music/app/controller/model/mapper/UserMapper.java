package music.app.controller.model.mapper;

import java.util.List;
import java.util.stream.Collectors;

import music.app.controller.model.UserDto;
import music.app.entity.User;

public class UserMapper {

	public static UserDto convertToDto(User user) {
		return new UserDto(user, true);
	}

	public static User convertToEntity(UserDto userDto) {
		return userDto.convertToEntity();
	}

	public static List<UserDto> dtoList(List<User> users) {
		return users
				.stream()
				.map(UserDto::new)
				.collect(Collectors.toList());
	}
}
