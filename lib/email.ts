import { Resend } from "resend";

// Lazy init — evita crash no build se RESEND_API_KEY não estiver definida
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY ?? "placeholder");
  }
  return _resend;
}

const FROM = process.env.EMAIL_FROM ?? "Ouvidoria Digital <noreply@ouvidoria.gov.br>";

export async function enviarEmailProtocolo({
  email,
  nome,
  protocolo,
  tipo,
}: {
  email: string;
  nome: string;
  protocolo: string;
  tipo: string;
}) {
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `Manifestação registrada — Protocolo ${protocolo}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1351B4; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 20px;">Ouvidoria Digital</h1>
        </div>
        <div style="padding: 32px; background: #f8f8f8;">
          <p>Olá, <strong>${nome}</strong>!</p>
          <p>Sua manifestação do tipo <strong>${tipo}</strong> foi registrada com sucesso.</p>
          <div style="background: white; border-left: 4px solid #1351B4; padding: 16px; margin: 24px 0; border-radius: 4px;">
            <p style="margin: 0; font-size: 14px; color: #6B6B6B;">Número de protocolo</p>
            <p style="margin: 8px 0 0; font-size: 24px; font-weight: bold; color: #1351B4; letter-spacing: 2px;">${protocolo}</p>
          </div>
          <p>Guarde este número para acompanhar o andamento da sua manifestação.</p>
          <p>O prazo de resposta é de até <strong>20 dias úteis</strong>.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/consultar-protocolo?protocolo=${protocolo}"
             style="display: inline-block; background: #1351B4; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none; margin-top: 16px;">
            Acompanhar minha manifestação
          </a>
        </div>
        <div style="padding: 16px; text-align: center; font-size: 12px; color: #6B6B6B;">
          <p>Ministério do Desenvolvimento e Assistência Social, Família e Combate à Fome — MDS</p>
        </div>
      </div>
    `,
  });
}

export async function enviarEmailResposta({
  email,
  nome,
  protocolo,
  resposta,
}: {
  email: string;
  nome: string;
  protocolo: string;
  resposta: string;
}) {
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `Resposta à sua manifestação — Protocolo ${protocolo}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1351B4; padding: 24px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 20px;">Ouvidoria Digital</h1>
        </div>
        <div style="padding: 32px; background: #f8f8f8;">
          <p>Olá, <strong>${nome}</strong>!</p>
          <p>Sua manifestação de protocolo <strong>${protocolo}</strong> recebeu uma resposta:</p>
          <div style="background: white; border: 1px solid #CCCCCC; padding: 16px; margin: 24px 0; border-radius: 4px;">
            <p style="margin: 0; white-space: pre-wrap;">${resposta}</p>
          </div>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/consultar-protocolo?protocolo=${protocolo}"
             style="display: inline-block; background: #1351B4; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none;">
            Ver detalhes completos
          </a>
        </div>
      </div>
    `,
  });
}
