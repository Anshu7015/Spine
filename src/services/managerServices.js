import manager from "../models/manager.js";

//This is kind of a helper function, which is used to generate the managerPassword 
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
export async function managerApproved(){

    try {
       const lastUser = await manager.findOne(
      {},
      {},
      { sort: { MID: -1 } }
    ); //Sort in descending order to get the last MID, -1 means des and 1 means asc
    const lastId = lastUser ? parseInt(lastUser.MID.replace("SpineManager", "")) : 0;
    const managerId = `SpineManager${String(lastId + 1).padStart(3, "0")}`;
    const managerPassword = generatePassword({
      length: 10,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: false,
    });

    return {
      managerId,
      managerPassword
    };
    
  } catch (error) {
    console.error("Error generating MID:", error);
  }    
};