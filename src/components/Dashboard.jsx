import { useLayoutEffect, useRef, useState } from "react";
import { BG, TEXT } from "../theme.js";
import { TABS } from "../data/mockData.js";
import {
  TabOverview, TabCatalog, TabAudio, TabHistory, TabWrapped,
} from "./DashboardTabs.jsx";

export function Dashboard({playlist,onSwitch}) {
  const [tab,setTab]=useState(0);
  const contentRef=useRef(null);
  const lastDashboardTab=useRef(0);
  const pendingTabFocus=useRef(null);
  const tabRefs=useRef([]);
  const isWrapped=tab===4;

  useLayoutEffect(()=>{
    const content=contentRef.current;
    if(!content) return;
    content.scrollTop=0;
    content.scrollLeft=0;
    if(pendingTabFocus.current===tab) {
      tabRefs.current[tab]?.focus({preventScroll:true});
      pendingTabFocus.current=null;
    }
  },[tab,playlist.id]);

  const showTab = (next) => {
    if(next!==4) lastDashboardTab.current=next;
    setTab(next);
  };

  const exitWrapped = () => {
    const next=lastDashboardTab.current;
    pendingTabFocus.current=next;
    setTab(next);
  };

  const moveTabFocus = (event,index) => {
    if(!["ArrowLeft","ArrowRight","Home","End"].includes(event.key)) return;
    event.preventDefault();
    let next=index;
    if(event.key==="ArrowLeft") next=(index-1+TABS.length)%TABS.length;
    if(event.key==="ArrowRight") next=(index+1)%TABS.length;
    if(event.key==="Home") next=0;
    if(event.key==="End") next=TABS.length-1;
    showTab(next);
    if(next===4) return;
    const nextTab=tabRefs.current[next];
    nextTab?.focus({preventScroll:true});
    nextTab?.scrollIntoView({block:"nearest",inline:"nearest"});
  };

  return(
    <div
      className="dashboard"
      data-wrapped={isWrapped}
      style={{"--playlist-accent":playlist.accent,background:BG,color:TEXT}}
    >
      {!isWrapped && (
        <header className="dashboard__header">
          <div className="dashboard__masthead">
            <div className="dashboard__wordmark">Waxnote</div>
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
                onClick={()=>showTab(index)}
                onKeyDown={event=>moveTabFocus(event,index)}
              >
                <span className="chapter-tab__index metadata">{String(index + 1).padStart(2,"0")}</span>
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </header>
      )}

      <main
        className="dashboard__content"
        id={`playlist-panel-${tab}`}
        ref={contentRef}
        role={isWrapped ? undefined : "tabpanel"}
        aria-label={isWrapped ? `${playlist.name} Wrapped` : undefined}
        aria-labelledby={isWrapped ? undefined : `playlist-tab-${tab}`}
        tabIndex={isWrapped ? undefined : 0}
      >
        {tab===0 && <TabOverview playlist={playlist}/>}
        {tab===1 && <TabCatalog playlist={playlist}/>}
        {tab===2 && <TabAudio playlist={playlist}/>}
        {tab===3 && <TabHistory playlist={playlist}/>}
        {tab===4 && <TabWrapped playlist={playlist} onExit={exitWrapped}/>}
      </main>
    </div>
  );
}
