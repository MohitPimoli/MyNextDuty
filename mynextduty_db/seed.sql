-- =============================================================================
-- MyNextDuty — Seed Data
-- Schema: core  |  All enum columns are plain VARCHAR — no PG enum types needed.
-- Run with: psql -U <user> -d mynextduty_db -f seed.sql
-- =============================================================================

SET search_path TO core;

-- =============================================================================
-- 1. ROLES
-- =============================================================================
INSERT INTO roles (role, created_at) VALUES
  ('ROLE_ADMIN',    NOW()),
  ('ROLE_CUSTOMER', NOW())
ON CONFLICT (role) DO NOTHING;

-- =============================================================================
-- 2. EDUCATION LEVELS
-- =============================================================================
INSERT INTO education_levels (level_code, level_name, level_rank, is_active, created_at) VALUES
  ('NO_FORMAL',    'No Formal Education',       1, true, NOW()),
  ('PRIMARY',      'Primary School',            2, true, NOW()),
  ('MIDDLE',       'Middle School',             3, true, NOW()),
  ('HIGH_SCHOOL',  'High School / 10th',        4, true, NOW()),
  ('HIGHER_SEC',   'Higher Secondary / 12th',   5, true, NOW()),
  ('DIPLOMA',      'Diploma / ITI',             6, true, NOW()),
  ('BACHELORS',    'Bachelor''s Degree',        7, true, NOW()),
  ('MASTERS',      'Master''s Degree',          8, true, NOW()),
  ('PHD',          'Doctorate / PhD',           9, true, NOW()),
  ('PROFESSIONAL', 'Professional (CA/CS/Law)', 10, true, NOW())
ON CONFLICT (level_code) DO NOTHING;

-- =============================================================================
-- 3. CATEGORIES
-- =============================================================================
INSERT INTO categories (name, description, icon, created_at) VALUES
  ('Finance',       'Money management, savings, investments and insurance',   '💰', NOW()),
  ('Career',        'Job skills, professional growth and employment',         '💼', NOW()),
  ('Health',        'Physical fitness, mental wellness and medical care',     '🏥', NOW()),
  ('Education',     'Learning, certifications and academic development',      '📚', NOW()),
  ('Relationships', 'Family, social connections and community',               '❤️', NOW()),
  ('Housing',       'Renting, buying and maintaining a home',                 '🏠', NOW()),
  ('Legal',         'Legal documents, rights and civic responsibilities',     '⚖️', NOW()),
  ('Personal Dev',  'Habits, mindset, productivity and self-improvement',     '🌱', NOW()),
  ('Travel',        'Domestic and international travel planning',             '✈️', NOW()),
  ('Technology',    'Digital skills, online safety and tech literacy',        '💻', NOW())
ON CONFLICT (name) DO NOTHING;


-- =============================================================================
-- 4. INTERESTS
-- =============================================================================
INSERT INTO interests (name, description, category_id)
SELECT i.name, i.description, c.id
FROM (VALUES
  ('Stock Market Investing',  'Equity and stock market investment basics',           'Finance'),
  ('Mutual Funds',            'SIP, ELSS and diversified fund investments',          'Finance'),
  ('Personal Budgeting',      'Monthly budget planning and expense tracking',        'Finance'),
  ('Real Estate',             'Property investment and home buying',                 'Finance'),
  ('Cryptocurrency',          'Digital asset trading and blockchain basics',         'Finance'),
  ('Software Development',    'Programming, software engineering and coding',        'Career'),
  ('Data Science',            'Data analysis, ML and statistics',                   'Career'),
  ('Entrepreneurship',        'Starting and running a business',                    'Career'),
  ('Public Speaking',         'Communication, presentation and persuasion skills',  'Career'),
  ('Project Management',      'Agile, PMP and team coordination',                   'Career'),
  ('Fitness & Exercise',      'Gym, running and physical workouts',                 'Health'),
  ('Nutrition',               'Diet planning, healthy eating habits',                'Health'),
  ('Mental Health',           'Mindfulness, therapy and stress management',          'Health'),
  ('Yoga & Meditation',       'Mind-body practices and flexibility',                 'Health'),
  ('Online Courses',          'MOOCs, Coursera, Udemy and e-learning',              'Education'),
  ('Language Learning',       'Foreign language acquisition',                       'Education'),
  ('Reading & Literature',    'Books, research and continuous learning',             'Education'),
  ('Family Planning',         'Marriage, parenting and family finances',             'Relationships'),
  ('Networking',              'Professional and social relationship building',       'Relationships'),
  ('Home Ownership',          'Mortgage, maintenance and property management',       'Housing'),
  ('Tax Planning',            'Income tax filing and tax-saving strategies',         'Legal'),
  ('Habit Building',          'Forming productive daily routines',                   'Personal Dev'),
  ('Time Management',         'Prioritisation and productivity systems',             'Personal Dev'),
  ('Cybersecurity',           'Online safety, passwords and privacy',                'Technology'),
  ('AI & Machine Learning',   'Practical AI tools and foundational ML concepts',     'Technology')
) AS i(name, description, category_name)
JOIN categories c ON c.name = i.category_name;


