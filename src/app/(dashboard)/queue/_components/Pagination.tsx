"use client";

import React, {useEffect, useState} from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {getTotalQueueCount} from "@/app/lib/actions/queue";

interface PaginationProps {
    size: number;
}

const Pagination: React.FC<PaginationProps> = ({ size }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;
    const [count, setCount] = useState(0)
    useEffect(() => {
        const fetchData = async () => {
            const newCount = await getTotalQueueCount();
            setCount(newCount);
        }

        fetchData();
    }, [currentPage]);

    const totalPages = Math.ceil(count / size);

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        router.push(`?${params.toString()}`);
    };

    const renderPageNumbers = () => {
        const pages = [];
        const maxPageNumbers = 5;
        const showEllipsis = totalPages > maxPageNumbers;

        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        if (showEllipsis) {
            if (currentPage <= 3) {
                endPage = maxPageNumbers;
            } else if (currentPage >= totalPages - 2) {
                startPage = totalPages - maxPageNumbers + 1;
            }
        }

        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) pages.push("...");
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pages.push("...");
            pages.push(totalPages);
        }

        return pages.map((page, index) =>
                typeof page === "number" ? (
                    <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            currentPage === page
                                ? "bg-primary text-white focus-visible:outline-primary-600"
                                : "text-gray-900 ring-1 ring-gray-300 hover:bg-gray-50"
                        }`}
                    >
                        {page}
                    </button>
                ) : (
                    <span
                        key={`ellipsis-${index}`}
                        className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300"
                    >
          ...
        </span>
                )
        );
    };

    return (
        <div className="flex items-center justify-between gap-5 border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-md">
            <div className="flex flex-1 justify-between sm:hidden">
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between gap-10">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">
                            {currentPage === 1 ? 1 : (currentPage - 1) * size + 1}
                    </span> to{" "}
                        <span className="font-medium">
                            {currentPage === totalPages ? totalPages * size : currentPage * size}
                        </span> of{" "}
                        <span className="font-medium">
                            {count}
                        </span> results
                    </p>
                </div>
                <div>
                    <nav
                        className="isolate inline-flex space-x-1 rounded-md shadow-xs"
                        aria-label="Pagination"
                    >
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                        >
                            <span className="sr-only">Previous</span>
                            <svg
                                className="size-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>

                        {renderPageNumbers()}

                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
                        >
                            <span className="sr-only">Next</span>
                            <svg
                                className="size-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Pagination;
