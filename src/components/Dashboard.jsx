import { useLayoutEffect, useRef, useState } from "react";
import { BG, TEXT } from "../theme.js";
import { TABS } from "../data/mockData.js";
import {
  TabOverview, TabCatalog, TabAudio, TabHistory, TabWrapped,
} from "./DashboardTabs.jsx";

export function Dashboard({playlist,onSwitch}) {
  const [tab,setTab]=useState(0);
  const contentRef=useRef(null);
  const tabRefs=useRef([]);
  const {trackCount,runtime,years}=playlist.analytics;

  useLayoutEffect(()=>{
    const content=contentRef.current;
    if(!content) return;
    content.scrollTop=0;
    content.scrollLeft=0;
  },[tab,playlist.id]);

  const moveTabFocus = (event,index) => {
    if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key)) return;
    event.preventDefault();
    let next=index;
    if(event.key==="ArrowLeft") next=(index-1+TABS.length)%TABS.length;
    if(event.key==="ArrowRight") next=(index+1)%TABS.length;
    if(event.key==="Home") next=0;
    if(event.key==="End") next=TABS.length-1;
    setTab(next);
    const nextTab=tabRefs.current[next];
    nextTab?.focus({preventScroll:true});
    nextTab?.scrollIntoView({block:"nearest",inline:"nearest"});
  };

  return(
    <div className="dashboard" style={{"--playlist-accent":playlist.accent,background:BG,color:TEXT}}>
      <header className="dashboard__header">
        <div className="dashboard__masthead">
          <div className="dashboard__wordmark">Playlist Pulse</div>
          <div className="dashboard__current">
            <span className="metadata">Current feature</span>
            <strong>{playlist.name}</strong>
          </div>
          <button className="dashboard__switch" type="button" onClick={onSwitch}>
            Switch playlist <span aria-hidden="true">↗</span>
          </button>
        </div>

        <nav className="dashboard__tabs" role="tablist" aria-label="Playlist chapters">
          {TABS.map((label,index)=>(
            <button
              className="chapter-tab"
              id={`playlist-tab-${index}`}
              key={label}
              ref={node=>{tabRefs.current[index]=node;}}
              type="button"
              role="tab"
              aria-controls={`playlist-panel-${index}`}
              aria-selected={tab===index}
              tabIndex={tab===index?0:-1}
              onClick={()=>setTab(index)}
              onKeyDown={event=>moveTabFocus(event,index)}
            >
              <span className="chapter-tab__index metadata">{String(index + 1).padStart(2,"0")}</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </header>

      <main
        className="dashboard__content"
        id={`playlist-panel-${tab}`}
        ref={contentRef}
        role="tabpanel"
        aria-labelledby={`playlist-tab-${tab}`}
        tabIndex="0"
      >
        {tab===0 && <TabOverview playlist={playlist}/>}
        {tab===1 && <TabCatalog playlist={playlist}/>}
        {tab===2 && <TabAudio playlist={playlist}/>}
        {tab===3 && <TabHistory playlist={playlist}/>}
        {tab===4 && <TabWrapped playlist={playlist}/>}
      </main>

      <aside className="now-playing" aria-label="Playlist preview. Playback is not connected.">
        <img
          className="now-playing__art"
          src={playlist.artwork.src}
          alt=""
          width="800"
          height="800"
        />
        <div className="now-playing__track">
          <span className="metadata">Playlist preview · not connected</span>
          <strong>Runaway</strong>
          <span>— Kanye West</span>
        </div>
        <div
          className="now-playing__progress"
          role="progressbar"
          aria-label="Mock preview progress"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="67"
        >
          <span/>
        </div>
        <p className="now-playing__context">
          From <strong>{playlist.name}</strong>
          <span>Playback not connected</span>
          <span>{trackCount.toLocaleString()} tracks · {runtime} · {years}</span>
        </p>
      </aside>
    </div>
  );
}
