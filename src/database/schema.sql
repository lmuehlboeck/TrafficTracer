CREATE TABLE IF NOT EXISTS incidents (
    id TEXT PRIMARY KEY NOT NULL,
    type INTEGER NOT NULL,
    road_id INTEGER NOT NULL,
    from_dest TEXT NOT NULL,
    to_dest TEXT NOT NULL,
    direction TEXT,
    length INTEGER,
    delay INTEGER,

    FOREIGN KEY (road_id) REFERENCES roads(id)
)

CREATE TABLE IF NOT EXISTS roads (
    id INTEGER PRIMARY KEY NOT NULL,
    nr TEXT,
    name TEXT,
    UNIQUE(nr,name)
)

CREATE TABLE IF NOT EXISTS descriptions (
    incident_id TEXT NOT NULL,
    description TEXT,

    FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE,
    PRIMARY KEY (incident_id, description)
)

CREATE TABLE IF NOT EXISTS bboxes (
    id INTEGER PRIMARY KEY NOT NULL,
    enabled INTEGER DEFAULT 0 NOT NULL,
    description TEXT,
    bbox TEXT NOT NULL
)

CREATE TABLE IF NOT EXISTS settings (
    key TEXT NOT NULL,
    value_int INTEGER,
    value_text TEXT
)