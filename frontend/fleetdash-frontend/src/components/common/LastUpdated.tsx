import { useEffect, useState } from "react";

function LastUpdated() {

  const [time, setTime] = useState("");

  useEffect(() => {

    const interval = setInterval(() => {

      setTime(new Date().toLocaleTimeString());

    }, 1000);

    return () => clearInterval(interval);

  }, []);

  return (

    <p className="text-sm text-gray-500">

      Last Updated : {time}

    </p>

  );

}

export default LastUpdated;