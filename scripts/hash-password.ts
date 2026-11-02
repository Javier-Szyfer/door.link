// Prints an ADMIN_PASSWORD_HASH for a password read from stdin.
// Usage: bun run hash-password   (then type the password and press Enter)
import { createInterface } from "node:readline/promises";
import { hashPassword } from "../src/utils/auth.ts";

const rl = createInterface({ input: process.stdin, output: process.stderr });
const password = await rl.question("Password: ");
rl.close();

if (password.length < 12) {
  console.error("Use at least 12 characters; a 4-5 word phrase is best.");
  process.exit(1);
}

console.log(await hashPassword(password));
