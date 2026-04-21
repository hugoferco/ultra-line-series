'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const MOT_DE_PASSE = 'uls2026'

function generateToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export default function Admin() {
  const [authentifie, setAuthentifie] = useState(false)
  const [mdp, setMdp] = useState('')
  const [erreur, setErreur] = useState(false)
  const [onglet, setOnglet] = useState('candidatures')
  const [candidatures, setCandidatures] = useState([])
  const [inscriptions, setInscriptions] = useState([])
  const [loading, setLoading] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    if (mdp === MOT_DE_PASSE) { setAuthentifie(true); setErreur(false) }
    else setErreur(true)
  }

  useEffect(() => {
    if (authentifie) { fetchCandidatures(); fetchInscriptions() }
  }, [authentifie])

  const fetchCandidatures = async () => {
    setLoading(true)
    const { data } = await supabase.from('candidatures').select('*').order('created_at', { ascending: false })
    if (data) setCandidatures(data)
    setLoading(false)
  }

  const fetchInscriptions = async () => {
    const { data } = await supabase.from('inscriptions').select('*').order('created_at', { ascending: false })
    if (data) setInscriptions(data)
  }

  const handleSelectionner = async (id) => {
    const token = generateToken()
    await supabase.from('candidatures').update({ selectionne: true, token }).eq('id', id)
    fetchCandidatures()
  }

  const handleDeselectionner = async (id) => {
    await supabase.from('candidatures').update({ selectionne: false, token: null }).eq('id', id)
    fetchCandidatures()
  }

  const handleSupprimerCandidature = async (id) => {
    if (!confirm('Supprimer cette candidature ?')) return
    await supabase.from('candidatures').delete().eq('id', id)
    fetchCandidatures()
  }

  const handleSupprimerInscription = async (id) => {
    if (!confirm('Supprimer cette inscription ?')) return
    await supabase.from('inscriptions').delete().eq('id', id)
    fetchInscriptions()
  }

  const exportCSVCandidatures = () => {
    const headers = ['Prenom', 'Nom', 'Telephone', 'Adresse', 'Motivation', 'Selectionne', 'Date']
    const rows = candidatures.map(c => [
      c.prenom, c.nom, c.telephone, c.adresse,
      `"${c.motivation?.replace(/"/g, '""')}"`,
      c.selectionne ? 'Oui' : 'Non',
      new Date(c.created_at).toLocaleDateString('fr-FR')
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'candidatures_uls.csv'; a.click()
  }

  const exportCSVInscriptions = () => {
    const headers = ['Prenom Binome', 'Nom Binome', 'Email Binome', 'Tel Binome', 'Paye', 'Date']
    const rows = inscriptions.map(i => [
      i.prenom_binome, i.nom_binome, i.email_binome, i.telephone_binome,
      i.paye ? 'Oui' : 'Non',
      new Date(i.created_at).toLocaleDateString('fr-FR')
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'inscriptions_uls.csv'; a.click()
  }

  const lienNFC = (token) => `https://ultra-line-series.vercel.app/access/${token}`

  const stats = {
    total: candidatures.length,
    selectionnes: candidatures.filter(c => c.selectionne).length,
    inscrits: inscriptions.length,
    payes: inscriptions.filter(i => i.paye).length,
    ca: inscriptions.filter(i => i.paye).length * 890
  }

  if (!authentifie) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-8">
        <div className="bg-white p-10 rounded-lg shadow-sm w-full max-w-xs">
          <p className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-2">Zone privee</p>
          <h1 className="text-2xl font-black uppercase text-gray-900 mb-8">ULS Admin</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password"
              value={mdp}
              onChange={(e) => setMdp(e.target.value)}
              className="border border-gray-200 text-gray-900 text-sm px-4 py-3 rounded focus:outline-none focus:border-gray-400 transition-all"
              placeholder="Mot de passe"
            />
            {erreur && <p className="text-red-500 text-xs text-center">Mot de passe incorrect</p>}
            <button type="submit" className="bg-black text-white text-xs tracking-[0.3em] uppercase px-6 py-3 rounded hover:bg-gray-800 transition-all">
              Entrer
            </button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      
      {/* Topbar */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-black uppercase tracking-tight">ULS Admin</h1>
          <span className="text-xs text-gray-400 tracking-widest uppercase">Edition 00</span>
        </div>
        <span className="text-xs text-gray-400">Septembre 2026 — Pyrenees</span>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-10">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {[
            { label: 'Candidatures', value: stats.total, color: 'text-gray-900' },
            { label: 'Selectionnes', value: stats.selectionnes, color: 'text-blue-600' },
            { label: 'Inscrits', value: stats.inscrits, color: 'text-orange-500' },
            { label: 'Payes', value: stats.payes, color: 'text-green-600' },
            { label: 'CA Total', value: `${stats.ca} EUR`, color: 'text-green-600' },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-lg p-5">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Onglets */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1 w-fit mb-8">
          {['candidatures', 'inscrits', 'paiements'].map((o) => (
            <button
              key={o}
              onClick={() => setOnglet(o)}
              className={`text-xs tracking-[0.2em] uppercase px-5 py-2 rounded transition-all ${onglet === o ? 'bg-black text-white' : 'text-gray-400 hover:text-gray-700'}`}
            >
              {o}
            </button>
          ))}
        </div>

        {/* Onglet Candidatures */}
        {onglet === 'candidatures' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500">{candidatures.length} candidatures reçues</p>
              <button onClick={exportCSVCandidatures} className="text-xs bg-white border border-gray-200 text-gray-600 uppercase tracking-widest px-4 py-2 rounded hover:bg-gray-50 transition-all">
                Exporter CSV
              </button>
            </div>

            {candidatures.filter(c => c.selectionne).length > 0 && (
              <div className="mb-6">
                <p className="text-xs text-blue-600 uppercase tracking-widest mb-3 font-bold">Selectionnes</p>
                <div className="flex flex-col gap-3">
                  {candidatures.filter(c => c.selectionne).map((c) => (
                    <div key={c.id} className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h2 className="font-black uppercase text-gray-900">{c.prenom} {c.nom}</h2>
                          <p className="text-gray-500 text-xs mt-1">{c.telephone} — {c.adresse}</p>
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => handleDeselectionner(c.id)} className="text-xs text-orange-500 hover:text-orange-700 uppercase tracking-widest transition-all">
                            Retirer
                          </button>
                          <button onClick={() => handleSupprimerCandidature(c.id)} className="text-xs text-red-500 hover:text-red-700 uppercase tracking-widest transition-all">
                            Supprimer
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed mb-3">{c.motivation}</p>
                      {c.token && (
                        <div className="bg-blue-100 rounded p-3">
                          <p className="text-xs text-blue-600 uppercase tracking-widest mb-1">Lien NFC</p>
                          <p className="text-blue-800 text-xs font-mono break-all">{lienNFC(c.token)}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-bold">En attente</p>
              {loading ? (
                <p className="text-gray-400 text-sm text-center py-20">Chargement...</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {candidatures.filter(c => !c.selectionne).map((c) => (
                    <div key={c.id} className="bg-white border border-gray-200 rounded-lg p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h2 className="font-black uppercase text-gray-900">{c.prenom} {c.nom}</h2>
                          <p className="text-gray-500 text-xs mt-1">{c.telephone} — {c.adresse}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-300">{new Date(c.created_at).toLocaleDateString('fr-FR')}</span>
                          <button onClick={() => handleSelectionner(c.id)} className="text-xs bg-black text-white uppercase tracking-widest px-4 py-2 rounded hover:bg-gray-800 transition-all">
                            Selectionner
                          </button>
                          <button onClick={() => handleSupprimerCandidature(c.id)} className="text-xs text-red-500 hover:text-red-700 uppercase tracking-widest transition-all">
                            Supprimer
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{c.motivation}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Onglet Inscrits */}
        {onglet === 'inscrits' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500">{inscriptions.length} inscrits</p>
              <button onClick={exportCSVInscriptions} className="text-xs bg-white border border-gray-200 text-gray-600 uppercase tracking-widest px-4 py-2 rounded hover:bg-gray-50 transition-all">
                Exporter CSV
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {inscriptions.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-20">Aucune inscription</p>
              ) : inscriptions.map((i) => (
                <div key={i.id} className={`rounded-lg border p-5 flex justify-between items-start ${i.paye ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="font-black uppercase text-gray-900">{i.prenom_binome} {i.nom_binome}</h2>
                      <span className={`text-[10px] tracking-widest uppercase px-2 py-1 rounded font-bold ${i.paye ? 'bg-green-200 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {i.paye ? 'Paye' : 'En attente'}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs">{i.email_binome} — {i.telephone_binome}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-300">{new Date(i.created_at).toLocaleDateString('fr-FR')}</span>
                    <button onClick={() => handleSupprimerInscription(i.id)} className="text-xs text-red-500 hover:text-red-700 uppercase tracking-widest transition-all">
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Onglet Paiements */}
        {onglet === 'paiements' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500">{inscriptions.filter(i => i.paye).length} paiements confirmes</p>
              <p className="text-lg font-black text-green-600">{stats.ca} EUR</p>
            </div>
            <div className="flex flex-col gap-3">
              {inscriptions.filter(i => i.paye).length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-20">Aucun paiement</p>
              ) : inscriptions.filter(i => i.paye).map((i) => (
                <div key={i.id} className="bg-white border border-gray-200 rounded-lg p-5 flex justify-between items-center">
                  <div>
                    <h2 className="font-black uppercase text-gray-900 mb-1">{i.prenom_binome} {i.nom_binome}</h2>
                    <p className="text-gray-500 text-xs">{i.email_binome}</p>
                    <p className="text-gray-300 text-xs font-mono mt-1">{i.stripe_session_id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-green-600">890 EUR</p>
                    <p className="text-gray-400 text-xs">{new Date(i.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              ))}
            </div>

            {inscriptions.filter(i => i.paye).length > 0 && (
              <div className="border-t border-gray-200 mt-8 pt-8 flex justify-between items-center">
                <p className="text-sm text-gray-500 uppercase tracking-widest">Total encaisse</p>
                <p className="text-3xl font-black text-green-600">{stats.ca} EUR</p>
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  )
}