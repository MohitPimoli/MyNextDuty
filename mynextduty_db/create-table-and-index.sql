CREATE SCHEMA IF NOT EXISTS core;

SET search_path TO core, public;

GRANT USAGE ON SCHEMA core TO core_prod_app_user;
GRANT CREATE ON SCHEMA core TO core_prod_app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA core TO core_prod_app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA core TO core_prod_app_user;

CREATE EXTENSION IF NOT EXISTS postgis;

-- ============================================================
-- ROLES
-- ============================================================
CREATE TABLE roles (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    role        VARCHAR(100) NOT NULL UNIQUE,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP
);

-- ============================================================
-- DASHBOARD PERMISSIONS
-- ============================================================
CREATE TABLE dashboard_permissions (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    dashboard       VARCHAR(150) NOT NULL,
    permission_type VARCHAR(100) NOT NULL,
    role_id         BIGINT NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP,
    CONSTRAINT fk_dashboard_permission_role
        FOREIGN KEY (role_id) REFERENCES roles(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_dashboard_permissions_role_id
    ON dashboard_permissions(role_id);

CREATE INDEX idx_dashboard_permissions_role_dashboard_perm
    ON dashboard_permissions(role_id, dashboard, permission_type);

-- ============================================================
-- EDUCATION LEVELS
-- ============================================================
CREATE TABLE education_levels (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    level_code  VARCHAR(255) NOT NULL UNIQUE,
    level_name  VARCHAR(255) NOT NULL,
    level_rank  INT,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP
);

CREATE UNIQUE INDEX idx_education_level_code ON education_levels(level_code);
CREATE INDEX idx_education_level_rank ON education_levels(level_rank);

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email               VARCHAR(255) NOT NULL UNIQUE,
    password_hash       TEXT NOT NULL,
    first_name          VARCHAR(255) NOT NULL,
    last_name           VARCHAR(255),
    age                 INT CHECK (age >= 0),
    date_of_birth       DATE,
    current_occupation  VARCHAR(255),
    education_level_id  BIGINT,
    is_verified         BOOLEAN NOT NULL DEFAULT FALSE,
    life_stage          VARCHAR(50),
    monthly_income      DOUBLE PRECISION,
    last_access_time    TIMESTAMP,
    role_id             BIGINT DEFAULT 3,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP,
    CONSTRAINT fk_users_education_level
        FOREIGN KEY (education_level_id) REFERENCES education_levels(id),
    CONSTRAINT fk_users_role
        FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_age ON users(age);
CREATE INDEX idx_users_education_level_id ON users(education_level_id);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_life_stage ON users(life_stage);

-- ============================================================
-- EMAIL VERIFICATION TOKENS
-- ============================================================
CREATE TABLE email_verification_tokens (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    token       VARCHAR(255) NOT NULL UNIQUE,
    user_id     BIGINT NOT NULL,
    expires_at  TIMESTAMP NOT NULL,
    used        BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_email_verification_tokens_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_email_verification_tokens_token ON email_verification_tokens(token);
CREATE INDEX idx_email_verification_tokens_user_id ON email_verification_tokens(user_id);
CREATE INDEX idx_email_verification_tokens_expires_at ON email_verification_tokens(expires_at);

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE categories (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon        VARCHAR(255),
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP
);

CREATE INDEX idx_categories_name ON categories(name);

-- ============================================================
-- INTERESTS
-- ============================================================
CREATE TABLE interests (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    category_id BIGINT NOT NULL,
    CONSTRAINT fk_interests_category
        FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE INDEX idx_interests_category_id ON interests(category_id);

-- ============================================================
-- USER INTERESTS
-- ============================================================
CREATE TABLE user_interests (
    id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id           BIGINT NOT NULL,
    interest_id       BIGINT NOT NULL,
    proficiency_level INT NOT NULL,  -- 1-5 scale
    created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP,
    CONSTRAINT fk_ui_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ui_interest
        FOREIGN KEY (interest_id) REFERENCES interests(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_interests_user ON user_interests(user_id);
CREATE INDEX idx_user_interests_interest ON user_interests(interest_id);

-- ============================================================
-- DUTIES
-- ============================================================
CREATE TABLE duties (
    id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title             VARCHAR(255) NOT NULL,
    description       VARCHAR(1000),
    category_id       BIGINT NOT NULL,
    priority          VARCHAR(50),
    target_life_stage VARCHAR(50),
    min_age           INT,
    max_age           INT,
    estimated_cost    DOUBLE PRECISION,
    time_to_complete  VARCHAR(255),
    is_active         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP,
    CONSTRAINT fk_duties_category
        FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE INDEX idx_duties_active ON duties(is_active);
CREATE INDEX idx_duties_category_id ON duties(category_id);
CREATE INDEX idx_duties_priority ON duties(priority);
CREATE INDEX idx_duties_target_life_stage ON duties(target_life_stage);

-- ============================================================
-- DUTY INTERESTS (many-to-many join table)
-- ============================================================
CREATE TABLE duty_interests (
    duty_id     BIGINT NOT NULL,
    interest_id BIGINT NOT NULL,
    PRIMARY KEY (duty_id, interest_id),
    CONSTRAINT fk_di_duty
        FOREIGN KEY (duty_id) REFERENCES duties(id) ON DELETE CASCADE,
    CONSTRAINT fk_di_interest
        FOREIGN KEY (interest_id) REFERENCES interests(id) ON DELETE CASCADE
);

CREATE INDEX idx_duty_interests_duty_id ON duty_interests(duty_id);
CREATE INDEX idx_duty_interests_interest_id ON duty_interests(interest_id);

-- ============================================================
-- GOALS
-- ============================================================
CREATE TABLE goals (
    id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title             VARCHAR(255) NOT NULL,
    description       VARCHAR(1000),
    category_id       BIGINT,
    target_life_stage VARCHAR(50),
    timeframe         VARCHAR(255),
    created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP,
    CONSTRAINT fk_goals_category
        FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE INDEX idx_goals_category_id ON goals(category_id);
CREATE INDEX idx_goals_target_life_stage ON goals(target_life_stage);

-- ============================================================
-- GOAL DUTIES (many-to-many join table)
-- ============================================================
CREATE TABLE goal_duties (
    goal_id  BIGINT NOT NULL,
    duty_id  BIGINT NOT NULL,
    PRIMARY KEY (goal_id, duty_id),
    CONSTRAINT fk_gd_goal
        FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE,
    CONSTRAINT fk_gd_duty
        FOREIGN KEY (duty_id) REFERENCES duties(id) ON DELETE CASCADE
);

CREATE INDEX idx_goal_duties_goal_id ON goal_duties(goal_id);
CREATE INDEX idx_goal_duties_duty_id ON goal_duties(duty_id);

-- ============================================================
-- USER GOALS
-- ============================================================
CREATE TABLE user_goals (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    goal_id         BIGINT NOT NULL,
    status          VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    target_date     TIMESTAMP,
    started_at      TIMESTAMP,
    completed_at    TIMESTAMP,
    personal_notes  TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP,
    CONSTRAINT fk_ug_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ug_goal
        FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_goals_user_id ON user_goals(user_id);
CREATE INDEX idx_user_goals_goal_id ON user_goals(goal_id);
CREATE INDEX idx_user_goals_status ON user_goals(status);

-- ============================================================
-- USER DUTY PROGRESS
-- ============================================================
CREATE TABLE user_duty_progress (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id             BIGINT NOT NULL,
    duty_id             BIGINT NOT NULL,
    status              VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    progress_percentage INT CHECK (progress_percentage BETWEEN 0 AND 100),
    notes               TEXT,
    started_at          TIMESTAMP,
    completed_at        TIMESTAMP,
    created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP,
    CONSTRAINT fk_udp_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_udp_duty
        FOREIGN KEY (duty_id) REFERENCES duties(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_duty UNIQUE (user_id, duty_id)
);

CREATE INDEX idx_udp_user ON user_duty_progress(user_id);
CREATE INDEX idx_udp_duty ON user_duty_progress(duty_id);
CREATE INDEX idx_udp_status ON user_duty_progress(status);

-- ============================================================
-- USER LOCATIONS
-- ============================================================
CREATE TABLE user_locations (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     BIGINT NOT NULL UNIQUE,
    location    GEOGRAPHY(Point, 4326) NOT NULL,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP,
    CONSTRAINT fk_user_locations_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_user_locations_location ON user_locations USING GIST (location);
CREATE INDEX idx_user_locations_user_id ON user_locations(user_id);

-- ============================================================
-- SEED: DEFAULT ROLES & PERMISSIONS
-- ============================================================
INSERT INTO roles (role) VALUES ('ADMIN'), ('READ-ONLY'), ('CUSTOMER');

INSERT INTO dashboard_permissions (dashboard, permission_type, role_id)
VALUES ('ALL', 'READ', 1), ('ALL', 'EDIT', 1);
