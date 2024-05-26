import {
  languages,
  Position,
  Hover,
  MarkdownString,
  Uri,
  type TextDocument,
  type ExtensionContext,
} from "vscode";
import { componentsMap } from "./componentsMap";
import { LANGUAGE_IDS, TAG_LINK_RE, TAG_BIG_CAMELIZE_RE } from "./constant";
import { envs, getWebTypesTags } from "./env";
import { uniq, kebabCase, bigCamelize } from "./utils";

export interface TableDataProp {
  name?: string;
  description?: string;
  defaultValue?: string;
}

export interface TableDataEvent {
  name?: string;
  description?: string;
}

export interface TableDataSlot {
  name?: string;
  description?: string;
}

export interface TableData {
  link: string;
  props: TableDataProp[];
  events: TableDataEvent[];
  slots: TableDataSlot[];
}

//component  like  'button'/'checkbox'
export function getComponentTableData(component: string) {
  const name = `vs-${component}`;
  const bigCamelName = bigCamelize(name);
  const tags = getWebTypesTags();
  const tag = tags.find((tag) => tag.name === name);
  const path = componentsMap[component].path;
  const documentation = `${envs().t("documentation")}${
    path ? `${path}.html` : ""
  }`;

  const link = `\
[Vuesax-alpha: ${bigCamelName} -> ${envs().t("linkText")}](${documentation})`;

  if (!tag) {
    return {
      link,
      props: [],
      events: [],
      slots: [],
    };
  }

  const props = tag.attributes.map((attr) => ({
    name: attr.name,
    description: attr.description,
    defaultValue: attr.default,
  }));

  const events = tag.events.map((event) => ({
    name: event.name,
    description: event.description,
  }));

  const slots =
    tag.slots?.map((slot) => ({
      name: slot.name,
      description: slot.description,
    })) ?? [];

  return {
    link,
    props,
    events,
    slots,
  };
}

//component  like  'button'/'checkbox'
export function getComponentTableTemplate(component: string) {
  const { link, props, events, slots } = getComponentTableData(component);

  const propsTable = props.length
    ? props.reduce(
        (propsTable, prop) => {
          propsTable += `| ${prop.name} &nbsp;| ${prop.description} &nbsp;| ${prop.defaultValue} &nbsp;| \n`;
          return propsTable;
        },
        `\
| ${envs().t("prop")} | ${envs().t("description")} | ${envs().t("default")} |
| :--- | :--- | :--- |
`
      )
    : "";

  const eventsTable = events.length
    ? events.reduce(
        (eventsTable, event) => {
          eventsTable += `| ${event.name} &nbsp;| ${event.description} &nbsp;| \n`;
          return eventsTable;
        },
        `\
| ${envs().t("event")} | ${envs().t("description")} |
| :--- | :--- |
`
      )
    : "";

  const slotsTable = slots.length
    ? slots.reduce(
        (slotsTable, slot) => {
          slotsTable += `| ${slot.name} &nbsp;| ${slot.description} &nbsp;| \n`;
          return slotsTable;
        },
        `\
| ${envs().t("slot")} | ${envs().t("description")} |
| :--- | :--- |
`
      )
    : "";

  return {
    link,
    propsTable,
    eventsTable,
    slotsTable,
  };
}

export function registerHover(context: ExtensionContext) {
  function provideHover(document: TextDocument, position: Position) {
    const line = document.lineAt(position);
    const linkComponents = line.text.match(TAG_LINK_RE) ?? [];
    const bigCamelizeComponents = line.text.match(TAG_BIG_CAMELIZE_RE) ?? [];
    const components = uniq([
      ...linkComponents,
      ...bigCamelizeComponents.map(kebabCase),
    ]) as string[];

    if (!components.length) {
      return;
    }

    const hoverContents = components
      .filter((component: string) => componentsMap[component])
      .map(getComponentTableTemplate)
      .reduce((hoverContents, item) => {
        const linkMarkdown = new MarkdownString(item.link);
        linkMarkdown.isTrusted = true;

        hoverContents.push(
          linkMarkdown,
          new MarkdownString(item.propsTable),
          new MarkdownString(item.eventsTable),
          new MarkdownString(item.slotsTable)
        );

        return hoverContents;
      }, [] as MarkdownString[]);

    return new Hover(hoverContents);
  }

  context.subscriptions.push(
    languages.registerHoverProvider(LANGUAGE_IDS, {
      provideHover,
    })
  );
}
