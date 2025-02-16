import { hexToRgb } from "."
import { statusColors } from "../constants"

export async function createStatusBadge(status: string): Promise<FrameNode> {
    // Type-safe status access
    const color = statusColors[status as keyof typeof statusColors] || '#CCCCCC'

    const badge = figma.createFrame()
    badge.resize(120, 32)
    badge.cornerRadius = 4
    badge.fills = [{ type: 'SOLID', color: hexToRgb(color) }]

    const statusText = figma.createText()
    await figma.loadFontAsync(statusText.fontName as FontName)
    statusText.characters = status.toUpperCase()
    statusText.fontSize = 12
    statusText.x = 8
    statusText.y = 8
    badge.appendChild(statusText)

    return badge
}