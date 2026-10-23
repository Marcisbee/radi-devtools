# Radi DevTools

A Chrome DevTools extension for inspecting Radi components, DOM layers, props,
layout, and render timings. Includes a development bridge and a working example.

## Run locally

Requires Git, Deno 2, and Chrome.

```sh
deno task setup
deno task devtools:demo
```

Open `http://127.0.0.1:8174`. In `chrome://extensions`, enable Developer mode,
choose **Load unpacked**, and select `extensions/chrome`. Open the example's
DevTools and select **Radi**. Use Performance → Record renders, then increment
or remount the counter.

The extension itself has no build step. See [the panel guide](extensions/chrome/README.md)
for installation in an application, profiling semantics, and supported scope.

## Runtime integration

All DevTools code lives here, independently of the Radi repository. Profiling
needs instrumentation at Radi's actual render boundaries. `deno task setup`
clones Radi revision `bc7e0b7d5c1fc4474cebdf2a194437d40907ad0a` into the ignored
`.radi/` directory and applies [the small runtime patch](integration/radi.patch).
It never pushes to Radi or changes an existing application checkout. Repeated
setup runs recognize an installed patch; incompatible checkouts fail without
resetting local changes.

The demo imports that prepared client and `src/devtools.ts`. For another app,
use the same prepared client (including the same symbols) and import
`enableDevTools` from this repository's `src/devtools.ts`. Enable the bridge only
in development. This source integration is not yet a published npm package and
does not support unpatched Radi releases. Keep the runtime revision pinned until
its instrumentation patch and browser checks have been validated against an update.

## Check

```sh
deno task setup
deno run -A npm:playwright@1.64.1 install --with-deps chromium
xvfb-run -a deno task test:devtools
```

The integration check loads the real unpacked extension and drives selection,
filtering, collapse, ancestry navigation, theme changes, recording, bounded
history, highlighting, unmounting, and reconnection against the Radi example.

The panel makes no network requests and requests no host permissions. Its bridge
exposes development data to the inspected page; do not enable it in production.
