const express =require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const PORT = 3000;
const connection = require('./db');
//Middlware
app.use(cors());
app.use(express.json());

app.get('/api/alums', (req, res)=>{
    const sql = 'SELECT *FROM alumno';
    connection.query(sql,(err, results)=>{
        if(err){
            console.log('Error en la consulta de alumnos',err);
            return res.status(500).send('Error del servidor');
        }else{
            res.status(200).send(results);
        }
    });
});
app.post('/api/alums', (req, res) => {
    const { nombres, apellidos } = req.body;
    const query = 'INSERT INTO alumno (nombres, apellidos) VALUES (?, ?)';
    
    connection.query(query, [nombres, apellidos], (err, results) => {
      if (err) {
        console.error('Error al insertar alumno:', err);
        return res.status(500).send('Error en el servidor');
      }
      res.status(201).send({ nombres, apellidos});
    });
  });

  // Actualizar (PUT)
app.put('/api/alums/:id', (req, res) => {
    const { id } = req.params;
    const { nombres, apellidos } = req.body;
    const query = 'UPDATE alumno SET nombres = ?, apellidos = ? WHERE idalumno = ?';
    
    connection.query(query, [nombres, apellidos, id], (err, results) => {
      if (err) {
        console.error('Error al actualizar alumno:', err);
        return res.status(500).send('Error en el servidor');
      }
      if (results.affectedRows === 0) {
        return res.status(404).send('Alumno no encontrado');
      }
      res.status(200).send({ id, nombres, apellidos });
    });
  });
  
  app.delete('/api/alums/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM alumno WHERE idalumno = ?';
    
    connection.query(query, [id], (err, results) => {
      if (err) {
        console.error('Error al eliminar alumno:', err);
        return res.status(500).send('Error en el servidor');
      }
      if (results.affectedRows === 0) {
        return res.status(404).send('Alumno no encontrado');
      }
      res.status(200).send('Alumno eliminado');
    });
  });
  

app.listen(PORT, ()=>{
    console.log(PORT);
});
