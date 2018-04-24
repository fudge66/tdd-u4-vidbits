const {assert} = require('chai')
const { buildVideoObject, populateVideoFormAndSubmit } = require('../test-utils')

describe('Updating a video', () => {
  it('changes the values', () => {
    const video = buildVideoObject({ title: 'Original title' })
    const newTitle = 'A great new title'

    // /videos/create
    populateVideoFormAndSubmit(video)

    // redirected to /videos/show
    browser.click('#edit-button')

    // redirected to /videos/edit
    browser.setValue('input#title', newTitle)
    browser.submitForm('#edit-video-form')

    // redirected back to /videos/show
    assert.equal(browser.getText('h1'), newTitle)
  })

  it('does not create an additional Video', () => {
    const originalTitle = 'Original title'
    const newTitle = 'A great new title'
    const video = buildVideoObject({ title: originalTitle })

    // /videos/create
    populateVideoFormAndSubmit(video)

    // redirected to /videos/show
    browser.click('#edit-button')

    // redirected to /videos/edit
    browser.setValue('input#title', newTitle)
    browser.submitForm('#edit-video-form')

    // redirected back to /videos/show
    browser.url('/')

    assert.notInclude(browser.getText("#videos-container"), originalTitle)
  })
})