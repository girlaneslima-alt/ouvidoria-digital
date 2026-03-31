import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";

// Raleway é a fonte oficial de fallback do padrão GOV.BR (Rawline → Raleway → sans-serif)
// Rawline é a fonte primária do DSGOV mas não está disponível via Google Fonts;
// Raleway é visualmente idêntica e reconhecida como substituta oficial.
const rawline = Raleway({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ouvidoria Digital — MDS",
  description:
    "Portal de manifestações da Assistência Social. Registre, acompanhe e receba resposta sobre suas manifestações — tudo em um só lugar.",
  keywords: ["ouvidoria", "assistência social", "MDS", "manifestação", "cidadão"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${rawline.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        <Providers>
          {children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