-- =============================================================================
-- 5. DUTIES  — priority and target_life_stage are plain VARCHAR, no casting
-- =============================================================================
INSERT INTO duties (title, description, category_id, priority, target_life_stage,
                    min_age, max_age, estimated_cost, time_to_complete, is_active, created_at)
SELECT d.title, d.description, c.id,
       d.priority,            -- plain VARCHAR
       d.target_life_stage,   -- plain VARCHAR
       d.min_age, d.max_age, d.estimated_cost, d.time_to_complete, true, NOW()
FROM (VALUES
  -- STUDENT
  ('Open a Savings Account',
   'Open your first savings account to build the habit of saving money regularly.',
   'Finance','HIGH','STUDENT',16,25,0.0,'1 week'),
  ('Build an Emergency Fund',
   'Save 3-6 months of expenses in a liquid savings account for unexpected situations.',
   'Finance','CRITICAL','STUDENT',18,25,0.0,'6-12 months'),
  ('Get a Student Credit Card',
   'Start building credit history responsibly with a secured or student credit card.',
   'Finance','MEDIUM','STUDENT',18,25,500.0,'1 month'),
  ('Create a LinkedIn Profile',
   'Set up a professional LinkedIn profile to start networking and exploring careers.',
   'Career','HIGH','STUDENT',16,25,0.0,'1-2 days'),
  ('Complete an Internship',
   'Gain real-world work experience through a relevant internship in your field.',
   'Career','HIGH','STUDENT',18,25,0.0,'3-6 months'),
  ('Learn a Programming Language',
   'Pick one programming language and build foundational coding skills.',
   'Career','MEDIUM','STUDENT',16,25,500.0,'3-6 months'),
  ('Get Health Insurance',
   'Ensure you have basic health insurance coverage, either through college or a parent''s plan.',
   'Health','CRITICAL','STUDENT',18,25,800.0,'1 week'),
  ('Establish a Sleep Schedule',
   'Build a consistent sleep routine of 7-8 hours to improve focus and health.',
   'Health','MEDIUM','STUDENT',16,25,0.0,'1 month'),
  ('Complete 10th / 12th Education',
   'Finish foundational schooling which is required for most career paths.',
   'Education','CRITICAL','STUDENT',16,20,0.0,'1-3 years'),
  ('Enroll in a Bachelor''s Degree or Vocational Course',
   'Pursue higher education aligned with your career interests.',
   'Education','HIGH','STUDENT',17,25,50000.0,'3-4 years'),
  -- EARLY_CAREER
  ('Get Term Life Insurance',
   'Secure term life insurance to protect your family''s financial future.',
   'Finance','CRITICAL','EARLY_CAREER',22,30,500.0,'1-2 weeks'),
  ('Start SIP / Mutual Fund Investment',
   'Begin a monthly Systematic Investment Plan to grow wealth over time.',
   'Finance','HIGH','EARLY_CAREER',22,30,1000.0,'1 week'),
  ('File Income Tax Returns',
   'File your ITR annually and understand tax-saving instruments like 80C.',
   'Legal','HIGH','EARLY_CAREER',22,30,0.0,'Annually'),
  ('Build a Professional Resume',
   'Create a strong, ATS-optimised resume tailored to your target industry.',
   'Career','HIGH','EARLY_CAREER',22,30,0.0,'1-2 weeks'),
  ('Negotiate Your First Salary',
   'Learn salary negotiation tactics and confidently negotiate your compensation package.',
   'Career','HIGH','EARLY_CAREER',22,30,0.0,'Ongoing'),
  ('Join a Gym or Start Regular Exercise',
   'Establish a consistent fitness routine to maintain energy and long-term health.',
   'Health','MEDIUM','EARLY_CAREER',22,30,2000.0,'Ongoing'),
  ('Get a Medical Insurance Policy',
   'Purchase a personal health insurance policy independent of employer coverage.',
   'Health','CRITICAL','EARLY_CAREER',22,30,6000.0,'1-2 weeks'),
  ('Rent Your First Apartment',
   'Navigate the rental market: check agreements, deposits and tenant rights.',
   'Housing','MEDIUM','EARLY_CAREER',22,30,0.0,'1-3 months'),
  ('Set Up a Will / Nomination',
   'Nominate beneficiaries on all financial accounts and consider drafting a simple will.',
   'Legal','MEDIUM','EARLY_CAREER',22,30,2000.0,'1 month'),
  ('Complete a Professional Certification',
   'Earn an industry-recognised certification to boost career prospects.',
   'Education','HIGH','EARLY_CAREER',22,30,10000.0,'3-6 months')
) AS d(title, description, category_name, priority, target_life_stage,
       min_age, max_age, estimated_cost, time_to_complete)
