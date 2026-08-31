import { type ReactNode, useEffect, useRef } from "react";
import { useSiteLanguage } from "../siteLanguage";
import { translateSiteText } from "../siteTranslations";

const textSources = new WeakMap<Text, string>();
const lastTranslatedTexts = new WeakMap<Text, string>();
const attributeSources = new WeakMap<Element, Map<string, string>>();
const lastTranslatedAttributes = new WeakMap<Element, Map<string, string>>();
const translatedAttributes = ["aria-label", "title", "placeholder", "alt"] as const;

function translateTextNode(node: Text, language: ReturnType<typeof useSiteLanguage>) {
  const current = node.nodeValue ?? "";
  const previousSource = textSources.get(node);
  const previousTranslation = lastTranslatedTexts.get(node);
  const source = previousSource && current === previousTranslation ? previousSource : current;
  textSources.set(node, source);
  const normalized = source.replace(/\s+/g, " ").trim();
  if (!normalized) return;

  const leading = source.match(/^\s*/)?.[0] ?? "";
  const trailing = source.match(/\s*$/)?.[0] ?? "";
  const translated = translateSiteText(normalized, language);
  const next = `${leading}${translated}${trailing}`;
  lastTranslatedTexts.set(node, next);
  if (current !== next) node.nodeValue = next;
}

function translateElementAttributes(element: Element, language: ReturnType<typeof useSiteLanguage>) {
  let sources = attributeSources.get(element);
  if (!sources) {
    sources = new Map();
    attributeSources.set(element, sources);
  }

  let translations = lastTranslatedAttributes.get(element);
  if (!translations) {
    translations = new Map();
    lastTranslatedAttributes.set(element, translations);
  }

  for (const attribute of translatedAttributes) {
    const current = element.getAttribute(attribute);
    if (!current) continue;
    // Same rule as the text nodes: the cached source only stands while the
    // attribute still holds what we last wrote. Anything else means the
    // component rendered its own value for this language, and that value is
    // the source now — otherwise we would overwrite a component that already
    // translates itself with the stale first-render string.
    const previousSource = sources.get(attribute);
    const previousTranslation = translations.get(attribute);
    const source = previousSource !== undefined && current === previousTranslation ? previousSource : current;
    sources.set(attribute, source);
    const translated = translateSiteText(source, language);
    translations.set(attribute, translated);
    if (current !== translated) element.setAttribute(attribute, translated);
  }
}

function translateTree(root: Node, language: ReturnType<typeof useSiteLanguage>) {
  if (root.nodeType === Node.TEXT_NODE) {
    translateTextNode(root as Text, language);
    return;
  }

  if (root.nodeType !== Node.ELEMENT_NODE) return;
  const element = root as Element;
  translateElementAttributes(element, language);

  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  let node = walker.nextNode();
  while (node) {
    if (node.nodeType === Node.TEXT_NODE) translateTextNode(node as Text, language);
    else translateElementAttributes(node as Element, language);
    node = walker.nextNode();
  }
}

export function LocalizationBoundary({ children }: { children: ReactNode }) {
  const language = useSiteLanguage();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    translateTree(root, language);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") translateTree(mutation.target, language);
        for (const node of mutation.addedNodes) translateTree(node, language);
      }
    });

    observer.observe(root, { childList: true, characterData: true, subtree: true });
    return () => observer.disconnect();
  }, [language]);

  return <div ref={rootRef} style={{ display: "contents" }}>{children}</div>;
}
