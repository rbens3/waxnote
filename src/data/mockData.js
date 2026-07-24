import { C } from "../theme.js";

export const TOTAL=1218;
export const genres=[
  {name:"Rap / Hip-Hop",value:669},{name:"Rock / Indie",value:231},
  {name:"Pop",value:150},{name:"Country",value:77},
  {name:"EDM / Electronic",value:44},{name:"R&B / Soul",value:19},
  {name:"Latin",value:5},{name:"Folk",value:3},
];
export const artists=[
  {name:"J. Cole",v:10},{name:"Lil Baby",v:10},{name:"Future",v:10},{name:"Adele",v:10},
  {name:"Coldplay",v:11},{name:"Frank Ocean",v:11},{name:"Lil Uzi Vert",v:12},
  {name:"Kendrick Lamar",v:13},{name:"Gunna",v:13},{name:"Juice WRLD",v:15},
  {name:"Travis Scott",v:17},{name:"Morgan Wallen",v:27},
  {name:"Baby Keem",v:29},{name:"Drake",v:30},{name:"Kanye West",v:37},
];

// ── NEW mock data ─────────────────────────────────────────────────────────────

// Heatmap — 7 days × 24 hours, intensity 0–1
const DAY_MULT   = [0.68,0.52,0.48,0.58,0.74,1.0,0.88];
const HOUR_BASE  = [0.05,0.02,0.01,0.01,0.01,0.03,0.08,0.12,0.18,0.22,0.28,0.35,
                    0.42,0.44,0.38,0.30,0.38,0.50,0.60,0.70,0.80,0.90,0.92,0.70];
const seed = (d,h) => { let x=(d*24+h)*2654435761>>>0; return (x/4294967296); };
export const HEATMAP = Array.from({length:7},(_,d)=>
  Array.from({length:24},(_,h)=>({d,h,v:Math.min(1,HOUR_BASE[h]*DAY_MULT[d]*(0.8+seed(d,h)*0.4))}))
);
export const DAYS_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// Skip rates by genre (% of plays that were skipped)
export const SKIP_RATES = [
  {g:"EDM / Electronic",rate:38},{g:"Pop (nostalgia)",rate:31},
  {g:"Folk",rate:22},{g:"R&B / Soul",rate:16},
  {g:"Country",rate:14},{g:"Rock / Indie",rate:12},
  {g:"Rap / Hip-Hop",rate:9},{g:"Latin",rate:5},
];

// Album completionist scores
export const COMPLETIONIST = [
  {a:"Baby Keem",have:29,total:32},{a:"Kanye West",have:37,total:44},
  {a:"Juice WRLD",have:15,total:20},{a:"Travis Scott",have:17,total:23},
  {a:"Drake",have:30,total:45},{a:"Morgan Wallen",have:27,total:40},
  {a:"Kendrick Lamar",have:13,total:23},{a:"J. Cole",have:10,total:19},
];

// Record labels
export const LABELS = [
  {l:"Republic",v:187},{l:"Atlantic",v:143},{l:"Interscope",v:98},
  {l:"GOOD Music",v:87},{l:"OVO Sound",v:64},{l:"Columbia",v:58},
  {l:"TDE",v:42},{l:"EMPIRE",v:38},{l:"Other",v:501},
];

// Collaborations
export const COLLABS = [
  {a:"Travis Scott",b:"Drake",n:8},{a:"Kanye West",b:"Jay-Z",n:7},
  {a:"Baby Keem",b:"Kendrick",n:5},{a:"Drake",b:"21 Savage",n:5},
  {a:"Kanye West",b:"Kid Cudi",n:4},{a:"Future",b:"Drake",n:3},
  {a:"Kanye",b:"Kendrick",n:3},{a:"ASAP Rocky",b:"Drake",n:3},
];

// Songs added per day (playlist was built over ~2 weeks)
export const ADDED = [
  {d:"Jul 8",v:47},{d:"Jul 9",v:312},{d:"Jul 10",v:0},{d:"Jul 11",v:85},
  {d:"Jul 12",v:0},{d:"Jul 13",v:0},{d:"Jul 14",v:147},{d:"Jul 15",v:94},
  {d:"Jul 16",v:0},{d:"Jul 17",v:533},{d:"Jul 18",v:0},{d:"Jul 19",v:0},
];

