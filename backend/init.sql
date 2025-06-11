-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set timezone
SET timezone = 'UTC';

-- Enable pgcrypto for encryption functions (if needed)
CREATE EXTENSION IF NOT EXISTS pgcrypto;