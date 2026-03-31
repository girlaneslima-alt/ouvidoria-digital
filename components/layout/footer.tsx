import Link from "next/link";

export function Footer() {
  return (
    <footer style={{ background: "#071D41" }} className="text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e descrição */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm border border-white/20"
              >
                OD
              </div>
              <div>
                <p className="font-semibold text-sm">Ouvidoria Digital</p>
                <p className="text-xs text-white/60">Assistência Social — MDS</p>
              </div>
            </div>
            <p className="text-sm text-white/70 max-w-xs leading-relaxed">
              Portal oficial de manifestações da Ouvidoria da Assistência Social do Ministério do Desenvolvimento e Assistência Social, Família e Combate à Fome.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-white/90">Serviços</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/login" className="hover:text-white transition-colors">Fazer Manifestação</Link></li>
              <li><Link href="/consultar-protocolo" className="hover:text-white transition-colors">Consultar Protocolo</Link></li>
              <li><Link href="/cadastro" className="hover:text-white transition-colors">Cadastrar-se</Link></li>
              <li><Link href="/#como-funciona" className="hover:text-white transition-colors">Como Funciona</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3 text-white/90">Institucional</h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/sobre" className="hover:text-white transition-colors">Sobre a Ouvidoria</Link></li>
              <li><Link href="/perguntas-frequentes" className="hover:text-white transition-colors">Perguntas Frequentes</Link></li>
              <li>
                <a href="https://falabr.cgu.gov.br" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  Fala.BR
                </a>
              </li>
              <li>
                <a href="https://www.gov.br/mds" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  Portal MDS
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} Governo Federal — Ministério do Desenvolvimento e Assistência Social
          </p>
          <p className="text-xs text-white/50">
            Dados protegidos conforme a{" "}
            <a href="https://www.gov.br/lgpd" className="underline hover:text-white/80">
              LGPD
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
