import { useQuery } from "@tanstack/react-query";
import { getHealthStatus } from "@/services/health";

export const useHealthCheck = () => {
  return useQuery({
    queryKey: ["health"],
    queryFn: getHealthStatus,
  });
};
