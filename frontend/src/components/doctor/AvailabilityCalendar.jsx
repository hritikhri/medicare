import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function AvailabilityCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slots, setSlots] = useState([
    { time: '09:00 AM', isBooked: false },
    { time: '10:00 AM', isBooked: true },
    { time: '11:00 AM', isBooked: false },
    { time: '02:00 PM', isBooked: false },
    { time: '03:00 PM', isBooked: true }
  ]);

  const addSlot = (time) => {
    setSlots([...slots, { time, isBooked: false }]);
    // API call to save
  };

  const toggleBooked = (index) => {
    const newSlots = [...slots];
    newSlots[index].isBooked = !newSlots[index].isBooked;
    setSlots(newSlots);
    // API update
  };

  const deleteSlot = (index) => {
    setSlots(slots.filter((_, i) => i !== index));
    // API delete
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Availability Calendar</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
        <DatePicker
          selected={selectedDate}
          onChange={setSelectedDate}
          inline
          className="border border-gray-300 rounded-lg p-2"
          minDate={new Date()}
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-medium text-gray-900">Available Slots</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {slots.map((slot, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                slot.isBooked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                {slot.isBooked ? 'Booked' : 'Available'}
              </span>
              <span className="font-medium">{slot.time}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => toggleBooked(index)}
                  className="text-sm px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Toggle
                </button>
                <button
                  onClick={() => deleteSlot(index)}
                  className="text-sm px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex space-x-3 mt-4">
          <input
            type="time"
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            onChange={(e) => addSlot(e.target.value)}
          />
          <button
            onClick={() => addSlot('New Slot')}  // Trigger add
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Slot
          </button>
        </div>
      </div>
    </div>
  );
}