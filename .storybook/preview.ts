import type { Preview } from "@storybook/nextjs-vite";
import "../app/globals.css";

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
        { name: "govbr-light",  value: "#f8f8f8" },
        { name: "white",        value: "#ffffff"  },
        { name: "govbr-blue",   value: "#1351b4"  },
        { name: "govbr-dark",   value: "#071d41"  },
      ],
    },
    docs: {
      toc: true, // Table of contents na sidebar
    },
    options: {
      storySort: {
        order: [
          "Introdução",
          "Design System",
          ["Tokens de Cor", "Tipografia", "Botões", "Componentes"],
        ],
      },
    },
  },
};

export default preview;
