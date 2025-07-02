import { db } from "@/drizzle/db";
import { UserNotificationSettingsTable } from "@/drizzle/schema";

export const insertUserNotificationSettings = async (
  settings: typeof UserNotificationSettingsTable.$inferInsert
) => {
  await db
    .insert(UserNotificationSettingsTable)
    .values(settings)
    .onConflictDoNothing();
};
