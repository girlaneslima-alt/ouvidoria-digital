"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Search, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cadastroCidadaoSchema, type CadastroCidadaoInput } from "@/lib/validations";

const UFS = [
  "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT",
  "PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO",
];

export default function CadastroPage() {
  const router = useRouter();
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buscandoCep, setBuscandoCep] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<CadastroCidadaoInput>({
    resolver: zodResolver(cadastroCidadaoSchema) as any,
    defaultValues: {
      estrangeiro: false,
      tipoPessoa: "FISICA",
      naoTemCpf: false,
      aceiteTermos: undefined,
    },
  });

  const estrangeiro = watch("estrangeiro");
  const naoTemCpf = watch("naoTemCpf");
  const senha = watch("senha") ?? "";

  // Requisitos de senha
  const senhaReqs = {
    especial: /[!@#$%]/.test(senha),
    maiuscula: /[A-Z]/.test(senha),
    igual: senha.length > 0 && senha === watch("confirmarSenha"),
    tamanho: senha.length >= 8,
  };

  async function buscarCep(cep: string) {
    const limpo = cep.replace(/\D/g, "");
    if (limpo.length !== 8) return;
    setBuscandoCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setValue("endereco", `${data.logradouro}, ${data.bairro}`);
        setValue("municipio", data.localidade);
        setValue("uf", data.uf);
      }
    } catch {}
    setBuscandoCep(false);
  }

  async function onSubmit(data: CadastroCidadaoInput) {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erro ao cadastrar");
      toast.success("Cadastro realizado! Faça login para continuar.");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F8F8F8" }}>
      {/* Barra GOV.BR */}
      <div className="h-2 w-full" style={{ background: "#1351B4" }} />

      {/* Header mínimo */}
      <header className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
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
          <nav className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/">Início</Link>
            <span>›</span>
            <Link href="/sobre">Sobre a Ouvidoria</Link>
            <span>›</span>
            <Link href="/perguntas-frequentes">Perguntas Frequentes</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 px-4 pt-10 pb-20">
        <div className="max-w-lg mx-auto">
          {/* Voltar */}
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-sm mb-6"
            style={{ color: "#1351B4" }}
          >
            ← Voltar
          </Link>

          <Card className="border border-border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl" style={{ color: "#1351B4" }}>
                Cadastra-se
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Crie seu cadastro para registrar manifestações e acompanhar respostas da Ouvidoria do MDS.
                O cadastro é rápido e gratuito.
              </p>
              <p className="text-xs text-muted-foreground mt-2 border-l-2 pl-3" style={{ borderColor: "#1351B4" }}>
                Seus dados pessoais são protegidos conforme a Lei Geral de Proteção de Dados (LGPD).
              </p>
            </CardHeader>

            <CardContent className="pt-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                {/* Estrangeiro */}
                <div className="space-y-2">
                  <Label className="font-semibold">Você é estrangeiro?*</Label>
                  <div className="flex items-center gap-6">
                    {["Sim", "Não"].map((op) => (
                      <label key={op} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value={op === "Sim" ? "true" : "false"}
                          {...register("estrangeiro", {
                            setValueAs: (v) => v === "true",
                          })}
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="text-sm">{op}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Tipo de pessoa */}
                <div className="space-y-2">
                  <Label className="font-semibold">Tipo do pessoa*:</Label>
                  <div className="flex items-center gap-6">
                    {[
                      { label: "Pessoa Física", value: "FISICA" },
                      { label: "Pessoa Jurídica", value: "JURIDICA" },
                    ].map((op) => (
                      <label key={op.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value={op.value}
                          {...register("tipoPessoa")}
                          className="w-4 h-4 accent-primary"
                        />
                        <span className="text-sm">{op.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* CPF */}
                {!estrangeiro && (
                  <div className="space-y-1.5">
                    <Input
                      placeholder="CPF"
                      {...register("cpf")}
                      disabled={naoTemCpf}
                      maxLength={14}
                      className={errors.cpf ? "border-destructive" : ""}
                    />
                    {errors.cpf && (
                      <p className="text-xs text-destructive">{errors.cpf.message}</p>
                    )}
                    <label className="flex items-center gap-2 cursor-pointer mt-1">
                      <Checkbox
                        checked={naoTemCpf}
                        onCheckedChange={(v) => setValue("naoTemCpf", !!v)}
                      />
                      <span className="text-sm">Não possuo</span>
                    </label>
                  </div>
                )}

                {/* Nome Completo */}
                <div className="space-y-1.5">
                  <Input
                    placeholder="Nome Completo*"
                    {...register("nomeCompleto")}
                    className={errors.nomeCompleto ? "border-destructive" : ""}
                  />
                  {errors.nomeCompleto && (
                    <p className="text-xs text-destructive">{errors.nomeCompleto.message}</p>
                  )}
                </div>

                {/* Nome Social */}
                <div>
                  <Input placeholder="Nome Social" {...register("nomeSocial")} />
                </div>

                {/* Nome da Mãe */}
                <div>
                  <Input placeholder="Nome da Mãe" {...register("nomeMae")} />
                </div>

                {/* Data de Nascimento */}
                <div>
                  <Input
                    type="date"
                    placeholder="Data de Nascimento"
                    {...register("dataNascimento")}
                  />
                </div>

                {/* Telefone */}
                <div>
                  <Input
                    placeholder="(00) 9999 9999"
                    {...register("telefone")}
                    maxLength={15}
                  />
                </div>

                {/* CEP + busca automática */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      placeholder="CEP"
                      {...register("cep")}
                      maxLength={9}
                      onBlur={(e) => buscarCep(e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => buscarCep(watch("cep") ?? "")}
                    disabled={buscandoCep}
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </div>

                {/* Endereço */}
                <div>
                  <Input placeholder="Endereço" {...register("endereco")} />
                </div>

                {/* Município + UF */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <Input placeholder="Município" {...register("municipio")} />
                  </div>
                  <div>
                    <select
                      {...register("uf")}
                      className="w-full h-10 px-3 rounded-md border border-input text-sm bg-background"
                    >
                      <option value="">UF</option>
                      {UFS.map((uf) => (
                        <option key={uf} value={uf}>{uf}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <Separator />

                {/* E-mail */}
                <div className="space-y-1.5">
                  <Input
                    type="email"
                    placeholder="E-mail"
                    {...register("email")}
                    className={errors.email ? "border-destructive" : ""}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>

                {/* Confirmar e-mail */}
                <div className="space-y-1.5">
                  <Input
                    type="email"
                    placeholder="Confirme E-mail"
                    {...register("confirmarEmail")}
                    className={errors.confirmarEmail ? "border-destructive" : ""}
                    autoComplete="email"
                  />
                  {errors.confirmarEmail && (
                    <p className="text-xs text-destructive">{errors.confirmarEmail.message}</p>
                  )}
                </div>

                {/* Senha */}
                <div className="space-y-2">
                  <Label className="font-semibold">Digite uma senha</Label>
                  <div className="relative">
                    <Input
                      type={mostrarSenha ? "text" : "password"}
                      placeholder="••••••••••"
                      {...register("senha")}
                      className={`pr-10 ${errors.senha ? "border-destructive" : ""}`}
                      autoComplete="new-password"
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

                  {/* Requisitos de senha */}
                  <ul className="space-y-1">
                    {[
                      { ok: senhaReqs.especial, texto: "Pelo menos 1 caractere especial (como ! @ # $ %)" },
                      { ok: senhaReqs.maiuscula, texto: "Pelo menos 1 letra maiúscula (A-Z)" },
                      { ok: senhaReqs.igual, texto: "As senhas devem ser iguais" },
                      { ok: senhaReqs.tamanho, texto: "No mínimo 8 caracteres" },
                    ].map((req) => (
                      <li key={req.texto} className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: req.ok ? "#168821" : "#CCCCCC" }}
                        />
                        <span
                          className="text-xs"
                          style={{ color: req.ok ? "#168821" : "#6B6B6B" }}
                        >
                          {req.texto}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Confirmar senha */}
                <div className="space-y-1.5">
                  <Label className="font-semibold">Confirmar senha</Label>
                  <div className="relative">
                    <Input
                      type={mostrarConfirmar ? "text" : "password"}
                      placeholder="••••••••••"
                      {...register("confirmarSenha")}
                      className={`pr-10 ${errors.confirmarSenha ? "border-destructive" : ""}`}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                      tabIndex={-1}
                    >
                      {mostrarConfirmar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmarSenha && (
                    <p className="text-xs text-destructive">{errors.confirmarSenha.message}</p>
                  )}
                </div>

                {/* Aceite de termos */}
                <div className="space-y-1.5">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <Checkbox
                      onCheckedChange={(v) => setValue("aceiteTermos", v ? true : (undefined as any))}
                      className="mt-0.5"
                    />
                    <span className="text-sm">
                      Li e aceito os{" "}
                      <Link href="/termos" className="underline" style={{ color: "#1351B4" }}>
                        Termos de Uso
                      </Link>{" "}
                      e a{" "}
                      <Link href="/privacidade" className="underline" style={{ color: "#1351B4" }}>
                        Política de Privacidade
                      </Link>
                    </span>
                  </label>
                  {errors.aceiteTermos && (
                    <p className="text-xs text-destructive">{errors.aceiteTermos.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 font-semibold text-base rounded-full"
                  style={{ background: "#1351B4" }}
                  disabled={loading}
                >
                  {loading ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
