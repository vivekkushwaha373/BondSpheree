import { setAuthUser, setSuggestedUsers } from "@/slices/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";




const useGetSuggestedUsers = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/user/suggested`, { withCredentials: true });


                if (res.data.success) {
                  
                    dispatch(setSuggestedUsers(res.data.users));
                }
            }
            catch (error) {
                console.log(error);
                toast.error(error.response.data.message);
                dispatch(setAuthUser(null));
                navigate('/login');
            }
        }
        fetchSuggestedUsers();
    }, [])
}

export default useGetSuggestedUsers;