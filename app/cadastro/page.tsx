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
  placeholder, error, className, fullWidth, ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: string; fullWidth?: boolean }) {
  return (
    <input
      placeholder={placeholder}
      className={`w-full h-10 rounded-lg border px-3.5 text-sm text-[#1B1B1B] placeholder:text-[#AAAAAA]
        focus:outline-none focus:ring-2 focus:ring-[#1351B4] focus:border-transparent transition
        ${error ? "border-red-400 bg-red-50" : "border-[#CCCCCC]"}
        ${className ?? ""}`}
      {...props}
    />
  );
}

function SelectInput({
  children, error, ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }) {
  return (
    <div className="relative">
      <select
        className={`w-full h-10 rounded-lg border px-3.5 pr-9 text-sm text-[#1B1B1B] bg-white
          appearance-none cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-[#1351B4] focus:border-transparent transition
          ${error ? "border-red-400 bg-red-50" : "border-[#CCCCCC]"}`}
        {...props}
      >
        {children}
      </select>
      {/* Chevron customizado — substitui a seta nativa do browser */}
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <svg className="w-4 h-4 text-[#6B6B6B]" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
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
            <SectionCard icon={<Lock className="w-4 h-4" />} title="Crie sua senha de acesso">

              {/* Instrução contextual para todos os níveis de usuário */}
              <div className="flex items-start gap-3 bg-[#F0F4FF] border border-[#C7D7F5] rounded-xl px-4 py-3">
                <Lock className="w-4 h-4 text-[#1351B4] shrink-0 mt-0.5" />
                <p className="text-sm text-[#1351B4] leading-relaxed">
                  Você vai usar essa senha toda vez que quiser acessar sua conta.
                  <strong className="block mt-0.5 text-[#0c326f]">Não compartilhe sua senha com ninguém.</strong>
                </p>
              </div>

              {/* ── Campo: Nova Senha ── */}
              <div className="space-y-1.5">
                <label htmlFor="senha" className="block text-sm font-semibold text-[#1B1B1B]">
                  Crie uma senha <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-[#6B6B6B]">
                  Escolha uma senha que só você saiba. Ela será usada para entrar na plataforma.
                </p>
                <div className="relative">
                  <TextInput
                    id="senha"
                    type={mostrarSenha ? "text" : "password"}
                    placeholder={mostrarSenha ? "Digite sua senha" : "Clique aqui e digite sua senha"}
                    {...register("senha")}
                    error={errors.senha?.message}
                    autoComplete="new-password"
                    className="pr-28"
                  />
                  {/* Botão com ícone + texto — mais claro para todos os perfis */}
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5
                      px-2.5 py-1 rounded-md text-xs font-medium text-[#1351B4]
                      hover:bg-[#EEF4FF] transition-colors border border-transparent hover:border-[#C7D7F5]"
                  >
                    {mostrarSenha
                      ? <><EyeOff className="w-3.5 h-3.5" /> Ocultar</>
                      : <><Eye    className="w-3.5 h-3.5" /> Mostrar</>
                    }
                  </button>
                </div>
                <FieldError msg={errors.senha?.message} />

                {/* Barra de força da senha */}
                {senha.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4].map((n) => {
                        const nivel = [
                          senhaReqs.tamanho,
                          senhaReqs.maiuscula,
                          senhaReqs.especial,
                          senhaReqs.igual,
                        ].filter(Boolean).length;
                        const ativo = n <= nivel;
                        const cor =
                          nivel <= 1 ? "bg-red-500"
                          : nivel === 2 ? "bg-orange-400"
                          : nivel === 3 ? "bg-yellow-400"
                          : "bg-green-500";
                        return (
                          <div
                            key={n}
                            className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${ativo ? cor : "bg-[#E8EAF0]"}`}
                          />
                        );
                      })}
                    </div>
                    <p className={`text-xs font-medium ${
                      [senhaReqs.tamanho, senhaReqs.maiuscula, senhaReqs.especial, senhaReqs.igual].filter(Boolean).length <= 1
                        ? "text-red-600"
                        : [senhaReqs.tamanho, senhaReqs.maiuscula, senhaReqs.especial, senhaReqs.igual].filter(Boolean).length === 2
                        ? "text-orange-500"
                        : [senhaReqs.tamanho, senhaReqs.maiuscula, senhaReqs.especial, senhaReqs.igual].filter(Boolean).length === 3
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}>
                      Força da senha:{" "}
                      {[senhaReqs.tamanho, senhaReqs.maiuscula, senhaReqs.especial, senhaReqs.igual].filter(Boolean).length <= 1
                        ? "Fraca"
                        : [senhaReqs.tamanho, senhaReqs.maiuscula, senhaReqs.especial, senhaReqs.igual].filter(Boolean).length === 2
                        ? "Razoável"
                        : [senhaReqs.tamanho, senhaReqs.maiuscula, senhaReqs.especial, senhaReqs.igual].filter(Boolean).length === 3
                        ? "Boa"
                        : "Forte ✓"}
                    </p>
                  </div>
                )}
              </div>

              {/* Requisitos — lista vertical, ícone + texto claro */}
              <div className="bg-[#F8F8F8] border border-[#E8EAF0] rounded-xl p-4 space-y-2.5">
                <p className="text-xs font-semibold text-[#1B1B1B] mb-1">Sua senha precisa ter:</p>
                {[
                  { ok: senhaReqs.tamanho,   texto: "No mínimo 8 caracteres", ex: "Ex: abcdefgh" },
                  { ok: senhaReqs.maiuscula,  texto: "Pelo menos 1 letra maiúscula", ex: "Ex: A, B, C..." },
                  { ok: senhaReqs.especial,   texto: "Pelo menos 1 caractere especial", ex: "Ex: ! @ # $ %" },
                ].map((req) => (
                  <div key={req.texto} className="flex items-start gap-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors
                      ${req.ok ? "bg-green-100" : "bg-[#E8EAF0]"}`}>
                      {req.ok
                        ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                        : <span className="w-2 h-2 rounded-full bg-[#CCCCCC] block" />
                      }
                    </div>
                    <div>
                      <span className={`text-sm ${req.ok ? "text-green-700 font-medium" : "text-[#1B1B1B]"}`}>
                        {req.texto}
                      </span>
                      {!req.ok && (
                        <span className="text-xs text-[#6B6B6B] ml-1.5">{req.ex}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Campo: Confirmar Senha ── */}
              <div className="space-y-1.5">
                <label htmlFor="confirmarSenha" className="block text-sm font-semibold text-[#1B1B1B]">
                  Repita a senha <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-[#6B6B6B]">
                  Digite a mesma senha novamente para confirmar.
                </p>
                <div className="relative">
                  <TextInput
                    id="confirmarSenha"
                    type={mostrarConfirmar ? "text" : "password"}
                    placeholder={mostrarConfirmar ? "Repita a senha" : "Clique aqui e repita a senha"}
                    {...register("confirmarSenha")}
                    error={errors.confirmarSenha?.message}
                    autoComplete="new-password"
                    className="pr-28"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarConfirmar(!mostrarConfirmar)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5
                      px-2.5 py-1 rounded-md text-xs font-medium text-[#1351B4]
                      hover:bg-[#EEF4FF] transition-colors border border-transparent hover:border-[#C7D7F5]"
                  >
                    {mostrarConfirmar
                      ? <><EyeOff className="w-3.5 h-3.5" /> Ocultar</>
                      : <><Eye    className="w-3.5 h-3.5" /> Mostrar</>
                    }
                  </button>
                </div>

                {/* Feedback live de confirmação */}
                {watch("confirmarSenha") && watch("confirmarSenha")!.length > 0 && (
                  <div className={`flex items-center gap-2 text-xs font-medium mt-1
                    ${senhaReqs.igual ? "text-green-600" : "text-red-600"}`}>
                    {senhaReqs.igual
                      ? <><CheckCircle2 className="w-3.5 h-3.5" /> As senhas coincidem — tudo certo!</>
                      : <><span className="w-3.5 h-3.5 rounded-full border-2 border-red-400 inline-block" /> As senhas não coincidem ainda</>
                    }
                  </div>
                )}
                <FieldError msg={errors.confirmarSenha?.message} />
              </div>

              {/* Termos */}
              <div className="pt-2 border-t border-[#E8EAF0]">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      setValue("aceiteTermos", e.target.checked ? true : (undefined as any))
                    }
                    className="w-5 h-5 mt-0.5 accent-[#1351B4] rounded shrink-0 cursor-pointer"
                  />
                  <span className="text-sm text-[#1B1B1B] leading-relaxed group-hover:text-[#1351B4] transition-colors">
                    Li e concordo com os{" "}
                    <Link href="/termos" className="text-[#1351B4] underline underline-offset-2 font-medium">Termos de Uso</Link>{" "}
                    e a{" "}
                    <Link href="/privacidade" className="text-[#1351B4] underline underline-offset-2 font-medium">Política de Privacidade</Link>
                    {" "}da Ouvidoria Digital.
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
