import type { Initiative } from '../keystone/models/Initiative';

export interface ProcessedInitiative {
  id: string;
  title: string;
  description: string;
  region: string;
  category: string;
  source: string;
  status: string;
}

export function processInitiatives(data?: {
  initiatives: Initiative[];
}): ProcessedInitiative[] {
  if (!data?.initiatives) {
    return [];
  }

  return data.initiatives.map(processInitiative);
}

export function getDescription(description?: {
  document?: Array<{
    type: string;
    children?: Array<{
      text?: string;
    }>;
  }>;
}): string {
  if (!description?.document) {
    return '';
  }

  return description.document
    .map((block) =>
      block.children
        ?.map((child) => child.text ?? '')
        .join('')
        .trim(),
    )
    .filter(Boolean)
    .join('\n');
}

export function processInitiative(initiative: Initiative): ProcessedInitiative {
  return {
    id: initiative.id,
    title: initiative.name,
    description: getDescription(initiative.initiativeDescription),
    region: initiative.region?.name ?? '',
    category: initiative.category?.name ?? '',
    source: initiative.source?.name ?? '',
    status: initiative.status ?? '',
  };
}
