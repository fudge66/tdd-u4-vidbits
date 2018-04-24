const { assert } = require('chai')
const request = require('supertest')
const { jsdom } = require('jsdom')

const app = require('../../app')
const Video = require('../../models/video')

const { connectDatabaseAndDropData, disconnectDatabase } = require('../database-utils')
const { buildVideoObject, parseTextFromHTML, parseAttributeFromHTML,  
        seedVideoToDatabase, postVideoWithoutTitle } = require('../test-utils')

describe('GET /videos', () => {
  beforeEach(connectDatabaseAndDropData)
  afterEach(disconnectDatabase)

  it('renders existing videos', async () => {
    const video = await seedVideoToDatabase()

    const response = await request(app)
      .get('/videos')

    assert.include(parseTextFromHTML(response.text, '.video-title'), video.title)
  })
})

describe('POST /videos', () => {
  beforeEach(connectDatabaseAndDropData)
  afterEach(disconnectDatabase)

  it('saves the video in the database', async () => {
    const videoToCreate = buildVideoObject()
    
    const response = await request(app)
      .post('/videos')
      .type('form')
      .send(videoToCreate)
    
    const video = await Video.findOne(videoToCreate)

    assert.strictEqual(video.title, videoToCreate.title)
    assert.strictEqual(video.description, videoToCreate.description)
    assert.strictEqual(video.url, videoToCreate.url)
  })

  it(`redirects to the new Video's page`, async () => {
    const video = buildVideoObject()

    const response = await request(app)
      .post('/videos')
      .type('form')
      .send(video)

    assert.equal(response.status, 302)
  })

  describe('when the title is missing', () => {
    it('does not save the video', async () => {
      const response = await postVideoWithoutTitle()

      const videos = await Video.find()

      assert.equal(videos.length, 0)
    })

    it('sends status 400', async () => {
      const response = await postVideoWithoutTitle()

      assert.equal(response.status, 400)
    })

    it('renders the form to add a video', async () => {
      const response = await postVideoWithoutTitle()

      assert.include(parseTextFromHTML(response.text, 'h1'), 'Save a video')
    })

    it('renders the validation error message', async () => {
      const response = await postVideoWithoutTitle()

      assert.include(parseTextFromHTML(response.text, 'body'), 'Title is required')
    })

    it('preserves the description', async () => {
      const response = await postVideoWithoutTitle()

      assert.include(parseTextFromHTML(response.text, 'body'), 'Best video ever!')
    })
  })
})

describe('GET /videos/:id', () => {
  beforeEach(connectDatabaseAndDropData)
  afterEach(disconnectDatabase)

  it('renders the Video', async () => {
    const video = await seedVideoToDatabase()

    const response = await request(app)
      .get(`/videos/${video._id}`)

    assert.include(parseTextFromHTML(response.text, 'h1'), video.title)
    assert.include(parseAttributeFromHTML(response.text, 'iframe.video-player', 'src'), video.url)
  })
})

describe('GET /videos/:id/edit', () => {
  beforeEach(connectDatabaseAndDropData)
  afterEach(disconnectDatabase)

  it('renders the Edit form for the Video', async () => {
    const video = await seedVideoToDatabase()

    const response = await request(app)
      .get(`/videos/${video._id}/edit`)

    assert.include(parseAttributeFromHTML(response.text, 'input#title', 'value'), video.title)
    assert.include(parseTextFromHTML(response.text, 'textarea#description'), video.description)
    assert.include(parseAttributeFromHTML(response.text, 'input#url', 'value'), video.url)
  })
})

describe('POST /videos/:id/updates', () => {
  beforeEach(connectDatabaseAndDropData)
  afterEach(disconnectDatabase)

  describe('when the new values are valid', () => {
    it('updates the Video', async () => {
    const videoToUpdate = await seedVideoToDatabase()
    const updatedVideo = buildVideoObject({ title: 'Updated title' })
 
    const response = await request(app)
      .post(`/videos/${videoToUpdate._id}/updates`)
      .type('form')
      .send(updatedVideo)

    const response2 = await request(app)
      .get(`/videos/${videoToUpdate._id}`)

    assert.include(parseTextFromHTML(response2.text, 'h1'), updatedVideo.title)
    })

    it('redirects to the show page after updating', async () => {
      const videoToUpdate = await seedVideoToDatabase()
      const updatedVideo = buildVideoObject({ title: 'Updated title' })
  
      const response = await request(app)
        .post(`/videos/${videoToUpdate._id}/updates`)
        .type('form')
        .send(updatedVideo)

      assert.equal(response.status, 302)
      assert.equal(response.headers.location, `/videos/${videoToUpdate._id}`)
    })
  })
  
  describe('when the new values are invalid', () => {
    it('does not save updates', async () => {
      const videoToUpdate = await seedVideoToDatabase()
      const invalidValues = { title: 1, description: [], url: '' }
  
      const response = await request(app)
        .post(`/videos/${videoToUpdate._id}/updates`)
        .type('form')
        .send(invalidValues)

      const response2 = await request(app)
        .get(`/videos/${videoToUpdate._id}`)

      assert.include(parseTextFromHTML(response2.text, 'h1'), videoToUpdate.title)
      assert.include(parseTextFromHTML(response2.text, 'div.video-description'), videoToUpdate.description)
      assert.include(parseAttributeFromHTML(response2.text, 'iframe.video-player', 'src'), videoToUpdate.url)
    })

    it('responds with status 400', async () => {
      const videoToUpdate = await seedVideoToDatabase()
      const invalidValues = { title: 1, description: [], url: '' }
  
      const response = await request(app)
        .post(`/videos/${videoToUpdate._id}/updates`)
        .type('form')
        .send(invalidValues)

      assert.equal(response.status, 400)
    })

    it('renders the Edit form', async () => {
      const videoToUpdate = await seedVideoToDatabase()
      const invalidValues = { title: 1, description: [], url: '' }
  
      const response = await request(app)
        .post(`/videos/${videoToUpdate._id}/updates`)
        .type('form')
        .send(invalidValues)

      assert.include(parseTextFromHTML(response.text, 'h1'), 'Edit a video')
    })
  })
})