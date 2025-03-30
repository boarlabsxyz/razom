export type LoginFormData = {
  email: string;
  password: string;
};

export type RegisterFormData = LoginFormData & {
  name: string;
};

export interface Initiative {
  id: string;
  title: string;
  description?: {
    document: {
      type: string;
      children: Array<{
        text: string;
      }>;
    }[];
  };
  category?: {
    id: string;
    name: string;
  };
  source?: {
    id: string;
    name: string;
  };
  region?: {
    id: string;
    name: string;
  };
  status?: string;
}

export interface ProcessedInitiative {
  id: string;
  title: string;
  description: string;
  region: string;
  category: string;
  source: string;
  status: string;
}

export type Paragraph = {
  type: string;
  children: Child[];
};

export type Child = {
  text: string;
};

export type CorsCallback = (err: Error | null, allow?: boolean) => void;

export type CustomBaseItem = {
  [key: string]: unknown;
  id: {
    toString(): string;
  };
};
