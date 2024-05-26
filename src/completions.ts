import {
  languages,
  Range,
  CompletionItem,
  CompletionItemKind,
  TextDocument,
  Position,
  MarkdownString,
  type ExtensionContext,
  type CompletionItemProvider,
} from "vscode";
import { componentsMap, type ComponentDescriptor } from "./componentsMap";
import { kebabCase, bigCamelize, isString } from "./utils";
import { ATTR_RE, LANGUAGE_IDS, PROP_NAME_RE } from "./constant";
import { getWebTypesTags, envs } from "./env";

export function shouldDisableProvide(
  document: TextDocument,
  position: Position
) {
  if (document.languageId !== "vue") {
    return false;
  }

  const offset = document.offsetAt(position);

  const lastText = document.getText().substring(offset);
  const inAttrRange = lastText.indexOf(">") < lastText.indexOf("<");
  const inTemplate = lastText.includes("</template>");

  return inAttrRange && inTemplate;
}

export interface AttrProviderOptions {
  props: boolean;
  events: boolean;
}

export function registerCompletions(context: ExtensionContext) {
  const componentsProvider: CompletionItemProvider = {
    provideCompletionItems(document: TextDocument, position: Position) {
      if (shouldDisableProvide(document, position)) {
        return null;
      }

      const completionItems: CompletionItem[] = [];

      Object.keys(componentsMap).forEach((key) => {
        const name = `vs-${key}`;
        completionItems.push(
          new CompletionItem(name, CompletionItemKind.Field),
          new CompletionItem(bigCamelize(name), CompletionItemKind.Field)
        );
      });

      return completionItems;
    },

    resolveCompletionItem(item: CompletionItem) {
      const name = kebabCase(item.label as string).slice(3);
      const descriptor: ComponentDescriptor = componentsMap[name];
      const attrText = descriptor.attrs ? " " + descriptor.attrs.join(" ") : "";
      const tagSuffix = descriptor.closeSelf ? "" : `</${item.label}>`;
      const characterDelta =
        -tagSuffix.length + (descriptor.characterDelta ?? 0);
      console.log("characterDelta", characterDelta);
      item.insertText = `<${item.label}${attrText}`;
      item.insertText += descriptor.closeSelf ? "/>" : `>${tagSuffix}`;
      item.command = {
        title: "vuesax-alpha.move-cursor",
        command: "vuesax-alpha.move-cursor",
        arguments: [characterDelta],
      };

      return item;
    },
  };

  const attrProvider: CompletionItemProvider = {
    provideCompletionItems(document: TextDocument, position: Position) {
      const text = document.getText(
        new Range(
          new Position(0, 0),
          new Position(position.line, position.character)
        )
      );
      const offset = document.offsetAt(position);
      const lastText = document.getText().substring(offset);
      const nextCharacter = lastText.charAt(0);

      if (
        nextCharacter !== " " &&
        nextCharacter !== "\n" &&
        nextCharacter !== "/" &&
        nextCharacter !== ">"
      ) {
        return null;
      }

      if (!Array.from(text.matchAll(ATTR_RE)).length) {
        return null;
      }

      let name: string;
      let matchedValue: string;
      let startIndex = 0;

      // eslint-disable-next-line no-restricted-syntax
      for (const matched of text.matchAll(ATTR_RE)) {
        name = kebabCase(matched[1] ?? matched[2]);
        matchedValue = matched[0];
        startIndex = matched.index!;
      }

      const currentIndex = text.length;
      const endIndex = startIndex! + matchedValue!.length;

      if (currentIndex > endIndex || currentIndex < startIndex!) {
        return null;
      }

      const tags = getWebTypesTags();
      const tag = tags.find((tag) => tag.name === name);

      if (!tag) {
        return null;
      }

      const words = matchedValue!.split(" ");
      const lastWord = words[words.length - 1];
      const hasAt = lastWord.startsWith("@");
      const hasColon = lastWord.startsWith(":");

      const events = tag.events.map((event) => {
        const item = new CompletionItem(
          {
            label: `@${event.name}`,
            description: event.description,
          },
          CompletionItemKind.Event
        );

        item.filterText = event.name;
        item.documentation = new MarkdownString(`\
**Event**: ${event.name}

**Description**: ${event.description}`);
        item.insertText = hasAt ? event.name : `@${event.name}`;

        return item;
      });

      const props = tag.attributes.map((attr) => {
        const item = new CompletionItem(
          {
            label: attr.name,
            description: attr.description,
          },
          CompletionItemKind.Value
        );

        item.sortText = "0";

        item.documentation = new MarkdownString(`\
**Prop**: ${attr.name}

**Description**: ${attr.description}

**Type**: ${attr.value.type}

**Default**: ${attr.default}`);

        item.insertText = attr.name;

        return item;
      });

      return [...(hasAt ? [] : props), ...(hasColon ? [] : events)];
    },

    resolveCompletionItem(item: CompletionItem) {
      if (!isString(item.label)) {
        item.command = {
          title: "vuesax-alpha.move-cursor",
          command: "vuesax-alpha.move-cursor",
          arguments: [-1],
        };
        item.insertText = `${item.insertText}=""`;
      }

      return item;
    },
  };

  context.subscriptions.push(
    languages.registerCompletionItemProvider(LANGUAGE_IDS, componentsProvider)
  );
  context.subscriptions.push(
    languages.registerCompletionItemProvider(
      LANGUAGE_IDS,
      attrProvider,
      " ",
      "@",
      ":"
    )
  );
}
