declare global {
  interface Window {
    configAPI: {
      getConfig: () => Promise<{
        title: string;
        shortcuts: { keys: string; action: string }[];
      }>;
      setConfig: (newConfig: any) => Promise<void>;
      onConfigChange: (callback: () => void) => void;
    };
  }
}
