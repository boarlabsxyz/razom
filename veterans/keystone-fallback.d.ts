/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
declare module '.keystone/types' {
  export namespace Lists {
    export namespace User {
      export type TypeInfo<Session = any> = any;
    }
    export namespace Initiative {
      export type TypeInfo<Session = any> = any;
    }
    export namespace Category {
      export type TypeInfo<Session = any> = any;
    }
    export namespace Source {
      export type TypeInfo<Session = any> = any;
    }
  }

  export type TypeInfo<Session = any> = {
    lists: typeof Lists;
    prisma: any;
    session: Session;
  };
}
