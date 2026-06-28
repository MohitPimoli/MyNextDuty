package com.mynextduty.core.enums;

public enum Priority {
  CRITICAL("CRITICAL"),    // Must do immediately
  HIGH("HIGH"),            // Should do within 3 months
  MEDIUM("MEDIUM"),        // Should do within 6-12 months
  LOW("LOW"),              // Nice to have, can be done later
  OPTIONAL("OPTIONAL");    // Completely optional

  private final String value;

  Priority(String value) {
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
  public static Priority fromValue(String value) {
    for (Priority p : values()) {
      if (p.value.equalsIgnoreCase(value)) return p;
    }
    throw new IllegalArgumentException("Unknown Priority: " + value);
  }
}
