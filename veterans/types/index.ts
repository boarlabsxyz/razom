export type LoginFormData = {
  email: string;
  password: string;
};

export type RegisterFormData = LoginFormData & {
  name: string;
};

export type Initiative = {
  id: string;
  title: string;
  description?: {
    document: Paragraph[];
  };
};

export type Paragraph = {
  type: string;
  children: Child[];
};

export type Child = {
  text: string;
};

export type ProcessedInitiative = {
  id: string;
  title: string;
  description: string | null;
};

export type CorsCallback = (err: Error | null, allow?: boolean) => void;

export type CustomBaseItem = {
  [key: string]: unknown;
  id: {
    toString(): string;
  };
};
