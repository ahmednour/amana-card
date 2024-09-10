const Form = ({ pClick, dClick, data, position }: {
    pClick: (value: string) => void;
    dClick: (value: string) => void;
    data: string;
    position: string;
}) => {
    const inputClasses = "bg-white h-14 w-full rounded-lg shadow border-2 border-[#84923a] p-2 hover:border-[#84923a] focus:outline-none peer";
    const labelClasses = "absolute text-sm text-gray-500 duration-300 bg-white rounded-lg transform -translate-y-4 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-5 peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 right-1 peer-focus:bg-gradient-to-b from-[#e7e9ea] to-white";

    const renderInput = (name: string, value: string, onChange: (value: string) => void, labelText: string) => (
        <div className="relative mb-3 lg:mb-8 w-[80%] lg:w-1/2 mx-auto">
            <input
                type="text"
                className={inputClasses}
                name={name}
                id={name}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder=" "
            />
            <label
                htmlFor={name}
                className={labelClasses}
            >
                {labelText}
            </label>
        </div>
    );

    return (
        <div className="flex justify-center flex-col lg:flex-row gap-2 w-full">
            {renderInput("name", data, dClick, "اكتب اسمك")}
            {renderInput("department", position, pClick, "اكتب اسم الادارة")}
        </div>
    );
};

export default Form;