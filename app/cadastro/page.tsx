"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Search, ArrowLeft, ChevronRight, User, Building2, Globe, MapPin, Phone, Lock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { cadastroCidadaoSchema, type CadastroCidadaoInput } from "@/lib/validations";

const UFS = [
  "AC","AL","AM","AP","BA","CE","DF","ES","GO","MA","MG","MS","MT",
  "PA","PB","PE","PI","PR","RJ","RN","RO","RR","RS","SC","SE","SP","TO",
];

// ── Helpers de estilo ────────────────────────────────────────────────────────

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-red-600 mt-1">{msg}</p>;
}

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8EAF0] shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#E8EAF0] bg-[#F5F8FF]">
        <div className="w-8 h-8 rounded-lg bg-[#1351B4] flex items-center justify-center text-white">
          {icon}
        </div>
        <h2 className="font-semibold text-[#1351B4] text-base">{title}</h2>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
}

function FieldGroup({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#1B1B1B]">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      <FieldError msg={error} />
    </div>
  );
}

function TextInput({
  placeholder, error, fullWidth, ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: string; fullWidth?: boolean }) {
  return (
    <input
      placeholder={placeholder}
      className={`w-full h-10 rounded-lg border px-3.5 text-sm text-[#1B1B1B] placeholder:text-[#AAAAAA]
        focus:outline-none focus:ring-2 focus:ring-[#1351B4] focus:border-transparent transition
        ${error ? "border-red-400 bg-red-50" : "border-[#CCCCCC]"}`}
      {...props}
    />
  );
}

function SelectInput({
  children, error, ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }) {
  return (
    <select
      className={`w-full h-10 rounded-lg border px-3.5 text-sm text-[#1B1B1B] bg-white
        focus:outline-none focus:ring-2 focus:ring-[#1351B4] focus:border-transparent transition
        ${error ? "border-red-400 bg-red-50" : "border-[#CCCCCC]"}`}
      {...props}
    >
      {children}
    </select>
  );
}

// ── Componente principal ─────────────────────────────────────────────────────

