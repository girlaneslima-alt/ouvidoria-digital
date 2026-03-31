-- CreateEnum
CREATE TYPE "TipoPessoa" AS ENUM ('FISICA', 'JURIDICA');

-- CreateEnum
CREATE TYPE "TipoUnidade" AS ENUM ('OUVIDORIA', 'PONTO_ATENDIMENTO', 'ORGAO_COMPETENTE');

-- CreateEnum
CREATE TYPE "NivelFederativo" AS ENUM ('FEDERAL', 'ESTADUAL', 'MUNICIPAL');

-- CreateEnum
CREATE TYPE "PapelInterno" AS ENUM ('ATENDENTE', 'OUVIDOR', 'GESTOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "TipoManifestacao" AS ENUM ('DENUNCIA', 'ELOGIO', 'SOLICITACAO', 'SUGESTAO', 'SIMPLIFIQUE', 'INFORMACAO', 'RECLAMACAO');

-- CreateEnum
CREATE TYPE "StatusManifestacao" AS ENUM ('REGISTRADA', 'EM_ANALISE', 'ENCAMINHADA', 'AGUARDANDO_RESPOSTA', 'RESPONDIDA', 'ENCERRADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "CanalEntrada" AS ENUM ('WEB', 'APP', 'PRESENCIAL', 'TELEFONE', 'CARTA', 'FALA_BR');

-- CreateEnum
CREATE TYPE "TipoEncaminhamento" AS ENUM ('INTERNO', 'EXTERNO', 'REDE_NACIONAL');

-- CreateEnum
CREATE TYPE "TipoResposta" AS ENUM ('TECNICA', 'PARCIAL', 'FINAL');

-- CreateEnum
CREATE TYPE "StatusPrazo" AS ENUM ('NO_PRAZO', 'ATRASADO', 'ENCERRADO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Cidadao" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "estrangeiro" BOOLEAN NOT NULL DEFAULT false,
    "tipoPessoa" "TipoPessoa" NOT NULL DEFAULT 'FISICA',
    "cpf" TEXT,
    "naoTemCpf" BOOLEAN NOT NULL DEFAULT false,
    "nomeCompleto" TEXT NOT NULL,
    "nomeSocial" TEXT,
    "nomeMae" TEXT,
    "dataNascimento" TIMESTAMP(3),
    "telefone" TEXT,
    "cep" TEXT,
    "endereco" TEXT,
    "municipio" TEXT,
    "uf" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cidadao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unidade" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "sigla" TEXT,
    "tipo" "TipoUnidade" NOT NULL,
    "municipio" TEXT,
    "uf" TEXT,
    "nivelFederativo" "NivelFederativo" NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Unidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PerfilInterno" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "unidadeId" TEXT NOT NULL,
    "papel" "PapelInterno" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PerfilInterno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manifestacao" (
    "id" TEXT NOT NULL,
    "protocolo" TEXT NOT NULL,
    "tipo" "TipoManifestacao" NOT NULL,
    "assunto" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" "StatusManifestacao" NOT NULL DEFAULT 'REGISTRADA',
    "sigiloso" BOOLEAN NOT NULL DEFAULT false,
    "canalEntrada" "CanalEntrada" NOT NULL DEFAULT 'WEB',
    "cidadaoId" TEXT NOT NULL,
    "unidadeOrigemId" TEXT,
    "prazoLegal" TIMESTAMP(3),
    "dataResposta" TIMESTAMP(3),
    "dataEncerramento" TIMESTAMP(3),
    "protocoloFalaBR" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Manifestacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Encaminhamento" (
    "id" TEXT NOT NULL,
    "manifestacaoId" TEXT NOT NULL,
    "unidadeDestinoId" TEXT NOT NULL,
    "responsavelId" TEXT,
    "justificativa" TEXT,
    "tipo" "TipoEncaminhamento" NOT NULL DEFAULT 'INTERNO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Encaminhamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resposta" (
    "id" TEXT NOT NULL,
    "manifestacaoId" TEXT NOT NULL,
    "responsavelId" TEXT,
    "conteudo" TEXT NOT NULL,
    "tipo" "TipoResposta" NOT NULL DEFAULT 'PARCIAL',
    "visivelCidadao" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resposta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prazo" (
    "id" TEXT NOT NULL,
    "manifestacaoId" TEXT NOT NULL,
    "dataLimite" TIMESTAMP(3) NOT NULL,
    "alertasEnviados" INTEGER NOT NULL DEFAULT 0,
    "statusPrazo" "StatusPrazo" NOT NULL DEFAULT 'NO_PRAZO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prazo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Cidadao_userId_key" ON "Cidadao"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Cidadao_cpf_key" ON "Cidadao"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "PerfilInterno_userId_key" ON "PerfilInterno"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Manifestacao_protocolo_key" ON "Manifestacao"("protocolo");

-- CreateIndex
CREATE UNIQUE INDEX "Prazo_manifestacaoId_key" ON "Prazo"("manifestacaoId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cidadao" ADD CONSTRAINT "Cidadao_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerfilInterno" ADD CONSTRAINT "PerfilInterno_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PerfilInterno" ADD CONSTRAINT "PerfilInterno_unidadeId_fkey" FOREIGN KEY ("unidadeId") REFERENCES "Unidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manifestacao" ADD CONSTRAINT "Manifestacao_cidadaoId_fkey" FOREIGN KEY ("cidadaoId") REFERENCES "Cidadao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manifestacao" ADD CONSTRAINT "Manifestacao_unidadeOrigemId_fkey" FOREIGN KEY ("unidadeOrigemId") REFERENCES "Unidade"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encaminhamento" ADD CONSTRAINT "Encaminhamento_manifestacaoId_fkey" FOREIGN KEY ("manifestacaoId") REFERENCES "Manifestacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encaminhamento" ADD CONSTRAINT "Encaminhamento_unidadeDestinoId_fkey" FOREIGN KEY ("unidadeDestinoId") REFERENCES "Unidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encaminhamento" ADD CONSTRAINT "Encaminhamento_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "PerfilInterno"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resposta" ADD CONSTRAINT "Resposta_manifestacaoId_fkey" FOREIGN KEY ("manifestacaoId") REFERENCES "Manifestacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resposta" ADD CONSTRAINT "Resposta_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "PerfilInterno"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prazo" ADD CONSTRAINT "Prazo_manifestacaoId_fkey" FOREIGN KEY ("manifestacaoId") REFERENCES "Manifestacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
