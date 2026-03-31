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
        { name: "govbr-light", value: "#F8F8F8" },
        { name: "white", value: "#FFFFFF" },
        { name: "govbr-dark", value: "#071D41" },
      ],
    },
    a11y: {
      test: "todo",
    },
  },
};

export default preview;