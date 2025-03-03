export type LoginFormData = {
  email: string;
  password: string;
};

export type RegisterFormData = LoginFormData & {
  name: string;
};
