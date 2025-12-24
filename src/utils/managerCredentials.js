import manager from "../models/manager.js";

//This is kind of a helper function, which is used to generate the password 
function generatePassword(options) {
  const { length, uppercase, lowercase, numbers, symbols } = options;

  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numbersChars = "0123456789";
  const symbolsChars = "!@#$%^&*()_+{}[]<>?/";

  let characters = "";
  let password = "";

  if (uppercase) characters += uppercaseChars;
  if (lowercase) characters += lowercaseChars;
  if (numbers) characters += numbersChars;
  if (symbols) characters += symbolsChars;

  if (!characters) {
    throw new Error("At least one character type must be selected");
  }

  if (!length || length <= 0) {
    throw new Error("Invalid password length");
  }

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }

  return password;
};


//1.Manager MID and Password Generating function (When approved by manager!!)
export async function managerApproved() {
  try {
    const lastUser = await manager.findOne(
      { MID: { $exists: true, $ne: null } }, // 👈 CRITICAL FIX
      {},
      { sort: { MID: -1 } }
    );

    let lastId = 0;

    if (lastUser?.MID) {
      lastId = parseInt(lastUser.MID.replace("SpineManager", ""), 10);
    }

    const MID = `SpineManager${String(lastId + 1).padStart(3, "0")}`;

    const password = generatePassword({
      length: 10,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: false,
    });

    return { MID, password };
  } catch (error) {
    console.error("Error generating MID:", error);
    throw error; // 👈 NEVER silently fail
  }
};