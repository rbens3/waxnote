# Waxnote

Waxnote is a frontend concept exploring how playlist data could become an
editorial music experience. This repository contains an interactive React/Vite
prototype built around six of Bennett Speir’s Spotify playlists. All six
playlists were created by Bennett and exist on his Spotify account.

## Prototype status

- Frontend-only React application built with Vite
- Five included playlist CSVs parsed and summarized in the browser
- One featured playlist report with summaries, chart values, and Wrapped content stored in source
- No live Spotify requests, user-account connections, or audio-recording analysis
- No application backend, environment variables, or user credentials required
- Playback history is unavailable for all six included collections

The playlist picker, editorial dashboard, responsive layouts, and Wrapped mode
present the included collections. They do not connect to a visitor's music
account. The interface identifies the application as an interactive concept and
the collections as examples. Page assets still load normally, and the stylesheet
requests fonts from Google Fonts.

## Included data

`src/data/importedPlaylists.js` imports these saved files from
`src/data/imports/`:

| Collection | CSV file | Playlist entries |
| --- | --- | ---: |
| Late Night Drive | `Late_Night_Drive.csv` | 69 |
| Chill Vibes | `Chill_vibes.csv` | 57 |
| Dirt Road Driving | `Dirt_Road_Driving.csv` | 142 |
| Pregaming | `Pregaming.csv` | 109 |
| Gym Pump | `Gym_Pump.csv` | 56 |

These five files contain 433 playlist entries and 410 distinct Track URI values
across the files. A track can occur in more than one collection. Entry totals
are not a count of unique recordings.

The CSVs already contain track names, artists, albums, release dates, durations,
popularity, explicit flags, playlist-addition dates, genres, and labels. They
also contain saved audio-feature values, including energy, danceability,
valence, tempo, key, and acousticness. The prototype uses these saved values; it
does not retrieve them from Spotify or measure them from audio recordings.

For these imported collections, the browser calculates entry counts and runtime,
artist and album rankings, genre and label summaries, release patterns,
collaboration counts, additions by date, popularity summaries, musical-key
counts, and audio-feature averages and distributions. Broad genre groups and
Wrapped profile labels use rules defined in the application. Playlist-addition
dates describe changes to the playlist, not listening activity.

`src/data/mockData.js` supplies report data for Bennett’s featured **This Is Bennett** playlist. Its
1,218-track display count, catalogue summaries, chart inputs, and Wrapped text
are predefined in source. Components calculate some presentation ratios from
those values, but this report is not rebuilt from the five CSVs. The repository does
not document how every stored statistic was originally derived. Adding its
displayed count to the five CSV entry counts produces
1,651, but that is not a verified unique-track total or a CSV-only total.

## Rendered data flow

`src/App.jsx` and `src/components/Screens.jsx` select entries from `PLAYLISTS` in
`src/data/mockData.js`. That list combines the featured playlist’s report data
with `IMPORTED_PLAYLISTS`. `src/components/Dashboard.jsx` passes the selected
collection to the views in `src/components/DashboardTabs.jsx`.

The imported collections provide their calculated Overview, Catalog, Audio, and
Wrapped values. The featured collection supplies predefined values directly or
uses the predefined fallbacks in those views. All six set
`historyAvailable: false`, so History renders an unavailable-data explanation.
The older illustrative listening-history code is not shown for any included
collection.

Some existing interface descriptions still describe all insights as calculated
from exports. That wording is broader than the mixed data flow described here.
This documentation correction does not change the interface, datasets, or
calculations.

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
