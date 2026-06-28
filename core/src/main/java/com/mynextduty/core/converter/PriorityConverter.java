package com.mynextduty.core.converter;

import com.mynextduty.core.enums.Priority;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * Converts {@link Priority} ↔ {@code VARCHAR} in the DB.
 * Stores the enum name (e.g. "CRITICAL") as a plain string — no PostgreSQL enum type needed.
 */
@Converter(autoApply = false)
public class PriorityConverter implements AttributeConverter<Priority, String> {

    @Override
    public String convertToDatabaseColumn(Priority attribute) {
        if (attribute == null) return null;
        return attribute.getValue();
    }

    @Override
    public Priority convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        return Priority.fromValue(dbData);
    }
}
