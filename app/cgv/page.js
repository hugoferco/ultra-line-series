import Footer from '../components/Footer'
import Header from '../components/Header'

export default function CGV() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <div className="flex-1 max-w-2xl mx-auto px-8 py-16">
        <p className="text-xs tracking-[0.4em] text-white/40 uppercase mb-4">Ultra Line Series</p>
        <h1 className="text-3xl font-black uppercase mb-12">Conditions Generales de Vente</h1>
        
        <div className="flex flex-col gap-8 text-white/60 text-sm leading-relaxed">
          <div>
            <h2 className="text-white text-xs tracking-[0.3em] uppercase mb-4">Article 1 — Objet</h2>
            <p>Les presentes conditions generales de vente regissent les relations contractuelles entre Ultra Line Series et ses participants dans le cadre de l'inscription a l'evenement sportif Ultra Line Series Edition 00, se deroulant du 18 au 20 septembre 2026 dans les Pyrenees.</p>
          </div>
          <div>
            <h2 className="text-white text-xs tracking-[0.3em] uppercase mb-4">Article 2 — Inscription</h2>
            <p>L'inscription est nominative et non transferable. Elle est finalisee apres paiement complet du montant de 890 euros par binome. Toute inscription est ferme et definitive.</p>
          </div>
          <div>
            <h2 className="text-white text-xs tracking-[0.3em] uppercase mb-4">Article 3 — Paiement</h2>
            <p>Le paiement s'effectue en ligne par carte bancaire via la plateforme securisee Stripe. Le montant de l'inscription est de 890 euros par binome, toutes taxes comprises.</p>
          </div>
          <div>
            <h2 className="text-white text-xs tracking-[0.3em] uppercase mb-4">Article 4 — Annulation</h2>
            <p>Toute annulation doit etre notifiee par email a l'organisateur. Aucun remboursement ne sera effectue moins de 30 jours avant l'evenement. Au-dela de ce delai, un remboursement partiel pourra etre envisage selon les circonstances.</p>
          </div>
          <div>
            <h2 className="text-white text-xs tracking-[0.3em] uppercase mb-4">Article 5 — Responsabilite</h2>
            <p>La participation a l'evenement implique une pratique sportive intensive en milieu naturel. Chaque participant s'engage a etre en bonne condition physique et a disposer des assurances necessaires. L'organisateur ne saurait etre tenu responsable des accidents survenus en dehors de sa responsabilite directe.</p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}