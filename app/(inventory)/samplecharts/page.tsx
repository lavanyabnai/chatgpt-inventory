import React from 'react';
import { Achart } from '@/app/(inventory)/samplecharts/area';
import { Bchart } from '@/app/(inventory)/samplecharts/bar';
import { Bcharts } from '@/app/(inventory)/samplecharts/barschart';
import { Lchart } from '@/app/(inventory)/samplecharts/linechart';
import { Pchart } from '@/app/(inventory)/samplecharts/piechart';
import { Rchart } from '@/app/(inventory)/samplecharts/radialchart';
import { Rcharts } from '@/app/(inventory)/samplecharts/radorchart';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RiToolsLine } from 'react-icons/ri';
import { GiDatabase } from 'react-icons/gi';
import { FaRegLightbulb } from 'react-icons/fa';
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
const invData = [
  {
    name: 'On Hand Balance',
    value: '$8.46B',
    chart: <Achart />,
    progress:84.6
  },
  {
    name: 'Avg Inventory Valuation',
    value: '$233.57M',
    chart: <Bchart />,
    progress:23
  },
  {
    name: 'MAPE',
    value: '24%',
    chart: <Lchart />,
    progress:24
  },
  {
    name: 'Unit Cost',
    value: '$52.37K',
    chart: <Pchart />,
    progrss:100

  },
  {
    name: 'Resource Cost',
    value: '$24.94M',
    chart: <Rchart />,
    progress:25
  },
  {
    name: 'Overhead Cost',
    value: '$2.74M',
    chart: <Rcharts />,
    progress:3
  },
  {
    name: 'Material Cost',
    value: '$4.17B',
    chart: <Bcharts />,
    progress: 10
  }
];

export default function page() {
  return (
    <div>
        <div className='h-[200px] w-[400px]'>
        <Achart/>
        </div>
      <div className="w-full grid grid-cols-4 gap-4 p-8 text-start font-bold ">
        {invData.map((inv) => (
          <Card key={inv.name} className="w-full  ">
            <CardHeader>
            <CardDescription >{inv.name}</CardDescription>
              <CardTitle className="text-blue-900 text-4xl flex flex-row  ">
                {inv.value}
                <Progress value={inv.progress} className='w-[100px] ml-40' />
              </CardTitle>
            </CardHeader>
            <CardContent className='h-[300px]'>{inv.chart}</CardContent>
            <Separator />
            <CardFooter className="mt-6 flex justify-between">
              <Button className="  hover:bg-sky-700 ">
                <RiToolsLine />
                Analyze
              </Button>
              <Button className=" hover:bg-sky-700 ">
                <GiDatabase />
                Explore Data
              </Button>
              <Button className=" hover:bg-sky-700 ">
                <FaRegLightbulb />
                Insights
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
