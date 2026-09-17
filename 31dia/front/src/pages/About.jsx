
const About = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">About This App</h1>
        <p className="text-lg text-gray-600 mb-8">This application is built using React and Tailwind CSS. It serves as a simple example of a modern web application.</p>
        <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300">
            Learn More
        </button>
    </div>
  );
}

export default About