JOIN categories c ON c.name = d.category_name;


-- CAREER_BUILDING → SENIOR duties (same pattern — plain VARCHAR, no casts)
INSERT INTO duties (title, description, category_id, priority, target_life_stage,
                    min_age, max_age, estimated_cost, time_to_complete, is_active, created_at)
SELECT d.title, d.description, c.id, d.priority, d.target_life_stage,
       d.min_age, d.max_age, d.estimated_cost, d.time_to_complete, true, NOW()
FROM (VALUES
  ('Maximize Retirement Savings',
   'Increase contributions to retirement accounts like EPF, PPF, and NPS.',
   'Finance','CRITICAL','CAREER_BUILDING',25,35,0.0,'Ongoing'),
  ('Buy a Home / Start Home Loan Planning',
   'Research home loan eligibility, down payment savings and suitable locations.',
   'Housing','HIGH','CAREER_BUILDING',28,35,500000.0,'6-12 months'),
  ('Invest in Direct Equity / Stocks',
   'Open a Demat account and start building a diversified equity portfolio.',
   'Finance','HIGH','CAREER_BUILDING',25,35,5000.0,'Ongoing'),
  ('Pursue a Leadership Role',
   'Actively seek team lead or managerial opportunities to accelerate career growth.',
   'Career','HIGH','CAREER_BUILDING',28,35,0.0,'1-2 years'),
  ('Complete a Master''s Degree or MBA',
   'Consider a postgraduate qualification to unlock senior career opportunities.',
   'Education','MEDIUM','CAREER_BUILDING',25,35,200000.0,'2 years'),
  ('Annual Full-body Health Checkup',
   'Schedule a comprehensive health checkup every year to catch issues early.',
   'Health','HIGH','CAREER_BUILDING',25,35,3000.0,'1 day'),
  ('Build a Side Income Stream',
   'Explore freelancing, consulting or a side business to diversify income.',
   'Career','MEDIUM','CAREER_BUILDING',25,35,0.0,'3-6 months'),
  ('Draft a Comprehensive Will',
   'Work with a lawyer to create a full legal will covering assets and guardianship.',
   'Legal','HIGH','CAREER_BUILDING',28,35,5000.0,'1 month'),
  -- FAMILY_BUILDING
  ('Get Life Insurance (Family Coverage)',
   'Upgrade to a higher-value term plan to cover your family''s financial security.',
   'Finance','CRITICAL','FAMILY_BUILDING',28,40,1000.0,'2 weeks'),
  ('Open Children''s Education Fund',
   'Start a dedicated savings/investment plan for children''s education expenses.',
   'Finance','HIGH','FAMILY_BUILDING',28,40,0.0,'1 month'),
  ('Plan for Child''s School Admission',
   'Research and prepare for competitive school admissions and required documents.',
   'Education','HIGH','FAMILY_BUILDING',28,40,0.0,'6-12 months'),
  ('Family Health Insurance Floater',
   'Upgrade to a family floater health policy covering spouse and children.',
   'Health','CRITICAL','FAMILY_BUILDING',28,40,15000.0,'2 weeks'),
  ('Estate Planning',
   'Plan the distribution of assets: trusts, nominations and property transfer.',
   'Legal','HIGH','FAMILY_BUILDING',30,40,10000.0,'2-3 months'),
  -- MID_CAREER
  ('Review and Rebalance Investment Portfolio',
   'Periodically review your asset allocation and rebalance to match risk tolerance.',
   'Finance','HIGH','MID_CAREER',35,50,0.0,'Quarterly'),
  ('Plan Children''s College Education',
   'Calculate future education costs and ensure you have adequate savings.',
   'Education','HIGH','MID_CAREER',35,50,0.0,'Ongoing'),
  ('Pay Off All High-Interest Debt',
   'Clear credit card balances and personal loans to reduce financial drag.',
   'Finance','CRITICAL','MID_CAREER',35,50,0.0,'1-3 years'),
  ('Senior Management / C-Suite Development',
   'Pursue executive education programs, board roles or senior leadership positions.',
   'Career','MEDIUM','MID_CAREER',40,50,50000.0,'Ongoing'),
  ('Start a Business / Scale Existing',
   'Leverage experience and capital to launch or scale a business venture.',
   'Career','MEDIUM','MID_CAREER',35,50,100000.0,'Ongoing'),
  -- PRE_RETIREMENT
  ('Create a Retirement Income Plan',
   'Model retirement expenses, income sources and gap analysis for your retirement years.',
   'Finance','CRITICAL','PRE_RETIREMENT',50,65,0.0,'3-6 months'),
  ('Maximise Pension and EPF Corpus',
   'Top up EPF voluntary contributions and review pension fund performance.',
   'Finance','CRITICAL','PRE_RETIREMENT',50,65,0.0,'Ongoing'),
  ('Downsize / Clear Home Loan',
   'Aim to have zero mortgage burden before retirement.',
   'Housing','HIGH','PRE_RETIREMENT',50,65,0.0,'Ongoing'),
  ('Long-term Care Insurance',
   'Research and purchase insurance covering assisted living and nursing care costs.',
   'Health','HIGH','PRE_RETIREMENT',55,65,20000.0,'1 month'),
  -- RETIREMENT
  ('Set Up Systematic Withdrawal Plan',
   'Convert corpus to a structured withdrawal plan to fund monthly retirement expenses.',
   'Finance','CRITICAL','RETIREMENT',65,80,0.0,'1 month'),
  ('Review Medicare / Senior Health Benefits',
   'Register for senior citizen health schemes and government benefits.',
   'Health','CRITICAL','RETIREMENT',65,80,0.0,'2 weeks'),
  ('Transfer Asset Ownership Legally',
   'Legally transfer property and financial assets to heirs or nominees.',
   'Legal','HIGH','RETIREMENT',65,80,15000.0,'3-6 months'),
  -- SENIOR
  ('Finalise Estate and Trust Documents',
   'Ensure all estate documents, trusts and power of attorney are up to date.',
   'Legal','CRITICAL','SENIOR',75,100,10000.0,'1 month'),
  ('Daily Health Monitoring Plan',
   'Set up a routine for medication, doctor visits and regular vital monitoring.',
   'Health','CRITICAL','SENIOR',75,100,2000.0,'Ongoing'),
  ('Document Family History and Legacy',
   'Record life stories, family history and important knowledge for future generations.',
   'Personal Dev','MEDIUM','SENIOR',75,100,0.0,'Ongoing')
) AS d(title, description, category_name, priority, target_life_stage,
       min_age, max_age, estimated_cost, time_to_complete)
