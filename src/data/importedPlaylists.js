import { C } from "../theme.js";
import chillVibesCsv from "./imports/Chill_vibes.csv?raw";
import dirtRoadDrivingCsv from "./imports/Dirt_Road_Driving.csv?raw";
import gymPumpCsv from "./imports/Gym_Pump.csv?raw";
import lateNightDriveCsv from "./imports/Late_Night_Drive.csv?raw";
import pregamingCsv from "./imports/Pregaming.csv?raw";

const KEY_NAMES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];

const PLAYLIST_CONFIGS = [
  {
    id:2,
    name:"Late Night Drive",
    accent:"var(--color-accent-night)",
    csv:lateNightDriveCsv,
    artwork:{
      src:"/artwork/late-night-drive.svg",
      alt:"Abstract midnight-blue cover with a pale road cutting through geometric forms",
      caption:"Cover study 02 · after midnight",
    },
  },
  {
    id:3,
    name:"Chill Vibes",
    accent:"var(--color-accent-chill)",
    csv:chillVibesCsv,
    artwork:{
      src:"/artwork/chill-sundays.svg",
      alt:"Abstract sage and cream cover with soft organic shapes and quiet linework",
      caption:"Cover study 03 · low-key rotation",
    },
  },
  {
    id:4,
    name:"Dirt Road Driving",
    accent:"var(--color-accent-country)",
    csv:dirtRoadDrivingCsv,
    artwork:{
      src:"/artwork/country-roads.svg",
      alt:"Abstract ochre landscape cover with a low sun and a road crossing dark fields",
      caption:"Cover study 04 · open road",
    },
  },
  {
    id:5,
    name:"Pregaming",
    accent:"var(--color-accent-party)",
    csv:pregamingCsv,
    artwork:{
      src:"/artwork/party-mix.svg",
      alt:"Abstract magenta and cream cover with a rhythmic checkerboard and circular forms",
      caption:"Cover study 05 · room in motion",
    },
  },
  {
    id:6,
    name:"Gym Pump",
    accent:"var(--color-accent-gym)",
    csv:gymPumpCsv,
    artwork:{
      src:"/artwork/gym-hits.svg",
      alt:"Abstract red and black cover built from weights, bars, and sharp diagonal forms",
      caption:"Cover study 06 · full intensity",
    },
  },
];

const GENRE_RULES = [
  {name:"Country",pattern:/country|bluegrass|americana|red dirt|outlaw/},
  {name:"Latin",pattern:/latin|reggaeton|urbano/},
  {name:"R&B / Soul",pattern:/r&b|rhythm and blues|soul|motown/},
  {name:"Rap / Hip-Hop",pattern:/rap|hip hop|trap|drill|grime/},
  {name:"EDM / Electronic",pattern:/electronic|edm|house|techno|trance|dubstep/},
  {name:"Rock / Indie",pattern:/rock|indie|alternative|grunge|punk|metal|psychedelic/},
  {name:"Folk",pattern:/folk|singer-songwriter/},
  {name:"Pop",pattern:/pop|dance/},
];

const splitCsvRows = source => {
  const rows=[];
  let row=[];
  let field="";
  let quoted=false;
  const text=source.replace(/^\uFEFF/,"");

  for(let index=0;index<text.length;index+=1) {
    const character=text[index];

    if(quoted) {
      if(character==='"' && text[index+1]==='"') {
        field+='"';
        index+=1;
      } else if(character==='"') {
        quoted=false;
      } else {
        field+=character;
      }
      continue;
    }

    if(character==='"') {
      quoted=true;
    } else if(character===",") {
      row.push(field);
      field="";
    } else if(character==="\n" || character==="\r") {
      if(character==="\r" && text[index+1]==="\n") index+=1;
      row.push(field);
      if(row.some(value=>value!=="")) rows.push(row);
      row=[];
      field="";
    } else {
      field+=character;
    }
  }

  if(field || row.length) {
    row.push(field);
    rows.push(row);
  }

  return rows;
};

