import React, { useEffect, useState } from 'react';
import { getLichSuByMaPhieuTL } from '../../api/lichSuPhieuTL';
import TimelinePage from './TimelinePage'; 

const TimelineComponent = ({ maPhieuTL }) => {
  const [lichSu, setLichSu] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLichSuByMaPhieuTL(maPhieuTL);
        setLichSu(data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, [maPhieuTL]);

  return (
    <div>
      <TimelinePage lichSu={lichSu} />
    </div>
  );
};

export default TimelineComponent;
