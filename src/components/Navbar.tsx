"use client";

import Link from "next/link";

interface NavbarProps {
  activePage?: 'home' | 'catalog' | 'trips' | 'packing' | 'clothing';
}

export default function Navbar({ activePage = 'home' }: NavbarProps) {
  return (
    <header className="bg-background shadow">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary hover:text-primary-hover transition-colors font-orbitron">
            PackIt
          </Link>
          <div className="flex space-x-4">
            <NavLink href="/" isActive={activePage === 'home'}>
              Home
            </NavLink>
            <NavLink href="/clothing" isActive={activePage === 'clothing'}>
              My Closet
            </NavLink>
            <NavLink href="/trips" isActive={activePage === 'trips'}>
              Trips
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
}

interface NavLinkProps {
  href: string;
  isActive?: boolean;
  children: React.ReactNode;
}

function NavLink({ href, isActive, children }: NavLinkProps) {
  return (
    <Link 
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium font-poppins ${
        isActive 
          ? 'bg-primary text-primary-foreground' 
          : 'text-foreground hover:bg-background-hover hover:text-foreground'
      }`}
    >
      {children}
    </Link>
  );
}
