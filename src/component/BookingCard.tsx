import { FaCalendarAlt, FaUser, FaPhone } from "react-icons/fa";

interface BookingCardProps {
  booking: {
    _id: string;
    restaurantName: string;
    name: string;
    date: string;
    phone: string;
    createdAt: string;
  };
  selected: boolean;
  onSelect: () => void;
}

export default function BookingCard({ booking, selected, onSelect }: BookingCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`cursor-pointer p-4 rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-md ${
        selected
          ? "bg-red-100 dark:bg-red-900 border-red-400"
          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      }`}
    >
      <h2 className="text-lg font-semibold mb-2">{booking.restaurantName}</h2>
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <FaUser /> <span>{booking.name}</span>
      </div>
      <div className="flex items-center gap-2 text-sm mt-1 text-gray-600 dark:text-gray-400">
        <FaPhone /> <span>{booking.phone}</span>
      </div>
      <div className="flex items-center gap-2 text-sm mt-1 text-gray-600 dark:text-gray-400">
        <FaCalendarAlt /> <span>{booking.date}</span>
      </div>
      <p className="text-xs mt-2 text-gray-400">
        Booked on {new Date(booking.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
