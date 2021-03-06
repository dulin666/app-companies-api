const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
// const passport = require('passport')
const User = require('../models/user')

const passGenCount = 10

router.get('/register', (req, res, next) => {
  User.find({}).then((users) => {
    res.send(users)
  })
})

router.post('/register', (req, res, next) => {
  const name = req.body.name
  const email = req.body.email
  const password = req.body.password

  req.checkBody('name', 'Name is required').notEmpty()
  req.checkBody('email', 'Email is required').notEmpty()
  req.checkBody('email', 'Email is not valid').isEmail()
  req.checkBody('password', 'Password is required').notEmpty()
  req.checkBody('passwordSecond', 'Password do not match').equals(req.body.password)

  let err = req.validationErrors()

  if (err) {
    res.render('register', {
      errors: err
    })
  } else {
    let newUser = new User({
      name: name,
      email: email,
      password: password
    })

    bcrypt.genSalt(passGenCount, (err, salt) => {
      if (err) {
        console.error(err)
      }
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) {
          console.error(err)
        }
        newUser.password = hash
        newUser.save((err) => {
          if (err) {
            console.error(err)
            return
          } else {
            res.send(newUser)
          }
        })
      })
    })
  }
})

module.exports = router
