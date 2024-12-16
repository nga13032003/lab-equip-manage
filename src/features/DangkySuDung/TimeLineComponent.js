import React, { useEffect, useState } from 'react';
import { getLichSuByMaPhieuDK } from '../../api/lichSuPhieuDK';
import TimelinePage from './TimelinePage'; 

const TimelineComponentDK = ({ maPhieuDK }) => {
  const [lichSu, setLichSu] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLichSuByMaPhieuDK(maPhieuDK);
        setLichSu(data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, [maPhieuDK]);

  return (
    <div>
      <TimelinePage lichSu={lichSu} />
    </div>
  );
};

export default TimelineComponentDK;
