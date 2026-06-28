package com.mynextduty.core.converter;

import com.mynextduty.core.enums.LifeStage;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

/**
 * Converts {@link LifeStage} ↔ {@code VARCHAR} in the DB.
 * Stores the enum name (e.g. "EARLY_CAREER") as a plain string.
 */
@Converter(autoApply = false)
public class LifeStageConverter implements AttributeConverter<LifeStage, String> {

    @Override
    public String convertToDatabaseColumn(LifeStage attribute) {
        if (attribute == null) return null;
        return attribute.getValue();
    }

    @Override
    public LifeStage convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        return LifeStage.fromValue(dbData);
    }
}