export const parsePlaylistCsv = source => {
  const [headers,...rows]=splitCsvRows(source);
  return rows.map(values=>Object.fromEntries(
    headers.map((header,index)=>[header.trim(),values[index]?.trim() ?? ""]),
  ));
};

const toNumber = value => {
  if(value==="") return null;
  const number=Number(value);
  return Number.isFinite(number) ? number : null;
};

const countValue = (counts,value) => {
  if(!value) return;
  counts.set(value,(counts.get(value) ?? 0)+1);
};

const sortedCounts = counts => [...counts.entries()]
  .sort((left,right)=>right[1]-left[1] || left[0].localeCompare(right[0]));

const average = (tracks,key) => {
  const values=tracks.map(track=>track[key]).filter(value=>value!==null);
  if(!values.length) return 0;
  return values.reduce((total,value)=>total+value,0)/values.length;
};

const asPercentage = value => Math.round(value*100);

const classifyGenre = rawGenres => {
  const searchable=rawGenres.join(" ").toLocaleLowerCase();
  return GENRE_RULES.find(rule=>rule.pattern.test(searchable))?.name ?? "Unclassified";
};

const normalizeTrack = row => {
  const releaseYear=Number.parseInt(row["Release Date"].slice(0,4),10);
  const artists=row["Artist Name(s)"].split(";").map(value=>value.trim()).filter(Boolean);
  const rawGenres=row.Genres.split(",").map(value=>value.trim()).filter(Boolean);
  const key=toNumber(row.Key);

  return {
    uri:row["Track URI"],
    name:row["Track Name"],
    album:row["Album Name"],
    artists,
    releaseYear:Number.isInteger(releaseYear) ? releaseYear : null,
    durationMs:toNumber(row["Duration (ms)"]) ?? 0,
    popularity:toNumber(row.Popularity),
    explicit:row.Explicit.toLocaleLowerCase()==="true",
    addedAt:row["Added At"],
    rawGenres,
    genre:classifyGenre(rawGenres),
    label:row["Record Label"] || "Unspecified",
    danceability:toNumber(row.Danceability),
    energy:toNumber(row.Energy),
    key:Number.isInteger(key) && key>=0 && key<KEY_NAMES.length ? key : null,
    acousticness:toNumber(row.Acousticness),
    valence:toNumber(row.Valence),
    tempo:toNumber(row.Tempo),
  };
};

const formatRuntime = durationMs => {
  const hours=durationMs/3600000;
  if(hours<1) return `${Math.round(durationMs/60000)} min`;
  return `${hours.toFixed(1)} hrs`;
};

const formatDate = date => {
  const [year,month,day]=date.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US",{
    month:"short",
    day:"numeric",
    timeZone:"UTC",
  }).format(new Date(Date.UTC(year,month-1,day)));
};

const makeOverviewStats = ({
  trackCount,
  runtime,
  decades,
  explicitPercentage,
  averagePopularity,
  peakYear,
}) => [
  {l:"Songs",v:trackCount.toLocaleString(),c:C.purple},
  {l:"Runtime",v:runtime,c:C.emerald},
  {l:"Decades",v:String(decades),c:C.amber},
  {l:"Explicit",v:`${explicitPercentage}%`,c:C.rose},
  {l:"Avg Popularity",v:String(averagePopularity),c:C.blue},
  {l:"Peak Year",v:String(peakYear),c:C.pink},
];

const makeDistribution = (tracks,key,bands) => {
  const counts=bands.map(()=>0);
  for(const track of tracks) {
    const value=track[key];
    if(value===null) continue;
    const bandIndex=bands.findIndex(band=>band.matches(value));
    if(bandIndex>=0) counts[bandIndex]+=1;
  }
  return bands.map((band,index)=>({l:band.label,v:counts[index]}));
};

