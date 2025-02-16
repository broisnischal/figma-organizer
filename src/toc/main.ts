import { DesignNode } from "../types";

export class TableOfContents {
    private tocPage: PageNode;
    public tocFrame: FrameNode;

    constructor() {
        // Find or create the TOC page
        this.tocPage = figma.root.children.find(p => p.name === 'Table of Contents') || figma.createPage();
        this.tocPage.name = 'Table of Contents';

        // Find or create the TOC frame
        this.tocFrame = this.tocPage.children.find(f => f.name === 'TOC') as FrameNode || figma.createFrame();
        this.tocFrame.name = 'TOC';
        this.tocFrame.resize(1200, 800);
        this.tocFrame.layoutMode = 'VERTICAL';
        this.tocFrame.paddingLeft = 40;
        this.tocFrame.paddingRight = 40;
        this.tocFrame.paddingTop = 40;
        this.tocFrame.paddingBottom = 40;
        this.tocFrame.itemSpacing = 16;

        // Ensure the TOC frame is in the TOC page
        if (!this.tocPage.children.includes(this.tocFrame)) {
            this.tocPage.appendChild(this.tocFrame);
        }
    }

    // Clear the TOC
    clear() {
        this.tocFrame.children.forEach(child => child.remove());
    }

    // Add a section or header to the TOC
    // Fixed addEntry method
    async addEntry(node: DesignNode, depth: number) {
        const entry = figma.createText();

        // Load font before manipulating text
        await figma.loadFontAsync(entry.fontName as FontName);

        // Fixed indentation (removed 'testing' string)
        entry.characters = `${'  '.repeat(depth)}${node.title}${node.status ? ` [${node.status}]` : ''}`;
        entry.fontSize = 24 - (depth * 4);

        // Remove manual positioning and use auto-layout
        entry.textAutoResize = 'HEIGHT'; // Allow text wrapping

        // Set hyperlink
        entry.hyperlink = { type: 'NODE', value: node.nodeId };

        this.tocFrame.appendChild(entry);
    }

    // Recursively generate the TOC
    async generate(designNode: DesignNode[], depth = 0) {
        for (const node of designNode) {
            if (node.type === 'SECTION' || node.type === 'HEADER') {
                await this.addEntry(node, depth); // Wait for text creation
            }
            if (node.type === 'SECTION' && node.children.length) {
                await this.generate(node.children, depth + 1); // Recursive await
            }
        }
    }

    // Delete an entry by nodeId
    // deleteEntry(nodeId: string) {
    //     const entry = this.tocFrame.children.find(child => {
    //         const textNode = child as TextNode;
    //         return textNode.hyperlink?.value === nodeId;
    //     });

    //     if (entry) {
    //         entry.remove();
    //     }
    // }

    // Append a new section to the TOC
    appendSection(section: DesignNode) {
        this.addEntry(section, 0);
    }

    // Append a new header to the TOC under a section
    appendHeader(header: DesignNode, sectionId: string) {
        const sectionEntry = this.tocFrame.children.find(child => {
            const textNode = child as TextNode;
            return textNode.hyperlink?.valueOf() === sectionId;
        });

        if (sectionEntry) {
            const depth = 1; // Headers are indented under sections
            this.addEntry(header, depth);
        }
    }

    // Switch to the TOC page
    show() {
        figma.currentPage = this.tocPage;
    }
}