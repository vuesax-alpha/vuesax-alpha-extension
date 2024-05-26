import { type ExtensionContext } from "vscode";
import { registerHover } from "./hover";
import { registerCompletions } from "./completions";
import { registerCommands } from "./commands";

export function activate(context: ExtensionContext) {
  registerCommands(context);
  registerCompletions(context);
  registerHover(context);
}

export function deactivate() {}