JOIN categories c ON c.name = d.category_name;


-- =============================================================================
-- 6. DUTY_INTERESTS
-- =============================================================================
INSERT INTO duty_interests (duty_id, interest_id)
SELECT d.id, i.id FROM duties d JOIN interests i ON d.title = 'Open a Savings Account'              AND i.name = 'Personal Budgeting'
UNION ALL SELECT d.id, i.id FROM duties d JOIN interests i ON d.title = 'Build an Emergency Fund'           AND i.name = 'Personal Budgeting'
UNION ALL SELECT d.id, i.id FROM duties d JOIN interests i ON d.title = 'Start SIP / Mutual Fund Investment' AND i.name = 'Mutual Funds'
UNION ALL SELECT d.id, i.id FROM duties d JOIN interests i ON d.title = 'Invest in Direct Equity / Stocks'  AND i.name = 'Stock Market Investing'
UNION ALL SELECT d.id, i.id FROM duties d JOIN interests i ON d.title = 'Invest in Direct Equity / Stocks'  AND i.name = 'Personal Budgeting'
UNION ALL SELECT d.id, i.id FROM duties d JOIN interests i ON d.title = 'Learn a Programming Language'       AND i.name = 'Software Development'
UNION ALL SELECT d.id, i.id FROM duties d JOIN interests i ON d.title = 'Complete a Professional Certification' AND i.name = 'Online Courses'
UNION ALL SELECT d.id, i.id FROM duties d JOIN interests i ON d.title = 'Complete a Master''s Degree or MBA' AND i.name = 'Online Courses'
UNION ALL SELECT d.id, i.id FROM duties d JOIN interests i ON d.title = 'File Income Tax Returns'            AND i.name = 'Tax Planning'
UNION ALL SELECT d.id, i.id FROM duties d JOIN interests i ON d.title = 'Build a Side Income Stream'         AND i.name = 'Entrepreneurship'
UNION ALL SELECT d.id, i.id FROM duties d JOIN interests i ON d.title = 'Start a Business / Scale Existing'  AND i.name = 'Entrepreneurship'
UNION ALL SELECT d.id, i.id FROM duties d JOIN interests i ON d.title = 'Join a Gym or Start Regular Exercise' AND i.name = 'Fitness & Exercise'
UNION ALL SELECT d.id, i.id FROM duties d JOIN interests i ON d.title = 'Annual Full-body Health Checkup'    AND i.name = 'Fitness & Exercise'
UNION ALL SELECT d.id, i.id FROM duties d JOIN interests i ON d.title = 'Daily Health Monitoring Plan'       AND i.name = 'Fitness & Exercise'
UNION ALL SELECT d.id, i.id FROM duties d JOIN interests i ON d.title = 'Buy a Home / Start Home Loan Planning' AND i.name = 'Real Estate'
UNION ALL SELECT d.id, i.id FROM duties d JOIN interests i ON d.title = 'Rent Your First Apartment'          AND i.name = 'Home Ownership'
UNION ALL SELECT d.id, i.id FROM duties d JOIN interests i ON d.title = 'Create a LinkedIn Profile'          AND i.name = 'Networking'
UNION ALL SELECT d.id, i.id FROM duties d JOIN interests i ON d.title = 'Negotiate Your First Salary'        AND i.name = 'Public Speaking'
UNION ALL SELECT d.id, i.id FROM duties d JOIN interests i ON d.title = 'Pursue a Leadership Role'           AND i.name = 'Project Management';

