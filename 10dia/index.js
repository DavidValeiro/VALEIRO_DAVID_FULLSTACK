const express = require('express');
const app = express();
const port = 3000;
const personRoutes = require('./routes/persons');
const classroomRoutes = require('./routes/classrooms');

app.use(express.json());

app.use('/persons', personRoutes);
app.use('/classrooms', classroomRoutes);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


