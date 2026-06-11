import React from 'react'

export const DoctorNotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <img
        src="https://illustrations.popsy.co/gray/searching.svg"
        alt="Not found"
        className="w-64 mb-6"
      />
      <h2 className="text-2xl font-semibold mb-2">Doctor Not Found</h2>
      <p className="text-gray-500 max-w-md">
        The doctor you are looking for does not exist or may have been removed.
        Please try searching again.
      </p>
    </div>
  )
}

