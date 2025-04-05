'use client';

import React from 'react';
import {useSidebar} from "@/components/ui/sidebar";
import CustomIconButton from "@/app/(dashboard)/_components/topbar/CustomIconButton";
import {PanelLeftClose, PanelLeftOpen} from "lucide-react";

const CustomSideBarTrigger = () => {
    const {toggleSidebar, state} = useSidebar();

    return (
        <CustomIconButton icon={state === 'expanded' ? PanelLeftClose : PanelLeftOpen} onClick={toggleSidebar} iconSize={18}/>
    );
};

export default CustomSideBarTrigger;