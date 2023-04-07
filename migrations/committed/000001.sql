--! Previous: -
--! Hash: sha1:925f1615b26301f9f9733cc89a9abb0d68ff3f78

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

DROP FUNCTION IF EXISTS comments_search_results;
CREATE OR REPLACE FUNCTION comments_search_results(query text)
    returns table(
    id int,
    author text,
    url text,
    rank numeric,
    body text
    )
as
$$
   SELECT id, author, url, ts_rank(body_tsv, to_tsquery('english', query)) AS rank, body
     FROM comments
     WHERE body_tsv @@ to_tsquery('english', query)
     ORDER BY rank DESC;
$$ LANGUAGE sql stable;
