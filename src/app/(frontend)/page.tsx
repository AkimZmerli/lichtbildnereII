import Header from './components/layout/Header'
import Hero from './components/sections/Hero'

export default function Home() {
  return (
    <div className="bg-grainy min-h-screen">
      <div>
        <main>
          <Header />
          <Hero />
        </main>
      </div>
    </div>
  )
}
