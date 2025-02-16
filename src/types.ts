import { Status } from './constants';

export type NodeType = 'SECTION' | 'HEADER' | 'STEP';

export interface DesignNode {
  id: string;
  nodeId: string;
  parentId?: string;
  title: string;
  description?: string;
  status?: Status;
  link?: string;
  headerBackground?: string;
  isVerified?: boolean;
  createdAt?: string;
  lastUpdatedAt?: string;
  updatedBy?: User;
  type: NodeType;
  children: DesignNode[];
}


//  note, created At, last updated At, updated By, todos

// create the section header, it should not be in auto layout, and add the first header component for the section, with certain style
// create the Sub header for the section
// steps for the sub header!!


export interface CreateSectionHandler {
  name: 'CREATE_SECTION';
  handler: (formData: { title: string }) => void;
}

export interface CreateHeaderHandler {
  name: 'CREATE_HEADER';
  handler: (formData: { title: string; status: string }) => void;
}

export interface CreateStepHandler {
  name: 'CREATE_STEP';
  handler: (formData: { title: string }) => void;
}

export interface CloseHandler {
  name: 'CLOSE';
  handler: () => void;
}

