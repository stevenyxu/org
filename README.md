# Org viewer

## Run

This is generated from https://github.com/facebook/create-react-app. See
there for more info.

### `npm start`

Runs a dev server at http://localhost:3000/.

### `npm run build`

Builds a production build to `build` that can be served with a typical HTTP
file server.

## Test

No automated tests are provided, though code is organized in a way that would
make typical automated unit tests easy to write.

Recommended automated coverage priorities:

- Unit test `client/cache.js` since it may break in subtle ways that aren't
  easily catchable through manual testing.
- Unit test `client/Client.js` without stubbing out `client/cache.js` but
  just clearing IDB before each test case. This has important client logic
  and testing this is important mostly because I expect most component unit
  tests to mock `client/Client.js` in tests.
- Unit test most components, mocking out `client/Client.js`. Mostly snapshot
  tests. Some special cases worth coverage:
  - `repos/Repos.js` has some rich error case handling and race condition
    handling.
  - `Header.js` does a lot of redirects to try to normalize capitalization.

### Manual tests

- Visit `/` and expect to be redirected to the org repo list page, by default
  `/kubernetes`.
- Visit the org repo list page, for example `/kubernetes`.
  - After page load, refresh and confirm IDB caching is working well.
  - Sort by each column, ascending and descending. Sorting should not produce
    network calls.
  - Click on the repo link to go to the repo details page (see below).
  - Click on the github icon to go to the Github repository.
  - Click on the issues link to go to Github issues.
  - Change orgs very quickly to ensure that pending requests don't result in
    race conditions like the wrong org's repos showing up.
    - `microsoft` is a good example of an org with a very long cold load time
      (38 pages). Go to `microsoft` then go to `tensorflow` (1 page). A few
      things should happen:
      - The `microsoft` paginated requests should continue in the background
        and would be viewable in a network inspector. Technically this is an
        implementation detail but a nice signal nonetheless.
      - If you do nothing, when the `microsoft` pages finish loading, nothing
        should happen.
      - If you switch back to `microsoft`, the requests should continue and
        not just start from page 1. `microsoft`'s results should show when
        done.
      - If you wait until the `microsoft` loads are done then switch back to
        `microsoft`, the results should show with no further network calls.
  - Periodically clear the IDB cache to restore a blank slate.
  - Wait an hour without clearing the IDB cache and confirm the automatic TTL
    invalidates old results. Almost any large org will have gotten a change
    in repo star count within an hour, so this should be easy enough to check
    manually. Alternatively, set up your own org and add a new repo.
  - Add a new organization.
    - Add an organization that doesn't exist (e.g. `v0f9d8ef`).
    - Add an organization with 0 repos (e.g. `stevenyxu-empty`).
    - Add an organization with less than 100 repos but more than 0 (e.g.
      `stevenyxu-5`).
    - Deep link into one of these new organizations, with and without a IDB
      clear.
- Visit the repo page, for example `/kubernetes/kubernetes`.
- Performance features to test
  - Initial load of the HTML/CSS/JS bundle should be entirely static and cached
    (dependent on the static file server).
  - After the org page loads and repos are shown, subsequent refreshes should
    require no network calls to render.
  - Org prefetch hits the last org (`tensorflow`) then goes from the top down
    in sequence. If you wait long enough, all orgs are renderable without
    network calls.
  - Hovering and focusing on repo links in the org page will prefetch the
    relevant repo page. If you wait for the prefetch to complete, the repo page
    is renderable without network calls.
    - Repo prefetches don't occur in parallel and have a queue of one (in
      addition to the current pending prefetch request), so if you hover over a
      lot of repos very quickly, it won't spam requests. The queue does however
      send a prefetch for the last hovered repo when the pending request is
      done.

## Technical design

This is my first React/tailwindcss app. Feedback is welcome.

### Routing

This application has two routes:

- `/:org`: org page. Lists repos for an org. Homepage redirects to
  `/kubernetes`.
- `/:org/:repo`: repo page. Lists commits for a repo.

React Router is used to configure routes. Deep linking should work throughout.

### Caching

Some work went into caching because performance is a killer feature for
internal utility apps.

`client/cache.js` has the core caching loop I wrote for this, but this should
be relatively generic and I might copy this for future projects if no better
open source solution exists. It transparently wraps an async function call and
immediately returns a promise that resolves correctly, whether from cache or
from the function passed. Some delicate juggling takes place because I can't
set the value in the cache until a serializable response comes back (IndexedDB,
the backend used, can't save a reference to a pointer), therefore, there's
really two layers of caching: an immediate in-memory layer of ongoing promises
that haven't yet resolved, and the real IDB cache. This wrapper conveniently
converges all of these pages so that repeated calls to even expensive API
backends only happen once, even if the calls are made multiple times before the
cache is filled.

### Model

Most of the model layer is moved into `client/Client.js` and all components
interact with data through this. This class is mostly unremarkable besides its
existence as a central source of connection to the backend (via Github's
`@octokit/rest` library). It allows easy substitution with a new backend as
needed.

Github's API data model is directly plumbed through rather than retranslated to
a rendering struct. This is mostly done for expediency and the scope of the
project. On a larger project I'd support severing this link so rendering code
is not deeply depending on backend API shape and has a typed source of truth in
the code.

### Rendering

Nothing too notable exists on the HTML/CSS side. Some minor remarks:

- I chose not to use a framework mostly because I wanted to have an excuse to
  play with tailwindcss, which I heard a lot about. Using a framework might
  have helped make things look better and allow some additional features with
  little additional work like customizing the org list or adding grid keyboard
  navigation to the tables.
- Table layout is used. This results in some inconsistency in the layout
  depending on the shape of the data. Using a grid layout with more fixed
  column widths would probably be fine and more responsive.
- Some attention is paid to making things tighter on smaller viewports, but the
  table is likely to scroll horizontally. I chose this because the important
  info is on the left and I think scrolling horizontally isn't that bad on
  mobile to get additional secondary info.
- Colored bars, rendered using just basic CSS, give an at-a-glance comparison
  for forks, stars, and issues. I experimented with linear, logarithmic, and
  square root scaling for bar size, and square root scaling gave the best feel.

### Feature set

I mostly used Github's existing organization page (https://github.com/netflix)
as a starting point, focusing on delivering some marginal value that would make
me want to use this UI rather than going straight to Github.

Here's a summary of key features that are the delta of this UI compared to
Github's:

- Github appears not to have sort functionality for an organization's repos. My
sort functionality has sorting on the three primary social metrics (see below
to add commit activity, which is also sortable) and an unintrusive colorful
visualization for seeing magnitude at a glance.
- Github doesn't have one click to go to commits on a repo. This UI does.
- This UI is way faster.
