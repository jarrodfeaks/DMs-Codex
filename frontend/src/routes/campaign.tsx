import {Typography} from "@mui/material";
import type { Campaign } from "../types.ts";

import {useCurrentCampaign} from "./app.context.ts";

export default function Campaign() {
    const { currentCampaign } = useCurrentCampaign();

    return (
        <>
            <Typography variant={"h3"}>Dashboard - { currentCampaign?.name }</Typography>
        </>
    )
}
