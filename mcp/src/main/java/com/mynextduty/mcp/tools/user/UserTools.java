package com.mynextduty.mcp.tools.user;

import com.mynextduty.mcp.dto.UserDto;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UserTools {

    private static final List<UserDto> DUMMY_USERS = List.of(
            UserDto.builder().id(1L).firstName("Mohit").email("mohit@example.com").build(),
            UserDto.builder().id(2L).firstName("Priya").email("priya@example.com").build(),
            UserDto.builder().id(3L).firstName("Rahul").email("rahul@example.com").build()
    );

    @Tool(description = "Get all users in the system")
    public List<UserDto> getUser() {
        return DUMMY_USERS;
    }
}
