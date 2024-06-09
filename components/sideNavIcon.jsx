export default function SideNavIcon({ icon, text = "Testing" }) {
    return (
        <div className='relative flex items-center justify-center h-12 w-12 my-2 shadow-lg mx-auto bg-gray-800 text-green-500 hover:bg-green-600 hover:text-white rounded-3xl hover:rounded-xl transition-all duration-300 ease-linear cursor-pointer'>
            {icon}
            {/* <span className="absolute w-auto p-2 m-2 min-w-max left-14 rounded-md shadow-md text-white bg-gray-900 text-xs font-bold transition-all duration-100 scale-0 origin-left">
                {text}
            </span> */}
        </div>

    )
}