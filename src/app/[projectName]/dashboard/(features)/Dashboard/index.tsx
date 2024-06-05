import React, { FC, Suspense } from "react";
import { ActivityGraph } from "../../(features)/ActivityGraph";
import { ActivityList } from "../../(features)/ActivityList";
import { PrismaClient } from "@prisma/client";
import {
  Period,
  generateArr,
  oneDay,
  oneHour,
  PERIODS_AGO,
} from "../../constants";
import { mapHelperFunc } from "./utils";
import style from "../../styles.module.scss";

const db = new PrismaClient();

type DashboardProps = {
  params: { projectName: string };
  searchParams: { analyticPeriod: string | undefined };
};

export const Dashboard: FC<DashboardProps> = async ({
  params,
  searchParams: { analyticPeriod = "7" },
}) => {
  if (!PERIODS_AGO[analyticPeriod as Period]) analyticPeriod = "7";
  const period: Period = analyticPeriod as Period;
  const isHour = period === "24";

  const project = await db.project.findUnique({
    where: { name: params.projectName },
  });

  const analytic = await db.analytic.findMany({
    where: {
      projectId: project?.id,
      createdAt: {
        gte: PERIODS_AGO[period],
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const countriesArr = mapHelperFunc(analytic, "country");
  const browsersArr = mapHelperFunc(analytic, "browser");
  const OSArr = mapHelperFunc(analytic, "OS");

  const MyActivityArray = generateArr(period);
  const newVisitors = MyActivityArray.map((item) => {
    let visitors = 0;
    const divider = isHour ? oneHour : oneDay;
    const { x, y } = item;
    const time = x.getTime();
    const min = time - divider / 2;
    const max = time + divider / 2 + 1;
    analytic.forEach((analyticItem) => {
      const analyticTime = analyticItem.createdAt.getTime();
      if (analyticTime > min && analyticTime < max) {
        visitors++;
      }
    });
    return { x, y: visitors };
  });

  return (
    <Suspense fallback={<h1 style={{ color: "white" }}>Loading...</h1>}>
      <ActivityGraph data={newVisitors} clockType={isHour ? "hours" : "days"} />
      <div className={style.ActivityListContainer}>
        <ActivityList title="Countries" list={countriesArr} />
        <ActivityList title="Browsers" list={browsersArr} />
        <ActivityList title="Operating Systems" list={OSArr} />
      </div>
    </Suspense>
  );
};
