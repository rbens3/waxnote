import { useLayoutEffect, useState } from "react";
import { Dashboard } from "./components/Dashboard.jsx";
import { LoginScreen, PlaylistPicker } from "./components/Screens.jsx";

export default function App() {
  const [screen,setScreen]=useState("login");
  const [playlist,setPlaylist]=useState(null);

  useLayoutEffect(()=>{
    window.scrollTo(0,0);
  },[screen]);

  if(screen==="login") return <LoginScreen onLogin={()=>setScreen("pick")}/>;
  if(screen==="pick") return <PlaylistPicker onPick={p=>{setPlaylist(p);setScreen("dash");}}/>;
  return <Dashboard playlist={playlist} onSwitch={()=>setScreen("pick")}/>;
}
