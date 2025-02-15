import { EventHandler } from '@create-figma-plugin/utilities';

export interface PluginFormData {
  title: string;
  description: string;
  headerBackground: string | null;
  isVerified: boolean;
  status: string;
  link: string;
}

export interface CreateRectanglesHandler {
  name: 'CREATE_RECTANGLES'
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