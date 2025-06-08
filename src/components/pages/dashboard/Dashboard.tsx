import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import { IProjectsResponse } from "../../widgets/projects/types/ProjectTypes";
import ProjectCard from "../../widgets/projects/ProjectCard";
import { useNavigate } from "react-router";
import { useSanctum } from "react-sanctum";

function Dashboard({ personal = false }: { personal?: boolean }) {
  const navigate = useNavigate();

  const [pageData, setPageData] = useState({} as IProjectsResponse);
  const [pageSize, setPageSize] = useState(8);
  const { user } = useSanctum();

  // adjust number of items per page based on viewport width
  useEffect(() => {
    const updatePageSize = () => {
      const width = window.innerWidth;
      if (width < 640) setPageSize(4);
      else if (width < 1024) setPageSize(6);
      else setPageSize(8);
    };
    updatePageSize();
    window.addEventListener("resize", updatePageSize);
    return () => window.removeEventListener("resize", updatePageSize);
  }, []);

  const urlParams = new URLSearchParams(window.location.search);
  const pageParam = urlParams.get("page");
  const [page, setPage] = useState(pageParam ? parseInt(pageParam) : 1);

  const handlePageChange = useCallback((newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, pageData.last_page || 1));

    if (validPage !== page) {
      setPage(validPage);
      navigate(`?page=${validPage}`);
    }
  }, []);

  useEffect(() => {
    if (pageParam) {
      const requestedPage = parseInt(pageParam);

      if (pageData.last_page && requestedPage > pageData.last_page) {
        navigate(`?page=${pageData.last_page}`, { replace: true });
      } else if (requestedPage < 1) {
        navigate(`?page=1`, { replace: true });
      } else if (page !== requestedPage) {
        setPage(requestedPage);
      }
    } else {
      if (page !== 1) {
        setPage(1);
      }
    }
  }, [pageParam, pageData.last_page, page, navigate]);

  useEffect(() => {
    if (personal && !user) {
      return;
    }

    const url = personal && user ? `/api/projects?page=${page}&per_page=${pageSize}&user=${user.data.id}` :
      `/api/projects?page=${page}&per_page=${pageSize}`;

    axios
      .get(url)
      .then((response) => {
        setPageData(response.data);

        if (response.data.last_page && page > response.data.last_page) {
          handlePageChange(response.data.last_page);
        }

        console.log("Projects fetched:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  }, [handlePageChange, page, pageSize, personal, user]);

  const pageNumbers: (number | string)[] = (() => {
    const total = pageData.last_page || 0;
    const current = pageData.current_page || 1;
    const delta = 2;
    const range: (number | string)[] = [];
    let last: number | string = 0;
    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= current - delta && i <= current + delta)
      ) {
        range.push(i);
        last = i;
      } else if (last !== '...') {
        range.push('...');
        last = '...';
      }
    }
    return range;
  })();

  return (
    <div className="container flex flex-col mx-auto px-4 py-6">
      <div className="grid grid-cols-1 mx-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        {pageData.data &&
          pageData.data.map((item, index) => (
            <ProjectCard key={`project_${index}`} project={item} />
          ))}
      </div>

      <Pagination>
        <PaginationContent>
          {pageData.current_page > 1 && (
            <PaginationItem>
              <PaginationPrevious onClick={() => handlePageChange(page - 1)} />
            </PaginationItem>
          )}

          {pageNumbers.map((item, idx) => (
            <PaginationItem key={idx}>
              {typeof item === 'string' ? (
                <span className="px-3 py-1 text-gray-500">...</span>
              ) : (
                <PaginationLink
                  isActive={pageData.current_page === item}
                  onClick={() => handlePageChange(item as number)}
                >
                  {item}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {pageData.current_page < (pageData.last_page || 0) && (
            <PaginationItem>
              <PaginationNext onClick={() => handlePageChange(page + 1)} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default Dashboard;
