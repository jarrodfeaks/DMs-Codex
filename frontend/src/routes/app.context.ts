import {useOutletContext} from "react-router-dom";
import {ContextType} from "./app.tsx";

export function useCurrentCampaign() {
    return useOutletContext<ContextType>().currentCampaign;
}

export function useUser() {
    return useOutletContext<ContextType>().user;
}
