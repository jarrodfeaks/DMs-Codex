import { visit } from "unist-util-visit";
import {Literal, Node, Paragraph, Text} from "mdast";

type Plugin = (options?: any) => (tree: Node) => void;

declare module "mdast" {
    interface RootContentMap {
        citation: Citation;
    }
    interface PhrasingContentMap {
        citation: Citation;
    }
}

interface Citation extends Literal {
    type: "citation";
}
// plugin to render citations in markdown content
const remarkCitations: Plugin = () => {
    return (tree) => {
        const nodesToReplace: { node: Node; newNodes: Array<Text | Citation> }[] = [];

        visit(tree, 'text', (node: Text) => {
            const regex = /【(.*?)】/g;
            const originalText = node.value;
            let match;
            let lastIndex = 0;
            const newNodes: Array<Text | Citation> = [];

            while ((match = regex.exec(originalText)) !== null) {
                const beforeText = originalText.slice(lastIndex, match.index);
                const citationText = match[1];

                if (beforeText) newNodes.push({ type: 'text', value: beforeText });

                newNodes.push({
                    type: 'citation',
                    data: { hName: 'citation' },
                    value: citationText
                });

                lastIndex = match.index + match[0].length;
            }

            const afterText = originalText.slice(lastIndex);
            if (afterText) newNodes.push({ type: 'text', value: afterText });

            if (newNodes.length > 0) {
                nodesToReplace.push({ node, newNodes });
            }
        });

        for (const { node, newNodes } of nodesToReplace) {
            node.type = 'paragraph';
            (node as Paragraph).children = newNodes;
        }
    };
};

export default remarkCitations;
