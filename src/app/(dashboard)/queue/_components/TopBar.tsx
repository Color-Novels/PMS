"use client";

import React, { useEffect, useState } from "react";
import { redirect, usePathname } from "next/navigation";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import { FaStop } from "react-icons/fa";
import { MdOutlineTimer } from "react-icons/md";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { handleServerAction } from "@/app/lib/utils";
import {getQueue, stopQueue} from "@/app/lib/actions/queue";

const TopBar = () => {
    const pathname = usePathname();
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [status, setStatus] = useState<string>("COMPLETED");
    const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");

    let title = "All Queues";
    let perQueuePageActive = false;
    let queueId = null;

    if (pathname.startsWith("/queue/")) {
        queueId = pathname.split("/")[2];
        if (queueId) {
            title = `Queue ${queueId}`;
            perQueuePageActive = true;
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            if (!queueId) {
                return;
            }

            // Check if queue ID is a number
            if (isNaN(parseInt(queueId))) {
                return;
            }

            const queueData = await getQueue(parseInt(queueId));

            if (queueData) {
                setStartTime(new Date(queueData.start));
                setStatus(queueData.status);
            }
        };

        fetchData().then(() => {});
    }, [queueId]);

    const handleStop = async () => {
        const result = await handleServerAction(() => stopQueue(queueId), {
            loadingMessage: "Stopping Queue...",
        });

        if (!result.success) {
            return;
        }

        setStatus("COMPLETED");
        await new Promise((resolve) => setTimeout(resolve, 2000));
        redirect("/queue");
    };

    useEffect(() => {
        if (status === "IN_PROGRESS" && startTime) {
            const updateElapsedTime = () => {
                const now = new Date();
                const diff = Math.floor(
                    (now.getTime() - startTime.getTime()) / 1000
                );

                const hours = Math.floor(diff / 3600)
                    .toString()
                    .padStart(2, "0");
                const minutes = Math.floor((diff % 3600) / 60)
                    .toString()
                    .padStart(2, "0");
                const seconds = (diff % 60).toString().padStart(2, "0");

                setElapsedTime(`${hours}:${minutes}:${seconds}`);
            };

            updateElapsedTime();
            const interval = setInterval(updateElapsedTime, 1000);

            return () => clearInterval(interval);
        }
    }, [status, startTime]);

    return (
        <div className="flex justify-between w-full bg-white border-b border-primary-900/25 shadow py-3.5 px-3 items-center text-xl font-semibold text-gray-800">
            <div className="flex items-center">
                {perQueuePageActive && (
                    <Link
                        href="/queue"
                        className="p-2 hover:bg-gray-200 rounded-md"
                    >
                        <IoArrowBack className="size-6" />
                    </Link>
                )}
                <h2 className="text-xl font-bold text-primary-700">{title}</h2>
            </div>

            {perQueuePageActive && (
                <div>
                    {status === "COMPLETED" ? (
                        <span className="text-gray-600">Queue Completed</span>
                    ) : (
                        <div className={"flex gap-2 items-center"}>
                            <MdOutlineTimer className="text-2xl text-gray-500 w-full" />
                            <div
                                className={
                                    "flex justify-center m-auto min-w-24"
                                }
                            >
                                <span className="font-medium">
                                    {elapsedTime}
                                </span>
                            </div>
                            <AlertDialog>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <AlertDialogTrigger asChild>
                                                <button className="p-3.5 bg-red-600 text-white text-sm rounded-full hover:bg-red-700 transition">
                                                    <FaStop />
                                                </button>
                                            </AlertDialogTrigger>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Stop Queue</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Stop Queue
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to stop this
                                            queue? This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200">
                                            Keep Running
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={handleStop}
                                            className="bg-red-600 text-white hover:bg-red-700"
                                        >
                                            Stop Queue
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TopBar;
