import MobileDetect from "mobile-detect";
import { createContext } from "react";

export const getIsSsrMobile = (context) => {
    const md = new MobileDetect(context.req.headers["user-agent"]);

    console.log("Is Mobile", md.mobile())

    return Boolean(md.mobile());
};

export const IsSsrMobileContext = createContext(false);