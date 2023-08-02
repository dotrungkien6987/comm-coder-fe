import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
const useAuth = () => {
  return useContext(AuthContext);
  //tra ve gia tri prop cuar AuthContext
};
export default useAuth;
