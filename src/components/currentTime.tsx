"use client"

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { enUS } from 'date-fns/locale';

interface CurrentTimeProps {
  type?: string;
}

const CurrentTime = ({ type }: CurrentTimeProps) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const dateTime = format(currentDateTime, 'EEEE, h:mm:ss a', { locale: enUS });
  const date = format(currentDateTime, 'MMMM do, yyyy', { locale: enUS });

  return (
    <>
      {type === "dateTime" &&
        <div className="text-white hidden lg:block ">
          <p>{dateTime}</p>
        </div>
      }
      {type === "date" &&
      <div className="text-white flex justify-center lg:justify-end">
        <div className="hidden lg:block">
          <p>{date}</p>
        </div>
      </div>
      }
    </>
  )
}
export default CurrentTime;