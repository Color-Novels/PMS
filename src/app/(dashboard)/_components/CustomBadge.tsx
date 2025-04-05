// ParameterBadge.tsx
import {Badge} from "@/components/ui/badge";
import {HTMLAttributes} from "react";


export type BasicColorType = {
    slate: string;
    gray: string;
    zinc: string;
    neutral: string;
    stone: string;
    red: string;
    orange: string;
    amber: string;
    yellow: string;
    lime: string;
    green: string;
    emerald: string;
    teal: string;
    cyan: string;
    sky: string;
    blue: string;
    indigo: string;
    violet: string;
    purple: string;
    fuchsia: string;
    pink: string;
    rose: string;
    destructive?: string;
    okay?: string;
}

interface ParameterBadgeProps extends HTMLAttributes<HTMLSpanElement> {
    text: string;
    color?: keyof BasicColorType;
    className?: string;
    inverse?: boolean;
}

export const badgeColors: Record<keyof BasicColorType, string> = {
    slate: 'bg-slate-100 text-slate-600 hover:bg-slate-200',
    gray: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
    zinc: 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200',
    neutral: 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200',
    stone: 'bg-stone-100 text-stone-600 hover:bg-stone-200',
    red: 'bg-red-100 text-red-600 hover:bg-red-200',
    orange: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
    amber: 'bg-amber-100 text-amber-600 hover:bg-amber-200',
    yellow: 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200',
    lime: 'bg-lime-100 text-lime-600 hover:bg-lime-200',
    green: 'bg-green-100 text-green-600 hover:bg-green-200',
    emerald: 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200',
    teal: 'bg-teal-100 text-teal-600 hover:bg-teal-200',
    cyan: 'bg-cyan-100 text-cyan-600 hover:bg-cyan-200',
    sky: 'bg-sky-100 text-sky-600 hover:bg-sky-200',
    blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
    indigo: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200',
    violet: 'bg-violet-100 text-violet-600 hover:bg-violet-200',
    purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
    fuchsia: 'bg-fuchsia-100 text-fuchsia-600 hover:bg-fuchsia-200',
    pink: 'bg-pink-100 text-pink-600 hover:bg-pink-200',
    rose: 'bg-rose-100 text-rose-600 hover:bg-rose-200',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
    okay: 'bg-green-500 text-white hover:bg-green-600',
};

export const badgeColorsInverted: Record<keyof BasicColorType, string> = {
    slate: 'bg-slate-600 text-white hover:bg-slate-700',
    gray: 'bg-gray-600 text-white hover:bg-gray-700',
    zinc: 'bg-zinc-600 text-white hover:bg-zinc-700',
    neutral: 'bg-neutral-600 text-white hover:bg-neutral-700',
    stone: 'bg-stone-600 text-white hover:bg-stone-700',
    red: 'bg-red-600 text-white hover:bg-red-700',
    orange: 'bg-orange-600 text-white hover:bg-orange-700',
    amber: 'bg-amber-600 text-white hover:bg-amber-700',
    yellow: 'bg-yellow-600 text-white hover:bg-yellow-700',
    lime: 'bg-lime-600 text-white hover:bg-lime-700',
    green: 'bg-green-600 text-white hover:bg-green-700',
    emerald: 'bg-emerald-600 text-white hover:bg-emerald-700',
    teal: 'bg-teal-600 text-white hover:bg-teal-700',
    cyan: 'bg-cyan-600 text-white hover:bg-cyan-700',
    sky: 'bg-sky-600 text-white hover:bg-sky-700',
    blue: 'bg-blue-600 text-white hover:bg-blue-700',
    indigo: 'bg-indigo-600 text-white hover:bg-indigo-700',
    violet: 'bg-violet-600 text-white hover:bg-violet-700',
    purple: 'bg-purple-600 text-white hover:bg-purple-700',
    fuchsia: 'bg-fuchsia-600 text-white hover:bg-fuchsia-700',
    pink: 'bg-pink-600 text-white hover:bg-pink-700',
    rose: 'bg-rose-600 text-white hover:bg-rose-700',
    destructive: 'bg-red-700 text-white hover:bg-red-600',
    okay: 'bg-green-700 text-white hover:bg-green-600',
}


export function CustomBadge({
                                text,
                                color,
                                inverse,
                                className,
                                ...props
                            }: ParameterBadgeProps) {


    return (
        <Badge
            className={`text-xs font-semibold ${inverse ? badgeColorsInverted[color || 'gray'] : badgeColors[color || 'gray']} ${className}`}
            {...props}
        >
            {text}
        </Badge>
    );
}

//Get random colored badge without 'gray', 'zinc', 'slate', 'neutral', 'stone'
export function getRandomColor() {
    const colors = Object.keys(badgeColors).filter(color => !['gray', 'zinc', 'slate', 'neutral', 'stone', 'destructive', 'okay'].includes(color));
    return colors[Math.floor(Math.random() * colors.length)] as keyof BasicColorType;
}


export function RandomColorBadge({
                                     text,
                                     ...props
                                 }: ParameterBadgeProps) {
    return (
        <CustomBadge
            {...props}
            text={text}
            color={getRandomColor()}
        />
    );
}