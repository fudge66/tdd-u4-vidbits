const {assert} = require('chai')
const { buildVideoObject, populateVideoFormAndSubmit } = require('../test-utils')

describe('Server path: /', () => {
  describe('When no videos exist', () => {
    it('videos-container is empty', () => {
      browser.url('/')

      assert.equal(browser.getText('#videos-container'), '')
    })
  })

  describe('Existing videos', () => {
    it('are displayed', () => {
      const video = buildVideoObject()
      populateVideoFormAndSubmit(video)
      
      browser.url('/')

      assert.include(browser.getText('#videos-container'), video.title)
      assert.include(browser.getText('#videos-container'), video.description)
      assert.include(browser.getAttribute('iframe.video-player', 'src'), video.url)
    })

    it('can be navigated to individually', () => {
      const video = buildVideoObject()
      populateVideoFormAndSubmit(video)

      browser.url('/')
      browser.click('.video-title a')

      assert.equal(browser.getText('h1'), video.title)
    })
  })
  
  describe('Navigate to create page', () => {
    it('contains the text "Save a video"', () => {
      browser.url('/')
      browser.click('#create-page-link')

      assert.include(browser.getText('body'), 'Save a video')
    })
  })
})