
import Image from 'next/image'
import { Github, Twitter, Linkedin } from 'lucide-react'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="Zeleste Logo" width={32} height={32} className="h-8 w-8" />
              <span className="font-bold text-lg text-primary font-headline tracking-wider">ZELESTE</span>
            </Link>
            <p className="text-sm">
              Providing top-tier engineering and contracting solutions since 2023.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-primary font-headline">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services" className="hover:text-primary transition-colors">Services</Link></li>
              <li><Link href="/#about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/#news" className="hover:text-primary transition-colors">News</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-primary font-headline">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>contact@zeleste.co</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Engineering Lane, Tech City, 12345</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-primary font-headline">Follow Us</h3>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Twitter">
                <Twitter className="h-6 w-6 hover:text-primary transition-colors" />
              </Link>
              <Link href="#" aria-label="LinkedIn">
                <Linkedin className="h-6 w-6 hover:text-primary transition-colors" />
              </Link>
              <Link href="#" aria-label="GitHub">
                <Github className="h-6 w-6 hover:text-primary transition-colors" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-muted text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ZELESTE ENGINEERS AND CONTRACTORS LLP. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
