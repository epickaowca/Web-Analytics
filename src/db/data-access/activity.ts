"use server";
import { db } from "../constants";

export const getActivityGtePeriod = async (
  projectName: string,
  period: Date
) => {
  const data = await db.project.findUnique({
    where: {
      name: projectName,
    },
    select: {
      activity: { where: { createdAt: { gte: period } } },
    },
  });

  if (data == null) throw new Error("project not found");

  return data;
};