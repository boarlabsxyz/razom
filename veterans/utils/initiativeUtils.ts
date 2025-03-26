import { Initiative, ProcessedInitiative, Paragraph, Child } from 'types';

export function getTextFromParagraph(paragraph: Paragraph): string {
  return paragraph.children.map((child: Child) => child.text).join(' ');
}

export function getDescription(description?: {
  document?: Paragraph[];
}): string {
  if (!description?.document) {
    return '';
  }
  return description.document.reduce((acc: string, paragraph: Paragraph) => {
    const text = getTextFromParagraph(paragraph);
    return acc ? `${acc}\n${text}` : text;
  }, '');
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