// Hyperfixation periods (dominant artist by week)
export const HYPERFIXATION = [
  {w:"Wk 1",Kanye:40,Keem:8,Drake:5,Other:47},
  {w:"Wk 2",Kanye:18,Keem:35,Drake:9,Other:38},
  {w:"Wk 3",Kanye:22,Keem:12,Drake:28,Other:38},
  {w:"Wk 4",Kanye:31,Keem:10,Drake:14,Other:45},
];

// Never listened tracks (mock sample)
export const NEVER_LISTENED = [
  {t:"Crack Music",a:"Kanye West"},{t:"The Prayer",a:"Kid Cudi"},
  {t:"Motley Crew",a:"Post Malone"},{t:"Alright",a:"Kendrick Lamar"},
  {t:"Wagon Wheel",a:"Darius Rucker"},{t:"Stargazing",a:"Travis Scott"},
];

// Wrapped cards data
export const WRAPPED_CARDS = [
  {
    id:1,
    stat:"1,218", label:"songs in your collection",
    sub:"76.7 hours of music · 7 decades",
    caption:"You didn't build a playlist. You built an archive."
  },
  {
    id:2,
    stat:"48%", label:"of your songs are melancholic",
    sub:"Valence score below 0.4",
    caption:"High energy, dark mood. You like music that hits."
  },
  {
    id:3,
    stat:"Kanye West", label:"is your most-collected artist",
    sub:"37 tracks across every era",
    caption:"College Dropout to Vultures. You've been there for all of it."
  },
  {
    id:4,
    stat:"28%", label:"of your playlist is underground",
    sub:"Popularity score under 50",
    caption:"You find the songs before everyone else does."
  },
  {
    id:5,
    stat:"The Architect", label:"is your listener type",
    sub:"Top 1% for playlist size",
    caption:"Methodical. Comprehensive. You don't add songs — you place them."
  },
  {
    id:6,
    stat:"Chicago", label:"After Midnight",
    sub:"Your playlist has a city",
    caption:"Kanye's roots. Dark energy. A few country roads. High rises and wide open sky."
  },
];

// Personality type
export const PERSONALITY = {
  type:"The Architect",
  desc:"You don't just listen to music — you build worlds. 1,218 songs spanning 7 decades and every genre. This isn't a shuffle playlist, it's a carefully constructed statement about who you are. You're in the top 1% of playlist builders globally.",
  traits:["Massive library (1,200+ songs)","Cross-genre taste","Methodical curation","Deep catalog dives"],
  compare:"Similar listeners also love: Frank Ocean · Bon Iver · Zach Bryan · Kanye West",
};


export const radar=[
  {g:"Hip-Hop",Dance:72,Energy:62,Mood:45,Acoustic:20},
  {g:"Rock",Dance:56,Energy:70,Mood:53,Acoustic:16},
  {g:"Country",Dance:56,Energy:63,Mood:52,Acoustic:37},
  {g:"EDM",Dance:63,Energy:79,Mood:45,Acoustic:11},
  {g:"Pop",Dance:63,Energy:68,Mood:54,Acoustic:22},
  {g:"R&B",Dance:64,Energy:61,Mood:50,Acoustic:31},
];
export const charts=[
  {t:"Energy",d:[{l:"Very Low",v:8},{l:"Low",v:76},{l:"Medium",v:399},{l:"High",v:491},{l:"Very High",v:244}],c:C.rose},
  {t:"Mood",d:[{l:"Very Sad",v:162},{l:"Melancholic",v:313},{l:"Neutral",v:361},{l:"Upbeat",v:260},{l:"Very Happy",v:122}],c:C.blue},
  {t:"Tempo",d:[{l:"Very Slow",v:9},{l:"Slow",v:294},{l:"Medium",v:240},{l:"Fast",v:352},{l:"Very Fast",v:323}],c:C.amber},
  {t:"Popularity",d:[{l:"Unknown",v:120},{l:"Low",v:32},{l:"Mid",v:239},{l:"High",v:597},{l:"Very High",v:214}],c:C.emerald},
];
export const keys=[
  {k:"C",v:132},{k:"G",v:114},{k:"D",v:100},{k:"A",v:100},{k:"E",v:80},
  {k:"B",v:106},{k:"F#",v:97},{k:"C#",v:181},{k:"G#",v:88},{k:"D#",v:30},{k:"A#",v:94},{k:"F",v:96},
];


