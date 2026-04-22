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
  const [copied, setCopied] = useState(null)
  const [deleteErreur, setDeleteErreur] = useState('')

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
    await supabase.from('candidatures').update({ selectionne: true, refuse: false, token }).eq('id', id)
    fetchCandidatures()
  }

  const handleDeselectionner = async (id) => {
    await supabase.from('candidatures').update({ selectionne: false, token: null }).eq('id', id)
    fetchCandidatures()
  }

  const handleRefuser = async (id) => {
    if (!confirm('Refuser cette candidature ?')) return
    await supabase.from('candidatures').update({ refuse: true, selectionne: false, token: null }).eq('id', id)
    fetchCandidatures()
  }

  const handleDeRefuser = async (id) => {
    await supabase.from('candidatures').update({ refuse: false }).eq('id', id)
    fetchCandidatures()
  }

  const handleSupprimerCandidature = async (id) => {
    if (!confirm('Supprimer cette candidature ?')) return
    await supabase.from('candidatures').delete().eq('id', id)
    fetchCandidatures()
  }

  const handleSupprimerInscription = async (id) => {
    if (!confirm('Supprimer cette inscription ?')) return
    setDeleteErreur('')

    const res = await fetch('/api/admin/delete-inscription', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    const data = await res.json()

    if (!res.ok || data.error) {
      setDeleteErreur(`Erreur suppression : ${data.error}`)
      return
    }

    fetchInscriptions()
  }

  const handleCopyLink = async (token) => {
    const url = lienAcces(token)
    await navigator.clipboard.writeText(url)
    setCopied(token)
    setTimeout(() => setCopied(null), 2000)
  }

  const exportCSVCandidatures = () => {
    const headers = ['Prenom', 'Nom', 'Email', 'Telephone', 'Adresse', 'Prenom Binome', 'Nom Binome', 'Email Binome', 'Tel Binome', 'Adresse Binome', 'Motivation', 'Statut', 'Date']
    const rows = candidatures.map(c => [
      c.prenom, c.nom, c.email || '', c.telephone, c.adresse,
      c.prenom_binome || '', c.nom_binome || '', c.email_binome || '', c.telephone_binome || '', c.adresse_binome || '',
      `"${c.motivation?.replace(/"/g, '""')}"`,
      c.selectionne ? 'Sélectionné' : c.refuse ? 'Refusé' : 'En attente',
      new Date(c.created_at).toLocaleDateString('fr-FR')
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'candidatures_uls.csv'; a.click()
  }

  const exportCSVInscriptions = () => {
    const headers = ['Prenom Binome', 'Nom Binome', 'Email Binome', 'Tel Binome', 'Code PPS Participant', 'Code PPS Binome', 'Paye', 'Date']
    const rows = inscriptions.map(i => [
      i.prenom_binome, i.nom_binome, i.email_binome, i.telephone_binome,
      i.code_pps || '', i.code_pps_binome || '',
      i.paye ? 'Oui' : 'Non',
      new Date(i.created_at).toLocaleDateString('fr-FR')
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'inscriptions_uls.csv'; a.click()
  }

  const lienAcces = (token) => `https://ultra-line-series.vercel.app/access/${token}`

  const stats = {
    total: candidatures.length,
    selectionnes: candidatures.filter(c => c.selectionne).length,
    refuses: candidatures.filter(c => c.refuse).length,
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
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-10">
          {[
            { label: 'Candidatures', value: stats.total, color: 'text-gray-900' },
            { label: 'Sélectionnés', value: stats.selectionnes, color: 'text-blue-600' },
            { label: 'Refusés', value: stats.refuses, color: 'text-red-500' },
            { label: 'Inscrits', value: stats.inscrits, color: 'text-orange-500' },
            { label: 'Payés', value: stats.payes, color: 'text-green-600' },
            { label: 'CA Total', value: `${stats.ca} €`, color: 'text-green-600' },
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

            {/* Sélectionnés */}
            {candidatures.filter(c => c.selectionne).length > 0 && (
              <div className="mb-6">
                <p className="text-xs text-blue-600 uppercase tracking-widest mb-3 font-bold">Sélectionnés — {candidatures.filter(c => c.selectionne).length}</p>
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

                      {/* Emails à contacter */}
                      <div className="bg-blue-100 rounded p-3 mb-3">
                        <p className="text-[10px] text-blue-500 uppercase tracking-widest mb-2 font-bold">Emails d'invitation à envoyer</p>
                        <div className="flex flex-col gap-1">
                          <p className="text-blue-800 text-xs">
                            <span className="text-blue-500 uppercase tracking-wider text-[10px]">P1 :</span>{' '}
                            <a href={`mailto:${c.email}`} className="font-mono hover:underline">{c.email || '—'}</a>
                          </p>
                          <p className="text-blue-800 text-xs">
                            <span className="text-blue-500 uppercase tracking-wider text-[10px]">P2 :</span>{' '}
                            <a href={`mailto:${c.email_binome}`} className="font-mono hover:underline">{c.email_binome || '—'}</a>
                          </p>
                        </div>
                      </div>

                      {(c.prenom_binome || c.nom_binome) && (
                        <div className="bg-blue-100/60 rounded p-3 mb-3">
                          <p className="text-[10px] text-blue-500 uppercase tracking-widest mb-1">Binôme</p>
                          <p className="text-blue-800 text-xs font-bold uppercase">{c.prenom_binome} {c.nom_binome}</p>
                          <p className="text-blue-600 text-xs mt-0.5">{c.telephone_binome} — {c.adresse_binome || '—'}</p>
                        </div>
                      )}

                      <p className="text-gray-600 text-sm leading-relaxed mb-3">{c.motivation}</p>

                      {c.token && (
                        <div className="bg-blue-100 rounded p-3">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-xs text-blue-600 uppercase tracking-widest">Lien d'invitation</p>
                            <button
                              onClick={() => handleCopyLink(c.token)}
                              className="text-[10px] uppercase tracking-widest px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition-all"
                            >
                              {copied === c.token ? 'Copié ✓' : 'Copier'}
                            </button>
                          </div>
                          <p className="text-blue-800 text-xs font-mono break-all">{lienAcces(c.token)}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* En attente */}
            {candidatures.filter(c => !c.selectionne && !c.refuse).length > 0 && (
              <div className="mb-6">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-bold">En attente — {candidatures.filter(c => !c.selectionne && !c.refuse).length}</p>
                {loading ? (
                  <p className="text-gray-400 text-sm text-center py-20">Chargement...</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {candidatures.filter(c => !c.selectionne && !c.refuse).map((c) => (
                      <div key={c.id} className="bg-white border border-gray-200 rounded-lg p-5">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h2 className="font-black uppercase text-gray-900">{c.prenom} {c.nom}</h2>
                            <p className="text-gray-500 text-xs mt-1">
                              {c.email && <><a href={`mailto:${c.email}`} className="hover:underline">{c.email}</a> — </>}
                              {c.telephone} — {c.adresse}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-300">{new Date(c.created_at).toLocaleDateString('fr-FR')}</span>
                            <button onClick={() => handleSelectionner(c.id)} className="text-xs bg-black text-white uppercase tracking-widest px-4 py-2 rounded hover:bg-gray-800 transition-all">
                              Sélectionner
                            </button>
                            <button onClick={() => handleRefuser(c.id)} className="text-xs bg-red-50 text-red-500 border border-red-200 uppercase tracking-widest px-3 py-2 rounded hover:bg-red-100 transition-all">
                              Refuser
                            </button>
                            <button onClick={() => handleSupprimerCandidature(c.id)} className="text-xs text-gray-400 hover:text-red-500 uppercase tracking-widest transition-all">
                              ✕
                            </button>
                          </div>
                        </div>
                        {(c.prenom_binome || c.nom_binome) && (
                          <div className="bg-gray-50 rounded p-3 mb-3">
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Binôme</p>
                            <p className="text-gray-700 text-xs font-bold uppercase">{c.prenom_binome} {c.nom_binome}</p>
                            <p className="text-gray-500 text-xs mt-0.5">{c.email_binome} — {c.telephone_binome}</p>
                            {c.adresse_binome && <p className="text-gray-400 text-xs mt-0.5">{c.adresse_binome}</p>}
                          </div>
                        )}
                        <p className="text-gray-600 text-sm leading-relaxed">{c.motivation}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Refusés */}
            {candidatures.filter(c => c.refuse).length > 0 && (
              <div>
                <p className="text-xs text-red-400 uppercase tracking-widest mb-3 font-bold">Refusés — {candidatures.filter(c => c.refuse).length}</p>
                <div className="flex flex-col gap-2">
                  {candidatures.filter(c => c.refuse).map((c) => (
                    <div key={c.id} className="bg-red-50 border border-red-100 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h2 className="font-bold uppercase text-gray-500 text-sm">{c.prenom} {c.nom}</h2>
                          <p className="text-gray-400 text-xs mt-0.5">{c.email || c.telephone} — {new Date(c.created_at).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <div className="flex gap-3">
                          <button onClick={() => handleDeRefuser(c.id)} className="text-xs text-gray-500 hover:text-gray-700 uppercase tracking-widest transition-all">
                            Remettre en attente
                          </button>
                          <button onClick={() => handleSupprimerCandidature(c.id)} className="text-xs text-red-400 hover:text-red-600 uppercase tracking-widest transition-all">
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
            {deleteErreur && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded p-3 text-red-600 text-xs">
                {deleteErreur}
              </div>
            )}
            <div className="flex flex-col gap-3">
              {inscriptions.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-20">Aucune inscription</p>
              ) : inscriptions.map((i) => (
                <div key={i.id} className={`rounded-lg border p-5 ${i.paye ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="font-black uppercase text-gray-900">{i.prenom_binome} {i.nom_binome}</h2>
                        <span className={`text-[10px] tracking-widest uppercase px-2 py-1 rounded font-bold ${i.paye ? 'bg-green-200 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {i.paye ? 'Payé' : 'En attente'}
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
                  <div className="mt-3 bg-purple-50 border border-purple-100 rounded p-3">
                    <p className="text-[10px] text-purple-400 uppercase tracking-widest mb-2">Codes PPS</p>
                    <div className="flex flex-wrap gap-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-purple-300 uppercase tracking-widest">Participant</span>
                        <span className="text-xs text-gray-700 font-mono">{i.code_pps || <span className="text-gray-300 italic">non renseigné</span>}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-purple-300 uppercase tracking-widest">Binôme</span>
                        <span className="text-xs text-gray-700 font-mono">{i.code_pps_binome || <span className="text-gray-300 italic">non renseigné</span>}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
              })}
            </div>
          </div>
        )}

        {/* Onglet Paiements */}
        {onglet === 'paiements' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500">{inscriptions.filter(i => i.paye).length} paiements confirmés</p>
              <p className="text-lg font-black text-green-600">{stats.ca} €</p>
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
                    <p className="text-xl font-black text-green-600">890 €</p>
                    <p className="text-gray-400 text-xs">{new Date(i.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              ))}
            </div>

            {inscriptions.filter(i => i.paye).length > 0 && (
              <div className="border-t border-gray-200 mt-8 pt-8 flex justify-between items-center">
                <p className="text-sm text-gray-500 uppercase tracking-widest">Total encaissé</p>
                <p className="text-3xl font-black text-green-600">{stats.ca} €</p>
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  )
}
