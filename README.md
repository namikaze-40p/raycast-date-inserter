# Date Inserter for Raycast

Pick a date from a keyboard-driven calendar and insert it at the cursor in any app, in your own format.

See [extension/README.md](extension/README.md) for usage. That file is the Raycast Store "About" page.

## Repository layout

| Path         | Contents                                                                                 |
| ------------ | ---------------------------------------------------------------------------------------- |
| `extension/` | The Raycast extension. Everything in this folder is submitted to the Store.              |
| `tests/`     | Unit tests for `extension/src/lib`. Kept outside `extension/` so they are not submitted. |

## Development

```sh
npm install              # test tooling
npm --prefix extension install
```

Run these checks before submitting changes:

```sh
npm test                           # unit tests (vitest)
npm run typecheck                  # generates the preference types, then type-checks src and tests
npm --prefix extension run lint
```

Run `npm run dev` and `npm run publish` from `extension/`.

## License

[MIT](LICENSE)
