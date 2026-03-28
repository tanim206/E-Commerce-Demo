// components/reusable/Pagination.tsx

type PaginationProps = {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (items: number) => void;
  };
  
 export  const Pagination = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
  }: PaginationProps) => {
    const numberOfPages = Math.ceil(totalItems / itemsPerPage);
    const pages = [...Array(numberOfPages).keys()];
  
    return (
      <div className="flex flex-wrap justify-center items-center gap-2 my-10">
        <button
          onClick={() => currentPage > 0 && onPageChange(currentPage - 1)}
          className="bg-green-600 btn-sm rounded-sm px-2 py-1 text-white"
        >
          Prev
        </button>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`btn-sm rounded-sm ${
              currentPage === page ? "bg-green-900 px-2 py-1 text-white" : "bg-fourthColor px-2 py-1"
            }`}
          >
            {page + 1}
          </button>
        ))}
        <button
          onClick={() => currentPage < numberOfPages - 1 && onPageChange(currentPage + 1)}
          className="bg-green-600 btn-sm rounded-sm px-2 py-1 text-white"
        >
          Next
        </button>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="select select-info w-fit text-info bg-green-400"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>
    );
  };
  

  