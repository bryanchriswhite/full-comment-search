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
