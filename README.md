# GitHub Full-Text Comment Search

## Getting Started

```
# Install `yarn` globally
npm i -g yarn

# Install nodejs dependencies
yarn install

# Start everything
yarn up
# (may need to restart after initial DB start)
```

### Starting service(s)
```
yarn up [service]
```

### Stopping service(s)
```
# Stop everything
yarn  down

# OR a specific service
yarn stop <service>
```

## Database Migrations

Database migrations are facilitated by [graphile-migrate](https://github.com/graphile/migrate)

```
yarn migrate <command>
```
(see: [`graphile-migrate` CLI usage](https://github.com/graphile/migrate#graphile-migrate-1))

## Architecture

```mermaid
graph TD
    subgraph Postgres
        ts[full-text search engine]
        rd[relational database]
    end

    subgraph Postgresphile
        gq[postgres GraphQL Server]
    end

    subgraph Indexer
        xs[xstate Finite State Machine]
        gh[GitHub GQL Client]
        bq[Bull queue processing]
    end

    subgraph rs[Redis]
        ss[SET]
    end

    subgraph GitHub
        ghgq[GitHub GraphQL API]
    end

    subgraph Frontend Web UI
        rc[React]
        rx[Redux]
    end

    rc --> rx
    rx --> gq

    bq --> ss

    xs --> bq
    xs --> rd
    xs --> gh

    gq --> ts
    gq --> rd

    gh --> ghgq
```
