-- Create Database
CREATE DATABASE IF NOT EXISTS bookfair_stalls;

-- Connect to the database (use \c in psql)
-- \c bookfair_stalls;

-- Create Stalls Table
CREATE TABLE IF NOT EXISTS stalls (
    id BIGSERIAL PRIMARY KEY,
    stall_name VARCHAR(10) NOT NULL UNIQUE,
    size VARCHAR(20) NOT NULL CHECK (size IN ('SMALL', 'MEDIUM', 'LARGE')),
    dimension DOUBLE PRECISION NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'RESERVED', 'MAINTENANCE')),
    position_x INTEGER NOT NULL,
    position_y INTEGER NOT NULL,
    description VARCHAR(500),
    reserved_by BIGINT,
    reservation_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Create Indexes
CREATE INDEX IF NOT EXISTS idx_stalls_status ON stalls(status);
CREATE INDEX IF NOT EXISTS idx_stalls_size ON stalls(size);
CREATE INDEX IF NOT EXISTS idx_stalls_reserved_by ON stalls(reserved_by);
CREATE INDEX IF NOT EXISTS idx_stalls_reservation_id ON stalls(reservation_id);
CREATE INDEX IF NOT EXISTS idx_stalls_position ON stalls(position_x, position_y);

-- Insert Sample Data
INSERT INTO stalls (stall_name, size, dimension, price, status, position_x, position_y, description) VALUES
('A1', 'SMALL', 10.0, 5000.00, 'AVAILABLE', 0, 0, 'Small stall at entrance area'),
('A2', 'SMALL', 10.0, 5000.00, 'AVAILABLE', 1, 0, 'Small stall near A1'),
('A3', 'SMALL', 10.0, 5000.00, 'AVAILABLE', 2, 0, 'Small stall in row A'),
('A4', 'SMALL', 10.0, 5500.00, 'AVAILABLE', 3, 0, 'Premium small stall'),
('A5', 'SMALL', 10.0, 5500.00, 'AVAILABLE', 4, 0, 'Corner small stall'),
('B1', 'MEDIUM', 20.0, 8000.00, 'AVAILABLE', 0, 1, 'Medium stall in row B'),
('B2', 'MEDIUM', 20.0, 8000.00, 'AVAILABLE', 1, 1, 'Medium stall with good visibility'),
('B3', 'MEDIUM', 20.0, 8000.00, 'AVAILABLE', 2, 1, 'Medium stall in prime location'),
('B4', 'MEDIUM', 20.0, 8500.00, 'AVAILABLE', 3, 1, 'Premium medium stall'),
('B5', 'MEDIUM', 20.0, 8500.00, 'AVAILABLE', 4, 1, 'Corner medium stall'),
('C1', 'LARGE', 30.0, 12000.00, 'AVAILABLE', 0, 2, 'Large corner stall'),
('C2', 'LARGE', 30.0, 12000.00, 'AVAILABLE', 1, 2, 'Large stall with storage'),
('C3', 'LARGE', 30.0, 12000.00, 'AVAILABLE', 2, 2, 'Premium large stall'),
('C4', 'LARGE', 30.0, 13000.00, 'AVAILABLE', 3, 2, 'VIP large stall'),
('C5', 'LARGE', 30.0, 13000.00, 'AVAILABLE', 4, 2, 'Executive large stall'),
('D1', 'SMALL', 10.0, 5000.00, 'AVAILABLE', 0, 3, 'Small stall in back area'),
('D2', 'MEDIUM', 20.0, 8000.00, 'AVAILABLE', 1, 3, 'Medium stall near facilities'),
('D3', 'LARGE', 30.0, 12000.00, 'AVAILABLE', 2, 3, 'Large stall with demo space'),
('E1', 'SMALL', 10.0, 5500.00, 'AVAILABLE', 0, 4, 'Small premium stall'),
('E2', 'MEDIUM', 20.0, 8500.00, 'AVAILABLE', 1, 4, 'Medium stall central location'),
('E3', 'LARGE', 30.0, 13000.00, 'AVAILABLE', 2, 4, 'Large premium corner stall')
ON CONFLICT (stall_name) DO NOTHING;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_stalls_updated_at ON stalls;
CREATE TRIGGER update_stalls_updated_at BEFORE UPDATE
    ON stalls FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create view for stall statistics
CREATE OR REPLACE VIEW stall_statistics AS
SELECT
    size,
    status,
    COUNT(*) as count,
    SUM(price) as total_value,
    AVG(price) as avg_price,
    MIN(price) as min_price,
    MAX(price) as max_price
FROM stalls
GROUP BY size, status
ORDER BY size, status;

-- Create view for available stalls summary
CREATE OR REPLACE VIEW available_stalls_summary AS
SELECT
    size,
    COUNT(*) as available_count,
    AVG(price) as avg_price,
    MIN(price) as min_price,
    MAX(price) as max_price
FROM stalls
WHERE status = 'AVAILABLE'
GROUP BY size
ORDER BY
    CASE
    WHEN size = 'SMALL' THEN 1
    WHEN size = 'MEDIUM' THEN 2
    WHEN size = 'LARGE' THEN 3
END;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE bookfair_stalls TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
