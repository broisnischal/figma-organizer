export function setupAutoLayout(node: FrameNode) {
    node.layoutMode = 'VERTICAL';
    node.primaryAxisSizingMode = 'AUTO';
    node.counterAxisSizingMode = 'AUTO';
    // node.padding = { top: 20, right: 20, bottom: 20, left: 20 };
    node.itemSpacing = 10;
} 