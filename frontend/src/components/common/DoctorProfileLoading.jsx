import React from 'react'

export const DoctorProfileLoading = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 animate-pulse">
      <div className="bg-white rounded-2xl shadow border p-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-32 h-32 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-4">
            <div className="h-6 w-1/2 bg-gray-200 rounded" />
            <div className="h-4 w-1/3 bg-gray-200 rounded" />
            <div className="h-4 w-1/4 bg-gray-200 rounded" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