const makeAudioCharts = tracks => [
  {
    t:"Energy",
    d:makeDistribution(tracks,"energy",[
      {label:"Very Low",matches:value=>value<.2},
      {label:"Low",matches:value=>value>=.2 && value<.4},
      {label:"Medium",matches:value=>value>=.4 && value<.6},
      {label:"High",matches:value=>value>=.6 && value<.8},
      {label:"Very High",matches:value=>value>=.8},
    ]),
  },
  {
    t:"Mood",
    d:makeDistribution(tracks,"valence",[
      {label:"Very Sad",matches:value=>value<.2},
      {label:"Melancholic",matches:value=>value>=.2 && value<.4},
      {label:"Neutral",matches:value=>value>=.4 && value<.6},
      {label:"Upbeat",matches:value=>value>=.6 && value<.8},
      {label:"Very Happy",matches:value=>value>=.8},
    ]),
  },
  {
    t:"Tempo",
    d:makeDistribution(tracks,"tempo",[
      {label:"Very Slow",matches:value=>value<80},
      {label:"Slow",matches:value=>value>=80 && value<100},
      {label:"Medium",matches:value=>value>=100 && value<120},
      {label:"Fast",matches:value=>value>=120 && value<140},
      {label:"Very Fast",matches:value=>value>=140},
    ]),
  },
  {
    t:"Popularity",
    d:[
      {l:"Unknown",v:tracks.filter(track=>track.popularity===null).length},
      ...makeDistribution(tracks,"popularity",[
        {label:"Low",matches:value=>value<40},
        {label:"Mid",matches:value=>value>=40 && value<60},
        {label:"High",matches:value=>value>=60 && value<80},
        {label:"Very High",matches:value=>value>=80},
      ]),
    ],
  },
];

const makeAudioByGenre = tracks => {
  const groups=new Map();
  for(const track of tracks) {
    const group=groups.get(track.genre) ?? [];
    group.push(track);
    groups.set(track.genre,group);
  }

  return [...groups.entries()]
    .sort((left,right)=>right[1].length-left[1].length)
    .slice(0,6)
    .map(([genre,genreTracks])=>({
      g:genre,
      Dance:asPercentage(average(genreTracks,"danceability")),
      Energy:asPercentage(average(genreTracks,"energy")),
      Mood:asPercentage(average(genreTracks,"valence")),
      Acoustic:asPercentage(average(genreTracks,"acousticness")),
    }));
};

const makeProfile = ({
  dominantGenre,
  energy,
  dance,
  mood,
  acousticness,
}) => {
  if(dominantGenre==="Country") return "The Open Road";
  if(energy>=70 && dance>=65) return "The Catalyst";
  if(mood<45) return "After Hours";
  if(acousticness>=40) return "The Slow Burn";
  return "The Sequencer";
};