export const OVERVIEW_STATS=[
  {l:"Songs",v:"1,218",c:C.purple},{l:"Runtime",v:"76.7 hrs",c:C.emerald},
  {l:"Decades",v:"7",c:C.amber},{l:"Explicit",v:"54%",c:C.rose},
  {l:"Avg Popularity",v:"72",c:C.blue},{l:"Peak Year",v:"2018",c:C.pink},
];

export const AURA_METRICS=[
  {l:"Energy",v:"64%",c:C.rose},{l:"Dance",v:"66%",c:C.purple},{l:"Mood",v:"48%",c:C.blue},
];

export const LISTENING_PERIODS=[
  {l:"Late Night",v:"68%",sub:"After 10pm",c:C.purple},
  {l:"Afternoon",v:"24%",sub:"Noon–10pm",c:C.amber},
  {l:"Morning",v:"8%",sub:"Before noon",c:C.blue},
];

export const LOGIN_FEATURES=[
  {i:"01",t:"Stats Spotify doesn't show you"},
  {i:"02",t:"Your real listening habits"},
  {i:"03",t:"Shareable Wrapped-style cards"},
];

export const TABS=["Overview","Catalog","Audio","History","Wrapped"];

const makeOverviewStats = ({tracks,runtime,decades,explicit,popularity,peakYear}) => [
  {l:"Songs",v:tracks.toLocaleString(),c:C.purple},{l:"Runtime",v:runtime,c:C.emerald},
  {l:"Decades",v:String(decades),c:C.amber},{l:"Explicit",v:explicit,c:C.rose},
  {l:"Avg Popularity",v:String(popularity),c:C.blue},{l:"Peak Year",v:String(peakYear),c:C.pink},
];

const makeWrapped = ({name,tracks,runtime,topArtist,topArtistTracks,trait,personality,caption}) => ({
  personality:{
    type:personality,
    desc:`${name} is a focused collection of ${tracks.toLocaleString()} songs shaped around ${trait.toLowerCase()}.`,
    traits:[`${tracks.toLocaleString()} song collection`,trait,`${topArtist} leads the playlist`,"Purpose-built curation"],
    compare:`Core artists include: ${topArtist} · ${caption}`,
  },
  cards:[
    {
      id:1,stat:tracks.toLocaleString(),label:"songs in this playlist",
      sub:`${runtime} of music`,
      caption:`${name} keeps every track focused on the same mood.`,
    },
    {
      id:2,stat:runtime,label:"is the full running time",
      sub:`${tracks.toLocaleString()} songs in sequence`,
      caption:`Long enough to establish a mood without losing the thread.`,
    },
    {
      id:3,stat:topArtist,label:"is your most-collected artist",
      sub:`${topArtistTracks} tracks in this playlist`,
      caption:`${topArtist} defines the center of this mix.`,
    },
    {
      id:4,stat:String(topArtistTracks),label:`${topArtist} tracks hold the center`,
      sub:trait,
      caption:`The leading catalogue gives ${name} its clearest recurring voice.`,
    },
    {
      id:5,stat:personality,label:"is this playlist's personality",
      sub:trait,
      caption,
    },
    {
      id:6,stat:trait,label:"is the playlist’s point of view",
      sub:`A six-chapter portrait of ${name}`,
      caption:`${topArtist} · ${caption}`,
    },
  ],
});

