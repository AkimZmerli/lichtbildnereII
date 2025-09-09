import Footer from '@/features/shared/components/Footer'
import Header from '@/features/shared/components/Header'

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen flex flex-col bg-grainy">
      <Header />
      <main className="flex-1 pt-20 md:pt-24">
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-24">
          <h1 className="uppercase tracking-widest mb-12 text-xl md:text-2xl text-center text-white-rose">
            D A T E N S C H U T Z
          </h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-lg font-semibold mb-3 text-white-rose">1. Punkt</h2>
              <p className="text-base leading-relaxed mb-3 text-white-rose/90">
                Datenschutz hat einen hohen Stellenwert für unsere Organisation. Die Verarbeitung personenbezogener Daten erfolgt stets im Einklang mit den geltenden gesetzlichen Bestimmungen sowie in Übereinstimmung mit den Grundsätzen der Zweckbindung, Transparenz und Datenminimierung.
              </p>
              <p className="text-base leading-relaxed text-white-rose/90">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Personalis Datae collecta sunt ad legitimum finem, in particulari ad optimizationem servitiorum atque ad usum statistisch anonymisatum. Quisquis in Nutzung einwilligt, erklärt sich einverstanden, dass Metadata (IP-Adresse, Browsertyp, Zugriffszeitpunkt) temporär gespeichert werden.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3 text-white-rose">2. Punkt</h2>
              <p className="text-base leading-relaxed mb-3 text-white-rose/90">
                Praesent commodo suscipit magna, sed facilisis risus auctor nec. Transmissiones an Dritte erfolgen ausschließlich im Rahmen der gesetzlichen Verpflichtung oder auf Basis eines Auftragsverarbeitungsvertrages (Art. 28 DSGVO). Curabitur dignissim tellus vel dui luctus, non tincidunt sapien faucibus.
              </p>
              <p className="text-base leading-relaxed text-white-rose/90">
                Ad securitatem technicam et organisatoriam, omnibus mensuris stand der Technik entsprechen. Suspendisse potenti. Data subject rights (Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch, Portabilität) können jederzeit schriftlich geltend gemacht werden.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3 text-white-rose">3. Punkt</h2>
              <p className="text-base leading-relaxed text-white-rose/90">
                Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Informationes non conservantur diutius quam ad Zweckerfüllung notwendig. Quodsi retention period abläuft, data automatisch gelöscht oder anonymisiert.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}