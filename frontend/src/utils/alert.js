import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useRef } from "react";

export const useAlert = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const shownMessagesRef = useRef({});
  
    const alert = (message, error, success_route) => {
      if (message && !shownMessagesRef.current[message]) {
        toast.success(message);
        dispatch({ type: "clearMessage" });
        shownMessagesRef.current[message] = true;
        
        if (success_route) {
          navigate(success_route);
        }
      }
  
      if (error && !shownMessagesRef.current[error]) {
        toast.error(error);
        dispatch({ type: "clearError" });
        shownMessagesRef.current[error] = true;
      }
    };
  
    return alert;
  };
