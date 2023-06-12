import React from 'react'

const Header = () => {
  return (
    <div className="flex justify-between items-center px-4 py-3">
      <div className="flex w-[20rem] items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5 text-gray-400 font-bold"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          placeholder="Tap to search"
          type="text"
          name=""
          id=""
          className="p-2 w-full focus:outline-none text-sm text-gray-500 bg-transparent border-none"
        />
      </div>
      <div className="flex items-center gap-2">
        {/* <div className='relative'>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5"
            />
          </svg>
          <div className='absolute w-4 h-4 bg-blue-400 rounded-full -top-2 -right-1 text-sm text-white flex items-center justify-center'>8</div>
        </div> */}
        <div className="flex items-center gap-1">
          <img
            className="w-8 h-8 rounded-full border-1 object-cover ml-2"
            src="https://t4.ftcdn.net/jpg/03/64/21/11/240_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg"
            alt="User Image"
          />
          <div className="ml-1">
            <h3 className="text-sm font-bold leading-none">David Spade</h3>
            <span className="text-sm leading-none text-gray-400">
              Sales Admin
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header