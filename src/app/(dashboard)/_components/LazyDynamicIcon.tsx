import dynamic from "next/dynamic";
import React, {CSSProperties} from "react";
import iconMapping, {IconName} from "@/app/lib/iconMapping";
import {MdInsertEmoticon} from "react-icons/md";

interface DynamicIconProps {
    className?: string;
    icon: IconName;
    style?: CSSProperties;
}

// Lazy load icons dynamically
const LazyIcon = ({icon, ...props}: { icon: IconName } & Omit<DynamicIconProps, "icon">) => {
    const IconComponent = dynamic(() => Promise.resolve(iconMapping[icon]), {ssr: true});

    return <IconComponent {...props} />;
};

const DynamicIcon: React.FC<DynamicIconProps> = ({className, icon, style}) => {
    if (!(icon in iconMapping)) {
        console.warn(`Icon "${icon}" not found in mapping!`, {
            receivedIcon: icon,
            availableIcons: Object.keys(iconMapping),
        });
        return <MdInsertEmoticon className={className} style={style} />;
    }

    return <LazyIcon icon={icon} className={className} style={style}/>;
};

export default DynamicIcon;
