// import { designNode } from "../section/main";
// import { DesignNode } from "../types";

// // TOC Generator
// export async function createOrUpdateTOC() {
//     const tocPage = figma.root.children.find(p => p.name === 'Table of Contents') || figma.createPage();
//     tocPage.name = 'Table of Contents';

//     const tocFrame = tocPage.children.find(f => f.name === 'TOC') as FrameNode || figma.createFrame();
//     tocFrame.name = 'TOC';
//     tocFrame.resize(1200, 800);
//     tocFrame.layoutMode = 'VERTICAL';

//     // Clear existing content
//     tocFrame.children.forEach(child => child.remove());

//     // Recursive TOC creation
//     const createTOCEntry = (node: DesignNode, depth: number) => {
//         const entry = figma.createText();
//         entry.characters = `${'  '.repeat(depth)}${node.title}${node.status ? ` [${node.status}]` : ''}`;
//         entry.fontSize = 24 - (depth * 4);
//         entry.x = 40 + (depth * 40);
//         entry.hyperlink = { type: 'NODE', value: node.nodeId };
//         return entry;
//     };

//     const traverseTree = (nodes: DesignNode[], depth = 0) => {
//         nodes.forEach(node => {
//             tocFrame.appendChild(createTOCEntry(node, depth));
//             if (node.children.length) traverseTree(node.children, depth + 1);
//         });
//     };

//     traverseTree(designNode);
//     // figma.currentPage = tocPage;
// }
