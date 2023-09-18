import React from "react";
import { Table, Pagination } from "react-bootstrap";

function PaginationTable({ currentPage, setCurrentPage, totalPages }) {
  return (
    <div>
      <div class="pagination">
        <Pagination>
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          />

          <Pagination.Item onClick={() => setCurrentPage(1)}>1</Pagination.Item>

          {currentPage > 5 && <Pagination.Ellipsis disabled />}

          {Array.from({ length: totalPages }, (_, index) => {
            if (index + 1 === 1 || index + 1 === totalPages) return null;

            if (index + 1 >= currentPage - 2 && index + 1 <= currentPage + 2) {
              return (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              );
            }

            if (
              (index + 1 === currentPage - 3 && currentPage > 6) ||
              (index + 1 === currentPage + 3 && currentPage < totalPages - 5)
            ) {
              return <Pagination.Ellipsis key={index + 1} disabled />;
            }

            return null;
          })}

          {currentPage < totalPages - 4 && <Pagination.Ellipsis disabled />}

          {totalPages >= 2 && (
            <Pagination.Item onClick={() => setCurrentPage(totalPages)}>
              {totalPages}
            </Pagination.Item>
          )}

          <Pagination.Next
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          />
        </Pagination>
      </div>
    </div>
  );
}

export default PaginationTable;