-- =============================================================================
-- 7. GOALS  — target_life_stage is plain VARCHAR
-- =============================================================================
INSERT INTO goals (title, description, category_id, target_life_stage, timeframe, created_at)
SELECT g.title, g.description, c.id, g.target_life_stage, g.timeframe, NOW()
FROM (VALUES
  ('Achieve Financial Independence',
   'Build enough passive income and savings to cover living expenses without active work.',
   'Finance', 'MID_CAREER',      '10-15 years'),
  ('Become Debt-Free',
   'Eliminate all personal debt including credit cards, personal loans and home loans.',
   'Finance', 'CAREER_BUILDING', '3-5 years'),
  ('Land Your First Job',
   'Successfully transition from education to employment in your chosen field.',
   'Career',  'STUDENT',         '6-12 months'),
  ('Reach Senior Management',
   'Progress to a director, VP or C-suite role through consistent career development.',
   'Career',  'MID_CAREER',      '5-10 years'),
  ('Build a Healthy Lifestyle',
   'Establish sustainable habits around exercise, nutrition and mental wellness.',
   'Health',  'EARLY_CAREER',    '6-12 months'),
  ('Own a Home',
   'Purchase a property suited to your family''s needs and financial situation.',
   'Housing', 'CAREER_BUILDING', '3-5 years'),
  ('Secure Your Retirement',
   'Build a sufficient retirement corpus to maintain your lifestyle post-retirement.',
   'Finance', 'PRE_RETIREMENT',  '5-10 years'),
  ('Raise a Family',
   'Plan and support a family including education, health and emotional well-being.',
   'Relationships', 'FAMILY_BUILDING', '15-20 years'),
  ('Complete Higher Education',
   'Finish a bachelor''s or postgraduate degree to open career opportunities.',
   'Education', 'STUDENT',       '3-5 years'),
  ('Start and Scale a Business',
   'Launch a business venture, achieve profitability and grow it sustainably.',
   'Career',  'CAREER_BUILDING', '3-7 years')
) AS g(title, description, category_name, target_life_stage, timeframe)
JOIN categories c ON c.name = g.category_name;


