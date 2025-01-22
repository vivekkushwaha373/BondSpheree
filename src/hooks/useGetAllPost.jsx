
import { setAuthUser } from "@/slices/authSlice";
import { setPosts } from "@/slices/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";




const useGetAllPosts = () => {
    const dispatch = useDispatch();
    const { userProfile } = useSelector(store => store.auth);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchAllPost = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/post/all`, { withCredentials: true });


                if (res.data.success) {
                  
               
                    dispatch(setPosts(res.data.posts));
                }
            }
            catch (error) {
                console.log(error);
                toast.error(error.response.data.message);
                dispatch(setAuthUser(null));
                navigate('/login');
            }
        }
        fetchAllPost();
    }, [])
}

export default useGetAllPosts;