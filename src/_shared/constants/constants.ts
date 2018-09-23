import {ModuleModel} from "../../_models/others.model";

export const languages = [
  {
    name: 'Mixed',
    shortName: 'mixed',
    middleName: 'mixed'
  },
  {
    name: 'English',
    shortName: 'en',
    middleName: 'en-US'
  },
  {
    name: 'Russian',
    shortName: 'ru',
    middleName: 'ru-RU'
  }
];

export const chooseNumbersOfWordsForTest = [
  'Module',
  '10',
  '20',
  '30',
  '40',
  '50',
  '60',
  '70',
  '80',
  '90',
  '100'
];

export const pauseBetweenWordsList = [
  0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5
];

export const doughnutChartOptions: any = {
  responsive: true,
  cutoutPercentage: 50,
  legend: false,
  circumference: 2 * Math.PI,
  responsiveAnimationDuration: 800,
  animation: {}
};

export const doughnutChartColors = [
  {
    backgroundColor: ['#bbe172', '#ff5a37', 'blue'],
    pointBorderColor: 'rgba(0,0,0,1)',
  }
];
