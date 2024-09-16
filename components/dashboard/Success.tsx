import { IoMdDoneAll } from "react-icons/io";

const Success = () => {
  return (
    <div className='flex justify-center items-center mb-4'>
      <div className='bg-green-500 text-white p-4 rounded-md'>
        <h1 className='text-2xl font-bold flex items-center gap-2'>
          <IoMdDoneAll  size={30}/>
          تمت إضافة المناسبة بنجاح</h1>
      </div>
    </div>
  )
}

export default Success