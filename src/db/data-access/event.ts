"use server";
import { db } from "../constants";

export type EventWithLabels = Awaited<ReturnType<typeof getEvents>>[0];

export const getEvent = async (eventName: string) => {
  return await db.event.findUnique({ where: { name: eventName } });
};

export const createEvent = async (eventName: string, projectName: string) => {
  return await db.event.create({ data: { name: eventName, projectName } });
};

export const createLabel = async (label: string, eventName: string) => {
  return await db.eventLabel.create({
    data: { name: label, eventName },
  });
};

export const getEvents = async (
  projectName: string,
  currentPeriod: Date,
  onePeriodAgo: Date
) => {
  const [currentPeriodData, onePeriodAgoData] = await db.$transaction([
    db.project.findUnique({
      where: {
        name: projectName,
      },

      include: {
        events: {
          include: {
            labels: {
              where: { createdAt: { gte: currentPeriod } },
              orderBy: { createdAt: "desc" },
            },
          },
        },
      },
    }),
    db.event.findMany({
      where: {
        projectName,
      },
      include: {
        labels: {
          where: { createdAt: { gte: onePeriodAgo, lt: currentPeriod } },
        },
      },
    }),
  ]);

  if (currentPeriodData == null) throw new Error("project not found");

  const myData = currentPeriodData.events.map((e, index) => {
    const onePeriodAgoE = onePeriodAgoData[index];

    return { ...e, labelsOnePeriodAgo: onePeriodAgoE.labels };
  });

  return myData;
};
