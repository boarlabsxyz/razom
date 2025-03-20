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

function extractTextFromDocument(document?: Paragraph[]): string | null {
  if (!document) {
    return null;
  }

  return document
    .map((paragraph) =>
      paragraph.children.map((child: Child) => child.text).join(' '),
    )
    .join('\n');
}
