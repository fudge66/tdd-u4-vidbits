const {assert} = require('chai')
const { buildVideoObject, populateVideoFormAndSubmit } = require('../test-utils')

describe('Deleting a Video', () => {
  it('removes it from the list', async () => {
    const video = buildVideoObject()
    populateVideoFormAndSubmit(video)

    // redirected to /videos/show
    browser.click('#delete-button')

    // redirected to /
    assert.notInclude(browser.getText("#videos-container"), video.title )
  })
})