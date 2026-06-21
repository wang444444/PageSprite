import { useEffect } from "react";
import Layout from "./components/Layout";
import SettingsDialog from "./components/SettingsDialog";
import { useChatStore, startAutoPersist, loadSavedWorkspace } from "./stores/chatStore";
import { setFontAwesomeCSS } from "./utils/code";
import type { Language, Theme } from "./types";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

function App() {
  const updateSettings = useChatStore((s) => s.updateSettings);
  const settings = useChatStore((s) => s.settings);

  // Load persisted settings and workspace on startup
  useEffect(() => {
    (async () => {
      try {
        const raw = await window.electronAPI.settings.load();
        updateSettings({
          endpoint: raw.endpoint,
          apiKey: raw.api_key,
          model: raw.model,
          systemPrompt: raw.system_prompt,
          agentType: (raw.agent_type as any) || "streaming",
          agentCommand: raw.agent_command ?? undefined,
          agentArgsTemplate: raw.agent_args_template ?? undefined,
          language: (raw.language as Language) || "zh",
          theme: (raw.theme as Theme) || "light",
        });

      } catch {
        // Use defaults
      }

      // Load Font Awesome CSS from main process (base64-embedded, no network needed)
      try {
        const faCSS = await window.electronAPI.assets.getFontAwesomeCSS();
        if (faCSS) setFontAwesomeCSS(faCSS);
      } catch {
        // Font Awesome not available — proceed without it
      }

      // Load saved workspace (annotations, messages, etc.)
      await loadSavedWorkspace();

      // Start auto-persisting workspace on every change
      startAutoPersist();
    })();
  }, [updateSettings]);

  // Apply theme whenever it changes
  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  return (
    <>
      <Layout />
      <SettingsDialog />
    </>
  );
}

export default App;
