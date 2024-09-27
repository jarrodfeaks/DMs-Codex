import {useOutletContext} from "react-router-dom";
import {ContextType} from "./app.tsx";

export function useCurrentCampaign() {
    return useOutletContext<ContextType>();
}
