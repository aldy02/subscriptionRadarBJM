const bcrypt = require("bcrypt");

async function generateHash() {
  const password = "kania";
  const saltRounds = 10;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("Password asli :", password);
    console.log("Hasil hash    :", hashedPassword);
  } catch (err) {
    console.error("Gagal generate hash:", err);
  }
}

generateHash();
