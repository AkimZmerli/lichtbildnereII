import Footer from '@/features/shared/components/Footer'
import Header from '@/features/shared/components/Header'

export default function ImpressumPage() {
  return (
    <div className="min-h-screen flex flex-col bg-grainy">
      <Header />
      <main className="flex-1 pt-20 md:pt-24">
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-24">
          <h1 className="uppercase tracking-widest mb-12 text-xl md:text-2xl text-center text-white-rose">
            I M P R E S S U M
          </h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-lg font-semibold mb-3 text-white-rose">Angaben gemäß § 5 TMG</h2>
              <p className="text-base leading-relaxed text-white-rose/90">
                Lorem Ipsum GmbH<br />
                Vertreten durch: Max Mustermann<br />
                Musterstraße 123<br />
                12345 Musterstadt
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3 text-white-rose">Kontakt:</h2>
              <p className="text-base leading-relaxed text-white-rose/90">
                Telefon: +49 (0) 123 456789<br />
                Telefax: +49 (0) 123 456788<br />
                E-Mail: info@lorem-ipsum.de
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3 text-white-rose">Registereintrag:</h2>
              <p className="text-base leading-relaxed text-white-rose/90">
                Eintragung im Handelsregister.<br />
                Registergericht: Amtsgericht Musterstadt<br />
                Registernummer: HRB 12345
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3 text-white-rose">Umsatzsteuer-ID:</h2>
              <p className="text-base leading-relaxed text-white-rose/90">
                Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
                DE123456789
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3 text-white-rose">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</h2>
              <p className="text-base leading-relaxed text-white-rose/90">
                Max Mustermann<br />
                Musterstraße 123<br />
                12345 Musterstadt
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3 text-white-rose">Haftungsausschluss:</h2>
              <p className="text-base leading-relaxed text-white-rose/90">
                Contenta huius paginae creata est cum maxima cura. Tamen nulla garantia pro correctitudine, completezza vel aktualitate praebetur. Für externe Links übernehmen wir keine Haftung; pro contento verlinkter Seiten responsabile est stets der jeweilige Anbieter.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-3 text-white-rose">Urheberrecht:</h2>
              <p className="text-base leading-relaxed text-white-rose/90">
                Texte, Bilder et graphica in hoc loco subiciuntur deutschen Urheberrecht. Reproduktion, Bearbeitung oder Verbreitung nur mit ausdrücklicher Zustimmung des Autors.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}