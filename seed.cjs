// 🔥 Import the Firebase Admin SDK
const admin = require("firebase-admin");

// 🚀 Initialize the Firebase app using default credentials
// (this works if you’ve authenticated via Firebase CLI)
admin.initializeApp({
  credential: admin.credential.cert(require("./serviceAccountKey.json")),
});
console.log("Seeding to project:", admin.app().options.credential.projectId);


// 📚 Get a reference to Firestore
const db = admin.firestore();

// 🔁 This async function will run our data creation logic
async function seedDatabase() {
  try {
    // 👉 STEP 1: Create a sample user (consultant)
    const userId = "consultant_001";
    const userRef = db.collection("users").doc(userId);
    await userRef.set({
      name: "John Smith",
      email: "john@agency.com",
      subscriptionPlan: "pro",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 👉 STEP 2: Create some sample clients (buyers, sellers, etc.)
    const clients = [
      {
        name: "Laura Mendes",
        email: "laura@example.com",
        roles: ["buyer", "investor"],
        phone: "+351912345678",
        notes: "Looking for properties near Porto.",
      },
      {
        name: "Carlos Oliveira",
        email: "carlos@example.com",
        roles: ["seller"],
        phone: "+351912222222",
        notes: "Wants to sell his T2 apartment.",
      },
    ];

    for (const client of clients) {
      await userRef.collection("clients").add({
        ...client,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    // 👉 STEP 3: Add a business deal (e.g., a property purchase)
    const dealRef = await userRef.collection("deals").add({
      clientId: "sample-client-id", // you can manually link later
      type: "purchase", // or 'sale', 'rental'
      status: "proposal", // stage in funnel
      property: "Rua das Flores 128",
      value: 250000,
      ltv: 1, // 1 successful transaction so far
      notes: "Client offered 240k",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 👉 STEP 4: Create a follow-up task
    await userRef.collection("tasks").add({
      title: "Call Laura to follow up",
      clientName: "Laura Mendes",
      type: "follow-up", // or 'visit', 'reminder'
      dueDate: new Date("2025-08-06"),
      completed: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 👉 STEP 5: Set user-specific settings
    await userRef.collection("settings").doc("preferences").set({
      notifications: {
        birthdays: true,
        deedDates: true,
        followUps: true,
      },
      funnelStages: {
        buyers: ["cold", "qualified", "visit", "proposal", "cpcv", "deed", "lost"],
        sellers: ["contacted", "visit", "CMI", "visits", "offers", "cpcv", "deed", "cancelled"],
      },
    });

    console.log("✅ CRM seed data added successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
}

// 🚀 Run the seeding function
seedDatabase();
