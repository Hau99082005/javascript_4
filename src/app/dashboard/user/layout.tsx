"use client";

import User from '@/components/dashboard/user/user';
import React from 'react';

export default function AdminLayout({children}: {children: React.ReactNode}) {
    return(
    <>
    <User>
     {children}
    </User>
    </>
    );
}