-- =============================================================================
-- 8. GOAL_DUTIES
-- =============================================================================
INSERT INTO goal_duties (goal_id, duty_id)
SELECT g.id, d.id FROM goals g JOIN duties d ON g.title = 'Achieve Financial Independence'    AND d.title = 'Start SIP / Mutual Fund Investment'
UNION ALL SELECT g.id, d.id FROM goals g JOIN duties d ON g.title = 'Achieve Financial Independence'    AND d.title = 'Invest in Direct Equity / Stocks'
UNION ALL SELECT g.id, d.id FROM goals g JOIN duties d ON g.title = 'Achieve Financial Independence'    AND d.title = 'Maximize Retirement Savings'
UNION ALL SELECT g.id, d.id FROM goals g JOIN duties d ON g.title = 'Become Debt-Free'                  AND d.title = 'Pay Off All High-Interest Debt'
UNION ALL SELECT g.id, d.id FROM goals g JOIN duties d ON g.title = 'Become Debt-Free'                  AND d.title = 'File Income Tax Returns'
UNION ALL SELECT g.id, d.id FROM goals g JOIN duties d ON g.title = 'Land Your First Job'               AND d.title = 'Create a LinkedIn Profile'
UNION ALL SELECT g.id, d.id FROM goals g JOIN duties d ON g.title = 'Land Your First Job'               AND d.title = 'Build a Professional Resume'
UNION ALL SELECT g.id, d.id FROM goals g JOIN duties d ON g.title = 'Land Your First Job'               AND d.title = 'Complete an Internship'
UNION ALL SELECT g.id, d.id FROM goals g JOIN duties d ON g.title = 'Reach Senior Management'           AND d.title = 'Pursue a Leadership Role'
UNION ALL SELECT g.id, d.id FROM goals g JOIN duties d ON g.title = 'Reach Senior Management'           AND d.title = 'Complete a Master''s Degree or MBA'
UNION ALL SELECT g.id, d.id FROM goals g JOIN duties d ON g.title = 'Build a Healthy Lifestyle'         AND d.title = 'Join a Gym or Start Regular Exercise'
UNION ALL SELECT g.id, d.id FROM goals g JOIN duties d ON g.title = 'Build a Healthy Lifestyle'         AND d.title = 'Annual Full-body Health Checkup'
UNION ALL SELECT g.id, d.id FROM goals g JOIN duties d ON g.title = 'Own a Home'                        AND d.title = 'Buy a Home / Start Home Loan Planning'
UNION ALL SELECT g.id, d.id FROM goals g JOIN duties d ON g.title = 'Secure Your Retirement'            AND d.title = 'Create a Retirement Income Plan'
UNION ALL SELECT g.id, d.id FROM goals g JOIN duties d ON g.title = 'Secure Your Retirement'            AND d.title = 'Maximise Pension and EPF Corpus'
UNION ALL SELECT g.id, d.id FROM goals g JOIN duties d ON g.title = 'Complete Higher Education'         AND d.title = 'Enroll in a Bachelor''s Degree or Vocational Course'
UNION ALL SELECT g.id, d.id FROM goals g JOIN duties d ON g.title = 'Complete Higher Education'         AND d.title = 'Complete 10th / 12th Education'
UNION ALL SELECT g.id, d.id FROM goals g JOIN duties d ON g.title = 'Start and Scale a Business'        AND d.title = 'Build a Side Income Stream'
UNION ALL SELECT g.id, d.id FROM goals g JOIN duties d ON g.title = 'Start and Scale a Business'        AND d.title = 'Start a Business / Scale Existing';

