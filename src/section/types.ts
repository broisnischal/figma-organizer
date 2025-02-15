import { EventHandler } from '@create-figma-plugin/utilities';

export interface PluginFormData {
  title: string;
  description: string;
  headerBackground: string | null;
  isVerified: boolean;
  status: string;
  link: string;
}
//  note, created At, last updated At, updated By, todos

// create the section header, it should not be in auto layout, and add the first header component for the section, with certain style
// create the Sub header for the section
// steps for the sub header!!


export interface CreateRectanglesHandler {
  name: 'CREATE_SECTION_HEADER'
  handler: (formData: PluginFormData) => void
}

export interface CloseHandler extends EventHandler {
  name: 'CLOSE'
  handler: () => void
}


export interface HeaderData {
  id: string;
  nodeId: string;
  title: string;
  status: string;
}