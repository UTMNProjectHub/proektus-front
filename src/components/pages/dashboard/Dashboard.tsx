import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { IProjectsResponse } from "../../widgets/projects/types/ProjectTypes";
import ProjectCard from "../../widgets/projects/ProjectCard";
import { useNavigate, useParams } from "react-router";

function Dashboard() {
  const navigate = useNavigate();

  const [pageData, setPageData] = useState({} as IProjectsResponse);
  const [pageSize, setPageSize] = useState(10);

  const urlParams = new URLSearchParams(window.location.search);
  const pageParam = urlParams.get("page");
  const [page, setPage] = useState(pageParam ? parseInt(pageParam) : 1);

  const handlePageChange = (newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, pageData.last_page || 1));

    if (validPage !== page) {
      setPage(validPage);
      navigate(`?page=${validPage}`);
    }
  };

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
  }, [location.search, pageParam, pageData.last_page]);

  useEffect(() => {
    axios
      .get(`/api/projects?page=${page}&per_page=${pageSize}`)
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
  }, [page]);

  return (
    <div className="container flex flex-col mx-auto pt-8 pb-2">
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

          {Array.from({ length: pageData.last_page || 0 }, (_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                isActive={pageData.current_page === index + 1}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </PaginationLink>
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
