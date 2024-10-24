import express from "express";
import { User } from "../../entities/User";

declare global {
  namespace Express {
    export interface Request {
      user?: Partial<User>
    }
  }
}