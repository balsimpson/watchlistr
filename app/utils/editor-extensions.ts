import { createAtomBlockMarkdownSpec, Node } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import CatalogNodeView from '~/components/editor/CatalogNodeView.vue'
import YouTubeNodeView from '~/components/editor/YouTubeNodeView.vue'

function parseMarkdownAttributes(attrString: string): Record<string, string | boolean> {
  const attributes: Record<string, string | boolean> = {}
  const attributePattern = /([a-zA-Z][\w-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s]+))/g

  for (const match of attrString.matchAll(attributePattern)) {
    const key = match[1]
    if (key) attributes[key] = match[2] ?? match[3] ?? match[4] ?? ''
  }

  const classMatches = attrString.match(/(?:^|\s)\.([\w-]+)/g)
  if (classMatches) attributes.class = classMatches.map((match) => match.trim().slice(1)).join(' ')

  const idMatch = attrString.match(/(?:^|\s)#([\w-]+)/)
  if (idMatch?.[1]) attributes.id = idMatch[1]

  const remaining = attrString
    .replace(attributePattern, ' ')
    .replace(/(?:^|\s)\.[\w-]+/g, ' ')
    .replace(/(?:^|\s)#[\w-]+/g, ' ')
    .trim()

  for (const attribute of remaining.split(/\s+/).filter(Boolean)) {
    if (/^[a-zA-Z][\w-]*$/.test(attribute)) attributes[attribute] = true
  }

  return attributes
}

function dataAttributes(node: { attrs: { payload?: string } }, type: string) {
  return {
    'data-watchlistr-node': type,
    'data-payload': node.attrs.payload || '',
  }
}

const youtubeMarkdown = createAtomBlockMarkdownSpec({
  nodeName: 'youtubeEmbed',
  name: 'watchlistr-youtube',
  parseAttributes: parseMarkdownAttributes,
  requiredAttributes: ['payload'],
  allowedAttributes: ['payload'],
})

const catalogMarkdown = createAtomBlockMarkdownSpec({
  nodeName: 'catalogCard',
  name: 'watchlistr-catalog',
  parseAttributes: parseMarkdownAttributes,
  requiredAttributes: ['payload'],
  allowedAttributes: ['payload'],
})

export const YouTubeEmbed: Node = Node.create({
  name: 'youtubeEmbed',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,
  isolating: true,
  addAttributes() {
    return { payload: { default: '' } }
  },
  parseHTML() {
    return [{
      tag: 'div[data-watchlistr-node="youtube"]',
      getAttrs: (element) => ({ payload: element.getAttribute('data-payload') || '' }),
    }]
  },
  renderHTML({ node }) {
    return ['div', dataAttributes(node, 'youtube')]
  },
  addNodeView() {
    return VueNodeViewRenderer(YouTubeNodeView)
  },
  ...youtubeMarkdown,
})

export const CatalogCard: Node = Node.create({
  name: 'catalogCard',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,
  isolating: true,
  addAttributes() {
    return { payload: { default: '' } }
  },
  parseHTML() {
    return [{
      tag: 'div[data-watchlistr-node="catalog"]',
      getAttrs: (element) => ({ payload: element.getAttribute('data-payload') || '' }),
    }]
  },
  renderHTML({ node }) {
    return ['div', dataAttributes(node, 'catalog')]
  },
  addNodeView() {
    return VueNodeViewRenderer(CatalogNodeView)
  },
  ...catalogMarkdown,
})

export const editorExtensions: Node[] = [YouTubeEmbed, CatalogCard]
