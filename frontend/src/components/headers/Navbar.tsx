import { Bell, MessageCircleMore, Search } from "lucide-react";
import { Link } from "react-router-dom";
import Popover from "../shared/Popover";
import avatar from "./../../assets/avatar.svg";
import Profile from "./Profile";

const rightMenus = [
  {
    name: "Messages",
    icon: MessageCircleMore,
    to: "message",
    count: 0,
    className: "-mt-1",
  },
  { name: "Notification", icon: Bell, to: "notifications", count: 11 },
];

export default function Navbar() {
  return (
    <div className='flex items-center gap-10 p-3'>
      <div className='w-44 font-bold text-2xl'>
        <Link to={"/"}>
          Pic<span className='text-blue-600'>Vibe</span>
        </Link>
      </div>
      <div className='flex-1 relative'>
        <form action='' method='get'>
          <input
            type='text'
            placeholder='Search anything'
            className='w-full rounded-full px-6 py-2 text-sm outline-none bg-gray-100'
          />
          <button>
            <Search className='absolute top-1/2 right-3 -translate-y-1/2 size-6 text-gray-400' />
          </button>
        </form>
      </div>
      <div className='flex items-center gap-6 mr-6'>
        {rightMenus.map((rightMenu) => {
          return (
            <Link
              key={rightMenu.name}
              to={rightMenu.to}
              className={`relative  text-gray-700 ${rightMenu.className ?? ""}`}
            >
              {rightMenu.count > 0 && (
                <span className='absolute -top-3 -right-3 inline-block bg-red-500 text-white rounded-full px-2 py-1 text-xs font-semibold'>
                  {rightMenu.count}
                </span>
              )}
              <rightMenu.icon className='size-6' />
            </Link>
          );
        })}
        <div>
          <Popover
            variant='right'
            triggerButton={
              <img
                src={avatar}
                alt='profile'
                className='flex size-8 shrink-0 overflow-hidden rounded-full'
              />
            }
          >
            <Profile />
          </Popover>
        </div>
      </div>
    </div>
  );
}
