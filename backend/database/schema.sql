CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_enum') THEN
        CREATE TYPE status_enum AS ENUM ('active', 'inactive', 'blocked', 'deleted');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_enum') THEN
        CREATE TYPE role_enum AS ENUM ('user', 'admin');
    END IF;
END$$;

CREATE OR REPLACE FUNCTION uuid_generate_v7()
RETURNS UUID AS $function$
DECLARE
    ts_ms BIGINT;
    ts_hex TEXT;
    random_hex TEXT;
    uuid_str TEXT;
BEGIN
    ts_ms := FLOOR(EXTRACT(EPOCH FROM CLOCK_TIMESTAMP()) * 1000)::BIGINT;
    ts_hex := lpad(to_hex(ts_ms), 12, '0');
    random_hex := encode(gen_random_bytes(10), 'hex');
    uuid_str := ts_hex || random_hex;
    uuid_str := substring(uuid_str from 1 for 8) || '-' ||
                substring(uuid_str from 9 for 4) || '-' ||
                substring(uuid_str from 13 for 4) || '-' ||
                substring(uuid_str from 17 for 4) || '-' ||
                substring(uuid_str from 21 for 12);
    uuid_str := overlay(uuid_str placing '7' from 15 for 1);
    uuid_str := overlay(uuid_str placing '8' from 20 for 1);
    RETURN uuid_str::UUID;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Erro ao gerar UUIDv7: %', SQLERRM;
END;
$function$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION current_timestamp_ms()
RETURNS BIGINT AS $function$
BEGIN
    RETURN (EXTRACT(EPOCH FROM (NOW() AT TIME ZONE 'America/Sao_Paulo')) * 1000)::BIGINT;
END;
$function$ LANGUAGE plpgsql;

DROP TABLE IF EXISTS "client";
DROP TABLE IF EXISTS "user";

CREATE TABLE IF NOT EXISTS "user" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
    fullname VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    last_access BIGINT,
    password VARCHAR(255) NOT NULL,
    status status_enum DEFAULT 'active',
    role role_enum DEFAULT 'user',
    verified BOOLEAN DEFAULT false,
    created_at BIGINT DEFAULT current_timestamp_ms(),
    updated_at BIGINT DEFAULT current_timestamp_ms(),
    deleted_at BIGINT,
    CONSTRAINT unique_user_email UNIQUE (email),
    CONSTRAINT unique_user_username UNIQUE (username)
);

CREATE TABLE IF NOT EXISTS "client" (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    salary DECIMAL(10,2) NOT NULL CHECK (salary >= 0),
    company_value DECIMAL(15,2) NOT NULL CHECK (company_value >= 0),
    status status_enum DEFAULT 'active',
    created_at BIGINT DEFAULT current_timestamp_ms(),
    updated_at BIGINT DEFAULT current_timestamp_ms(),
    deleted_at BIGINT,
    CONSTRAINT fk_client_user FOREIGN KEY (user_id) REFERENCES "user"(id)
);

CREATE INDEX IF NOT EXISTS idx_user_email ON "user"(email);
CREATE INDEX IF NOT EXISTS idx_user_username ON "user"(username);
CREATE INDEX IF NOT EXISTS idx_user_status ON "user"(status);
CREATE INDEX IF NOT EXISTS idx_client_user_id ON "client"(user_id);
CREATE INDEX IF NOT EXISTS idx_client_name ON "client"(name);
CREATE INDEX IF NOT EXISTS idx_client_status ON "client"(status);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $function$
BEGIN
    NEW.updated_at = current_timestamp_ms();
    IF TG_OP = 'DELETE' THEN
        NEW.status = 'deleted';
        NEW.deleted_at = current_timestamp_ms();
        RETURN NEW;
    END IF;
    RETURN NEW;
END;
$function$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_updated_at ON "user";
DROP TRIGGER IF EXISTS update_client_updated_at ON "client";

CREATE TRIGGER update_user_updated_at
    BEFORE UPDATE ON "user"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_updated_at
    BEFORE UPDATE ON "client"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
