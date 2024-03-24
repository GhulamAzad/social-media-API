import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import useLocalStorage from "../../hooks/useLocalStorage";
import Button from "../shared/Button";
import avatar from "./../../assets/avatar.svg";

export default function Profile() {
  const { user } = useAuth();
  const [_token, _setToken, removeToken] = useLocalStorage("token");
  const navigate = useNavigate();
  const logout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <div className='w-full flex justify-center flex-col items-center'>
      <img
        src={avatar}
        alt='profile'
        className='flex size-12 shrink-0 overflow-hidden rounded-full'
      />
      <div className='mt-2'>
        <p className='font-bold text-2xl text-gray-700'>{user?.email}</p>
        <p className='text-sm text-gray-600'>Hi! {user?.name}</p>
        <Button variant='full_small' className='mt-3' onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  );
}
