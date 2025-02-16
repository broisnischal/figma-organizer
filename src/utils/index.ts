import { DesignNode } from "../types";

export async function updateStorage(designNode?: DesignNode) {
    await figma.clientStorage.setAsync('designNode', designNode);
    // await createOrUpdateTOC();
}

export function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
    } : { r: 0, g: 0, b: 0 }
}