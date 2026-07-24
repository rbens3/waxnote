import { useLayoutEffect, useRef, useState } from "react";
import { GENRE_COLORS } from "../theme.js";
import {
  HEATMAP, DAYS_SHORT, SKIP_RATES, COMPLETIONIST, LABELS,
  COLLABS, ADDED, HYPERFIXATION, NEVER_LISTENED,
  radar, charts, keys, AURA_METRICS,
  LISTENING_PERIODS,
} from "../data/mockData.js";

const HEATMAP_LABELS = [
  {hour:0,label:"12a"},{hour:6,label:"6a"},{hour:12,label:"12p"},
  {hour:18,label:"6p"},{hour:23,label:"11p"},
];

function Heatmap() {
  return (
    <figure className="history-heatmap" aria-labelledby="history-heatmap-title">
      <div className="history-heatmap__scroll">
        <div
          className="history-heatmap__plot"
          role="img"
          aria-label="Listening intensity by day and hour. Friday at 11 PM is the strongest period."
        >
          <div className="history-heatmap__hours" aria-hidden="true">
            <span/>
            {HEATMAP_LABELS.map(item=>(
              <span key={item.hour} style={{"--hour-column":item.hour + 2}}>{item.label}</span>
            ))}
          </div>
          {HEATMAP.map((row,dayIndex)=>(
            <div className="history-heatmap__row" key={DAYS_SHORT[dayIndex]} aria-hidden="true">
              <span className="history-heatmap__day">{DAYS_SHORT[dayIndex]}</span>
              {row.map(cell=>{
                const isPower=dayIndex===5 && cell.h===23;
                return (
                  <span
                    className="history-heatmap__cell"
                    data-empty={cell.v<0.05}
                    data-power={isPower}
                    key={cell.h}
                    style={{"--heat-strength":`${isPower ? 100 : Math.max(8,Math.round(cell.v*92))}%`}}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <figcaption>
        <span id="history-heatmap-title">Seven days, read hour by hour</span>
        <strong>Strongest period · Friday, 11 PM</strong>
      </figcaption>
    </figure>
  );
}

function prepareGenreDNA(genres,trackCount) {
  const entries=genres.map(genre=>({
    ...genre,
    rawPercent:(genre.value/trackCount)*100,
  }));
  const tiny=entries.filter(genre=>Math.round(genre.rawPercent)===0);
  const grouped=entries.filter(genre=>Math.round(genre.rawPercent)>0);
  const categorizedTracks=entries.reduce((sum,genre)=>sum+genre.value,0);
  const uncategorizedTracks=Math.max(0,trackCount-categorizedTracks);

  if(tiny.length || uncategorizedTracks) {
    const otherTracks=tiny.reduce((sum,genre)=>sum+genre.value,0)+uncategorizedTracks;
    grouped.push({
      name:"Other",
      value:otherTracks,
      rawPercent:(otherTracks/trackCount)*100,
      includes:[
        ...tiny.map(genre=>genre.name),
        ...(uncategorizedTracks ? ["Unclassified"] : []),
      ],
    });
  }

  const apportioned=grouped.map(genre=>({
    ...genre,
    percent:Math.floor(genre.rawPercent),
    remainder:genre.rawPercent-Math.floor(genre.rawPercent),
  }));
  let remaining=100-apportioned.reduce((sum,genre)=>sum+genre.percent,0);
  const allocationOrder=[...apportioned].sort((a,b)=>b.remainder-a.remainder);

  for(let index=0;remaining>0;index+=1) {
    const target=allocationOrder[index%allocationOrder.length];
    target.percent+=1;
    remaining-=1;
  }

  return apportioned;
}

function GenreDNA({genres,trackCount}) {
  const [activeGenre,setActiveGenre]=useState(null);
  const dominantGenre=genres[0];
  const dominantShare=Math.round((dominantGenre.value/trackCount)*100);
  const displayGenres=prepareGenreDNA(genres,trackCount);
  const genreColor=genre=>GENRE_COLORS[genre.name] ?? "var(--color-chart-light)";
  const genreLabel=genre=>{
    if(!genre.includes) return genre.name;
    if(genre.includes.length===1) return `Other (${genre.includes[0]})`;
    if(genre.includes.length===2) return `Other (${genre.includes.join(" and ")})`;
    return `Other (${genre.includes.slice(0,-1).join(", ")}, and ${genre.includes.at(-1)})`;
  };

  return (
    <section className="overview-genre-dna" aria-labelledby="overview-genre-dna-title">
      <header className="overview-genre-dna__header">
        <div>
          <p className="metadata">Composition</p>
          <h2 id="overview-genre-dna-title">Genre DNA</h2>
        </div>
        <p>
          <strong>{dominantGenre.name}</strong> carries the collection at {dominantShare}%.
          The remaining genres show where its point of view widens.
        </p>
      </header>
      <div
        className="overview-genre-dna__bar"
        role="img"
        aria-label={displayGenres.map(genre=>(
          `${genreLabel(genre)} ${genre.percent} percent`
        )).join(", ")}
      >
        {displayGenres.map(genre=>(
          <span
            key={genre.name}
            title={`${genreLabel(genre)}: ${genre.percent} percent`}
            style={{
              width:`${genre.rawPercent}%`,
              background:genreColor(genre),
              opacity:activeGenre && activeGenre!==genre.name ? .28 : 1,
            }}
            onMouseEnter={()=>setActiveGenre(genre.name)}
            onMouseLeave={()=>setActiveGenre(null)}
          />
        ))}
      </div>
      <ol className="overview-genre-dna__legend">
        {displayGenres.map((genre,index)=>(
          <li
            data-active={activeGenre===genre.name}
            key={genre.name}
            onMouseEnter={()=>setActiveGenre(genre.name)}
            onMouseLeave={()=>setActiveGenre(null)}
          >
            <span className="metadata">{String(index + 1).padStart(2,"0")}</span>
            <i aria-hidden="true" style={{background:genreColor(genre)}}/>
            <span>{genre.name}</span>
            <strong style={{color:genreColor(genre)}}>
              {genre.percent}%
            </strong>
          </li>
        ))}
      </ol>
    </section>
  );
}

function SonicVisualization({metrics}) {
  const [energy,dance,mood]=metrics.map(metric=>Number.parseInt(metric.v,10));
  const y=value=>300-(value*2.35);
  const pulsePath=[
    `M 24 ${y(mood)}`,
    `C 92 ${y(mood)-42}, 124 ${y(energy)+38}, 188 ${y(energy)}`,
    `S 286 ${y(dance)-28}, 352 ${y(dance)}`,
    `S 456 ${y(mood)+34}, 528 ${y(mood)}`,
    `S 596 ${y(energy)-18}, 616 ${y(energy)}`,
  ].join(" ");

  return (
    <figure className="sonic-visualization">
      <svg
        viewBox="0 0 640 320"
        role="img"
        aria-labelledby="sonic-visualization-title sonic-visualization-description"
      >
        <title id="sonic-visualization-title">Sonic soundprint</title>
        <desc id="sonic-visualization-description">
          A waveform derived from Energy {energy} percent, Dance {dance} percent, and Mood {mood} percent.
        </desc>
        <g className="sonic-visualization__rules" aria-hidden="true">
          <line x1="24" y1="64" x2="616" y2="64"/>
          <line x1="24" y1="160" x2="616" y2="160"/>
          <line x1="24" y1="256" x2="616" y2="256"/>
        </g>
        <path className="sonic-visualization__echo" d={pulsePath} aria-hidden="true"/>
        <path className="sonic-visualization__pulse" d={pulsePath} aria-hidden="true"/>
        <g className="sonic-visualization__anchors" aria-hidden="true">
          <circle cx="188" cy={y(energy)} r="7"/>
          <circle cx="352" cy={y(dance)} r="7"/>
          <circle cx="528" cy={y(mood)} r="7"/>
        </g>
      </svg>
      <figcaption className="metadata">
        Soundprint · Energy {energy} · Dance {dance} · Mood {mood}
      </figcaption>
    </figure>
  );
}

// ── Tabs content ──────────────────────────────────────────────────────────────

export function TabOverview({playlist}) {
  const {trackCount,runtime,years,genres,overviewStats}=playlist.analytics;
  const stats=Object.fromEntries(overviewStats.map(stat=>[stat.l,stat.v]));
  const [firstYear,lastYear]=years.split("–").map(Number);
  const yearSpan=lastYear-firstYear;
  const dominantGenre=genres[0];
  const dominantShare=Math.round((dominantGenre.value/trackCount)*100);
  const timeCapsuleCopy=playlist.id===1
    ? <>From <strong>Twist and Shout (1963)</strong> to the newest 2026 additions, this playlist spans more history than most people’s record collections.</>
    : <>From {firstYear} to {lastYear}, this collection traces {yearSpan} years without losing its central point of view.</>;
  const maxAdded=Math.max(...ADDED.map(point=>point.v));

  return (
    <article className="overview-feature">
      <header className="overview-opening">
        <div className="overview-opening__copy">
          <h1>{playlist.name}</h1>
          <p className="overview-opening__thesis">{playlist.thesis}</p>
          <div className="overview-lead-stat">
            <strong>{trackCount.toLocaleString()}</strong>
            <span>tracks held together by one point of view</span>
          </div>
        </div>

        <figure className="overview-artwork">
          <img
            src={playlist.artwork.src}
            alt={playlist.artwork.alt}
            width="800"
            height="800"
            fetchPriority="high"
          />
          <figcaption className="metadata">{playlist.artwork.caption}</figcaption>
        </figure>
      </header>

      <dl className="overview-facts">
        <div><dt>Runtime</dt><dd>{runtime}</dd></div>
        <div><dt>Date range</dt><dd>{years}</dd></div>
        <div><dt>Dominant genre</dt><dd>{dominantGenre.name} · {dominantShare}%</dd></div>
        <div><dt>Explicit</dt><dd>{stats.Explicit}</dd></div>
        <div><dt>Avg popularity</dt><dd>{stats["Avg Popularity"]}</dd></div>
        <div><dt>Peak year</dt><dd>{stats["Peak Year"]}</dd></div>
      </dl>

      <GenreDNA genres={genres} trackCount={trackCount}/>

      <section className="time-capsule" aria-labelledby="time-capsule-title">
        <div className="time-capsule__years" aria-hidden="true">{yearSpan}</div>
        <div className="time-capsule__copy">
          <h2 id="time-capsule-title">{yearSpan} Years of Music</h2>
          <p>{timeCapsuleCopy}</p>
          <div className="time-capsule__range metadata">
            <span>{firstYear}</span>
            <span aria-hidden="true"/>
            <span>{lastYear}</span>
          </div>
        </div>
      </section>

      <section className="hidden-gem" aria-labelledby="hidden-gem-title">
        <header>
          <h2 id="hidden-gem-title">Hidden Gem Score</h2>
          <p>You find the songs before they blow up. Baby Keem and Frank Ocean pull the underground side highest.</p>
        </header>
        <div className="hidden-gem__comparison">
          <div className="hidden-gem__measure hidden-gem__measure--mainstream">
            <strong>72%</strong>
            <span>Mainstream</span>
            <small className="metadata">Popularity 70+</small>
          </div>
          <div className="hidden-gem__measure hidden-gem__measure--underground">
            <strong>28%</strong>
            <span>Underground</span>
            <small className="metadata">Popularity under 50</small>
          </div>
        </div>
      </section>

      <figure className="growth-figure">
        <figcaption>
          <div>
            <h2>Playlist Growth</h2>
            <p>Jul 9 was the first major collection session—312 songs added in one day.</p>
          </div>
          <span className="growth-figure__annotation metadata">09 Jul · 312 tracks</span>
        </figcaption>
        <div className="growth-figure__chart">
          <ol className="growth-figure__bars" aria-label="Songs added per day from July 8 through July 19">
            {ADDED.map(point=>(
              <li
                data-annotated={point.d==="Jul 9"}
                data-peak={point.v===maxAdded}
                data-zero={point.v===0}
                key={point.d}
                tabIndex="0"
                aria-label={`${point.d}: ${point.v} songs added`}
                title={`${point.d}: ${point.v} songs added`}
                style={{"--growth-value":`${(point.v/maxAdded)*100}%`}}
              >
                <strong aria-hidden="true">{point.v}</strong>
                <span className="growth-figure__bar" aria-hidden="true"><i/></span>
                <span className="growth-figure__date" aria-hidden="true">
                  {point.d.replace("Jul ","")}
                </span>
              </li>
            ))}
          </ol>
          <div className="growth-figure__axis metadata">
            <span>July</span>
            <span>Songs added per day</span>
          </div>
        </div>
      </figure>
    </article>
  );
}

export function TabCatalog({playlist}) {
  const [showAll,setShowAll]=useState(false);
  const artists=[...playlist.analytics.topArtists].sort((a,b)=>b.v-a.v);
  const [lead,...rest]=artists;
  const visibleArtists=showAll ? rest : rest.slice(0,4);
  const maxTracks=lead.v;
  const namedLabels=LABELS.slice(0,8);

  return (
    <article className="catalog-editorial">
      <header className="catalog-intro">
        <div>
          <h1>Artists in residence.</h1>
          <p>{lead.name} leads {playlist.name} with {lead.v} tracks. The ranking below shows who holds the most space in the collection.</p>
        </div>
        <span className="metadata">{artists.length} ranked artists · {playlist.analytics.trackCount.toLocaleString()} tracks</span>
      </header>

      <section className="catalog-lead" aria-labelledby="catalog-lead-title">
        <span className="catalog-lead__index" aria-hidden="true">01</span>
        <div className="catalog-lead__copy">
          <span className="catalog-lead__rank metadata">01</span>
          <h2 id="catalog-lead-title">{lead.name}</h2>
          <p><strong>{lead.v}</strong> tracks make {lead.name} the collection’s most represented artist.</p>
          <div className="catalog-lead__measure" aria-hidden="true"><span/></div>
        </div>
      </section>

      <ol
        className="artist-ranking"
        id="artist-ranking-list"
        start="2"
        aria-label={showAll ? "All remaining top artists" : "Artists ranked two through five"}
      >
        {visibleArtists.map((artist,index)=>(
          <li
            className="artist-ranking__row"
            key={artist.name}
            style={{"--artist-share":`${Math.round((artist.v/maxTracks)*100)}%`}}
          >
            <span className="artist-ranking__rank metadata">{String(index+2).padStart(2,"0")}</span>
            <h3>{artist.name}</h3>
            <strong className="artist-ranking__count">{artist.v}<span> tracks</span></strong>
            <div className="artist-ranking__measure" aria-hidden="true"><span/></div>
          </li>
        ))}
      </ol>
      {artists.length>5 && (
        <button
          className="artist-ranking__toggle"
          type="button"
          aria-controls="artist-ranking-list"
          aria-expanded={showAll}
          onClick={()=>setShowAll(current=>!current)}
        >
          <span>{showAll ? "Show fewer" : `Show all ${artists.length}`}</span>
          <span aria-hidden="true">{showAll ? "−" : "+"}</span>
        </button>
      )}

      <div className="catalog-detail-spread">
        <section className="completion-index" aria-labelledby="completion-title">
          <header className="editorial-section-head">
            <h2 id="completion-title">Album Completionist</h2>
            <p>How much of each artist’s available catalogue appears here.</p>
          </header>
          <div className="completion-index__list" role="list">
          {COMPLETIONIST.map(x=>{
            const pct=Math.round(x.have/x.total*100);
            return(
              <div className="completion-index__row" role="listitem" key={x.a}>
                <strong>{x.a}</strong>
                <span className="metadata">{x.have} of {x.total}</span>
                <span className="completion-index__percent">{pct}%</span>
                <div
                  className="completion-index__track"
                  role="progressbar"
                  aria-label={`${x.a} album completion`}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-valuenow={pct}
                >
                  <span style={{width:`${pct}%`}}/>
                </div>
              </div>
            );
          })}
          </div>
        </section>

        <figure className="label-index">
          <figcaption className="editorial-section-head">
            <h2>Record Labels</h2>
            <p>{namedLabels[0].l} is the largest named label presence, with {namedLabels[0].v} tracks.</p>
          </figcaption>
          <ol>
            {namedLabels.map(label=>(
              <li key={label.l} style={{"--label-share":`${Math.round((label.v/namedLabels[0].v)*100)}%`}}>
                <span>{label.l}</span>
                <span className="label-index__measure" aria-hidden="true"><i/></span>
                <strong>{label.v}</strong>
              </li>
            ))}
          </ol>
        </figure>
      </div>

      <section className="collaboration-index" aria-labelledby="collaboration-title">
        <header className="editorial-section-head">
          <h2 id="collaboration-title">Collaboration Lines</h2>
          <p>Repeated pairings reveal where the catalogue crosses between artists.</p>
        </header>
        <ol>
          {COLLABS.map((collaboration,index)=>(
            <li key={`${collaboration.a}-${collaboration.b}`}>
              <span className="collaboration-index__artist collaboration-index__artist--left">{collaboration.a}</span>
              <span className="collaboration-index__bridge">
                <i aria-hidden="true"/>
                <strong>{collaboration.n} tracks</strong>
              </span>
              <span className="collaboration-index__artist collaboration-index__artist--right">{collaboration.b}</span>
              <p>
                {collaboration.n} shared tracks create {index<2
                  ? "one of the playlist’s strongest bridges."
                  : collaboration.n>=5
                    ? "a recurring link across the catalogue."
                    : "a smaller but persistent thread."}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}

export function TabAudio({playlist}) {
  const dominantKey=keys.reduce((highest,key)=>key.v>highest.v?key:highest,keys[0]);

  return(
    <article className="audio-editorial">
      <header className="sonic-profile">
        <div className="sonic-profile__copy">
          <h1>Sonic Profile</h1>
          <p className="sonic-profile__statement">{playlist.sonicStatement}</p>
          <p className="metadata">{playlist.name} · {playlist.analytics.trackCount.toLocaleString()} tracks · {playlist.analytics.runtime}</p>
        </div>
        <SonicVisualization metrics={AURA_METRICS}/>
      </header>

      <dl className="sonic-measures">
        {AURA_METRICS.map(metric=>(
          <div key={metric.l} style={{"--sonic-value":metric.v}}>
            <dt>{metric.l}</dt>
            <dd>{metric.v}</dd>
            <span className="sonic-measures__track" aria-hidden="true"><i/></span>
          </div>
        ))}
      </dl>

      <section className="distribution-section" aria-labelledby="distribution-title">
        <header className="editorial-section-head">
          <h2 id="distribution-title">The shape of the sound</h2>
          <p>Each figure names the dominant band directly. Neutral measures show the field; the playlist accent marks the peak.</p>
        </header>
        <div className="distribution-index">
          {charts.map(({t,d})=>{
            const max=Math.max(...d.map(point=>point.v));
            const peak=d.find(point=>point.v===max);
            return(
              <figure className="distribution-figure" key={t}>
                <figcaption>
                  <h3>{t}</h3>
                  <p><strong>{peak.l}</strong> is the largest group, with {peak.v} tracks.</p>
                </figcaption>
                <ol>
                  {d.map(point=>(
                    <li
                      data-peak={point.v===max}
                      key={point.l}
                      style={{"--distribution-value":`${Math.round((point.v/max)*100)}%`}}
                    >
                      <span>{point.l}</span>
                      <span className="distribution-figure__track" aria-hidden="true"><i/></span>
                      <strong>{point.v}</strong>
                    </li>
                  ))}
                </ol>
              </figure>
            );
          })}
        </div>
      </section>

      <section className="key-index" aria-labelledby="key-index-title">
        <header className="editorial-section-head">
          <h2 id="key-index-title">Musical Keys</h2>
          <p><strong>{dominantKey.k}</strong> is the dominant key, appearing in {dominantKey.v} songs.</p>
        </header>
        <ul>
          {keys.map(key=>(
            <li data-dominant={key.k===dominantKey.k} key={key.k}>
              <strong>{key.k}</strong>
              <span className="metadata">{key.v}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="genre-bands" aria-labelledby="genre-bands-title">
        <header className="editorial-section-head">
          <h2 id="genre-bands-title">Audio Fingerprint by Genre</h2>
          <p>Aligned measures make the differences readable without a legend. Every value is scored out of 100.</p>
        </header>
        <div className="genre-bands__list">
          {radar.map(genre=>(
            <article className="genre-band" key={genre.g}>
              <h3>{genre.g}</h3>
              {["Dance","Energy","Mood","Acoustic"].map(metric=>(
                <div
                  className="genre-band__measure"
                  key={metric}
                  aria-label={`${genre.g} ${metric}: ${genre[metric]} out of 100`}
                  style={{"--genre-value":`${genre[metric]}%`}}
                >
                  <span>{metric}</span>
                  <span aria-hidden="true"><i/></span>
                  <strong>{genre[metric]}</strong>
                </div>
              ))}
            </article>
          ))}
        </div>
      </section>
    </article>
  );
}

const PERIOD_NOTES = {
  "Late Night":"The playlist does most of its work after the rest of the day has gone quiet.",
  "Afternoon":"A smaller daytime interval keeps the collection in rotation.",
  "Morning":"Before noon, the playlist is almost absent from the routine.",
};

const FIXATION_NAMES = {
  Kanye:"Kanye West",
  Keem:"Baby Keem",
  Drake:"Drake",
};

export function TabHistory({playlist}) {
  return(
    <article className="history-editorial">
      <header className="history-opening">
        <div className="history-opening__copy">
          <p className="history-mock-note metadata">
            Mock listening history · Tracking since Jul 8 · Spotify history is not connected
          </p>
          <h1>Friday at 11 PM is your power hour.</h1>
          <p>
            {playlist.name} lands most often after dark. The strongest concentration appears
            at the end of the week, just before midnight.
          </p>
        </div>
        <Heatmap/>
      </header>

      <section className="history-skip" aria-labelledby="history-skip-title">
        <header className="history-section-head">
          <h2 id="history-skip-title">What gets skipped</h2>
          <p>Electronic tracks lose the room fastest. Rap and hip-hop hold it, with a 9% skip rate.</p>
        </header>
        <figure className="skip-comparison">
          <ol>
            {SKIP_RATES.map(item=>(
              <li key={item.g} style={{"--skip-rate":`${item.rate}%`}}>
                <span>{item.g}</span>
                <span aria-hidden="true"><i/></span>
                <strong>{item.rate}%</strong>
              </li>
            ))}
          </ol>
          <figcaption>Share of plays skipped, directly compared by genre.</figcaption>
        </figure>
      </section>

      <section className="listening-narrative" aria-labelledby="listening-pattern-title">
        <header className="history-section-head">
          <h2 id="listening-pattern-title">The day bends toward night</h2>
          <p>Late night is not one of three equal habits. It is the habit.</p>
        </header>
        <div className="listening-narrative__lead">
          <strong>{LISTENING_PERIODS[0].v}</strong>
          <div>
            <h3>{LISTENING_PERIODS[0].l}</h3>
            <p>{LISTENING_PERIODS[0].sub}. {PERIOD_NOTES[LISTENING_PERIODS[0].l]}</p>
          </div>
        </div>
        <ol>
          {LISTENING_PERIODS.slice(1).map((period,index)=>(
            <li key={period.l}>
              <span className="metadata">{String(index + 2).padStart(2,"0")}</span>
              <strong>{period.v}</strong>
              <div>
                <h3>{period.l}</h3>
                <p>{period.sub}. {PERIOD_NOTES[period.l]}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="hyperfixation-story" aria-labelledby="hyperfixation-title">
        <header className="history-section-head">
          <h2 id="hyperfixation-title">Hyperfixation, week by week</h2>
          <p>The dominant artist changes, then the sequence circles back to Kanye West.</p>
        </header>
        <ol className="hyperfixation-timeline">
          {HYPERFIXATION.map((period,index)=>{
            const dominant=Object.keys(FIXATION_NAMES).reduce(
              (current,name)=>period[name]>period[current] ? name : current,
              "Kanye",
            );
            return (
              <li key={period.w} style={{"--fixation-share":`${period[dominant]}%`}}>
                <span className="hyperfixation-timeline__phase metadata">
                  {String(index + 1).padStart(2,"0")}
                </span>
                <div className="hyperfixation-timeline__copy">
                  <span className="metadata">{period.w}</span>
                  <h3>{FIXATION_NAMES[dominant]}</h3>
                  <p>{period[dominant]}% of additions · {period.Other}% spread across other artists</p>
                </div>
                <span className="hyperfixation-timeline__measure" aria-hidden="true"><i/></span>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="session-story" aria-labelledby="session-story-title">
        <header className="session-story__header">
          <div>
            <h2 id="session-story-title">The longest session</h2>
            <p>Friday, Jul 11 · 56 songs</p>
          </div>
          <strong>3h 47m</strong>
        </header>
        <ol>
          <li>
            <span className="metadata">Beginning</span>
            <h3>Runaway</h3>
            <p>The session opens with Kanye West and establishes the arc.</p>
          </li>
          <li>
            <span className="metadata">Peak</span>
            <h3>56 songs in motion</h3>
            <p>The longest uninterrupted stretch in the mock history.</p>
          </li>
          <li>
            <span className="metadata">Ending</span>
            <h3>Dark Fantasy</h3>
            <p>The story closes where it began: inside the same catalogue.</p>
          </li>
        </ol>
      </section>

      <section className="never-listened" aria-labelledby="never-listened-title">
        <header className="never-listened__header">
          <div>
            <h2 id="never-listened-title">Still waiting to be heard</h2>
            <p>A ranked sample from the untouched edge of the playlist.</p>
          </div>
          <p><strong>312</strong><span>songs · 26%</span></p>
        </header>
        <ol>
          {NEVER_LISTENED.map((track,index)=>(
            <li key={`${track.t}-${track.a}`}>
              <span className="metadata">{String(index + 1).padStart(2,"0")}</span>
              <strong>{track.t}</strong>
              <span>{track.a}</span>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}

function WrappedArtwork({playlist,chapter}) {
  const contactSheet=chapter===0 || chapter===3;
  return (
    <figure className="wrapped-artwork" data-contact-sheet={contactSheet}>
      {contactSheet ? (
        <div className="wrapped-artwork__sheet">
          {[0,1,2,3].map(panel=>(
            <span key={panel}>
              <img
                src={playlist.artwork.src}
                alt=""
                width="800"
                height="800"
                fetchPriority={chapter===0 && panel===0 ? "high" : "auto"}
              />
            </span>
          ))}
        </div>
      ) : (
        <img
          src={playlist.artwork.src}
          alt=""
          width="800"
          height="800"
        />
      )}
      <figcaption className="metadata">{playlist.artwork.caption}</figcaption>
    </figure>
  );
}

export function TabWrapped({playlist,onExit}) {
  const [chapter,setChapter]=useState(0);
  const storyRef=useRef(null);
  const touchStart=useRef(null);
  const {personality,cards}=playlist.analytics.wrapped;
  const current=cards[chapter];
  const isProfile=current.stat===personality.type;
  const progress=((chapter + 1) / cards.length) * 100;

  useLayoutEffect(()=>{
    storyRef.current?.focus({preventScroll:true});
  },[]);

  const showChapter=(next)=>{
    setChapter(Math.max(0,Math.min(cards.length - 1,next)));
  };

  const handleKeyDown=(event)=>{
    if(event.key==="Escape") {
      event.preventDefault();
      onExit();
      return;
    }
    if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key)) return;
    event.preventDefault();
    if(event.key==="ArrowLeft") showChapter(chapter - 1);
    if(event.key==="ArrowRight") showChapter(chapter + 1);
    if(event.key==="Home") showChapter(0);
    if(event.key==="End") showChapter(cards.length - 1);
  };

  const handleTouchEnd=(event)=>{
    if(touchStart.current===null) return;
    const distance=touchStart.current - event.changedTouches[0].clientX;
    touchStart.current=null;
    if(Math.abs(distance)<50) return;
    showChapter(chapter + (distance>0 ? 1 : -1));
  };

  return(
    <article
      className="wrapped-story"
      ref={storyRef}
      aria-label={`${playlist.name} Wrapped story`}
      aria-keyshortcuts="ArrowLeft ArrowRight Home End Escape"
      onKeyDown={handleKeyDown}
      onTouchStart={event=>{touchStart.current=event.changedTouches[0].clientX;}}
      onTouchEnd={handleTouchEnd}
      tabIndex="0"
    >
      <header className="wrapped-story__masthead">
        <p className="wrapped-story__identity">
          <strong>{playlist.name}</strong>
          <span>Wrapped</span>
        </p>
        <p className="wrapped-story__count metadata">
          {String(chapter + 1).padStart(2,"0")} / {String(cards.length).padStart(2,"0")}
        </p>
        <button
          className="wrapped-exit"
          type="button"
          aria-keyshortcuts="Escape"
          onClick={onExit}
        >
          Exit Wrapped <span aria-hidden="true">↗</span>
        </button>
        <div
          className="wrapped-progress"
          role="progressbar"
          aria-label="Wrapped story progress"
          aria-valuemin="1"
          aria-valuemax={cards.length}
          aria-valuenow={chapter + 1}
          style={{"--story-progress":`${progress}%`}}
        >
          <span/>
        </div>
      </header>

      <section
        className="wrapped-chapter"
        data-chapter={chapter + 1}
        aria-labelledby="wrapped-chapter-title"
        aria-live="polite"
      >
        <div className="wrapped-chapter__copy">
          <p
            className="wrapped-chapter__stat"
            data-long={current.stat.length>12}
            data-nowrap={!current.stat.includes(" ")}
          >
            {current.stat}
          </p>
          <h1 id="wrapped-chapter-title">{current.label}</h1>
          <p className="wrapped-chapter__sub metadata">{current.sub}</p>
          <p className="wrapped-chapter__caption">{current.caption}</p>
          {isProfile && (
            <div className="wrapped-profile">
              <p>{personality.desc}</p>
              <ul aria-label="Listener traits">
                {personality.traits.map(trait=><li key={trait}>{trait}</li>)}
              </ul>
              <p>{personality.compare}</p>
            </div>
          )}
        </div>

        <WrappedArtwork playlist={playlist} chapter={chapter}/>

        <footer className="wrapped-controls">
          <button
            className="wrapped-control"
            type="button"
            disabled={chapter===0}
            onClick={()=>showChapter(chapter - 1)}
          >
            <span aria-hidden="true">←</span> Previous
          </button>
          <button
            className="wrapped-share"
            type="button"
            aria-describedby="wrapped-share-note"
          >
            Share prototype <span aria-hidden="true">↗</span>
          </button>
          <button
            className="wrapped-control wrapped-control--next"
            type="button"
            disabled={chapter===cards.length - 1}
            onClick={()=>showChapter(chapter + 1)}
          >
            Next <span aria-hidden="true">→</span>
          </button>
          <p className="visually-hidden" id="wrapped-share-note">
            Image export is not connected in this prototype.
          </p>
        </footer>
      </section>
    </article>
  );
}
