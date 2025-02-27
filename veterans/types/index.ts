export type AuthFormData = {
  email: string;
  password: string;
};

export type LoginFormData = AuthFormData;

export type RegisterFormData = AuthFormData & {
  name: string;
};
