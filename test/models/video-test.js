const { assert } = require('chai')
const Video = require('../../models/video') 
const { connectDatabaseAndDropData, disconnectDatabase } = require('../database-utils')

describe('Video model', () => {
  beforeEach(connectDatabaseAndDropData)
  afterEach(disconnectDatabase)

  it('has a title that is a String', () => {
    const notAString = 1

    const video = new Video({ title: notAString })

    assert.strictEqual(video.title, notAString.toString())
  })

  it('has a description that is a String', () => {
    const notAString = 1

    const video = new Video({ description: notAString })

    assert.strictEqual(video.description, notAString.toString())
  })

  it('has a URL that is a String', () => {
    const notAString = 1

    const video = new Video({ url: notAString })

    assert.strictEqual(video.url, notAString.toString())
  })
})
