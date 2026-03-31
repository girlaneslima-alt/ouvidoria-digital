import type { Preview } from "@storybook/nextjs-vite";
import "../app/globals.css";

// Inject Raleway (Rawline fallback oficial GOV.BR) no Storybook
const link = document.createElement("link");
link.rel = "stylesheet";
link.href =
  "https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800&display=swap";
document.head.appendChild(link);

// Aplicar fonte padrão DSGOV ao body do Storybook
document.body.style.fontFamily = "Raleway, sans-serif";
document.body.style.fontSize = "14px";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "govbr-light",
      values: [
        { name: "govbr-light", value: "#f8f8f8" },
        { name: "white",       value: "#ffffff" },
        { name: "govbr-dark",  value: "#071d41" },
      ],
    },
    a11y: {
      test: "todo",
    },
    docs: {
      story: {
        iframeHeight: "auto",
      },
    },
  },
};

export default preview;