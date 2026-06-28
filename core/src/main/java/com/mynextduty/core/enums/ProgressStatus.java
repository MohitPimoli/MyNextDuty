package com.mynextduty.core.enums;

public enum ProgressStatus {
  COMPLETED("COMPLETED"),
  IN_PROGRESS("IN_PROGRESS"),
  PENDING("PENDING");

  private final String value;

  ProgressStatus(String value) {
    this.value = value;
  }

  public String getValue() {
    return value;
  }

  @Override
  public String toString() {
    return value;
  }

  /** Parse from a DB string — case-insensitive. */
  public static ProgressStatus fromValue(String value) {
    for (ProgressStatus ps : values()) {
      if (ps.value.equalsIgnoreCase(value)) return ps;
    }
    throw new IllegalArgumentException("Unknown ProgressStatus: " + value);
  }
}
