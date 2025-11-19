import { database, passwordUtils } from "./database";

/**
 * Seeds the demo account in the database
 * This should be run once to create the demo account
 */
export const seedDemoAccount = async () => {
  const DEMO_ACCOUNT = {
    email: "hi@mijanul.in",
    password: "Demo@123",
    firstName: "Demo",
    lastName: "User",
    phoneNumber: "+917797979756",
  };

  try {
    // Check if demo account already exists
    const existingUser = await database.getUserByEmail(DEMO_ACCOUNT.email);

    if (existingUser) {
      console.log("✅ Demo account already exists");
      return {
        success: true,
        message: "Demo account already exists",
        email: DEMO_ACCOUNT.email,
      };
    }

    // Hash the password
    const hashedPassword = await passwordUtils.hashPassword(
      DEMO_ACCOUNT.password
    );

    // Create demo account
    const timestamp = Date.now();
    await database.saveUser({
      email: DEMO_ACCOUNT.email,
      firstName: DEMO_ACCOUNT.firstName,
      lastName: DEMO_ACCOUNT.lastName,
      phoneNumber: DEMO_ACCOUNT.phoneNumber,
      password: hashedPassword,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    console.log("✅ Demo account created successfully");
    console.log("📧 Email:", DEMO_ACCOUNT.email);
    console.log("🔑 Password:", DEMO_ACCOUNT.password);

    return {
      success: true,
      message: "Demo account created successfully",
      email: DEMO_ACCOUNT.email,
      password: DEMO_ACCOUNT.password,
    };
  } catch (error) {
    console.error("❌ Error seeding demo account:", error);
    throw error;
  }
};

/**
 * Removes the demo account from the database
 */
export const removeDemoAccount = async () => {
  const DEMO_EMAIL = "hi@mijanul.in";

  try {
    const existingUser = await database.getUserByEmail(DEMO_EMAIL);

    if (!existingUser) {
      console.log("ℹ️ Demo account does not exist");
      return {
        success: true,
        message: "Demo account does not exist",
      };
    }

    await database.deleteUser(DEMO_EMAIL);
    console.log("✅ Demo account removed successfully");

    return {
      success: true,
      message: "Demo account removed successfully",
    };
  } catch (error) {
    console.error("❌ Error removing demo account:", error);
    throw error;
  }
};
