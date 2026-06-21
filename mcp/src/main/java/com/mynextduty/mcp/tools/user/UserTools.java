package com.mynextduty.mcp.tools.user;

import com.mynextduty.mcp.dto.UserDto;
import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UserTools {

    private static final List<UserDto> DUMMY_USERS = List.of(
            UserDto.builder().id(1L).firstName("Mohit").email("mohit@example.com").build(),
            UserDto.builder().id(2L).firstName("Priya").email("priya@example.com").build(),
            UserDto.builder().id(3L).firstName("Rahul").email("rahul@example.com").build()
    );

    @McpTool(
            name = "getUser",
            title = "Get All Users",
            description = "Get all users in the system",
            annotations = @McpTool.McpAnnotations(
                    readOnlyHint = true,
                    destructiveHint = false,
                    idempotentHint = true,
                    openWorldHint = false
            )
    )
    public List<UserDto> getUser() {
        return DUMMY_USERS;
    }
}
