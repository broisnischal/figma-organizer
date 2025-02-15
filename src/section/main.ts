import { once, showUI } from '@create-figma-plugin/utilities'
import {
  CloseHandler,
  CreateRectanglesHandler,
  HeaderData
} from './types'

let headers: HeaderData[] = []

export default async function () {

  const storedHeaders = await figma.clientStorage.getAsync('headers')
  if (storedHeaders) {
    headers = storedHeaders
  }

  once<CreateRectanglesHandler>('CREATE_SECTION_HEADER', async function (formData) {
    const { title, description, status, link, headerBackground, isVerified } = formData
    const headerFrame = figma.createFrame()

    // Generate unique ID
    const id = `SEC-${Math.random().toString(36).substr(2, 9)}`

    // Set up frame properties

    const viewportBounds = figma.viewport.bounds
    headerFrame.x = viewportBounds.x + (viewportBounds.width - headerFrame.width) / 2
    headerFrame.y = viewportBounds.y + (viewportBounds.height - headerFrame.height) / 2

    headerFrame.name = `${title} - ${id}`
    headerFrame.resize(1200, 200)
    headerFrame.layoutMode = 'VERTICAL'
    headerFrame.itemSpacing = 16
    headerFrame.paddingLeft = 40
    headerFrame.paddingRight = 40
    headerFrame.paddingTop = 40
    headerFrame.paddingBottom = 40

    // Create background rectangle
    // const background = figma.createRectangle()
    // background.resize(headerFrame.width, headerFrame.height)
    // background.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.95, b: 0.95 } }]
    // headerFrame.appendChild(background)

    // Create title text
    const titleText = figma.createText()
    await figma.loadFontAsync(titleText.fontName as FontName)
    titleText.characters = title
    titleText.fontSize = 32
    // titleText.fontName = { family: 'Inter', style: 'Bold' } // Set font weight via fontName

    // Create description text
    const descText = figma.createText()
    await figma.loadFontAsync(descText.fontName as FontName)
    descText.characters = description
    descText.fontSize = 16
    descText.opacity = 0.8

    // Create status badge
    const statusBadge = await createStatusBadge(status)

    // Create ID and link container
    const metaContainer = figma.createFrame()
    metaContainer.layoutMode = 'HORIZONTAL'
    metaContainer.primaryAxisSizingMode = 'AUTO'
    metaContainer.counterAxisSizingMode = 'AUTO'
    metaContainer.itemSpacing = 16

    const idText = figma.createText()
    await figma.loadFontAsync(idText.fontName as FontName)
    idText.characters = `ID: ${id}`
    idText.fontSize = 12

    const linkText = figma.createText()
    await figma.loadFontAsync(linkText.fontName as FontName)
    linkText.characters = link || 'No link provided'
    linkText.fontSize = 12
    linkText.textDecoration = 'UNDERLINE'

    // Add elements to frame
    metaContainer.appendChild(idText)
    metaContainer.appendChild(linkText)

    headerFrame.appendChild(titleText)
    headerFrame.appendChild(descText)
    headerFrame.appendChild(statusBadge)
    headerFrame.appendChild(metaContainer)

    // Store header data for TOC
    headers.push({
      id,
      nodeId: headerFrame.id,
      title,
      status
    })

    await figma.clientStorage.setAsync('headers', headers)


    if (headerBackground) {
      headerFrame.fills = [{ type: 'SOLID', color: hexToRgb(headerBackground) }]
    }

    if (isVerified) {
      const verifiedBadge = figma.createFrame()
      verifiedBadge.resize(32, 32)
      verifiedBadge.cornerRadius = 4
      verifiedBadge.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.95, b: 0.95 } }]
      headerFrame.appendChild(verifiedBadge)
    }

    figma.currentPage.appendChild(headerFrame)

    figma.currentPage.selection = [headerFrame]
    figma.viewport.scrollAndZoomIntoView([headerFrame])

    await createOrUpdateTOC()
  })

  once<CloseHandler>('CLOSE', function () {
    figma.closePlugin()
  })

  showUI({
    height: 500,
    width: 340
  })
}

async function createStatusBadge(status: string): Promise<FrameNode> {
  const statusColors = {
    inprogress: '#FFD700',
    done: '#00FF00',
    idea: '#ADD8E6',
    shipped: '#008000',
    disclosed: '#800080'
  } as const // Add const assertion

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

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : { r: 0, g: 0, b: 0 }
}

// Add TOC generation handler
once<{ name: 'GENERATE_TOC'; handler: () => void }>(
  'GENERATE_TOC',
  async function () {
    const tocPage = figma.createPage()
    tocPage.name = "Table of Contents"

    const tocFrame = figma.createFrame()
    tocFrame.resize(1200, 800)
    tocFrame.name = "TOC"

    let yPosition = 40

    for (const header of headers) {
      const entry = figma.createText()
      await figma.loadFontAsync(entry.fontName as FontName)
      entry.characters = `${header.title} [${header.status}]`
      entry.fontSize = 24
      entry.x = 40
      entry.y = yPosition
      entry.hyperlink = { type: 'NODE', value: header.nodeId }
      tocFrame.appendChild(entry)
      yPosition += 60
    }

    tocPage.appendChild(tocFrame)
    // figma.currentPage = tocPage
  }
)


async function createOrUpdateTOC() {
  // Find or create TOC page
  let tocPage = figma.root.children.find(page => page.name === "Table of Contents")
  if (!tocPage) {
    tocPage = figma.createPage()
    tocPage.name = "Table of Contents"
  }

  // Find or create TOC frame
  let tocFrame = tocPage.children.find(node => node.name === "TOC") as FrameNode
  if (!tocFrame) {
    tocFrame = figma.createFrame()
    tocFrame.name = "TOC"
    tocFrame.resize(1200, 800)
    tocPage.appendChild(tocFrame)
  } else {
    // Clear existing TOC entries 
    tocFrame.children.forEach(child => child.remove())
  }

  // Create new TOC entries
  let yPosition = 40
  for (const header of headers) {
    const entry = figma.createText()
    await figma.loadFontAsync(entry.fontName as FontName)
    entry.characters = `${header.title} [${header.status}]`
    entry.fontSize = 24
    entry.x = 40
    entry.y = yPosition
    entry.hyperlink = { type: 'NODE', value: header.nodeId }
    tocFrame.appendChild(entry)
    yPosition += 60
  }

  // Switch to TOC page after update
  // figma.currentPage = tocPage
}