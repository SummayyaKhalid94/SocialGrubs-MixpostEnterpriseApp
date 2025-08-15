// resources/js/Extensions/Bidirectional.js
import { Extension } from '@tiptap/core'
import { Plugin } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

function detectDirection(text) {
    const rtlPattern = /[\u0600-\u06FF\u0750-\u077F\u0590-\u05FF]/
    return rtlPattern.test(text) ? 'rtl' : 'ltr'
}

export const Bidirectional = Extension.create({
    name: 'Bidirectional',

    addProseMirrorPlugins() {
        return [
            new Plugin({
                props: {
                    decorations(state) {
                        const { doc } = state
                        const decorations = []

                        doc.descendants((node, pos) => {
                            if (node.isTextblock) {
                                const dir = detectDirection(node.textContent)
                                decorations.push(
                                    Decoration.node(pos, pos + node.nodeSize, { dir })
                                )
                            }
                        })

                        return DecorationSet.create(doc, decorations)
                    }
                }
            })
        ]
    }
})
