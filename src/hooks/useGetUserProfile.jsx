import { setAuthUser, setSuggestedUsers, setUserProfile } from "@/slices/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";




const useGetUserProfile = (userId) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/user/${userId}/profile`, { withCredentials: true });
               

                if (res.data.success) {
                    dispatch(setUserProfile(res.data.user));
                }
            }
            catch (error) {
                console.log(error);
                toast.error(error.response.data.message);
                dispatch(setAuthUser(null));
                navigate('/login');
            }
        }
        fetchUserProfile();
    }, [userId]);
}

export default useGetUserProfile;