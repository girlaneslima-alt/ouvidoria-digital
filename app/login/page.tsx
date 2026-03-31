"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { toast } from "sonner";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro("");
    const res = await signIn("credentials", {
      email,
      password: senha,
      redirect: false,
    });
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
    <div className="min-h-screen flex flex-col" style={{ background: "#F8F8F8" }}>
      {/* Barra GOV.BR */}
      <div className="h-2 w-full" style={{ background: "#1351B4" }} />

      {/* Header mínimo */}
      <header className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
              style={{ background: "#1351B4" }}
            >
              OD
            </div>
            <span className="font-semibold text-sm" style={{ color: "#1351B4" }}>
              Ouvidoria Digital
            </span>
          </Link>
          <nav className="ml-auto flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/">Início</Link>
            <span>›</span>
            <Link href="/sobre">Sobre a Ouvidoria</Link>
            <span>›</span>
            <Link href="/perguntas-frequentes">Perguntas Frequentes</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 pt-12 pb-16">
        <div className="w-full max-w-md">
          {/* Voltar */}
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm mb-6"
            style={{ color: "#1351B4" }}
          >
            ← Voltar
          </Link>

          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl" style={{ color: "#1351B4" }}>
                Entrar na Ouvidoria Digital
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Não tem cadastro?{" "}
                <Link
                  href="/cadastro"
                  className="font-medium underline"
                  style={{ color: "#1351B4" }}
                >
                  Cadastre-se gratuitamente
                </Link>
              </p>
            </CardHeader>

            <CardContent className="space-y-5 pt-4">
              {/* Botão GOV.BR / Google */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 font-medium border-2 flex items-center gap-3"
                style={{ borderColor: "#1351B4", color: "#1351B4" }}
                onClick={handleGoogle}
                disabled={loading}
              >
                {/* Logo GOV.BR simplificado */}
                <span className="font-bold text-base tracking-tight">gov.br</span>
                Entrar com GOV.BR
              </Button>

              <div className="flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground">ou</span>
                <Separator className="flex-1" />
              </div>

              {/* Formulário de credenciais */}
              <form onSubmit={handleCredentials} className="space-y-4">
                {erro && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                    <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                    <p className="text-xs text-destructive">{erro}</p>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="email">E-mail cadastrado</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="senha">Senha</Label>
                  <div className="relative">
                    <Input
                      id="senha"
                      type={mostrarSenha ? "text" : "password"}
                      placeholder="••••••••••"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      tabIndex={-1}
                    >
                      {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 font-semibold"
                  style={{ background: "#1351B4" }}
                  disabled={loading}
                >
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </form>

              <p className="text-center text-xs text-muted-foreground">
                Seus dados pessoais são protegidos conforme a{" "}
                <a
                  href="https://www.gov.br/lgpd"
                  className="underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  LGPD
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Carregando...</p></div>}>
      <LoginContent />
    </Suspense>
  );
}
