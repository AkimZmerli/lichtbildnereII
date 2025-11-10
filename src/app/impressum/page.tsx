import Footer from '@/shared/layout/Footer'
import Header from '@/shared/layout/Header'

export default function ImpressumPage() {
  return (
    <div className="min-h-screen flex flex-col bg-grainy">
      <Header />
      <main className="flex-1 pt-20 md:pt-24">
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-24">
          <h1 className="uppercase tracking-widest mb-24 md:mb-32 text-xl md:text-2xl text-center text-white-rose">
            I M P R E S S U M
          </h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-lg font-semibold mb-6 text-white-rose">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</h2>
              <p className="text-base leading-relaxed text-white-rose/90">
                Valentin Mici<br />
                Reinhardstraße 26<br />
                09130 Chemnitz<br />
                <br />
                mail@valentinmici.com
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}