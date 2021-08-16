import { config } from "dotenv";
config();

interface MyEnv {
  PORT: string;
  SECRET: string;
  MONGODB_URI: string;
}

const { PORT, SECRET, MONGODB_URI } = process.env as NodeJS.ProcessEnv & MyEnv;

export { PORT, SECRET, MONGODB_URI };