const lateNightWrapped=makeWrapped({
  name:"Late Night Drive",tracks:84,runtime:"5.3 hrs",topArtist:"Frank Ocean",topArtistTracks:9,
  trait:"Low-light, reflective sequencing",personality:"The Night Rider",
  caption:"The Weeknd · Joji · SZA",
});
const gymWrapped=makeWrapped({
  name:"Gym Hits",tracks:57,runtime:"3.1 hrs",topArtist:"Travis Scott",topArtistTracks:8,
  trait:"High-energy training fuel",personality:"The Motivator",
  caption:"Future · Kanye West · Lil Baby",
});
const chillWrapped=makeWrapped({
  name:"Chill Sundays",tracks:103,runtime:"6.4 hrs",topArtist:"Bon Iver",topArtistTracks:11,
  trait:"Acoustic, unhurried listening",personality:"The Slow Curator",
  caption:"Hozier · Phoebe Bridgers · Noah Kahan",
});
const countryWrapped=makeWrapped({
  name:"Country Roads",tracks:62,runtime:"3.7 hrs",topArtist:"Morgan Wallen",topArtistTracks:12,
  trait:"Modern country with roots",personality:"The Roadtripper",
  caption:"Zach Bryan · Tyler Childers · Luke Combs",
});
const partyWrapped=makeWrapped({
  name:"Party Mix",tracks:91,runtime:"5.0 hrs",topArtist:"Dua Lipa",topArtistTracks:9,
  trait:"Dance-floor momentum",personality:"The Spark",
  caption:"Calvin Harris · Doja Cat · The Weeknd",
});

