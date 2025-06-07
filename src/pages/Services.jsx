import React from 'react';

const Services = () => {
  return (
    <section className="max-w-5xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-extrabold text-center text-orange-600 mb-6">
        Our Services
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto text-base">
        At <span className="font-semibold text-orange-600">TheSarvaNews</span>, we deliver timely, accurate, and accessible news that matters.
      </p>

      <div className="grid gap-8 md:grid-cols-3">
        <ServiceCard
          icon="📰"
          title="Top Headlines"
          description="Curated breaking news from trusted sources."
        />
        <ServiceCard
          icon="📅"
          title="Date Filtering"
          description="Filter news by any date range."
        />
        <ServiceCard
          icon="🌐"
          title="Multi-language"
          description="News in Hindi, English & more."
        />
        <ServiceCard
          icon="📂"
          title="Categories"
          description="Business, Tech, Sports & more."
        />
        <ServiceCard
          icon="⚡"
          title="Real-time"
          description="Instant updates on breaking news."
        />
        <ServiceCard
          icon="✨"
          title="User-friendly"
          description="Clean, easy-to-navigate design."
        />
      </div>

      <p className="mt-12 text-center text-gray-600 dark:text-gray-400 text-sm italic">
        Crafted by <span className="font-semibold text-orange-600">Satyam Pandey</span>.
      </p>
    </section>
  );
};

const ServiceCard = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300 flex flex-col items-start gap-2">
    <div className="text-3xl">{icon}</div>
    <h3 className="text-xl font-semibold text-orange-600">{title}</h3>
    <p className="text-gray-700 dark:text-gray-300 text-sm">{description}</p>
  </div>
);

export default Services;
