declare module "clipboard" {
  interface ClipboardEvent {
    success: boolean;
    text: string;
  }

  interface ClipboardJS {
    on(event: "success", callback: (e: ClipboardEvent) => void): this;
    on(event: "error", callback: (e: ClipboardEvent) => void): this;
    destroy(): void;
  }

  const ClipboardJS: {
    new (selector: string, options: { text: () => string }): ClipboardJS;
  };

  export = ClipboardJS;
}
