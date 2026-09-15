

const ExerciseCard = ({ title, exercise }) => {
    return (
        <div className="bg-white rounded-lg shadow-xl p-4 w-md">
            <h2 className="text-2xl font-semibold mb-2 border w-10 h-10 aspect-square rounded-full flex items-center justify-center text-center p-2 shadow-lg hover:bg-blue-200">{title}</h2>
            <div className="text-gray-700">{exercise}</div>
        </div>
    );
}

export default ExerciseCard;