import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login} from "./store/slices/userSlices";

export default function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function restoreSession() {
      const accessToken = localStorage.getItem("accessToken");
      const staySignedIn = JSON.parse(localStorage.getItem("staySignedIn"));
      const loginTime = localStorage.getItem("loginTime");

      //no access token means no session
      if (!accessToken) {
        return;
      }

      if(accessToken === "admin-token"){
        const storedUser = localStorage.getItem("user");

        if(!storedUser){
          return;
        }
        try{
          const userData = JSON.parse(storedUser)

          dispatch(login({user: userData, accessToken}));
        } catch(err){
          console.log("Could not restore admin session", err);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          return;
        }
        return; 
      }

      //user did not check "stay signed in"
      if(!staySignedIn){
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("staySignedIn");
        localStorage.removeItem("loginTime");

        return;
      }

      //convert days into ms
      const thiryDays = 30 * 24 * 60 * 60 * 1000;
      const currentTime = Date.now();

      //stay signed in exceeded 30 days
      if(currentTime - Number(loginTime) > thiryDays){
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("staySignedIn");
        localStorage.removeItem("loginTime");
        return;
      }

      if(accessToken.startsWith("mock-token-")){
        const storedUser = localStorage.getItem("user");

        if(!storedUser){
          return;
        }

        const userData = JSON.parse(storedUser);


        dispatch(login({
          user: userData,
          accessToken: accessToken,
        }));

        return;
      }

      try {
        const response = await axios.get("https://dummyjson.com/user/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const userData = response.data;

        dispatch(login(userData));

        console.log("Restored user:", userData);

      } catch (err) {
        console.log("Could not restore session",err);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("staySignedIn");
        localStorage.removeItem("loginTime");
      }
    }
    restoreSession();
  }, [dispatch]);

  return null;
}
