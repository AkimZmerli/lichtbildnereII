import Footer from '@/shared/layout/Footer'
import Header from '@/shared/layout/Header'

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
              <h2 className="text-lg font-semibold mb-3 text-white-rose">1. Verantwortliche Stelle</h2>
              <p className="text-base leading-relaxed mb-3 text-white-rose/90">
                Verantwortlich für die Datenverarbeitung auf dieser Website ist Valentin Mici. Diese Website dient ausschließlich der Präsentation fotografischer Arbeiten.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3 text-white-rose">2. Erhebung und Verarbeitung von Daten</h2>
              <p className="text-base leading-relaxed mb-3 text-white-rose/90">
                Diese Portfolio-Website erhebt, verarbeitet und speichert keine personenbezogenen Daten der Besucher. Es werden keine Cookies gesetzt, keine Tracking-Tools verwendet und keine Daten an Dritte weitergegeben.
              </p>
              <p className="text-base leading-relaxed text-white-rose/90">
                Beim Besuch der Website werden automatisch technische Informationen (wie IP-Adresse, Browser-Typ, Zugriffszeit) temporär in den Server-Logfiles gespeichert. Diese Daten werden ausschließlich zur technischen Bereitstellung der Website verwendet und nach kurzer Zeit automatisch gelöscht.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3 text-white-rose">3. Kontakt und Rechte</h2>
              <p className="text-base leading-relaxed mb-3 text-white-rose/90">
                Da keine personenbezogenen Daten erhoben werden, bestehen auch keine entsprechenden Betroffenenrechte bezüglich gespeicherter Daten.
              </p>
              <p className="text-base leading-relaxed text-white-rose/90">
                Bei Fragen zum Datenschutz können Sie sich über die im Impressum angegebenen Kontaktdaten an uns wenden.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3 text-white-rose">4. Externe Links</h2>
              <p className="text-base leading-relaxed text-white-rose/90">
                Diese Website kann Links zu externen Websites enthalten. Für deren Inhalte und Datenschutzpraktiken übernehmen wir keine Verantwortung.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}