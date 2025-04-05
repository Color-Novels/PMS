// components/ui/pagination.tsx
"use client"

import Link from "next/link";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Generate page numbers to display
  const generatePagination = () => {
    // Always show first page
    const pagination: (number | string)[] = [1];
    
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Add ellipsis if current page is far from start
    if (currentPage > 3) {
      pagination.push('...');
    }
    
    // Add pages around current page
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pagination.push(i);
    }
    
    // Add ellipsis if current page is far from end
    if (currentPage < totalPages - 2) {
      pagination.push('...');
    }
    
    // Always show last page
    if (totalPages > 1) {
      pagination.push(totalPages);
    }
    
    return pagination;
  };
  
  const pages = generatePagination();

  return (
    <div className="flex items-center justify-between px-2">
      <div className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </div>
      
      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={currentPage <= 1}
          asChild
        >
          <Link href={createPageURL(currentPage - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        
        {pages.map((page, i) => (
          page === '...' ? (
            <Button
              key={`ellipsis-${i}`}
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              key={`page-${page}`}
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              className="h-8 w-8"
              asChild
            >
              <Link href={createPageURL(page as number)}>
                {page}
              </Link>
            </Button>
          )
        ))}
        
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={currentPage >= totalPages}
          asChild
        >
          <Link href={createPageURL(currentPage + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}