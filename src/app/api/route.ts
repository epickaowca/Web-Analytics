import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import data from "moment-timezone/data/meta/latest.json";
import { getBrowser, getOS } from "./utils";
const { countries, zones } = data;

const db = new PrismaClient();

type CountryObj = { [key in keyof typeof zones]: string };
let countryObj: CountryObj = {} as CountryObj;
Object.values(zones).forEach((value) => {
  const { name } = value;
  // @ts-ignore
  countryObj[name] = countries[value.countries[0]].name;
});
let i = 0;

const allowedOrigins = process.env.CORS?.split(",");

export async function GET(request: NextRequest) {
  try {
    const project = await db.project.findMany();

    return NextResponse.json({ project });
  } catch (error: any) {
    return NextResponse.json({ message: error.message });
  }
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const isCorsDisabled = allowedOrigins === undefined;
  const isCorsAllowAll = allowedOrigins?.includes("*");
  const isOriginAllowed = origin && allowedOrigins?.includes(origin);

  if (!isCorsAllowAll || isCorsDisabled || isOriginAllowed) {
    return sendResponse(400, { message: "origin not allowed" });
  }

  const userAgent = request.headers.get("user-agent") || "unknown";
  const browser = getBrowser(userAgent);
  const OS = getOS(userAgent);

  try {
    const { userTimeZone, projectName } = await request.json();

    // @ts-ignore
    const country = countryObj[userTimeZone] || "unknown";
    const project = await db.project.findUnique({
      where: { name: projectName },
    });
    if (!project) return sendResponse(404, { message: "project not found" });

    const analytic = await db.analytic.create({
      data: { browser, country, OS, projectId: project.id },
    });

    return sendResponse(200, { analytic });
  } catch (error: any) {
    return sendResponse(400, { message: error.message });
  }
}

const sendResponse = (status: number, message: any) => {
  return new Response(JSON.stringify(message), {
    status: status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    },
  });
};