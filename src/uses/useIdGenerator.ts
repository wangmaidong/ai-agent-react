import { useAppContext } from "../AppService/useAppService";
import { useStableCallback } from "./useStableCallback";

export function useIdGenerator() {
  const { http } = useAppContext();
  return useStableCallback(async () => {
    const resp = await http.get<{ data: string }>("/next_id");
    return resp.data.data;
  });
}
