"use client"

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import {
    Clock,
    LayoutDashboard,
    Package,
    Shield,
    Users,
    UserPen,
    ChevronRight,
    CircleDollarSign,
    Info
} from "lucide-react"
import {Role} from '@prisma/client';
import {SidebarItem} from "@/app/lib/definitions";
import {usePathname} from "next/navigation";

export const DoctorLinks: SidebarItem[] = [
    {
        type: "link",
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        isActive: false,
    },
    {
        type: "link",
        title: "Patients",
        url: "/patients",
        icon: Users,
        isActive: false,
    },
    {
        type: "link",
        title: "Daily Income",
        url: "/income-by-patients",
        icon: CircleDollarSign,
        isActive: false,
    },
    {
        type: "expandable",
        title: "Queue",
        initiallyExpanded: true,
        icon: Clock,
        items: [
            {
                type: "link",
                title: "Active queue",
                url: "/queue/active",
                isActive: false,
            },
            {
                type: "link",
                title: "All queues",
                url: "/queue",
                isActive: false,
            }
        ]
    },
    {
        type: "expandable",
        title: "Inventory",
        icon: Package,
        initiallyExpanded: true,
        items: [
            {
                type: "link",
                title: "Drug Stock",
                url: "/inventory/all-drugs",
                isActive: false,
            },
            {
                type: "link",
                title: "Drug Buffers",
                url: "/inventory/buffer-level",
                isActive: false,
            },
            {
                type: "link",
                title: "Cost Management",
                url: "/inventory/cost-management",
                isActive: false,
            },
        ],
    },
    {
        type: "expandable",
        title: "Admins",
        icon: Shield,
        initiallyExpanded: false,
        items: [
            {
                type: "link",
                title: "Staff",
                url: "/admin/staff",
                isActive: false,
            },
            {
                type: "link",
                title: "Report templates",
                url: "/admin/reports",
                isActive: false,
            },
            {
                type: "link",
                title: "Prescription Vitals",
                url: "/admin/prescription",
                isActive: false
            },
            {
                type: "link",
                title: "Profile",
                url: "/admin/profile",
                isActive: false,
            },
            {
                type: "link",
                title: "Fees",
                url: "/admin/fees",
                isActive: false,
            }
        ],
    },
    {
        type: "expandable",
        title: "About",
        icon: Info,
        initiallyExpanded: false,
        items: [
            {
                type: 'link',
                title: "Changelog",
                url: "/changelog",
                isActive: false,
            }
        ]
    }
];

export const NurseLinks: SidebarItem[] = [
    {
        type: "link",
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        isActive: false,
    },
    {
        type: "link",
        title: "Patients",
        url: "/patients",
        icon: Users,
        isActive: false,
    },
    {
        type: "expandable",
        title: "Queue",
        initiallyExpanded: true,
        icon: Clock,
        items: [
            {
                type: "link",
                title: "Active queue",
                url: "/queue/active",
                isActive: false,
            },
            {
                type: "link",
                title: "All queues",
                url: "/queue",
                isActive: false,
            }
        ]
    },
    {
        type: "link",
        title: "Profile",
        url: "/admin/profile",
        icon: UserPen,
        isActive: false,
    },
    {
        type: "link",
        title: "Daily Income",
        url: "/income-by-patients",
        icon: CircleDollarSign,
        isActive: false,
    },
    {
        type: "expandable",
        title: "Inventory",
        icon: Package,
        initiallyExpanded: true,
        items: [
            {
                type: "link",
                title: "Drug Stock",
                url: "/inventory/all-drugs",
                isActive: false,
            },
            {
                type: "link",
                title: "Drug Buffers",
                url: "/inventory/buffer-level",
                isActive: false,
            },
        ],
    },
    {
        type: "expandable",
        title: "About",
        icon: Info,
        initiallyExpanded: false,
        items: [
            {
                type: 'link',
                title: "Changelog",
                url: "/changelog",
                isActive: false,
            }
        ]
    }
];

const AppSidebarLinks = ({role}: { role: Role }) => {
    const pathname = usePathname();
    const links = role === Role.DOCTOR ? DoctorLinks : NurseLinks;

    // Helper function to check if any sub-items match the current path
    const shouldExpandGroup = (items: Array<{ url: string }>) => {
        return items.some(item => pathname.startsWith(item.url));
    };

    return (
        <SidebarGroup>
            <SidebarGroupLabel>{role === Role.DOCTOR ? "Doctor" : "Nurse"} Navigation</SidebarGroupLabel>
            <SidebarMenu>
                {links.map((link) =>
                    link.type === "link" ? (
                        <SidebarMenuItem key={link.title}>
                            <SidebarMenuButton
                                asChild
                                tooltip={link.title}
                                isActive={pathname === link.url}
                            >
                                <Link href={link.url} className="flex items-center">
                                    {link.icon && <link.icon className="mr-2 h-4 w-4"/>}
                                    <span>{link.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ) : (
                        <Collapsible
                            key={link.title}
                            asChild
                            defaultOpen={link.initiallyExpanded || shouldExpandGroup(link.items)}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        tooltip={link.title}
                                    >
                                        {link.icon && <link.icon className="mr-2 h-4 w-4"/>}
                                        <span>{link.title}</span>
                                        <ChevronRight
                                            className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"/>
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {link.items.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton
                                                    asChild
                                                    isActive={pathname === subItem.url}
                                                >
                                                    <Link href={subItem.url}>
                                                        <span>{subItem.title}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    )
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
};

export default AppSidebarLinks;