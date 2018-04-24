const router = require('express').Router();
const Video = require('../models/video')

// This router's root is '/videos'

router.get('/', async (req, res) => {
  const videos = await Video.find()
  res.render('videos/index', { videos })
})

router.post('/', async (req, res, next) => {
  const { title, description, url } = req.body
  const newVideo = new Video({ title, description, url })

  newVideo.validateSync()

  if (newVideo.errors) {
    return res.status(400).render('videos/create', { newVideo })
  } else {
    try {
      const video = await newVideo.save()
      res.status(201).redirect(`/videos/${video._id}`)
    } catch (e) {
      next(e + e.stack)
    }
  }
})

router.get('/create', (req, res) => {
  res.render('videos/create')
})

router.get('/:id', async (req, res) => {
  const video = await Video.findById(req.params.id)

  if (!video) {
    res.sendStatus(404)
  } else {
    res.render('videos/show', { video })
  }
})

router.get('/:id/edit', async (req, res) => {
  const video = await Video.findById(req.params.id)

  if (!video) {
    res.sendStatus(404)
  } else {
    res.render('videos/edit', { video })
  }
})

router.post('/:id/updates', async (req, res) => {
  const video = await Video.findById(req.params.id)
  const { title, description, url } = req.body

  // assign and test user input for validation errors
  video.title = title
  video.description = description
  video.url = url

  video.validateSync()

  if (video.errors) {
    res.status(400).render('videos/edit', { video })
  } else {
    await video.save()
    res.redirect(`/videos/${video._id}`)
  }
})

router.post('/:id/deletions', async (req, res) => {
  const video = await Video.findById(req.params.id)

  if (!video) {
    res.status(500).render('videos/index')
  } else {
    await Video.findByIdAndRemove(req.params.id)
    res.status(204).redirect('/')
  }
})

module.exports = router;