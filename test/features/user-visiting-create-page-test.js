const {assert} = require('chai')
const { buildVideoObject, populateVideoFormAndSubmit } = require('../test-utils')

describe('Server path: videos/create', () => {
  describe('Fill out form and submit video', () => {
    it('shows the new video', () => {
      const video = buildVideoObject()
      populateVideoFormAndSubmit(video)
      
      assert.include(browser.getText('body'), video.title)
      assert.include(browser.getText('body'), video.description)
      assert.include(browser.getAttribute('iframe.video-player', 'src'), video.url)
    })
  })
})