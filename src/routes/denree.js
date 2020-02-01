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

router.get('/', function (req, res) {
  db.query('SELECT * FROM denrees', [])
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
        message: 'Error while querying denrees from DB. ' + error.message,
        data: error
      })
    })
})


router.get('/:id',function (req, res) {
  db.query('SELECT * FROM denrees where id_denree=?', [req.params.id])
    .then(results => {
      if(results.length == 0){
        res.status(404).json({
          type: TYPE_ERROR,
          message: 'No denree with id:' + req.params.id ,
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
        message: 'Error while querying denrees from DB. ' + error.message,
        data: error
      })
    })
})


router.post('/', async function(req,res){
  let params=[req.body.libelle];
  db.query('INSERT INTO denrees (libelle) values(?)',params)
    .then(results => {
      res.json({
        type:TYPE_SUCCESS,
        message:'',
        data: {
          id: results.insertId,
          libelle: req.body.libelle
        }
      })

    })
    .catch(error => {
      res.status(400).json({
        type:TYPE_ERROR,
        message:'Error while inserting denree' + error.message,
        data:error

      })
    })
})


router.put('/:id',async function(req,res){
  try {
    var results = await db.query('SELECT id_denree FROM denrees where id_denree = ?', [req.params.id])
    if (results.length == 0) {
      res.status(404)
        .json({
          type: TYPE_ERROR,
          message: 'No denree with id: ' + req.params.id,
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
  let params=[req.body.libelle, req.params.id];
  db.query('UPDATE denrees set libelle = ? where id_denree=?', params)
    .then(results => {
      res.json({
        type:TYPE_SUCCESS,
        message:'',
        data: {
          id_denree: req.params.id,
          libelle: req.body.libelle
        }
      })
    })
    .catch(error => {
      res.status(400)
        .json({
          type:TYPE_ERROR,
          message:'Error while updating user with id :'+req.body.id + error.message,
          data:error

        })
    })
})

router.delete('/:id',async function(req,res){
  var denree = null
  try {
    var results = await db.query('SELECT * FROM denrees where id_denree = ?', [req.params.id])
    denree = results[0]
    if (!denree) {
      res.status(404)
        .json({
          type: TYPE_ERROR,
          message: 'No denree with id: ' + req.params.id,
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
  // suppression des stocks de denrees
  await db.query('DELETE FROM stocks where id_denree = ?',[denree.id_denree])
    .then(results => {
      res.json({
        type:TYPE_SUCCESS,
        message:'Stock with id ' + denree.id_denree + ' deleted.',
        data: {}
      })
      return false
    })
    .catch(error => {
      res.status(400)
        .json({
          type:TYPE_ERROR,
          message:'Error while deleting stock with denree_id:'+denree.id_denree + error.message,
          data:error
        })
      return false
    })
})

module.exports=router