export const PLAYLISTS=[
  {
    id:1,name:"This Is Bennett",accent:"var(--color-accent-bennett)",desc:"Your archive",
    thesis:"A lifetime of listening, arranged as a living archive.",
    sonicStatement:"High energy and dark mood run through a cross-genre archive built for impact.",
    artwork:{
      src:"/artwork/this-is-bennett.svg",
      alt:"Abstract contact-sheet artwork in violet, coral, cream, and black",
      caption:"Cover study 01 · the working archive",
    },
    analytics:{
      trackCount:TOTAL,runtime:"76.7 hrs",years:"1963–2026",genres,topArtists:artists,
      overviewStats:OVERVIEW_STATS,wrapped:{personality:PERSONALITY,cards:WRAPPED_CARDS},
    },
  },
  {
    id:2,name:"Late Night Drive",accent:"var(--color-accent-night)",desc:"Slow and dark",
    thesis:"After-hours R&B and rap, sequenced for the long way home.",
    sonicStatement:"Low-lit R&B and rap move slowly, with a reflective center and electric edges.",
    artwork:{
      src:"/artwork/late-night-drive.svg",
      alt:"Abstract midnight-blue cover with a pale road cutting through geometric forms",
      caption:"Cover study 02 · after midnight",
    },
    analytics:{
      trackCount:84,runtime:"5.3 hrs",years:"2007–2026",
      genres:[
        {name:"R&B / Soul",value:31},{name:"Rap / Hip-Hop",value:24},
        {name:"Pop",value:17},{name:"Rock / Indie",value:12},
      ],
      topArtists:[
        {name:"Joji",v:4},{name:"SZA",v:5},{name:"The Weeknd",v:6},
        {name:"Drake",v:7},{name:"Frank Ocean",v:9},
      ],
      overviewStats:makeOverviewStats({tracks:84,runtime:"5.3 hrs",decades:3,explicit:"46%",popularity:68,peakYear:2018}),
      wrapped:lateNightWrapped,
    },
  },
  {
    id:3,name:"Gym Hits",accent:"var(--color-accent-gym)",desc:"High energy only",
    thesis:"Hard drums and high-impact hooks, with no room for dead air.",
    sonicStatement:"Hard drums, sharp hooks, and high energy keep every transition moving forward.",
    artwork:{
      src:"/artwork/gym-hits.svg",
      alt:"Abstract red and black cover built from weights, bars, and sharp diagonal forms",
      caption:"Cover study 03 · full intensity",
    },
    analytics:{
      trackCount:57,runtime:"3.1 hrs",years:"2011–2026",
      genres:[
        {name:"Rap / Hip-Hop",value:32},{name:"EDM / Electronic",value:11},
        {name:"Rock / Indie",value:8},{name:"Pop",value:6},
      ],
      topArtists:[
        {name:"Kanye West",v:4},{name:"Lil Baby",v:5},{name:"Future",v:6},
        {name:"Eminem",v:6},{name:"Travis Scott",v:8},
      ],
      overviewStats:makeOverviewStats({tracks:57,runtime:"3.1 hrs",decades:2,explicit:"68%",popularity:79,peakYear:2020}),
      wrapped:gymWrapped,
    },
  },
  {
    id:4,name:"Chill Sundays",accent:"var(--color-accent-chill)",desc:"Low tempo",
    thesis:"Acoustic warmth and slow-blooming songs for an unhurried day.",
    sonicStatement:"Acoustic warmth, low-tempo pacing, and soft dynamics hold the room open.",
    artwork:{
      src:"/artwork/chill-sundays.svg",
      alt:"Abstract sage and cream cover with soft organic shapes and quiet linework",
      caption:"Cover study 04 · Sunday, unhurried",
    },
    analytics:{
      trackCount:103,runtime:"6.4 hrs",years:"1994–2026",
      genres:[
        {name:"Folk",value:34},{name:"Rock / Indie",value:29},
        {name:"R&B / Soul",value:21},{name:"Pop",value:19},
      ],
      topArtists:[
        {name:"Noah Kahan",v:5},{name:"Phoebe Bridgers",v:6},{name:"Hozier",v:8},
        {name:"Frank Ocean",v:9},{name:"Bon Iver",v:11},
      ],
      overviewStats:makeOverviewStats({tracks:103,runtime:"6.4 hrs",decades:4,explicit:"18%",popularity:61,peakYear:2019}),
      wrapped:chillWrapped,
    },
  },
  {
    id:5,name:"Country Roads",accent:"var(--color-accent-country)",desc:"Wallen, Zach, Childers",
    thesis:"Modern country cut with road songs, roots, and open sky.",
    sonicStatement:"Modern country leads with open-road momentum, warm acoustics, and direct voices.",
    artwork:{
      src:"/artwork/country-roads.svg",
      alt:"Abstract ochre landscape cover with a low sun and a road crossing dark fields",
      caption:"Cover study 05 · open road",
    },
    analytics:{
      trackCount:62,runtime:"3.7 hrs",years:"1990–2026",
      genres:[
        {name:"Country",value:49},{name:"Folk",value:7},
        {name:"Rock / Indie",value:4},{name:"Pop",value:2},
      ],
      topArtists:[
        {name:"Chris Stapleton",v:4},{name:"Luke Combs",v:5},{name:"Tyler Childers",v:7},
        {name:"Zach Bryan",v:10},{name:"Morgan Wallen",v:12},
      ],
      overviewStats:makeOverviewStats({tracks:62,runtime:"3.7 hrs",decades:4,explicit:"23%",popularity:73,peakYear:2023}),
      wrapped:countryWrapped,
    },
  },
  {
    id:6,name:"Party Mix",accent:"var(--color-accent-party)",desc:"High BPM",
    thesis:"Pop and electronic momentum, built to keep the room moving.",
    sonicStatement:"Bright pop and electronic pulse keep the mix rhythmic, fast, and communal.",
    artwork:{
      src:"/artwork/party-mix.svg",
      alt:"Abstract magenta and cream cover with a rhythmic checkerboard and circular forms",
      caption:"Cover study 06 · room in motion",
    },
    analytics:{
      trackCount:91,runtime:"5.0 hrs",years:"2005–2026",
      genres:[
        {name:"Pop",value:38},{name:"EDM / Electronic",value:27},
        {name:"Rap / Hip-Hop",value:18},{name:"Latin",value:8},
      ],
      topArtists:[
        {name:"Doja Cat",v:5},{name:"The Weeknd",v:6},{name:"David Guetta",v:7},
        {name:"Calvin Harris",v:8},{name:"Dua Lipa",v:9},
      ],
      overviewStats:makeOverviewStats({tracks:91,runtime:"5.0 hrs",decades:3,explicit:"41%",popularity:82,peakYear:2022}),
      wrapped:partyWrapped,
    },
  },
];
