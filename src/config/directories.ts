// src/config/directories.ts
import { Building, Facebook, Globe, Mail, Phone } from 'lucide-react';

// Main Regional Office
export const regionalOffice = {
  name: 'DOST-SEI CALABARZON (Scholarship Unit)',
  icon: Building,
  contacts: [
    { type: 'Phone', value: '(049) 536-5013' },
    { type: 'Email', value: 'scholarships.dost4a@gmail.com' },
    {
      type: 'Address',
      value: 'Jamboree Rd, Brgy. Timugan, Los Baños, Laguna',
    },
  ],
};

// Main Regional SAO
export const regionalSao = {
  name: 'CALABARZON Regional Patriots Council',
  icon: Facebook,
  contact: {
    type: 'Facebook',
    value: 'https://www.facebook.com/DOST.RPC4A',
  },
};

// Per-Province Directories (PSTO + SAOs)
export const provincialDirectories = [
  {
    province: 'Cavite',
    psto: {
      name: 'PSTO Cavite',
      icon: Building,
      contacts: [
        { type: 'Phone', value: '(046) 419-2085' },
        { type: 'Email', value: 'cavite.dost4a@gmail.com' },
        { type: 'Address', value: 'Gen. Trias Dr, Trece Martires City, Cavite' },
      ],
    },
    sao: [
      {
        name: "TUP - Cavite DOST Scholars' Association",
        icon: Facebook,
        contact: {
          type: 'Facebook',
          value: 'https://www.facebook.com/tupc.dost.sa',
        },
      },
      {
        name: "Cavite State University - DOST Scholars' Association",
        icon: Facebook,
        contact: {
          type: 'Facebook',
          value: 'https://www.facebook.com/cvsudostscholars',
        },
      },
      {
        name: 'DLSU Dasma - USG - Department of Science and Technology',
        icon: Globe,
        contact: { type: 'Not Provided', value: 'No link provided.' },
      },
    ],
  },
  {
    province: 'Laguna',
    psto: {
      name: 'PSTO Laguna',
      icon: Building,
      contacts: [
        { type: 'Phone', value: '(049) 502-0210' },
        { type: 'Email', value: 'laguna.dost4a@gmail.com' },
        { type: 'Address', value: 'UPLB Campus, Los Baños, Laguna' },
      ],
    },
    sao: [
      {
        name: "LSPU - Sta. Cruz - DOST-SEI Scholars' Guild",
        icon: Facebook,
        contact: {
          type: 'Facebook',
          value: 'https://www.facebook.com/dostssg.lspuscc',
        },
      },
      {
        name: "LSPU - San Pablo - DOST Scholars' Association",
        icon: Facebook,
        contact: {
          type: 'Facebook',
          value: 'https://www.facebook.com/DOSTScholarsAssociationLSPUSPCC',
        },
      },
      {
        name: "Letran Calamba DOST Scholars' Society",
        icon: Facebook,
        contact: {
          type: 'Facebook',
          value: 'https://www.facebook.com/letrancalambadostss',
        },
      },
      {
        name: "UPLB DOST Scholars' Society",
        icon: Facebook,
        contact: {
          type: 'Facebook',
          value: 'https://www.facebook.com/uplbdostss1985',
        },
      },
    ],
  },
  {
    province: 'Batangas',
    psto: {
      name: 'PSTO Batangas',
      icon: Building,
      contacts: [
        { type: 'Phone', value: '(043) 723-4604' },
        { type: 'Email', value: 'batangas.dost4a@gmail.com' },
        { type: 'Address', value: 'Capitol Site, Batangas City' },
      ],
    },
    sao: [
      {
        name: 'Society of DOST-SEI Scholars - PUP Sto. Tomas',
        icon: Facebook,
        contact: {
          type: 'Facebook',
          value: 'https://www.facebook.com/pupstcSDSS',
        },
      },
      {
        name: 'Association of DOST-SEI Scholars - BatStateU TNEU - Alangilan',
        icon: Facebook,
        contact: {
          type: 'Facebook',
          value: 'https://www.facebook.com/ADSSBatStateU',
        },
      },
      {
        name: 'University of Batangas - League of DOST Scholars',
        icon: Facebook,
        contact: {
          type: 'Facebook',
          value: 'https://www.facebook.com/profile.php?id=61565099248437',
        },
      },
    ],
  },
  {
    province: 'Rizal',
    psto: {
      name: 'PSTO Rizal',
      icon: Building,
      contacts: [
        { type: 'Phone', value: '(02) 8 256-7876' },
        { type: 'Email', value: 'rizal.dost4a@gmail.com' },
        { type: 'Address', value: '2nd Flr, Marassat Bldg, Antipolo, Rizal' },
      ],
    },
    sao: [
      {
        name: "University of Rizal System - DOST Scholars' Society",
        icon: Facebook,
        contact: {
          type: 'Facebook',
          value: 'https://www.facebook.com/URS.DOST.SS',
        },
      },
    ],
  },
  {
    province: 'Quezon',
    psto: {
      name: 'PSTO Quezon',
      icon: Building,
      contacts: [
        { type: 'Phone', value: '(042) 710-3121' },
        { type: 'Email', value: 'quezon.dost4a@gmail.com' },
        { type: 'Address', value: '2/F B-Tech Bldg, Talipan, Pagbilao, Quezon' },
      ],
    },
    sao: [
      {
        name: "Manuel S. Enverga University Foundation - DOST Scholars' Guild",
        icon: Globe,
        contact: { type: 'Not Provided', value: 'No link provided.' },
      },
      {
        name: "Southern Luzon State University - DOST Scholars' Alliance",
        icon: Facebook,
        contact: {
          type: 'Facebook',
          value: 'https://www.facebook.com/profile.php?id=61566042040911',
        },
      },
      {
        name: 'Alliance of DOST Scholars - PUP - Lopez Campus',
        icon: Facebook,
        contact: {
          type: 'Facebook',
          value: 'https://www.facebook.com/profile.php?id=61567856351405',
        },
      },
    ],
  },
];