const makeWrapped = ({
  name,
  trackCount,
  runtime,
  explicitPercentage,
  averagePopularity,
  topArtist,
  peakYear,
  decades,
  dominantGenres,
  energy,
  dance,
  mood,
  acousticness,
}) => {
  const profile=makeProfile({
    dominantGenre:dominantGenres[0],
    energy,
    dance,
    mood,
    acousticness,
  });

  return {
    personality:{
      type:profile,
      desc:`${name} resolves to ${profile.toLocaleLowerCase()} from its measured energy, danceability, mood, and genre balance.`,
      traits:[
        `${energy}% average energy`,
        `${dance}% average danceability`,
        `${mood}% average mood`,
        `${decades} decades represented`,
      ],
      compare:`Most represented genres: ${dominantGenres.slice(0,3).join(" · ")}`,
    },
    cards:[
      {
        id:1,
        stat:trackCount.toLocaleString(),
        label:"songs in this playlist",
        sub:`${runtime} of music`,
        caption:"Counted directly from the imported playlist export.",
      },
      {
        id:2,
        stat:`${energy}%`,
        label:"average energy",
        sub:`Dance ${dance}% · Mood ${mood}%`,
        caption:"Averages calculated from the exported audio-feature columns.",
      },
      {
        id:3,
        stat:topArtist.name,
        label:"appears most often",
        sub:`${topArtist.v} playlist appearances`,
        caption:"Every credited artist is counted once per track.",
      },
      {
        id:4,
        stat:`${explicitPercentage}%`,
        label:"of the playlist is explicit",
        sub:`Average popularity · ${averagePopularity}`,
        caption:"Both values come directly from the exported track metadata.",
      },
      {
        id:5,
        stat:profile,
        label:"is the playlist profile",
        sub:`Derived from ${trackCount.toLocaleString()} exported tracks`,
        caption:"A descriptive label based only on the measured catalogue and audio fields.",
      },
      {
        id:6,
        stat:String(peakYear),
        label:"is the most represented release year",
        sub:`${decades} decades in the collection`,
        caption:"Release dates determine the final chapter.",
      },
    ],
  };
};

