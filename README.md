# GitHub Full-Text Comment Search

## Getting Started

```
# Install `yarn` globally
npm i -g yarn

# Install nodejs dependencies
yarn install

# Start the postgraphile server
yarn start
# (may need to restart after initial DB start)

# Run initial DB migrations
yarn migrate migrate
```

## Database Migrations

Database migrations are facilitated by [graphile-migrate](https://github.com/graphile/migrate)

```
yarn migrate <command>
```
(see: [`graphile-migrate` CLI usage](https://github.com/graphile/migrate#graphile-migrate-1))
