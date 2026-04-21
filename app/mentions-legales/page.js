import Footer from '../components/Footer'
import Header from '../components/Header'

export default function MentionsLegales() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      <div className="flex-1 max-w-2xl mx-auto px-8 py-16">
        <p className="text-xs tracking-[0.4em] text-white/40 uppercase mb-4">Ultra Line Series</p>
        <h1 className="text-3xl font-black uppercase mb-12">Mentions Legales</h1>
        
        <div className="flex flex-col gap-8 text-white/60 text-sm leading-relaxed">
          <div>
            <h2 className="text-white text-xs tracking-[0.3em] uppercase mb-4">Editeur du site</h2>
            <p>Ultra Line Series<br />
            Site web : www.ultralineseries.com<br />
            Email : contact@ultralineseries.com</p>
          </div>
          <div>
            <h2 className="text-white text-xs tracking-[0.3em] uppercase mb-4">Hebergement</h2>
            <p>Le site est heberge par Vercel Inc.<br />
            340 Pine Street, Suite 701<br />
            San Francisco, CA 94104, USA</p>
          </div>
          <div>
            <h2 className="text-white text-xs tracking-[0.3em] uppercase mb-4">Donnees personnelles</h2>
            <p>Les donnees collectees dans le cadre des candidatures et inscriptions sont utilisees uniquement dans le cadre de l'organisation de l'evenement Ultra Line Series. Elles ne sont pas transmises a des tiers. Conformement au RGPD, vous disposez d'un droit d'acces, de rectification et de suppression de vos donnees en contactant contact@ultralineseries.com.</p>
          </div>
          <div>
            <h2 className="text-white text-xs tracking-[0.3em] uppercase mb-4">Propriete intellectuelle</h2>
            <p>L'ensemble des contenus du site (textes, images, logos) sont la propriete exclusive d'Ultra Line Series et sont proteges par le droit d'auteur. Toute reproduction est interdite sans autorisation prealable.</p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}