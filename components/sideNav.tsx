"use client"



import { FaBookOpen, FaCode, FaQuestionCircle, FaGithub } from 'react-icons/fa';
import SideNavIcon from './sideNavIcon';

interface ISideNav {
    updateCurrentView: (view: string) => void
}

export default function SideNav({ updateCurrentView }: ISideNav) {
    return (
        <div className="border border-border min-h-full flex flex-col justify-between" style={{ width: '6%' }}>

            {/* <div id="logo" className='relative flex items-center justify-center h-12 w-12 my-2 shadow-lg mx-auto bg-gray-800 text-green-500 hover:bg-green-600 hover:text-white rounded-3xl hover:rounded-xl transition-all duration-300 ease-linear cursor-pointer'>
                <FaBookOpen/>
            </div> */}

            <div id='options' className='flex flex-col space-y-5'>
                <button onClick={() => updateCurrentView('lesson')}>
                    <SideNavIcon icon={<FaBookOpen size="32" />} />
                </button>


                <button onClick={() => updateCurrentView('coding')}>
                    <SideNavIcon icon={<FaCode size="32" />} />
                </button>

                <button onClick={() => updateCurrentView('quiz')}>
                    <SideNavIcon icon={<FaQuestionCircle size="32" />} />
                </button>

            </div>

            <div id="github" className='mx-auto'>

                <FaGithub style={{ width: '50px', height: '50px' }} />


            </div>

        </div>
    )
}