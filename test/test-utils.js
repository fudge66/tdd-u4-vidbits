const { jsdom } = require('jsdom')
const request = require('supertest')

const app = require('../app')
const Video = require('../models/video')

// Create and return a sample Video object
const buildVideoObject = (options = {}) => {
  const title = options.title || 'My favorite video'
  const description = options.description || 'Just the best video'
  const url = options.url || 'https://www.youtube.com/watch?v=KbYFW38XzK8'
  return { title, description, url }
}

// Add a sample Video object to mongodb
const seedVideoToDatabase = async (options = {}) => {
  const video = await Video.create(buildVideoObject(options))
  return video
}

// Extract text from an Element by selector.
const parseTextFromHTML = (htmlAsString, selector) => {
  const selectedElement = jsdom(htmlAsString).querySelector(selector)
  if (selectedElement !== null) {
    return selectedElement.textContent
  } else {
    throw new Error(`No element with selector ${selector} found in HTML string`)
  }
}

// Extract attribute from an Element by selector.
const parseAttributeFromHTML = (htmlAsString, selector, attribute) => {
  const selectedElement = jsdom(htmlAsString).querySelector(selector)
  if (selectedElement !== null) {
    return selectedElement.getAttribute(attribute)
  } else {
    throw new Error(`No element with selector ${selector} found in HTML string`)
  }
}

// Post a video without a title
const postVideoWithoutTitle = async () => {
  const video = { title: '', description: 'Best video ever!' }

  const response = await request(app)
    .post('/videos')
    .type('form')
    .send(video)
  
  return response
}

//
const populateVideoFormAndSubmit = (video) => {
  browser.url('/videos/create')
  browser.setValue('input#title', video.title)
  browser.setValue('textarea#description', video.description)
  browser.setValue('input#url', video.url)
  browser.submitForm('#add-video-form')
  return
}


// Generate a random URL
const generateRandomUrl = (domain) => {
  return `http://${domain}/${Math.floor(Math.random() * 10000)}`
}

module.exports = {
  buildVideoObject,
  seedVideoToDatabase,
  parseTextFromHTML,
  parseAttributeFromHTML,
  postVideoWithoutTitle,
  populateVideoFormAndSubmit,
  generateRandomUrl
}