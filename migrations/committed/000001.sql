--! Previous: -
--! Hash: sha1:d4ce5b1af02aacda1868c85d1945567fe6af74dd

DROP TABLE IF EXISTS comments;

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  author TEXT NOT NULL,
  url TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  body_tsv TSVECTOR
);

CREATE INDEX comments_body_tsv_idx ON comments USING gin(body_tsv);

CREATE TRIGGER comments_body_tsv_update
BEFORE INSERT OR UPDATE ON comments
FOR EACH ROW
EXECUTE FUNCTION tsvector_update_trigger(body_tsv, 'pg_catalog.english', body, author, url);
