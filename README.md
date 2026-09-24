# Waxnote

Waxnote is an interactive React/Vite concept that presents music collections
as editorial playlist reports. It combines saved playlist exports with a
predefined featured collection, without connecting to a live Spotify account.

[Live prototype](https://waxnote.bennettspeir.com/) ·
[Case study](https://www.bennettspeir.com/waxnote.html)

## Prototype status

- Frontend-only React application built with Vite
- Six included playlist reports with Overview, Catalog, Audio, and Wrapped views
- Saved CSV data and predefined report values, as described below
- No backend or live Spotify API integration
- No environment variables, credentials, or secrets required

The playlist picker, editorial dashboard, responsive layouts, and immersive
Wrapped mode demonstrate the product direction using the included collections.

## Data and provenance

### Imported playlist reports

Late Night Drive, Chill Vibes, Dirt Road Driving, Pregaming, and Gym Pump
come from five saved CSV exports in [src/data/imports](./src/data/imports/).
[importedPlaylists.js](./src/data/importedPlaylists.js) parses those files and
calculates playlist summaries in the browser, including runtime, artist and
genre counts, release patterns, and audio-feature distributions.

The exports already contain audio-feature values such as energy, danceability,
acousticness, valence, tempo, and key. Waxnote summarizes those saved values;
it does not fetch them live or calculate them from audio recordings.
The imported Wrapped profiles are rule-based editorial interpretations of
the exported fields.

### Featured collection

The featured **This Is Bennett** report uses predefined summaries, chart
values, and Wrapped content stored in [mockData.js](./src/data/mockData.js).
Its displayed count of 1,218 tracks is a stored value, not a count calculated
from the five imported CSVs. A matching track-level export for this featured
collection is not included in the repository, so its stored figures cannot
be independently recomputed from the bundled data.

### Playback history

All six included collections mark playback history as unavailable.
The History view displays that limitation instead of presenting the legacy
mock listening-history structures as actual activity. Playlist-added dates
in the imported reports describe collection growth, not when tracks were played.

## Local development

Install dependencies and start the Vite development server:

```sh
npm install
npm run dev
```

Useful checks:

```sh
npm run lint
npm run build
```

## Source use

© 2026 Bennett Speir. All rights reserved in the original code and other original copyrightable material.

This repository is publicly viewable for inspection and portfolio review. No general license is granted to reuse, modify, redistribute, or commercialize the original code without prior written permission.

This notice does not limit rights granted under GitHub’s Terms of Service, applicable law, or third-party licenses. Third-party materials remain subject to their respective terms.
