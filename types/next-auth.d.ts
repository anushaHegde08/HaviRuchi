import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      role: "user" | "admin";
    };
  }

  interface User {
    role: "user" | "admin";
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    role: "user" | "admin";
  }
}
