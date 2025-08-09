// src/app.d.ts
declare global {
  namespace App {
    // interface Error {}
    interface Locals {
      user: import("@prisma/client").User | null;
    }
    // interface PageData {}
    // interface Platform {}
  }
}

export {};
