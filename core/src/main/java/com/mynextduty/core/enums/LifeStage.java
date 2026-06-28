package com.mynextduty.core.enums;

public enum LifeStage {
  STUDENT("STUDENT"),                   // 16-25: Focus on education, career planning
  EARLY_CAREER("EARLY_CAREER"),         // 22-30: First job, financial basics, skill building
  CAREER_BUILDING("CAREER_BUILDING"),   // 25-35: Career growth, major purchases, relationships
  FAMILY_BUILDING("FAMILY_BUILDING"),   // 28-40: Marriage, kids, homeownership, insurance
  MID_CAREER("MID_CAREER"),             // 35-50: Peak earning, investments, children's education
  PRE_RETIREMENT("PRE_RETIREMENT"),     // 50-65: Retirement planning, health focus
  RETIREMENT("RETIREMENT"),             // 65+: Health maintenance, legacy planning
  SENIOR("SENIOR");                     // 75+: Health care, estate planning

  private final String value;

  LifeStage(String value) {
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
  public static LifeStage fromValue(String value) {
    for (LifeStage ls : values()) {
      if (ls.value.equalsIgnoreCase(value)) return ls;
    }
    throw new IllegalArgumentException("Unknown LifeStage: " + value);
  }
}
