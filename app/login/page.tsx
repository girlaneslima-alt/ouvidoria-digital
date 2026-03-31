"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, AlertCircle, ChevronRight, ArrowLeft, UserX, ShieldOff, Info } from "lucide-react";

/* ─── Sub-componente que usa useSearchParams (exige Suspense) ─── */
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const [email, setEmail]               = useState("");
  const [senha, setSenha]               = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [erro, setErro]                 = useState("");

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro("");
    const res = await signIn("credentials", { email, password: senha, redirect: false });
    setLoading(false);
    if (res?.error) {
      setErro("E-mail ou senha incorretos. Verifique seus dados.");
    } else {
      router.push(callbackUrl);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    await signIn("google", { callbackUrl });
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8F8]">

      {/* ── Barra superior GOV.BR ── */}
      <div className="h-1.5 w-full bg-[#1351B4]" />

      {/* ── Header ── */}
      <header className="bg-white border-b border-[#E8EAF0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#1351B4]">
              <span className="text-white font-bold text-xs">OD</span>
            </div>
            <span className="font-semibold text-sm text-[#1351B4]">Ouvidoria Digital</span>
          </Link>

          {/* Breadcrumb */}
          <nav className="hidden sm:flex items-center gap-1.5 text-xs text-[#6B6B6B]">
            <Link href="/" className="hover:text-[#1351B4] transition-colors">Início</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/sobre" className="hover:text-[#1351B4] transition-colors">Sobre a Ouvidoria</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/perguntas-frequentes" className="hover:text-[#1351B4] transition-colors">Perguntas Frequentes</Link>
          </nav>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 px-4 sm:px-6 pt-10 pb-16">
        <div className="max-w-5xl mx-auto">

          {/* Voltar */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-[#1351B4] hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>

          {/* Heading da página */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1351B4] mb-2">
              Identifique-se
            </h1>
            <p className="text-sm text-[#6B6B6B] max-w-xl leading-relaxed">
              Para registrar e acompanhar sua manifestação, faça login com e-mail e senha ou
              com sua conta <strong>gov.br</strong>. Seus dados são protegidos conforme a{" "}
              <a
                href="https://www.gov.br/lgpd"
                target="_blank"
                rel="noreferrer"
                className="text-[#1351B4] underline underline-offset-2"
              >
                Lei Geral de Proteção de Dados — LGPD
              </a>
              .
            </p>
          </div>

          {/* ── Card principal — 2 colunas ── */}
          <div className="bg-white rounded-2xl border border-[#E8EAF0] shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr]">

              {/* ════════════════════════════════════
                  COLUNA ESQUERDA — Login identificado
                  ════════════════════════════════════ */}
              <div className="p-8 sm:p-10">
                <h2 className="text-lg font-bold text-[#1B1B1B] mb-1">Login</h2>
                <p className="text-xs text-[#6B6B6B] mb-6">
                  Ainda não é cadastrado?{" "}
                  <Link href="/cadastro" className="text-[#1351B4] font-semibold hover:underline">
                    Clique aqui
                  </Link>
                </p>

                {/* Campos */}
                <form onSubmit={handleCredentials} className="space-y-4">

                  {/* Erro */}
                  {erro && (
                    <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-red-700">{erro}</p>
                    </div>
                  )}

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-sm font-medium text-[#1B1B1B]">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Digite seu e-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="w-full h-11 rounded-lg border border-[#CCCCCC] px-3.5 text-sm text-[#1B1B1B] placeholder:text-[#AAAAAA] focus:outline-none focus:ring-2 focus:ring-[#1351B4] focus:border-transparent transition"
                    />
                  </div>

                  {/* Senha */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="senha" className="block text-sm font-medium text-[#1B1B1B]">
                        Senha
                      </label>
                      <Link
                        href="/esqueci-senha"
                        className="text-xs text-[#1351B4] hover:underline"
                      >
                        Esqueceu a senha?
                      </Link>
                    </div>
                    <div className="relative">
                      <input
                        id="senha"
                        type={mostrarSenha ? "text" : "password"}
                        placeholder="••••••"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        autoComplete="current-password"
                        className="w-full h-11 rounded-lg border border-[#CCCCCC] px-3.5 pr-11 text-sm text-[#1B1B1B] placeholder:text-[#AAAAAA] focus:outline-none focus:ring-2 focus:ring-[#1351B4] focus:border-transparent transition"
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarSenha(!mostrarSenha)}
                        tabIndex={-1}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#1B1B1B] transition-colors"
                      >
                        {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* CTA Entrar */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-11 rounded-[100px] bg-[#1351B4] text-white font-semibold text-sm hover:bg-[#0c326f] disabled:opacity-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c2850c]"
                  >
                    {loading ? "Entrando..." : "Entrar"}
                  </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-[#E8EAF0]" />
                  <span className="text-xs text-[#6B6B6B]">ou</span>
                  <div className="flex-1 h-px bg-[#E8EAF0]" />
                </div>

                {/* GOV.BR */}
                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={loading}
                  className="w-full h-11 rounded-[100px] border-2 border-[#1351B4] text-[#1351B4] font-semibold text-sm flex items-center justify-center gap-2.5 hover:bg-[#EEF4FF] disabled:opacity-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c2850c]"
                >
                  <span className="font-extrabold tracking-tight text-base leading-none">gov</span>
                  <span className="font-light text-base leading-none">.br</span>
                  <span className="ml-0.5">Entrar com gov.br</span>
                </button>
              </div>

              {/* ── Divisor vertical (desktop) ── */}
              <div className="hidden lg:flex items-stretch">
                <div className="w-px bg-[#E8EAF0] my-8" />
              </div>

              {/* ── Divisor horizontal (mobile) ── */}
              <div className="lg:hidden mx-8 h-px bg-[#E8EAF0]" />

              {/* ════════════════════════════════════
                  COLUNA DIREITA — Manifestação anônima
                  ════════════════════════════════════ */}
              <div className="p-8 sm:p-10 bg-[#1351B4] flex flex-col items-center justify-center text-center lg:rounded-r-2xl">

                {/* Ícone */}
                <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center mb-6">
                  <UserX className="w-9 h-9 text-white" />
                </div>

                {/* Título */}
                <h2 className="text-xl font-bold text-white mb-3 leading-snug">
                  Enviar manifestação<br />de forma anônima
                </h2>

                {/* CTA */}
                <Link
                  href="/nova-manifestacao?anonimo=true"
                  className="inline-flex items-center justify-center gap-2 h-11 px-8 rounded-[100px] bg-white text-[#1351B4] font-semibold text-sm hover:bg-[#EEF4FF] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c2850c] mb-6"
                >
                  Continuar sem identificar
                </Link>

                {/* Aviso */}
                <div className="flex items-start gap-2.5 bg-white/10 border border-white/20 rounded-xl px-4 py-3.5 text-left max-w-xs">
                  <Info className="w-4 h-4 text-white/80 shrink-0 mt-0.5" />
                  <p className="text-xs text-white/80 leading-relaxed">
                    As manifestações registradas sem identificação são tratadas como{" "}
                    <strong className="text-white font-semibold">Comunicação de Irregularidade</strong>.
                    Não será possível acompanhar o andamento nem receber resposta do órgão.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ─── Página exportada com Suspense (exigido pelo useSearchParams) ─── */
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8]">
          <p className="text-sm text-[#6B6B6B]">Carregando...</p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
