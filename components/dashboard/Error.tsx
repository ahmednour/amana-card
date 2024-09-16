
import { MdErrorOutline } from "react-icons/md";

const Error = () => {
  return (
    <div className='flex justify-center items-center mb-4'>
      <div className='bg-red-500 text-white p-4 rounded-md'>
        <h1 className='text-2xl font-bold flex items-center gap-2'>
          <MdErrorOutline  size={30}/>
          الرجاء المراجعة مرة أخرى , هناك خطأ ما</h1>
      </div>
    </div>
  )
}

export default Error