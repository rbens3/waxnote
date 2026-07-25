import { LOGIN_FEATURES, PLAYLISTS } from "../data/mockData.js";

const formatPlaylistFacts = (playlist) => {
  const dominantGenre = playlist.analytics.genres[0]?.name ?? "Mixed";
  return [
    {label:"Tracks",value:playlist.analytics.trackCount.toLocaleString()},
    {label:"Runtime",value:playlist.analytics.runtime},
    {label:"Dominant genre",value:dominantGenre},
    {label:"Date range",value:playlist.analytics.years},
  ];
};

function PublicationMark({context}) {
  return (
    <div className="publication-mark">
      <span className="publication-mark__name">Waxnote</span>
      <span className="publication-mark__context metadata">{context}</span>
    </div>
  );
}

function ArtworkContactSheet() {
  return (
    <div className="entry-collage" aria-label="Abstract artwork from six playlist covers">
      {PLAYLISTS.map((playlist,index)=>(
        <figure className={`entry-collage__item entry-collage__item--${index + 1}`} key={playlist.id}>
          <img
            src={playlist.artwork.src}
            alt={playlist.artwork.alt}
            width="800"
            height="800"
            fetchPriority={index === 0 ? "high" : "auto"}
          />
          <figcaption>{String(index + 1).padStart(2,"0")} · {playlist.name}</figcaption>
        </figure>
      ))}
    </div>
  );
}

export function EntryScreen({onFeatured,onBrowse}) {
  return(
    <main className="entry-screen">
      <section className="entry-story" aria-labelledby="entry-title">
        <PublicationMark context="Prototype edition · 2026"/>
        <div className="entry-story__copy">
          <h1 id="entry-title">Your playlists have a point of view.</h1>
          <p>A frontend concept exploring how playlist data could become an editorial music experience.</p>
        </div>
        <ArtworkContactSheet/>
      </section>

      <aside className="entry-panel" aria-labelledby="entry-panel-title">
        <div className="entry-panel__intro">
          <p className="entry-panel__label metadata">Frontend concept</p>
          <h2 id="entry-panel-title">Open the prototype.</h2>
          <p>Everything here is illustrative: local mock playlists, modeled analytics, and simulated interactions.</p>
        </div>

        <ol className="entry-panel__features">
          {LOGIN_FEATURES.map(feature=>(
            <li key={feature.t}>
              <span className="metadata">{feature.i}</span>
              <span>{feature.t}</span>
            </li>
          ))}
        </ol>

        <div className="entry-panel__actions">
          <button className="entry-primary" type="button" onClick={onFeatured}>
            Explore the featured playlist
          </button>
          <button className="entry-secondary" type="button" onClick={onBrowse}>
            Browse example playlists
          </button>
          <p className="metadata">Six example playlists · all data is local</p>
        </div>
      </aside>
    </main>
  );
}

function PlaylistFactList({playlist,className=""}) {
  return (
    <span className={`playlist-facts ${className}`}>
      {formatPlaylistFacts(playlist).map(fact=>(
        <span className="playlist-fact" key={fact.label}>
          <span className="playlist-fact__label metadata">{fact.label}</span>
          <strong>{fact.value}</strong>
        </span>
      ))}
    </span>
  );
}

export function PlaylistPicker({onPick}) {
  const [featured,...catalogue]=PLAYLISTS;

  return(
    <main className="playlist-picker">
      <div className="playlist-picker__inner">
        <header className="selection-masthead">
          <PublicationMark context="Bennett’s library"/>
          <span className="selection-masthead__count metadata">{PLAYLISTS.length} collections</span>
        </header>

        <section className="selection-intro" aria-labelledby="selection-title">
          <h1 id="selection-title">Choose the next feature.</h1>
          <p>Each collection has its own era, cast, and listening logic. Open one to read the full portrait.</p>
        </section>

        <button
          className="playlist-feature"
          type="button"
          onClick={()=>onPick(featured)}
          style={{"--playlist-accent":featured.accent}}
        >
          <span className="playlist-feature__art">
            <img
              src={featured.artwork.src}
              alt={featured.artwork.alt}
              width="800"
              height="800"
              fetchPriority="high"
            />
          </span>
          <span className="playlist-feature__copy">
            <span className="playlist-feature__label metadata">Featured collection</span>
            <span className="playlist-feature__title">{featured.name}</span>
            <span className="playlist-feature__thesis">{featured.thesis}</span>
            <PlaylistFactList playlist={featured} className="playlist-feature__facts"/>
            <span className="playlist-entry__action">Read the playlist <span aria-hidden="true">→</span></span>
          </span>
        </button>

        <section className="playlist-catalogue" aria-labelledby="catalogue-title">
          <header className="playlist-catalogue__header">
            <h2 id="catalogue-title">The catalogue</h2>
            <span className="metadata">{catalogue.length} more collections</span>
          </header>

          <div className="playlist-catalogue__list">
            {catalogue.map((playlist,index)=>(
              <button
                className="playlist-entry"
                key={playlist.id}
                type="button"
                onClick={()=>onPick(playlist)}
                style={{"--playlist-accent":playlist.accent}}
              >
                <span className="playlist-entry__index metadata">{String(index + 2).padStart(2,"0")}</span>
                <img
                  className="playlist-entry__art"
                  src={playlist.artwork.src}
                  alt={playlist.artwork.alt}
                  width="800"
                  height="800"
                  loading="lazy"
                />
                <span className="playlist-entry__copy">
                  <span className="playlist-entry__title">{playlist.name}</span>
                  <span className="playlist-entry__description">{playlist.thesis}</span>
                </span>
                <PlaylistFactList playlist={playlist} className="playlist-entry__facts"/>
                <span className="playlist-entry__action" aria-hidden="true">Open →</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