const buildPlaylist = config => {
  const tracks=parsePlaylistCsv(config.csv).map(normalizeTrack);
  const trackCount=tracks.length;
  const durationMs=tracks.reduce((total,track)=>total+track.durationMs,0);
  const runtime=formatRuntime(durationMs);
  const explicitPercentage=Math.round(
    (tracks.filter(track=>track.explicit).length/trackCount)*100,
  );
  const averagePopularity=Math.round(average(tracks,"popularity"));

  const artistCounts=new Map();
  const genreCounts=new Map();
  const labelCounts=new Map();
  const releaseYearCounts=new Map();
  const addedCounts=new Map();
  const albumCounts=new Map();
  const collaborationCounts=new Map();
  const albumArtists=new Map();

  for(const track of tracks) {
    for(const artist of track.artists) countValue(artistCounts,artist);
    countValue(genreCounts,track.genre);
    countValue(labelCounts,track.label);
    if(track.releaseYear!==null) countValue(releaseYearCounts,String(track.releaseYear));
    if(track.addedAt) countValue(addedCounts,track.addedAt.slice(0,10));

    const albumKey=`${track.album}\u0000${track.artists[0] ?? "Unknown artist"}`;
    countValue(albumCounts,albumKey);
    albumArtists.set(albumKey,track.artists[0] ?? "Unknown artist");

    for(let left=0;left<track.artists.length;left+=1) {
      for(let right=left+1;right<track.artists.length;right+=1) {
        const pair=[track.artists[left],track.artists[right]].sort();
        countValue(collaborationCounts,pair.join("\u0000"));
      }
    }
  }

  const topArtists=sortedCounts(artistCounts).slice(0,15)
    .map(([name,value])=>({name,v:value}));
  const genres=sortedCounts(genreCounts).map(([name,value])=>({name,value}));
  const labelEntries=sortedCounts(labelCounts);
  const visibleLabels=labelEntries.slice(0,7).map(([label,value])=>({l:label,v:value}));
  const otherLabelCount=labelEntries.slice(7).reduce((total,[,value])=>total+value,0);
  if(otherLabelCount) visibleLabels.push({l:"Other",v:otherLabelCount});

  const releaseYearDistribution=sortedCounts(releaseYearCounts)
    .sort((left,right)=>Number(left[0])-Number(right[0]))
    .map(([year,value])=>({year:Number(year),value}));
  const releaseYears=releaseYearDistribution.map(point=>point.year);
  const earliestYear=Math.min(...releaseYears);
  const latestYear=Math.max(...releaseYears);
  const peakYear=sortedCounts(releaseYearCounts)[0][0];
  const decades=[...new Set(releaseYears.map(year=>Math.floor(year/10)*10))]
    .sort((left,right)=>left-right);

  const growth=sortedCounts(addedCounts)
    .sort((left,right)=>left[0].localeCompare(right[0]))
    .map(([date,value])=>({date,d:formatDate(date),v:value}));

  const topAlbums=sortedCounts(albumCounts).slice(0,8).map(([key,value])=>{
    const [album]=key.split("\u0000");
    return {a:album,artist:albumArtists.get(key),v:value};
  });

  const collaborations=sortedCounts(collaborationCounts)
    .filter(([,value])=>value>1)
    .slice(0,8)
    .map(([pair,value])=>{
      const [a,b]=pair.split("\u0000");
      return {a,b,n:value};
    });

  const keyCounts=new Map(KEY_NAMES.map(name=>[name,0]));
  for(const track of tracks) {
    if(track.key!==null) {
      const keyName=KEY_NAMES[track.key];
      keyCounts.set(keyName,keyCounts.get(keyName)+1);
    }
  }
  const keys=KEY_NAMES.map(key=>({k:key,v:keyCounts.get(key)}));

  const energy=asPercentage(average(tracks,"energy"));
  const dance=asPercentage(average(tracks,"danceability"));
  const mood=asPercentage(average(tracks,"valence"));
  const acousticness=asPercentage(average(tracks,"acousticness"));
  const auraMetrics=[
    {l:"Energy",v:`${energy}%`,c:C.rose},
    {l:"Dance",v:`${dance}%`,c:C.purple},
    {l:"Mood",v:`${mood}%`,c:C.blue},
  ];

  const mainstreamCount=tracks.filter(
    track=>track.popularity!==null && track.popularity>=70,
  ).length;
  const undergroundCount=tracks.filter(
    track=>track.popularity!==null && track.popularity<50,
  ).length;
  const popularityBreakdown={
    mainstreamCount,
    mainstreamPercentage:Math.round((mainstreamCount/trackCount)*100),
    undergroundCount,
    undergroundPercentage:Math.round((undergroundCount/trackCount)*100),
  };

  const dominantGenres=[
    ...genres.filter(genre=>genre.name!=="Unclassified"),
    ...genres.filter(genre=>genre.name==="Unclassified"),
  ].map(genre=>genre.name);
  const topArtist=topArtists[0];
  const years=`${earliestYear}–${latestYear}`;
  const sonicStatement=`${dominantGenres[0]} leads a collection averaging ${energy}% energy, ${dance}% danceability, and ${mood}% mood.`;

  return {
    id:config.id,
    name:config.name,
    accent:config.accent,
    desc:`${dominantGenres[0]} · ${trackCount.toLocaleString()} tracks`,
    thesis:`${dominantGenres[0]} leads a ${trackCount.toLocaleString()}-track sequence spanning ${years}, with ${topArtist.name} appearing most often.`,
    sonicStatement,
    artwork:config.artwork,
    analytics:{
      source:"csv",
      trackCount,
      runtime,
      years,
      genres,
      topArtists,
      overviewStats:makeOverviewStats({
        trackCount,
        runtime,
        decades:decades.length,
        explicitPercentage,
        averagePopularity,
        peakYear,
      }),
      explicitPercentage,
      averagePopularity,
      decades,
      releaseYearDistribution,
      labels:visibleLabels,
      topAlbums,
      collaborations,
      growth,
      popularityBreakdown,
      auraMetrics,
      charts:makeAudioCharts(tracks),
      keys,
      audioByGenre:makeAudioByGenre(tracks),
      historyAvailable:false,
      wrapped:makeWrapped({
        name:config.name,
        trackCount,
        runtime,
        explicitPercentage,
        averagePopularity,
        topArtist,
        peakYear,
        decades:decades.length,
        dominantGenres,
        energy,
        dance,
        mood,
        acousticness,
      }),
    },
  };
};

export const IMPORTED_PLAYLISTS=PLAYLIST_CONFIGS.map(buildPlaylist);
