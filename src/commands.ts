import { commands, window, Selection, type ExtensionContext } from "vscode";

export function registerCommands(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand(
      "vuesax-alpha.move-cursor",
      (characterDelta: number) => {
        const active = window.activeTextEditor!.selection.active!;
        const position = active.translate({ characterDelta });
        window.activeTextEditor!.selection = new Selection(position, position);
      }
    )
  );
}
