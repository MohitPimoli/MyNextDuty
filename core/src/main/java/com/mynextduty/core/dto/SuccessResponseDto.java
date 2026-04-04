package com.mynextduty.core.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.ToString;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;

@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
@JsonInclude(NON_NULL)
public class SuccessResponseDto<T> implements ResponseDto<T> {
  private static final String REQUEST_PROCESSED = "Request processed successfully.";
  @Builder.Default private String message = REQUEST_PROCESSED;
  @Builder.Default private Integer status = 200;
  private T data;

  @Override
  public String getMessage() {
    return this.message;
  }

  @Override
  public int getStatus() {
    return this.status;
  }

  @Override
  public T getData() {
    return this.data;
  }

  @Override
  public void setMessage(String message) {
    this.message = message;
  }

  @Override
  public void setStatus(int status) {
    this.status = status;
  }

  @Override
  public void setData(T data) {
    this.data = data;
  }

  public SuccessResponseDto(T data) {
    this.data = data;
    this.status = 200;
    this.message = REQUEST_PROCESSED;
  }

  public SuccessResponseDto(T data, Integer status) {
    this.data = data;
    this.status = status;
    this.message = REQUEST_PROCESSED;
  }
}
