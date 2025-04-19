import Image from 'next/image'
import Link from 'next/link'

function Header() {
  return (
    <header className="w-full px-5 py-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="font-logo text-white rose text-bold text-4xl">
          VALENTIN MICI
        </Link>
        <Image src="/images/BurgerPlaceholder.png" width={60} height={60} alt="burgermenu" />
      </div>
    </header>
  )
}

export default Header
