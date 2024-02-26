import React, { useContext } from "react";

// export type GlobalContextType = {
//   currentChat: string;
//   setCurrentChat: React.Dispatch<React.SetStateAction<string>>;
// };

export const globalContext = React.createContext({});
export const useGlobalContext = () => useContext(globalContext);
