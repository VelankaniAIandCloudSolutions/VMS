const { generateSecret } = require("jose");

async function generateHS512Key() {
  const secret = await generateSecret("HS512");
  const secretBuffer = await secret.export(); // Export the key as a Buffer
  console.log(secretBuffer.toString("base64")); // Convert the Buffer to a base64 string
}

generateHS512Key();
