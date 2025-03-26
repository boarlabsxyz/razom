import { Initiative, ProcessedInitiative, Paragraph, Child } from 'types';

export function processInitiatives(data?: {
  initiatives: Initiative[];
}): ProcessedInitiative[] {
  if (!data?.initiatives) {
    return [];
  }

  return data.initiatives.map(({ id, title, description }) => ({
    id,
    title,
    description: extractTextFromDocument(description?.document) ?? null,
  }));
}

export function getDescription(description?: {
  document?: Paragraph[];
}): string {
  if (!description?.document) {
    return '';
  }

export function processInitiative(initiative: Initiative): ProcessedInitiative {
  return {
    id: initiative.id,
    title: initiative.name,
    description: getDescription(initiative.initiativeDescription),
    region: initiative.region?.name || '',
    category: initiative.category?.name || '',
    source: initiative.source?.name || '',
    status: initiative.status || '',
  };
}
