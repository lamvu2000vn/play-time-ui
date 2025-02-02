import {randomBytes} from "crypto";

export const generateRandomString = (size: number = 20): string => randomBytes(size).toString("hex").slice(0, size);
