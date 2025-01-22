import { setAuthUser } from "@/slices/authSlice";
import { setMessages } from "@/slices/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";




const useGetAllMessage = () => {
    const { messages } = useSelector((state) => state.chat);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { selectedUser } = useSelector((state) => state.auth);
    useEffect(() => {
        const fetchAllMessage = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/v1/message/all/${selectedUser._id}`, { withCredentials: true });


                if (res.data.success) {
                    dispatch(setMessages(res.data.messages));
                }
            }
            catch (error) {
                console.log(error);
                toast.error(error.response.data.message);
                dispatch(setAuthUser(null));
                navigate('/login');
            }
        }
        fetchAllMessage();
    }, [selectedUser]);
}

export default useGetAllMessage;