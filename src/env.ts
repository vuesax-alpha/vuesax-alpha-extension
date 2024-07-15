import enWebTypes from "vuesax-alpha/web-types.en-US.json";
import { HtmlTag } from "./webType";

export function getWebTypesTags(): HtmlTag[] {
  return enWebTypes.contributions.html.tags;
}

const defaultOrigin = "https://vuesax-alpha.vercel.app/components";

export function envs() {
  const texts = {
    "zh-CN": {
      documentation: defaultOrigin,
      linkWebviewText: "查看组件文档 (VSCode Webview)",
      linkText: "查看组件文档 (外部浏览器)",
      prop: "属性",
      event: "事件",
      slot: "插槽",
      description: "描述",
      default: "默认值",
    },
    "en-US": {
      documentation: defaultOrigin,
      linkWebviewText:
        "Watch the documentation of the component (VSCode Webview)",
      linkText: "Watch the documentation of the component",
      prop: "Prop",
      event: "Event",
      slot: "Slot",
      description: "Description",
      default: "Default",
    },
  };

  const t = (key: keyof (typeof texts)["zh-CN"]) => texts["en-US"][key];

  return {
    t,
  };
}
