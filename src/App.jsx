import { useLayoutEffect, useState } from "react";
import { Dashboard } from "./components/Dashboard.jsx";
import { EntryScreen, PlaylistPicker } from "./components/Screens.jsx";
import { PLAYLISTS } from "./data/mockData.js";

const FEATURED_PLAYLIST=PLAYLISTS.find(({name})=>name==="This Is Bennett") ?? PLAYLISTS[0];

export default function App() {
  const [screen,setScreen]=useState("entry");
  const [playlist,setPlaylist]=useState(null);

  const openPlaylist = nextPlaylist => {
    setPlaylist(nextPlaylist);
    setScreen("dash");
  };

  useLayoutEffect(()=>{
    window.scrollTo(0,0);
  },[screen]);

  let content;
  if(screen==="entry") {
    content=(
      <EntryScreen
        onFeatured={()=>openPlaylist(FEATURED_PLAYLIST)}
        onBrowse={()=>setScreen("pick")}
      />
    );
  } else if(screen==="pick") {
    content=<PlaylistPicker onPick={openPlaylist}/>;
  } else {
    content=<Dashboard playlist={playlist} onSwitch={()=>setScreen("pick")}/>;
  }

  return (
    <div className="app-shell">
      <p className="prototype-notice">Interactive prototype · Uses mock data</p>
      {content}
    </div>
  );
}
