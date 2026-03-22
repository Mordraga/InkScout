import React, { useState, useEffect, useCallback } from 'react'
import ProfilesPanel from './views/ProfilesPanel.jsx'
import LeadsPanel from './views/LeadsPanel.jsx'
import WorkspacePanel from './views/WorkspacePanel.jsx'
import ConsoleDrawer from './views/ConsoleDrawer.jsx'
import SettingsModal from './views/SettingsModal.jsx'
import KeywordsModal from './views/KeywordsModal.jsx'
import KeywordsPoolModal from './views/KeywordsPoolModal.jsx'
import BlacklistModal from './views/BlacklistModal.jsx'
import SynonymsModal from './views/SynonymsModal.jsx'
import { getProfiles } from './api.js'

const TABS = ['Profiles', 'Leads', 'Workspace', 'Console']

const TAB_ICONS = {
  Profiles: '\uD83D\uDC19',
  Leads: '\uD83C\uDF0A',
  Workspace: '\uD83E\uDD91',
  Console: '\uD83D\uDCE1',
}

function titleCase(plan) {
  return plan ? `${plan.charAt(0).toUpperCase()}${plan.slice(1)}` : 'Free'
}

export default function ToolApp({
  entitlements,
  onOpenPricing,
  onSignOut,
  userEmail,
}) {
  const [activeTab, setActiveTab] = useState('Leads')
  const [selectedLead, setSelectedLead] = useState(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [keywordsPoolOpen, setKeywordsPoolOpen] = useState(false)
  const [blacklistOpen, setBlacklistOpen] = useState(false)
  const [synonymsOpen, setSynonymsOpen] = useState(false)
  const [consoleOpen, setConsoleOpen] = useState(false)
  const [leadsRefreshSignal, setLeadsRefreshSignal] = useState(0)
  const [profiles, setProfiles] = useState([])
  const [keywordsModalProfile, setKeywordsModalProfile] = useState(null)

  const refreshProfiles = useCallback(async () => {
    try {
      const data = await getProfiles()
      setProfiles(data)
    } catch {
      // Profiles panel handles its own error display.
    }
  }, [])

  useEffect(() => { refreshProfiles() }, [refreshProfiles])

  const handleProfilesChanged = useCallback(() => {
    refreshProfiles()
    setLeadsRefreshSignal((s) => s + 1)
  }, [refreshProfiles])

  const handleLeadSelect = useCallback((lead) => {
    setSelectedLead(lead)
    setActiveTab('Workspace')
  }, [])

  const handleStatusChanged = useCallback(() => {
    setLeadsRefreshSignal((s) => s + 1)
  }, [])

  const planLabel = titleCase(entitlements?.plan)

  return (
    <div className="h-full flex flex-col">
      <header className="ink-header flex items-center px-4 py-2 text-white shrink-0 gap-1">
        <span className="font-extrabold text-base tracking-tight">{'\uD83E\uDD91'} InkScout</span>
        <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-widest bg-cyan-200/20 text-cyan-100">
          {planLabel}
        </span>
        <span className="hidden md:block text-xs text-cyan-100/80 ml-3 truncate">{userEmail || ''}</span>
        <div className="flex-1" />
        <button
          onClick={() => setKeywordsPoolOpen(true)}
          className="text-cyan-100/80 hover:text-white text-sm px-3 py-1 rounded-lg hover:bg-white/10 transition-colors"
          title="Keyword Pool"
        >
          {'\uD83D\uDD11'}
        </button>
        <button
          onClick={() => setBlacklistOpen(true)}
          className="text-cyan-100/80 hover:text-white text-sm px-3 py-1 rounded-lg hover:bg-white/10 transition-colors"
          title="Blacklist"
        >
          {'\uD83D\uDEAB'}
        </button>
        <button
          onClick={() => setSynonymsOpen(true)}
          className="text-cyan-100/80 hover:text-white text-sm px-3 py-1 rounded-lg hover:bg-white/10 transition-colors"
          title="Synonyms"
        >
          {'\uD83D\uDD01'}
        </button>
        <button
          onClick={() => setSettingsOpen(true)}
          className="text-cyan-100/80 hover:text-white text-sm px-3 py-1 rounded-lg hover:bg-white/10 transition-colors"
          title="Settings"
        >
          {'\u2699\uFE0F'}
        </button>
        <button
          onClick={onOpenPricing}
          className="text-cyan-100/90 hover:text-white text-xs px-2 py-1 rounded-lg border border-cyan-200/30 hover:bg-cyan-100/10"
          title="Pricing"
        >
          Upgrade
        </button>
        <button
          onClick={onSignOut}
          className="text-cyan-100/80 hover:text-white text-xs px-2 py-1 rounded-lg border border-cyan-200/20 hover:bg-white/10"
          title="Sign out"
        >
          Sign out
        </button>
      </header>

      <div className="hidden lg:flex flex-1 gap-3 p-3 min-h-0">
        <div className="w-[15rem] shrink-0 flex flex-col min-h-0">
          <ProfilesPanel
            onProfilesChanged={handleProfilesChanged}
            onOpenKeywords={(profile) => setKeywordsModalProfile(profile)}
          />
        </div>

        <div className="flex-1 min-h-0 min-w-0">
          <LeadsPanel
            onSelect={handleLeadSelect}
            selectedLead={selectedLead}
            refreshSignal={leadsRefreshSignal}
          />
        </div>

        <div className="w-[22rem] shrink-0 min-h-0 overflow-y-auto">
          <WorkspacePanel
            lead={selectedLead}
            onStatusChanged={handleStatusChanged}
            profiles={profiles}
            entitlements={entitlements}
          />
        </div>
      </div>

      <div className="hidden lg:block shrink-0">
        <ConsoleDrawer open={consoleOpen} onToggle={() => setConsoleOpen((o) => !o)} />
      </div>

      <div className="flex lg:hidden flex-1 min-h-0 overflow-hidden">
        <div className={activeTab === 'Profiles' ? 'flex flex-col flex-1 p-3' : 'hidden'}>
          <ProfilesPanel
            onProfilesChanged={handleProfilesChanged}
            onOpenKeywords={(profile) => setKeywordsModalProfile(profile)}
          />
        </div>
        <div className={activeTab === 'Leads' ? 'flex flex-col flex-1 p-3' : 'hidden'}>
          <LeadsPanel
            onSelect={handleLeadSelect}
            selectedLead={selectedLead}
            refreshSignal={leadsRefreshSignal}
          />
        </div>
        <div className={activeTab === 'Workspace' ? 'flex flex-col flex-1 p-3 overflow-y-auto' : 'hidden'}>
          <WorkspacePanel
            lead={selectedLead}
            onStatusChanged={handleStatusChanged}
            onClose={() => setActiveTab('Leads')}
            profiles={profiles}
            entitlements={entitlements}
          />
        </div>
        <div className={activeTab === 'Console' ? 'flex flex-col flex-1 bg-console' : 'hidden'}>
          <ConsoleDrawer open={true} onToggle={() => setActiveTab('Leads')} />
        </div>
      </div>

      <nav className="ink-nav flex lg:hidden shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={[
              'flex-1 flex flex-col items-center py-2 text-xs font-semibold transition-colors',
              activeTab === tab ? 'text-cyan-700' : 'text-slate-600',
            ].join(' ')}
          >
            <span className="text-base mb-0.5">{TAB_ICONS[tab]}</span>
            {tab}
          </button>
        ))}
      </nav>

      {keywordsModalProfile && (
        <KeywordsModal
          profile={keywordsModalProfile}
          onClose={() => setKeywordsModalProfile(null)}
        />
      )}

      {keywordsPoolOpen && <KeywordsPoolModal onClose={() => setKeywordsPoolOpen(false)} />}
      {blacklistOpen && <BlacklistModal onClose={() => setBlacklistOpen(false)} />}
      {synonymsOpen && <SynonymsModal onClose={() => setSynonymsOpen(false)} />}
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} entitlements={entitlements} />}
    </div>
  )
}
