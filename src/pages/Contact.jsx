import React from 'react';

const Contact = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white dark:bg-gray-900 shadow-lg rounded-2xl">
      <h2 className="text-3xl font-bold text-center text-orange-600 dark:text-orange-400 mb-6">
        Contact Us
      </h2>
      <p className="text-center text-gray-700 dark:text-gray-300 mb-8">
        Have any questions, suggestions, or feedback? Feel free to reach out!
      </p>

      <div className="text-lg space-y-4 text-gray-800 dark:text-gray-200">
        <div>
          <strong>Name:</strong> Satyam Pandey
        </div>
        <div>
          <strong>Email:</strong>{' '}
          <a
            href="mailto:pandeysatyam1708@gmail.com"
            className="text-orange-600 hover:underline"
          >
            pandeysatyam1708@gmail.com
          </a>
        </div>
        <div>
          <strong>Phone:</strong>{' '}
          <a href="tel:8303081204" className="text-orange-600 hover:underline">
            +91 8303081204
          </a>
        </div>
        <div>
          <strong>LinkedIn:</strong>{' '}
          <a
            href="https://www.linkedin.com/in/satyam-pandey-se/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 hover:underline"
          >
            linkedin.com/in/satyam-pandey-se
          </a>
        </div>
        <div>
          <strong>Portfolio:</strong>{' '}
          <a
            href="https://satyam-pandey.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 hover:underline"
          >
            satyam-pandey.vercel.app
          </a>
        </div>
        <div>
          <strong>GitHub:</strong>{' '}
          <a
            href="https://github.com/satyam1708"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 hover:underline"
          >
            github.com/satyam1708
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
