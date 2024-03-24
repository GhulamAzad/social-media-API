import { LoaderCircle } from "lucide-react";

export function Loader() {
  return (
    <div className='flex justify-center items-center min-h-screen'>
      <LoaderCircle className='animate-spin' />
    </div>
  );
}
