const Task = ({info}) => {
  return (
    <div>
        <h2>{info.completed ? "Completed" : "Pending"}</h2>
        <p>{info.description}</p>
    </div>
  )
}

export default Task