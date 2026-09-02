import {
    NavLink,
    Outlet,
  } from "react-router-dom"

  export function FanLayout() {
    const tabs = [
      {
        label: "Scores",
        to: "/fan",
        end: true,
      },
      {
        label: "Standings",
        to: "/fan/standings",
      },
      {
        label: "Stats",
        to: "/fan/stats",
      },
      {
        label: "Teams",
        to: "/fan/teams",
      },
    ]
  
    return (
      <main className="scoreboard-shell min-h-screen">
  
        {/* ONE WIDTH CONTAINER */}
        <div className="mx-auto max-w-3xl px-4 py-4 md:px-6">
  
          {/* HEADER */}
          <header
            className="
              scoreboard-panel
              border-b-4
              border-scoreboard-red
              px-5 py-5
            "
          >
            <div className="scoreboard-label text-scoreboard-amber">
              MBL Baseball
            </div>
  
            <div className="mt-1 flex items-end justify-between gap-4">
              <h1 className="scoreboard-title text-3xl md:text-4xl">
                The Berds 10u
              </h1>
  
              <div className="scoreboard-label text-right opacity-60">
                The Berds are Angry
              </div>
            </div>
          </header>
  
          {/* NAV */}
          <nav
            className="
              flex
              overflow-x-auto
              border-b-2
              border-scoreboard-red
              bg-scoreboard-dark
            "
          >
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.end}
                className={({ isActive }) =>
                  [
                    "scoreboard-label",
                    "shrink-0",
                    "px-4 py-3",
                    "transition",
                    isActive
                      ? "bg-scoreboard-red text-scoreboard-cream"
                      : "text-scoreboard-cream/60 hover:text-scoreboard-cream",
                  ].join(" ")
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>
  
          {/* ACTIVE FAN PAGE RENDERS HERE */}
          <div className="py-6">
            <Outlet />
          </div>
  
        </div>
      </main>
    )
  }