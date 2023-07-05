// src/LuxContext.tsx
import React, {createContext, useContext, useEffect, useState} from 'react';
import {ProviderProps} from './ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LuxContextType {
  lux: number;
  setLux: React.Dispatch<React.SetStateAction<number>>;
  schedule: Schedule;
  setSchedule: React.Dispatch<React.SetStateAction<Schedule>>;
}

export type timeLux = {
  time: number;
  lux: number;
};

export type Schedule = {
  0: timeLux;
  1: timeLux;
  2: timeLux;
  3: timeLux;
};

export const checkSchedule = (schedule: Schedule): boolean => {
  let scheduleOk = false;
  Object.values(schedule).forEach(item => {
    item.lux !== 0 && item.time !== 0 && (scheduleOk = true);
  });
  return scheduleOk;
};

const LuxContext = createContext<LuxContextType | undefined>(undefined);

export const useLux = () => {
  const context = useContext(LuxContext);
  if (!context) {
    throw new Error('useLux must be used within a LuxProvider');
  }
  return context;
};

export const LuxProvider: React.FC<ProviderProps> = ({children}) => {
  const [lux, setLux] = useState<number>(0);
  const [schedule, setSchedule] = useState<Schedule>({
    0: {lux: 0, time: 0}, // Morning
    1: {lux: 0, time: 0}, // Day
    2: {lux: 0, time: 0}, // Evening
    3: {lux: 0, time: 0}, // Night
  });

  const getSchedule = async () => {
    try {
      const storedData = await AsyncStorage.getItem('schedule');
      console.log('storedData', storedData, JSON.parse(storedData));
      if (storedData) {
        setSchedule(JSON.parse(storedData));
      }
    } catch (error) {
      // Error retrieving data
      console.log(error);
    }
    return null;
  };

  const storeSchedule = async (s: Schedule) => {
    try {
      console.log('storing schedule: ', s);
      await AsyncStorage.setItem('schedule', JSON.stringify(s));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkSchedule(schedule) && storeSchedule(schedule);
  }, [schedule]);

  useEffect(() => {
    console.log('IS THIS REPEATING?');
    getSchedule();
  }, []);

  return (
    <LuxContext.Provider value={{lux, setLux, schedule, setSchedule}}>
      {children}
    </LuxContext.Provider>
  );
};
