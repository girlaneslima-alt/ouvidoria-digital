"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Barra GOV.BR */}
      <div className="h-2 w-full" style={{ background: "#1351B4" }} />

      <header className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ background: "#1351B4" }}
              >
                OD
              </div>
              <div className="hidden sm:block">
                <p className="font-semibold text-sm leading-tight" style={{ color: "#1351B4" }}>
                  Ouvidoria Digital
                </p>
                <p className="text-xs text-muted-foreground leading-tight">
                  Assistência Social — MDS
                </p>
              </div>
            </Link>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/consultar-protocolo"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Consultar Protocolo
              </Link>
              <Link
                href="/#como-funciona"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Como Funciona
              </Link>
              {session ? (
                <div className="flex items-center gap-3">
                  <Link href="/dashboard">
                    <Button size="sm" style={{ background: "#1351B4" }}>
                      Minha Área
                    </Button>
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-sm text-muted-foreground hover:text-destructive flex items-center gap-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="outline" size="sm">
                      Entrar
                    </Button>
                  </Link>
                  <Link href="/cadastro">
                    <Button size="sm" style={{ background: "#1351B4" }}>
                      Cadastrar-se
                    </Button>
                  </Link>
                </div>
              )}
            </nav>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-white px-4 py-4 space-y-3">
            <Link
              href="/consultar-protocolo"
              className="block text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Consultar Protocolo
            </Link>
            <Link
              href="/#como-funciona"
              className="block text-sm font-medium"
              onClick={() => setMenuOpen(false)}
            >
              Como Funciona
            </Link>
            {session ? (
              <>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)}>
                  <Button className="w-full" style={{ background: "#1351B4" }}>
                    Minha Área
                  </Button>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full text-sm text-destructive text-left flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Entrar
                  </Button>
                </Link>
                <Link href="/cadastro" onClick={() => setMenuOpen(false)}>
                  <Button className="w-full" style={{ background: "#1351B4" }}>
                    Cadastrar-se
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </header>
    </>
  );
}
