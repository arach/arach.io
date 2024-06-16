import { SITE } from "@config";
import getPageNumbers from "./getPageNumbers";

interface PaginationProps<T> {
    items: T[];
    currentPage: string | number;
    itemsPerPage?: number;
    isIndex?: boolean;
}

const getContentPagination = <T>({
    items,
    currentPage,
    itemsPerPage = SITE.postPerPage, // Default to SITE.postPerPage or allow custom setting
    isIndex = false,
}: PaginationProps<T>) => {
    const totalPagesArray = getPageNumbers(items.length);
    const totalPages = totalPagesArray.length;

    const pageIndex = isIndex
        ? 1
        : currentPage && !isNaN(Number(currentPage)) && totalPagesArray.includes(Number(currentPage))
            ? Number(currentPage)
            : 1; // Default to 1 if invalid page

    const lastItemIndex = pageIndex * itemsPerPage;
    const firstItemIndex = lastItemIndex - itemsPerPage;
    const paginatedItems = items.slice(firstItemIndex, lastItemIndex);

    return {
        totalPages,
        currentPage: pageIndex,
        paginatedItems,
    };
};

export default getContentPagination;
