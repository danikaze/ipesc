# IPESC

Utilities and data for the IPESC racing community.

[Check the data here](http://danikaze.github.io/ipesc).

## Dev

To generate the user script files in `dist-fns` (that will be provided in the admin page)

```sh
npm run build:fns
```

To build a static version of the pages

```sh
npm run build:pages
```

Which will trigger

```sh
npm run build:process-data
```

generating a _lightweight_ version of the raw data (from [raw-sgp-data](./raw-sgp-data/)) into `src/processed-data/` in the needed format to show the data, imported by the rest of the components.
