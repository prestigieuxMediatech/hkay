// test-hash.mjs  (run with: node test-hash.mjs)
import bcrypt from "bcryptjs"

const password = "admin@hkay@(2026)"
const hashFromDB = "$2b$12$r.TZV21cIKgoOdLjJwKMruqCCrI8p5BbEQ9Pd5tPwLZUJXKk6FcyC"

const isMatch = await bcrypt.compare(password, hashFromDB)
console.log("Match:", isMatch)

// Also generate a fresh correct hash
const freshHash = await bcrypt.hash(password, 12)
console.log("Fresh hash:", freshHash)