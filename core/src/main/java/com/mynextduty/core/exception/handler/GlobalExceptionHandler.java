package com.mynextduty.core.exception.handler;

import com.mynextduty.core.dto.ErrorDataDto;
import com.mynextduty.core.dto.ErrorResponseDto;
import com.mynextduty.core.dto.ResponseDto;
import com.mynextduty.core.exception.GenericApplicationException;
import com.mynextduty.core.exception.InvalidArgumentsException;
import com.mynextduty.core.exception.InvalidCredentialsException;
import com.mynextduty.core.exception.KeyLoadingException;
import com.mynextduty.core.exception.ResourceNotFoundException;
import com.mynextduty.core.exception.TokenException;
import com.mynextduty.core.exception.UserNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import java.sql.SQLException;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.hibernate.exception.SQLGrammarException;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.InvalidDataAccessResourceUsageException;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import static com.mynextduty.core.enums.HttpStatus.BAD_REQUEST;
import static com.mynextduty.core.enums.HttpStatus.INTERNAL_SERVER_ERROR;
import static com.mynextduty.core.enums.HttpStatus.NOT_FOUND;
import static com.mynextduty.core.enums.HttpStatus.SERVICE_UNAVAILABLE;
import static com.mynextduty.core.enums.HttpStatus.UNAUTHORIZED;
import static com.mynextduty.core.utils.Constants.SOMETHING_WENT_WRONG;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler<D extends ErrorDataDto> {

  @ExceptionHandler(InvalidCredentialsException.class)
  public ResponseEntity<ResponseDto<D>> handleInvalidCredentials(
      InvalidCredentialsException ex, HttpServletRequest request) {
    return buildResponse(UNAUTHORIZED.value(), ex.getMessage(), request);
  }

  @ExceptionHandler(TokenException.class)
  public ResponseEntity<ResponseDto<D>> handleTokenExpired(
      TokenException ex, HttpServletRequest request) {
    return buildResponse(UNAUTHORIZED.value(), ex.getMessage(), request);
  }

  @ExceptionHandler(BadRequestException.class)
  public ResponseEntity<ResponseDto<D>> handleBadRequest(
      BadRequestException ex, HttpServletRequest request) {
    return buildResponse(BAD_REQUEST.value(), ex.getMessage(), request);
  }

  @ExceptionHandler(MissingServletRequestParameterException.class)
  public ResponseEntity<ResponseDto<D>> handleBadAPIRequestEx(
      MissingServletRequestParameterException ex, HttpServletRequest request) {
    return buildResponse(BAD_REQUEST.value(), ex.getMessage(), request);
  }

  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<ResponseDto<D>> handleNotFound(
      ResourceNotFoundException ex, HttpServletRequest request) {
    return buildResponse(NOT_FOUND.value(), ex.getMessage(), request);
  }

  @ExceptionHandler(RuntimeException.class)
  public ResponseEntity<ResponseDto<D>> handleRuntime(
      RuntimeException ex, HttpServletRequest request) {
    return buildResponse(INTERNAL_SERVER_ERROR.value(), ex.getMessage(), request);
  }

  @ExceptionHandler(InvalidArgumentsException.class)
  public ResponseEntity<ResponseDto<D>> handleInvalidArguments(
      InvalidArgumentsException ex, HttpServletRequest request) {
    return buildResponse(BAD_REQUEST.value(), ex.getMessage(), request);
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ResponseDto<D>> handleValidation(
      MethodArgumentNotValidException ex, HttpServletRequest request) {
    String message =
        ex.getBindingResult().getFieldErrors().stream()
            .map(error -> error.getField() + ": " + error.getDefaultMessage())
            .findFirst()
            .orElse("Validation failed");
    return buildResponse(BAD_REQUEST.value(), message, request);
  }

  @ExceptionHandler(NoResourceFoundException.class)
  public ResponseEntity<ResponseDto<D>> handleNoResourceFound(
      NoResourceFoundException ex, HttpServletRequest request) {
    return buildResponse(NOT_FOUND.value(), ex.getMessage(), request);
  }

  @ExceptionHandler({NoHandlerFoundException.class, HttpRequestMethodNotSupportedException.class})
  public ResponseEntity<ResponseDto<D>> handleNoHandlerFound(
      Exception ex, HttpServletRequest request) {
    return buildResponse(NOT_FOUND.value(), ex.getMessage(), request);
  }

  @ExceptionHandler(GenericApplicationException.class)
  public ResponseEntity<ResponseDto<D>> handleRuntimeException(
      GenericApplicationException ex, HttpServletRequest request) {
    return buildResponse(ex.getStatusCode(), ex.getMessage(), request);
  }

  @ExceptionHandler(KeyLoadingException.class)
  public ResponseEntity<ResponseDto<D>> handleKeyLoading(
      KeyLoadingException ex, HttpServletRequest request) {
    return buildResponse(INTERNAL_SERVER_ERROR.value(), ex.getMessage(), request);
  }

  @ExceptionHandler({SQLException.class, DataAccessException.class})
  public ResponseEntity<ResponseDto<D>> handleDatabase(Exception ex, HttpServletRequest request) {
    return buildResponse(SERVICE_UNAVAILABLE.value(), SOMETHING_WENT_WRONG, request);
  }

  @ExceptionHandler({
    SQLGrammarException.class,
    BadSqlGrammarException.class,
    InvalidDataAccessResourceUsageException.class
  })
  public ResponseEntity<ResponseDto<D>> handleSqlGrammarIssues(
      Exception ex, HttpServletRequest request) {
    return buildResponse(INTERNAL_SERVER_ERROR.value(), SOMETHING_WENT_WRONG, request);
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ResponseDto<D>> handleAll(Exception ex, HttpServletRequest request) {
    return buildResponse(INTERNAL_SERVER_ERROR.value(), SOMETHING_WENT_WRONG, request);
  }

  @ExceptionHandler(UserNotFoundException.class)
  public ResponseEntity<ResponseDto<D>> handleUserNotFound(
      UserNotFoundException ex, HttpServletRequest request) {
    return buildResponse(UNAUTHORIZED.value(), ex.getMessage(), request);
  }

  private ResponseEntity<ResponseDto<D>> buildResponse(
      Integer status, String message, HttpServletRequest request) {
    ResponseDto<D> responseDto =
        ErrorResponseDto.<D>builder()
            .message(message)
            .status(status)
            .path(request.getRequestURI())
            .build();
    return ResponseEntity.status(status).body(responseDto);
  }
}
