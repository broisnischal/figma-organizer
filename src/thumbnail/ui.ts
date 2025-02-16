async function createThumbnail(nodeId: string) {
    const node = figma.getNodeById(nodeId);
    if (node && 'exportAsync' in node) {
        return node.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: 0.5 } });
    }
}