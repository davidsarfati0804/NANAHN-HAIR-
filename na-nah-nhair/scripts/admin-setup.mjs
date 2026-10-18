// Génère les variables d'environnement du back-office.
// Usage : npm run admin:setup -- "mon mot de passe"
// Le mot de passe n'est jamais enregistré : seul son empreinte (hash) l'est.
import { randomBytes, scryptSync } from "node:crypto";

const password = process.argv[2];
if (!password || password.length < 12) {
  console.error("Donne un mot de passe d'au moins 12 caractères : npm run admin:setup -- \"mon mot de passe\"");
  process.exit(1);
}
const N = 32768, r = 8, p = 1;
const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64, { N, r, p, maxmem: 128 * N * r * 2 });
const B32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
let bits = "";
for (const b of randomBytes(20)) bits += b.toString(2).padStart(8, "0");
let totp = "";
for (let i = 0; i < bits.length; i += 5) totp += B32[parseInt(bits.slice(i, i + 5).padEnd(5, "0"), 2)];


console.log("\nÀ copier dans .env.local (en local) et dans Netlify > Site configuration > Environment variables :\n");
console.log(`ADMIN_PASSWORD_HASH=${["scrypt", N, r, p, salt.toString("base64"), hash.toString("base64")].join("$")}`);
console.log(`ADMIN_SESSION_SECRET=${randomBytes(32).toString("base64url")}`);
console.log(`ADMIN_TOTP_SECRET=${totp}`);
console.log("\nDouble authentification : dans Google Authenticator (ou équivalent), ajouter un compte avec la clé :");
console.log(`  ${totp}`);
console.log(`ou ce lien : otpauth://totp/NA%20NAH%20N'HAIR:admin?secret=${totp}&issuer=NA%20NAH%20N'HAIR\n`);
