import { once, showUI } from '@create-figma-plugin/utilities';
import {
  CloseHandler,
  CreateHeaderHandler,
  CreateSectionHandler,
  CreateStepHandler,
  DesignNode
} from '../types';


let designNode: DesignNode[] = []
let currentParentId: string | null = null;



export default async function () {

  const storedHeaders = await figma.clientStorage.getAsync('designNode')
  if (storedHeaders) {
    designNode = storedHeaders
  }

  once<CreateSectionHandler>('CREATE_SECTION', async function (formData) {
    const section = createSection('');
    const figmaSection = figma.createSection()

    // Generate unique ID
    const id = `SEC-${Math.random().toString(36).substr(2, 9)}`

    const user = figma.currentUser as User;

    designNode.push(section);

    await updateStorage();


    // figma.currentPage.appendChild(figmaSection)
    // figma.currentPage.selection = [figmaSection]
    // figma.viewport.scrollAndZoomIntoView([figmaSection])

    figma.viewport.scrollAndZoomIntoView([figma.getNodeById(section.nodeId) as SceneNode]);

  })

  once<CreateHeaderHandler>('CREATE_HEADER', async ({ title, status }) => {
    if (!currentParentId) {
      figma.notify('Select a section first!');
      return;
    }
    const header = createHeader(title, status, currentParentId);
    await updateStorage();
    figma.viewport.scrollAndZoomIntoView([figma.getNodeById(header.nodeId) as SceneNode]);
  });


  once<CreateStepHandler>('CREATE_STEP', async ({ title }) => {
    if (!currentParentId) {
      figma.notify('Select a header first!');
      return;
    }
    const step = createStep(title, currentParentId);
    await updateStorage();
    figma.viewport.scrollAndZoomIntoView([figma.getNodeById(step.nodeId) as SceneNode]);
  });



  once<CloseHandler>('CLOSE', function () {
    figma.closePlugin()
  })

  showUI({
    height: 500,
    width: 340
  })
}







// Section Creator
function createSection(title: string): DesignNode {
  const section = figma.createSection();
  section.name = `SECTION: ${title}`;
  section.resizeWithoutConstraints(1200, 200);

  const node: DesignNode = {
    id: `SEC-${Date.now()}`,
    nodeId: section.id,
    title,
    type: 'SECTION',
    children: []
  };

  currentParentId = node.id; // Set current parent to the new section
  return node;
}

// Header Creator
function createHeader(title: string, status: string, parentId: string): DesignNode {
  const parentSection = designNode.find(n => n.id === parentId);
  if (!parentSection) throw new Error('Parent section not found');

  const headerFrame = figma.createFrame();
  headerFrame.name = `HEADER: ${title}`;
  headerFrame.resize(1000, 120);

  const node: DesignNode = {
    id: `HDR-${Date.now()}`,
    nodeId: headerFrame.id,
    title,
    type: 'HEADER',
    parentId,
    children: []
  };

  parentSection.children.push(node);
  currentParentId = node.id; // Set current parent to the new header
  return node;
}

// Step Creator
function createStep(title: string, parentId: string): DesignNode {
  const parentHeader = designNode.flatMap(n => n.children).find(n => n.id === parentId);
  if (!parentHeader) throw new Error('Parent header not found');

  const stepFrame = figma.createFrame();
  stepFrame.name = `STEP: ${title}`;
  stepFrame.resize(800, 80);

  const node: DesignNode = {
    id: `STP-${Date.now()}`,
    nodeId: stepFrame.id,
    title,
    type: 'STEP',
    parentId,
    children: []
  };

  parentHeader.children.push(node);
  return node;
}

// TOC Generator
async function createOrUpdateTOC() {
  const tocPage = figma.root.children.find(p => p.name === 'Table of Contents') || figma.createPage();
  tocPage.name = 'Table of Contents';

  const tocFrame = tocPage.children.find(f => f.name === 'TOC') as FrameNode || figma.createFrame();
  tocFrame.name = 'TOC';
  tocFrame.resize(1200, 800);
  tocFrame.layoutMode = 'VERTICAL';

  // Clear existing content
  tocFrame.children.forEach(child => child.remove());

  // Recursive TOC creation
  const createTOCEntry = (node: DesignNode, depth: number) => {
    const entry = figma.createText();
    entry.characters = `${'  '.repeat(depth)}${node.title}${node.status ? ` [${node.status}]` : ''}`;
    entry.fontSize = 24 - (depth * 4);
    entry.x = 40 + (depth * 40);
    entry.hyperlink = { type: 'NODE', value: node.nodeId };
    return entry;
  };

  const traverseTree = (nodes: DesignNode[], depth = 0) => {
    nodes.forEach(node => {
      tocFrame.appendChild(createTOCEntry(node, depth));
      if (node.children.length) traverseTree(node.children, depth + 1);
    });
  };

  traverseTree(designNode);
  figma.currentPage = tocPage;
}

// Helper function to update storage and TOC
async function updateStorage() {
  await figma.clientStorage.setAsync('designNode', designNode);
  await createOrUpdateTOC();
}