-- =============================================================================
-- 9. DASHBOARD PERMISSIONS
-- =============================================================================
INSERT INTO dashboard_permissions (dashboard, permission_type, role_id, created_at)
SELECT dp.dashboard, dp.permission_type, r.id, NOW()
FROM (VALUES
  ('user_management', 'READ',   'ROLE_ADMIN'),
  ('user_management', 'WRITE',  'ROLE_ADMIN'),
  ('user_management', 'DELETE', 'ROLE_ADMIN'),
  ('duty_management', 'READ',   'ROLE_ADMIN'),
  ('duty_management', 'WRITE',  'ROLE_ADMIN'),
  ('duty_management', 'DELETE', 'ROLE_ADMIN'),
  ('goal_management', 'READ',   'ROLE_ADMIN'),
  ('goal_management', 'WRITE',  'ROLE_ADMIN'),
  ('analytics',       'READ',   'ROLE_ADMIN'),
  ('duty_management', 'READ',   'ROLE_CUSTOMER'),
  ('goal_management', 'READ',   'ROLE_CUSTOMER'),
  ('own_profile',     'READ',   'ROLE_CUSTOMER'),
  ('own_profile',     'WRITE',  'ROLE_CUSTOMER')
) AS dp(dashboard, permission_type, role_name)
JOIN roles r ON r.role = dp.role_name;


-- =============================================================================
-- 10. USERS
-- NOTE: Replace the password_hash value below with a real Argon2id hash.
--       Easiest way: register via the API once, copy the hash from users table,
--       then UPDATE the other rows to use the same hash.
-- =============================================================================
INSERT INTO users (email, password_hash, first_name, last_name, age, current_occupation,
                   education_level_id, life_stage, monthly_income, is_verified, created_at, role_id)
SELECT u.email,
       '$argon2id$v=19$m=16384,t=2,p=1$REPLACE_WITH_REAL_HASH',
       u.first_name, u.last_name, u.age, u.occupation,
       el.id,
       u.life_stage,   -- plain VARCHAR
       u.monthly_income, true, NOW(), r.id
FROM (VALUES
  ('admin@mynextduty.com', 'System', 'Admin', 28, 'Software Engineer',
   'BACHELORS', 'EARLY_CAREER',    85000.0, 'ROLE_ADMIN'),
  ('mohit@example.com',    'Mohit',  'Sharma', 26, 'Backend Developer',
   'BACHELORS', 'EARLY_CAREER',    70000.0, 'ROLE_CUSTOMER'),
  ('priya@example.com',    'Priya',  'Verma',  32, 'Product Manager',
   'MASTERS',   'CAREER_BUILDING', 110000.0,'ROLE_CUSTOMER')
) AS u(email, first_name, last_name, age, occupation,
       edu_code, life_stage, monthly_income, role_name)
JOIN education_levels el ON el.level_code = u.edu_code
JOIN roles             r  ON r.role        = u.role_name
ON CONFLICT (email) DO NOTHING;

-- =============================================================================
-- 11. USER_INTERESTS
-- =============================================================================
INSERT INTO user_interests (user_id, interest_id, proficiency_level, created_at)
SELECT u.id, i.id, ui.proficiency, NOW()
FROM (VALUES
  ('mohit@example.com', 'Software Development',  5),
  ('mohit@example.com', 'Stock Market Investing', 3),
  ('mohit@example.com', 'Mutual Funds',           3),
  ('mohit@example.com', 'Personal Budgeting',     4),
  ('mohit@example.com', 'Fitness & Exercise',     2),
  ('mohit@example.com', 'Online Courses',         4),
  ('priya@example.com', 'Project Management',     5),
  ('priya@example.com', 'Entrepreneurship',       4),
  ('priya@example.com', 'Real Estate',            3),
  ('priya@example.com', 'Mental Health',          3),
  ('priya@example.com', 'Family Planning',        4),
  ('priya@example.com', 'Tax Planning',           3)
) AS ui(email, interest_name, proficiency)
JOIN users     u ON u.email = ui.email
JOIN interests i ON i.name  = ui.interest_name;

-- =============================================================================
-- 12. USER_DUTY_PROGRESS  — status is plain VARCHAR
-- =============================================================================
INSERT INTO user_duty_progress (user_id, duty_id, status, progress_percentage,
                                 notes, started_at, completed_at, created_at)
SELECT u.id, d.id, up.status, up.pct, up.notes,
       CASE WHEN up.status != 'PENDING'   THEN NOW() - INTERVAL '30 days' END,
       CASE WHEN up.status = 'COMPLETED'  THEN NOW() - INTERVAL '5 days'  END,
       NOW()
