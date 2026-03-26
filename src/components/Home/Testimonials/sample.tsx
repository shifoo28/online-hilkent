// import { StarIcon } from '@heroicons/react/solid';

const testimonials = [
  {
    name: "Aýlar",
    role: "Serial Entrepreneur",
    quote: "Hilkent made my shopping seamless. Delivery was faster than expected!",
    rating: 5,
    image: "/images/aylar.jpg"
  },
  {
    name: "Merdan",
    role: "Backend Developer",
    quote: "The checkout flow is smooth and intuitive. Highly recommend!",
    rating: 4,
    image: "/images/merdan.jpg"
  }
];

export default function Testimonials() {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <h2 className="text-2xl font-bold text-center mb-8">What Our Customers Say</h2>
      <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory">
        {testimonials.map((t, idx) => (
          <div key={idx} className="min-w-[280px] snap-center shadow-md rounded-lg p-6 bg-white dark:bg-gray-800">
            <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full mb-4" />
            <h3 className="font-semibold">{t.name}</h3>
            <p className="text-sm text-gray-500">{t.role}</p>
            <div className="flex mt-2">
              {[...Array(t.rating)].map((_, i) => (
                // <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                <></>
              ))}
            </div>
            <p className="mt-4 text-gray-700 dark:text-gray-300">"{t.quote}"</p>
          </div>
        ))}
      </div>
    </section>
  );
}
