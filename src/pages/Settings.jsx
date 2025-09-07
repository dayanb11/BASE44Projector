
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Building, Briefcase, Building2, ListTodo, Users2, FileSignature } from 'lucide-react';

import EmployeeAuth from "../components/auth/EmployeeAuth";

const settingsOptions = [
  {
    title: 'עובדים',
    description: 'ניהול רשימת העובדים',
    icon: <Users className="w-8 h-8 text-blue-500" />,
    link: createPageUrl('ManageEmployees'),
  },
  {
    title: 'אגפים',
    description: 'ניהול אגפי הארגון',
    icon: <Building2 className="w-8 h-8 text-green-500" />,
    link: createPageUrl('ManageDivisions'),
  },
  {
    title: 'מחלקות',
    description: 'ניהול מחלקות הארגון',
    icon: <Building className="w-8 h-8 text-purple-500" />,
    link: createPageUrl('ManageDepartments'),
  },
  {
    title: 'תחומי רכש',
    description: 'ניהול תחומי הרכש',
    icon: <Briefcase className="w-8 h-8 text-orange-500" />,
    link: createPageUrl('ManageDomains'),
  },
  {
    title: 'צוותי רכש',
    description: 'ניהול צוותי הרכש',
    icon: <Users2 className="w-8 h-8 text-indigo-500" />,
    link: createPageUrl('ManageProcurementTeams'),
  },
  {
    title: 'פעילויות רכש',
    description: 'ניהול מאגר פעילויות הרכש',
    icon: <ListTodo className="w-8 h-8 text-red-500" />,
    link: createPageUrl('ManageActivityPool'),
  },
  {
    title: 'סוגי התקשרות',
    description: 'ניהול תהליכים וסוגי התקשרות',
    icon: <FileSignature className="w-8 h-8 text-cyan-500" />,
    link: createPageUrl('ManageEngagementTypes'),
  },
];

const SettingsCard = ({ title, description, icon, link }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <div className="flex items-center gap-4">
        {icon}
        <div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <Link to={link}>
        <Button className="w-full" variant="outline">
          <ArrowLeft className="w-4 h-4 ml-2" />
          ניהול טבלה
        </Button>
      </Link>
    </CardContent>
  </Card>
);

export default function SettingsPage() {
  const [currentEmployee, setCurrentEmployee] = useState(null);

  useEffect(() => {
    const storedEmployee = sessionStorage.getItem("currentEmployee");
    if (storedEmployee) {
      setCurrentEmployee(JSON.parse(storedEmployee));
    } else {
      setCurrentEmployee(null);
    }
  }, []);

  const handleEmployeeLogin = (employee) => {
    setCurrentEmployee(employee);
  };

  // אם אין עובד מחובר, הצג מסך התחברות
  if (!currentEmployee) {
    return <EmployeeAuth onSuccess={handleEmployeeLogin} />;
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <h1 className="text-3xl font-bold text-gray-900">הגדרות מערכת</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsOptions.map((option) => (
          <SettingsCard key={option.title} {...option} />
        ))}
      </div>
    </div>
  );
}
