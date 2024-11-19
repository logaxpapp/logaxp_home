// src/types/resourcePayloads.ts

import { ResourceType, IResource } from './resourceTypes';

export interface CreateResourcePayload {
  title: string;
  type: ResourceType;
  content: string;
  images: string[]; // Array of image URLs
  tags: string[]; // Array of tag names
}

export interface UpdateResourcePayload {
  id: string;
  title: string;
  type: ResourceType;
  content: string;
  images: string[]; // Array of image URLs
  tags: string[]; // Array of tag names
}
