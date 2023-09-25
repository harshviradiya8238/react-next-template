import React from "react";
import { Table, Pagination } from "react-bootstrap";

function PaginationTable({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };
  return (
    <div>
      <div class="pagination">
        <div class="pagination">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link pagination_button"
              onClick={handlePrevious}
            >
              &laquo;
            </button>
          </li>
          {[...Array(totalPages)].map((page, index) => (
            <li
              key={index}
              className={`page-item ${
                currentPage === index + 1 ? "active" : ""
              }`}
            >
              <button
                className="page-link pagination_button"
                onClick={() => onPageChange(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link pagination_button"
              onClick={handleNext}
            >
              &raquo;
            </button>
          </li>
        </div>
      </div>
    </div>
  );
}

export default PaginationTable;
