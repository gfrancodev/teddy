import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/core/components/pagination';
import { If } from '@/core/components/conditional/if';
import { For } from '@/core/components/conditional/for';
import { cn } from '@/core/utils/cn';

interface ClientsPaginationProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
}

export const ClientsPagination = ({
  currentPage,
  setCurrentPage,
  totalPages,
}: ClientsPaginationProps) => {
  const generatePageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];

    pages.push(1);

    if (currentPage > 3) {
      pages.push('ellipsis');
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('ellipsis');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="mt-1 flex justify-center">
      <Pagination>
        <PaginationContent className="gap-1">
          <For each={generatePageNumbers()}>
            {(page, index) => (
              <PaginationItem key={`${page}-${index}`}>
                {page === 'ellipsis' ? (
                  <PaginationEllipsis className="border-none" />
                ) : (
                  <PaginationLink
                    href="#"
                    isActive={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "min-w-[32px] h-[32px] rounded-[4px] border-none",
                      page === currentPage 
                        ? "bg-teddy-orange text-white hover:bg-teddy-orange/90"
                        : "hover:bg-gray-100"
                    )}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            )}
          </For>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
