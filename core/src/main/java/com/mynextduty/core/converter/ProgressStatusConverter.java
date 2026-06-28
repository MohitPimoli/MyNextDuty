package com.mynextduty.core.converter;

import com.mynextduty.core.enums.ProgressStatus;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * Converts {@link ProgressStatus} ↔ {@code VARCHAR} in the DB.
 * Stores the enum name (e.g. "IN_PROGRESS") as a plain string.
 */
@Converter(autoApply = false)
public class ProgressStatusConverter implements AttributeConverter<ProgressStatus, String> {

    @Override
    public String convertToDatabaseColumn(ProgressStatus attribute) {
        if (attribute == null) return null;
        return attribute.getValue();
    }

    @Override
    public ProgressStatus convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        return ProgressStatus.fromValue(dbData);
    }
}
