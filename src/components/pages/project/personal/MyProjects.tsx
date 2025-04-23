import GenericLoader from "@/components/ui/genericLoader";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import ProjectCard from "@/components/widgets/projects/ProjectCard";
import { IProjectsResponse } from "@/components/widgets/projects/types/ProjectTypes";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useSanctum } from "react-sanctum";

function Dashboard() {
  const navigate = useNavigate();
  const { user, authenticated } = useSanctum();

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
    if (authenticated === false) {
      navigate("/401");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

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
    if (!user) {
      return;
    }

    axios
      .get(`/api/projects?user=${user.id}&?page=${page}&per_page=${pageSize}`)
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

  if (authenticated === null) {
    return <GenericLoader />;
  }

  return (
    <div className="container flex flex-col mx-auto pt-8 pb-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {pageData.data &&
          pageData.data.map((item, index) => (
            <ProjectCard key={`project_${index}`} project={item} />
          ))}
      </div>

      <Pagination>
        <PaginationContent>
          {pageData.current_page > 1 && (
            <PaginationItem>
              <PaginationLink onClick={() => handlePageChange(page - 1)} />
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
