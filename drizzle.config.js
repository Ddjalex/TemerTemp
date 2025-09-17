const { defineConfig } = require("drizzle-kit");

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is required");
}

module.exports = defineConfig({
  out: "./migrations",
  schema: "./shared/schema.js", 
  dialect: "postgresql", // Will be removed since we're switching to MongoDB
  dbCredentials: {
    url: process.env.MONGODB_URI,
  },
});