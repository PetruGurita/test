import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import { SiOpenstreetmap } from 'react-icons/si';

export const SidebarData = [
  {
    title: 'Search',
    path: '/',
    icon: <FaIcons.FaSearch />,
    cName: 'nav-text'
  },
  {
    title: 'Weather Map',
    path: '/weatherMap',
    icon: <SiOpenstreetmap />,
    cName: 'nav-text'
  },
  {
    title: 'Covid Map',
    path: '/covidMap',
    icon: <FaIcons.FaNotesMedical />,
    cName: 'nav-text'
  },
];