FROM (VALUES
  ('mohit@example.com', 'Build an Emergency Fund',            'IN_PROGRESS', 60,  'Saving ₹5k/month'),
  ('mohit@example.com', 'Create a LinkedIn Profile',          'COMPLETED',   100, 'Profile live with 200+ connections'),
  ('mohit@example.com', 'Get a Medical Insurance Policy',     'COMPLETED',   100, 'Star Health policy active'),
  ('mohit@example.com', 'Start SIP / Mutual Fund Investment', 'IN_PROGRESS', 40,  'SIP of ₹3k/month in ELSS'),
  ('mohit@example.com', 'File Income Tax Returns',            'COMPLETED',   100, 'FY 2024-25 filed'),
  ('mohit@example.com', 'Complete a Professional Certification','PENDING',   0,   NULL),
  ('priya@example.com', 'Maximize Retirement Savings',        'IN_PROGRESS', 50,  'NPS + VPF active'),
  ('priya@example.com', 'Buy a Home / Start Home Loan Planning','IN_PROGRESS',30, 'Site visits ongoing in Pune'),
  ('priya@example.com', 'Annual Full-body Health Checkup',    'COMPLETED',   100, 'Done at Apollo in Jan'),
  ('priya@example.com', 'Family Health Insurance Floater',    'COMPLETED',   100, 'HDFC Ergo floater active'),
  ('priya@example.com', 'Draft a Comprehensive Will',         'PENDING',     0,   NULL),
  ('priya@example.com', 'Build a Side Income Stream',         'IN_PROGRESS', 20,  'Exploring consulting work')
) AS up(email, duty_title, status, pct, notes)
JOIN users  u ON u.email = up.email
JOIN duties d ON d.title = up.duty_title;

-- =============================================================================
-- 13. USER_GOALS  — status is plain VARCHAR
-- =============================================================================
INSERT INTO user_goals (user_id, goal_id, status, target_date, started_at, personal_notes, created_at)
SELECT u.id, g.id, ug.status,
       NOW() + (ug.months_ahead || ' months')::INTERVAL,
       CASE WHEN ug.status != 'PENDING' THEN NOW() - INTERVAL '60 days' END,
       ug.notes, NOW()
FROM (VALUES
  ('mohit@example.com', 'Achieve Financial Independence', 'IN_PROGRESS', 120, 'Target by age 40'),
  ('mohit@example.com', 'Build a Healthy Lifestyle',      'IN_PROGRESS',  12, 'Running 3x per week'),
  ('mohit@example.com', 'Land Your First Job',            'COMPLETED',     0, 'Joined current company'),
  ('priya@example.com', 'Reach Senior Management',        'IN_PROGRESS',  36, 'Aiming for Director role'),
  ('priya@example.com', 'Own a Home',                     'IN_PROGRESS',  24, 'Targeting Pune suburbs'),
  ('priya@example.com', 'Raise a Family',                 'IN_PROGRESS', 180, 'Long-term family plan'),
  ('priya@example.com', 'Become Debt-Free',               'IN_PROGRESS',  60, 'Clear car loan first')
) AS ug(email, goal_title, status, months_ahead, notes)
JOIN users u ON u.email = ug.email
JOIN goals g ON g.title = ug.goal_title;

-- =============================================================================
-- 14. USER_LOCATIONS  (PostGIS geography — lon, lat order)
-- =============================================================================
INSERT INTO user_locations (user_id, location, created_at)
SELECT u.id,
       ST_SetSRID(ST_MakePoint(ul.lon, ul.lat), 4326)::geography,
       NOW()
FROM (VALUES
  ('mohit@example.com', 77.2090, 28.6139),
  ('priya@example.com', 73.8567, 18.5204)
) AS ul(email, lon, lat)
JOIN users u ON u.email = ul.email
ON CONFLICT (user_id) DO UPDATE SET location = EXCLUDED.location, updated_at = NOW();

-- =============================================================================
-- VERIFICATION (uncomment to check row counts after seeding)
-- =============================================================================
-- SELECT tablename, (xpath('/row/c/text()', query_to_xml('SELECT COUNT(*) AS c FROM core.' || tablename, false, true, '')))[1]::text::int AS rows
-- FROM pg_tables WHERE schemaname = 'core' ORDER BY tablename;