export default function CadastroPage() {
  const router                              = useRouter();
  const [mostrarSenha, setMostrarSenha]     = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [loading, setLoading]               = useState(false);
  const [buscandoCep, setBuscandoCep]       = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CadastroCidadaoInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(cadastroCidadaoSchema) as any,
    defaultValues: {
      estrangeiro: false,
      tipoPessoa:  "FISICA",
      naoTemCpf:   false,
    },
  });

  const estrangeiro = watch("estrangeiro");
  const tipoPessoa  = watch("tipoPessoa");
  const naoTemCpf   = watch("naoTemCpf");
  const senha       = watch("senha") ?? "";

  const senhaReqs = {
    tamanho:  senha.length >= 8,
    maiuscula: /[A-Z]/.test(senha),
    especial:  /[!@#$%]/.test(senha),
    igual:     senha.length > 0 && senha === watch("confirmarSenha"),
  };

  async function buscarCep(cep: string) {
    const limpo = cep.replace(/\D/g, "");
    if (limpo.length !== 8) return;
    setBuscandoCep(true);
    try {
      const res  = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setValue("logradouro", data.logradouro);
        setValue("bairro",     data.bairro);
        setValue("cidade",     data.localidade);
        setValue("municipio",  data.localidade);
        setValue("estado",     data.uf);
        setValue("uf",         data.uf);
      }
    } catch { /* silencioso */ }
    setBuscandoCep(false);
  }

  async function onSubmit(data: CadastroCidadaoInput) {
    setLoading(true);
    try {
      const res  = await fetch("/api/auth/cadastro", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          ...data,
          endereco: `${data.logradouro ?? ""}, ${data.bairro ?? ""}`.trim().replace(/^,\s*/, ""),
          municipio: data.cidade,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Erro ao cadastrar");
      toast.success("Cadastro realizado! Faça login para continuar.");
      router.push("/login");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  // Tipo selecionado para exibição amigável
  const tipoLabel = estrangeiro
    ? "Estrangeiro"
    : tipoPessoa === "JURIDICA"
    ? "Pessoa Jurídica"
    : "Pessoa Física";

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F4FF]">

      {/* Barra GOV.BR */}
      <div className="h-1.5 w-full bg-[#1351B4]" />

      {/* Header */}
      <header className="bg-white border-b border-[#E8EAF0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1351B4] flex items-center justify-center">
              <span className="text-white font-bold text-xs">OD</span>
            </div>
            <span className="font-semibold text-sm text-[#1351B4]">Ouvidoria Digital</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-1.5 text-xs text-[#6B6B6B]">
            <Link href="/" className="hover:text-[#1351B4] transition-colors">Início</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/login" className="hover:text-[#1351B4] transition-colors">Login</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#1351B4] font-medium">Cadastro</span>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-4 sm:px-6 pt-10 pb-20">
        <div className="max-w-3xl mx-auto">

          {/* Voltar */}
          <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-[#1351B4] hover:underline mb-6">
            <ArrowLeft className="w-4 h-4" />
            Voltar para o login
          </Link>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1351B4] mb-2">Criar conta</h1>
            <p className="text-sm text-[#6B6B6B] leading-relaxed">
              Preencha os dados abaixo para registrar manifestações e acompanhar respostas.
              Seus dados são protegidos pela{" "}
              <a href="https://www.gov.br/lgpd" target="_blank" rel="noreferrer" className="text-[#1351B4] underline underline-offset-2">LGPD</a>.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* ══════════════════════════════════════════
                CARD 0 — Tipo de demandante
                ══════════════════════════════════════════ */}
            <SectionCard icon={<User className="w-4 h-4" />} title="Tipo de demandante">

              {/* Estrangeiro? */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-[#1B1B1B]">
                  Você é estrangeiro? <span className="text-red-500">*</span>
                </p>
                <div className="flex gap-4">
                  {[{ label: "Sim", bool: true }, { label: "Não", bool: false }].map(({ label, bool }) => (
                    <label key={String(bool)} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={estrangeiro === bool}
                        onChange={() => setValue("estrangeiro", bool)}
                        className="w-4 h-4 accent-[#1351B4]"
                      />
                      <span className="text-sm">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tipo de pessoa — só se NÃO for estrangeiro */}
              {!estrangeiro && (
                <div className="space-y-2 pt-2 border-t border-[#E8EAF0]">
                  <p className="text-sm font-medium text-[#1B1B1B]">
                    Tipo de pessoa <span className="text-red-500">*</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: "Pessoa Física",   val: "FISICA",   icon: <User className="w-5 h-5" />,      desc: "CPF obrigatório" },
                      { label: "Pessoa Jurídica", val: "JURIDICA", icon: <Building2 className="w-5 h-5" />, desc: "CNPJ obrigatório" },
                    ].map(({ label, val, icon, desc }) => (
                      <label
                        key={val}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                          ${tipoPessoa === val
                            ? "border-[#1351B4] bg-[#EEF4FF]"
                            : "border-[#E8EAF0] bg-white hover:border-[#1351B4]/40"}`}
                      >
                        <input type="radio" value={val} {...register("tipoPessoa")} className="sr-only" />
                        <div className={`${tipoPessoa === val ? "text-[#1351B4]" : "text-[#6B6B6B]"}`}>{icon}</div>
                        <div>
                          <p className={`font-semibold text-sm ${tipoPessoa === val ? "text-[#1351B4]" : "text-[#1B1B1B]"}`}>{label}</p>
                          <p className="text-xs text-[#6B6B6B]">{desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Badge do tipo selecionado */}
              <div className="flex items-center gap-2 pt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1351B4] text-white text-xs font-medium">
                  {estrangeiro ? <Globe className="w-3 h-3" /> : tipoPessoa === "JURIDICA" ? <Building2 className="w-3 h-3" /> : <User className="w-3 h-3" />}
                  Cadastrando como: {tipoLabel}
                </span>
              </div>
            </SectionCard>

            {/* ══════════════════════════════════════════
                CARD 1 — Dados Pessoais
                ══════════════════════════════════════════ */}
            <SectionCard
              icon={estrangeiro ? <Globe className="w-4 h-4" /> : tipoPessoa === "JURIDICA" ? <Building2 className="w-4 h-4" /> : <User className="w-4 h-4" />}
              title="Dados Pessoais"
            >

              {/* ── PESSOA JURÍDICA ── */}
              {!estrangeiro && tipoPessoa === "JURIDICA" && (
                <>
                  <FieldRow>
                    <FieldGroup label="Nome do Representante Legal" required error={errors.nomeRepresentante?.message}>
                      <TextInput placeholder="Digite aqui" {...register("nomeRepresentante")} error={errors.nomeRepresentante?.message} />
                    </FieldGroup>
                    <FieldGroup label="CPF do Representante Legal" required error={errors.cpfRepresentante?.message}>
                      <TextInput placeholder="Digite aqui" {...register("cpfRepresentante")} maxLength={14} error={errors.cpfRepresentante?.message} />
                    </FieldGroup>
                  </FieldRow>
                  <FieldGroup label="E-mail do Representante Legal" required error={errors.emailRepresentante?.message}>
                    <TextInput type="email" placeholder="Digite aqui" {...register("emailRepresentante")} error={errors.emailRepresentante?.message} />
                  </FieldGroup>
                  <FieldRow>
                    <FieldGroup label="Nome da Empresa" required error={errors.nomeEmpresa?.message}>
                      <TextInput placeholder="Digite aqui" {...register("nomeEmpresa")} error={errors.nomeEmpresa?.message} />
                    </FieldGroup>
                    <FieldGroup label="CNPJ" required error={errors.cnpj?.message}>
                      <TextInput placeholder="00.000.000/0000-00" {...register("cnpj")} maxLength={18} error={errors.cnpj?.message} />
                    </FieldGroup>
                  </FieldRow>
                  <FieldGroup label="Contrato da Empresa" error={errors.contratoEmpresa?.message}>
                    <TextInput placeholder="Número do contrato (opcional)" {...register("contratoEmpresa")} error={errors.contratoEmpresa?.message} />
                  </FieldGroup>
                </>
              )}

              {/* ── PESSOA FÍSICA ── */}
              {!estrangeiro && tipoPessoa === "FISICA" && (
                <>
                  <FieldRow>
                    <FieldGroup label="Nome Completo" required error={errors.nomeCompleto?.message}>
                      <TextInput placeholder="Digite aqui" {...register("nomeCompleto")} error={errors.nomeCompleto?.message} />
                    </FieldGroup>
                    <FieldGroup label="Nome Social" error={errors.nomeSocial?.message}>
                      <TextInput placeholder="Digite aqui (opcional)" {...register("nomeSocial")} />
                    </FieldGroup>
                  </FieldRow>
                  <FieldRow>
                    <FieldGroup label="Data de Nascimento" error={errors.dataNascimento?.message}>
                      <TextInput type="date" {...register("dataNascimento")} />
                    </FieldGroup>
                    <FieldGroup label="Nome da Mãe" error={errors.nomeMae?.message}>
                      <TextInput placeholder="Digite aqui" {...register("nomeMae")} />
                    </FieldGroup>
                  </FieldRow>
                  <FieldGroup label="CPF" required={!naoTemCpf} error={errors.cpf?.message}>
                    <TextInput
                      placeholder="000.000.000-00"
                      {...register("cpf")}
                      disabled={naoTemCpf}
                      maxLength={14}
                      error={errors.cpf?.message}
                    />
                    <label className="inline-flex items-center gap-2 mt-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={naoTemCpf}
                        onChange={(e) => setValue("naoTemCpf", e.target.checked)}
                        className="w-4 h-4 accent-[#1351B4] rounded"
                      />
                      <span className="text-xs text-[#6B6B6B]">Não possuo CPF</span>
                    </label>
                  </FieldGroup>
                </>
              )}

              {/* ── ESTRANGEIRO ── */}
              {estrangeiro && (
                <>
                  <FieldRow>
                    <FieldGroup label="Nome Completo" required error={errors.nomeCompleto?.message}>
                      <TextInput placeholder="Digite aqui" {...register("nomeCompleto")} error={errors.nomeCompleto?.message} />
                    </FieldGroup>
                    <FieldGroup label="Nome Social" error={errors.nomeSocial?.message}>
                      <TextInput placeholder="Digite aqui (opcional)" {...register("nomeSocial")} />
                    </FieldGroup>
                  </FieldRow>
                  <FieldRow>
                    <FieldGroup label="Data de Nascimento" error={errors.dataNascimento?.message}>
                      <TextInput type="date" {...register("dataNascimento")} />
                    </FieldGroup>
                    <FieldGroup label="Nome da Cidade de Origem" error={errors.cidadeOrigem?.message}>
                      <TextInput placeholder="Digite aqui" {...register("cidadeOrigem")} />
                    </FieldGroup>
                  </FieldRow>
                  <FieldRow>
                    <FieldGroup label="Nacionalidade" required error={errors.nacionalidade?.message}>
                      <TextInput placeholder="Ex: Americana, Francesa..." {...register("nacionalidade")} error={errors.nacionalidade?.message} />
                    </FieldGroup>
                    <FieldGroup label="País de Origem" required error={errors.paisOrigem?.message}>
                      <TextInput placeholder="Digite o país" {...register("paisOrigem")} error={errors.paisOrigem?.message} />
                    </FieldGroup>
                  </FieldRow>
                </>
              )}
            </SectionCard>

            {/* ══════════════════════════════════════════
                CARD 2 — Endereço
                ══════════════════════════════════════════ */}
            <SectionCard icon={<MapPin className="w-4 h-4" />} title={tipoPessoa === "JURIDICA" && !estrangeiro ? "Endereço da Empresa" : "Endereço"}>
              {/* CEP + busca */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <FieldGroup label="CEP">
                    <TextInput
                      placeholder="00000-000"
                      {...register("cep")}
                      maxLength={9}
                      onBlur={(e) => buscarCep(e.target.value)}
                    />
                  </FieldGroup>
                </div>
                <div className="pt-7">
                  <button
                    type="button"
                    onClick={() => buscarCep(watch("cep") ?? "")}
                    disabled={buscandoCep}
                    className="h-10 w-10 rounded-lg border border-[#1351B4] text-[#1351B4] flex items-center justify-center hover:bg-[#EEF4FF] disabled:opacity-50 transition"
                    title="Buscar CEP"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <FieldRow>
                <FieldGroup label="Estado">
                  <SelectInput {...register("estado")}>
                    <option value="">Selecione</option>
                    {UFS.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
                  </SelectInput>
                </FieldGroup>
                <FieldGroup label="Bairro">
                  <TextInput placeholder="Digite aqui" {...register("bairro")} />
                </FieldGroup>
              </FieldRow>

              <FieldRow>
                <FieldGroup label="Cidade">
                  <TextInput placeholder="Digite aqui" {...register("cidade")} />
                </FieldGroup>
                <FieldGroup label="Logradouro">
                  <TextInput placeholder="Rua, Av., Travessa..." {...register("logradouro")} />
                </FieldGroup>
              </FieldRow>

              <FieldRow>
                <FieldGroup label="Número">
                  <TextInput placeholder="Nº" {...register("numero")} />
                </FieldGroup>
                <FieldGroup label="Complemento (opcional)">
                  <TextInput placeholder="Apto, Sala, Bloco..." {...register("complemento")} />
                </FieldGroup>
              </FieldRow>
            </SectionCard>

            {/* ══════════════════════════════════════════
                CARD 3 — Dados de Contato
                ══════════════════════════════════════════ */}
            <SectionCard icon={<Phone className="w-4 h-4" />} title="Dados de Contato">
              <FieldRow>
                <FieldGroup label="E-mail" required error={errors.email?.message}>
                  <TextInput
                    type="email"
                    placeholder="seu@email.com"
                    {...register("email")}
                    error={errors.email?.message}
                    autoComplete="email"
                  />
                </FieldGroup>
                <FieldGroup label="Confirmar E-mail" required error={errors.confirmarEmail?.message}>
                  <TextInput
                    type="email"
                    placeholder="Repita o e-mail"
                    {...register("confirmarEmail")}
                    error={errors.confirmarEmail?.message}
                    autoComplete="email"
                  />
                </FieldGroup>
              </FieldRow>
              <FieldGroup label="Telefone" error={errors.telefone?.message}>
                <TextInput
                  placeholder="(00) 9 0000-0000"
                  {...register("telefone")}
                  maxLength={15}
                />
              </FieldGroup>
            </SectionCard>

            {/* ══════════════════════════════════════════
                CARD 4 — Acesso (senha + termos)
                ══════════════════════════════════════════ */}
            <SectionCard icon={<Lock className="w-4 h-4" />} title="Senha de acesso">
              <FieldRow>
                {/* Senha */}
                <FieldGroup label="Digite uma senha" required error={errors.senha?.message}>
                  <div className="relative">
                    <TextInput
                      type={mostrarSenha ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("senha")}
                      error={errors.senha?.message}
                      autoComplete="new-password"
                      className="pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#1B1B1B]"
                    >
                      {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </FieldGroup>

                {/* Confirmar Senha */}
                <FieldGroup label="Confirmar senha" required error={errors.confirmarSenha?.message}>
                  <div className="relative">
                    <TextInput
                      type={mostrarConfirmar ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("confirmarSenha")}
                      error={errors.confirmarSenha?.message}
                      autoComplete="new-password"
                      className="pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6B6B] hover:text-[#1B1B1B]"
                    >
                      {mostrarConfirmar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </FieldGroup>
              </FieldRow>

              {/* Requisitos */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {[
                  { ok: senhaReqs.tamanho,  texto: "Mínimo 8 caracteres" },
                  { ok: senhaReqs.maiuscula, texto: "1 letra maiúscula (A-Z)" },
                  { ok: senhaReqs.especial,  texto: "1 caractere especial (! @ # $ %)" },
                  { ok: senhaReqs.igual,     texto: "Senhas coincidem" },
                ].map((req) => (
                  <div key={req.texto} className="flex items-center gap-2">
                    <CheckCircle2
                      className={`w-4 h-4 flex-shrink-0 ${req.ok ? "text-green-600" : "text-[#CCCCCC]"}`}
                    />
                    <span className={`text-xs ${req.ok ? "text-green-700" : "text-[#6B6B6B]"}`}>
                      {req.texto}
                    </span>
                  </div>
                ))}
              </div>

              {/* Termos */}
              <div className="pt-2 border-t border-[#E8EAF0]">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      setValue("aceiteTermos", e.target.checked ? true : (undefined as any))
                    }
                    className="w-4 h-4 mt-0.5 accent-[#1351B4] rounded"
                  />
                  <span className="text-sm text-[#1B1B1B] leading-relaxed">
                    Li e aceito os{" "}
                    <Link href="/termos" className="text-[#1351B4] underline underline-offset-2">Termos de Uso</Link>{" "}
                    e a{" "}
                    <Link href="/privacidade" className="text-[#1351B4] underline underline-offset-2">Política de Privacidade</Link>
                  </span>
                </label>
                <FieldError msg={errors.aceiteTermos?.message} />
              </div>
            </SectionCard>

            {/* ── Botão de envio ── */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-[100px] bg-[#1351B4] text-white font-semibold text-base
                hover:bg-[#0c326f] disabled:opacity-50 transition-colors
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c2850c]"
            >
              {loading ? "Cadastrando..." : "Criar conta"}
            </button>

            <p className="text-center text-sm text-[#6B6B6B]">
              Já tem cadastro?{" "}
              <Link href="/login" className="text-[#1351B4] font-semibold hover:underline">
                Faça login
              </Link>
            </p>

          </form>
        </div>
      </main>
    </div>
  );
}
