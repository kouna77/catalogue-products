require('dotenv/config')
var Database = require('../database/db')
var db = new Database({
  host     : process.env.VUE_APP_HOST,
  user     : process.env.VUE_APP_USER,
  password : process.env.VUE_APP_PASSWORD,
  database : process.env.VUE_APP_DATABASE
})

const express=require('express')
const router=express.Router()
const TYPE_ERROR = 'error'
const TYPE_SUCCESS = 'success'

router.get('/', (req, res) => {
  db.query('SELECT * FROM stocks', [])
    .then(results => {
      res.json({
        type: TYPE_SUCCESS,
        message: '',
        data: results
      })
    })
    .catch(error => {
      res.json({
        type: TYPE_ERROR,
        message: 'Error while querying stocks from DB. ' + error.message,
        data: error
      })
    })
})


router.get('/:id', (req, res) => {
  db.query('SELECT * FROM stocks where id=?', [req.params.id])
    .then(results => {
      if(results.length == 0){
        res.status(404).json({
          type: TYPE_ERROR,
          message: 'No stock found with id:' + req.params.id ,
          data: {}
        })
        return false;
      }
      res.json({
        type: TYPE_SUCCESS,
        message: '',
        data: results[0]
      })
    })
    .catch(error => {
      res.status(400).json({
        type: TYPE_ERROR,
        message: 'Error while querying stocks from DB. ' + error.message,
        data: error
      })
    })
})


router.post('/', async (req,res) => {
  var denree = null
  try {
    var results = await db.query('select * from denrees where id_denree = ?',[req.body.id_denree])
    denree = results[0]
    if(!denree) {
      res.status(404)
        .json ({
          type:TYPE_ERROR,
          message:'No denree found with id'+ ' '+ req.body.id_denree,
          data:{}
        })
      return false
    }

  }catch (error) {
    res.status(400)
      .json ({
        type:TYPE_ERROR,
        message:'Error while quering denree from DB'+error.message,
        data:error.message
      })
    return false
  }

  let params = [req.body.date,req.body.quantite_entree,req.body.quantite_sortie,req.body.nom,req.body.prenom,req.body.cni,req.body.telephone,denree.id_denree];
  db.query('INSERT INTO stocks (date, quantite_entree, quantite_sortie, nom, prenom, cni, telephone, id_denree) values(?,?,?,?,?,?,?,?)',params)
    .then(results => {
      res.json({
        type:TYPE_SUCCESS,
        message:'',
        data: {
          id: results.insertId,
          date: req.body.date,
          quantite_entree: req.body.quantite_entree,
          quantite_sortie: req.body.quantite_sortie,
          nom: req.body.nom,
          prenom: req.body.prenom,
          cni: req.body.cni,
          telephone: req.body.telephone,
          id_denree: denree.id_denree
        }
      })

    })
    .catch(error => {
      res.status(400).json({
        type:TYPE_ERROR,
        message:'Error while inserting stocks' + error.message,
        data:error

      })
    })
})

router.put('/:id', async (req,res) => {
  var denree = null
  var stock = null
  try {
    var results = await db.query('select * from denrees where id_denree = ?',[req.body.id_denree])
    denree = results[0]
    if(!denree) {
      res.status(404)
        .json ({
          type:TYPE_ERROR,
          message:'No denree found with id: '+ req.body.id_denree,
          data:{}
        })
      return false
    }

  }catch (error) {
    res.status(400)
      .json ({
        type:TYPE_ERROR,
        message:'Error while quering denree from DB'+error.message,
        data:error.message
      })
    return false
  }

  try {
    var results = await db.query('SELECT * FROM stocks where id = ?', [req.params.id])
    stock = results[0]
    if (!stock) {
      res.status(404)
        .json({
          type: TYPE_ERROR,
          message: 'No stock found with id: ' + req.params.id,
          data: {}
        })
      return false
    }
  } catch (error) {
    res.status(400)
      .json({
        type: TYPE_ERROR,
        message: error.message,
        data: {}
      })
    return false
  }
  let params = [req.body.date,req.body.quantite_entree,req.body.quantite_sortie,req.body.nom,req.body.prenom,req.body.cni,req.body.telephone,denree.id_denree,req.params.id]
  db.query('UPDATE stocks set date = ?, quantite_entree = ?, quantite_sortie = ?, nom = ?, prenom = ?, cni = ?, telephone = ?, id_denree = ? where id = ? ', params)
    .then(results => {
      res.json({
        type:TYPE_SUCCESS,
        message:'',
        data: {
          id: req.params.id,
          date: req.body.date,
          quantite_entree: req.body.quantite_entree,
          quantite_sortie: req.body.quantite_sortie,
          nom: req.body.nom,
          prenom: req.body.prenom,
          cni: req.body.cni,
          telephone: req.body.telephone,
          id_denree: denree.id_denree
        }
      })
    })
    .catch(error => {
      res.status(400)
        .json({
          type:TYPE_ERROR,
          message:'Error while updating stock with id :'+req.body.id + error.message,
          data:error

        })
    })
})

router.delete('/:id', async (req,res) => {
  var stock = null
  try {
    var results = await db.query('SELECT * FROM stocks where id = ?', [req.params.id])
    stock = results[0]
    if (!stock) {
      res.status(404)
        .json({
          type: TYPE_ERROR,
          message: 'No stock found with id: ' + req.params.id,
          data: {}
        })
      return false
    }
  } catch (error) {
    res.status(400)
      .json({
        type: TYPE_ERROR,
        message: error.message,
        data: {}
      })
    return false
  }

  let params=[req.params.id];
  db.query('DELETE FROM stocks where id=?', params)
    .then(results => {
      res.json({
        type:TYPE_SUCCESS,
        message:'Stock with id ' + req.params.id + ' deleted.',
        data: {}
      })
    })
    .catch(error => {
      res.status(400)
        .json({
          type:TYPE_ERROR,
          message:'Error while deleting stock with id :'+req.params.id + error.message,
          data:error

        })
    })
})

module.exports=router
